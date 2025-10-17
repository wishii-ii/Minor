import React, { useState } from 'react';
import { FaUsers, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
// avoid importing react-router-dom here to keep this page usable when the package isn't installed
import { useUser } from '../contexts/UserContext';

type ConversationType = 'team' | 'direct';

interface Conversation {
  id: string;
  name: string;
  type: ConversationType;
  online: boolean;
  lastMessage: string;
  avatar: string;
}

interface Message {
  id: number;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  isOwn: boolean;
}

const sampleConversations: Conversation[] = [
  // `online` indicates whether that user/team currently has active users on the website
  { id: 'team-1', name: 'Wellness Warriors', type: 'team', online: true, lastMessage: 'Great job on the quest today!', avatar: '⚡' },
  { id: 'team-2', name: 'Study Squad', type: 'team', online: false, lastMessage: "See you at tomorrow's reading session", avatar: '📚' },
  { id: 'user-1', name: 'Quest Master', type: 'direct', online: true, lastMessage: 'Want to team up for the new quest?', avatar: '⚔️' },
  { id: 'user-2', name: 'Mindful Monk', type: 'direct', online: false, lastMessage: 'Thanks for the motivation!', avatar: '🧘' },
];

const sampleMessages: Message[] = [
  { id: 1, sender: 'Quest Master', avatar: '⚔️', message: "Hey team! Ready for today's challenge?", time: '10:30 AM', isOwn: false },
  { id: 2, sender: 'You', avatar: '🧙‍♂️', message: "Absolutely! Let's crush those habits 💪", time: '10:32 AM', isOwn: true },
  { id: 3, sender: 'Mindful Monk', avatar: '🧘', message: 'I just completed my morning meditation. Feeling great!', time: '10:35 AM', isOwn: false },
];

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>(sampleConversations[0].id);
  const [messageText, setMessageText] = useState('');
  const [devOverride, setDevOverride] = useState(false);
  // use window.location as a simple fallback for navigation
  const { user } = useUser();

  const isDev = process.env.NODE_ENV !== 'production';
  const isUnlocked = devOverride || ((user?.level ?? 0) >= 5);

  const currentConversation = sampleConversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnlocked) return;
    if (messageText.trim()) setMessageText('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
        <p className="text-gray-600">Connect with your team and stay motivated together</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {!isUnlocked && (
          <div className="lg:col-span-3 mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-100 text-yellow-800 flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div>
                <strong>Messaging is locked</strong>
                <div className="text-sm">Messaging is locked until you reach level 5. Keep completing habits to unlock team chat and direct messages.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { window.location.href = '/habits'; }} className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">Go to Habits</button>
              {isDev && (
                <button onClick={() => setDevOverride(v => !v)} className={`px-3 py-1 rounded-md text-sm ${devOverride ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {devOverride ? 'Dev: Unlocked' : 'Dev: Unlock'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Conversations</h2>
          </div>

          <div className="overflow-y-auto h-full">
            {sampleConversations.map(conv => (
              // disable selection if messaging is locked or the conversation is not currently online
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                disabled={!isUnlocked || !conv.online}
                className={`w-full p-4 text-left border-b border-gray-100 transition-colors ${isUnlocked && conv.online ? 'bg-white text-gray-800' : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-80'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="text-2xl">{conv.avatar}</span>
                    {conv.type === 'team' && <FaUsers className={`absolute -bottom-2 -right-2 ${isUnlocked && conv.online ? 'text-purple-400' : 'text-gray-300'} bg-white rounded-full p-0.5`} size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">{conv.name}</h3>
                      {/* removed the small unread badge per request */}
                      <span className={`text-xs ${conv.online ? 'text-green-600' : 'text-gray-400'}`}>{conv.online ? 'Online' : 'Offline'}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-indigo-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentConversation?.avatar}</span>
              <div>
                <h2 className="font-bold text-gray-800">{currentConversation?.name}</h2>
                <p className="text-sm text-gray-500">{currentConversation?.type === 'team' ? 'Team Chat' : 'Direct Message'} {currentConversation ? (currentConversation.online ? <span className="text-green-600 ml-2 text-xs">• Online</span> : <span className="text-gray-400 ml-2 text-xs">• Offline</span>) : null}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {sampleMessages.map(m => (
              <div key={m.id} className={`flex gap-3 ${m.isOwn ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl flex-shrink-0">{m.avatar}</span>
                <div className={`max-w-xs lg:max-w-md ${m.isOwn ? 'text-right' : ''}`}>
                  {!m.isOwn && <p className="text-sm font-medium text-gray-700 mb-1">{m.sender}</p>}
                  <div className={`rounded-lg p-3 ${m.isOwn ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p>{m.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={
                  !isUnlocked ? 'Messaging locked until level 5' : !currentConversation || !currentConversation.online ? 'Recipient is offline' : 'Type your message...'
                }
                disabled={!isUnlocked || !currentConversation || !currentConversation.online}
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none ${isUnlocked ? 'border-gray-300 focus:ring-2 focus:ring-purple-500' : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              />
              <button type="button" disabled={!isUnlocked || !currentConversation || !currentConversation.online} className={`p-2 ${isUnlocked && currentConversation && currentConversation.online ? 'text-gray-500 hover:text-purple-600' : 'text-gray-300'}`} title="Attach file">
                <FaPaperclip />
              </button>
              <button type="submit" disabled={!isUnlocked || !currentConversation || !currentConversation.online} className={`p-2 rounded-lg ${isUnlocked && currentConversation && currentConversation.online ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`} title="Send">
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;