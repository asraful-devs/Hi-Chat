import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { sendWelcomeEmail } from '../emails/emailHandlers.ts';
import { ENV } from '../lib/env.ts';
import { generateToken } from '../lib/utils.ts';
import User from '../models/User.ts';

export const singup = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    const name = typeof fullName === 'string' ? fullName.trim() : '';
    const normalizedEmail =
        typeof email === 'string' ? email.trim().toLowerCase() : '';
    const pass = typeof password === 'string' ? password.trim() : '';

    try {
        if (!name || !normalizedEmail || !pass) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (pass.length < 6) {
            return res
                .status(400)
                .json({ message: 'Password must be at least 6 characters' });
        }

        // check if emailis valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (user)
            return res.status(400).json({ message: 'Email already exists' });

        // 123456 => $dnjasdkasj_?dmsakmk
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        const newUser = new User({
            fullName: name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        if (newUser) {
            // Persist user first, then issue auth cookie
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                profilePic: savedUser.profilePic,
            });

            try {
                await sendWelcomeEmail(
                    savedUser.email,
                    savedUser.fullName,
                    ENV.CLIENT_URL as string
                );
            } catch (error) {
                console.error('Failed to send welcome email:', error);
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const normalizedEmail =
        typeof email === 'string' ? email.trim().toLowerCase() : '';
    const pass = typeof password === 'string' ? password.trim() : '';

    if (!normalizedEmail || !pass) {
        return res
            .status(400)
            .json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
};
