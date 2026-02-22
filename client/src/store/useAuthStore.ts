import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

const BASE_URL =
    import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '/';

interface AuthUser {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
}

interface AuthStore {
    authUser: AuthUser | null;
    Socket: Socket | null;
    onlineUsers: string[];
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    checkAuth: () => Promise<void>;
    signup: (data: {
        fullName: string;
        email: string;
        password: string;
    }) => Promise<void>;
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: {
        profilePic?: string;
        fullName?: string;
    }) => Promise<void>;
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    Socket: null,
    onlineUsers: [],
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check-auth');
            set({ authUser: res.data.user });
            get().connectSocket();
        } catch (error) {
            console.log('Error in authCheck:', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data: {
        email: string;
        password: string;
        fullName: string;
    }) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            get().connectSocket();
            toast.success('Account created successfully!');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data.message || 'Signup failed');
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data: { email: string; password: string }) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            get().connectSocket();
            toast.success('Logged in successfully');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data.message || 'Login failed');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            get().disconnectSocket();
            set({ authUser: null });
            toast.success('Logged out successfully');
        } catch {
            toast.error('Error logging out');
        }
    },

    updateProfile: async (data: { profilePic?: string; fullName?: string }) => {
        try {
            const res = await axiosInstance.patch('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log('Error in update profile:', error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data.message || 'Update failed');
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().Socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error.message);
        });

        set({ Socket: socket });

        socket.on('getOnlineUsers', (userIds: string[]) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        const socket = get().Socket;
        if (socket?.connected) {
            socket.disconnect();
        }
    },
}));
