from __future__ import annotations
from datetime import UTC, datetime
from pydantic import BaseModel, Field
from app.models.types import ContentfulString

class DiaryTask(BaseModel):
    task_title: ContentfulString
    task_time: ContentfulString #(HH:mm)
    task_status: ContentfulString

    @classmethod
    def from_dict(cls, data: dict) -> DiaryTask:
        """辞書からDiaryTaskインスタンスを作成する"""
        return cls.model_validate(data)

class Diary(BaseModel):
    """日記"""
    pet_id: ContentfulString
    date: datetime = Field(default_factory=lambda: datetime.now(UTC))
    image_name: ContentfulString
    reacted: bool
    advice: ContentfulString
    comment: ContentfulString
    weather: ContentfulString
    temperature: float
    tasks: list[DiaryTask]
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    @classmethod
    def from_dict(cls, data: dict) -> Diary:
        """辞書からDiaryインスタンスを作成する
        
        Args:
            data (dict): 日記データ
            """
        return cls.model_validate(data)
    
    def to_dict(self) -> dict:
        """Diaryインスタンスを辞書に変換する"""
        return self.model_dump(mode="json")