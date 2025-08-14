from pydantic import BaseModel

from app.ai.interface.pet_chat_assistant import PetChatAssistant
from app.models.chat import ChatMessage
from app.repositories.interface.chat_repository import ChatRepository


class ChatServiceRequest(BaseModel):
    pet_id: str
    user_message: ChatMessage


class ChatServiceResponse(BaseModel):
    assistant_response: ChatMessage


class ChatService:
    def __init__(
        self,
        pet_chat_assistant: PetChatAssistant,
        chat_repository: ChatRepository,
    ) -> None:
        self.pet_chat_assistant = pet_chat_assistant
        self.chat_repository = chat_repository

    def execute(self, request: ChatServiceRequest) -> ChatServiceResponse:
        self.chat_repository.append_message(request.pet_id, request.user_message)

        assistant_response = self.pet_chat_assistant.chat(request.pet_id, request.user_message)
        self.chat_repository.append_message(request.pet_id, assistant_response)

        return ChatServiceResponse(assistant_response=assistant_response)
