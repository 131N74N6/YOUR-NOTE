import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        user_id: string;
        username: string;
    } 
}

export interface CustomJwtPayload extends JwtPayload {
    user_id: string;
    username: string;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Access token is missing' });

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_key', (error: any, decoded: any) => {
        if (error) return res.status(403).json({ message: 'Invalid access token' });

        const payload = decoded as CustomJwtPayload;

        req.user = {
            user_id: payload.user_id,
            username: payload.username
        }
        
        next();
    });
}

export function checkOwnership(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ message: 'Authentication required before checking ownership' });

    const requestedId = req.params.user_id;

    if (!requestedId) return res.status(400).json({ message: 'Resource id parameter required' });
    if (req.user.user_id !== requestedId) return res.status(403).json({ message: 'You do not have permission to access this resource' });

    next();
}