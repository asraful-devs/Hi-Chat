import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { ENV } from './env.ts';

let io: Server;

// Store online users: { oddserId: socketId }
const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (userId: string): string | undefined => {
    return userSocketMap[userId];
};

export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: ENV.CLIENT_URL,
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        const userId = socket.handshake.query.userId as string;

        if (userId) {
            userSocketMap[userId] = socket.id;
        }

        // Broadcast online users to all connected clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);

            if (userId) {
                delete userSocketMap[userId];
            }

            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
