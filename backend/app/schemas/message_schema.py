from pydantic import BaseModel


class SendMessageRequest(BaseModel):
    conversation_id: str
    message: str