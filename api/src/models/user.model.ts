import mongoose, { Schema } from "mongoose";

interface IUsers {
    email: string;
    username: string;
    password: string;
    created_at: string;
}

const userSchema = new Schema<IUsers>({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: String, required: true }
});

const User = mongoose.model<IUsers>('users', userSchema, 'users');

export { IUsers, User }