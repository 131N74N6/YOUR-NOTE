import { Request, Response } from "express";
import { ChatBot } from "../models/chatbot.model";

export async function deleteAllChatHistories(req: Request, res: Response) {
    try {
        const userChats = await ChatBot.find({ user_id: req.params.user_id });
        if (userChats.length === 0) return res.status(400).json({ message: "No chat histories found for this user" });

        await ChatBot.deleteMany({ user_id: req.params.user_id });
        res.status(200).json({ message: "All chat histories deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to delete all chat histories" });
    }
}

export async function deleteChatHistory(req: Request, res: Response) {
    try {
        await ChatBot.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Chat history deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to delete chat history" });
    }
}

export async function getAllChatHistories(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const chatHistories = await ChatBot.find({ user_id: req.params.user_id }).skip(skip).limit(limit).sort({ created_at: -1 });
        res.status(200).json(chatHistories);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to retrieve chat histories" });
    }
}

export async function getDetailedChat(req: Request, res: Response) {
    try {
        const detailedChat = await ChatBot.find({ _id: req.params.id });
        if (!detailedChat) return res.status(404).json({ message: "Chat not found" });

        res.status(200).json(detailedChat);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to retrieve detailed chat" });
    }
}

export async function saveChat(req: Request, res: Response) {
    try {
        const newChat = new ChatBot(req.body);

        if (!newChat.question) return res.status(400).json({ message: "Question is required" });

        await newChat.save();
        res.status(200).json({ message: "Chat saved successfully", chat: newChat });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to save chat" });
    }
}