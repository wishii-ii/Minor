// Add a type definition for the global environment variable __app_id
declare const __app_id: string;

import React, { useState, useEffect, useMemo } from 'react';
import { FaMedal, FaFlag, FaBell, FaUsers, FaInbox } from 'react-icons/fa';
// Assuming 'db' is imported from your firebase configuration and is typed as Firestore | null
import { db } from '../firebase'; 
import { useUser } from '../contexts/UserContext';
import { BaseLayout } from '../components/BaseLayout';
import { 
  collection, 
  onSnapshot, 
  query, 
  updateDoc, 
  doc, 
  Timestamp, 
  writeBatch, 
  Firestore 
} from 'firebase/firestore';


// --- Interfaces and Helpers ---

// Define the structure of a notification document
interface NotificationData {
  id: string; // Document ID
  type: 'achievement' | 'quest' | 'reminder' | 'social';
  title: string;
  message: string;
  timestamp: Date; 
  read: boolean;
  metadata?: {
    teamId?: string;
    [key: string]: unknown; // Allow other properties
  };
}

// Helper to map notification type to icon and color (updated for dark theme)
const getIconAndColor = (type: NotificationData['type']) => {
  switch (type) {
    case 'achievement':
      return { icon: <FaMedal />, color: 'text-yellow-400 bg-yellow-900/30' };
    case 'quest':
      return { icon: <FaFlag />, color: 'text-purple-400 bg-purple-900/30' };
    case 'reminder':
      return { icon: <FaBell />, color: 'text-blue-400 bg-blue-900/30' };
    case 'social':
      return { icon: <FaUsers />, color: 'text-green-400 bg-green-900/30' };
    default:
      return { icon: <FaInbox />, color: 'text-gray-400 bg-gray-900/30' };
  }
};


export const Notifications: React.FC = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'quests'>('all');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the global __app_id variable provided by the environment
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  // Assuming useUser returns an object with a string 'id' property
  const userId = user?.id; 
  
  // --- Data Fetching (Firestore Subscription) ---
  useEffect(() => {
    // Ensure both Firestore (db) and the current user's ID are available
    if (!db || !userId) {
      setIsLoading(true);
      return; 
    }

    // Assert 'db' as Firestore type here after the null check
    const firestoreDb = db as Firestore;

    // Notifications are PRIVATE data, stored under the user's path.
    const notificationsRef = collection(firestoreDb, `artifacts/${appId}/users/${userId}/notifications`);
    const q = query(notificationsRef);

    console.log("Subscribing to user notifications...");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications: NotificationData[] = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamp to JavaScript Date object for easy sorting/display
        const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date();

        return {
          id: doc.id,
          type: data.type || 'reminder',
          title: data.title || 'Notification',
          message: data.message || 'No message.',
          timestamp: timestamp,
          read: data.read ?? false,
          metadata: data.metadata, // Include the metadata field
        } as NotificationData; // Explicitly casting to NotificationData
      });
      
      // Sort client-side by timestamp (most recent first)
      fetchedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setNotifications(fetchedNotifications);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching notifications:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [appId, userId]);


  // --- Core Action Handlers ---

  /**
   * Marks a single notification as read.
   */
  const handleMarkNotificationAsRead = async (notificationId: string) => {
    // Ensure both db and userId are available before proceeding
    if (!db || !userId) return;

    try {
      const firestoreDb = db as Firestore;
      const docRef = doc(firestoreDb, `artifacts/${appId}/users/${userId}/notifications`, notificationId);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  /**
   * Marks all unread notifications as read using a batch write.
   */
  const handleMarkAllAsRead = async () => {
    if (!db || !userId) return;

    try {
      const firestoreDb = db as Firestore;
      const unreadDocs = notifications.filter(n => !n.read);
      if (unreadDocs.length === 0) return;

      const batch = writeBatch(firestoreDb);
      
      unreadDocs.forEach(n => {
        const docRef = doc(firestoreDb, `artifacts/${appId}/users/${userId}/notifications`, n.id);
        batch.update(docRef, { read: true });
      });

      await batch.commit();
      console.log('Successfully marked all as read.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  /**
   * Handles accepting a team invitation.
   * 1. Logs the action (Placeholder for actual team join logic).
   * 2. Marks the notification as read.
   */
  const handleAcceptTeamInvite = async (notificationId: string, teamId: string) => {
    if (!db || !userId) return;

    // Actual logic to add user to team document goes here (e.g., using arrayUnion or transaction).
    // For demo purposes, we will only mark the notification as read.
    console.log(`User ${userId} accepted invite for team ${teamId}. (Notification cleared)`);
      
    // 2. Mark the notification as read
    await handleMarkNotificationAsRead(notificationId);
  };


  // --- Helper to display time difference ---
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };


  // --- Filtering Logic (Memoized) ---
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (filter === 'unread') return !notification.read;
      if (filter === 'achievements') return notification.type === 'achievement';
      if (filter === 'quests') return notification.type === 'quest';
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;


  return (
    <BaseLayout className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-300">Stay updated on your progress and team activities</p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 -mx-6 px-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'achievements', label: 'Achievements' },
          { key: 'quests', label: 'Quests' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as 'all' | 'unread' | 'achievements' | 'quests')}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === filterOption.key
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (!db || !userId) ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-6 w-6 mr-3 inline text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Waiting for user authentication and database connection...
        </div>
      ) : (
        /* Notifications List */
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const { icon, color } = getIconAndColor(notification.type);
            const timeAgo = formatTimeAgo(notification.timestamp);
            
            return (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
                  notification.read
                    ? 'border-gray-200 dark:border-gray-700'
                    : 'border-purple-200 dark:border-purple-500/30 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${color}`}>
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-semibold ${
                        notification.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{timeAgo}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" title="Unread"></div>
                        )}
                      </div>
                    </div>

                    <p className={`text-sm mt-1 ${
                      notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {notification.message}
                    </p>

                    <div className="flex gap-2 mt-3">
                      {/* Action Buttons */}
                      {notification.type === 'social' && (
                        <>
                          <button
                            onClick={() => {
                              if (notification.metadata?.teamId) {
                                handleAcceptTeamInvite(notification.id, notification.metadata.teamId as string);
                              } else {
                                console.error('Team ID missing for social invite.');
                                handleMarkNotificationAsRead(notification.id);
                              }
                            }}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleMarkNotificationAsRead(notification.id)}
                            className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {/* Generic actions just mark the notification as read */}
                      {notification.type === 'achievement' && (
                        <button 
                          onClick={() => handleMarkNotificationAsRead(notification.id)}
                          className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                          View Achievement
                        </button>
                      )}

                      {notification.type === 'quest' && (
                        <button 
                          onClick={() => handleMarkNotificationAsRead(notification.id)}
                          className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                          Go to Quest
                        </button>
                      )}

                      {notification.type === 'reminder' && (
                        <button 
                          onClick={() => handleMarkNotificationAsRead(notification.id)}
                          className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                          Complete Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <FaInbox className="mx-auto mb-4 text-4xl text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No notifications</h3>
          <p className="text-gray-500 dark:text-gray-400">You're all caught up! Keep building those habits.</p>
        </div>
      )}
    </BaseLayout>
  );
};