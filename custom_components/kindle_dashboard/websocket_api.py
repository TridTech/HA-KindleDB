"""WebSocket API for Kindle Dashboard panel."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

from .const import (
    CONF_LOCATION_NAME,
    CONF_SCENES,
    CONF_STATS,
    CONF_TOGGLES,
    DOMAIN,
)


@callback
def async_setup(hass: HomeAssistant) -> None:
    """Register WebSocket commands."""
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_get_entities)


# ── GET CONFIG ──────────────────────────────────────────────────────────────

@websocket_api.websocket_command({"type": f"{DOMAIN}/get_config"})
@websocket_api.async_response
async def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the current dashboard configuration."""
    entry = _get_entry(hass)
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Integration not set up")
        return

    # Merge base data + options (options override base data)
    data = {**entry.data, **entry.options}
    connection.send_result(msg["id"], data)


# ── SAVE CONFIG ─────────────────────────────────────────────────────────────

@websocket_api.websocket_command(
    {
        "type": f"{DOMAIN}/save_config",
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def ws_save_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save updated dashboard configuration to the config entry options."""
    entry = _get_entry(hass)
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Integration not set up")
        return

    new_config = msg["config"]
    allowed_keys = {CONF_LOCATION_NAME, CONF_SCENES, CONF_TOGGLES, CONF_STATS, "kindle_token"}
    filtered = {k: v for k, v in new_config.items() if k in allowed_keys}

    hass.config_entries.async_update_entry(entry, options={**entry.options, **filtered})
    connection.send_result(msg["id"], {"success": True})


# ── GET ENTITIES ─────────────────────────────────────────────────────────────

@websocket_api.websocket_command(
    {
        "type": f"{DOMAIN}/get_entities",
        vol.Optional("domains"): [str],
    }
)
@websocket_api.async_response
async def ws_get_entities(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return entities filtered by domain for the config UI pickers."""
    domains = msg.get("domains") or ["light", "switch", "scene", "sensor", "input_boolean"]
    entities = []
    for state in hass.states.async_all():
        domain = state.entity_id.split(".")[0]
        if domain in domains:
            entities.append(
                {
                    "entity_id": state.entity_id,
                    "name": state.attributes.get("friendly_name", state.entity_id),
                    "domain": domain,
                    "state": state.state,
                }
            )
    entities.sort(key=lambda e: (e["domain"], e["name"].lower()))
    connection.send_result(msg["id"], {"entities": entities})


# ── HELPER ───────────────────────────────────────────────────────────────────

def _get_entry(hass: HomeAssistant) -> ConfigEntry | None:
    entries = hass.config_entries.async_entries(DOMAIN)
    return entries[0] if entries else None
