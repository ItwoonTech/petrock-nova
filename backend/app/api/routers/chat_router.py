from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_get_chat_service
from app.services.chat_service.get_chat_service import (
    GetChatService,
    GetChatServiceRequest,
    GetChatServiceResponse,
)

router = APIRouter()


@router.get(
    "",
    response_model=GetChatServiceResponse,
    tags=["Chat"],
    summary="チャット履歴を取得する",
    operation_id="get_chat",
)
def get_chat(
    pet_id: str,
    get_chat_service: GetChatService = Depends(get_get_chat_service),
):
    request = GetChatServiceRequest(pet_id=pet_id)
    response = get_chat_service.execute(request)

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="チャット履歴が見つかりませんでした",
        )

    return response
