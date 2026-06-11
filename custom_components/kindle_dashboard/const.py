"""Constants for Kindle Dashboard."""

DOMAIN = "kindle_dashboard"

CONF_LOCATION_NAME  = "location_name"
CONF_SECTIONS       = "sections"
CONF_FONT           = "font"
CONF_INLINE_UNITS   = "inline_units"
CONF_HIDE_ENTITY_NAMES = "hide_entity_names"

DEFAULT_LOCATION_NAME      = "Home"
DEFAULT_FONT               = "Georgia, serif"
DEFAULT_INLINE_UNITS       = False
DEFAULT_HIDE_ENTITY_NAMES  = False
DEFAULT_PAGE_WIDTH         = 600
DEFAULT_PAGE_HEIGHT        = 800
DEFAULT_PAGE_SCALE         = 1.0
DEFAULT_LABEL_FONT_SIZE    = 13
DEFAULT_LABEL_BOLD         = False
DEFAULT_LABEL_ITALIC       = False
DEFAULT_LABEL_UNDERLINE    = False
DEFAULT_SUB_FONT_SIZE      = 10
DEFAULT_SUB_BOLD           = False
DEFAULT_SUB_ITALIC         = False
DEFAULT_SUB_UNDERLINE      = False
DEFAULT_VALUE_FONT_SIZE    = 18
DEFAULT_VALUE_BOLD         = True
DEFAULT_VALUE_ITALIC       = False
DEFAULT_VALUE_UNDERLINE    = False

SECTION_TYPE_SENSORS = "sensors"
SECTION_TYPE_TOGGLES = "toggles"
SECTION_TYPE_SCENES  = "scenes"

AVAILABLE_FONTS = [
    {"label": "Georgia (default)",   "value": "Georgia, serif"},
    {"label": "Courier New",         "value": "'Courier New', monospace"},
    {"label": "Times New Roman",     "value": "'Times New Roman', serif"},
    {"label": "Arial",               "value": "Arial, sans-serif"},
    {"label": "Helvetica",           "value": "Helvetica, sans-serif"},
    {"label": "Verdana",             "value": "Verdana, sans-serif"},
    {"label": "Palatino",            "value": "Palatino, serif"},
    {"label": "Bookman",             "value": "Bookman, serif"},
]

DEFAULT_SECTIONS = [
    {
        "id": "s_status",
        "type": SECTION_TYPE_SENSORS,
        "label": "Status",
        "items": [
            {"id": "sensor.indoor_temperature",  "label": "Indoor",  "unit": "°F"},
            {"id": "sensor.outdoor_temperature", "label": "Outdoor", "unit": "°F"},
            {"id": "sensor.indoor_humidity",     "label": "Humidity","unit": "%"},
        ],
    },
    {
        "id": "s_scenes",
        "type": SECTION_TYPE_SCENES,
        "label": "Scenes",
        "items": [
            {"icon": "🌙", "name": "All Off",  "desc": "All lights off", "entity": "scene.all_lights_off"},
            {"icon": "☀️",  "name": "All On",   "desc": "All lights on",  "entity": "scene.all_lights_on"},
            {"icon": "🕯",  "name": "Evening",  "desc": "Warm & dim",     "entity": "scene.evening"},
            {"icon": "💡", "name": "Focus",    "desc": "Bright white",    "entity": "scene.focus"},
        ],
    },
    {
        "id": "s_lights",
        "type": SECTION_TYPE_TOGGLES,
        "label": "Lights & Switches",
        "two_columns": False,
        "items": [
            {"id": "light.living_room", "icon": "🛋",  "label": "Living Room", "hide_from_status": False},
            {"id": "light.kitchen",     "icon": "🍳",  "label": "Kitchen",     "hide_from_status": False},
            {"id": "light.bedroom",     "icon": "🛏",  "label": "Bedroom",     "hide_from_status": False},
        ],
    },
]

# Current config schema version — bump when adding new top-level keys
CONFIG_VERSION = 2
