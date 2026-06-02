import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { User } from "../models/user.model";
import { Notes } from "../models/note.model";
import { ChatBot } from "../models/chatbot.model";
import { Activity } from "../models/activity.model";
import { Balances } from "../models/balance.model";

export async function deleteUser(req: AuthRequest, res: Response) {
    try {
        const user = await User.find({ _id: req.user?.user_id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await Promise.all([
            Activity.deleteMany({ user_id: req.user?.user_id }),
            Balances.deleteMany({ user_id: req.user?.user_id }),
            ChatBot.deleteMany({ user_id: req.user?.user_id }),
            Notes.deleteMany({ user_id: req.user?.user_id }),
            User.deleteOne({ _id: req.user?.user_id })
        ]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete user. Try again later' });
    }
}

export async function editUserInfo(req: AuthRequest, res: Response) {
    try {
        const { email, username } = req.body;
        if (!email && !username) return res.status(400).json({ message: 'Email and username are required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!username) return res.status(400).json({ message: 'Username is required' });

        const isUserNameExist = await User.findOne({ username });
        if (isUserNameExist) return res.status(409).json({ message: 'Username already exists' });

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) return res.status(409).json({ message: 'Email already exists' });

        await Promise.all([
            User.updateOne({ _id: req.user?.user_id }, {
                $set: { email, username }
            }),
            Activity.updateMany({ user_id: req.user?.user_id }, {
                $set: { username }
            }),
            Balances.updateMany({ user_id: req.user?.user_id }, {
                $set: { username }
            }),
            ChatBot.updateMany({ user_id: req.user?.user_id }, {
                $set: { username }
            }),
            Notes.updateMany({ user_id: req.user?.user_id }, {
                $set: { username }
            }),
        ]);

        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user information. Try again later' });
    }
}

export async function getUserInfo(req: AuthRequest, res: Response) {
    try {
        const user = await User.findOne({ _id: req.user?.user_id }, { password: 0 });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            email: user.email,
            created_at: user.created_at,
            user_id: user._id,
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user information. Try again later' });
    }
}