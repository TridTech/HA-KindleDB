"""Constants for Kindle Dashboard."""

DOMAIN = "kindle_dashboard"

CONF_LOCATION_NAME  = "location_name"
CONF_SECTIONS       = "sections"
CONF_FONT           = "font"
CONF_INLINE_UNITS   = "inline_units"

DEFAULT_LOCATION_NAME = "Home"
DEFAULT_FONT          = "Georgia, serif"
DEFAULT_INLINE_UNITS  = False

# Section types
SECTION_TYPE_SENSORS = "sensors"
SECTION_TYPE_TOGGLES = "toggles"
SECTION_TYPE_SCENES  = "scenes"

# Fonts available for selection in the panel
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
            {"id": "sensor.indoor_temperature",  "label": "Indoor",  "unit": "°F", "hide_from_status": False},
            {"id": "sensor.outdoor_temperature", "label": "Outdoor", "unit": "°F", "hide_from_status": False},
            {"id": "sensor.indoor_humidity",     "label": "Humidity","unit": "%",  "hide_from_status": False},
        ],
    },
    {
        "id": "s_scenes",
        "type": SECTION_TYPE_SCENES,
        "label": "Scenes",
        "items": [
            {"id": "scene_all_off", "icon": "🌙", "name": "All Off",  "desc": "All lights off", "entity": "scene.all_lights_off"},
            {"id": "scene_all_on",  "icon": "☀️",  "name": "All On",   "desc": "All lights on",  "entity": "scene.all_lights_on"},
            {"id": "scene_evening", "icon": "🕯",  "name": "Evening",  "desc": "Warm & dim",     "entity": "scene.evening"},
            {"id": "scene_focus",   "icon": "💡", "name": "Focus",    "desc": "Bright white",    "entity": "scene.focus"},
        ],
    },
    {
        "id": "s_lights",
        "type": SECTION_TYPE_TOGGLES,
        "label": "Lights & Switches",
        "items": [
            {"id": "light.living_room", "icon": "🛋",  "label": "Living Room", "hide_from_status": False},
            {"id": "light.kitchen",     "icon": "🍳",  "label": "Kitchen",     "hide_from_status": False},
            {"id": "light.bedroom",     "icon": "🛏",  "label": "Bedroom",     "hide_from_status": False},
        ],
    },
]
