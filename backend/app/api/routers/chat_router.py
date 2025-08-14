from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_chat_service, get_get_chat_service
from app.api.schemas.chat_schema import ChatRequestBody
from app.exceptions.pet_not_found_exception import PetNotFoundException
from app.models.chat import ChatMessage
from app.services.chat_service.chat_service import ChatService, ChatServiceRequest
from app.services.chat_service.get_chat_service import (
    GetChatService,
    GetChatServiceRequest,
)

router = APIRouter()


@router.get(
    "",
    response_model=list[str],
    tags=["Chat"],
    summary="チャット履歴を取得する",
    operation_id="get_chat",
)
def get_chat(
    pet_id: str,
    get_chat_service: GetChatService = Depends(get_get_chat_service),
):
    request = GetChatServiceRequest(pet_id=pet_id)

    try:
        response = get_chat_service.execute(request)
    except PetNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ペットが見つかりませんでした",
        )

    if response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="チャット履歴が見つかりませんでした",
        )

    return [message.content for message in response.chat_history]


@router.post(
    "",
    response_model=str,
    tags=["Chat"],
    summary="メッセージを送信して応答を得る",
    operation_id="chat",
)
def chat(
    pet_id: str,
    request_body: ChatRequestBody,
    chat_service: ChatService = Depends(get_chat_service),
) -> str:
    request = ChatServiceRequest(
        pet_id=pet_id,
        user_message=ChatMessage(content=request_body.content),
    )
    response = chat_service.execute(request)

    return response.assistant_response.content
