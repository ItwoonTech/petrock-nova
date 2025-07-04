from __future__ import annotations

from dataclasses import dataclass, replace
from datetime import UTC, datetime
from enum import Enum


class UserRole(Enum):
    """ユーザーの種類"""

    CHILD = "child"
    PARENT = "parent"
    GENERAL = "general"


@dataclass(frozen=True)
class User:
    """ユーザー"""

    user_id: str
    pet_id: str
    user_name: str
    user_role: UserRole
    password: str
    created_at: datetime = datetime.now(UTC)
    updated_at: datetime = datetime.now(UTC)

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

        return replace(self, **kwargs)
