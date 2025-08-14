from abc import ABC, abstractmethod

from app.models.pet import Pet


class PetRepository(ABC):
    """ペットリポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, pet_id: str) -> Pet | None:
        """ペットを取得する

        Args:
            pet_id (str): ペットID

        Returns:
            Pet | None: ペットのインスタンス (見つからない場合はNone)
        """
        pass

    @abstractmethod
    def create(self, pet: Pet) -> Pet:
        """ペットを作成する

        Args:
            pet (Pet): ペット

        Returns:
            Pet: 作成したペット
        """
        pass

    @abstractmethod
    def update(self, pet: Pet) -> Pet:
        """ペットを更新する

        Args:
            pet (Pet): ペット

        Returns:
            Pet: 更新後のペット
        """
        pass
