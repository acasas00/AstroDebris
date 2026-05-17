from fastapi import APIRouter
from app.services.celestrak_service import fetch_celestrak
from app.services.orbit_service import  get_satellite_position

router = APIRouter()

@router.get("/satellites")
def get_satellites(limit: int = 10):
    return get_satellite_position(limit)

@router.get("/satellites/tle")
def get_sat_tle():
    return fetch_celestrak()


