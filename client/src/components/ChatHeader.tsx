import { ArrowLeftIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const isOnline = selectedUser
        ? onlineUsers.includes(selectedUser._id)
        : false;

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedUser(null);
        };

        window.addEventListener('keydown', handleEscKey);

        // cleanup function
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [setSelectedUser]);

    return (
        <div className='flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-3 md:px-6 py-3 shrink-0'>
            <div className='flex items-center space-x-2 md:space-x-3'>
                {/* Back button - visible only on mobile */}
                <button
                    onClick={() => setSelectedUser(null)}
                    className='md:hidden text-slate-400 hover:text-slate-200 transition-colors p-1'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                </button>

                <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                    <div className='w-10 md:w-12 rounded-full'>
                        <img
                            src={selectedUser?.profilePic || '/avatar.png'}
                            alt={selectedUser?.fullName || 'User'}
                        />
                    </div>
                </div>

                <div>
                    <h3 className='text-slate-200 font-medium text-sm md:text-base truncate max-w-32 md:max-w-none'>
                        {selectedUser?.fullName}
                    </h3>
                    <p className='text-slate-400 text-xs md:text-sm'>
                        {isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Close button - hidden on mobile (use back button instead) */}
            <button
                onClick={() => setSelectedUser(null)}
                className='hidden md:block'
            >
                <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer' />
            </button>
        </div>
    );
}
export default ChatHeader;
