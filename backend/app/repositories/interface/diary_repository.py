from abc import ABC, abstractmethod

from app.models.diary import Diary
class DiaryRepository(ABC):
    """日記リポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, pet_id: str, date: str) -> Diary | None:
        """日記を取得する"""
        pass
    
    @abstractmethod
    def create(self, diary: Diary) -> Diary:
        """日記を作成する"""
        pass

    @abstractmethod
    def update(self, diary: Diary) -> Diary:
        """日記を更新する"""
        pass