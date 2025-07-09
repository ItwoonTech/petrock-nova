from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_get_user_service
from app.api.schemas.user_schema import GetUserResponse
from app.services.user_service.get_user_service import GetUserService, GetUserServiceRequest

router = APIRouter()


@router.get(
    "/{user_id}",
    response_model=GetUserResponse,
    tags=["User"],
    summary="ユーザーを取得する",
    operation_id="get_user",
)
def get_user(
    user_id: str,
    get_user_service: GetUserService = Depends(get_get_user_service),
):
    request = GetUserServiceRequest(user_id=user_id)
    response = get_user_service.execute(request)

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりませんでした",
        )

    user = response.user
    return GetUserResponse(
        user_id=user.user_id,
        user_name=user.user_name,
        user_role=user.user_role,
        pet_id=user.pet_id,
        password=user.password,
    )
