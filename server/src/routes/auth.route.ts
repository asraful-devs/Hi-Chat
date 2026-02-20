import express from 'express';
import { singup } from '../controllers/auth.controller.ts';

const router = express.Router();

router.post('/signup', singup);

router.get('/api/auth', (req, res) => {
    res.send('Hello from the server!');
});

export default router;
