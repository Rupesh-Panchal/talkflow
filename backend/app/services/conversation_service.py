from datetime import datetime

from bson import ObjectId
from fastapi import HTTPException, status

from app.models.user_model import users_collection
from app.models.conversation_model import conversations_collection


async def create_conversation(user_id: str, receiver_id: str):
    # Validate receiver ID
    if not ObjectId.is_valid(receiver_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid receiver id"
        )

    # Prevent self conversation
    if user_id == receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot create a conversation with yourself"
        )

    # Check receiver exists
    receiver = await users_collection.find_one({
        "_id": ObjectId(receiver_id)
    })

    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )

    # Check existing conversation
    existing_conversation = await conversations_collection.find_one({
        "participants": {
            "$all": [user_id, receiver_id]
        }
    })

    if existing_conversation:
        return {
            "message": "Conversation already exists",
            "conversation_id": str(existing_conversation["_id"])
        }

    # Create conversation
    now = datetime.utcnow()

    conversation = {
        "participants": [
            user_id,
            receiver_id
        ],
        "last_message": None,
        "last_message_at": None,
        "created_at": now,
        "updated_at": now
    }

    result = await conversations_collection.insert_one(
        conversation
    )

    return {
        "message": "Conversation created successfully",
        "conversation_id": str(result.inserted_id)
    }



async def get_conversations(user_id: str):
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

        if not other_user:
            continue

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