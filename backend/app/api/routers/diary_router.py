from fastapi import APIRouter, Depends, HTTPException, status
from app.models.types import ContentfulString
from app.api.dependencies import get_get_diary_service
from app.api.schemas.diary_schema import GetDiaryResponseBody
from app.services.diary_service.get_diary_service import GetDiaryService, GetDiaryServiceRequest

router = APIRouter()

@router.get(
        "/{pet_id}/{date}",
        response_model=GetDiaryResponseBody,
        tags=["Diary"],
        summary="日記を所得する",
        operation_id="get_diary"
)
def get_diary(
        pet_id: ContentfulString,
        date: ContentfulString,
        get_diary_service: GetDiaryService = Depends(get_get_diary_service),
):
    request = GetDiaryServiceRequest(pet_id=pet_id, date=date)
    response = get_diary_service.execute(request)

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="日記が見つかりませんでした",
        )
    
    return GetDiaryResponseBody(
        pet_id=response.pet_id,
        date=response.date,
        image_name=response.image_name,
        reacted=response.reacted,
        advice=response.advice,
        comment=response.comment,
        weather=response.weather,
        temperature=response.temperature,
        tasks=response.tasks,
    )