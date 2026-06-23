from fastapi import APIRouter, Header
from app.auth.jwt_handler import verify_token
from app.models.user_model import users_collection
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_me(authorization: str = Header(None)):

    if not authorization:
        return {
            "success": False,
            "message": "Token missing"
        }

    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    if not payload:
        return {
            "success": False,
            "message": "Invalid token"
        }

    user = await users_collection.find_one({
        "_id": ObjectId(
            payload["user_id"]
        )
    })

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }