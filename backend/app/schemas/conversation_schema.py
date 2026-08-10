from pydantic import BaseModel


class CreateConversationRequest(BaseModel):
    receiver_id: str