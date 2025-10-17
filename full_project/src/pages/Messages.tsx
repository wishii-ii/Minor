import React, { useEffect, useState } from 'react';
import { FaUsers, FaPaperclip, FaPaperPlane } from 'react-icons/fa';

import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';

// Removed 'declare const __app_id', as we are using import.meta.env
// The environment variables in .env.local are accessible via import.meta.env

const Messages: React.FC = () => {
  const { user } = useUser();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // FIX: Retrieve the app identifier from the environment variables (VITE_FIREBASE_PROJECT_ID is a stable unique ID)
  // For the purpose of Firestore security pathing, we need a unique application identifier.
  // Using VITE_FIREBASE_PROJECT_ID from your .env.local file.
  const appId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'default-app-id';


  useEffect(() => {
    if (!user) return;
    
    const fetchMessages = async () => {
      if (!db) return;
      
      // Firestore path using the project ID as the secure app ID: /artifacts/{projectId}/users/{userId}/messages
      const messagesRef = collection(db, `artifacts/${appId}/users/${user.id}/messages`);
      
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgs);
        
        // Build conversations map from messages
        const convMap = new Map<string, any>();
        // Sorting messages by timestamp descending to get the latest message for the lastMessage preview
        const sortedMsgs = msgs.sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        sortedMsgs.forEach((m: any) => {
          const id = m.conversationId || 'general';
          // Check if this conversation already exists in the map to avoid overwriting the 'lastMessage' with an older message
          const entry = convMap.get(id) || { id, name: id, avatar: '💬', type: 'team', lastMessage: '' };
          
          // Only set lastMessage if it's the first time processing this conversation in this loop (which it will be due to the sorting)
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
  }, [user, appId]); // Added appId dependency for Firestore path

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) setSelectedConversation(conversations[0].id);
  }, [conversations, selectedConversation]);

  const currentMessages = selectedConversation ? messages.filter((m: any) => m.conversationId === selectedConversation) : [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!messageText.trim() || !selectedConversation || !user || !db) return;
    
    try {
      // Corrected Firestore path to use secure scoping: /artifacts/{appId}/users/{userId}/messages
      const messagesRef = collection(db, `artifacts/${appId}/users/${user.id}/messages`);
      await addDoc(messagesRef, {
        text: messageText.trim(),
        conversationId: selectedConversation,
        senderId: user.id,
        senderName: user.displayName, // Include sender name for display
        avatar: user.avatar,         // Include sender avatar for display
        createdAt: Timestamp.now(),  // Use createdAt for consistency and sorting
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }; 
  
  const formatTime = (createdAt: any) => {
    if (!createdAt) return '';
    // Handle Firestore Timestamp object or plain Date string
    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt); 
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            {conversations.map((conversation: any) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedConversation === conversation.id ? 'bg-purple-50 border-r-4 border-r-purple-500' : ''}`}
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
                        <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conversation.unread}</span>
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
              <span className="text-2xl">{conversations.find(c => c.id === selectedConversation)?.avatar}</span>
              <div>
                <h2 className="font-bold text-gray-800">{conversations.find(c => c.id === selectedConversation)?.name}</h2>
                <p className="text-sm text-gray-500">{conversations.find(c => c.id === selectedConversation)?.type === 'team' ? 'Team Chat' : 'Direct Message'}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {currentMessages.map((message: any) => (
              <div key={message.id} className={`flex gap-3 ${message.senderId === user?.id ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl flex-shrink-0">{message.avatar}</span>
                <div className={`max-w-xs lg:max-w-md ${message.senderId === user?.id ? 'text-right' : ''}`}>
                  {message.senderId !== user?.id && (<p className="text-sm font-medium text-gray-700 mb-1">{message.senderName}</p>)}
                  <div className={`rounded-lg p-3 ${message.senderId === user?.id ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p>{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(message.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button type="button" className="p-2 text-gray-500 hover:text-purple-600 transition-colors" title="Attach file"><FaPaperclip /></button>
              <button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200" title="Send"><FaPaperPlane /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// FIX: Change to default export
export default Messages;
