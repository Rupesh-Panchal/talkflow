from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user_payload
from app.schemas.message_schema import SendMessageRequest
from app.services.message_service import (send_message, get_messages)


router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


@router.post("/")
async def send_message_route(data: SendMessageRequest, payload: dict = Depends(get_current_user_payload)):
    user_id = payload["user_id"]

    return await send_message(
        user_id=user_id,
        conversation_id=data.conversation_id,
        message=data.message
    )


@router.get("/{conversation_id}")
async def get_messages_route(conversation_id: str, payload: dict = Depends(get_current_user_payload)):
    user_id = payload["user_id"]

    return await get_messages(
        user_id=user_id,
        conversation_id=conversation_id
    )