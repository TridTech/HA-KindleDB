"""WebSocket API for Kindle Dashboard panel."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

from .const import (
    CONF_LOCATION_NAME,
    CONF_SECTIONS,
    CONF_FONT,
    CONF_INLINE_UNITS,
    DOMAIN,
)


@callback
def async_setup(hass: HomeAssistant) -> None:
    """Register WebSocket commands."""
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_get_entities)


@websocket_api.websocket_command({"type": f"{DOMAIN}/get_config"})
@websocket_api.async_response
async def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry = _get_entry(hass)
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Integration not set up")
        return
    data = {**entry.data, **entry.options}
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {"type": f"{DOMAIN}/save_config", vol.Required("config"): dict}
)
@websocket_api.async_response
async def ws_save_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    entry = _get_entry(hass)
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Integration not set up")
        return
    allowed_keys = {
        CONF_LOCATION_NAME, CONF_SECTIONS, CONF_FONT, CONF_INLINE_UNITS,
        "kindle_token",
    }
    filtered = {k: v for k, v in msg["config"].items() if k in allowed_keys}
    hass.config_entries.async_update_entry(entry, options={**entry.options, **filtered})
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {"type": f"{DOMAIN}/get_entities", vol.Optional("domains"): [str]}
)
@websocket_api.async_response
async def ws_get_entities(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    domains = msg.get("domains") or ["light", "switch", "scene", "sensor", "input_boolean"]
    entities = []
    for state in hass.states.async_all():
        domain = state.entity_id.split(".")[0]
        if domain in domains:
            entities.append({
                "entity_id": state.entity_id,
                "name": state.attributes.get("friendly_name", state.entity_id),
                "domain": domain,
                "state": state.state,
            })
    entities.sort(key=lambda e: (e["domain"], e["name"].lower()))
    connection.send_result(msg["id"], {"entities": entities})


def _get_entry(hass: HomeAssistant) -> ConfigEntry | None:
    entries = hass.config_entries.async_entries(DOMAIN)
    return entries[0] if entries else None
