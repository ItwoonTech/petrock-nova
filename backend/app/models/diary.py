from __future__ import annotations

from datetime import UTC, datetime, time

from pydantic import BaseModel, Field
from zmq import Enum

from app.models.types import ContentfulString


class Weather(Enum):
    """天気"""

    SUNNY = "晴れ"
    CLOUDY = "曇り"
    RAINY = "雨"
    SNOWY = "雪"


class DiarySubtask(BaseModel):
    """サブタスク"""

    title: ContentfulString
    description: ContentfulString
    scheduled_time: time
    completed: bool


class DiaryTask(BaseModel):
    """タスク"""

    title: ContentfulString
    description: ContentfulString
    scheduled_time: time | None
    completed: bool
    repeat: bool
    sub_task: list[DiarySubtask]

    @classmethod
    def from_dict(cls, data: dict) -> DiaryTask:
        """
        辞書からDiaryTaskインスタンスを作成する

        Args:
            data (dict): タスクデータ

        Returns:
            DiaryTask: タスクのインスタンス
        """
        return cls.model_validate(data)

    def to_dict(self) -> dict:
        """
        タスクを辞書に変換する

        Returns:
            dict: タスクのデータ
        """
        return self.model_dump(mode="json")


class Diary(BaseModel):
    """日記"""

    pet_id: ContentfulString
    date: datetime
    picture_name: ContentfulString
    reacted: bool
    advice: ContentfulString
    comment: ContentfulString
    weather: Weather
    temperature: float
    tasks: list[DiaryTask]
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    @classmethod
    def from_dict(cls, data: dict) -> Diary:
        """辞書からDiaryインスタンスを作成する

        Args:
            data (dict): 日記データ

        Returns:
            Diary: 日記のインスタンス
        """
        return cls.model_validate(data)

    def to_dict(self) -> dict:
        """
        日記を辞書に変換する

        Returns:
            dict: 日記のデータ
        """
        return self.model_dump(mode="json")
