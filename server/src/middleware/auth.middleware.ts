import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { ENV } from '../lib/env.ts';
import User from '../models/User.ts';
import type { IUser } from '../types/user.type.ts';

interface AuthRequest extends Request {
    user?: IUser;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

        if (!decoded) {
            return res
                .status(401)
                .json({ message: 'Unauthorized - Invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Unauthorized - User not found' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
