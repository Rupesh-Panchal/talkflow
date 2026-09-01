from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

from app.ws.dependencies import get_ws_user
from app.ws.connection_manager import manager
from app.services.message_service import (mark_message_delivered, mark_message_seen)

router = APIRouter()


@router.websocket("/ws/chat/{conversation_id}")
async def chat_websocket(websocket: WebSocket, conversation_id: str, user_id: str = Depends(get_ws_user)):
    # Connect this user's WebSocket
    await manager.connect(
        websocket=websocket, 
        user_id=user_id, 
        conversation_id=conversation_id
    )

    try:
        while True:
            # Wait for an event from the client
            data = await websocket.receive_json()
            print(f"WebSocket event from {user_id}: {data}")

            # Typing started
            if data.get("type") == "typing_start":
                await manager.notify_typing_start(user_id=user_id, conversation_id=conversation_id)

            # Typing stopped
            elif data.get("type") == "typing_stop":
                await manager.notify_typing_stop(user_id=user_id)

            # Ping from client
            elif data.get("type") == "ping":
                await websocket.send_json({
                    "type": "pong"
                })

            # Message delivered
            elif data.get("type") == "message_delivered":
                message_id = data.get("message_id")

                if not message_id:
                    await websocket.send_json({
                        "type": "error",
                        "message": "message_id is required"
                    })
                    continue

                result = await mark_message_delivered(
                    user_id=user_id,
                    message_id=message_id
                )

                if result:
                    await manager.notify_message_delivered(
                        sender_id=result["sender_id"],
                        message_id=result["message_id"],
                        conversation_id=result["conversation_id"]
                    )

            # Message seen
            elif data.get("type") == "message_seen":
                message_id = data.get("message_id")

                if not message_id:
                    await websocket.send_json({
                        "type": "error",
                        "message": "message_id is required"
                    })
                    continue

                result = await mark_message_seen(
                    user_id=user_id,
                    message_id=message_id
                )

                if result:
                    await manager.notify_message_seen(
                        sender_id=result["sender_id"],
                        message_id=result["message_id"],
                        conversation_id=result["conversation_id"]
                    )

    except WebSocketDisconnect:
        print(f"WebSocket disconnected: {user_id}")

    finally:
        is_fully_offline = await manager.disconnect(
            websocket=websocket,
            user_id=user_id,
            conversation_id=conversation_id
        )

        if is_fully_offline:
            await manager.notify_user_offline(
                user_id=user_id
            )