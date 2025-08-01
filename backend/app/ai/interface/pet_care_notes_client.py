from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime

from app.models.pet import PetCareNote, PetGender
from app.models.types import ContentfulString


@dataclass(frozen=True)
class CareNotesPromptVariables:
    category: ContentfulString
    birth_date: datetime
    gender: PetGender


class PetCareNotesClient(ABC):
    @abstractmethod
    def generate(self, prompt_variables: CareNotesPromptVariables) -> list[PetCareNote]:
        """
        ペットの飼育情報を生成する

        Args:
            prompt_variables (CareNotesPromptVariables): ペットの飼育情報を生成するための情報

        Returns:
            list[PetCareNote]: ペットの飼育情報
        """
        pass
