# Kindle Dashboard

A Home Assistant custom integration that serves a clean, e-ink–optimised dashboard for jailbroken Kindles, with a full configuration UI accessible from the HA sidebar.

## Features

- **Kindle-optimised view** — high-contrast, monospace, large touch targets for controls, compact layout for read-only sensors
- **Flexible sections** — add, remove, and reorder as many sections as you like; each section is one of:
  - **Sensors** — compact read-only tiles, configurable label and unit
  - **Toggles** — large-tap-target rows for lights, switches, fans, covers, locks, etc.
  - **Scenes** — 2-column grid of tappable scene buttons
- **Font picker** — choose from Georgia, Courier New, Times New Roman, Arial, Helvetica, Verdana, Palatino, or Bookman
- **Inline or stacked units** — show sensor units on the same line as the value (`22 °F`) or on the line below
- **Light status strip** — dots + count summary of all lights; individual lights can be excluded per-toggle
- **Sidebar config panel** — full drag-and-drop-free configuration without touching YAML
- **Auto-refresh** — Kindle page refreshes every 60 seconds; tap ↺ to refresh immediately
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

Open **Kindle Dashboard** in the sidebar. The config panel has three cards:

### Kindle URL
Generate a Long-Lived Access Token in your HA profile → paste it here → save → bookmark the generated URL on your Kindle.

### General
- **Location Name** — displayed large in the top bar
- **Font** — body font for the entire Kindle page
- **Sensor units** — inline (`22 °F`) or stacked (value on one line, unit below)

### Sections
Each section card shows its type badge, a name field, and its items. Use ↑ ↓ to reorder, 🗑 to remove.

To add a section: pick a type from the dropdown at the bottom of the Sections card and click **+ Add Section**.

**Section types and their item fields:**

| Type | Fields per item |
|---|---|
| Sensors | Entity (sensor), Label, Unit, Hide from status |
| Toggles | Icon (emoji), Label, Entity (light/switch/etc.), Hide from status |
| Scenes | Icon (emoji), Name, Entity (scene) |

Click **Save** when done. Changes are live on the next Kindle page load (or tap ↺).

---

## On Your Kindle (must be jailbroken):

1. Install [kindle-shortcut-browser](https://github.com/mitchellurgero/kindle-shortcut-browser)
2. In the shortcut_browser.sh config section, make the following changes:
```
GO_FULLSCREEN=true
FULLSCREEN_SITE="http://<your-ha-ip>:8123/api/kindle_dashboard/kindle?token=YOUR_TOKEN"
EXTRACHROMEARGS="--kiosk" # This resovled a few issues with controls sticking around
```
3. Add the following code to the shortcut_browser.sh script.  This allows the dashboard to read the kindle battery level.
```
## Adding Battery function in from Claude ##
BAT_FILE="/mnt/us/kbbat"

# ── Battery ───────────────────────────────────────────────────────────────
BAT=$(lipc-get-prop com.lab126.powerd battLevel 2>/dev/null | tr -d '[] ')
[ -z "$BAT" ] && BAT=$(cat /sys/class/power_supply/*/capacity 2>/dev/null | head -1)
[ -z "$BAT" ] && BAT="?"
printf '%s' "$BAT" > "$BAT_FILE"
#echo "battery: $BAT" >> "$LOG"
( while true; do
    B=$(lipc-get-prop com.lab126.powerd battLevel 2>/dev/null | tr -d '[] ')
    [ -z "$B" ] && B=$(cat /sys/class/power_supply/*/capacity 2>/dev/null | head -1)
    [ -z "$B" ] && B="?"
    printf '%s' "$B" > "$BAT_FILE"
    sleep 30
  done ) &
BAT_PID=$!

# ── Prevent sleep while dashboard is running ─────────────────────────────────
lipc-set-prop -i com.lab126.powerd preventScreenSaver 1

# ── Cleanup on exit: restore sleep ───────────────────────────────────────────
# This runs when the script exits for any reason (Ctrl-C, kill, etc.)
trap 'lipc-set-prop -i com.lab126.powerd preventScreenSaver 0; \
      kill $BAT_PID $BAT_HTTP_PID $RELOAD_HTTP_PID $RELOAD_WATCH_PID 2>/dev/null' \
     EXIT INT TERM

# ── HTTP Server for serving battery value ── # 
BAT_PORT=2024
( while true; do
    VAL=$(cat "$BAT_FILE" 2>/dev/null || echo "?")
    BODY="${VAL}"
    RESP="HTTP/1.0 200 OK\r\nContent-Type: text/plain\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: ${#BODY}\r\nConnection: close\r\n\r\n${BODY}"
    echo -e "$RESP" | nc -l -p $BAT_PORT
  done ) &
BAT_HTTP_PID=$!
## End Battery Function from Claude ##
```
4. Eject the Kindle and launch the Shortcut Browser.  It will take a few seconds to launch, and then should show the dashboard.

---

## File Structure

```
custom_components/kindle_dashboard/
├── __init__.py          # Integration setup, panel, HTTP view
├── config_flow.py       # Setup wizard
├── const.py             # Constants and default sections
├── manifest.json
├── strings.json + translations/en.json
├── websocket_api.py     # get_config / save_config / get_entities
└── frontend/
    ├── panel.js         # HA sidebar config panel (web component)
    └── kindle.html      # Kindle page template
```
