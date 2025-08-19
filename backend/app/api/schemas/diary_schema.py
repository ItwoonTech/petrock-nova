from datetime import date

from pydantic import BaseModel

from app.models.diary import Weather
from app.models.diary import DiaryTask

class CreateDiaryResponseBody(BaseModel):
    category: str
    birth_date: date
    picture_name: str
    weather: Weather
    temperature: str

class UpdateDiaryRequestBody(BaseModel):
    reacted: bool | None
    comment: str | None
    tasks: list[DiaryTask] | None