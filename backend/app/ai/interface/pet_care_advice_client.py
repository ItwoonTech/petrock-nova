from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date

from app.models.diary import Weather


@dataclass(frozen=True)
class CareAdvicePromptVariables:
    birth_date: date
    category: str
    date: date
    weather: Weather
    temperature: str


class PetCareAdviceClient(ABC):
    @abstractmethod
    def generate(
        self,
        prompt_variables: CareAdvicePromptVariables,
        pet_picture_key: str,
    ) -> str:
        """
        飼育アドバイスを生成する

        Args:
            prompt_variables (CareAdvicePromptVariables): プロンプトに埋め込む変数
            pet_picture_key (str): ペットの画像へのパス

        Returns:
            str: 飼育アドバイス
        """
