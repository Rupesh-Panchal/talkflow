from fastapi import WebSocket, Query

from app.auth.jwt_handler import verify_token


async def get_ws_user(websocket: WebSocket, token: str | None = Query(None)) -> str:

    # 1. Check whether token was provided
    if not token:
        await websocket.close(code=4001, reason="No token provided")
        raise Exception("No token provided")

    # 2. Verify the access token using your existing JWT handler
    payload = verify_token(token, expected_type="access")

    # 3. Check whether token is valid
    if not payload:
        await websocket.close(code=4001, reason="Invalid or expired token")
        raise Exception("Invalid or expired token")

    # 4. Get user_id from the token
    user_id = payload.get("user_id")

    if not user_id:
        await websocket.close(code=4001, reason="Invalid token payload")
        raise Exception("user_id missing from token")

    # 5. Return authenticated user ID
    return user_id