from aws_lambda_powertools import Logger
from pydantic import BaseModel

from app.ai.interface.pet_chat_assistant import PetChatAssistant
from app.exceptions.chat_response_exception import ChatResponseException
from app.models.chat import ChatMessage
from app.repositories.interface.chat_repository import ChatRepository

logger = Logger()


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
        try:
            self.chat_repository.append_message(request.pet_id, request.user_message)

            assistant_response = self.pet_chat_assistant.converse(
                request.pet_id,
                request.user_message,
            )

            self.chat_repository.append_message(request.pet_id, assistant_response)
        except Exception as e:
            logger.exception(e)
            raise ChatResponseException("チャットの応答を生成する過程で例外が発生しました") from e

        return ChatServiceResponse(assistant_response=assistant_response)
