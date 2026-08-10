export interface RegisterPayload {
    username: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface VerifyOTPPayload {
    identifier: string;
    otp: string;
}

export interface ForgotPasswordPayload {
	identifier: string;
}

export interface ResetPasswordPayload {
	identifier: string;
	otp: string;
	new_password: string;
}

export interface AuthTokens {
	message: string;
	access_token: string;
	refresh_token: string;
	token_type: string;
}

export interface TokenPayload {
	user_id: string;
	email: string;
	exp: number;
}