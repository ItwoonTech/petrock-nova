# flake8: noqa: E402
# fmt: off
from dotenv import load_dotenv

load_dotenv()
# fmt: on

from fastapi import FastAPI
from mangum import Mangum

from app.api.routers.user_router import router as user_router

app = FastAPI()

app.include_router(user_router, prefix="/users", tags=["User"])

handler = Mangum(app)
