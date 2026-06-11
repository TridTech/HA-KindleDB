# Kindle Dashboard

A Home Assistant custom integration that serves a clean, e-ink–optimised dashboard for jailbroken Kindles, with a full configuration UI accessible from the HA sidebar.

## Features

- **Kindle-optimised view** — high-contrast, monospace, large touch targets, zero animation
- **Sidebar config panel** — add/remove/reorder scenes, toggles, and sensor tiles without editing YAML or JSON
- **Auto-refresh** — Kindle page refreshes every 60 seconds; tap ↺ to refresh immediately
- **Served from HA** — no separate web server needed; uses HA cookie auth automatically

---

## Installation via HACS

1. In HACS, click **Custom Repositories** (⋮ menu → Custom repositories)
2. Paste your GitHub repo URL and select **Integration**
3. Click **Add**, then search for **Kindle Dashboard** and install it
4. Restart Home Assistant

## Manual Installation

Copy `custom_components/kindle_dashboard/` into your HA config's `custom_components/` folder and restart.

---

## Setup

1. Go to **Settings → Devices & Services → Add Integration** and search for **Kindle Dashboard**
2. Enter a location name (e.g. `Home`) and click **Submit**
3. The **Kindle Dashboard** item appears in the HA sidebar — open it to configure everything

---

## Configuring the Dashboard

Open the **Kindle Dashboard** panel in the sidebar. You can:

| Section | What you can do |
|---|---|
| **Status Sensors** | Pick sensor entities for the top status tiles (temperature, humidity, etc.) |
| **Scenes** | Add scene entities with a name and emoji icon |
| **Toggles** | Add light / switch / input_boolean entities with a label and emoji |

Click **Save** when done. Changes take effect immediately on the next Kindle page load.

---

## Pointing your Kindle at the Dashboard

Open the Kindle's experimental browser and navigate to:

```
http://<your-ha-ip>:8123/api/kindle_dashboard/kindle
```

The page uses Home Assistant's cookie-based authentication. If you are not already logged in on the Kindle browser, HA will redirect you to the login page once, after which the dashboard loads automatically.

> **Tip:** Bookmark the URL on the Kindle and set your browser's start page to it.

---

## Development

```
custom_components/kindle_dashboard/
├── __init__.py          # Integration setup, panel registration, HTTP view
├── config_flow.py       # Config + options flows
├── const.py             # Constants and defaults
├── manifest.json
├── strings.json
├── translations/
│   └── en.json
├── websocket_api.py     # get_config / save_config / get_entities WS commands
└── frontend/
    ├── panel.js         # HA sidebar config panel (web component)
    └── kindle.html      # Kindle dashboard template
```
