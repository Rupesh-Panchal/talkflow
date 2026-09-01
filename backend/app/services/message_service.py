from datetime import datetime

from bson import ObjectId
from fastapi import HTTPException, status

from app.models.message_model import messages_collection
from app.models.conversation_model import conversations_collection


async def send_message(user_id: str, conversation_id: str, message: str):
    # 1. Validate conversation ID
    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid conversation id"
        )

    # 2. Find conversation
    conversation = await conversations_collection.find_one({
        "_id": ObjectId(conversation_id)
    })

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    # 3. Check whether user belongs to conversation
    if user_id not in conversation["participants"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant of this conversation"
        )

    # 4. Validate message
    message = message.strip()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    # 5. Create message
    now = datetime.utcnow()

    message_data = {
        "conversation_id": conversation_id,
        "sender_id": user_id,
        "message": message,
        "created_at": now,
        "updated_at": now,
        "delivered_at": None,
        "seen_at": None
    }

    # 6. Save message
    result = await messages_collection.insert_one(message_data)

    # 7. Update conversation's last message
    await conversations_collection.update_one(
        {
            "_id": ObjectId(conversation_id)
        },
        {
            "$set": {
                "last_message": message,
                "last_message_at": now,
                "updated_at": now
            }
        }
    )

    # 8. Return created message
    return {
        "message_id": str(result.inserted_id),
        "conversation_id": conversation_id,
        "sender_id": user_id,
        "message": message,
        "created_at": now
    }


async def get_messages(user_id: str, conversation_id: str):
    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid conversation id"
        )

    conversation = await conversations_collection.find_one({
        "_id": ObjectId(conversation_id)
    })

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if user_id not in conversation["participants"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant of this conversation"
        )

    messages = messages_collection.find({
        "conversation_id": conversation_id
    }).sort("created_at", 1)

    result = []

    async for message in messages:
        result.append({
            "message_id": str(message["_id"]),
            "sender_id": message["sender_id"],
            "message": message["message"],
            "created_at": message["created_at"],
            "delivered_at": message.get("delivered_at"),
            "seen_at": message.get("seen_at")
        })

    return result


async def mark_message_delivered(user_id: str, message_id: str):
    if not ObjectId.is_valid(message_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message id"
        )

    message = await messages_collection.find_one({
        "_id": ObjectId(message_id)
    })

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    conversation = await conversations_collection.find_one({
        "_id": ObjectId(message["conversation_id"])
    })

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if user_id not in conversation["participants"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant of this conversation"
        )

    # Sender does not mark their own message as delivered.
    if message["sender_id"] == user_id:
        return None

    now = datetime.utcnow()

    await messages_collection.update_one(
        {
            "_id": ObjectId(message_id),
            "delivered_at": None
        },
        {
            "$set": {
                "delivered_at": now,
                "updated_at": now
            }
        }
    )

    return {
        "message_id": message_id,
        "conversation_id": message["conversation_id"],
        "sender_id": message["sender_id"],
        "delivered_at": now
    }


async def mark_message_seen(user_id: str, message_id: str):
    if not ObjectId.is_valid(message_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message id"
        )

    message = await messages_collection.find_one({
        "_id": ObjectId(message_id)
    })

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    conversation = await conversations_collection.find_one({
        "_id": ObjectId(message["conversation_id"])
    })

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if user_id not in conversation["participants"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant of this conversation"
        )

    # Sender does not mark their own message as seen.
    if message["sender_id"] == user_id:
        return None

    now = datetime.utcnow()

    await messages_collection.update_one(
        {
            "_id": ObjectId(message_id),
            "seen_at": None
        },
        {
            "$set": {
                "delivered_at": message.get("delivered_at") or now,
                "seen_at": now,
                "updated_at": now
            }
        }
    )

    return {
        "message_id": message_id,
        "conversation_id": message["conversation_id"],
        "sender_id": message["sender_id"],
        "seen_at": now
    }