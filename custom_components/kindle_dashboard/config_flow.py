"""Config flow for Kindle Dashboard."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    CONF_LOCATION_NAME,
    CONF_SECTIONS,
    DEFAULT_LOCATION_NAME,
    DEFAULT_SECTIONS,
    DOMAIN,
)


class KindleDashboardConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Kindle Dashboard."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Single setup step — just ask for a location name."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(
                title="Kindle Dashboard",
                data={
                    CONF_LOCATION_NAME: user_input.get(CONF_LOCATION_NAME, DEFAULT_LOCATION_NAME),
                    CONF_SECTIONS: DEFAULT_SECTIONS,
                },
            )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Optional(CONF_LOCATION_NAME, default=DEFAULT_LOCATION_NAME): str,
            }),
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: config_entries.ConfigEntry) -> OptionsFlow:
        """Return the options flow."""
        return OptionsFlow(config_entry)


class OptionsFlow(config_entries.OptionsFlow):
    """Minimal options flow — real config lives in the sidebar panel."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title="",
                data={CONF_LOCATION_NAME: user_input.get(CONF_LOCATION_NAME, DEFAULT_LOCATION_NAME)},
            )

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Optional(
                    CONF_LOCATION_NAME,
                    default=self.config_entry.data.get(CONF_LOCATION_NAME, DEFAULT_LOCATION_NAME),
                ): str,
            }),
            description_placeholders={"panel_url": "/kindle_dashboard"},
        )
