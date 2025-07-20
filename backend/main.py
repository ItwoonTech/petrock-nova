from fastapi import FastAPI
from mangum import Mangum

from app.api.routers.pet_router import router as pet_router
from app.api.routers.user_router import router as user_router

app = FastAPI()

app.include_router(user_router, prefix="/users", tags=["User"])
app.include_router(pet_router, prefix="/pets", tags=["Pet"])

handler = Mangum(app)
