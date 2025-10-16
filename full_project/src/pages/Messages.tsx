
import React, { useState } from 'react';
import { FaUsers, FaPaperclip, FaPaperPlane } from 'react-icons/fa';


export const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState('team-1');
  const [messageText, setMessageText] = useState('');

  const conversations = [
    { id: 'team-1', name: 'Wellness Warriors', type: 'team', unread: 2, lastMessage: 'Great job on the quest today!', avatar: '⚡' },
    { id: 'team-2', name: 'Study Squad', type: 'team', unread: 0, lastMessage: 'See you at tomorrow\'s reading session', avatar: '📚' },
    { id: 'user-1', name: 'Quest Master', type: 'direct', unread: 1, lastMessage: 'Want to team up for the new quest?', avatar: '⚔️' },
    { id: 'user-2', name: 'Mindful Monk', type: 'direct', unread: 0, lastMessage: 'Thanks for the motivation!', avatar: '🧘' },
  ];

  const messages = [
    { id: 1, sender: 'Quest Master', avatar: '⚔️', message: 'Hey team! Ready for today\'s challenge?', time: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', avatar: '🧙‍♂️', message: 'Absolutely! Let\'s crush those habits 💪', time: '10:32 AM', isOwn: true },
    { id: 3, sender: 'Mindful Monk', avatar: '🧘', message: 'I just completed my morning meditation. Feeling great!', time: '10:35 AM', isOwn: false },
    { id: 4, sender: 'You', avatar: '🧙‍♂️', message: 'Amazing! Keep up the great work everyone 🌟', time: '10:36 AM', isOwn: true },
  ];

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // Add message logic would go here
      setMessageText('');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
        <p className="text-gray-600">Connect with your team and stay motivated together</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Conversations</h2>
          </div>

          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedConversation === conversation.id ? 'bg-purple-50 border-r-4 border-r-purple-500' : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="text-2xl">{conversation.avatar}</span>
                    {conversation.type === 'team' && (
                      <FaUsers className="absolute -bottom-2 -right-2 text-purple-400 bg-white rounded-full p-0.5" size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">{conversation.name}</h3>
                      {conversation.unread > 0 && (
                        <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-indigo-100 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentConversation?.avatar}</span>
              <div>
                <h2 className="font-bold text-gray-800">{currentConversation?.name}</h2>
                <p className="text-sm text-gray-500">
                  {currentConversation?.type === 'team' ? 'Team Chat' : 'Direct Message'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
              >
                <span className="text-2xl flex-shrink-0">{message.avatar}</span>
                <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'text-right' : ''}`}>
                  {!message.isOwn && (
                    <p className="text-sm font-medium text-gray-700 mb-1">{message.sender}</p>
                  )}
                  <div className={`rounded-lg p-3 ${message.isOwn
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    <p>{message.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                title="Attach file"
              >
                <FaPaperclip />
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200"
                title="Send"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};