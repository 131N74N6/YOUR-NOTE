export interface IUser {
    user_id: string;
    username: string;
}

export type SignInIntrf = {
    email: string;
    password: string;
}

export type UserInfoIntrf = {
    email: string;
    username: string;
    user_id: string;
    created_at: string;
}