from datetime import datetime, date

from pydantic import BaseModel

from app.models.pet import Pet, PetCareNote, PetGender
from app.repositories.interface.pet_repository import PetRepository


class UpdatePetServiceRequest(BaseModel):
    pet_id: str
    care_notes: list[PetCareNote]


class UpdatePetServiceResponse(BaseModel):
    pet_id: str
    name: str
    category: str
    birth_date: date
    gender: PetGender
    care_notes: list[PetCareNote]
    image_name: str
    created_at: datetime
    updated_at: datetime


class UpdatePetService:
    def __init__(self, pet_repository: PetRepository):
        self.pet_repository = pet_repository

    def execute(self, request: UpdatePetServiceRequest) -> UpdatePetServiceResponse:
        current_pet = self.pet_repository.get_by_id(request.pet_id)

        if current_pet is None:
            raise ValueError("ペットが見つかりませんでした")

        updated_pet: Pet = current_pet.model_copy(update=request.model_dump())
        self.pet_repository.update(updated_pet)

        return UpdatePetServiceResponse(**updated_pet.to_dict())
