import os

from fastapi import Depends

from app.repositories.dynamodb.user_repository import DynamoDBUserRepository
from app.repositories.interface.user_repository import UserRepository
from app.services.user_service.create_user_service import CreateUserService
from app.services.user_service.get_user_service import GetUserService

USER_TABLE_NAME = os.getenv("USER_TABLE_NAME")


def get_user_repository() -> UserRepository:
    return DynamoDBUserRepository(USER_TABLE_NAME)


def get_get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> GetUserService:
    return GetUserService(user_repository)


def get_create_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> CreateUserService:
    return CreateUserService(user_repository)
