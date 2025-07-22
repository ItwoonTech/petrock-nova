from datetime import datetime

from pydantic import BaseModel

from app.models.pet import PetCareNote, PetGender
from app.repositories.interface.pet_repository import PetRepository


class GetPetServiceRequest(BaseModel):
    pet_id: str


class GetPetServiceResponse(BaseModel):
    pet_id: str
    name: str
    category: str
    birth_date: datetime
    gender: PetGender
    care_notes: list[PetCareNote]
    image_name: str
    created_at: datetime
    updated_at: datetime


class GetPetService:
    def __init__(self, pet_repository: PetRepository):
        self.pet_repository = pet_repository

    def execute(self, request: GetPetServiceRequest) -> GetPetServiceResponse | None:
        pet = self.pet_repository.get_by_id(request.pet_id)

        if pet is None:
            return None

        return GetPetServiceResponse(**pet.to_dict())
