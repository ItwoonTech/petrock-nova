from abc import ABC, abstractmethod

from app.models.user import User


class UserRepository(ABC):
    """ユーザーリポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, user_id: str) -> User | None:
        """ユーザーを取得する

        Args:
            user_id (str): ユーザーID

        Returns:
            User | None: ユーザーのインスタンス (見つからない場合はNone)
        """
        pass

    @abstractmethod
    def create(self, user: User) -> User:
        """ユーザーを作成する

        Args:
            user (User): ユーザー

        Returns:
            User: 作成したユーザー
        """
        pass

    @abstractmethod
    def update(self, user: User) -> User:
        """ユーザーを更新する

        Args:
            user (User): ユーザー

        Returns:
            User: 更新後のユーザー
        """
        pass
