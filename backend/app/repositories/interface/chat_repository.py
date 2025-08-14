from abc import ABC, abstractmethod

from app.models.chat import ChatMessage


class ChatRepository(ABC):
    @abstractmethod
    def get_by_pet_id(self, pet_id: str) -> list[ChatMessage] | None:
        """
        チャット履歴を取得する

        Args:
            pet_id (str): ペットID
        """
        pass

    @abstractmethod
    def append_message(self, pet_id: str, message: ChatMessage) -> None:
        """
        チャット履歴にメッセージを追加する

        Args:
            pet_id (str): ペットID
            message (ChatMessage): チャットメッセージ

        Notes:
            チャット履歴がない時は新規作成する
        """
        pass
