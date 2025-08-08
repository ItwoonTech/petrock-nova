from pydantic import BaseModel
from app.models.types import ContentfulString
from app.models.diary import DiaryTask
from datetime import date

class GetDiaryResponseBody(BaseModel):
    pet_id: ContentfulString
    date: date
    picture_name: ContentfulString
    reacted: bool
    advice: ContentfulString
    comment: ContentfulString
    weather: ContentfulString
    temperature: float
    task: list[DiaryTask]