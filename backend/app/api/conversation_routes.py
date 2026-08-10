from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from datetime import datetime

from app.auth.dependencies import get_current_user_payload
from app.models.user_model import users_collection
from app.models.conversation_model import conversations_collection
from app.schemas.conversation_schema import CreateConversationRequest

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.post("/")
async def create_conversation(data: CreateConversationRequest, payload: dict = Depends(get_current_user_payload)):
    sender_id = payload["user_id"]
    receiver_id = data.receiver_id

    if not ObjectId.is_valid(receiver_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid receiver id"
        )

    if sender_id == receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot create a conversation with yourself"
        )

    receiver = await users_collection.find_one({
        "_id": ObjectId(receiver_id)
    })

    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )

    existing_conversation = await conversations_collection.find_one({
        "participants": {
            "$all": [sender_id, receiver_id]
        }
    })

    if existing_conversation:
        return {
            "message": "Conversation already exists",
            "conversation_id": str(existing_conversation["_id"])
        }

    conversation = {
        "participants": [sender_id, receiver_id],
        "last_message": None,
        "last_message_at": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await conversations_collection.insert_one(conversation)

    return {
        "message": "Conversation created successfully",
        "conversation_id": str(result.inserted_id)
    }


@router.get("/")
async def get_conversations(payload: dict = Depends(get_current_user_payload)):
    user_id = payload["user_id"]

    conversations = conversations_collection.find({
        "participants": user_id
    })

    result = []

    async for conversation in conversations:
        other_user_id = next(
            participant
            for participant in conversation["participants"]
            if participant != user_id
        )

        other_user = await users_collection.find_one({
            "_id": ObjectId(other_user_id)
        })

        result.append({
            "conversation_id": str(conversation["_id"]),
            "user": {
                "id": str(other_user["_id"]),
                "username": other_user["username"],
                "avatar_url": other_user["avatar_url"],
                "is_online": other_user["is_online"]
            }
        })

    return result