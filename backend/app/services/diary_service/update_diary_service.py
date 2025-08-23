from datetime import date, datetime
from pydantic import BaseModel

from app.repositories.interface.diary_repository import DiaryRepository
from app.models.diary import Diary, DiaryTask, Weather

class UpdateDiaryServiceRequest(BaseModel):
    pet_id: str
    date: date
    reacted: bool | None
    comment: str | None
    tasks: list[DiaryTask] | None

class UpdateDiaryServiceResponse(BaseModel):
    pet_id: str
    date: date
    picture_name: str
    reacted: bool
    advice: str
    comment: str
    weather: Weather
    temperature: str
    tasks: list[DiaryTask]
    created_at: datetime
    updated_at: datetime

class UpdateDiaryService:
    def __init__(self, diary_repository: DiaryRepository):
        self.diary_repository = diary_repository

    def execute(self, request: UpdateDiaryServiceRequest) -> UpdateDiaryServiceResponse:
        current_diary = self.diary_repository.get_by_id(request.pet_id, request.date)

        if current_diary is None:
            return None
        
        updated_diary: Diary = current_diary.update(**request.model_dump())
        self.diary_repository.update(updated_diary)

        return UpdateDiaryServiceResponse(**updated_diary.to_dict())