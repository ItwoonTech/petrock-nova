from pydantic import BaseModel

from app.models.user import User
from app.repositories.interface.user_repository import UserRepository


class UpdateUserServiceRequest(BaseModel):
    user_id: str
    user_name: str | None
    user_role: str | None
    password: str | None


class UpdateUserServiceResponse(BaseModel):
    user: User


class UpdateUserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, request: UpdateUserServiceRequest) -> UpdateUserServiceResponse:
        current_user = self.user_repository.get_by_id(request.user_id)

        if current_user is None:
            raise ValueError("ユーザーが見つかりませんでした")

        updated_user = current_user.update(request.model_dump(exclude_unset=True))
        self.user_repository.update(updated_user)

        return UpdateUserServiceResponse(user=updated_user)
