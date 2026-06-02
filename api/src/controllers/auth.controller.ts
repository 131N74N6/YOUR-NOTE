import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function signIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        
        if (!email && !password) return res.status(400).json({ message: 'Email and password are required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!password) return res.status(400).json({ message: 'Password is required' });
        
        const findUserByEmail = await User.findOne({ email });
        if (!findUserByEmail) return res.status(400).json({ message: 'Incorrect email or password' });

        const isPasswordMatch = await bcrypt.compare(password, findUserByEmail.password);
        if (!isPasswordMatch) return res.status(400).json({ message: 'Incorrect email or password' });

        const token = jwt.sign(
            { user_id: findUserByEmail._id, username: findUserByEmail.username },
            process.env.JWT_SECRET || 'your_jwt_key',
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ 
            user_id: findUserByEmail._id,
            username: findUserByEmail.username
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function signUp(req: Request, res: Response) {
    try {
        const { created_at, email, password, username } = req.body;
        if (!email && !password && !username) return res.status(400).json({ message: 'Email, username, and password are required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!password) return res.status(400).json({ message: 'Password is required' });
        if (!username) return res.status(400).json({ message: 'Username is required' });

        const isEmailExists = await User.findOne({ email });
        const isUsernameExists = await User.findOne({ username });
        
        if (isUsernameExists) return res.status(409).json({ message: 'This username already exist' });
        if (isEmailExists) return res.status(409).json({ message: 'This email already exist' });
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            created_at,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();
        res.status(200).json({ message: 'Sign up success' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function signOut(req: Request, res: Response) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
            secure: process.env.NODE_ENV === 'production'
        });
        res.status(200).json({ message: 'Sign out success' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}