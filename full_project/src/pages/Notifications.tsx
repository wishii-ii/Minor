
import React, { useState } from 'react';
import { FaMedal, FaFlag, FaBell, FaUsers, FaInbox } from 'react-icons/fa';


export const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'quests'>('all');

  const notifications = [
    {
      id: 1,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Streak Starter" badge for maintaining a 7-day streak',
      time: '2 hours ago',
      read: false,
      icon: <FaMedal />,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 2,
      type: 'quest',
      title: 'Quest Update',
      message: 'Your team made great progress on the Tower of Wellness quest!',
      time: '4 hours ago',
      read: false,
      icon: <FaFlag />,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Habit Reminder',
      message: 'Don\'t forget to complete your daily reading habit',
      time: '6 hours ago',
      read: true,
      icon: <FaBell />,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 4,
      type: 'social',
      title: 'Team Invite',
      message: 'Quest Master invited you to join the "Fitness Fanatics" team',
      time: '1 day ago',
      read: true,
      icon: <FaUsers />,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Level Up!',
      message: 'Congratulations! You reached Level 8',
      time: '2 days ago',
      read: true,
      icon: <FaMedal />,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'achievements') return notification.type === 'achievement';
    if (filter === 'quests') return notification.type === 'quest';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated on your progress and team activities</p>
        </div>

        {unreadCount > 0 && (
          <button className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'achievements', label: 'Achievements' },
          { key: 'quests', label: 'Quests' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === filterOption.key
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${notification.read
              ? 'border-gray-200'
              : 'border-purple-200 bg-gradient-to-r from-purple-50 to-white'
              }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${notification.color}`}>
                {notification.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className={`font-semibold ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{notification.time}</span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                <p className={`text-sm mt-1 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                  {notification.message}
                </p>

                <div className="flex gap-2 mt-3">
                  {notification.type === 'social' && (
                    <>
                      <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200">
                        Accept
                      </button>
                      <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Decline
                      </button>
                    </>
                  )}

                  {notification.type === 'achievement' && (
                    <button className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors">
                      View Achievement
                    </button>
                  )}

                  {notification.type === 'quest' && (
                    <button className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors">
                      Go to Quest
                    </button>
                  )}

                  {notification.type === 'reminder' && (
                    <button className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors">
                      Complete Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <FaInbox className="mx-auto mb-4 text-4xl text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up! Keep building those habits.</p>
        </div>
      )}
    </div>
  );
};