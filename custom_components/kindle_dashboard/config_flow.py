"""Config flow for Kindle Dashboard."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    CONF_DASHBOARD_NAME,
    CONF_LOCATION_NAME,
    CONF_SECTIONS,
    DEFAULT_LOCATION_NAME,
    DEFAULT_SECTIONS,
    DOMAIN,
)


class KindleDashboardConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Kindle Dashboard.

    Multiple instances are allowed — each is a separate dashboard.
    """

    VERSION = 3

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Ask for a dashboard name and optional location name."""
        errors: dict[str, str] = {}

        if user_input is not None:
            dashboard_name = user_input.get(CONF_DASHBOARD_NAME, "Kindle Dashboard").strip()
            if not dashboard_name:
                errors[CONF_DASHBOARD_NAME] = "required"
            else:
                return self.async_create_entry(
                    title=dashboard_name,
                    data={
                        CONF_DASHBOARD_NAME: dashboard_name,
                        CONF_LOCATION_NAME:  user_input.get(CONF_LOCATION_NAME, DEFAULT_LOCATION_NAME),
                        CONF_SECTIONS:       DEFAULT_SECTIONS,
                    },
                )

        return self.async_show_form(
            step_id="user",
            errors=errors,
            data_schema=vol.Schema({
                vol.Required(CONF_DASHBOARD_NAME, default="Kindle Dashboard"): str,
                vol.Optional(CONF_LOCATION_NAME,  default=DEFAULT_LOCATION_NAME): str,
            }),
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: config_entries.ConfigEntry) -> OptionsFlow:
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
        )
