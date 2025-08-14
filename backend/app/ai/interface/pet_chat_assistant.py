from abc import ABC, abstractmethod

from app.models.chat import ChatMessage


class PetChatAssistant(ABC):
    @abstractmethod
    def converse(self, pet_id: str, user_message: ChatMessage) -> ChatMessage:
        """
        AIアシスタントと会話する

        Args:
            pet_id: ペットID
            user_message: ユーザーからのメッセージ

        Returns:
            ChatMessage: AIアシスタントからの応答
        """
        pass
