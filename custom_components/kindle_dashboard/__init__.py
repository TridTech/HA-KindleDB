"""Kindle Dashboard — custom integration for Home Assistant."""
from __future__ import annotations

import json
import logging
import os
from typing import Any

from homeassistant.components import frontend
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_LOCATION_NAME,
    CONF_SCENES,
    CONF_SECTION_SCENES_LABEL,
    CONF_SECTION_TOGGLES_LABEL,
    CONF_SHOW_SCENES,
    CONF_STATS,
    CONF_TOGGLES,
    DEFAULT_LOCATION_NAME,
    DEFAULT_SCENES,
    DEFAULT_SECTION_SCENES_LABEL,
    DEFAULT_SECTION_TOGGLES_LABEL,
    DEFAULT_SHOW_SCENES,
    DEFAULT_STATS,
    DEFAULT_TOGGLES,
    DOMAIN,
)
from . import websocket_api

_LOGGER = logging.getLogger(__name__)

PANEL_ICON = "mdi:tablet"
PANEL_TITLE = "Kindle Dashboard"

# Served at /kindle_dashboard_files/...
STATIC_URL = f"/{DOMAIN}_files"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up via configuration.yaml (no-op; we use config entries)."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Kindle Dashboard from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry

    # Register static files (the config panel JS + kindle HTML)
    frontend_path = os.path.join(os.path.dirname(__file__), "frontend")
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, frontend_path, cache_headers=False)]
    )

    # Register the sidebar panel (skip if already registered)
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

    # Register WebSocket API commands
    websocket_api.async_setup(hass)

    # Register HTTP view that serves the Kindle HTML with injected config
    hass.http.register_view(KindleView(hass))

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update (reload so the Kindle page picks up changes)."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    hass.data[DOMAIN].pop(entry.entry_id, None)
    return True


def _merged_config(entry: ConfigEntry) -> dict:
    """Merge entry.data and entry.options; options win."""
    base = dict(entry.data)
    base.update(entry.options)
    return base


class KindleView(HomeAssistantView):
    """Serve the Kindle dashboard HTML at /api/kindle_dashboard/kindle.

    Authentication: the Kindle browser does not reliably maintain session
    cookies, so we use a long-lived token passed as ``?token=<TOKEN>`` in
    the URL.  The token is injected into the page and used as a Bearer header
    on every subsequent API call.  The page itself is served without auth so
    the HTML can load; every state/service call uses the injected token.

    If no token is provided we return a friendly error page with instructions
    instead of a silent 401.
    """

    url = "/api/kindle_dashboard/kindle"
    name = "api:kindle_dashboard:kindle"
    requires_auth = False  # HTML is public; individual API calls use the token

    def __init__(self, hass: HomeAssistant) -> None:
        """Init."""
        self.hass = hass

    async def get(self, request: Any) -> Any:
        """Return the Kindle HTML page with config and token injected."""
        from aiohttp.web import Response

        token = request.rel_url.query.get("token", "").strip()

        if not token:
            return Response(
                text=_NO_TOKEN_PAGE,
                content_type="text/html",
                charset="utf-8",
            )

        entries = self.hass.config_entries.async_entries(DOMAIN)
        if not entries:
            return Response(text="Kindle Dashboard integration is not set up.", status=503)

        cfg          = _merged_config(entries[0])
        location     = cfg.get(CONF_LOCATION_NAME, DEFAULT_LOCATION_NAME)
        scenes       = cfg.get(CONF_SCENES,  DEFAULT_SCENES)
        toggles      = cfg.get(CONF_TOGGLES, DEFAULT_TOGGLES)
        stats        = cfg.get(CONF_STATS,   DEFAULT_STATS)
        show_scenes  = cfg.get(CONF_SHOW_SCENES, DEFAULT_SHOW_SCENES)
        scenes_label = cfg.get(CONF_SECTION_SCENES_LABEL,  DEFAULT_SECTION_SCENES_LABEL)
        toggles_label= cfg.get(CONF_SECTION_TOGGLES_LABEL, DEFAULT_SECTION_TOGGLES_LABEL)

        template_path = os.path.join(os.path.dirname(__file__), "frontend", "kindle.html")
        with open(template_path, "r", encoding="utf-8") as f:
            html = f.read()

        injected = (
            f"const HA_URL                = window.location.origin;\n"
            f"const HA_TOKEN              = {json.dumps(token)};\n"
            f"const LOCATION              = {json.dumps(location)};\n"
            f"const SHOW_SCENES           = {json.dumps(show_scenes)};\n"
            f"const SECTION_SCENES_LABEL  = {json.dumps(scenes_label)};\n"
            f"const SECTION_TOGGLES_LABEL = {json.dumps(toggles_label)};\n"
            f"const SCENES                = {json.dumps(scenes)};\n"
            f"const TOGGLES               = {json.dumps(toggles)};\n"
            f"const STATS                 = {json.dumps(stats)};\n"
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
<p>A long-lived access token must be included in the URL so the dashboard
can control your devices without a login session.</p>
<ol>
  <li>In Home Assistant, click your profile (bottom-left avatar).</li>
  <li>Scroll to <strong>Long-Lived Access Tokens</strong> and click
      <strong>Create Token</strong>. Name it <em>Kindle</em>.</li>
  <li>Copy the token and bookmark this URL on your Kindle:<br><br>
      <code>http://&lt;HA-IP&gt;:8123/api/kindle_dashboard/kindle?token=PASTE_TOKEN_HERE</code>
  </li>
</ol>
<div class="box">The Kindle Dashboard config panel in the HA sidebar also
shows a pre-filled URL once a token is saved there.</div>
</body></html>"""
