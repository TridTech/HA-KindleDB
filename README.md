# Kindle Dashboard

A Home Assistant custom integration that serves a clean, e-ink–optimised dashboard for jailbroken Kindles, with a full configuration UI accessible from the HA sidebar.

## Features

- **Kindle-optimised view** — high-contrast, large touch targets for controls, compact layout for read-only sensors
- **Four themes** — Sharp (default), Soft, Ink, and Minimal
- **Flexible sections** — add, remove, and reorder as many sections as you like; each section is one of:
  - **Sensors** — compact read-only tiles, configurable label and unit
  - **Toggles** — large-tap-target rows for lights, switches, fans, covers, locks, etc.
  - **Scenes** — tappable scene buttons, optional 2-column layout
- **Font picker** — choose from Georgia, Courier New, Times New Roman, Arial, Helvetica, Verdana, Palatino, or Bookman
- **Per-tier text styling** — independent bold, italic, underline, and size controls for labels, ID/unit text, and sensor values
- **Inline or stacked units** — show sensor units on the same line as the value (`22 °F`) or on the line below
- **Light status strip** — dots + count summary of all lights; individual lights can be excluded per-section
- **Battery and time bar** — shows Kindle battery level and current time at the top of the page (requires shortcut browser setup below)
- **Sidebar config panel** — full configuration without touching YAML, including a live entity picker
- **Force Kindle Refresh** — reload the Kindle page remotely from the HA panel
- **Hard Refresh mode** — make the on-screen ↺ button do a full page reload instead of just pulling new values
- **Auto-refresh** — Kindle page refreshes every 60 seconds automatically
- **Token auth** — long-lived access token embedded in the bookmark URL; no session cookie needed

---

## Installation via HACS

1. In HACS → ⋮ → **Custom Repositories** → paste your GitHub repo URL → category: **Integration**
2. Click **Add**, search for **Kindle Dashboard**, and install
3. Restart Home Assistant

## Manual Installation

Copy `custom_components/kindle_dashboard/` into your HA config's `custom_components/` folder and restart.

---

## Setup

1. **Settings → Devices & Services → Add Integration** → search **Kindle Dashboard**
2. Enter a location name (e.g. `Home`) and click **Submit**
3. **Kindle Dashboard** appears in the HA sidebar

---

## Configuring the Dashboard

Open **Kindle Dashboard** in the sidebar. The config panel has four cards:

### Kindle URL
Generate a Long-Lived Access Token in your HA profile → paste it here → save → bookmark the generated URL on your Kindle.

**Force Kindle Refresh** — the blue button below the URL sends an immediate reload signal to the Kindle page. The Kindle will reload within 5 seconds. Useful after saving config changes without walking over to the device.

### Page Dimensions
- **Page Width / Height** — set to match your Kindle's screen resolution
- **Scale** — scales all content proportionally; useful for high-DPI screens

### General
- **Location Name** — displayed in the info bar
- **Theme** — choose from Sharp, Soft, Ink, or Minimal
- **Font** — body font for the entire Kindle page
- **Label / ID+Unit / Value font size** — independent size controls with bold, italic, and underline toggles for each tier
- **Hard Refresh** — when enabled, the ↺ Refresh button on the Kindle does a full page reload (re-fetches HTML, config, and assets) rather than just pulling updated entity values. Useful if you notice stale content after config changes.

### Sections
Each section card shows its type badge, a name field, and its items. Use ↑ ↓ to reorder sections and items, 🗑 to remove.

To add a section: pick a type from the dropdown at the bottom of the Sections card and click **+ Add Section**.

**Section types and their options:**

| Type | Options | Item fields |
|---|---|---|
| Sensors | Inline Units, Hide IDs | Entity, Label, Unit |
| Toggles | 2 Columns, Hide IDs | Icon, Entity, Label, Hide from status |
| Scenes | 2 Columns, Hide IDs | Icon, Entity, Name |

Click **Save** when done. Changes take effect on the next Kindle page load, or use **Force Kindle Refresh** to push them immediately.

---

## On Your Kindle (must be jailbroken)

1. Install [kindle-shortcut-browser](https://github.com/mitchellurgero/kindle-shortcut-browser)
2. In the `shortcut_browser.sh` config section, make the following changes:
```sh
GO_FULLSCREEN=true
FULLSCREEN_SITE="http://<your-ha-ip>:8123/api/kindle_dashboard/kindle?token=YOUR_TOKEN"
EXTRACHROMEARGS="--kiosk"  # Resolves issues with controls sticking around
```
3. Add the following code to the `shortcut_browser.sh` script. This enables the battery level display and prevents the Kindle from sleeping while the dashboard is running.
```sh
## Kindle Dashboard — battery, sleep prevention, and HTTP server ##
BAT_FILE="/mnt/us/kbbat"

# ── Battery ───────────────────────────────────────────────────────────────
BAT=$(lipc-get-prop com.lab126.powerd battLevel 2>/dev/null | tr -d '[] ')
[ -z "$BAT" ] && BAT=$(cat /sys/class/power_supply/*/capacity 2>/dev/null | head -1)
[ -z "$BAT" ] && BAT="?"
printf '%s' "$BAT" > "$BAT_FILE"

( while true; do
    B=$(lipc-get-prop com.lab126.powerd battLevel 2>/dev/null | tr -d '[] ')
    [ -z "$B" ] && B=$(cat /sys/class/power_supply/*/capacity 2>/dev/null | head -1)
    [ -z "$B" ] && B="?"
    printf '%s' "$B" > "$BAT_FILE"
    sleep 30
  done ) &
BAT_PID=$!

# ── Prevent sleep while dashboard is running ─────────────────────────────
lipc-set-prop -i com.lab126.powerd preventScreenSaver 1

# ── Cleanup on exit: restore sleep and kill background jobs ──────────────
trap 'lipc-set-prop -i com.lab126.powerd preventScreenSaver 0; \
      kill $BAT_PID $BAT_HTTP_PID 2>/dev/null' \
     EXIT INT TERM

# ── HTTP server on port 2024: serves battery value to the dashboard ───────
BAT_PORT=2024
( while true; do
    VAL=$(cat "$BAT_FILE" 2>/dev/null || echo "?")
    BODY="${VAL}"
    RESP="HTTP/1.0 200 OK\r\nContent-Type: text/plain\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: ${#BODY}\r\nConnection: close\r\n\r\n${BODY}"
    echo -e "$RESP" | nc -l -p $BAT_PORT
  done ) &
BAT_HTTP_PID=$!
## End Kindle Dashboard additions ##
```
4. Eject the Kindle and launch the Shortcut Browser. It will take a few seconds to launch and then should show the dashboard.

---

## Refresh Behaviour

| Method | What it does |
|---|---|
| Auto-refresh (60s) | Pulls fresh entity states; no page reload |
| ↺ button (normal mode) | Same as auto-refresh, on demand |
| ↺ button (Hard Refresh enabled) | Full page reload — re-fetches HTML, config, and assets |
| Force Kindle Refresh (panel button) | Triggers a full page reload on the Kindle within 5 seconds, from your computer |

---

## File Structure

```
custom_components/kindle_dashboard/
├── __init__.py          # Integration setup, panel, HTTP view
├── config_flow.py       # Setup wizard
├── const.py             # Constants and defaults
├── manifest.json
├── strings.json + translations/en.json
├── websocket_api.py     # WebSocket API (get/save config, force refresh)
└── frontend/
    ├── panel.js         # HA sidebar config panel (web component)
    ├── kindle.html      # Kindle page template
    └── mdi-kindle.woff  # Subsetted Material Design Icons font (588 icons)
```
