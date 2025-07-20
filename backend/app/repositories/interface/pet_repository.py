from abc import ABC, abstractmethod

from app.models.pet import Pet


class PetRepository(ABC):
    """ペットリポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, pet_id: str) -> Pet | None:
        """ペットを取得する"""
        pass

    @abstractmethod
    def create(self, pet: Pet) -> Pet:
        """ペットを作成する"""
        pass

    @abstractmethod
    def update(self, pet: Pet) -> Pet:
        """ペットを更新する"""
        pass
