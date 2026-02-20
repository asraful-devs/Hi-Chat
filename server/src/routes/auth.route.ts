import express from 'express';
import { login, logout, singup } from '../controllers/auth.controller.ts';

const router = express.Router();

router.post('/signup', singup);

router.post('/login', login);

router.post('/logout', logout);

router.get('/api/auth', (req, res) => {
    res.send('Hello from the server!');
});

export default router;
