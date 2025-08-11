from datetime import datetime

from pydantic import BaseModel

from app.models.pet import PetGender


class CreatePetRequestBody(BaseModel):
    name: str
    category: str
    birth_date: datetime
    gender: PetGender
    picture_name: str
