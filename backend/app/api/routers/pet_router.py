from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_create_pet_service, get_get_pet_service, get_update_pet_service
from app.api.schemas.pet_schema import CreatePetRequestBody
from app.services.pet_service.create_pet_service import (
    CreatePetService,
    CreatePetServiceRequest,
    CreatePetServiceResponse,
)
from app.services.pet_service.get_pet_service import (
    GetPetService,
    GetPetServiceRequest,
    GetPetServiceResponse,
)
from app.services.pet_service.update_pet_service import (
    UpdatePetService, 
    UpdatePetServiceResponse, 
    UpdatePetServiceRequest, 
)
router = APIRouter()


@router.get(
    "/{pet_id}",
    response_model=GetPetServiceResponse,
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

    return response


@router.post(
    "/{pet_id}",
    response_model=CreatePetServiceResponse,
    tags=["Pet"],
    summary="ペットを作成する",
    operation_id="create_pet",
)
def create_pet(
    pet_id: str,
    request_body: CreatePetRequestBody,
    create_pet_service: CreatePetService = Depends(get_create_pet_service),
):
    request = CreatePetServiceRequest(
        pet_id=pet_id,
        name=request_body.name,
        category=request_body.category,
        birth_date=request_body.birth_date,
        gender=request_body.gender,
        picture_name=request_body.picture_name,
    )

    return create_pet_service.execute(request)

@router.put(
    "/{pet_id}",
    response_model=UpdatePetServiceResponse,
    tags=["Pet"],
    summary="ペットを更新する",
    operation_id="update_pet",
)
def update_pet(
    pet_id: str,
    update_pet_service: UpdatePetService = Depends(get_update_pet_service),
):
    request = UpdatePetServiceRequest(pet_id=pet_id)
    response = update_pet_service.execute(request)

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ペットが見つかりませんでした",
        )

    return UpdatePetServiceResponse(
        pet_id=response.pet_id,
        name=response.name,
        category=response.category,
        birth_date=response.birth_date,
        gender=response.gender,
        care_notes=response.care_notes,
        image_name=response.image_name,
        created_at=response.created_at, 
        updated_at=response.updated_at, 
    )