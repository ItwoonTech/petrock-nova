from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import(
    get_create_diary_service,
    get_get_diary_service,
    get_update_diary_service,
)
from app.api.schemas.diary_schema import (
    CreateDiaryResponseBody,
    UpdateDiaryRequestBody,
)
from app.services.diary_service.create_diary_service import (
    CreateDiaryService,
    CreateDiaryServiceRequest,
    CreateDiaryServiceResponse,
)
from app.services.diary_service.get_diary_service import (
    GetDiaryService,
    GetDiaryServiceRequest,
    GetDiaryServiceResponse,
)
from app.services.diary_service.update_diary_service import(
    UpdateDiaryService,
    UpdateDiaryServiceRequest,
    UpdateDiaryServiceResponse,
)

router = APIRouter()


@router.get(
    "/{date}",
    response_model=GetDiaryServiceResponse,
    tags=["Diary"],
    summary="日記を取得する",
    operation_id="get_diary",
)
def get_diary(
    pet_id: str,
    date: date,
    get_diary_service: GetDiaryService = Depends(get_get_diary_service),
):
    request = GetDiaryServiceRequest(pet_id=pet_id, date=date)
    response = get_diary_service.execute(request)

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="日記が見つかりませんでした",
        )

    return response


@router.post(
    "/{date}",
    response_model=CreateDiaryServiceResponse,
    tags=["Diary"],
    summary="日記を作成する",
    operation_id="create_diary",
)
def create_diary(
    pet_id: str,
    date: date,
    request_body: CreateDiaryResponseBody,
    create_diary_service: CreateDiaryService = Depends(get_create_diary_service),
):
    request = CreateDiaryServiceRequest(
        pet_id=pet_id,
        category=request_body.category,
        birth_date=request_body.birth_date,
        date=date,
        picture_name=request_body.picture_name,
        weather=request_body.weather,
        temperature=request_body.temperature,
    )

    return create_diary_service.execute(request)

@router.put(
    "/{date}",
    response_model=UpdateDiaryServiceResponse,
    tags=["Diary"],
    summary="日記を更新する",
    operation_id="update_diary",
)
def update_diary(
    pet_id: str,
    date: date,
    request_body: UpdateDiaryRequestBody,
    update_diary_service: UpdateDiaryService = Depends(get_update_diary_service),
):
    request = UpdateDiaryServiceRequest(
        pet_id=pet_id,
        date=date,
        reacted=request_body.reacted,
        comment=request_body.comment,
        tasks=request_body.tasks,
    )
    response = update_diary_service.execute(request)
    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="日記が見つかりませんでした",
        )
    return response
