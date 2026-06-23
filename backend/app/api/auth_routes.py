from fastapi import APIRouter
from app.schemas.user_schema import UserRegister
from app.schemas.user_schema import UserLogin
from app.auth.password import verify_password
from app.auth.jwt_handler import create_access_token
from app.models.user_model import users_collection
from app.auth.password import hash_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(user: UserRegister):
    existing_user = await users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password)
    }

    result = await users_collection.insert_one(new_user)

    return {
        "success": True,
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
async def login(user: UserLogin):

    existing_user = await users_collection.find_one({
        "email": user.email
    })

    if not existing_user:
        return {
            "success": False,
            "message": "Invalid credentials"
        }

    is_valid = verify_password(user.password, existing_user["password"])

    if not is_valid:
        return {
            "success": False,
            "message": "Invalid credentials"
        }

    token = create_access_token({
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"]
    })

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer"
    }