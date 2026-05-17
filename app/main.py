from fastapi import FastAPI
from app.api.satellites import router as satellite_router

app = FastAPI()
app.include_router(satellite_router)

@app.get("/")
def root():
    return {"message": "Space Debris Tracker API"}

