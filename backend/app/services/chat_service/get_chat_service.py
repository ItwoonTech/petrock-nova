from pydantic import BaseModel

from app.models.chat import ChatMessage
from app.repositories.interface.chat_repository import ChatRepository


class GetChatServiceRequest(BaseModel):
    pet_id: str


class GetChatServiceResponse(BaseModel):
    chat_history: list[ChatMessage]


class GetChatService:
    def __init__(self, chat_repository: ChatRepository):
        self.chat_repository = chat_repository

    def execute(self, request: GetChatServiceRequest) -> GetChatServiceResponse | None:
        chat_history = self.chat_repository.get_by_pet_id(request.pet_id)

        if chat_history is None:
            return None

        return GetChatServiceResponse(chat_history=chat_history)
