from datetime import date, datetime

from aws_lambda_powertools import Logger
from pydantic import BaseModel

from app.ai.interface.pet_care_advice_client import CareAdvicePromptVariables, PetCareAdviceClient
from app.ai.interface.pet_care_tasks_client import CareTasksPromptVariables, PetCareTasksClient
from app.exceptions.diary_creation_exception import DiaryCreationException
from app.models.diary import Diary, DiaryTask, Weather
from app.repositories.interface.diary_repository import DiaryRepository

logger = Logger()


class CreateDiaryServiceRequest(BaseModel):
    pet_id: str
    category: str
    birth_date: date
    date: date  # birth_date より下に書くと型注釈が変数だと解釈される
    picture_name: str
    weather: Weather
    temperature: str


class CreateDiaryServiceResponse(BaseModel):
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


class CreateDiaryService:
    MAX_RETRY_COUNT = 3

    def __init__(
        self,
        pet_care_tasks_client: PetCareTasksClient,
        pet_care_advice_client: PetCareAdviceClient,
        diary_repository: DiaryRepository,
    ):
        self.pet_care_tasks_client = pet_care_tasks_client
        self.pet_care_advice_client = pet_care_advice_client
        self.diary_repository = diary_repository

    def execute(self, request: CreateDiaryServiceRequest) -> CreateDiaryServiceResponse:
        for _ in range(self.MAX_RETRY_COUNT):
            try:
                return self.try_create_diary(request)
            except Exception as e:
                logger.exception(str(e))
                last_exception = e

        raise DiaryCreationException("日記の作成に失敗しました") from last_exception

    def try_create_diary(self, request: CreateDiaryServiceRequest) -> CreateDiaryServiceResponse:
        # 飼育タスクを生成
        care_task_prompt_variables = CareTasksPromptVariables(
            category=request.category,
            birth_date=request.birth_date,
        )
        care_tasks = self.pet_care_tasks_client.generate(
            prompt_variables=care_task_prompt_variables,
            pet_picture_key=f"{request.pet_id}/{request.picture_name}",
        )

        # 飼育アドバイスを生成
        care_advice_prompt_variables = CareAdvicePromptVariables(
            birth_date=request.birth_date,
            category=request.category,
            date=request.date,
            weather=request.weather,
            temperature=request.temperature,
        )
        care_advice = self.pet_care_advice_client.generate(
            prompt_variables=care_advice_prompt_variables,
            pet_picture_key=f"{request.pet_id}/{request.picture_name}",
        )

        # 日記を作成
        new_diary = Diary(
            pet_id=request.pet_id,
            date=request.date,
            picture_name=request.picture_name,
            reacted=False,
            advice=care_advice,
            comment="",
            weather=request.weather,
            temperature=request.temperature,
            tasks=care_tasks,
        )
        created_diary = self.diary_repository.create(new_diary)

        return CreateDiaryServiceResponse(**created_diary.to_dict())
