import requests


def fetch_celestrak():

    URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"

    response = requests.get(URL)

    if not response: #update .status_code
        raise ValueError("Response not retrieved from Celestrak")

    data = response.text
    lines = data.splitlines()

    satellites = []

    for i in range (0, len(lines), 3):

        if i +2 > len(lines):
            continue

        name = lines[i].strip()
        data_line_1 = lines[i+1].strip()
        data_line_2 = lines[i+2].strip()

        if not data_line_1:
            print(f"Data line 1 not found for {name}")
            continue

        if not data_line_2:
            print(f"Data line 2 not found for {name}")
            continue

        satellites.append({
            "satellite_name": name,
            "data_line_1": data_line_1,
            "data_line_2": data_line_2,
        })


    return satellites
