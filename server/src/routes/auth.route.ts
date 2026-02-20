import express, { type Response } from 'express';
import {
    login,
    logout,
    singup,
    updateProfile,
} from '../controllers/auth.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import type { AuthRequest } from '../types/global.inerface.ts';

const router = express.Router();

router.post('/signup', singup);

router.post('/login', login);

router.post('/logout', logout);

router.patch('/update-profile', authMiddleware, updateProfile as any);

router.get('/check-auth', authMiddleware, (req: AuthRequest, res: Response) => {
    res.status(200).json({ user: req.user, message: 'Authenticated' });
});

router.get('/api/auth', (req, res) => {
    res.send('Hello from the server!');
});

export default router;
