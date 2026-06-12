/**
 * Kindle Dashboard — HA Sidebar Config Panel
 * All state lives in this._config (plain JS object).
 * The DOM is a pure render of that state — never read back into config
 * except via _collectConfig(), which is only called before mutations.
 */

const FONTS = [
  { value: "Georgia, serif",           label: "Georgia" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Arial, sans-serif",        label: "Arial" },
  { value: "Helvetica, sans-serif",    label: "Helvetica" },
  { value: "Verdana, sans-serif",      label: "Verdana" },
  { value: "Palatino, serif",          label: "Palatino" },
  { value: "Bookman, serif",           label: "Bookman" },
];

const THEMES = [
  { value: "sharp",   label: "Sharp (default)" },
  { value: "soft",    label: "Soft" },
  { value: "ink",     label: "Ink" },
  { value: "minimal", label: "Minimal" },
];

const SECTION_TYPES = [
  { value: "sensors", label: "Sensors (read-only display)" },
  { value: "toggles", label: "Toggles (lights & switches)" },
  { value: "scenes",  label: "Scenes (tap to activate)"   },
];

const MDI = {"account": "󰀄", "account-group": "󰡉", "account-group-outline": "󰭘", "account-off": "󰀒", "account-off-outline": "󰯧", "account-outline": "󰀓", "air-conditioner": "󰀛", "air-filter": "󰵃", "air-humidifier": "󱂙", "air-humidifier-off": "󱑦", "air-purifier": "󰵄", "air-purifier-off": "󱭗", "alarm": "󰀠", "alarm-check": "󰀡", "alarm-light": "󰞏", "alarm-light-off": "󱜞", "alarm-light-off-outline": "󱜟", "alarm-light-outline": "󰯪", "alarm-off": "󰀣", "alarm-panel": "󱗄", "alarm-panel-outline": "󱗅", "alarm-plus": "󰀤", "awning": "󱮇", "awning-outline": "󱮈", "bathtub": "󱠘", "bathtub-outline": "󱠙", "battery": "󰁹", "battery-10": "󰁺", "battery-10-bluetooth": "󰤾", "battery-20": "󰁻", "battery-20-bluetooth": "󰤿", "battery-30": "󰁼", "battery-30-bluetooth": "󰥀", "battery-40": "󰁽", "battery-40-bluetooth": "󰥁", "battery-50": "󰁾", "battery-50-bluetooth": "󰥂", "battery-60": "󰁿", "battery-60-bluetooth": "󰥃", "battery-70": "󰂀", "battery-70-bluetooth": "󰥄", "battery-80": "󰂁", "battery-80-bluetooth": "󰥅", "battery-90": "󰂂", "battery-90-bluetooth": "󰥆", "battery-alert": "󰂃", "battery-alert-bluetooth": "󰥇", "battery-alert-variant": "󱃌", "battery-alert-variant-outline": "󱃍", "battery-arrow-down": "󱟞", "battery-arrow-down-outline": "󱟟", "battery-arrow-up": "󱟠", "battery-arrow-up-outline": "󱟡", "battery-bluetooth": "󰥈", "battery-bluetooth-variant": "󰥉", "battery-charging": "󰂄", "battery-charging-10": "󰢜", "battery-charging-100": "󰂅", "battery-charging-20": "󰂆", "battery-charging-30": "󰂇", "battery-charging-40": "󰂈", "battery-charging-50": "󰢝", "battery-charging-60": "󰂉", "battery-charging-70": "󰢞", "battery-charging-80": "󰂊", "battery-charging-90": "󰂋", "battery-charging-high": "󱊦", "battery-charging-low": "󱊤", "battery-charging-medium": "󱊥", "battery-charging-outline": "󰢟", "battery-charging-wireless": "󰠇", "battery-charging-wireless-10": "󰠈", "battery-charging-wireless-20": "󰠉", "battery-charging-wireless-30": "󰠊", "battery-charging-wireless-40": "󰠋", "battery-charging-wireless-50": "󰠌", "battery-charging-wireless-60": "󰠍", "battery-charging-wireless-70": "󰠎", "battery-charging-wireless-80": "󰠏", "battery-charging-wireless-90": "󰠐", "battery-charging-wireless-alert": "󰠑", "battery-charging-wireless-outline": "󰠒", "battery-clock": "󱧥", "battery-clock-outline": "󱧦", "battery-heart": "󱈏", "battery-heart-outline": "󱈐", "battery-heart-variant": "󱈑", "battery-high": "󱊣", "battery-low": "󱊡", "battery-medium": "󱊢", "battery-minus": "󱟤", "battery-minus-outline": "󱟥", "battery-minus-variant": "󰂌", "battery-off": "󱉝", "battery-off-outline": "󱉞", "battery-outline": "󰂎", "battery-plus": "󱟦", "battery-plus-outline": "󱟧", "battery-plus-variant": "󰂏", "battery-remove": "󱟨", "battery-remove-outline": "󱟩", "battery-sync": "󱠴", "battery-sync-outline": "󱠵", "battery-unknown": "󰂑", "battery-unknown-bluetooth": "󰥊", "bed": "󰋣", "bed-empty": "󰢠", "bed-king": "󰿒", "bed-outline": "󰂙", "bed-queen": "󰿐", "bed-single": "󱁭", "bell": "󰂚", "bell-alert": "󰵙", "bell-alert-outline": "󰺁", "bell-cancel": "󱏧", "bell-cancel-outline": "󱏨", "bell-check": "󱇥", "bell-check-outline": "󱇦", "bell-minus": "󱏩", "bell-minus-outline": "󱏪", "bell-off": "󰂛", "bell-outline": "󰂜", "bell-plus": "󰂝", "bell-plus-outline": "󰪒", "bell-remove": "󱏫", "bell-remove-outline": "󱏬", "bell-ring": "󰂞", "bell-ring-outline": "󰂟", "bell-sleep": "󰂠", "bell-sleep-outline": "󰪓", "bicycle": "󱂜", "blender": "󰳫", "blender-outline": "󱠚", "blinds": "󰂬", "blinds-horizontal": "󱨫", "blinds-horizontal-closed": "󱨬", "blinds-open": "󱀑", "blinds-vertical": "󱨭", "blinds-vertical-closed": "󱨮", "bluetooth": "󰂯", "bluetooth-connect": "󰂱", "bluetooth-off": "󰂲", "bluetooth-transfer": "󰂴", "camera": "󰄀", "camera-iris": "󰄄", "camera-off": "󰗟", "camera-outline": "󰵝", "car": "󰄋", "car-electric": "󰭬", "car-electric-outline": "󱖵", "car-off": "󰸜", "car-outline": "󱓭", "cast": "󰄘", "cast-connected": "󰄙", "cast-off": "󰞊", "cctv": "󰞮", "cctv-off": "󱡟", "ceiling-light": "󰝩", "ceiling-light-multiple": "󱣝", "ceiling-light-multiple-outline": "󱣞", "ceiling-light-outline": "󱟇", "coffee": "󰅶", "coffee-maker": "󱂟", "coffee-maker-outline": "󱠛", "coffee-off": "󰾪", "coffee-outline": "󰛊", "cog": "󰒓", "cog-off": "󱏎", "cog-off-outline": "󱏏", "cog-outline": "󰢻", "cog-refresh": "󱑞", "cog-refresh-outline": "󱑟", "cog-sync": "󱑠", "cog-sync-outline": "󱑡", "counter": "󰆙", "countertop": "󱠜", "countertop-outline": "󱠝", "curtains": "󱡆", "curtains-closed": "󱡇", "desk": "󱈹", "desk-lamp": "󰥟", "desk-lamp-off": "󱬟", "desk-lamp-on": "󱬠", "dishwasher": "󰪬", "dishwasher-alert": "󱆸", "dishwasher-off": "󱆹", "door-closed": "󰠛", "door-closed-lock": "󱂯", "door-open": "󰠜", "door-sliding": "󱠞", "door-sliding-open": "󱠠", "electric-switch": "󰺟", "electric-switch-closed": "󱃙", "ev-plug-ccs1": "󱔙", "ev-plug-ccs2": "󱔚", "ev-plug-chademo": "󱔛", "ev-plug-tesla": "󱔜", "ev-plug-type1": "󱔝", "ev-plug-type2": "󱔞", "ev-station": "󰗱", "fan": "󰈐", "fan-alert": "󱑬", "fan-auto": "󱜝", "fan-chevron-down": "󱑭", "fan-chevron-up": "󱑮", "fan-clock": "󱨺", "fan-minus": "󱑰", "fan-off": "󰠝", "fan-plus": "󱑯", "fan-remove": "󱑱", "fan-speed-1": "󱑲", "fan-speed-2": "󱑳", "fan-speed-3": "󱑴", "fire": "󰈸", "fire-alert": "󱗗", "fire-extinguisher": "󰻲", "fire-hydrant": "󱄷", "fire-off": "󱜢", "flash": "󰉁", "flash-auto": "󰉂", "flash-off": "󰉃", "flash-outline": "󰛕", "flash-red-eye": "󰙻", "flash-triangle": "󱬝", "flash-triangle-outline": "󱬞", "floor-lamp": "󰣝", "floor-lamp-dual": "󱁀", "floor-lamp-dual-outline": "󱟎", "floor-lamp-outline": "󱟈", "floor-lamp-torchiere": "󱝇", "floor-lamp-torchiere-outline": "󱟖", "floor-lamp-torchiere-variant": "󱁁", "floor-lamp-torchiere-variant-outline": "󱟏", "flower": "󰉊", "flower-outline": "󰧰", "flower-pollen": "󱢅", "flower-pollen-outline": "󱢆", "fridge": "󰊐", "fridge-bottom": "󰊒", "fridge-industrial": "󱗮", "fridge-industrial-off": "󱗱", "fridge-industrial-off-outline": "󱗲", "fridge-industrial-outline": "󱗳", "fridge-off": "󱆯", "fridge-off-outline": "󱆰", "fridge-outline": "󰊏", "fridge-top": "󰊑", "fridge-variant": "󱗴", "fridge-variant-off": "󱗷", "fridge-variant-outline": "󱗹", "garage": "󰛙", "garage-lock": "󱟻", "garage-open": "󰛚", "garage-open-variant": "󱋔", "garage-variant": "󱋓", "garage-variant-lock": "󱟼", "gas-cylinder": "󰙇", "gate": "󰊙", "gate-alert": "󱟸", "gate-and": "󰣡", "gate-arrow-left": "󱟷", "gate-arrow-right": "󱅩", "gate-open": "󱅪", "gauge": "󰊚", "gauge-empty": "󰡳", "gauge-full": "󰡴", "gauge-low": "󰡵", "grass": "󱔐", "heat-pump": "󱩃", "heat-pump-outline": "󱩄", "heat-wave": "󱩅", "home": "󰋜", "home-alert": "󰡻", "home-alert-outline": "󱗐", "home-automation": "󰟑", "home-city": "󰴕", "home-city-outline": "󰴖", "home-flood": "󰻺", "home-modern": "󰋝", "home-off": "󱩆", "home-off-outline": "󱩇", "home-outline": "󰚡", "hub": "󱲕", "hub-outline": "󱲖", "human": "󰋦", "human-greeting": "󱟄", "hvac": "󱍒", "hvac-off": "󱖞", "kettle": "󰗺", "kettle-off": "󱌛", "kettle-outline": "󰽖", "lamp": "󰚵", "lamp-outline": "󱟐", "lamps": "󱕶", "lamps-outline": "󱟑", "leaf": "󰌪", "leak": "󰷗", "leak-off": "󰷘", "led-off": "󰌫", "led-on": "󰌬", "led-outline": "󰌭", "led-strip": "󰟖", "led-strip-variant": "󱁑", "led-strip-variant-off": "󱩋", "led-variant-off": "󰌮", "led-variant-on": "󰌯", "led-variant-outline": "󰌰", "lightbulb": "󰌵", "lightbulb-auto": "󱠀", "lightbulb-auto-outline": "󱠁", "lightbulb-cfl": "󱈈", "lightbulb-cfl-off": "󱈉", "lightbulb-cfl-spiral": "󱉵", "lightbulb-cfl-spiral-off": "󱋃", "lightbulb-fluorescent-tube": "󱠄", "lightbulb-fluorescent-tube-outline": "󱠅", "lightbulb-group": "󱉓", "lightbulb-group-off": "󱋍", "lightbulb-group-off-outline": "󱋎", "lightbulb-group-outline": "󱉔", "lightbulb-multiple": "󱉕", "lightbulb-multiple-off": "󱋏", "lightbulb-multiple-off-outline": "󱋐", "lightbulb-multiple-outline": "󱉖", "lightbulb-night": "󱩌", "lightbulb-night-outline": "󱩍", "lightbulb-off": "󰹏", "lightbulb-off-outline": "󰹐", "lightbulb-on": "󰛨", "lightbulb-on-10": "󱩎", "lightbulb-on-20": "󱩏", "lightbulb-on-30": "󱩐", "lightbulb-on-40": "󱩑", "lightbulb-on-50": "󱩒", "lightbulb-on-60": "󱩓", "lightbulb-on-70": "󱩔", "lightbulb-on-80": "󱩕", "lightbulb-on-90": "󱩖", "lightbulb-on-outline": "󰛩", "lightbulb-outline": "󰌶", "lightbulb-question": "󱧣", "lightbulb-question-outline": "󱧤", "lightbulb-spot": "󱟴", "lightbulb-spot-off": "󱟵", "lightbulb-variant": "󱠂", "lightbulb-variant-outline": "󱠃", "lightning-bolt": "󱐋", "lightning-bolt-circle": "󰠠", "lightning-bolt-outline": "󱐌", "lock": "󰌾", "lock-alert": "󰣮", "lock-alert-outline": "󱗑", "lock-check": "󱎚", "lock-check-outline": "󱚨", "lock-clock": "󰥿", "lock-minus": "󱚩", "lock-minus-outline": "󱚪", "lock-off": "󱙱", "lock-off-outline": "󱙲", "lock-open": "󰌿", "lock-open-alert": "󱎛", "lock-open-alert-outline": "󱗒", "lock-open-check": "󱎜", "lock-open-check-outline": "󱚫", "lock-open-minus": "󱚬", "lock-open-minus-outline": "󱚭", "lock-open-outline": "󰍀", "lock-open-plus": "󱚮", "lock-open-plus-outline": "󱚯", "lock-open-remove": "󱚰", "lock-open-remove-outline": "󱚱", "lock-open-variant": "󰿆", "lock-open-variant-outline": "󰿇", "lock-outline": "󰍁", "lock-pattern": "󰛪", "lock-plus": "󰗻", "lock-plus-outline": "󱚲", "lock-remove": "󱚳", "lock-remove-outline": "󱚴", "lock-reset": "󰝳", "lock-smart": "󰢲", "meter-electric": "󱩗", "meter-electric-outline": "󱩘", "meter-gas": "󱩙", "meter-gas-outline": "󱩚", "microwave": "󰲙", "microwave-off": "󱐣", "molecule-co": "󱋾", "molecule-co2": "󰟤", "motion-sensor": "󰶑", "motion-sensor-off": "󱐵", "motorbike": "󰍼", "nas": "󰣳", "outdoor-lamp": "󱁔", "pool": "󰘆", "pool-thermometer": "󱩟", "power": "󰐥", "power-off": "󰤂", "power-plug": "󰚥", "power-plug-off": "󰚦", "power-plug-off-outline": "󱐤", "power-plug-outline": "󱐥", "power-sleep": "󰤄", "power-socket": "󰐧", "power-socket-au": "󰤅", "power-socket-de": "󱄇", "power-socket-eu": "󰟧", "power-socket-fr": "󱄈", "power-socket-jp": "󱄉", "power-socket-uk": "󰟨", "power-socket-us": "󰟩", "power-standby": "󰤆", "projector": "󰐮", "projector-off": "󱨣", "projector-screen": "󰐯", "projector-screen-off": "󱠍", "projector-screen-outline": "󱜤", "projector-screen-variant": "󱠏", "projector-screen-variant-off": "󱠐", "projector-screen-variant-outline": "󱠒", "radiator": "󰐸", "radiator-disabled": "󰫗", "radiator-off": "󰫘", "remote": "󰑔", "remote-off": "󰻄", "remote-tv": "󰻅", "remote-tv-off": "󰻆", "robot-mower": "󱇷", "robot-vacuum": "󰜍", "robot-vacuum-off": "󱰁", "robot-vacuum-variant": "󰤈", "robot-vacuum-variant-off": "󱰂", "roller-shade": "󱩫", "roller-shade-closed": "󱩬", "router": "󱇢", "router-network": "󱂇", "router-wireless": "󰑩", "router-wireless-off": "󱖣", "router-wireless-settings": "󰩩", "run": "󰜎", "scooter": "󱖽", "server": "󰒋", "server-network": "󰒍", "shield": "󰒘", "shield-home": "󰚊", "shield-home-outline": "󰳋", "shield-lock": "󰦝", "shield-lock-open": "󱦚", "shield-lock-outline": "󰳌", "shower": "󰦠", "shower-head": "󰦡", "sleep": "󰒲", "smoke-detector": "󰎒", "smoke-detector-alert": "󱤮", "smoke-detector-off": "󱠉", "smoke-detector-variant": "󱠋", "smoke-detector-variant-alert": "󱤰", "smoke-detector-variant-off": "󱠌", "snowflake": "󰜗", "snowflake-off": "󱓣", "snowflake-thermometer": "󱩱", "sofa": "󰒹", "sofa-outline": "󱕭", "sofa-single": "󱕮", "sofa-single-outline": "󱕯", "solar-panel": "󰶛", "solar-panel-large": "󰶜", "solar-power": "󰩲", "solar-power-variant": "󱩳", "solar-power-variant-outline": "󱩴", "speaker": "󰓃", "speaker-bluetooth": "󰦢", "speaker-multiple": "󰴸", "speaker-off": "󰓄", "speaker-pause": "󱭳", "speaker-play": "󱭲", "speaker-stop": "󱭴", "speaker-wireless": "󰜟", "sprout": "󰹦", "sprout-outline": "󰹧", "stove": "󰓞", "string-lights": "󱊺", "string-lights-off": "󱊻", "table-chair": "󱁡", "table-furniture": "󰖼", "television": "󰔂", "television-ambient-light": "󱍖", "television-box": "󰠹", "television-off": "󰠻", "television-pause": "󰾉", "television-play": "󰻏", "television-shimmer": "󱄐", "television-stop": "󰾊", "thermometer": "󰔏", "thermometer-auto": "󱬏", "thermometer-bluetooth": "󱢕", "thermometer-check": "󱩿", "thermometer-chevron-down": "󰸂", "thermometer-chevron-up": "󰸃", "thermometer-high": "󱃂", "thermometer-lines": "󰔐", "thermometer-low": "󱃃", "thermometer-minus": "󰸄", "thermometer-off": "󱔱", "thermometer-plus": "󰸅", "thermometer-probe": "󱬫", "thermometer-probe-off": "󱬬", "thermometer-water": "󱪀", "thermostat": "󰎓", "thermostat-auto": "󱬗", "thermostat-box": "󰢑", "thermostat-cog": "󱲀", "toaster": "󱁣", "toaster-off": "󱆷", "toaster-oven": "󰳓", "toggle-switch": "󰔡", "toggle-switch-off": "󰔢", "toggle-switch-off-outline": "󰨙", "toggle-switch-outline": "󰨚", "toggle-switch-variant": "󱨥", "toggle-switch-variant-off": "󱨦", "toilet": "󰦫", "transmission-tower": "󰴾", "transmission-tower-export": "󱤬", "transmission-tower-import": "󱤭", "transmission-tower-off": "󱧝", "tree": "󰔱", "tree-outline": "󰹩", "tumble-dryer": "󰤗", "tumble-dryer-alert": "󱆺", "tumble-dryer-off": "󱆻", "tune": "󰘮", "tune-variant": "󱕂", "tune-vertical": "󰙪", "tune-vertical-variant": "󱕃", "umbrella": "󰕊", "umbrella-closed": "󰦰", "umbrella-outline": "󰕋", "video": "󰕧", "video-off": "󰕨", "video-outline": "󰯜", "volume-high": "󰕾", "volume-low": "󰕿", "volume-medium": "󰖀", "volume-mute": "󰝟", "volume-off": "󰖁", "walk": "󰖃", "washing-machine": "󰜪", "washing-machine-alert": "󱆼", "washing-machine-off": "󱆽", "water": "󰖌", "water-alert": "󱔂", "water-boiler": "󰾒", "water-boiler-alert": "󱆳", "water-boiler-off": "󱆴", "water-off": "󰖍", "water-outline": "󰸊", "water-percent": "󰖎", "water-percent-alert": "󱔉", "weather-cloudy": "󰖐", "weather-fog": "󰖑", "weather-night": "󰖔", "weather-partly-cloudy": "󰖕", "weather-rainy": "󰖗", "weather-snowy": "󰖘", "weather-sunny": "󰖙", "weather-sunset": "󰖚", "weather-sunset-down": "󰖛", "weather-sunset-up": "󰖜", "weather-windy": "󰖝", "wifi": "󰖩", "wifi-off": "󰖪", "wifi-strength-1": "󰤟", "wifi-strength-2": "󰤢", "wifi-strength-3": "󰤥", "wifi-strength-4": "󰤨", "wifi-strength-alert-outline": "󰤫", "wifi-strength-off": "󰤭", "wifi-strength-off-outline": "󰤮", "window-closed": "󰖮", "window-closed-variant": "󱇛", "window-open": "󰖱", "window-open-variant": "󱇜", "window-shutter": "󱄜", "window-shutter-alert": "󱄝", "window-shutter-open": "󱄞", "z-wave": "󰫪", "zigbee": "󰵁"};

const ALL_DOMAINS = ["light","switch","scene","sensor","input_boolean",
                     "media_player","fan","cover","climate","lock"];

class KindleDashboardPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass     = null;
    this._config   = null;
    this._entities = [];
    this._mounted      = false;
    this._initializing = false;
    this._activeEntryId = null;  // which dashboard is being edited
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config && !this._initializing) this._init();
  }
  set panel(p) {}

  async _init() {
    this._initializing = true;
    try {
      await this._loadDashboards();
      await Promise.all([this._loadConfig(), this._loadEntities()]);
      this._mount();
    } finally {
      this._initializing = false;
    }
  }

  async _loadDashboards() {
    try {
      const res = await this._hass.callWS({ type: "kindle_dashboard/get_dashboards" });
      this._dashboards = res.dashboards || [];
      // Default to first dashboard if none selected
      if (!this._activeEntryId && this._dashboards.length > 0) {
        this._activeEntryId = this._dashboards[0].entry_id;
      }
    } catch(e) { this._dashboards = []; }
  }

  async _loadConfig() {
    try {
      this._config = await this._hass.callWS({
        type: "kindle_dashboard/get_config",
        entry_id: this._activeEntryId,
      });
    } catch(e) { this._config = {}; }
  }

  async _loadEntities() {
    try {
      const r = await this._hass.callWS({ type: "kindle_dashboard/get_entities", domains: ALL_DOMAINS });
      this._entities = r.entities || [];
    } catch(e) { this._entities = []; }
  }

  // ── MOUNT: build static chrome once, wire listeners once ───────────────

  _mount() {
    if (this._mounted) return;  // never re-mount; prevents listener duplication
    this.shadowRoot.innerHTML = `<style>${this._css()}</style>
      <div class="top-bar">
        <h1>📱 Kindle Dashboard</h1>
        <select id="dashboard-picker" class="dash-picker"></select>
        <button id="btn-force-refresh" class="topbar-btn">↺ Force Refresh</button>
        <span id="topbar-link"></span>
      </div>
      <div class="float-save" id="float-save">
        <button id="discard-btn" class="float-discard" title="Discard changes">✕</button>
        <button id="save-btn" class="float-save-btn">💾 Save</button>
      </div>
      <div class="content">

        <div class="card" id="card-url">
          <div class="card-header"><span class="icon">🔗</span> Kindle URL</div>
          <div class="card-body">
            <p class="hint">Generate a Long-Lived Access Token in your HA profile, paste it below, then bookmark the URL on your Kindle.</p>
            <div class="form-row">
              <label>Long-Lived Access Token</label>
              <input type="text" id="kindle-token" placeholder="Paste token here…"
                     style="font-family:monospace;font-size:12px">
            </div>
            <div class="form-row">
              <label>Kindle Bookmark URL</label>
              <div style="display:flex;gap:6px;align-items:stretch">
                <div class="kindle-url" id="token-url-display" style="flex:1"></div>
                <button id="btn-copy-url" class="backup-btn" title="Copy URL">⎘ Copy</button>
              </div>
            </div>
            <p id="force-refresh-hint" class="hint"></p>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="icon">💾</span> Configuration Backup</div>
          <div class="card-body">
            <p class="hint">Export your full dashboard configuration to a JSON file, or import a previously saved one. Importing loads the config into the editor — review it and hit Save to apply.</p>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
              <button id="btn-export" class="backup-btn">⬇ Export Config</button>
              <button id="btn-import" class="backup-btn">⬆ Import Config</button>
              <input type="file" id="import-file" accept=".json,application/json"
                     style="display:none">
              <span id="import-status" style="font-size:12px;color:var(--secondary-text-color,#888)"></span>
            </div>
          </div>
        </div>

        <div class="card" id="card-general">
          <div class="card-header"><span class="icon">⚙️</span> General</div>
          <div class="card-body">
            <div class="form-row two-col">
              <div>
                <label>Dashboard Name</label>
                <input type="text" id="dashboard-name" placeholder="Kindle Dashboard">
              </div>
              <div>
                <label>Location Name</label>
                <input type="text" id="location-name" placeholder="Home">
              </div>
            </div>
            <div class="form-row two-col">
              <div>
                <label>Font</label>
                <select id="font-select"></select>
              </div>
              <div>
                <label>Theme</label>
                <select id="theme-select">
                  ${THEMES.map(t => `<option value="${t.value}">${t.label}</option>`).join("")}
                </select>
              </div>
            </div>
            <div class="form-row">
              <label>Auto-Refresh Interval</label>
              <div class="num-row">
                <input type="number" id="refresh-interval" min="10" max="3600" step="10">
                <span class="num-unit">seconds</span>
              </div>
            </div>
            <div class="form-row">
              <label class="opt-row">
                <input type="checkbox" id="hard-refresh">
                <span>Hard Refresh <em>— reloads the entire page including config and assets, instead of only updating entity states. Use when changes are not appearing after a config save.</em></span>
              </label>
            </div>
            <div class="form-row">
              <label class="opt-row">
                <input type="checkbox" id="show-clock">
                <span>Show clock in top bar</span>
              </label>
            </div>
            <div class="form-row">
              <label class="opt-row">
                <input type="checkbox" id="show-battery">
                <span>Show battery in top bar <em>(requires shortcut_browser.sh setup)</em></span>
              </label>
            </div>
          </div>
        <div class="card">
          <div class="card-header"><span class="icon">📐</span> Page Dimensions &amp; Text Styling</div>
          <div class="card-body">
            <div class="two-col-card">
              <div class="two-col-card-col">
                <label class="col-header">Page Dimensions</label>
                <div class="form-row">
                  <label>Width</label>
                  <div class="num-row">
                    <input type="number" id="page-width" min="320" max="1920" step="10">
                    <span class="num-unit">px</span>
                  </div>
                </div>
                <div class="form-row">
                  <label>Height</label>
                  <div class="num-row">
                    <input type="number" id="page-height" min="320" max="2560" step="10">
                    <span class="num-unit">px</span>
                  </div>
                </div>
                <div class="form-row">
                  <label>Scale</label>
                  <div style="display:flex;align-items:center;gap:6px">
                    <input type="range" id="page-scale" min="0.5" max="3.0" step="0.05" style="flex:1">
                    <span id="page-scale-display" class="num-unit" style="width:36px;text-align:right">1.0×</span>
                  </div>
                </div>
              </div>
              <div class="two-col-card-col two-col-card-divider">
                <label class="col-header">Text Styling</label>
                <div class="font-style-grid">
                  <div class="font-style-row">
                    <label class="fsr-label">Label</label>
                    <div class="num-row">
                      <input type="number" id="label-font-size" min="6" max="32" step="1">
                      <span class="num-unit">px</span>
                    </div>
                    <div class="biu-row">
                      <button type="button" class="biu-btn" id="label-bold"   data-active="false" title="Bold"><b>B</b></button>
                      <button type="button" class="biu-btn" id="label-italic" data-active="false" title="Italic"><i>I</i></button>
                      <button type="button" class="biu-btn" id="label-underline" data-active="false" title="Underline"><u>U</u></button>
                    </div>
                  </div>
                  <div class="font-style-row">
                    <label class="fsr-label">ID / Unit</label>
                    <div class="num-row">
                      <input type="number" id="sub-font-size" min="6" max="24" step="1">
                      <span class="num-unit">px</span>
                    </div>
                    <div class="biu-row">
                      <button type="button" class="biu-btn" id="sub-bold"   data-active="false" title="Bold"><b>B</b></button>
                      <button type="button" class="biu-btn" id="sub-italic" data-active="false" title="Italic"><i>I</i></button>
                      <button type="button" class="biu-btn" id="sub-underline" data-active="false" title="Underline"><u>U</u></button>
                    </div>
                  </div>
                  <div class="font-style-row">
                    <label class="fsr-label">Value</label>
                    <div class="num-row">
                      <input type="number" id="value-font-size" min="8" max="48" step="1">
                      <span class="num-unit">px</span>
                    </div>
                    <div class="biu-row">
                      <button type="button" class="biu-btn" id="value-bold"   data-active="false" title="Bold"><b>B</b></button>
                      <button type="button" class="biu-btn" id="value-italic" data-active="false" title="Italic"><i>I</i></button>
                      <button type="button" class="biu-btn" id="value-underline" data-active="false" title="Underline"><u>U</u></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>

        <div class="card">
          <div class="card-header">
            <span class="icon">📋</span> Sections
            <span class="hint-inline">top-to-bottom on the Kindle</span>
          </div>
          <div class="card-body">
            <div id="sections-root"></div>
            <div class="add-section-row">
              <select id="new-section-type">
                ${SECTION_TYPES.map(t => `<option value="${t.value}">${t.label}</option>`).join("")}
              </select>
              <button id="btn-add-section" class="add-btn">+ Add Section</button>
            </div>
          </div>
        </div>

      </div>
      <div id="toast"></div>`;

    this._wireListeners();
    this._mounted = true;
    this._syncToDOM();
  }

  // ── SYNC: push this._config into the DOM (no DOM reads) ────────────────

  _syncToDOM() {
    if (!this._mounted) return;
    const cfg  = this._config || {};
    const root = this.shadowRoot;

    // Token & URL
    // Populate dashboard picker
    const picker = root.querySelector("#dashboard-picker");
    if (picker) {
      picker.innerHTML = (this._dashboards || []).map(d =>
        `<option value="${d.entry_id}"${d.entry_id === this._activeEntryId ? " selected" : ""}>
          ${d.title}</option>`
      ).join("");
    }
    root.querySelector("#dashboard-name") &&
      (root.querySelector("#dashboard-name").value = cfg.dashboard_name || "");
    const token    = cfg.kindle_token || "";
    const tokenUrl = (token && this._activeEntryId)
      ? `${window.location.origin}/api/kindle_dashboard/kindle/${this._activeEntryId}?token=${encodeURIComponent(token)}`
      : "";
    root.querySelector("#kindle-token").value = token;
    const urlEl = root.querySelector("#token-url-display");
    urlEl.innerHTML = tokenUrl
      ? `<a href="${this._esc(tokenUrl)}" target="_blank">${this._esc(tokenUrl)}</a>`
      : `<span class="muted">Paste a token above and save to generate the URL</span>`;
    const topLink = root.querySelector("#topbar-link");
    topLink.innerHTML = tokenUrl
      ? `<a href="${this._esc(tokenUrl)}" target="_blank">Preview ↗</a>` : "";

    // General
    root.querySelector("#location-name").value      = cfg.location_name || "Home";
    const themeSel = root.querySelector("#theme-select");
    if (themeSel) themeSel.value = cfg.theme || "sharp";
    // inline-units synced via _paintSections (in sensors sec header)
    root.querySelector("#hard-refresh").checked    = !!cfg.hard_refresh;
    const _ri = root.querySelector("#refresh-interval");
    if (_ri) _ri.value = cfg.refresh_interval ?? 60;
    const _sc = root.querySelector("#show-clock");
    if (_sc) _sc.checked = cfg.show_clock !== false;
    const _sb = root.querySelector("#show-battery");
    if (_sb) _sb.checked = !!cfg.show_battery;
    root.querySelector("#page-width").value         = cfg.page_width  ?? 600;
    root.querySelector("#page-height").value        = cfg.page_height ?? 800;
    const _scv = cfg.page_scale ?? 1.0;
    root.querySelector("#page-scale").value = _scv;
    root.querySelector("#page-scale-display").textContent = parseFloat(_scv).toFixed(2) + "×";
    root.querySelector("#label-font-size").value    = cfg.label_font_size  ?? 13;
    root.querySelector("#sub-font-size").value      = cfg.sub_font_size    ?? 10;
    root.querySelector("#value-font-size").value    = cfg.value_font_size  ?? 18;
    this._setBIU(root, "label",   !!cfg.label_bold,   !!cfg.label_italic,   !!cfg.label_underline);
    this._setBIU(root, "sub",     !!cfg.sub_bold,     !!cfg.sub_italic,     !!cfg.sub_underline);
    this._setBIU(root, "value",   !!cfg.value_bold,   !!cfg.value_italic,   !!cfg.value_underline);


    // Font select — build options with per-option font styling
    const fontSel  = root.querySelector("#font-select");
    const curFont  = cfg.font || "Georgia, serif";
    fontSel.innerHTML = FONTS.map(f =>
      `<option value="${this._esc(f.value)}"
         style="font-family:${this._esc(f.value)}"
         ${f.value === curFont ? "selected" : ""}>${f.label}</option>`
    ).join("");
    // Apply preview font to the select element itself
    fontSel.style.fontFamily = curFont;

    // Sections
    root.querySelector("#sections-root").innerHTML =
      (cfg.sections || []).map((sec, si) => this._sectionHTML(sec, si)).join("");
  }

  // ── SECTION HTML ────────────────────────────────────────────────────────

  _sectionHTML(sec, si) {
    const addLabel = {sensors:"+ Add Sensor", scenes:"+ Add Scene"}[sec.type] || "+ Add Toggle";
    const twoCol   = !!sec.two_columns;
    const items    = sec.items || [];
    return `
      <div class="section-card">
        <div class="sec-header">
          <span class="sec-badge">${sec.type}</span>
          <input class="sec-name" type="text" placeholder="Section name" value="${this._esc(sec.label||"")}">
          ${(sec.type === "toggles" || sec.type === "scenes")
            ? `<label class="two-col-wrap" title="Two-column layout on Kindle">
                 <input type="checkbox" class="sec-twocol"${twoCol?" checked":""}> 2 Columns
               </label>` : ""}
          ${sec.type === "sensors"
            ? `<label class="two-col-wrap" title="Show units on the same line as the value">
                 <input type="checkbox" class="sec-inlineunits"${this._config && this._config.inline_units?" checked":""}> Inline Units
               </label>` : ""}
          <label class="two-col-wrap" title="Hide entity IDs in this section">
            <input type="checkbox" class="sec-hideids"${sec.hide_entity_ids?" checked":""}> Hide IDs
          </label>
          <div class="sec-actions">
            <button class="btn-move-sec" data-dir="-1">↑</button>
            <button class="btn-move-sec" data-dir="1">↓</button>
            <button class="btn-del-sec">🗑</button>
          </div>
        </div>
        <div class="sec-items">
          ${items.map((item, ii) => this._itemHTML(sec.type, item, si, ii)).join("")}
        </div>
        <button class="btn-add-item add-item-btn">${addLabel}</button>
      </div>`;
  }

  _itemHTML(sectype, item, si, ii) {
    // Move + delete buttons shared by all types
    const ctrl = `
      <button class="btn-move-item" data-dir="-1" title="Move up">↑</button>
      <button class="btn-move-item" data-dir="1"  title="Move down">↓</button>
      <button class="btn-del-item" title="Remove">✕</button>`;

    if (sectype === "sensors") {
      const opts = this._entities.filter(e => e.domain === "sensor")
        .map(e => `<option value="${e.entity_id}"${e.entity_id===item.id?" selected":""}>${e.name} (${e.entity_id})</option>`)
        .join("");
      return `<div class="item-row" data-ii="${ii}">
        <select class="i-entity i-wide"><option value="">— pick sensor —</option>${opts}</select>
        <input class="i-label i-mid" type="text" placeholder="Label" value="${this._esc(item.label||"")}">
        <input class="i-unit" type="text" placeholder="Unit" value="${this._esc(item.unit||"")}">
        ${ctrl}</div>`;
    }

    if (sectype === "scenes") {
      const opts = this._entities.filter(e => e.domain === "scene")
        .map(e => `<option value="${e.entity_id}"${e.entity_id===(item.entity||"")?" selected":""}>${e.name} (${e.entity_id})</option>`)
        .join("");
      return `<div class="item-row" data-ii="${ii}">
        <select class="i-icon-sel"><option value="">— icon —</option>${Object.entries(MDI).map(([n,c]) => `<option value="${n}"${item.icon===n?" selected":""}>${n}</option>`).join("")}</select>
        <select class="i-entity i-wide"><option value="">— pick scene —</option>${opts}</select>
        <input class="i-label i-mid" type="text" placeholder="Name" value="${this._esc(item.name||"")}">
        ${ctrl}</div>`;
    }

    // toggles — entity first, then label
    const opts = this._entities
      .filter(e => ["light","switch","input_boolean","fan","cover","lock","media_player"].includes(e.domain))
      .map(e => `<option value="${e.entity_id}"${e.entity_id===item.id?" selected":""}>${e.name} (${e.entity_id})</option>`)
      .join("");
    return `<div class="item-row" data-ii="${ii}">
      <select class="i-icon-sel"><option value="">— icon —</option>${Object.entries(MDI).map(([n,c]) => `<option value="${n}"${item.icon===n?" selected":""}>${n}</option>`).join("")}</select>
      <select class="i-entity i-wide"><option value="">— pick entity —</option>${opts}</select>
      <input class="i-label i-mid" type="text" placeholder="Label" value="${this._esc(item.label||"")}">
      <label class="hide-wrap" title="Exclude from light status strip">
        <input type="checkbox" class="i-hide"${item.hide_from_status?" checked":""}> hide
      </label>
      ${ctrl}</div>`;
  }

  // ── LISTENERS — wired once in _mount ────────────────────────────────────

  _setBIU(root, prefix, bold, italic, underline) {
    [["bold", bold], ["italic", italic], ["underline", underline]].forEach(([suf, val]) => {
      const btn = root.querySelector(`#${prefix}-${suf}`);
      if (!btn) return;
      btn.dataset.active = val ? "true" : "false";
      btn.classList.toggle("biu-on", val);
    });
  }

  _wireListeners() {
    if (this._mounted) return;  // listeners already attached
    const root = this.shadowRoot;

    // Any input/change → mark dirty; font select also updates preview
    root.addEventListener("input", (e) => {
      this._markDirty();
      if (e.target.id === "page-scale") {
        const v = parseFloat(e.target.value).toFixed(2);
        root.querySelector("#page-scale-display").textContent = v + "×";
      }
    });
    root.addEventListener("change", (e) => {
      if (e.target.id !== "dashboard-picker") this._markDirty();
      if (e.target.id === "dashboard-picker") {
        this._activeEntryId = e.target.value;
        this._config = null;
        this._loadConfig().then(() => {
          this._syncToDOM();
          this._paintSections();
        });
        return;
      }
      if (e.target.id === "font-select") {
        if (!this._config) this._config = {};
        this._config.font = e.target.value;
        e.target.style.fontFamily = e.target.value;
      }
      if (e.target.id === "page-scale") {
        root.querySelector("#page-scale-display").textContent =
          parseFloat(e.target.value).toFixed(2) + "×";
      }
    });

    // Import file picker
    root.querySelector("#import-file")?.addEventListener("change", (e) => {
      this._doImport(e.target.files[0]);
      e.target.value = "";  // reset so same file can be re-imported
    });

    // Delegated click handler
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      // BIU toggle buttons
      if (btn.classList.contains("biu-btn")) {
        const isOn = btn.dataset.active === "true";
        btn.dataset.active = isOn ? "false" : "true";
        btn.classList.toggle("biu-on", !isOn);
        this._markDirty();
        return;
      }
      if (btn.id === "btn-force-refresh") { this._doForceRefresh(); return; }
      if (btn.id === "btn-export")         { this._doExport();       return; }
      if (btn.id === "btn-import") { root.querySelector("#import-file")?.click(); return; }
      if (btn.id === "btn-copy-url") {
        const url = root.querySelector("#token-url-display a")?.href || "";
        if (!url) return;
        if (navigator.clipboard) { navigator.clipboard.writeText(url).then(() => this._toast("✓ URL copied")); }
        else { const t=document.createElement("textarea"); t.value=url; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); this._toast("✓ URL copied"); }
        return;
      }
      if (btn.id === "btn-add-section") { this._doAddSection();  return; }
      if (btn.id === "save-btn")        { this._doSave();        return; }
      if (btn.id === "discard-btn") {
        this._config = null;
        this._loadConfig().then(() => {
          this._syncToDOM();
          this._paintSections();
          this.shadowRoot.querySelector("#float-save")?.classList.remove("visible");
        });
        return;
      }

      const card = btn.closest(".section-card");
      if (!card) return;
      const allCards = [...root.querySelectorAll(".section-card")];
      const si = allCards.indexOf(card);
      if (si === -1) return;

      if (btn.classList.contains("btn-add-item"))  { this._doAddItem(si);    return; }
      if (btn.classList.contains("btn-del-sec"))   { this._doDelSection(si); return; }
      if (btn.classList.contains("btn-move-sec"))  { this._doMoveSection(si, parseInt(btn.dataset.dir)); return; }

      const row = btn.closest(".item-row");
      if (!row) return;
      const ii = [...card.querySelectorAll(".item-row")].indexOf(row);
      if (ii === -1) return;

      if (btn.classList.contains("btn-del-item"))  { this._doDelItem(si, ii);                            return; }
      if (btn.classList.contains("btn-move-item")) { this._doMoveItem(si, ii, parseInt(btn.dataset.dir)); return; }
    });
  }

  _markDirty() {
    this.shadowRoot.querySelector("#float-save")?.classList.add("visible");
  }

  // ── COLLECT: read current DOM state into a plain config object ──────────
  // This is the ONLY place we read from the DOM back into data.

  _collectConfig() {
    const root = this.shadowRoot;
    const cfg  = Object.assign({}, this._config || {});

    cfg.dashboard_name   = root.querySelector("#dashboard-name")?.value.trim() || "Kindle Dashboard";
    cfg.location_name    = root.querySelector("#location-name")?.value.trim() || "Home";
    cfg.kindle_token     = root.querySelector("#kindle-token")?.value.trim()  || "";
    cfg.font             = root.querySelector("#font-select")?.value           || "Georgia, serif";
    cfg.hard_refresh       = root.querySelector("#hard-refresh")?.checked      || false;
    cfg.refresh_interval   = parseInt(root.querySelector("#refresh-interval")?.value) || 60;
    cfg.show_clock       = root.querySelector("#show-clock")?.checked          !== false;
    cfg.show_battery     = root.querySelector("#show-battery")?.checked        || false;
    cfg.theme            = root.querySelector("#theme-select")?.value          || "sharp";
    // inline_units is read from the first sensors section header
    const inlineEl = root.querySelector(".sec-inlineunits");
    cfg.inline_units = inlineEl ? inlineEl.checked : (this._config?.inline_units || false);
    cfg.page_width       = parseInt(root.querySelector("#page-width")?.value)  || 600;
    cfg.page_height      = parseInt(root.querySelector("#page-height")?.value) || 800;
    cfg.page_scale       = parseFloat(root.querySelector("#page-scale")?.value) || 1.0;
    cfg.label_font_size  = parseInt(root.querySelector("#label-font-size")?.value)  || 13;
    cfg.sub_font_size    = parseInt(root.querySelector("#sub-font-size")?.value)    || 10;
    cfg.value_font_size  = parseInt(root.querySelector("#value-font-size")?.value)  || 18;
    cfg.label_bold      = root.querySelector("#label-bold")?.dataset.active   === "true";
    cfg.label_italic    = root.querySelector("#label-italic")?.dataset.active === "true";
    cfg.label_underline = root.querySelector("#label-underline")?.dataset.active === "true";
    cfg.sub_bold        = root.querySelector("#sub-bold")?.dataset.active     === "true";
    cfg.sub_italic      = root.querySelector("#sub-italic")?.dataset.active   === "true";
    cfg.sub_underline   = root.querySelector("#sub-underline")?.dataset.active === "true";
    cfg.value_bold      = root.querySelector("#value-bold")?.dataset.active   === "true";
    cfg.value_italic    = root.querySelector("#value-italic")?.dataset.active === "true";
    cfg.value_underline = root.querySelector("#value-underline")?.dataset.active === "true";


    cfg.sections = [...root.querySelectorAll(".section-card")].map(card => {
      const sectype   = card.querySelector(".sec-badge")?.textContent?.trim() || "toggles";
      const label        = card.querySelector(".sec-name")?.value.trim()  || "";
      const two_col      = card.querySelector(".sec-twocol")?.checked       || false;
      const hide_ids     = card.querySelector(".sec-hideids")?.checked      || false;

      const items = [...card.querySelectorAll(".item-row")].map(row => {
        const entity = row.querySelector(".i-entity")?.value || "";
        const lbl    = row.querySelector(".i-label")?.value.trim() || "";
        const icon   = row.querySelector(".i-icon-sel")?.value || "";
        const unit   = row.querySelector(".i-unit")?.value.trim()  || "";
        const hide   = row.querySelector(".i-hide")?.checked       || false;

        if (sectype === "sensors") return { id: entity, label: lbl, unit, hide_from_status: hide };
        if (sectype === "scenes")  return { icon, name: lbl, desc: "", entity };
        return { id: entity, icon, label: lbl, hide_from_status: hide };
      });

      return { type: sectype, label, two_columns: two_col, hide_entity_ids: hide_ids, items };
    });

    return cfg;
  }

  // ── MUTATIONS ────────────────────────────────────────────────────────────
  // Pattern: collect → mutate cfg → store as this._config → syncToDOM

  async _doForceRefresh() {
    const hint = this.shadowRoot.querySelector("#force-refresh-hint");
    const btn  = this.shadowRoot.querySelector("#btn-force-refresh");
    if (!hint || !btn) return;
    btn.disabled = true;
    hint.textContent = "Sending…";
    try {
      const res = await this._hass.callWS({
        type: "kindle_dashboard/force_refresh",
        entry_id: this._activeEntryId,
      });
      hint.textContent = "✓ Kindle will reload within 5 seconds (counter: " + res.counter + ")";
      setTimeout(() => { hint.textContent = ""; btn.disabled = false; }, 5000);
    } catch(e) {
      hint.textContent = "Error: " + e.message;
      btn.disabled = false;
    }
  }

  _doAddSection() {
    const cfg  = this._collectConfig();
    const type = this.shadowRoot.querySelector("#new-section-type")?.value || "toggles";
    cfg.sections.push({ type, label: "", two_columns: false, items: [] });
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doDelSection(si) {
    const cfg = this._collectConfig();
    cfg.sections.splice(si, 1);
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doMoveSection(si, dir) {
    const cfg = this._collectConfig();
    const to  = si + dir;
    if (to < 0 || to >= cfg.sections.length) return;
    [cfg.sections[si], cfg.sections[to]] = [cfg.sections[to], cfg.sections[si]];
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doAddItem(si) {
    const cfg = this._collectConfig();
    const sec = cfg.sections[si];
    if (!sec) return;
    if (sec.type === "sensors")
      sec.items.push({ id: "", label: "", unit: "", hide_from_status: false });
    else if (sec.type === "scenes")
      sec.items.push({ icon: "🎭", name: "", desc: "", entity: "" });
    else
      sec.items.push({ id: "", icon: "💡", label: "", hide_from_status: false });
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doDelItem(si, ii) {
    const cfg = this._collectConfig();
    cfg.sections[si]?.items.splice(ii, 1);
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  _doMoveItem(si, ii, dir) {
    const cfg   = this._collectConfig();
    const items = cfg.sections[si]?.items;
    if (!items) return;
    const to = ii + dir;
    if (to < 0 || to >= items.length) return;
    [items[ii], items[to]] = [items[to], items[ii]];
    this._config = cfg;
    this._markDirty();
    this._paintSections();
  }

  // Only repaint the sections list — general fields stay untouched
  _paintSections() {
    const root = this.shadowRoot;
    root.querySelector("#sections-root").innerHTML =
      (this._config?.sections || []).map((sec, si) => this._sectionHTML(sec, si)).join("");
  }

  // ── SAVE ────────────────────────────────────────────────────────────────

  _doExport() {
    const cfg  = this._collectConfig();
    const name = (cfg.location_name || "kindle-dashboard").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const ts   = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${name}-config-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  _doImport(file) {
    if (!file) return;
    const status = this.shadowRoot.querySelector("#import-status");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        // Basic sanity check — must have at least one recognisable key
        if (typeof imported !== "object" || imported === null ||
            (!imported.sections && !imported.location_name && !imported.font)) {
          if (status) status.textContent = "✕ Not a valid Kindle Dashboard config file";
          return;
        }
        this._config = imported;
        this._syncToDOM();
        this._paintSections();
        this._markDirty();
        if (status) {
          status.textContent = "✓ Config loaded — review and hit Save to apply";
          setTimeout(() => { status.textContent = ""; }, 5000);
        }
      } catch(err) {
        if (status) status.textContent = "✕ Could not parse JSON: " + err.message;
      }
    };
    reader.readAsText(file);
  }

  async _doSave() {
    const cfg = this._collectConfig();
    // Strip items with no entity before persisting
    cfg.sections.forEach(sec => {
      sec.items = sec.items.filter(item =>
        sec.type === "scenes" ? !!item.entity : !!item.id
      );
    });
    try {
      await this._hass.callWS({
        type: "kindle_dashboard/save_config",
        entry_id: this._activeEntryId,
        config: cfg,
      });
      // Refresh dashboard list (name may have changed)
      await this._loadDashboards();
      this._syncToDOM();
      this._config = cfg;
      this.shadowRoot.querySelector("#float-save")?.classList.remove("visible");
      this._toast("✓ Saved — reload Kindle page to apply");
      this._paintSections(); // reflect any filtering
    } catch(e) { this._toast("Error saving: " + e.message); }
  }

  // ── CSS ──────────────────────────────────────────────────────────────────

  _css() { return `
    @font-face{font-family:'MDI';src:url('/kindle_dashboard_files/mdi-kindle.woff') format('woff');font-weight:normal;font-style:normal}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :host{display:block;min-height:100%;height:100%;overflow-y:auto;
      background:var(--primary-background-color,#fafafa);
      color:var(--primary-text-color,#212121);
      font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif);font-size:14px}
    .top-bar{background:var(--app-header-background-color,var(--primary-color,#03a9f4));
      color:var(--app-header-text-color,#fff);padding:0 16px;height:56px;
      display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:10;
      box-shadow:0 2px 4px rgba(0,0,0,.18)}
    .top-bar h1{font-size:20px;font-weight:500;flex:1}
    .dash-picker{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.4);
      color:#fff;padding:4px 8px;border-radius:4px;font-size:13px;
      max-width:180px;cursor:pointer}
    .dash-picker option{background:#333;color:#fff}
    .topbar-btn{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.4);
      color:#fff;padding:4px 10px;border-radius:4px;font-size:13px;cursor:pointer;white-space:nowrap}
    .topbar-btn:hover{background:rgba(255,255,255,.25)}
    .topbar-btn:disabled{opacity:.5;cursor:default}
    .top-bar a{color:inherit;font-size:13px;opacity:.85;text-decoration:none;
      border:1px solid rgba(255,255,255,.5);padding:4px 10px;border-radius:4px;white-space:nowrap}
    .float-save{display:none;position:fixed;bottom:24px;right:24px;
      z-index:999;align-items:center;gap:8px;
      filter:drop-shadow(0 2px 6px rgba(0,0,0,.25))}
    .float-save.visible{display:flex}
    .float-save-btn{background:var(--primary-color,#03a9f4);color:#fff;
      border:none;border-radius:24px;padding:10px 22px;
      font-size:14px;font-weight:600;cursor:pointer;letter-spacing:.02em;
      box-shadow:0 2px 8px rgba(0,0,0,.2)}
    .float-save-btn:hover{opacity:.92}
    .float-save-btn:active{opacity:.8}
    .float-discard{background:var(--card-background-color,#fff);
      color:var(--secondary-text-color,#666);
      border:1px solid var(--divider-color,#ddd);border-radius:50%;
      width:32px;height:32px;font-size:14px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.12)}
    .float-discard:hover{background:var(--secondary-background-color,#f5f5f5)}
    .content{padding:16px;max-width:860px;margin:0 auto}
    .card{background:var(--card-background-color,#fff);border-radius:8px;
      box-shadow:0 1px 3px rgba(0,0,0,.12);margin-bottom:16px;overflow:hidden}
    .card-header{padding:13px 16px 10px;font-size:16px;font-weight:500;
      border-bottom:1px solid var(--divider-color,#e0e0e0);display:flex;align-items:center;gap:8px}
    .card-header .icon{font-size:18px}
    .hint-inline{font-size:12px;color:var(--secondary-text-color,#888);font-weight:400}
    .card-body{padding:12px 16px 16px}
    .hint{font-size:13px;color:var(--secondary-text-color,#888);margin-bottom:10px}
    .form-row{margin-bottom:12px}
    .form-row:last-child{margin-bottom:0}
    .form-row.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    label{display:block;font-size:11px;font-weight:500;
      color:var(--secondary-text-color,#727272);margin-bottom:4px;
      letter-spacing:.04em;text-transform:uppercase}
    input[type=text],select{width:100%;padding:7px 9px;
      border:1px solid var(--divider-color,#ccc);border-radius:4px;
      background:var(--primary-background-color,#fff);
      color:var(--primary-text-color,#212121);font-size:13px}
    input[type=text]:focus,select:focus{outline:none;border-color:var(--primary-color,#03a9f4)}
    /* Inside item rows: reset width:100% so flex sizing works */
    .item-row input[type=text],.item-row select{width:auto;padding:4px 6px;font-size:12px}
    /* general card option rows */
    .opt-row{display:flex;align-items:center;gap:7px;cursor:pointer;
      font-size:13px;text-transform:none;letter-spacing:0;font-weight:400;
      color:var(--primary-text-color,#212121);margin-top:6px;margin-bottom:0}
    .opt-row input[type=checkbox]{width:15px;height:15px;flex-shrink:0;margin:0}
    .opt-row em{font-style:normal;color:var(--secondary-text-color,#888);font-size:12px}
    .form-row.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .num-row{display:flex;align-items:center;gap:4px}
    .num-row input[type=number]{width:64px;padding:7px 8px;
      border:1px solid var(--divider-color,#ccc);border-radius:4px;
      background:var(--primary-background-color,#fff);
      color:var(--primary-text-color,#212121);font-size:13px;text-align:center}
    .num-row input[type=number]:focus{outline:none;border-color:var(--primary-color,#03a9f4)}
    .num-unit{font-size:13px;color:var(--secondary-text-color,#888)}
    .two-col-card{display:grid;grid-template-columns:1fr 1fr;gap:0}
    .two-col-card-col{padding:0 16px 4px 0}
    .two-col-card-divider{border-left:1px solid var(--divider-color,#e0e0e0);padding:0 0 4px 16px}
    .col-header{display:block;font-size:11px;font-weight:600;
      color:var(--secondary-text-color,#727272);letter-spacing:.04em;
      text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;
      border-bottom:1px solid var(--divider-color,#e0e0e0)}
    .font-style-grid{display:flex;flex-direction:column;gap:6px}
    .font-style-row{display:flex;align-items:center;gap:8px}
    .fsr-label{font-size:11px;font-weight:500;text-transform:uppercase;
      letter-spacing:.04em;color:var(--secondary-text-color,#727272);
      width:60px;flex-shrink:0;margin-bottom:0}
    .biu-row{display:flex;gap:3px;flex-shrink:0}
    .biu-btn{width:26px;height:26px;border:1px solid var(--divider-color,#ccc);
      border-radius:4px;background:var(--primary-background-color,#fff);
      color:var(--primary-text-color);cursor:pointer;font-size:12px;
      display:flex;align-items:center;justify-content:center;padding:0}
    .biu-btn:hover{background:var(--secondary-background-color,#eee)}
    .biu-btn.biu-on{background:var(--primary-color,#03a9f4);color:#fff;
      border-color:var(--primary-color,#03a9f4)}
    /* sections */
    #sections-root{display:flex;flex-direction:column;gap:12px;margin-bottom:12px}
    .section-card{border:1px solid var(--divider-color,#ddd);border-radius:6px;overflow:hidden}
    .sec-header{display:flex;align-items:center;gap:8px;
      background:var(--secondary-background-color,#f5f5f5);
      padding:8px 10px;border-bottom:1px solid var(--divider-color,#ddd)}
    .sec-badge{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
      background:var(--primary-color,#03a9f4);color:#fff;
      padding:2px 7px;border-radius:10px;flex-shrink:0}
    .sec-name{flex:1;padding:5px 8px;font-size:14px;font-weight:500;
      border:1px solid transparent;border-radius:4px;
      background:transparent;color:var(--primary-text-color)}
    .sec-name:focus{border-color:var(--primary-color,#03a9f4);
      background:var(--primary-background-color,#fff)}
    .two-col-wrap{display:flex;align-items:center;gap:4px;font-size:12px;
      white-space:nowrap;cursor:pointer;color:var(--secondary-text-color,#666);
      text-transform:none;letter-spacing:0;font-weight:400;margin-bottom:0;flex-shrink:0}
    .two-col-wrap input{width:13px;height:13px;margin:0}
    .sec-actions{display:flex;gap:4px;flex-shrink:0}
    .btn-move-sec,.btn-del-sec{background:none;border:1px solid var(--divider-color,#ccc);
      border-radius:4px;padding:3px 7px;cursor:pointer;font-size:13px;
      color:var(--primary-text-color)}
    .btn-del-sec{color:var(--error-color,#db4437)}
    /* items */
    .sec-items{display:flex;flex-direction:column;gap:6px;padding:8px 10px}
    .item-row{display:flex;align-items:center;gap:5px;flex-wrap:nowrap;
      background:var(--primary-background-color,#fff);
      border:1px solid var(--divider-color,#e0e0e0);border-radius:4px;padding:5px 7px}
    /* item-row input sizing handled above */
    .i-icon-sel{flex:0 0 110px!important;min-width:0;font-size:11px}
    .i-wide{flex:2 1 120px;min-width:0}
    .i-mid{flex:1 1 80px;min-width:0}
    .i-unit{width:46px!important;flex-shrink:0}
    .hide-wrap{display:flex;align-items:center;gap:3px;font-size:11px;
      color:var(--secondary-text-color);white-space:nowrap;cursor:pointer;
      text-transform:none;letter-spacing:0;font-weight:400;margin-bottom:0;flex-shrink:0}
    .hide-wrap input{width:13px;height:13px;margin:0}
    .btn-move-item,.btn-del-item{background:none;border:none;cursor:pointer;
      padding:2px 4px;border-radius:3px;font-size:12px;flex-shrink:0;
      color:var(--secondary-text-color,#888)}
    .btn-del-item{color:var(--error-color,#db4437);font-size:14px}
    .btn-move-item:hover{background:var(--secondary-background-color,#eee)}
    .btn-del-item:hover{background:rgba(219,68,55,.1)}
    .add-item-btn{display:block;width:calc(100% - 20px);margin:0 10px 10px;
      background:none;border:1px dashed var(--primary-color,#03a9f4);
      color:var(--primary-color,#03a9f4);padding:6px 14px;
      border-radius:4px;cursor:pointer;font-size:12px}
    .add-section-row{display:flex;gap:8px;align-items:center}
    .add-section-row select{flex:1}
    .backup-btn{background:none;border:1px solid var(--primary-color,#03a9f4);
      color:var(--primary-color,#03a9f4);padding:7px 16px;border-radius:4px;
      cursor:pointer;font-size:13px;white-space:nowrap;display:inline-flex;
      align-items:center;gap:6px}
    .backup-btn:hover{background:rgba(3,169,244,.06)}
    .force-refresh-btn{
      width:100%;padding:8px;border:2px solid var(--primary-color,#03a9f4);
      background:var(--primary-color,#03a9f4);color:#fff;
      border-radius:4px;cursor:pointer;font-size:14px;font-weight:500;
      letter-spacing:.02em}
    .force-refresh-btn:hover{opacity:.9}
    .force-refresh-btn:disabled{opacity:.5;cursor:default}
    .add-btn{background:none;border:1px solid var(--primary-color,#03a9f4);
      color:var(--primary-color,#03a9f4);padding:7px 14px;border-radius:4px;
      cursor:pointer;font-size:13px;white-space:nowrap}
    .kindle-url{font-family:monospace;background:var(--secondary-background-color,#f5f5f5);
      padding:8px 12px;border-radius:4px;font-size:12px;word-break:break-all;
      border:1px solid var(--divider-color,#ddd);min-height:34px}
    .kindle-url a{color:var(--primary-color,#03a9f4)}
    .muted{color:var(--secondary-text-color,#999)}
    #toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
      background:#323232;color:#fff;padding:10px 22px;border-radius:4px;
      font-size:13px;display:none;z-index:999;white-space:nowrap}
  `; }

  _esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;")
      .replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  _toast(msg) {
    const el = this.shadowRoot.querySelector("#toast");
    if (!el) return;
    el.textContent = msg; el.style.display = "block";
    clearTimeout(this._tt);
    this._tt = setTimeout(() => { el.style.display = "none"; }, 3000);
  }
}

customElements.define("kindle-dashboard-panel", KindleDashboardPanel);
