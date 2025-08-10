from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_get_diary_service
from app.services.diary_service.get_diary_service import (
    GetDiaryService,
    GetDiaryServiceRequest,
    GetDiaryServiceResponse,
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
