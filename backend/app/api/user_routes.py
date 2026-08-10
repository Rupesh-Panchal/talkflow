import os
import uuid
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from app.auth.dependencies import get_current_user_payload
from app.auth.password import verify_password, hash_password
from app.models.user_model import users_collection
from app.schemas.user_schema import UserUpdate, UserPasswordUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])

UPLOAD_DIR = "uploads/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.get("/me")
async def get_me(payload: dict = Depends(get_current_user_payload)):
    user = await users_collection.find_one({"_id": ObjectId(payload["user_id"])})

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "phone_number": user["phone_number"],
        "avatar_url": user["avatar_url"],
        "is_online": user["is_online"],
        "last_seen": str(user["last_seen"]) if user["last_seen"] else None,
        "created_at": str(user["created_at"]),
        "updated_at": str(user["updated_at"])
    }


@router.put("/me")
async def update_me(data: UserUpdate, payload: dict = Depends(get_current_user_payload)):
    fields_to_update = {k: v for k, v in data.model_dump().items() if v is not None}

    if not fields_to_update:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided to update")

    if "email" in fields_to_update:
        existing = await users_collection.find_one({"email": fields_to_update["email"]})
        if existing and str(existing["_id"]) != payload["user_id"]:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already taken by another account")

    if "phone_number" in fields_to_update:
        existing = await users_collection.find_one({"phone_number": fields_to_update["phone_number"]})
        if existing and str(existing["_id"]) != payload["user_id"]:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone number already taken by another account")

    fields_to_update["updated_at"] = datetime.utcnow()

    await users_collection.update_one(
        {"_id": ObjectId(payload["user_id"])},
        {"$set": fields_to_update}
    )

    return {"message": "Profile updated successfully"}


@router.put("/me/password")
async def update_password(data: UserPasswordUpdate, payload: dict = Depends(get_current_user_payload)):
    user = await users_collection.find_one({"_id": ObjectId(payload["user_id"])})

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not verify_password(data.old_password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Old password is incorrect")

    await users_collection.update_one(
        {"_id": ObjectId(payload["user_id"])},
        {"$set": {"password": hash_password(data.new_password), "updated_at": datetime.utcnow()}}
    )

    return {"message": "Password updated successfully"}


@router.put("/me/avatar")
async def update_avatar(
    file: UploadFile = File(...),
    payload: dict = Depends(get_current_user_payload)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only .jpg, .jpeg, .png, .webp files are allowed")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large. Max size is 5MB")

    filename = f"{payload['user_id']}_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    avatar_url = f"/uploads/avatars/{filename}"

    await users_collection.update_one(
        {"_id": ObjectId(payload["user_id"])},
        {"$set": {"avatar_url": avatar_url, "updated_at": datetime.utcnow()}}
    )

    return {"message": "Avatar updated successfully", "avatar_url": avatar_url}


@router.get("/search")
async def search_users(q: str, payload: dict = Depends(get_current_user_payload)):
    if not q or not q.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Search query cannot be empty")

    regex_pattern = {"$regex": q, "$options": "i"}

    cursor = users_collection.find({
        "$and": [
            {"_id": {"$ne": ObjectId(payload["user_id"])}},
            {"$or": [
                {"username": regex_pattern},
                {"email": regex_pattern},
                {"phone_number": regex_pattern}
            ]}
        ]
    }).limit(20)

    results = []
    async for user in cursor:
        results.append({
            "id": str(user["_id"]),
            "username": user["username"],
            "avatar_url": user["avatar_url"],
            "is_online": user["is_online"]
        })

    return {"results": results, "count": len(results)}


@router.get("/{user_id}")
async def get_user_by_id(user_id: str, payload: dict = Depends(get_current_user_payload)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")

    user = await users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "avatar_url": user["avatar_url"],
        "is_online": user["is_online"],
        "last_seen": str(user["last_seen"]) if user["last_seen"] else None
    }