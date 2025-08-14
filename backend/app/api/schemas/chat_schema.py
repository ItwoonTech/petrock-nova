from pydantic import BaseModel


class ChatRequestBody(BaseModel):
    content: str
