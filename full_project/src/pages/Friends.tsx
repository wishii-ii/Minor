import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  doc, 
  collection, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase'; // Adjust path as needed
import { useUser } from '../contexts/UserContext';
import { FaUserPlus, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import { User } from '../types/models'; // Import your User type

// Type definitions that extend your existing types
interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: string;
  level: number;
  currentStreak: number;
  mutualTeams: number;
}

interface FriendRequest {
  id: string;
  senderId: string;
  name: string;
  avatar: string;
  level: number;
  mutualFriends: number;
}

interface SearchResult {
  id: string;
  name: string;
  avatar: string;
  status: string;
  level: number;
  currentStreak: number;
  mutualTeams: number;
}

// Create simple inline components
const FriendCard: React.FC<{
  friend: Friend;
  isFriend: boolean;
  onRemove: (friendId: string, friendName: string) => void;
}> = ({ friend, isFriend, onRemove }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{friend.avatar}</span>
        <div>
          <h3 className="font-bold text-gray-800">{friend.name}</h3>
          <p className="text-sm text-gray-600">
            Level {friend.level} • {friend.currentStreak} day streak • {friend.mutualTeams} mutual teams
          </p>
        </div>
      </div>
      {isFriend && (
        <button 
          onClick={() => onRemove(friend.id, friend.name)}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  );
};

const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Friends Component ---
export const Friends: React.FC = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedFriends, setFetchedFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    friendId: string;
    friendName: string;
  }>({ isOpen: false, friendId: '', friendName: '' });

  const userId = user?.id; 
  
  const PUBLIC_USERS_COLLECTION = 'users';

  const friendUids = useMemo(() => fetchedFriends.map((f: Friend) => f.id), [fetchedFriends]);
  
  // Fetch friend details
  const fetchFriendDetails = useCallback(async (friendIds: string[]) => {
    if (!firebaseEnabled || !db || !friendIds.length) {
      setFetchedFriends([]);
      return;
    }

    const profiles: Friend[] = [];
    
    const docPromises = friendIds.map(friendId => 
        getDoc(doc(db, PUBLIC_USERS_COLLECTION, friendId))
    );

    const docSnapshots = await Promise.all(docPromises);
    
    docSnapshots.forEach(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data() as User;
        profiles.push({
          id: snapshot.id,
          name: data.displayName || 'Unknown User',
          avatar: data.avatar || '👤',
          status: data.status || 'offline',
          level: data.level || 1,
          currentStreak: data.streakCount || 0,
          mutualTeams: 0, // You can calculate this later
        });
      }
    });

    setFetchedFriends(profiles);
  }, [db, PUBLIC_USERS_COLLECTION]);

  // Listen to user profile and friend requests
  useEffect(() => {
    if (!firebaseEnabled || !db || !userId) {
      setIsLoading(false);
      return;
    }

    let unsubscribeProfile: () => void = () => {};
    let unsubscribeRequests: () => void = () => {};

    // Listen to user's profile for friends list
    const profileDocRef = doc(db, PUBLIC_USERS_COLLECTION, userId);
    unsubscribeProfile = onSnapshot(profileDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data() as User;
            if (data.friends && Array.isArray(data.friends)) {
                fetchFriendDetails(data.friends as string[]);
            } else {
                setFetchedFriends([]);
            }
        }
        setIsLoading(false);
    }, (error: any) => {
        console.error("Error fetching user profile:", error);
        setIsLoading(false);
    });

    // Listen to friend requests
    const requestsRef = collection(db, PUBLIC_USERS_COLLECTION, userId, 'friendRequests');
    unsubscribeRequests = onSnapshot(requestsRef, (snapshot) => {
        const requests: FriendRequest[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                senderId: data.senderId as string,
                name: data.name || 'Anonymous',
                avatar: data.avatar as string || '👤',
                level: data.level as number || 1,
                mutualFriends: data.mutualFriends as number || 0,
            };
        });
        setFriendRequests(requests);
    }, (error: any) => {
        console.error("Error fetching friend requests:", error);
    });

    return () => {
        unsubscribeProfile();
        unsubscribeRequests();
    };
  }, [userId, db, fetchFriendDetails, PUBLIC_USERS_COLLECTION]);

  // Search functionality
  useEffect(() => {
    if (!firebaseEnabled || !db || !userId) return;

    const performSearch = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      
      try {
        console.log("Searching for:", searchTerm);
        
        // Get ALL users first, then filter client-side
        const usersRef = collection(db, PUBLIC_USERS_COLLECTION);
        const snapshot = await getDocs(usersRef);
        const results: SearchResult[] = [];

        console.log("Total users in database:", snapshot.size);

        snapshot.forEach(doc => {
          if (doc.id === userId) {
            console.log("Skipping self:", doc.id);
            return; // Don't show self
          }
          
          if (friendUids.includes(doc.id)) {
            console.log("Skipping friend:", doc.id);
            return; // Don't show current friends
          }
          
          const data = doc.data() as User;
          const userName = data.displayName || 'Unknown User';
          const userEmail = data.email || '';
          
          console.log(`Checking user: ${userName} (${doc.id})`);
          
          // Case-insensitive search in both name and email
          const searchLower = searchTerm.toLowerCase();
          if (userName.toLowerCase().includes(searchLower) || 
              userEmail.toLowerCase().includes(searchLower)) {
            console.log("MATCH FOUND:", userName);
            results.push({
              id: doc.id,
              name: userName,
              avatar: data.avatar || '👤',
              status: data.status || 'offline',
              level: data.level || 1,
              currentStreak: data.streakCount || 0,
              mutualTeams: 0,
            });
          }
        });
        
        console.log("Search results:", results);
        setSearchResults(results);
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const handler = setTimeout(performSearch, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, userId, db, PUBLIC_USERS_COLLECTION, friendUids]);

  // Action handlers
  const handleSendRequest = async (recipientId: string) => {
    if (!firebaseEnabled || !db || !userId || !user) {
      console.error("Missing required data for sending request");
      return;
    }

    try {
      const recipientRequestsRef = collection(db, PUBLIC_USERS_COLLECTION, recipientId, 'friendRequests');
      
      await addDoc(recipientRequestsRef, {
        senderId: userId,
        name: user.displayName || 'Anonymous User',
        avatar: user.avatar || '👤',
        level: user.level || 1,
        timestamp: new Date(),
        status: 'pending',
      });
      
      console.log(`Friend request sent to ${recipientId}`);
      setSearchTerm('');
      setSearchResults([]);
      
      alert(`Friend request sent successfully!`);
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };

  const handleAddFriendClick = () => {
    setSearchTerm('');
    setSearchResults([]);
    
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  const handleConfirmRemove = (friendId: string, friendName: string) => {
    setModalState({
      isOpen: true,
      friendId,
      friendName
    });
  };

  const handleCancelRemove = () => {
    setModalState({ isOpen: false, friendId: '', friendName: '' });
  };

  const handleExecuteRemove = async () => {
    if (!firebaseEnabled || !db || !userId) return;
    
    try {
      const userDocRef = doc(db, PUBLIC_USERS_COLLECTION, userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const updatedFriends = (userData.friends || []).filter((id: string) => id !== modalState.friendId);
        
        await updateDoc(userDocRef, {
          friends: updatedFriends
        });
        
        console.log(`Removed friend: ${modalState.friendName}`);
      }
      
      setModalState({ isOpen: false, friendId: '', friendName: '' });
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    if (!firebaseEnabled || !db || !userId) return;

    try {
      // Add to current user's friends list
      const userDocRef = doc(db, PUBLIC_USERS_COLLECTION, userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const currentFriends = userData.friends || [];
        
        if (!currentFriends.includes(senderId)) {
          await updateDoc(userDocRef, {
            friends: [...currentFriends, senderId]
          });
        }
      }

      // Also add current user to sender's friends list
      const senderDocRef = doc(db, PUBLIC_USERS_COLLECTION, senderId);
      const senderDoc = await getDoc(senderDocRef);
      
      if (senderDoc.exists()) {
        const senderData = senderDoc.data() as User;
        const senderFriends = senderData.friends || [];
        
        if (!senderFriends.includes(userId)) {
          await updateDoc(senderDocRef, {
            friends: [...senderFriends, userId]
          });
        }
      }

      // Remove the request
      const requestDocRef = doc(db, PUBLIC_USERS_COLLECTION, userId, 'friendRequests', requestId);
      await deleteDoc(requestDocRef);
      
      console.log(`Accepted friend request from ${senderId}`);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!firebaseEnabled || !db || !userId) return;

    try {
      const requestDocRef = doc(db, PUBLIC_USERS_COLLECTION, userId, 'friendRequests', requestId);
      await deleteDoc(requestDocRef);
      
      console.log(`Declined friend request ${requestId}`);
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Friends</h1>
          <p className="text-gray-600">Connect with fellow adventurers on your growth journey</p>
        </div>

        <button 
          onClick={handleAddFriendClick}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <FaUserPlus />
          Add Friend
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for users by name or email (min. 2 characters)..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Friends List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Friends ({fetchedFriends.length})</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading your friends...</div>
            ) : fetchedFriends.length > 0 ? (
              fetchedFriends.map((friend: Friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  isFriend={true}
                  onRemove={handleConfirmRemove}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 border border-dashed p-6 rounded-xl">
                You don't have any friends yet. Use the search bar to find people!
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Friend Requests */}
          {friendRequests.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-red-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserPlus className='text-red-500' />
                Friend Requests ({friendRequests.length})
              </h3>
              <div className="space-y-3">
                {friendRequests.map((request: FriendRequest) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{request.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-800">{request.name}</p>
                        <p className="text-xs text-gray-500">Level {request.level}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAcceptRequest(request.id, request.senderId)}
                        className="bg-green-100 text-green-700 p-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                        title="Accept Request"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => handleDeclineRequest(request.id)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        title="Decline Request"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <h3 className="font-bold text-gray-800 mb-4">
              {searchTerm.length > 1 ? 'Search Results' : 'Find Users'}
            </h3>
            <div className="space-y-3">
              {isSearching ? (
                <div className="text-center text-gray-500">Searching...</div>
              ) : searchTerm.trim().length > 1 && searchResults.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                  No users found matching "{searchTerm.trim()}". 
                </div>
              ) : searchTerm.trim().length > 1 ? (
                searchResults.map((result: SearchResult) => (
                  <div key={result.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{result.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-800">{result.name}</p>
                        <p className="text-xs text-gray-500">Level {result.level} • {result.currentStreak} day streak</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSendRequest(result.id)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Type at least 2 characters to search for users
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={modalState.isOpen}
        title="Remove Friend"
        message={`Are you sure you want to remove ${modalState.friendName} as a friend?`}
        onConfirm={handleExecuteRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
};