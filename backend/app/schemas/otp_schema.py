from pydantic import BaseModel


class LoginOTPRequest(BaseModel):
    identifier: str
    password: str


class VerifyOTPRequest(BaseModel):
    identifier: str
    otp: str


class ResendOTPRequest(BaseModel):
    identifier: str


class ForgotPasswordRequest(BaseModel):
    identifier: str


class ResetPasswordRequest(BaseModel):
    identifier: str
    otp: str
    new_password: str