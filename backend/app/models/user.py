from __future__ import annotations

from datetime import UTC, datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.models.types import ContentfulString


class UserRole(Enum):
    """ユーザーの種類"""

    CHILD = "child"
    PARENT = "parent"
    GENERAL = "general"


class User(BaseModel):
    """ユーザー"""

    user_id: ContentfulString
    pet_id: ContentfulString
    user_name: ContentfulString
    user_role: UserRole
    password: str = Field(min_length=4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    def to_dict(self) -> dict:
        """ユーザーを辞書に変換する"""
        return self.model_dump(mode="json")

    @classmethod
    def from_dict(cls, data: dict) -> User:
        """
        辞書からUserインスタンスを作成する

        Args:
            data (dict): ユーザーのデータ

        Returns:
            User: ユーザーのインスタンス
        """
        return cls.model_validate(data)

    def update(self, **kwargs) -> User:
        """
        ユーザーの属性を更新する

        Args:
            **kwargs: 更新する属性とその値

        Returns:
            User: 更新後のユーザーのインスタンス
        """
        updated_attrs = {k: v for k, v in kwargs.items() if v is not None}
        updated_attrs.setdefault("updated_at", datetime.now(UTC))

        # モデルに含まれていない属性は無視される
        return self.model_copy(update=updated_attrs)
