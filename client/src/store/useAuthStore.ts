import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

interface AuthUser {
    id: string;
    name: string;
    email: string;
}

interface AuthStore {
    authUser: AuthUser | null;
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
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
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
            set({ authUser: null });
            toast.success('Logged out successfully');
        } catch {
            toast.error('Error logging out');
        }
    },
    updateProfile: async (data: { profilePic?: string; fullName?: string }) => {
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log('Error in update profile:', error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data.message || 'Update failed');
        }
    },
}));
