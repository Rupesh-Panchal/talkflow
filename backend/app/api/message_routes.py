from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from datetime import datetime

from app.auth.dependencies import get_current_user_payload
from app.models.message_model import messages_collection
from app.models.conversation_model import conversations_collection
from app.schemas.message_schema import SendMessageRequest


router = APIRouter(prefix="/messages", tags=["Messages"])


@router.post("/")
async def send_message(data: SendMessageRequest, payload: dict = Depends(get_current_user_payload)):
    pass