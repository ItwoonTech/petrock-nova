from __future__ import annotations

from pydantic import BaseModel


class ChatMessage(BaseModel):
    """メッセージ"""

    content: str

    @classmethod
    def from_dict(cls, data: dict) -> ChatMessage:
        return cls.model_validate(data)
