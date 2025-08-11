from __future__ import annotations

from datetime import UTC, date, datetime
from enum import Enum

from pydantic import BaseModel, Field, SerializationInfo, field_serializer

from app.models.types import NonEmptyString


class PetGender(Enum):
    """ペットの性別"""

    MALE = "male"
    FEMALE = "female"


class PetCareNoteIcon(Enum):
    """ペットの飼育情報のアイコン"""

    DOG = "Dog"
    BONE = "Bone"
    SMILE = "Smile"
    FROWN = "Frown"
    UTENSILS = "Utensils"
    COOKIE = "Cookie"


class PetCareNote(BaseModel):
    """ペットの飼育情報"""

    title: NonEmptyString
    description: NonEmptyString
    icon: PetCareNoteIcon

    @field_serializer("icon")
    def serialize_icon(self, icon: PetCareNoteIcon, _info: SerializationInfo) -> str:
        return icon.value

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

    pet_id: NonEmptyString
    name: NonEmptyString
    category: NonEmptyString
    birth_date: date
    gender: PetGender
    care_notes: list[PetCareNote]
    image_name: NonEmptyString
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    @classmethod
    def from_dict(cls, data: dict) -> Pet:
        """
        辞書からPetインスタンスを作成する

        Args:
            data (dict): ペットのデータ

        Returns:
            Pet: ペットのインスタンス
        """
        return cls.model_validate(data)

    def to_dict(self) -> dict:
        """
        ペットを辞書に変換する

        Returns:
            dict: ペットのデータ
        """
        return self.model_dump(mode="json")
