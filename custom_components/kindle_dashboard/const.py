"""Constants for Kindle Dashboard."""

DOMAIN = "kindle_dashboard"

CONF_LOCATION_NAME = "location_name"
CONF_SCENES = "scenes"
CONF_TOGGLES = "toggles"
CONF_STATS = "stats"

DEFAULT_LOCATION_NAME = "Home"

DEFAULT_SCENES = [
    {"id": "scene_all_off",  "icon": "🌙", "name": "All Off",  "desc": "All lights off",   "service": "scene/turn_on", "entity": "scene.all_lights_off"},
    {"id": "scene_all_on",   "icon": "☀️",  "name": "All On",   "desc": "All lights on",    "service": "scene/turn_on", "entity": "scene.all_lights_on"},
    {"id": "scene_evening",  "icon": "🕯",  "name": "Evening",  "desc": "Warm & dim",       "service": "scene/turn_on", "entity": "scene.evening"},
    {"id": "scene_focus",    "icon": "💡", "name": "Focus",    "desc": "Bright white",      "service": "scene/turn_on", "entity": "scene.focus"},
]

DEFAULT_TOGGLES = [
    {"id": "light.living_room", "icon": "🛋",  "label": "Living Room", "sublabel": "light.living_room"},
    {"id": "light.kitchen",     "icon": "🍳",  "label": "Kitchen",     "sublabel": "light.kitchen"},
    {"id": "light.bedroom",     "icon": "🛏",  "label": "Bedroom",     "sublabel": "light.bedroom"},
]

DEFAULT_STATS = [
    {"id": "sensor.indoor_temperature",  "label": "Indoor",  "unit": "°F"},
    {"id": "sensor.outdoor_temperature", "label": "Outdoor", "unit": "°F"},
    {"id": "sensor.indoor_humidity",     "label": "Humidity","unit": "%"},
]
