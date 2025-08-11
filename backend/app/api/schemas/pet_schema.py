from datetime import date

from pydantic import BaseModel

from app.models.pet import PetGender


class CreatePetRequestBody(BaseModel):
    name: str
    category: str
    birth_date: date
    gender: PetGender
    picture_name: str
