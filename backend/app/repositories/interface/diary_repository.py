from abc import ABC, abstractmethod
from datetime import date

from app.models.diary import Diary
class DiaryRepository(ABC):
    """日記リポジトリのインターフェース"""

    @abstractmethod
    def get_by_id(self, pet_id: str, date: date) -> Diary | None:
        """日記を取得する

            Args:
                pet_id (str): 日記ID
                date (date): 日付

            Returns:
                Diary | None: 日記
            """
        pass
    
    @abstractmethod
    def create(self, diary: Diary) -> Diary:
        """日記を作成する

            Args:
                diary (Diary): 日記
            """
        pass

    @abstractmethod
    def update(self, diary: Diary) -> Diary:
        """日記を更新する

            Args:
                diary (Diary): 日記
            """
        pass