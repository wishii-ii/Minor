import React, { useEffect, useState } from 'react';
import { FaUsers, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { BaseLayout } from '../components/BaseLayout';

const Messages: React.FC = () => {
  const { user } = useUser();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const appId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'default-app-id';

  useEffect(() => {
    if (!user) return;
    
    const fetchMessages = async () => {
      if (!db) return;
      
      const messagesRef = collection(db, `artifacts/${appId}/users/${user.id}/messages`);
      
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgs);
        
        const convMap = new Map<string, any>();
        const sortedMsgs = msgs.sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        sortedMsgs.forEach((m: any) => {
          const id = m.conversationId || 'general';
          const entry = convMap.get(id) || { id, name: id, avatar: '💬', type: 'team', lastMessage: '' };
          
          if (!convMap.has(id)) {
             entry.lastMessage = m.text;
          }
          
          convMap.set(id, entry);
        });
        setConversations(Array.from(convMap.values()));
      });
      
      return () => unsubscribe();
    };

    fetchMessages();
  }, [user, appId]);

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) setSelectedConversation(conversations[0].id);
  }, [conversations, selectedConversation]);

  const currentMessages = selectedConversation ? messages.filter((m: any) => m.conversationId === selectedConversation) : [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || !user || !db) return;
    
    try {
      const messagesRef = collection(db, `artifacts/${appId}/users/${user.id}/messages`);
      await addDoc(messagesRef, {
        text: messageText.trim(),
        conversationId: selectedConversation,
        senderId: user.id,
        senderName: user.displayName,
        avatar: user.avatar,
        createdAt: Timestamp.now(),
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }; 
  
  const formatTime = (createdAt: any) => {
    if (!createdAt) return '';
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt); 
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <BaseLayout className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Messages</h1>
        <p className="text-gray-600 dark:text-gray-300">Connect with your team and stay motivated together</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-white">Conversations</h2>
          </div>

          <div className="overflow-y-auto h-full">
            {conversations.map((conversation: any) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedConversation === conversation.id 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-r-4 border-r-purple-500' 
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="text-2xl">{conversation.avatar}</span>
                    {conversation.type === 'team' && (
                      <FaUsers className="absolute -bottom-2 -right-2 text-purple-400 bg-white dark:bg-gray-800 rounded-full p-0.5" size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white truncate">{conversation.name}</h3>
                      {conversation.unread > 0 && (
                        <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900/30 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{conversations.find(c => c.id === selectedConversation)?.avatar}</span>
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white">
                  {conversations.find(c => c.id === selectedConversation)?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversations.find(c => c.id === selectedConversation)?.type === 'team' ? 'Team Chat' : 'Direct Message'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {currentMessages.map((message: any) => (
              <div key={message.id} className={`flex gap-3 ${message.senderId === user?.id ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl flex-shrink-0">{message.avatar}</span>
                <div className={`max-w-xs lg:max-w-md ${message.senderId === user?.id ? 'text-right' : ''}`}>
                  {message.senderId !== user?.id && (
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <div className={`rounded-lg p-3 ${
                    message.senderId === user?.id 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}>
                    <p>{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={messageText} 
                onChange={(e) => setMessageText(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <button 
                type="button" 
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" 
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
    </BaseLayout>
  );
};

export default Messages;