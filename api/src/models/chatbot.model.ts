import mongoose, { Schema, Types } from "mongoose";

type IChatBot = {
    answer: string;
    created_at: string;
    question: string;
    user_id: Types.ObjectId;
}

const chatBotSchema = new Schema<IChatBot>({
    answer: { type: String, required: true },
    created_at: { type: String, required: true },
    question: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

const ChatBot = mongoose.model<IChatBot>('chatbot', chatBotSchema, 'chatbot');

export { ChatBot, IChatBot }