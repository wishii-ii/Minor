// Add type definitions for the global environment variables 
// These declarations are CRITICAL for TypeScript to recognize the global variables
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaUserPlus, FaSearch, FaUsers, FaCommentDots, FaUserTimes, FaCheck, FaTimes } from 'react-icons/fa'; // FIXED: Changed FaUserMinus to FaUserTimes
import { 
  getAuth,
  User,
  signInWithCustomToken, 
  signInAnonymously,
  Auth,
} from 'firebase/auth'; 

import { 
  getFirestore,
  collection, 
  onSnapshot, 
  query, 
  getDocs, 
  where, 
  addDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  getDoc,
  Firestore,
  // FIX 1: Import arrayUnion and arrayRemove for safer array manipulation
  arrayUnion, 
  arrayRemove,
} from 'firebase/firestore';
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';


// --- CORE FIREBASE SETUP & UTILITIES ---

// FIX 2: Use the robust initialization pattern to prevent "Firebase app already initialized" errors
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    // Re-use the existing app instance
    app = getApps()[0];
}

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const firebaseEnabled = true;


// 2. Define the necessary types
interface FriendProfile {
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline' | string;
  level: number;
  currentStreak?: number; 
  mutualTeams?: number; 
}

interface PrivateProfile {
  friends: string[]; // Array of friend UIDs
  // The useUser mock returns these, so they must be optional in case the profile doc doesn't contain them
  name?: string; 
  avatar?: string;
  level?: number;
  [key: string]: any; 
}

// 3. Mock useUser hook
const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PrivateProfile>({ friends: [] });
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // Stubs for addXP and addCoins
  const addXP = useCallback(async (amount: number) => {
    console.log(`MOCK: Awarded ${amount} XP`);
  }, []);
  
  const addCoins = useCallback(async (amount: number) => {
    console.log(`MOCK: Awarded ${amount} Coins`);
  }, []);
  
  // Authentication effect
  useEffect(() => {
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
      
      const authenticateUser = async () => {
          try {
              let userCredential;
              if (initialAuthToken) {
                  userCredential = await signInWithCustomToken(auth, initialAuthToken);
              } else {
                  // Fallback to anonymous sign-in if token is missing
                  userCredential = await signInAnonymously(auth);
              }
              setUser(userCredential.user);
              
              // Simulate profile fetch immediately after auth
              const mockProfile: PrivateProfile = {
                  name: 'Current User',
                  avatar: '👑',
                  level: 99,
                  friends: [], 
              };
              setProfile(mockProfile);
              setIsAuthReady(true);
              
          } catch (error) {
              console.error("Firebase authentication failed:", error);
              setIsAuthReady(true); // Still set ready even on failure
          }
      };

      authenticateUser();
  }, []);

  // Return structure matching required usage in Friends component
  return { 
    user: user ? { id: user.uid, uid: user.uid } : null, 
    profile: profile, // Use the state directly
    addXP,
    addCoins,
    isAuthReady,
  };
};

// --- Type Definitions for Dynamic Data ---

// Friend data fetched from Public Users collection
interface Friend extends FriendProfile {
  id: string; // The user's Firestore UID
}

// Request data fetched from the current user's private friendRequests collection
interface FriendRequest {
  id: string; // Request document ID
  senderId: string;
  name: string;
  avatar: string;
  level: number;
  mutualFriends?: number; 
}

// Search result uses the same structure as Friend
interface SearchResult extends Friend {}


// --- Utility Component: Friend Card ---

const FriendCard: React.FC<{
  friend: Friend;
  isFriend: boolean;
  onRemove: (friendId: string, friendName: string) => void;
}> = ({ friend, isFriend, onRemove }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const statusColor = getStatusColor(friend.status || 'offline');
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="text-3xl">{friend.avatar}</span>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusColor}`} />
          </div>

          <div>
            <h3 className="font-bold text-gray-800">{friend.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Level {friend.level}</span>
              {friend.currentStreak !== undefined && <span>{friend.currentStreak} day streak</span>}
              {friend.mutualTeams !== undefined && friend.mutualTeams > 0 && (
                <span className="flex items-center gap-1">
                  <FaUsers className="text-purple-400" />
                  {friend.mutualTeams} mutual
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Message">
            <FaCommentDots />
          </button>
          {isFriend && (
            <button 
              onClick={() => onRemove(friend.id, friend.name)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
              title="Remove Friend"
            >
              <FaUserTimes /> {/* FIXED: Changed FaUserMinus to FaUserTimes */}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Custom Modal Component (Replacement for window.confirm) ---

const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Component: Friends ---

export const Friends: React.FC = () => {
  const { user, profile, isAuthReady } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // States for dynamic data
  const [fetchedFriends, setFetchedFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // State for the custom confirmation modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    friendId: string;
    friendName: string;
  }>({ isOpen: false, friendId: '', friendName: '' });


  // Firestore path constants
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  // FIX 3: Rely directly on the user ID provided by the hook after authentication
  const userId = user?.id; 
  const dbInstance = db;
  const PUBLIC_USERS_COLLECTION = `artifacts/${appId}/public/data/users`;
  
  // Array of current friend UIDs for easy lookup
  const friendUids = useMemo(() => fetchedFriends.map(f => f.id), [fetchedFriends]);
  
  // --- Data Fetching: Friend Details (Run when profile.friends changes) ---
  const fetchFriendDetails = useCallback(async (friendIds: string[]) => {
    if (!firebaseEnabled || !dbInstance || !friendIds.length) {
      setFetchedFriends([]);
      return;
    }

    const profiles: Friend[] = [];
    
    // Efficiently fetch details for all friend IDs
    const docPromises = friendIds.map(friendId => 
        getDoc(doc(dbInstance, PUBLIC_USERS_COLLECTION, friendId))
    );

    const docSnapshots = await Promise.all(docPromises);
    
    docSnapshots.forEach(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data() as FriendProfile;
        profiles.push({
          id: snapshot.id,
          name: data.name || 'Unknown User',
          avatar: data.avatar || '👤',
          status: data.status || 'offline',
          level: data.level || 1,
          currentStreak: data.currentStreak || 0,
          mutualTeams: data.mutualTeams || 0,
        });
      }
    });

    setFetchedFriends(profiles);
  }, [dbInstance, PUBLIC_USERS_COLLECTION]);


  // --- Data Fetching: Main User Profile & Requests (Subscriptions) ---
  useEffect(() => {
    // Wait until authentication is ready
    if (!firebaseEnabled || !dbInstance || !userId || !isAuthReady) {
      setIsLoading(true);
      return;
    }

    let unsubscribeProfile: () => void = () => {};
    let unsubscribeRequests: () => void = () => {};

    // 1. Listen to the user's private profile document for the list of friend UIDs
    const profileDocRef = doc(dbInstance, `artifacts/${appId}/users/${userId}/profile/main`);
    unsubscribeProfile = onSnapshot(profileDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data() as PrivateProfile;
            if (data.friends && Array.isArray(data.friends)) {
                // Trigger the detail fetch with the updated list of IDs
                fetchFriendDetails(data.friends as string[]);
            } else {
                setFetchedFriends([]);
            }
        }
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching user profile:", error);
        setIsLoading(false);
    });

    // 2. Listen to incoming friend requests
    const requestsRef = collection(dbInstance, `artifacts/${appId}/users/${userId}/friendRequests`);
    unsubscribeRequests = onSnapshot(requestsRef, (snapshot) => {
        const requests: FriendRequest[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                senderId: data.senderId as string,
                name: data.name as string || 'Anonymous',
                avatar: data.avatar as string || '👤',
                level: data.level as number || 1,
                mutualFriends: data.mutualFriends as number || 0,
            };
        });
        setFriendRequests(requests);
    }, (error) => {
        console.error("Error fetching friend requests:", error);
    });

    return () => {
        unsubscribeProfile();
        unsubscribeRequests();
    };
  }, [appId, userId, dbInstance, fetchFriendDetails, isAuthReady]);


  // --- Search Logic (Runs on searchTerm change) ---
  useEffect(() => {
    if (!firebaseEnabled || !dbInstance || !userId) return;

    const performSearch = async () => {
      if (searchTerm.trim().length < 3) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      
      try {
        // Query public user profiles by name
        const q = query(
          collection(dbInstance, PUBLIC_USERS_COLLECTION),
          where('name', '>=', searchTerm.trim()),
          where('name', '<=', searchTerm.trim() + '\uf8ff')
        );

        const snapshot = await getDocs(q);
        const results: SearchResult[] = [];

        snapshot.forEach(doc => {
          if (doc.id === userId) return; // Don't show self
          if (friendUids.includes(doc.id)) return; // Don't show current friends
          
          const data = doc.data() as FriendProfile;
          results.push({
            id: doc.id,
            name: data.name || 'Unknown User',
            avatar: data.avatar || '👤',
            status: data.status || 'offline',
            level: data.level || 1,
            currentStreak: data.currentStreak || 0,
            mutualTeams: data.mutualTeams || 0,
          });
        });
        setSearchResults(results);
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const handler = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(handler);

  }, [searchTerm, userId, dbInstance, PUBLIC_USERS_COLLECTION, friendUids]);


  // --- Action Handlers ---
  
  /**
    * Sends a friend request to a target user.
    */
  const handleSendRequest = async (recipientId: string) => {
    if (!firebaseEnabled || !dbInstance || !userId || !profile) return;

    try {
      // 1. Create a request document in the RECIPIENT's private friendRequests collection
      const recipientRequestsRef = collection(dbInstance, `artifacts/${appId}/users/${recipientId}/friendRequests`);
      
      await addDoc(recipientRequestsRef, {
        senderId: userId,
        // Send the necessary sender profile data (use fallback values)
        name: profile.name || 'Anonymous User',
        avatar: profile.avatar || '👤',
        level: profile.level || 1,
        timestamp: new Date(),
        status: 'pending',
      });
      console.log(`Friend request sent to ${recipientId}`);
      // Simple feedback: clear search or give a message
      setSearchTerm('');
      setSearchResults([]); 

    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };


  /**
    * Accepts a friend request using a batch write for atomic updates.
    * FIX 4: Use arrayUnion for atomic array updates on both users.
    */
  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    if (!firebaseEnabled || !dbInstance || !userId) return;

    try {
      const batch = writeBatch(dbInstance);
      
      // 1. Delete the request document from the recipient's collection (current user)
      const requestDocRef = doc(dbInstance, `artifacts/${appId}/users/${userId}/friendRequests`, requestId);
      batch.delete(requestDocRef);

      // 2. Update the recipient's (current user's) private friends list - ADD SENDER
      const userProfileRef = doc(dbInstance, `artifacts/${appId}/users/${userId}/profile/main`);
      batch.update(userProfileRef, { friends: arrayUnion(senderId) });

      // 3. Update the sender's private friends list - ADD RECIPIENT
      const senderProfileRef = doc(dbInstance, `artifacts/${appId}/users/${senderId}/profile/main`);
      // We don't need to read the sender's data first, arrayUnion handles concurrent updates safely.
      batch.update(senderProfileRef, { friends: arrayUnion(userId) });

      await batch.commit();
      console.log(`Friend request from ${senderId} accepted.`);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  /**
    * Declines a request.
    */
  const handleDeclineRequest = async (requestId: string) => {
    if (!firebaseEnabled || !dbInstance || !userId) return;
    try {
      await deleteDoc(doc(dbInstance, `artifacts/${appId}/users/${userId}/friendRequests`, requestId));
      console.log(`Friend request declined for ID ${requestId}`);
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };
  
  /**
    * Opens the confirmation modal before removing a friend.
    */
  const handleConfirmRemove = (friendId: string, friendName: string) => {
    setModalState({ isOpen: true, friendId, friendName });
  };
  
  /**
    * Executes the friend removal after confirmation.
    * FIX 5: Use arrayRemove for atomic array removal on both users.
    */
  const handleExecuteRemove = async () => {
    if (!firebaseEnabled || !dbInstance || !userId || !modalState.friendId) return;

    const friendId = modalState.friendId;

    try {
      const batch = writeBatch(dbInstance);

      // 1. Update current user's (recipient's) friend list - REMOVE FRIEND
      const userProfileRef = doc(dbInstance, `artifacts/${appId}/users/${userId}/profile/main`);
      batch.update(userProfileRef, { friends: arrayRemove(friendId) });

      // 2. Update the removed friend's friend list - REMOVE CURRENT USER
      const friendProfileRef = doc(dbInstance, `artifacts/${appId}/users/${friendId}/profile/main`);
      // We don't need to read the friend's data first, arrayRemove handles concurrent updates safely.
      batch.update(friendProfileRef, { friends: arrayRemove(userId) });

      await batch.commit();
      console.log(`Friend ${friendId} removed.`);
      setModalState({ isOpen: false, friendId: '', friendName: '' }); // Close modal
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleCancelRemove = () => {
    setModalState({ isOpen: false, friendId: '', friendName: '' });
  };


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Friends</h1>
          <p className="text-gray-600">Connect with fellow adventurers on your growth journey</p>
        </div>

        <button 
          onClick={() => console.log("The Add Friend button now redirects to the search bar for finding new friends by name.")}
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
          placeholder="Search for users by name (e.g., Quest Master, Creative Coder)..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Friends List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Friends ({fetchedFriends.length})</h2>
          <div className="space-y-4">
            {isLoading && !isAuthReady ? (
              <div className="text-center py-8 text-gray-500">Connecting and loading profile...</div>
            ) : fetchedFriends.length > 0 ? (
              fetchedFriends.map(friend => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  isFriend={true}
                  onRemove={handleConfirmRemove} // Use the custom confirmation handler
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
                {friendRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{request.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-800">{request.name}</p>
                        <p className="text-xs text-gray-500">Level {request.level} 
                          {request.mutualFriends !== undefined && ` • ${request.mutualFriends} mutual`}
                        </p>
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

          {/* Search Results / Suggestions */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <h3 className="font-bold text-gray-800 mb-4">
              {searchTerm.length > 2 ? 'Search Results' : 'Find Users'}
            </h3>
            <div className="space-y-3">
              {isSearching ? (
                <div className="text-center text-gray-500">Searching...</div>
              ) : searchTerm.trim().length > 2 && searchResults.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">No users found matching "{searchTerm.trim()}".</div>
              ) : searchTerm.trim().length > 2 ? (
                searchResults.map(result => (
                  <div key={result.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{result.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-800">{result.name}</p>
                        <p className="text-xs text-gray-500">Level {result.level}</p>
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
                  Start typing a name in the search bar above to find new people.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title="Remove Friend"
        message={`Are you sure you want to remove ${modalState.friendName} as a friend? This action cannot be undone.`}
        onConfirm={handleExecuteRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
};
