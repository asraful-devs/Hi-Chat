import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { connectDB } from './lib/db.ts';
import { ENV } from './lib/env.ts';
import { initializeSocket } from './lib/socket.ts';
import authRoutes from './routes/auth.route.ts';
import messageRoutes from './routes/message.route.ts';

const app = express();
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

const PORT = ENV.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

// Example of a protected route using Arcjet middleware   rate limiting and bot detection
// app.get('/test-rate-limit', arcjetProtection, (req, res) => {
//     res.send('This is a test endpoint for rate limiting.');
// });

app.use('/server', (req: Request, res: Response) => {
    res.send('Hello from the Hi Chat server!!!');
});

// __dirname is not available in ES modules, so we need to use path.resolve() to get the current directory
// This is necessary to serve the static files in production
const __dirname = path.resolve();

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(
            path.join(__dirname, '..', 'client', 'dist', 'index.html')
        );
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on port : http://localhost:${PORT}`);
    connectDB();
});
