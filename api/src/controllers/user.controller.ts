import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function signIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const findUserByEmail = await User.findOne({ email });

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        if (!findUserByEmail) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, findUserByEmail.password);

        if (!isPasswordMatch) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        const token = jwt.sign(
            { 
                id: findUserByEmail._id, 
                email: findUserByEmail.email, 
                username: findUserByEmail.username 
            },
            process.env.JWT_SECRET || 'your jwt key',
        );

        res.status(200).json({ 
            message: 'Sign in success', 
            token,
            info: {
                id: findUserByEmail._id,
                email: findUserByEmail.email,
                username: findUserByEmail.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function signUp(req: Request, res: Response) {
    try {
        const { created_at, email, password, username } = req.body;
        const alreadyExits = await User.findOne({ email });

        if (!email || !password ||!username) {
            res.status(400).json({ message: 'Email, username, and password are required' });
            return;
        }

        if (alreadyExits) {
            res.status(409).json({ message: 'User already exist' });
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            created_at,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();
        res.status(201).json({ message: 'Sign up success' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export { signIn, signUp }