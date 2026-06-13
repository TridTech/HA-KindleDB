# Changelog

All notable changes to Kindle Dashboard are documented here.

---

## [1.4.0] — Initial Public Release

### Features

**Multiple dashboards**
- Add as many dashboards as you like from Settings → Devices & Services → Add Integration
- Each dashboard has its own name, URL, sections, and settings
- Dashboard picker in the panel top bar to switch between dashboards without leaving the page
- Existing single-dashboard configs migrate automatically to v3 format

**Kindle URL & device management**
- Add multiple devices per dashboard, each with its own name and generated URL
- Per-device copy buttons: ⎘ URL copies the bookmark URL; ⎘ Config copies a ready-to-paste `shortcut_browser.sh` snippet
- Per-device Prevent sleep toggle — includes or omits screensaver prevention commands in the config snippet
- Device name shown in the Kindle page footer
- Config snippet includes full battery server setup and sleep prevention commands for firmware 5.16.x+

**Battery tracking**
- Kindle battery level pushed to HA as a sensor entity (`sensor.<location>_battery_<device>`)
- Entity created automatically on first push — no YAML required
- `device_class: battery` for native HA integration
- Panel top bar shows live battery level; multiple devices shown as lowest/highest (e.g. `🔋 72% / 85%`)
- Battery level only pushed on change to minimise network traffic

**Active device tracking**
- Panel top bar shows how many Kindles are currently viewing each dashboard
- Tracked via the existing reload-poll heartbeat — no extra Kindle-side code needed
- Devices pruned after 30 seconds of inactivity

**Panel top bar**
- Dashboard picker
- 📱 active device count
- 🔋 battery level
- ↺ Force Refresh — triggers immediate page reload on the Kindle within 5 seconds
- Preview ↗ — opens the Kindle page in a new tab

**Configuration backup**
- Export dashboard config to a timestamped JSON file
- Import a previously exported config — loads into the editor for review before saving

**Layout & styling**
- Four themes: Sharp (default), Soft, Ink, Minimal
- Per-tier text styling: independent font size, bold, italic, underline for Label, ID/Unit, and Value
- Page Dimensions and Text Styling combined into a single 2-column card
- Floating Save button (bottom-right) — no more layout-shifting save banner
- Auto-refresh interval configurable (10–3600 seconds, default 60)
- Hard Refresh mode for the on-screen ↺ button
- Show/hide clock and battery in the Kindle top bar independently
- Dashboard name and Location name as separate fields

**Kindle page**
- Clock and battery bar visibility driven by injected config (fixes script ordering regression)
- Battery bar interval correctly started after injected constants are defined
- Device name in page footer when `?device=` URL parameter is set

### Compatibility
- Requires Home Assistant 2024.1.0 or later
- Config version 3 — automatic migration from v1 and v2
- Tested on Kindle Paperwhite 10th Generation, firmware 5.16.1.1

---

## Notes for HACS installation

1. HACS → ⋮ → Custom Repositories → paste `https://github.com/TridTech/HA-KindleDashboard` → category: Integration
2. Install and restart Home Assistant
3. Add the integration from Settings → Devices & Services → Add Integration → Kindle Dashboard
