from datetime import date, datetime

from pydantic import BaseModel

from app.models.diary import DiaryTask
from app.models.types import ContentfulString
from app.repositories.interface.diary_repository import DiaryRepository


class GetDiaryServiceRequest(BaseModel):
    pet_id: ContentfulString
    date: date


class GetDiaryServiceResponse(BaseModel):
    pet_id: ContentfulString
    date: ContentfulString
    picture_name: ContentfulString
    reacted: bool
    advice: ContentfulString
    comment: ContentfulString
    weather: ContentfulString
    temperature: float
    task: list[DiaryTask]
    created_at: datetime
    updated_at: datetime


class GetDiaryService:
    def __init__(self, diary_repository: DiaryRepository):
        self.diary_repository = diary_repository

    def execute(self, request: GetDiaryServiceRequest) -> GetDiaryServiceResponse | None:
        diary = self.diary_repository.get_by_id(request.pet_id, request.date)

        if diary is None:
            return None

        return GetDiaryServiceResponse(**diary.to_dict())
