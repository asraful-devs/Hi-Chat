import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.ts';
import User from '../models/User.ts';

export const socketAuthMiddleware = async (
    socket: any,
    next: (err?: Error) => void
) => {
    try {
        // extract token from http-only cookies
        const token = socket.handshake.headers.cookie
            ?.split('; ')
            .find((row: string) => row.startsWith('jwt='))
            ?.split('=')[1];

        if (!token) {
            console.log('Socket connection rejected: No token provided');
            return next(new Error('Unauthorized - No Token Provided'));
        }

        // verify the token
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as { userId: string };
        if (!decoded) {
            console.log('Socket connection rejected: Invalid token');
            return next(new Error('Unauthorized - Invalid Token'));
        }

        // find the user fromdb
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            console.log('Socket connection rejected: User not found');
            return next(new Error('User not found'));
        }

        // attach user info to socket
        socket.user = user;
        socket.userId = user._id.toString();

        console.log(
            `Socket authenticated for user: ${user.fullName} (${user._id})`
        );

        next();
    } catch (error) {
        console.log('Error in socket authentication:', error);
        next(new Error('Unauthorized - Authentication failed'));
    }
};
