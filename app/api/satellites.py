from fastapi import APIRouter
from app.services.spacetrack_service import fetch_spacetrack
from app.services.orbit_service import  get_satellite_position

router = APIRouter()

@router.get("/satellites")
def get_satellites():
    return get_satellite_position()

@router.get("/satellites/tle")
def get_sat_tle():
    return fetch_spacetrack()


