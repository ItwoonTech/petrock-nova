from datetime import datetime

from pydantic import BaseModel

from app.exceptions.user_not_found_exception import UserNotFoundException
from app.models.user import User, UserRole
from app.repositories.interface.user_repository import UserRepository


class UpdateUserServiceRequest(BaseModel):
    user_id: str
    user_role: UserRole | None
    password: str | None


class UpdateUserServiceResponse(BaseModel):
    user_id: str
    pet_id: str
    user_name: str
    user_role: str
    password: str
    created_at: datetime
    updated_at: datetime


class UpdateUserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, request: UpdateUserServiceRequest) -> UpdateUserServiceResponse:
        current_user = self.user_repository.get_by_id(request.user_id)

        if current_user is None:
            raise UserNotFoundException("ユーザーが見つかりませんでした")

        updated_user: User = current_user.update(**request.model_dump())
        self.user_repository.update(updated_user)

        return UpdateUserServiceResponse(**updated_user.to_dict())
