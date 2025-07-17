from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import (
    get_create_user_service,
    get_get_user_service,
    get_update_user_service,
)
from app.api.schemas.user_schema import (
    CreateUserRequestBody,
    GetUserResponseBody,
    UpdateUserRequestBody,
)
from app.services.user_service.create_user_service import (
    CreateUserService,
    CreateUserServiceRequest,
    CreateUserServiceResponse,
)
from app.services.user_service.get_user_service import GetUserService, GetUserServiceRequest
from app.services.user_service.update_user_service import (
    UpdateUserService,
    UpdateUserServiceRequest,
    UpdateUserServiceResponse,
)

router = APIRouter()


@router.get(
    "/{user_id}",
    response_model=GetUserResponseBody,
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

    return GetUserResponseBody(
        user_id=response.user_id,
        pet_id=response.pet_id,
        user_name=response.user_name,
        user_role=response.user_role,
        password=response.password,
    )


@router.post(
    "/{user_id}",
    response_model=CreateUserServiceResponse,
    tags=["User"],
    summary="ユーザーを作成する",
    operation_id="create_user",
)
def create_user(
    user_id: str,
    request_body: CreateUserRequestBody,
    create_user_service: CreateUserService = Depends(get_create_user_service),
):
    request = CreateUserServiceRequest(
        user_id=user_id,
        user_name=request_body.user_name,
        user_role=request_body.user_role,
        password=request_body.password,
    )

    return create_user_service.execute(request)


@router.put(
    "/{user_id}",
    response_model=UpdateUserServiceResponse,
    tags=["User"],
    summary="ユーザーを更新する",
    operation_id="update_user",
)
def update_user(
    user_id: str,
    request_body: UpdateUserRequestBody,
    update_user_service: UpdateUserService = Depends(get_update_user_service),
):
    request = UpdateUserServiceRequest(
        user_id=user_id,
        user_name=request_body.user_name,
        user_role=request_body.user_role,
        password=request_body.password,
    )

    try:
        return update_user_service.execute(request)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりませんでした",
        )
