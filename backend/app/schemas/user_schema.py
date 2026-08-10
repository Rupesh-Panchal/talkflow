from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    phone_number: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None        # can change email
    phone_number: Optional[str] = None      # can change number
    avatar_url: Optional[str] = None        # can change photo


class UserPasswordUpdate(BaseModel):        # separate — needs old password verify
    old_password: str
    new_password: str