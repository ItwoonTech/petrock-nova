from __future__ import annotations

from datetime import UTC, datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.models.types import ContentfulString


class PetGender(Enum):
    """ペットの性別"""

    MALE = "male"
    FEMALE = "female"


class PetCareNoteIcon(Enum):
    """ペットの飼育うのアイコン"""

    DOG = "Dog"
    BONE = "Bone"
    SMILE = "Smile"
    FROWN = "Frown"
    UTENSILS = "Utensils"
    COOKIE = "Cookie"


class PetCareNote(BaseModel):
    """ペットの飼育情報"""

    title: ContentfulString
    description: ContentfulString
    icon: PetCareNoteIcon

    @classmethod
    def from_dict(cls, data: dict) -> PetCareNote:
        """
        辞書からペットの飼育情報を作成する

        Args:
            data (dict): 辞書

        Returns:
            PetCareNote: ペットの飼育情報
        """

        return cls.model_validate(data)


class Pet(BaseModel):
    """ペット"""

    pet_id: ContentfulString
    name: ContentfulString
    category: ContentfulString
    birth_date: datetime = Field(default_factory=lambda: datetime.now(UTC))
    gender: PetGender
    care_notes: list[PetCareNote]
    image_name: ContentfulString
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    @classmethod
    def from_dict(cls, data: dict) -> Pet:
        """辞書からPetインスタンスを作成する"""

        return cls.model_validate(data)

    def to_dict(self) -> dict:
        """ペットを辞書に変換する"""
        return self.model_dump(mode="json")
