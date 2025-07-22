import os

from fastapi import Depends

from app.repositories.dynamodb.pet_repository import DynamoDBPetRepository
from app.repositories.dynamodb.user_repository import DynamoDBUserRepository
from app.repositories.interface.pet_repository import PetRepository
from app.repositories.interface.user_repository import UserRepository
from app.services.pet_service.get_pet_service import GetPetService
from app.services.user_service.create_user_service import CreateUserService
from app.services.user_service.get_user_service import GetUserService
from app.services.user_service.update_user_service import UpdateUserService

USER_TABLE_NAME = os.getenv("USER_TABLE_NAME")
PET_TABLE_NAME = os.getenv("PET_TABLE_NAME")


def get_user_repository() -> UserRepository:
    return DynamoDBUserRepository(USER_TABLE_NAME)


def get_pet_repository() -> PetRepository:
    return DynamoDBPetRepository(PET_TABLE_NAME)


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
