from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime

from app.models.diary import DiaryTask


@dataclass(frozen=True)
class CareTasksPromptVariables:
    category: str
    birth_date: datetime


class PetCareTasksClient(ABC):
    @abstractmethod
    def generate(
        self,
        prompt_variables: CareTasksPromptVariables,
        pet_picture_key: str,
    ) -> list[DiaryTask]:
        """
        ペットの飼育タスクを生成する

        Args:
            prompt_variables (CareTasksPromptVariables): ペットの飼育情報を生成するための情報
            pet_picture_key (str): ペットの画像へのパス

        Returns:
            list[DiaryTask]: タスクのリスト
        """
        pass
