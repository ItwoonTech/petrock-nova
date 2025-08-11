import os

from fastapi import Depends

from app.ai.bedrock.pet_avatar_image_client import BedrockPetAvatarImageClient
from app.ai.bedrock.pet_care_advice_client import BedrockPetCareAdviceClient
from app.ai.bedrock.pet_care_notes_client import BedrockPetCareNotesClient
from app.ai.bedrock.pet_care_tasks_client import BedrockPetCareTasksClient
from app.ai.bedrock.pet_picture_description_client import BedrockPetPictureDescriptionClient
from app.ai.interface.pet_avatar_image_client import PetAvatarImageClient
from app.ai.interface.pet_care_advice_client import PetCareAdviceClient
from app.ai.interface.pet_care_notes_client import PetCareNotesClient
from app.ai.interface.pet_care_tasks_client import PetCareTasksClient
from app.ai.interface.pet_picture_description_client import PetPictureDescriptionClient
from app.repositories.dynamodb.diary_repository import DynamoDBDiaryRepository
from app.repositories.dynamodb.pet_repository import DynamoDBPetRepository
from app.repositories.dynamodb.user_repository import DynamoDBUserRepository
from app.repositories.interface.diary_repository import DiaryRepository
from app.repositories.interface.image_repository import ImageRepository
from app.repositories.interface.pet_repository import PetRepository
from app.repositories.interface.user_repository import UserRepository
from app.repositories.s3.image_repository import S3ImageRepository
from app.services.diary_service.create_diary_service import CreateDiaryService
from app.services.diary_service.get_diary_service import GetDiaryService
from app.services.pet_service.create_pet_service import CreatePetService
from app.services.pet_service.get_pet_service import GetPetService
from app.services.s3_service.get_presigned_url_service import GetPresignedUrlService
from app.services.user_service.create_user_service import CreateUserService
from app.services.user_service.get_user_service import GetUserService
from app.services.user_service.update_user_service import UpdateUserService

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")

USER_TABLE_NAME = os.getenv("USER_TABLE_NAME")
PET_TABLE_NAME = os.getenv("PET_TABLE_NAME")
DIARY_TABLE_NAME = os.getenv("DIARY_TABLE_NAME")
IMAGE_BUCKET_NAME = os.getenv("IMAGE_BUCKET_NAME")
SECRET_NAME = os.getenv("PETROCK_NOVA_API_SECRET_NAME")


def get_user_repository() -> UserRepository:
    return DynamoDBUserRepository(USER_TABLE_NAME, DYNAMODB_ENDPOINT_URL)


def get_pet_repository() -> PetRepository:
    return DynamoDBPetRepository(PET_TABLE_NAME, DYNAMODB_ENDPOINT_URL)


def get_image_repository() -> ImageRepository:
    return S3ImageRepository(IMAGE_BUCKET_NAME, S3_ENDPOINT_URL)


def get_diary_repository() -> DiaryRepository:
    return DynamoDBDiaryRepository(DIARY_TABLE_NAME, DYNAMODB_ENDPOINT_URL)


def get_pet_picture_description_client(
    image_repository: ImageRepository = Depends(get_image_repository),
) -> PetPictureDescriptionClient:
    return BedrockPetPictureDescriptionClient(SECRET_NAME, image_repository)


def get_pet_avatar_image_client() -> PetAvatarImageClient:
    return BedrockPetAvatarImageClient()


def get_pet_care_notes_client() -> PetCareNotesClient:
    return BedrockPetCareNotesClient(SECRET_NAME)


def get_pet_care_tasks_client(
    image_repository: ImageRepository = Depends(get_image_repository),
) -> PetCareTasksClient:
    return BedrockPetCareTasksClient(SECRET_NAME, image_repository)


def get_pet_care_advice_client(
    image_repository: ImageRepository = Depends(get_image_repository),
) -> PetCareAdviceClient:
    return BedrockPetCareAdviceClient(SECRET_NAME, image_repository)


def get_get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> GetUserService:
    return GetUserService(user_repository)


def get_create_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> CreateUserService:
    return CreateUserService(user_repository)


def get_update_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> UpdateUserService:
    return UpdateUserService(user_repository)


def get_get_pet_service(
    pet_repository: PetRepository = Depends(get_pet_repository),
) -> GetPetService:
    return GetPetService(pet_repository)


def get_create_pet_service(
    pet_picture_description_client: PetPictureDescriptionClient = Depends(get_pet_picture_description_client),  # noqa: E501
    pet_avatar_image_client: PetAvatarImageClient = Depends(get_pet_avatar_image_client),
    pet_care_notes_client: PetCareNotesClient = Depends(get_pet_care_notes_client),
    pet_repository: PetRepository = Depends(get_pet_repository),
    image_repository: ImageRepository = Depends(get_image_repository),
) -> CreatePetService:  # fmt: skip
    return CreatePetService(
        pet_picture_description_client,
        pet_avatar_image_client,
        pet_care_notes_client,
        pet_repository,
        image_repository,
    )


def get_get_diary_service(
    diary_repository: DiaryRepository = Depends(get_diary_repository),
) -> GetDiaryService:
    return GetDiaryService(diary_repository)


def get_create_diary_service(
    pet_care_tasks_client: PetCareTasksClient = Depends(get_pet_care_tasks_client),
    pet_care_advice_client: PetCareAdviceClient = Depends(get_pet_care_advice_client),
    diary_repository: DiaryRepository = Depends(get_diary_repository),
) -> CreateDiaryService:
    return CreateDiaryService(
        pet_care_tasks_client,
        pet_care_advice_client,
        diary_repository,
    )


def get_get_presigned_url_service(
    image_repository: ImageRepository = Depends(get_image_repository),
) -> GetPresignedUrlService:
    return GetPresignedUrlService(image_repository)
