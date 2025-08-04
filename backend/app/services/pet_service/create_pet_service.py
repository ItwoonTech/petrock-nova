from __future__ import annotations

import base64
from datetime import UTC, datetime

from aws_lambda_powertools import Logger
from pydantic import BaseModel

from app.ai.interface.pet_avatar_image_client import PetAvatarImageClient
from app.ai.interface.pet_care_notes_client import CareNotesPromptVariables, PetCareNotesClient
from app.ai.interface.pet_picture_description_client import PetPictureDescriptionClient
from app.models.pet import Pet, PetCareNote, PetGender
from app.repositories.interface.image_repository import ImageRepository
from app.repositories.interface.pet_repository import PetRepository

logger = Logger()


class CreatePetServiceRequest(BaseModel):
    pet_id: str
    name: str
    category: str
    birth_date: datetime
    gender: PetGender
    picture_name: str

    def get_picture_image_key(self) -> str:
        return f"{self.pet_id}/{self.picture_name}"


class CreatePetServiceResponse(BaseModel):
    pet_id: str
    name: str
    category: str
    birth_date: datetime
    gender: PetGender
    image_name: str
    care_notes: list[PetCareNote]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_pet(cls, pet: Pet) -> CreatePetServiceResponse:
        return cls(
            pet_id=pet.pet_id,
            name=pet.name,
            category=pet.category,
            birth_date=pet.birth_date,
            gender=pet.gender,
            image_name=pet.image_name,
            care_notes=pet.care_notes,
            created_at=pet.created_at,
            updated_at=pet.updated_at,
        )


class CreatePetService:
    MAX_RETRY = 3
    AVATAR_IMAGE_NAME = "avatar.jpg"  # FIXME: 拡張子がこれでいいか不明

    def __init__(
        self,
        pet_picture_description_client: PetPictureDescriptionClient,
        pet_avatar_image_client: PetAvatarImageClient,
        pet_care_notes_client: PetCareNotesClient,
        pet_repository: PetRepository,
        image_repository: ImageRepository,
    ):
        self.pet_picture_description_client = pet_picture_description_client
        self.pet_avatar_image_client = pet_avatar_image_client
        self.pet_care_notes_client = pet_care_notes_client
        self.pet_repository = pet_repository
        self.image_repository = image_repository

    def execute(self, request: CreatePetServiceRequest) -> CreatePetServiceResponse:
        for _ in range(self.MAX_RETRY):
            try:
                return self.try_create_pet(request)
            except Exception as e:
                logger.exception(str(e))
                continue

        raise Exception("ペットの作成に失敗しました")

    def try_create_pet(self, request: CreatePetServiceRequest) -> CreatePetServiceResponse:
        # ペットの画像から説明文を生成
        picture_image_key = request.get_picture_image_key()
        description = self.pet_picture_description_client.describe(picture_image_key)

        # ペットのアバター画像を生成
        pet_avatar_base64_image = self.pet_avatar_image_client.generate(description)
        pet_avatar_image_bytes = base64.b64decode(pet_avatar_base64_image)

        # ペットのアバター画像を保存
        avatar_image_key = f"{request.pet_id}/{self.AVATAR_IMAGE_NAME}"
        self.image_repository.save(avatar_image_key, pet_avatar_image_bytes)

        # ペットの飼育情報を生成
        cate_notes_prompt_variables = CareNotesPromptVariables(
            category=request.category,
            birth_date=request.birth_date,
            gender=request.gender,
        )
        care_notes = self.pet_care_notes_client.generate(cate_notes_prompt_variables)

        # ペットを作成
        new_pet = Pet(
            pet_id=request.pet_id,
            name=request.name,
            category=request.category,
            birth_date=request.birth_date,
            gender=request.gender,
            care_notes=care_notes,
            image_name=self.AVATAR_IMAGE_NAME,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )
        self.pet_repository.create(new_pet)

        return CreatePetServiceResponse.from_pet(new_pet)
