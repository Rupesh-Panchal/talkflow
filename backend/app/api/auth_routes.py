from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from app.schemas.user_schema import UserRegister
from app.schemas.otp_schema import (LoginOTPRequest, VerifyOTPRequest, ResendOTPRequest, ForgotPasswordRequest, ResetPasswordRequest)
from app.services.otp_service import (generate_otp, save_otp, verify_otp)
from app.services.email_service import send_email_otp
from app.schemas.auth_schema import RefreshTokenRequest
from app.auth.password import verify_password, hash_password
from app.auth.jwt_handler import create_access_token, create_refresh_token, verify_token
from app.auth.dependencies import get_current_user_payload, bearer_scheme
from app.models.user_model import users_collection
from app.models.token_model import blacklisted_tokens_collection
from app.models.otp_model import otp_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists"
        )

    if await users_collection.find_one({"phone_number": user.phone_number}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Phone number already exists"
        )

    now = datetime.utcnow()

    result = await users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "password": hash_password(user.password),
        "avatar_url": None,
        "is_online": False,
        "last_seen": None,
        "created_at": now,
        "updated_at": now
    })

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
async def login(data: LoginOTPRequest):
    if "@" in data.identifier:
        existing_user = await users_collection.find_one({
            "email": data.identifier
        })
    else:
        existing_user = await users_collection.find_one({
            "phone_number": data.identifier
        })

    if not existing_user or not verify_password(data.password, existing_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    otp = generate_otp()

    await save_otp(
        identifier=data.identifier,
        otp=otp,
        purpose="login"
    )

    if "@" in data.identifier:
        await send_email_otp(
            to_email=data.identifier,
            otp=otp
        )

    return {
        "message": "OTP sent successfully"
    }


@router.post("/resend-otp")
async def resend_otp(data: ResendOTPRequest):
    if "@" in data.identifier:
        user = await users_collection.find_one({ "email": data.identifier })
    else:
        user = await users_collection.find_one({ "phone_number": data.identifier })

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    otp = generate_otp()

    await save_otp(identifier=data.identifier, otp=otp, purpose="login")

    if "@" in data.identifier:
        await send_email_otp(to_email=data.identifier, otp=otp)
    else:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="SMS OTP is not implemented yet.")

    return {
        "message": "OTP resent successfully"
    }


@router.post("/verify-otp")
async def verify_otp_endpoint(data: VerifyOTPRequest):
    otp_record = await verify_otp(
        identifier=data.identifier,
        otp=data.otp,
        purpose="login"
    )

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    if "@" in data.identifier:
        user = await users_collection.find_one({
            "email": data.identifier
        })
    else:
        user = await users_collection.find_one({
            "phone_number": data.identifier
        })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    await otp_collection.update_one(
        {"_id": otp_record["_id"]},
        {
            "$set": {
                "verified": True
            }
        }
    )

    access_token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"]
    })

    refresh_token = create_refresh_token({
        "user_id": str(user["_id"]),
        "email": user["email"]
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    if "@" in data.identifier:
        user = await users_collection.find_one({
            "email": data.identifier
        })
    else:
        user = await users_collection.find_one({
            "phone_number": data.identifier
        })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    otp = generate_otp()

    await save_otp(
        identifier=data.identifier,
        otp=otp,
        purpose="reset_password"
    )

    if "@" in data.identifier:
        await send_email_otp(
            to_email=data.identifier,
            otp=otp
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="SMS reset password is not implemented yet."
        )

    return {
        "message": "Password reset OTP sent successfully"
    }


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    otp_record = await verify_otp(
        identifier=data.identifier,
        otp=data.otp,
        purpose="reset_password"
    )

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    if "@" in data.identifier:
        user = await users_collection.find_one({
            "email": data.identifier
        })
    else:
        user = await users_collection.find_one({
            "phone_number": data.identifier
        })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": hash_password(data.new_password),
                "updated_at": datetime.utcnow()
            }
        }
    )

    await otp_collection.update_one(
        {"_id": otp_record["_id"]},
        {
            "$set": {
                "verified": True
            }
        }
    )

    return {
        "message": "Password reset successfully"
    }


@router.get("/verify-token")
async def verify_token_endpoint(payload: dict = Depends(get_current_user_payload)):
    return {
        "valid": True,
        "user_id": payload["user_id"],
        "email": payload["email"]
    }


@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    payload: dict = Depends(get_current_user_payload)
):
    token = credentials.credentials
    decoded = verify_token(token, expected_type="access")
    expires_at = (
        datetime.utcfromtimestamp(decoded["exp"])
        if decoded and "exp" in decoded
        else datetime.utcnow()
    )

    await blacklisted_tokens_collection.insert_one({
        "token": token,
        "user_id": payload["user_id"],
        "blacklisted_at": datetime.utcnow(),
        "expires_at": expires_at
    })

    return {"message": "Logged out successfully"}


@router.put("/refresh-token")
async def refresh_token_endpoint(data: RefreshTokenRequest):
    payload = verify_token(data.refresh_token, expected_type="refresh")

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    user = await users_collection.find_one({"_id": ObjectId(payload["user_id"])})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    new_access_token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"]
    })

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }