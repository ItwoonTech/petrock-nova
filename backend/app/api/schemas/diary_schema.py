from pydantic import BaseModel
from app.models.types import ContentfulString
from app.models.diary import DiaryTask

class GetDiaryResponseBody(BaseModel):
    pet_id: ContentfulString
    date: ContentfulString
    image_name: ContentfulString
    reacted: bool
    advice: ContentfulString
    comment: ContentfulString
    weather: ContentfulString
    temperature: float
    tasks: list[DiaryTask]