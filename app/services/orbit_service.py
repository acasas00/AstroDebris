from app.services.celestrak_service import fetch_celestrak
from skyfield.api import EarthSatellite, load

def get_satellite_position(limit: int):

    tle_data = fetch_celestrak()
    tle_data = tle_data[:limit]

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

        satellite = EarthSatellite(data_line_1, data_line_2, satellite_name)

        position = satellite.at(time_now)
        subpoint = position.subpoint()

        latitude = subpoint.latitude.degrees
        longitude = subpoint.longitude.degrees
        altitude = subpoint.elevation.km

        satellites.append({
            "name": satellite_name,
            "latitude": latitude,
            "longitude": longitude,
            "altitude": altitude,
            "visible": True
        })

    return satellites