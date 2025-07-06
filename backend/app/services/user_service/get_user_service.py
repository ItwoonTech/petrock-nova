from pydantic import BaseModel

from app.models.user import User
from app.repositories.interface.user_repository import UserRepository


class GetUserServiceRequest(BaseModel):
    user_id: str


class GetUserServiceResponse(BaseModel):
    user: User


class GetUserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, request: GetUserServiceRequest) -> GetUserServiceResponse:
        user = self.user_repository.get_by_id(request.user_id)
        return GetUserServiceResponse(user=user)
