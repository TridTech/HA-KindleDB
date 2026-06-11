"""Kindle Dashboard — custom integration for Home Assistant."""
from __future__ import annotations

import json
import logging
import os
from typing import Any

from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_FONT,
    CONF_INLINE_UNITS,
    CONF_LOCATION_NAME,
    CONF_SECTIONS,
    DEFAULT_FONT,
    DEFAULT_INLINE_UNITS,
    DEFAULT_LOCATION_NAME,
    DEFAULT_SECTIONS,
    DOMAIN,
)
from . import websocket_api

_LOGGER = logging.getLogger(__name__)

PANEL_ICON  = "mdi:tablet"
PANEL_TITLE = "Kindle Dashboard"
STATIC_URL  = f"/{DOMAIN}_files"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry

    frontend_path = os.path.join(os.path.dirname(__file__), "frontend")
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, frontend_path, cache_headers=False)]
    )

    if DOMAIN not in hass.data.get("frontend_panels", {}):
        try:
            from homeassistant.components import panel_custom
            await panel_custom.async_register_panel(
                hass,
                webcomponent_name="kindle-dashboard-panel",
                frontend_url_path=DOMAIN,
                sidebar_title=PANEL_TITLE,
                sidebar_icon=PANEL_ICON,
                module_url=f"{STATIC_URL}/panel.js",
                embed_iframe=False,
                require_admin=False,
            )
        except Exception:
            _LOGGER.exception("Failed to register Kindle Dashboard panel")

    websocket_api.async_setup(hass)
    hass.http.register_view(KindleView(hass))
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data[DOMAIN].pop(entry.entry_id, None)
    return True


def _merged_config(entry: ConfigEntry) -> dict:
    base = dict(entry.data)
    base.update(entry.options)
    return base


class KindleView(HomeAssistantView):
    """Serve the Kindle dashboard HTML at /api/kindle_dashboard/kindle.

    Requires ?token=<long-lived-token> in the URL.
    """

    url = "/api/kindle_dashboard/kindle"
    name = "api:kindle_dashboard:kindle"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def get(self, request: Any) -> Any:
        from aiohttp.web import Response

        token = request.rel_url.query.get("token", "").strip()
        if not token:
            return Response(text=_NO_TOKEN_PAGE, content_type="text/html", charset="utf-8")

        entries = self.hass.config_entries.async_entries(DOMAIN)
        if not entries:
            return Response(text="Kindle Dashboard integration is not set up.", status=503)

        cfg          = _merged_config(entries[0])
        location     = cfg.get(CONF_LOCATION_NAME, DEFAULT_LOCATION_NAME)
        sections     = cfg.get(CONF_SECTIONS,      DEFAULT_SECTIONS)
        font         = cfg.get(CONF_FONT,          DEFAULT_FONT)
        inline_units = cfg.get(CONF_INLINE_UNITS,  DEFAULT_INLINE_UNITS)

        template_path = os.path.join(os.path.dirname(__file__), "frontend", "kindle.html")
        with open(template_path, "r", encoding="utf-8") as f:
            html = f.read()

        injected = (
            f"const HA_URL       = window.location.origin;\n"
            f"const HA_TOKEN     = {json.dumps(token)};\n"
            f"const LOCATION     = {json.dumps(location)};\n"
            f"const SECTIONS     = {json.dumps(sections)};\n"
            f"const BODY_FONT    = {json.dumps(font)};\n"
            f"const INLINE_UNITS = {json.dumps(inline_units)};\n"
        )
        html = html.replace("/* __INJECTED_CONFIG__ */", injected)
        return Response(text=html, content_type="text/html", charset="utf-8")


_NO_TOKEN_PAGE = """<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<meta name="viewport" content="width=600,initial-scale=1">
<title>Kindle Dashboard — Setup</title>
<style>
  body{font-family:'Courier New',monospace;background:#fff;color:#000;
       padding:24px;width:600px;line-height:1.6}
  h1{font-size:18px;border-bottom:3px solid #000;padding-bottom:8px;margin-bottom:16px}
  ol{padding-left:20px} li{margin-bottom:10px}
  code{background:#eee;padding:2px 6px;font-size:13px;word-break:break-all}
  .box{border:2px solid #000;padding:12px;margin-top:16px;font-size:13px}
</style></head><body>
<h1>Kindle Dashboard — token required</h1>
<p>A long-lived access token must be included in the URL.</p>
<ol>
  <li>In Home Assistant, click your profile (bottom-left avatar).</li>
  <li>Scroll to <strong>Long-Lived Access Tokens</strong> and create one named <em>Kindle</em>.</li>
  <li>Bookmark this URL on your Kindle:<br><br>
      <code>http://&lt;HA-IP&gt;:8123/api/kindle_dashboard/kindle?token=PASTE_TOKEN_HERE</code>
  </li>
</ol>
<div class="box">The Kindle Dashboard panel in the HA sidebar shows a pre-filled URL once a token is saved.</div>
</body></html>"""
