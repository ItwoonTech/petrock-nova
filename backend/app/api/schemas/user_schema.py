from pydantic import BaseModel


class GetUserResponseBody(BaseModel):
    user_id: str
    pet_id: str
    user_name: str
    user_role: str
    password: str


class CreateUserRequestBody(BaseModel):
    user_name: str
    user_role: str
    password: str
