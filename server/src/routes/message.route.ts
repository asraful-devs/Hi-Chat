import express from 'express';
import {
    getAllContacts,
    getChatPartners,
    getMessagesByUserId,
    sendMessage,
} from '../controllers/message.controller.ts';
import { arcjetProtection } from '../middleware/arcjet.middleware.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, authMiddleware);

router.get('/contacts', getAllContacts);
router.get('/chats', getChatPartners);
router.get('/:id', getMessagesByUserId);
router.post('/send/:id', sendMessage);

export default router;
