from abc import ABC, abstractmethod

from app.models.user import User


class UserRepository(ABC):
    """ユーザーリポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, user_id: str) -> User | None:
        """ユーザーを取得する"""
        pass

    @abstractmethod
    def create(self, user: User) -> User:
        """ユーザーを作成する"""
        pass

    @abstractmethod
    def update(self, user: User) -> User:
        """ユーザーを更新する"""
        pass
