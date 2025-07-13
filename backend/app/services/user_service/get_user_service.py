from datetime import datetime

from pydantic import BaseModel

from app.repositories.interface.user_repository import UserRepository


class GetUserServiceRequest(BaseModel):
    user_id: str


class GetUserServiceResponse(BaseModel):
    user_id: str
    pet_id: str
    user_name: str
    user_role: str
    password: str
    created_at: datetime
    updated_at: datetime


class GetUserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, request: GetUserServiceRequest) -> GetUserServiceResponse | None:
        user = self.user_repository.get_by_id(request.user_id)

        if user is None:
            return None

        return GetUserServiceResponse(**user.to_dict())
