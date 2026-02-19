import express from 'express';

const router = express.Router();

router.get('/api/auth', (req, res) => {
    res.send('Hello from the server!');
});

export default router;
