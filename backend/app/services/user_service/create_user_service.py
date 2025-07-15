import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.user import User, UserRole
from app.repositories.interface.user_repository import UserRepository


class CreateUserServiceRequest(BaseModel):
    user_id: str
    user_name: str
    user_role: UserRole
    password: str


class CreateUserServiceResponse(BaseModel):
    user_id: str
    pet_id: str
    user_name: str
    user_role: str
    password: str
    created_at: datetime
    updated_at: datetime


class CreateUserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, request: CreateUserServiceRequest) -> CreateUserServiceResponse:
        new_user = User(
            user_id=request.user_id,
            pet_id=str(uuid.uuid4()),
            user_name=request.user_name,
            user_role=UserRole(request.user_role),
            password=request.password,
        )

        created_user = self.user_repository.create(new_user)

        return CreateUserServiceResponse(**created_user.to_dict())
