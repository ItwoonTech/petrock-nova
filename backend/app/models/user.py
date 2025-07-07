from __future__ import annotations

from datetime import UTC, datetime
from enum import Enum

from pydantic import BaseModel, Field


class UserRole(Enum):
    """ユーザーの種類"""

    CHILD = "child"
    PARENT = "parent"
    GENERAL = "general"


class User(BaseModel):
    """ユーザー"""

    user_id: str = Field(min_length=1)
    pet_id: str = Field(min_length=1)
    user_name: str = Field(min_length=1)
    user_role: UserRole
    password: str = Field(min_length=4)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    def to_dict(self) -> dict:
        """ユーザーを辞書に変換する"""
        return {
            "user_id": self.user_id,
            "pet_id": self.pet_id,
            "user_name": self.user_name,
            "user_role": self.user_role.value,
            "password": self.password,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> User:
        """辞書からUserオブジェクトを作成する"""
        return cls(
            user_id=data["user_id"],
            pet_id=data["pet_id"],
            user_name=data["user_name"],
            user_role=UserRole(data["user_role"]),
            password=data["password"],
            created_at=datetime.fromisoformat(data["created_at"]),
            updated_at=datetime.fromisoformat(data["updated_at"]),
        )

    def update(self, **kwargs) -> User:
        """部分更新を行う（新しいインスタンスを返す）"""
        if "updated_at" not in kwargs:
            kwargs["updated_at"] = datetime.now(UTC)

        return self.model_copy(update=kwargs)
