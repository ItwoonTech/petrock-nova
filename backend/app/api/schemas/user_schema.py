from pydantic import BaseModel


class GetUserResponse(BaseModel):
    user_id: str
    pet_id: str
    user_name: str
    user_role: str
    password: str
