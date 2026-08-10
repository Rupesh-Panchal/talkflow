export interface User {
    id: string;
    username: string;
    email: string;
    phone_number: string;
    avatar_url: string | null;
    is_online: boolean;
    last_seen: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserUpdate {
    username?: string;
    email?: string;
    phone_number?: string;
}

export interface UserPasswordUpdate {
    old_password: string;
    new_password: string;
}