import requests
from dotenv import load_dotenv, find_dotenv
from datetime import datetime,timedelta,timezone
import os
import json
from pathlib import Path

cached_satellites = []
last_fetch_time = None
CACHE_FILE = Path("cached_satellites.json")

def get_creds():
    load_dotenv(find_dotenv())

    username = os.getenv("SPACETRACK_USERNAME")
    password = os.getenv("SPACETRACK_PASSWORD")

    return username, password

def fetch_spacetrack():
    global cached_satellites, last_fetch_time
    now = datetime.now(timezone.utc)

    if CACHE_FILE.exists() and CACHE_FILE.stat().st_size > 0:
        print("Using local cached satellites")

        with open(CACHE_FILE, "r") as file:
            return json.load(file)

    if last_fetch_time is not None and now - last_fetch_time < timedelta(hours=1):
        return cached_satellites

    username, password = get_creds()
    session = requests.Session()

    if not username or not password:
        raise ValueError("Missing Space-Track username or password")

    login_url = "https://www.space-track.org/ajaxauth/login"

    login_data = {
        "identity": username,
        "password": password,
    }

    login_response = session.post(login_url, data=login_data, timeout=15)

    print("login response:", login_response.status_code)
    print("Login text:", login_response.text[:500])
    print("Cookies:", session.cookies.get_dict())

    #DEBUG
    if login_response.status_code != 200:
        raise ValueError(f"Space Track request failed with status code: {login_response.status_code}")

    data_url = (
        "https://www.space-track.org/basicspacedata/query/"
        "class/gp/"
        "EPOCH/>now-30/"
        "DECAY_DATE/null-val/"
        "orderby/NORAD_CAT_ID asc/"
        "format/json"
    )

    #DEBUG
    response = session.get(data_url, timeout=15)
    print("Data Response:", response.status_code)
    print("Response text:", response.text[:1000])

    if response.status_code != 200:
        print("Response text:", response.text)
        return []

    data = response.json()
    if data:
        print("First JSON item:", data[0])
        print("Keys:", data[0].keys())

    satellites = []

    for item in data:
        satellite_name = item["OBJECT_NAME"]
        object_type = item["OBJECT_TYPE"]
        norad_id = item["NORAD_CAT_ID"]
        data_line_1 = item.get("TLE_LINE1") or item.get("DATA_LINE_1")
        data_line_2 = item.get("TLE_LINE2") or item.get("DATA_LINE_2")

        if not data_line_1 or not data_line_2:
            continue

        satellites.append({
            "satellite_name": satellite_name,
            "object_type": object_type,
            "norad_id": norad_id,
            "data_line_1": data_line_1,
            "data_line_2": data_line_2,
        })

    cached_satellites = satellites
    last_fetch_time = now

    with open(CACHE_FILE, "w") as file:
        json.dump(satellites, file)

    print("Saved satellites to local cache")

    return satellites
