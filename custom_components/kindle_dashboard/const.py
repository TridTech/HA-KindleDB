"""Constants for Kindle Dashboard."""

DOMAIN = "kindle_dashboard"

CONF_LOCATION_NAME = "location_name"
CONF_SCENES = "scenes"
CONF_TOGGLES = "toggles"
CONF_STATS = "stats"
CONF_SHOW_SCENES = "show_scenes"
CONF_SECTION_SCENES_LABEL = "section_scenes_label"
CONF_SECTION_TOGGLES_LABEL = "section_toggles_label"

DEFAULT_LOCATION_NAME = "Home"
DEFAULT_SHOW_SCENES = True
DEFAULT_SECTION_SCENES_LABEL = "Scenes"
DEFAULT_SECTION_TOGGLES_LABEL = "Lights & Switches"

DEFAULT_SCENES = [
    {"id": "scene_all_off",  "icon": "🌙", "name": "All Off",  "desc": "All lights off",   "service": "scene/turn_on", "entity": "scene.all_lights_off"},
    {"id": "scene_all_on",   "icon": "☀️",  "name": "All On",   "desc": "All lights on",    "service": "scene/turn_on", "entity": "scene.all_lights_on"},
    {"id": "scene_evening",  "icon": "🕯",  "name": "Evening",  "desc": "Warm & dim",       "service": "scene/turn_on", "entity": "scene.evening"},
    {"id": "scene_focus",    "icon": "💡", "name": "Focus",    "desc": "Bright white",      "service": "scene/turn_on", "entity": "scene.focus"},
]

DEFAULT_TOGGLES = [
    {"id": "light.living_room", "icon": "🛋",  "label": "Living Room", "sublabel": "light.living_room", "hide_from_status": False},
    {"id": "light.kitchen",     "icon": "🍳",  "label": "Kitchen",     "sublabel": "light.kitchen",     "hide_from_status": False},
    {"id": "light.bedroom",     "icon": "🛏",  "label": "Bedroom",     "sublabel": "light.bedroom",     "hide_from_status": False},
]

DEFAULT_STATS = [
    {"id": "sensor.indoor_temperature",  "label": "Indoor",  "unit": "°F"},
    {"id": "sensor.outdoor_temperature", "label": "Outdoor", "unit": "°F"},
    {"id": "sensor.indoor_humidity",     "label": "Humidity","unit": "%"},
]
