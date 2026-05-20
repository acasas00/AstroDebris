from app.services.spacetrack_service import fetch_spacetrack
from skyfield.api import EarthSatellite, load
import math

def get_satellite_position():

    tle_data = fetch_spacetrack()

    ts = load.timescale()
    time_now = ts.now()
    satellites = []

    for satellite_tle in tle_data:

        satellite_name = satellite_tle["satellite_name"]
        data_line_1 = satellite_tle["data_line_1"]
        data_line_2 = satellite_tle["data_line_2"]

        if not data_line_1.startswith("1 "):
            continue

        if not data_line_2.startswith("2 "):
            continue

        satellite = EarthSatellite(data_line_1, data_line_2, satellite_name, ts)

        position = satellite.at(time_now)
        subpoint = position.subpoint()

        latitude = subpoint.latitude.degrees
        longitude = subpoint.longitude.degrees
        altitude = subpoint.elevation.km

        if not all(math.isfinite(float(value)) for value in [latitude, longitude, altitude]):
            print(f"Skipping {satellite_name}")
            continue

        satellites.append({
            "name": satellite_name,
            "type": satellite_tle["object_type"],
            "norad_id": satellite_tle["norad_id"],
            "latitude": float(latitude),
            "longitude": float(longitude),
            "altitude": float(altitude),
            "visible": True
        })

    return satellites