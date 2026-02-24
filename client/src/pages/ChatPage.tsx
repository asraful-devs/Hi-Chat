import ActiveTabSwitch from '../components/ActiveTabSwitch';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import ChatContainer from '../components/ChatContainer';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';
import ProfileHeader from '../components/ProfileHeader';
import { useChatStore } from '../store/useChatStore';

function ChatPage() {
    const { activeTab, selectedUser } = useChatStore();

    return (
        <div className='relative w-full max-w-6xl h-[calc(100vh-2rem)] md:max-h-175 mx-auto'>
            <BorderAnimatedContainer>
                {/* LEFT SIDE - Hidden on mobile when user is selected */}
                <div
                    className={`md:w-80 w-full bg-slate-800/50 backdrop-blur-sm flex flex-col min-h-0 ${
                        selectedUser ? 'hidden md:flex' : 'flex'
                    }`}
                >
                    <ProfileHeader />
                    <ActiveTabSwitch />

                    <div className='flex-1 overflow-y-auto p-4 space-y-2 min-h-0'>
                        {activeTab === 'chats' ? (
                            <ChatsList />
                        ) : (
                            <ContactList />
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE - Hidden on mobile when no user is selected */}
                <div
                    className={`flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm overflow-hidden min-h-0 ${
                        selectedUser ? 'flex' : 'hidden md:flex'
                    }`}
                >
                    {selectedUser ? (
                        <ChatContainer />
                    ) : (
                        <NoConversationPlaceholder />
                    )}
                </div>
            </BorderAnimatedContainer>
        </div>
    );
}
export default ChatPage;
