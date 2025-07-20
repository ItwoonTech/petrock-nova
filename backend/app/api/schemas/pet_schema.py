from datetime import datetime

from pydantic import BaseModel

from app.models.pet import PetCareNote, PetGender


class GetPetResponseBody(BaseModel):
    pet_id: str
    name: str
    category: str
    birth_date: datetime
    gender: PetGender
    care_notes: list[PetCareNote]
    image_name: str
