import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

// Define your types
interface User {
    _id: string;
    // add other user properties as needed
}

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    createdAt: string;
    isOptimistic?: boolean;
}

interface ChatState {
    allContacts: User[];
    chats: User[];
    messages: Message[];
    activeTab: string;
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    isSoundEnabled: boolean;

    // Actions
    toggleSound: () => void;
    setActiveTab: (tab: string) => void;
    setSelectedUser: (selectedUser: User | null) => void;
    getAllContacts: () => Promise<void>;
    getMyChatPartners: () => Promise<void>;
    getMessagesByUserId: (userId: string) => Promise<void>;
    sendMessage: (messageData: {
        text?: string;
        image?: string;
    }) => Promise<void>;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: 'chats',
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled:
        JSON.parse(localStorage.getItem('isSoundEnabled') || 'false') === true,

    toggleSound: () => {
        localStorage.setItem('isSoundEnabled', String(!get().isSoundEnabled));
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/contacts');
            set({ allContacts: res.data });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(
                axiosError?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/chats');
            set({ chats: res.data });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(
                axiosError?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(
                axiosError?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id as string,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        // immidetaly update the ui by adding the message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );
            set({ messages: messages.concat(res.data) });
        } catch (error) {
            // remove optimistic message on failure
            set({ messages: messages });
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(
                axiosError?.response?.data?.message || 'Something went wrong'
            );
        }
    },

    subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on('newMessage', (newMessage) => {
            const isMessageSentFromSelectedUser =
                newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            const currentMessages = get().messages;
            set({ messages: [...currentMessages, newMessage] });

            if (isSoundEnabled) {
                const notificationSound = new Audio('/sounds/notification.mp3');

                notificationSound.currentTime = 0; // reset to start
                notificationSound
                    .play()
                    .catch((e) => console.log('Audio play failed:', e));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },
}));
