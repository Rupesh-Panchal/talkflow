from typing import Dict, Set

from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        # user_id -> set of WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}

        # user_id -> set of conversation_ids
        self.user_conversations: Dict[str, Set[str]] = {}

        # user_id -> conversation_id currently typing in
        self.typing_users: Dict[str, str] = {}


    async def connect(self, websocket: WebSocket, user_id: str, conversation_id: str | None = None):
        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()

        self.active_connections[user_id].add(websocket)

        if conversation_id:
            if user_id not in self.user_conversations:
                self.user_conversations[user_id] = set()

            self.user_conversations[user_id].add(conversation_id)


    async def disconnect(self, websocket: WebSocket, user_id: str, conversation_id: str | None = None) -> bool:
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)

            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

        if conversation_id and user_id in self.user_conversations:
            self.user_conversations[user_id].discard(conversation_id)

            if not self.user_conversations[user_id]:
                del self.user_conversations[user_id]

        # True means user has completely disconnected
        return user_id not in self.active_connections


    async def send_to_user(self, user_id: str, message: dict):
        connections = self.active_connections.get(user_id, set())

        disconnected = []

        for websocket in connections:
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected.append(websocket)

        for websocket in disconnected:
            connections.discard(websocket)


    async def send_to_conversation(self, conversation_id: str, message: dict, exclude_user: str | None = None):
        for user_id, connections in list(self.active_connections.items()):

            if exclude_user and user_id == exclude_user:
                continue

            user_conversations = self.user_conversations.get(user_id, set())

            if conversation_id not in user_conversations:
                continue

            disconnected = []

            for websocket in connections:
                try:
                    await websocket.send_json(message)
                except Exception:
                    disconnected.append(websocket)

            for websocket in disconnected:
                connections.discard(websocket)


    async def notify_typing_start(self, user_id: str, conversation_id: str, user_name: str | None = None):
        self.typing_users[user_id] = conversation_id

        message = {
            "type": "typing_start",
            "data": {
                "user_id": user_id,
                "conversation_id": conversation_id,
                "user_name": user_name
            }
        }

        await self.send_to_conversation(
            conversation_id=conversation_id,
            message=message,
            exclude_user=user_id
        )


    async def notify_typing_stop(self, user_id: str):
        conversation_id = self.typing_users.pop(user_id, None)

        if not conversation_id:
            return

        message = {
            "type": "typing_stop",
            "data": {
                "user_id": user_id,
                "conversation_id": conversation_id
            }
        }

        await self.send_to_conversation(
            conversation_id=conversation_id,
            message=message,
            exclude_user=user_id
        )


    async def notify_user_online(self, user_id: str, user_name: str | None = None):
        message = {
            "type": "user_online",
            "data": {
                "user_id": user_id,
                "user_name": user_name
            }
        }

        for conversation_id in self.user_conversations.get(user_id, set()):
            await self.send_to_conversation(
                conversation_id=conversation_id,
                message=message,
                exclude_user=user_id
            )


    async def notify_user_offline(self, user_id: str):
        message = {
            "type": "user_offline",
            "data": {
                "user_id": user_id
            }
        }

        conversations = list(self.user_conversations.get(user_id, set()))

        for conversation_id in conversations:
            await self.send_to_conversation(
                conversation_id=conversation_id,
                message=message,
                exclude_user=user_id
            )


    async def notify_message_delivered(self, sender_id: str, message_id: str, conversation_id: str):
        await self.send_to_user(
            sender_id,
            {
                "type": "message_delivered",
                "data": {
                    "message_id": message_id,
                    "conversation_id": conversation_id
                }
            }
        )


    async def notify_message_seen(self, sender_id: str, message_id: str, conversation_id: str):
        await self.send_to_user(
            sender_id,
            {
                "type": "message_seen",
                "data": {
                    "message_id": message_id,
                    "conversation_id": conversation_id
                }
            }
        )


manager = ConnectionManager()