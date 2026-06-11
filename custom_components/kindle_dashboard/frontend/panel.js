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

const SECTION_TYPES = [
  { value: "sensors", label: "Sensors (read-only display)" },
  { value: "toggles", label: "Toggles (lights & switches)" },
  { value: "scenes",  label: "Scenes (tap to activate)"   },
];

const MDI = {"account": "\uF0004", "account-group": "\uF0849", "account-group-outline": "\uF0B58", "account-off": "\uF0012", "account-off-outline": "\uF0BE7", "account-outline": "\uF0013", "air-conditioner": "\uF001B", "air-filter": "\uF0D43", "air-humidifier": "\uF1099", "air-humidifier-off": "\uF1466", "air-purifier": "\uF0D44", "air-purifier-off": "\uF1B57", "alarm": "\uF0020", "alarm-check": "\uF0021", "alarm-light": "\uF078F", "alarm-light-off": "\uF171E", "alarm-light-off-outline": "\uF171F", "alarm-light-outline": "\uF0BEA", "alarm-off": "\uF0023", "alarm-panel": "\uF15C4", "alarm-panel-outline": "\uF15C5", "alarm-plus": "\uF0024", "awning": "\uF1B87", "awning-outline": "\uF1B88", "bathtub": "\uF1818", "bathtub-outline": "\uF1819", "battery": "\uF0079", "battery-10": "\uF007A", "battery-10-bluetooth": "\uF093E", "battery-20": "\uF007B", "battery-20-bluetooth": "\uF093F", "battery-30": "\uF007C", "battery-30-bluetooth": "\uF0940", "battery-40": "\uF007D", "battery-40-bluetooth": "\uF0941", "battery-50": "\uF007E", "battery-50-bluetooth": "\uF0942", "battery-60": "\uF007F", "battery-60-bluetooth": "\uF0943", "battery-70": "\uF0080", "battery-70-bluetooth": "\uF0944", "battery-80": "\uF0081", "battery-80-bluetooth": "\uF0945", "battery-90": "\uF0082", "battery-90-bluetooth": "\uF0946", "battery-alert": "\uF0083", "battery-alert-bluetooth": "\uF0947", "battery-alert-variant": "\uF10CC", "battery-alert-variant-outline": "\uF10CD", "battery-arrow-down": "\uF17DE", "battery-arrow-down-outline": "\uF17DF", "battery-arrow-up": "\uF17E0", "battery-arrow-up-outline": "\uF17E1", "battery-bluetooth": "\uF0948", "battery-bluetooth-variant": "\uF0949", "battery-charging": "\uF0084", "battery-charging-10": "\uF089C", "battery-charging-100": "\uF0085", "battery-charging-20": "\uF0086", "battery-charging-30": "\uF0087", "battery-charging-40": "\uF0088", "battery-charging-50": "\uF089D", "battery-charging-60": "\uF0089", "battery-charging-70": "\uF089E", "battery-charging-80": "\uF008A", "battery-charging-90": "\uF008B", "battery-charging-high": "\uF12A6", "battery-charging-low": "\uF12A4", "battery-charging-medium": "\uF12A5", "battery-charging-outline": "\uF089F", "battery-charging-wireless": "\uF0807", "battery-charging-wireless-10": "\uF0808", "battery-charging-wireless-20": "\uF0809", "battery-charging-wireless-30": "\uF080A", "battery-charging-wireless-40": "\uF080B", "battery-charging-wireless-50": "\uF080C", "battery-charging-wireless-60": "\uF080D", "battery-charging-wireless-70": "\uF080E", "battery-charging-wireless-80": "\uF080F", "battery-charging-wireless-90": "\uF0810", "battery-charging-wireless-alert": "\uF0811", "battery-charging-wireless-outline": "\uF0812", "battery-clock": "\uF19E5", "battery-clock-outline": "\uF19E6", "battery-heart": "\uF120F", "battery-heart-outline": "\uF1210", "battery-heart-variant": "\uF1211", "battery-high": "\uF12A3", "battery-low": "\uF12A1", "battery-medium": "\uF12A2", "battery-minus": "\uF17E4", "battery-minus-outline": "\uF17E5", "battery-minus-variant": "\uF008C", "battery-off": "\uF125D", "battery-off-outline": "\uF125E", "battery-outline": "\uF008E", "battery-plus": "\uF17E6", "battery-plus-outline": "\uF17E7", "battery-plus-variant": "\uF008F", "battery-remove": "\uF17E8", "battery-remove-outline": "\uF17E9", "battery-sync": "\uF1834", "battery-sync-outline": "\uF1835", "battery-unknown": "\uF0091", "battery-unknown-bluetooth": "\uF094A", "bed": "\uF02E3", "bed-empty": "\uF08A0", "bed-king": "\uF0FD2", "bed-outline": "\uF0099", "bed-queen": "\uF0FD0", "bed-single": "\uF106D", "bell": "\uF009A", "bell-alert": "\uF0D59", "bell-alert-outline": "\uF0E81", "bell-cancel": "\uF13E7", "bell-cancel-outline": "\uF13E8", "bell-check": "\uF11E5", "bell-check-outline": "\uF11E6", "bell-minus": "\uF13E9", "bell-minus-outline": "\uF13EA", "bell-off": "\uF009B", "bell-outline": "\uF009C", "bell-plus": "\uF009D", "bell-plus-outline": "\uF0A92", "bell-remove": "\uF13EB", "bell-remove-outline": "\uF13EC", "bell-ring": "\uF009E", "bell-ring-outline": "\uF009F", "bell-sleep": "\uF00A0", "bell-sleep-outline": "\uF0A93", "bicycle": "\uF109C", "blender": "\uF0CEB", "blender-outline": "\uF181A", "blinds": "\uF00AC", "blinds-horizontal": "\uF1A2B", "blinds-horizontal-closed": "\uF1A2C", "blinds-open": "\uF1011", "blinds-vertical": "\uF1A2D", "blinds-vertical-closed": "\uF1A2E", "bluetooth": "\uF00AF", "bluetooth-connect": "\uF00B1", "bluetooth-off": "\uF00B2", "bluetooth-transfer": "\uF00B4", "camera": "\uF0100", "camera-iris": "\uF0104", "camera-off": "\uF05DF", "camera-outline": "\uF0D5D", "car": "\uF010B", "car-electric": "\uF0B6C", "car-electric-outline": "\uF15B5", "car-off": "\uF0E1C", "car-outline": "\uF14ED", "cast": "\uF0118", "cast-connected": "\uF0119", "cast-off": "\uF078A", "cctv": "\uF07AE", "cctv-off": "\uF185F", "ceiling-light": "\uF0769", "ceiling-light-multiple": "\uF18DD", "ceiling-light-multiple-outline": "\uF18DE", "ceiling-light-outline": "\uF17C7", "coffee": "\uF0176", "coffee-maker": "\uF109F", "coffee-maker-outline": "\uF181B", "coffee-off": "\uF0FAA", "coffee-outline": "\uF06CA", "cog": "\uF0493", "cog-off": "\uF13CE", "cog-off-outline": "\uF13CF", "cog-outline": "\uF08BB", "cog-refresh": "\uF145E", "cog-refresh-outline": "\uF145F", "cog-sync": "\uF1460", "cog-sync-outline": "\uF1461", "counter": "\uF0199", "countertop": "\uF181C", "countertop-outline": "\uF181D", "curtains": "\uF1846", "curtains-closed": "\uF1847", "desk": "\uF1239", "desk-lamp": "\uF095F", "desk-lamp-off": "\uF1B1F", "desk-lamp-on": "\uF1B20", "dishwasher": "\uF0AAC", "dishwasher-alert": "\uF11B8", "dishwasher-off": "\uF11B9", "door-closed": "\uF081B", "door-closed-lock": "\uF10AF", "door-open": "\uF081C", "door-sliding": "\uF181E", "door-sliding-open": "\uF1820", "electric-switch": "\uF0E9F", "electric-switch-closed": "\uF10D9", "ev-plug-ccs1": "\uF1519", "ev-plug-ccs2": "\uF151A", "ev-plug-chademo": "\uF151B", "ev-plug-tesla": "\uF151C", "ev-plug-type1": "\uF151D", "ev-plug-type2": "\uF151E", "ev-station": "\uF05F1", "fan": "\uF0210", "fan-alert": "\uF146C", "fan-auto": "\uF171D", "fan-chevron-down": "\uF146D", "fan-chevron-up": "\uF146E", "fan-clock": "\uF1A3A", "fan-minus": "\uF1470", "fan-off": "\uF081D", "fan-plus": "\uF146F", "fan-remove": "\uF1471", "fan-speed-1": "\uF1472", "fan-speed-2": "\uF1473", "fan-speed-3": "\uF1474", "fire": "\uF0238", "fire-alert": "\uF15D7", "fire-extinguisher": "\uF0EF2", "fire-hydrant": "\uF1137", "fire-off": "\uF1722", "flash": "\uF0241", "flash-auto": "\uF0242", "flash-off": "\uF0243", "flash-outline": "\uF06D5", "flash-red-eye": "\uF067B", "flash-triangle": "\uF1B1D", "flash-triangle-outline": "\uF1B1E", "floor-lamp": "\uF08DD", "floor-lamp-dual": "\uF1040", "floor-lamp-dual-outline": "\uF17CE", "floor-lamp-outline": "\uF17C8", "floor-lamp-torchiere": "\uF1747", "floor-lamp-torchiere-outline": "\uF17D6", "floor-lamp-torchiere-variant": "\uF1041", "floor-lamp-torchiere-variant-outline": "\uF17CF", "flower": "\uF024A", "flower-outline": "\uF09F0", "flower-pollen": "\uF1885", "flower-pollen-outline": "\uF1886", "fridge": "\uF0290", "fridge-bottom": "\uF0292", "fridge-industrial": "\uF15EE", "fridge-industrial-off": "\uF15F1", "fridge-industrial-off-outline": "\uF15F2", "fridge-industrial-outline": "\uF15F3", "fridge-off": "\uF11AF", "fridge-off-outline": "\uF11B0", "fridge-outline": "\uF028F", "fridge-top": "\uF0291", "fridge-variant": "\uF15F4", "fridge-variant-off": "\uF15F7", "fridge-variant-outline": "\uF15F9", "garage": "\uF06D9", "garage-lock": "\uF17FB", "garage-open": "\uF06DA", "garage-open-variant": "\uF12D4", "garage-variant": "\uF12D3", "garage-variant-lock": "\uF17FC", "gas-cylinder": "\uF0647", "gate": "\uF0299", "gate-alert": "\uF17F8", "gate-and": "\uF08E1", "gate-arrow-left": "\uF17F7", "gate-arrow-right": "\uF1169", "gate-open": "\uF116A", "gauge": "\uF029A", "gauge-empty": "\uF0873", "gauge-full": "\uF0874", "gauge-low": "\uF0875", "grass": "\uF1510", "heat-pump": "\uF1A43", "heat-pump-outline": "\uF1A44", "heat-wave": "\uF1A45", "home": "\uF02DC", "home-alert": "\uF087B", "home-alert-outline": "\uF15D0", "home-automation": "\uF07D1", "home-city": "\uF0D15", "home-city-outline": "\uF0D16", "home-flood": "\uF0EFA", "home-modern": "\uF02DD", "home-off": "\uF1A46", "home-off-outline": "\uF1A47", "home-outline": "\uF06A1", "hub": "\uF1C95", "hub-outline": "\uF1C96", "human": "\uF02E6", "human-greeting": "\uF17C4", "hvac": "\uF1352", "hvac-off": "\uF159E", "kettle": "\uF05FA", "kettle-off": "\uF131B", "kettle-outline": "\uF0F56", "lamp": "\uF06B5", "lamp-outline": "\uF17D0", "lamps": "\uF1576", "lamps-outline": "\uF17D1", "leaf": "\uF032A", "leak": "\uF0DD7", "leak-off": "\uF0DD8", "led-off": "\uF032B", "led-on": "\uF032C", "led-outline": "\uF032D", "led-strip": "\uF07D6", "led-strip-variant": "\uF1051", "led-strip-variant-off": "\uF1A4B", "led-variant-off": "\uF032E", "led-variant-on": "\uF032F", "led-variant-outline": "\uF0330", "lightbulb": "\uF0335", "lightbulb-auto": "\uF1800", "lightbulb-auto-outline": "\uF1801", "lightbulb-cfl": "\uF1208", "lightbulb-cfl-off": "\uF1209", "lightbulb-cfl-spiral": "\uF1275", "lightbulb-cfl-spiral-off": "\uF12C3", "lightbulb-fluorescent-tube": "\uF1804", "lightbulb-fluorescent-tube-outline": "\uF1805", "lightbulb-group": "\uF1253", "lightbulb-group-off": "\uF12CD", "lightbulb-group-off-outline": "\uF12CE", "lightbulb-group-outline": "\uF1254", "lightbulb-multiple": "\uF1255", "lightbulb-multiple-off": "\uF12CF", "lightbulb-multiple-off-outline": "\uF12D0", "lightbulb-multiple-outline": "\uF1256", "lightbulb-night": "\uF1A4C", "lightbulb-night-outline": "\uF1A4D", "lightbulb-off": "\uF0E4F", "lightbulb-off-outline": "\uF0E50", "lightbulb-on": "\uF06E8", "lightbulb-on-10": "\uF1A4E", "lightbulb-on-20": "\uF1A4F", "lightbulb-on-30": "\uF1A50", "lightbulb-on-40": "\uF1A51", "lightbulb-on-50": "\uF1A52", "lightbulb-on-60": "\uF1A53", "lightbulb-on-70": "\uF1A54", "lightbulb-on-80": "\uF1A55", "lightbulb-on-90": "\uF1A56", "lightbulb-on-outline": "\uF06E9", "lightbulb-outline": "\uF0336", "lightbulb-question": "\uF19E3", "lightbulb-question-outline": "\uF19E4", "lightbulb-spot": "\uF17F4", "lightbulb-spot-off": "\uF17F5", "lightbulb-variant": "\uF1802", "lightbulb-variant-outline": "\uF1803", "lightning-bolt": "\uF140B", "lightning-bolt-circle": "\uF0820", "lightning-bolt-outline": "\uF140C", "lock": "\uF033E", "lock-alert": "\uF08EE", "lock-alert-outline": "\uF15D1", "lock-check": "\uF139A", "lock-check-outline": "\uF16A8", "lock-clock": "\uF097F", "lock-minus": "\uF16A9", "lock-minus-outline": "\uF16AA", "lock-off": "\uF1671", "lock-off-outline": "\uF1672", "lock-open": "\uF033F", "lock-open-alert": "\uF139B", "lock-open-alert-outline": "\uF15D2", "lock-open-check": "\uF139C", "lock-open-check-outline": "\uF16AB", "lock-open-minus": "\uF16AC", "lock-open-minus-outline": "\uF16AD", "lock-open-outline": "\uF0340", "lock-open-plus": "\uF16AE", "lock-open-plus-outline": "\uF16AF", "lock-open-remove": "\uF16B0", "lock-open-remove-outline": "\uF16B1", "lock-open-variant": "\uF0FC6", "lock-open-variant-outline": "\uF0FC7", "lock-outline": "\uF0341", "lock-pattern": "\uF06EA", "lock-plus": "\uF05FB", "lock-plus-outline": "\uF16B2", "lock-remove": "\uF16B3", "lock-remove-outline": "\uF16B4", "lock-reset": "\uF0773", "lock-smart": "\uF08B2", "meter-electric": "\uF1A57", "meter-electric-outline": "\uF1A58", "meter-gas": "\uF1A59", "meter-gas-outline": "\uF1A5A", "microwave": "\uF0C99", "microwave-off": "\uF1423", "molecule-co": "\uF12FE", "molecule-co2": "\uF07E4", "motion-sensor": "\uF0D91", "motion-sensor-off": "\uF1435", "motorbike": "\uF037C", "nas": "\uF08F3", "outdoor-lamp": "\uF1054", "pool": "\uF0606", "pool-thermometer": "\uF1A5F", "power": "\uF0425", "power-off": "\uF0902", "power-plug": "\uF06A5", "power-plug-off": "\uF06A6", "power-plug-off-outline": "\uF1424", "power-plug-outline": "\uF1425", "power-sleep": "\uF0904", "power-socket": "\uF0427", "power-socket-au": "\uF0905", "power-socket-de": "\uF1107", "power-socket-eu": "\uF07E7", "power-socket-fr": "\uF1108", "power-socket-jp": "\uF1109", "power-socket-uk": "\uF07E8", "power-socket-us": "\uF07E9", "power-standby": "\uF0906", "projector": "\uF042E", "projector-off": "\uF1A23", "projector-screen": "\uF042F", "projector-screen-off": "\uF180D", "projector-screen-outline": "\uF1724", "projector-screen-variant": "\uF180F", "projector-screen-variant-off": "\uF1810", "projector-screen-variant-outline": "\uF1812", "radiator": "\uF0438", "radiator-disabled": "\uF0AD7", "radiator-off": "\uF0AD8", "remote": "\uF0454", "remote-off": "\uF0EC4", "remote-tv": "\uF0EC5", "remote-tv-off": "\uF0EC6", "robot-mower": "\uF11F7", "robot-vacuum": "\uF070D", "robot-vacuum-off": "\uF1C01", "robot-vacuum-variant": "\uF0908", "robot-vacuum-variant-off": "\uF1C02", "roller-shade": "\uF1A6B", "roller-shade-closed": "\uF1A6C", "router": "\uF11E2", "router-network": "\uF1087", "router-wireless": "\uF0469", "router-wireless-off": "\uF15A3", "router-wireless-settings": "\uF0A69", "run": "\uF070E", "scooter": "\uF15BD", "server": "\uF048B", "server-network": "\uF048D", "shield": "\uF0498", "shield-home": "\uF068A", "shield-home-outline": "\uF0CCB", "shield-lock": "\uF099D", "shield-lock-open": "\uF199A", "shield-lock-outline": "\uF0CCC", "shower": "\uF09A0", "shower-head": "\uF09A1", "sleep": "\uF04B2", "smoke-detector": "\uF0392", "smoke-detector-alert": "\uF192E", "smoke-detector-off": "\uF1809", "smoke-detector-variant": "\uF180B", "smoke-detector-variant-alert": "\uF1930", "smoke-detector-variant-off": "\uF180C", "snowflake": "\uF0717", "snowflake-off": "\uF14E3", "snowflake-thermometer": "\uF1A71", "sofa": "\uF04B9", "sofa-outline": "\uF156D", "sofa-single": "\uF156E", "sofa-single-outline": "\uF156F", "solar-panel": "\uF0D9B", "solar-panel-large": "\uF0D9C", "solar-power": "\uF0A72", "solar-power-variant": "\uF1A73", "solar-power-variant-outline": "\uF1A74", "speaker": "\uF04C3", "speaker-bluetooth": "\uF09A2", "speaker-multiple": "\uF0D38", "speaker-off": "\uF04C4", "speaker-pause": "\uF1B73", "speaker-play": "\uF1B72", "speaker-stop": "\uF1B74", "speaker-wireless": "\uF071F", "sprout": "\uF0E66", "sprout-outline": "\uF0E67", "stove": "\uF04DE", "string-lights": "\uF12BA", "string-lights-off": "\uF12BB", "table-chair": "\uF1061", "table-furniture": "\uF05BC", "television": "\uF0502", "television-ambient-light": "\uF1356", "television-box": "\uF0839", "television-off": "\uF083B", "television-pause": "\uF0F89", "television-play": "\uF0ECF", "television-shimmer": "\uF1110", "television-stop": "\uF0F8A", "thermometer": "\uF050F", "thermometer-auto": "\uF1B0F", "thermometer-bluetooth": "\uF1895", "thermometer-check": "\uF1A7F", "thermometer-chevron-down": "\uF0E02", "thermometer-chevron-up": "\uF0E03", "thermometer-high": "\uF10C2", "thermometer-lines": "\uF0510", "thermometer-low": "\uF10C3", "thermometer-minus": "\uF0E04", "thermometer-off": "\uF1531", "thermometer-plus": "\uF0E05", "thermometer-probe": "\uF1B2B", "thermometer-probe-off": "\uF1B2C", "thermometer-water": "\uF1A80", "thermostat": "\uF0393", "thermostat-auto": "\uF1B17", "thermostat-box": "\uF0891", "thermostat-cog": "\uF1C80", "toaster": "\uF1063", "toaster-off": "\uF11B7", "toaster-oven": "\uF0CD3", "toggle-switch": "\uF0521", "toggle-switch-off": "\uF0522", "toggle-switch-off-outline": "\uF0A19", "toggle-switch-outline": "\uF0A1A", "toggle-switch-variant": "\uF1A25", "toggle-switch-variant-off": "\uF1A26", "toilet": "\uF09AB", "transmission-tower": "\uF0D3E", "transmission-tower-export": "\uF192C", "transmission-tower-import": "\uF192D", "transmission-tower-off": "\uF19DD", "tree": "\uF0531", "tree-outline": "\uF0E69", "tumble-dryer": "\uF0917", "tumble-dryer-alert": "\uF11BA", "tumble-dryer-off": "\uF11BB", "tune": "\uF062E", "tune-variant": "\uF1542", "tune-vertical": "\uF066A", "tune-vertical-variant": "\uF1543", "umbrella": "\uF054A", "umbrella-closed": "\uF09B0", "umbrella-outline": "\uF054B", "video": "\uF0567", "video-off": "\uF0568", "video-outline": "\uF0BDC", "volume-high": "\uF057E", "volume-low": "\uF057F", "volume-medium": "\uF0580", "volume-mute": "\uF075F", "volume-off": "\uF0581", "walk": "\uF0583", "washing-machine": "\uF072A", "washing-machine-alert": "\uF11BC", "washing-machine-off": "\uF11BD", "water": "\uF058C", "water-alert": "\uF1502", "water-boiler": "\uF0F92", "water-boiler-alert": "\uF11B3", "water-boiler-off": "\uF11B4", "water-off": "\uF058D", "water-outline": "\uF0E0A", "water-percent": "\uF058E", "water-percent-alert": "\uF1509", "weather-cloudy": "\uF0590", "weather-fog": "\uF0591", "weather-night": "\uF0594", "weather-partly-cloudy": "\uF0595", "weather-rainy": "\uF0597", "weather-snowy": "\uF0598", "weather-sunny": "\uF0599", "weather-sunset": "\uF059A", "weather-sunset-down": "\uF059B", "weather-sunset-up": "\uF059C", "weather-windy": "\uF059D", "wifi": "\uF05A9", "wifi-off": "\uF05AA", "wifi-strength-1": "\uF091F", "wifi-strength-2": "\uF0922", "wifi-strength-3": "\uF0925", "wifi-strength-4": "\uF0928", "wifi-strength-alert-outline": "\uF092B", "wifi-strength-off": "\uF092D", "wifi-strength-off-outline": "\uF092E", "window-closed": "\uF05AE", "window-closed-variant": "\uF11DB", "window-open": "\uF05B1", "window-open-variant": "\uF11DC", "window-shutter": "\uF111C", "window-shutter-alert": "\uF111D", "window-shutter-open": "\uF111E", "z-wave": "\uF0AEA", "zigbee": "\uF0D41"};

const ALL_DOMAINS = ["light","switch","scene","sensor","input_boolean",
                     "media_player","fan","cover","climate","lock"];

class KindleDashboardPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass     = null;
    this._config   = null;
    this._entities = [];
    this._mounted  = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) this._init();
  }
  set panel(p) {}

  async _init() {
    await Promise.all([this._loadConfig(), this._loadEntities()]);
    this._mount();
  }

  async _loadConfig() {
    try { this._config = await this._hass.callWS({ type: "kindle_dashboard/get_config" }); }
    catch(e) { this._config = {}; }
  }

  async _loadEntities() {
    try {
      const r = await this._hass.callWS({ type: "kindle_dashboard/get_entities", domains: ALL_DOMAINS });
      this._entities = r.entities || [];
    } catch(e) { this._entities = []; }
  }

  // ── MOUNT: build static chrome once, wire listeners once ───────────────

  _mount() {
    this.shadowRoot.innerHTML = `<style>${this._css()}</style>
      <div class="top-bar">
        <h1>📱 Kindle Dashboard</h1>
        <span id="topbar-link"></span>
      </div>
      <div class="save-bar" id="save-bar">
        <span>Unsaved changes</span>
        <button id="discard-btn">Discard</button>
        <button class="primary" id="save-btn">Save</button>
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
              <div class="kindle-url" id="token-url-display"></div>
            </div>
          </div>
        </div>

        <div class="card" id="card-general">
          <div class="card-header"><span class="icon">⚙️</span> General</div>
          <div class="card-body">
            <div class="form-row">
              <label>Location Name</label>
              <input type="text" id="location-name" placeholder="Home">
            </div>
            <div class="form-row two-col">
              <div>
                <label>Font</label>
                <select id="font-select"></select>
              </div>
              <div>
                <label>Sensor Units</label>
                <label class="opt-row">
                  <input type="checkbox" id="inline-units">
                  <span>Inline <em>(22 °F)</em></span>
                </label>
              </div>
            </div>
            <div class="form-row two-col">
              <div>
                <label>Page Width</label>
                <div class="num-row">
                  <input type="number" id="page-width" min="320" max="1920" step="10">
                  <span class="num-unit">px</span>
                </div>
              </div>
              <div>
                <label>Page Height</label>
                <div class="num-row">
                  <input type="number" id="page-height" min="320" max="2560" step="10">
                  <span class="num-unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row three-col">
              <div>
                <label>Label font size</label>
                <div class="num-row">
                  <input type="number" id="label-font-size" min="6" max="32" step="1">
                  <span class="num-unit">px</span>
                </div>
              </div>
              <div>
                <label>ID / Unit font size</label>
                <div class="num-row">
                  <input type="number" id="sub-font-size" min="6" max="24" step="1">
                  <span class="num-unit">px</span>
                </div>
              </div>
              <div>
                <label>Value font size</label>
                <div class="num-row">
                  <input type="number" id="value-font-size" min="8" max="48" step="1">
                  <span class="num-unit">px</span>
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
    const token    = cfg.kindle_token || "";
    const tokenUrl = token
      ? `${window.location.origin}/api/kindle_dashboard/kindle?token=${encodeURIComponent(token)}`
      : "";
    root.querySelector("#kindle-token").value = token;
    const urlEl = root.querySelector("#token-url-display");
    urlEl.innerHTML = tokenUrl
      ? `<a href="${this._esc(tokenUrl)}" target="_blank">${this._esc(tokenUrl)}</a>`
      : `<span class="muted">Paste a token above and save to generate the URL</span>`;
    const topLink = root.querySelector("#topbar-link");
    topLink.innerHTML = tokenUrl
      ? `<a href="${this._esc(tokenUrl)}" target="_blank">Open Kindle View ↗</a>` : "";

    // General
    root.querySelector("#location-name").value      = cfg.location_name || "Home";
    root.querySelector("#inline-units").checked     = !!cfg.inline_units;
    root.querySelector("#page-width").value         = cfg.page_width  ?? 600;
    root.querySelector("#page-height").value        = cfg.page_height ?? 800;
    root.querySelector("#label-font-size").value    = cfg.label_font_size  ?? 13;
    root.querySelector("#sub-font-size").value      = cfg.sub_font_size    ?? 10;
    root.querySelector("#value-font-size").value    = cfg.value_font_size  ?? 18;


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
          <label class="two-col-wrap" title="Hide entity IDs in this section">
            <input type="checkbox" class="sec-hideids"${sec.hide_entity_ids?" checked":""}> Hide IDs
          </label>
          <div class="sec-actions">
            <button class="btn-move-sec" data-dir="-1">↑</button>
            <button class="btn-move-sec" data-dir="1">↓</button>
            <button class="btn-del-sec">🗑</button>
          </div>
        </div>
        <div class="sec-items${twoCol?" two-col-items":""}">
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
        <select class="i-icon-sel"><option value="">— icon —</option>${Object.entries(MDI).map(([n,c]) => `<option value="${c}"${item.icon===c?" selected":""}>${n}</option>`).join("")}</select>
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
      <select class="i-icon-sel"><option value="">— icon —</option>${Object.entries(MDI).map(([n,c]) => `<option value="${c}"${item.icon===c?" selected":""}>${n}</option>`).join("")}</select>
      <select class="i-entity i-wide"><option value="">— pick entity —</option>${opts}</select>
      <input class="i-label i-mid" type="text" placeholder="Label" value="${this._esc(item.label||"")}">
      <label class="hide-wrap" title="Exclude from light status strip">
        <input type="checkbox" class="i-hide"${item.hide_from_status?" checked":""}> hide
      </label>
      ${ctrl}</div>`;
  }

  // ── LISTENERS — wired once in _mount ────────────────────────────────────

  _wireListeners() {
    const root = this.shadowRoot;

    // Any input/change → mark dirty; font select also updates preview
    root.addEventListener("input",  () => this._markDirty());
    root.addEventListener("change", (e) => {
      this._markDirty();
      if (e.target.id === "font-select") {
        if (!this._config) this._config = {};
        this._config.font = e.target.value;
        e.target.style.fontFamily = e.target.value;
      }
    });

    // Delegated click handler
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.id === "btn-add-section") { this._doAddSection();  return; }
      if (btn.id === "save-btn")        { this._doSave();        return; }
      if (btn.id === "discard-btn")     { this._config = null; this._init(); return; }

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
    this.shadowRoot.querySelector("#save-bar")?.classList.add("visible");
  }

  // ── COLLECT: read current DOM state into a plain config object ──────────
  // This is the ONLY place we read from the DOM back into data.

  _collectConfig() {
    const root = this.shadowRoot;
    const cfg  = Object.assign({}, this._config || {});

    cfg.location_name    = root.querySelector("#location-name")?.value.trim() || "Home";
    cfg.kindle_token     = root.querySelector("#kindle-token")?.value.trim()  || "";
    cfg.font             = root.querySelector("#font-select")?.value           || "Georgia, serif";
    cfg.inline_units     = root.querySelector("#inline-units")?.checked        || false;
    cfg.page_width       = parseInt(root.querySelector("#page-width")?.value)  || 600;
    cfg.page_height      = parseInt(root.querySelector("#page-height")?.value) || 800;
    cfg.label_font_size  = parseInt(root.querySelector("#label-font-size")?.value)  || 13;
    cfg.sub_font_size    = parseInt(root.querySelector("#sub-font-size")?.value)    || 10;
    cfg.value_font_size  = parseInt(root.querySelector("#value-font-size")?.value)  || 18;


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

  async _doSave() {
    const cfg = this._collectConfig();
    // Strip items with no entity before persisting
    cfg.sections.forEach(sec => {
      sec.items = sec.items.filter(item =>
        sec.type === "scenes" ? !!item.entity : !!item.id
      );
    });
    try {
      await this._hass.callWS({ type: "kindle_dashboard/save_config", config: cfg });
      this._config = cfg;
      this.shadowRoot.querySelector("#save-bar")?.classList.remove("visible");
      this._toast("✓ Saved — reload Kindle page to apply");
      this._paintSections(); // reflect any filtering
    } catch(e) { this._toast("Error saving: " + e.message); }
  }

  // ── CSS ──────────────────────────────────────────────────────────────────

  _css() { return `
    @font-face{font-family:'MDI';src:url('/kindle_dashboard_files/mdi-kindle.woff') format('woff');font-weight:normal;font-style:normal}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :host{display:block;min-height:100%;background:var(--primary-background-color,#fafafa);
      color:var(--primary-text-color,#212121);
      font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif);font-size:14px}
    .top-bar{background:var(--app-header-background-color,var(--primary-color,#03a9f4));
      color:var(--app-header-text-color,#fff);padding:0 16px;height:56px;
      display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:10;
      box-shadow:0 2px 4px rgba(0,0,0,.18)}
    .top-bar h1{font-size:20px;font-weight:500;flex:1}
    .top-bar a{color:inherit;font-size:13px;opacity:.85;text-decoration:none;
      border:1px solid rgba(255,255,255,.5);padding:4px 10px;border-radius:4px;white-space:nowrap}
    .save-bar{display:none;position:sticky;top:56px;z-index:9;
      background:var(--warning-color,#ff9800);color:#fff;
      padding:8px 16px;align-items:center;gap:10px;font-size:13px}
    .save-bar.visible{display:flex}
    .save-bar span{flex:1}
    .save-bar button{background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.5);
      color:#fff;padding:5px 14px;border-radius:4px;cursor:pointer;font-size:13px}
    .save-bar button.primary{background:rgba(0,0,0,.18);font-weight:600}
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
    .sec-items.two-col-items{display:grid;grid-template-columns:1fr 1fr;gap:6px}
    .item-row{display:flex;align-items:center;gap:5px;flex-wrap:nowrap;
      background:var(--primary-background-color,#fff);
      border:1px solid var(--divider-color,#e0e0e0);border-radius:4px;padding:5px 7px}
    /* item-row input sizing handled above */
    .i-icon-sel{flex:0 0 120px!important;min-width:0;font-size:11px}
    .i-wide{flex:2 1 120px;min-width:80px}
    .i-mid{flex:1 1 80px;min-width:60px}
    .i-unit{width:50px!important;flex-shrink:0}
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
