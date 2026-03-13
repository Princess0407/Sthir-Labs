import re
import json
from pyproj import Geod

geod = Geod(ellps="WGS84")

def extract_ulpin(text):
    pattern = r'\b\d{14}\b'
    match = re.search(pattern, text)
    return match.group(0) if match else None

def lookup_ulpin_in_json(ulpin_id):
    try:
        with open("indian_land_records_sample.json", "r") as f:
            records = json.load(f)
            return next((r for r in records if r["ulpin"] == ulpin_id), None)
    except: return None

def calculate_area_from_coords(coords):
    lons = [c[1] for c in coords]
    lats = [c[0] for c in coords]
    area, _ = geod.polygon_area_perimeter(lons, lats)
    return abs(area) / 4046.86 # Returns Acres