from abc import ABC, abstractmethod

from app.models.user import User


class UserRepository(ABC):
    """ユーザーリポジトリのインターフェース"""

    @abstractmethod
    def get_user(self, user_id: str) -> User | None:
        """ユーザーを取得する"""
        pass

    @abstractmethod
    def create_user(self, user: User) -> User:
        """ユーザーを作成する"""
        pass

    @abstractmethod
    def update_user(self, user: User) -> User:
        """ユーザーを更新する"""
        pass
