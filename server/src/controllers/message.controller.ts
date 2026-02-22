import type { Response } from 'express';
import type { Types } from 'mongoose';
import cloudinary from '../lib/cloudinary.ts';
import { getIO, getReceiverSocketId } from '../lib/socket.ts';
import Message from '../models/Message.ts';
import User from '../models/User.ts';
import type { AuthRequest } from '../types/global.inerface.ts';

export const getAllContacts = async (req: AuthRequest, res: Response) => {
    try {
        const loggedInUserId = req.user?._id as Types.ObjectId;

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log('Error in getAllContacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getChatPartners = async (req: AuthRequest, res: Response) => {
    try {
        const loggedInUserId = req.user?._id as Types.ObjectId;

        // find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            ),
        ];

        const chatPartners = await User.find({
            _id: { $in: chatPartnerIds },
        }).select('-password');

        res.status(200).json(chatPartners);
    } catch (error) {
        console.error('Error in getChatPartners: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getMessagesByUserId = async (req: AuthRequest, res: Response) => {
    try {
        const myId = req.user?._id as Types.ObjectId;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessages controller: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params as { id: string };
        const senderId = req.user?._id as Types.ObjectId;

        if (!text && !image) {
            return res
                .status(400)
                .json({ message: 'Text or image is required.' });
        }
        if (senderId.equals(receiverId)) {
            return res
                .status(400)
                .json({ message: 'Cannot send messages to yourself.' });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: 'Receiver not found.' });
        }

        let imageUrl;
        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // Emit message to receiver in real-time
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            getIO().to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage controller: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
