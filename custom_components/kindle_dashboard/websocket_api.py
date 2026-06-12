"""WebSocket API for Kindle Dashboard panel."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

from .const import (
    CONF_FONT,
    CONF_HIDE_ENTITY_NAMES,
    CONF_INLINE_UNITS,
    CONF_LOCATION_NAME,
    CONF_SECTIONS,
    DOMAIN,
)

ALLOWED_KEYS = {
    CONF_LOCATION_NAME,
    CONF_SECTIONS,
    CONF_FONT,
    CONF_INLINE_UNITS,
    CONF_HIDE_ENTITY_NAMES,
    "kindle_token",
    "page_width", "page_height", "page_scale",
    "hard_refresh", "refresh_interval", "show_clock", "show_battery", "theme",
    "label_font_size", "label_bold", "label_italic", "label_underline",
    "sub_font_size",   "sub_bold",   "sub_italic",   "sub_underline",
    "value_font_size", "value_bold", "value_italic", "value_underline",
    "dashboard_name",
}


@callback
def async_setup(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_dashboards)
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_get_entities)
    websocket_api.async_register_command(hass, ws_force_refresh)


# ── LIST ALL DASHBOARDS ──────────────────────────────────────────────────────

@websocket_api.websocket_command({"type": f"{DOMAIN}/get_dashboards"})
@websocket_api.async_response
async def ws_get_dashboards(hass, connection, msg):
    """Return all dashboard config entries with id, title, and location_name."""
    from . import _merged_config
    entries = hass.config_entries.async_entries(DOMAIN)
    dashboards = []
    for e in entries:
        cfg = _merged_config(e)
        dashboards.append({
            "entry_id":     e.entry_id,
            "title":        e.title,
            "location_name": cfg.get(CONF_LOCATION_NAME, "Home"),
        })
    connection.send_result(msg["id"], {"dashboards": dashboards})


# ── GET CONFIG ───────────────────────────────────────────────────────────────

@websocket_api.websocket_command({
    "type": f"{DOMAIN}/get_config",
    vol.Required("entry_id"): str,
})
@websocket_api.async_response
async def ws_get_config(hass, connection, msg):
    from . import _merged_config
    entry = _get_entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Dashboard not found")
        return
    connection.send_result(msg["id"], _merged_config(entry))


# ── SAVE CONFIG ──────────────────────────────────────────────────────────────

@websocket_api.websocket_command({
    "type": f"{DOMAIN}/save_config",
    vol.Required("entry_id"): str,
    vol.Required("config"): dict,
})
@websocket_api.async_response
async def ws_save_config(hass, connection, msg):
    entry = _get_entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Dashboard not found")
        return
    filtered = {k: v for k, v in msg["config"].items() if k in ALLOWED_KEYS}
    # Update the entry title if dashboard_name changed
    new_title = filtered.get("dashboard_name")
    if new_title and new_title != entry.title:
        hass.config_entries.async_update_entry(
            entry, title=new_title,
            options={**entry.options, **filtered}
        )
    else:
        hass.config_entries.async_update_entry(
            entry, options={**entry.options, **filtered}
        )
    connection.send_result(msg["id"], {"success": True})


# ── GET ENTITIES ─────────────────────────────────────────────────────────────

@websocket_api.websocket_command({
    "type": f"{DOMAIN}/get_entities",
    vol.Optional("domains"): [str],
})
@websocket_api.async_response
async def ws_get_entities(hass, connection, msg):
    domains = msg.get("domains") or [
        "light", "switch", "scene", "sensor", "input_boolean",
        "media_player", "fan", "cover", "climate", "lock",
    ]
    entities = []
    for state in hass.states.async_all():
        domain = state.entity_id.split(".")[0]
        if domain in domains:
            entities.append({
                "entity_id": state.entity_id,
                "name":      state.attributes.get("friendly_name", state.entity_id),
                "domain":    domain,
                "state":     state.state,
            })
    entities.sort(key=lambda e: (e["domain"], e["name"].lower()))
    connection.send_result(msg["id"], {"entities": entities})


# ── FORCE REFRESH ────────────────────────────────────────────────────────────

@websocket_api.websocket_command({
    "type": f"{DOMAIN}/force_refresh",
    vol.Required("entry_id"): str,
})
@websocket_api.async_response
async def ws_force_refresh(hass, connection, msg):
    from . import bump_reload_counter
    new_val = bump_reload_counter(hass, msg["entry_id"])
    connection.send_result(msg["id"], {"counter": new_val})


# ── HELPER ───────────────────────────────────────────────────────────────────

def _get_entry(hass: HomeAssistant, entry_id: str) -> ConfigEntry | None:
    for e in hass.config_entries.async_entries(DOMAIN):
        if e.entry_id == entry_id:
            return e
    return None
