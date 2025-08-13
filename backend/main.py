from fastapi import FastAPI
from mangum import Mangum

from app.api.routers.chat_router import router as chat_router
from app.api.routers.diary_router import router as diary_router
from app.api.routers.health_router import router as health_router
from app.api.routers.pet_router import router as pet_router
from app.api.routers.s3_router import router as s3_router
from app.api.routers.user_router import router as user_router

app = FastAPI()

app.include_router(health_router, prefix="/health")
app.include_router(user_router, prefix="/users", tags=["User"])
app.include_router(pet_router, prefix="/pets", tags=["Pet"])
app.include_router(diary_router, prefix="/pets/{pet_id}/diaries", tags=["Diary"])
app.include_router(chat_router, prefix="/pets/{pet_id}/chats", tags=["Chat"])
app.include_router(s3_router, prefix="/s3", tags=["S3"])

handler = Mangum(app)
