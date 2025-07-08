from fastapi import Depends

from app.repositories.dynamodb.user_repository import DynamoDBUserRepository
from app.repositories.interface.user_repository import UserRepository
from app.services.user_service.get_user_service import GetUserService


def get_user_repository() -> UserRepository:
    return DynamoDBUserRepository()


def get_get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> GetUserService:
    return GetUserService(user_repository)
