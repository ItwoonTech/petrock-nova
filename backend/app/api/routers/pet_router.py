from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_get_pet_service
from app.api.schemas.pet_schema import GetPetResponseBody
from app.services.pet_service.get_pet_service import GetPetService, GetPetServiceRequest

router = APIRouter()


@router.get(
    "/{pet_id}",
    response_model=GetPetResponseBody,
    tags=["Pet"],
    summary="ペットを取得する",
    operation_id="get_pet",
)
def get_pet(
    pet_id: str,
    get_pet_service: GetPetService = Depends(get_get_pet_service),
):
    request = GetPetServiceRequest(pet_id=pet_id)
    response = get_pet_service.execute(request)

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ペットが見つかりませんでした",
        )

    return GetPetResponseBody(
        pet_id=response.pet_id,
        name=response.name,
        category=response.category,
        birth_date=response.birth_date,
        gender=response.gender,
        care_notes=response.care_notes,
        image_name=response.image_name,
    )
