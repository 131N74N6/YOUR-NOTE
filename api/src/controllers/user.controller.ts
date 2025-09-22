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

        if (!findUserByEmail) return res.status(401).json({ message: 'Incorrect email or password' });

        const isPasswordMatch = await bcrypt.compare(password, findUserByEmail.password);

        if (!isPasswordMatch) return res.status(401).json({ message: 'Incorrect email or password' });

        const token = jwt.sign(
            { id: findUserByEmail._id, email: findUserByEmail.email, username: findUserByEmail.username },
            process.env.JWT_SECRET || 'your jwt key',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Sign in success', token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function signUp(req: Request, res: Response) {
    try {
        const { email, password, username } = req.body;
        const alreadyExits = await User.findOne({ email });

        if (alreadyExits) return res.status(409).json({ message: 'User already exist' });
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
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