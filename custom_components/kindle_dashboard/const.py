"""Constants for Kindle Dashboard."""

DOMAIN = "kindle_dashboard"

CONF_LOCATION_NAME     = "location_name"
CONF_SECTIONS          = "sections"
CONF_FONT              = "font"
CONF_INLINE_UNITS      = "inline_units"
CONF_HIDE_ENTITY_NAMES = "hide_entity_names"
CONF_DASHBOARD_NAME    = "dashboard_name"

DEFAULT_LOCATION_NAME      = "Home"
DEFAULT_FONT               = "Georgia, serif"
DEFAULT_INLINE_UNITS       = False
DEFAULT_HIDE_ENTITY_NAMES  = False
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
DEFAULT_PAGE_WIDTH         = 536
DEFAULT_PAGE_HEIGHT        = 722
DEFAULT_PAGE_SCALE         = 1.0
DEFAULT_HARD_REFRESH       = False
DEFAULT_REFRESH_INTERVAL   = 60
DEFAULT_SHOW_CLOCK         = True
DEFAULT_SHOW_BATTERY       = False
DEFAULT_THEME              = "sharp"

AVAILABLE_THEMES = [
    {"value": "sharp",   "label": "Sharp (default)"},
    {"value": "soft",    "label": "Soft"},
    {"value": "ink",     "label": "Ink"},
    {"value": "minimal", "label": "Minimal"},
]

DEFAULT_SECTIONS = [
    {
        "id": "s_status",
        "type": "sensors",
        "label": "Status",
        "items": [
            {"id": "sensor.indoor_temperature",  "label": "Indoor",  "unit": "°F"},
            {"id": "sensor.outdoor_temperature", "label": "Outdoor", "unit": "°F"},
            {"id": "sensor.indoor_humidity",     "label": "Humidity","unit": "%"},
        ],
    },
    {
        "id": "s_scenes",
        "type": "scenes",
        "label": "Scenes",
        "items": [
            {"icon": "weather-night", "name": "All Off",  "desc": "All lights off", "entity": "scene.all_lights_off"},
            {"icon": "weather-sunny", "name": "All On",   "desc": "All lights on",  "entity": "scene.all_lights_on"},
        ],
    },
    {
        "id": "s_lights",
        "type": "toggles",
        "label": "Lights",
        "two_columns": False,
        "items": [
            {"id": "light.living_room", "icon": "lightbulb", "label": "Living Room", "hide_from_status": False},
            {"id": "light.kitchen",     "icon": "lightbulb", "label": "Kitchen",     "hide_from_status": False},
        ],
    },
]

# Bump when adding new top-level keys requiring migration
CONFIG_VERSION = 3
