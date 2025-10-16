
import React, { useState } from 'react';
import { FaUserPlus, FaSearch, FaUsers, FaCommentDots, FaUserTimes } from 'react-icons/fa';


export const Friends: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const friends = [
    { id: 1, name: 'Quest Master', avatar: '⚔️', status: 'online', level: 12, currentStreak: 18, mutualTeams: 2 },
    { id: 2, name: 'Mindful Monk', avatar: '🧘', status: 'away', level: 9, currentStreak: 7, mutualTeams: 1 },
    { id: 3, name: 'Growth Guru', avatar: '🌱', status: 'online', level: 15, currentStreak: 25, mutualTeams: 3 },
    { id: 4, name: 'Fitness Fighter', avatar: '💪', status: 'offline', level: 8, currentStreak: 12, mutualTeams: 0 },
  ];

  const friendRequests = [
    { id: 5, name: 'Wellness Wizard', avatar: '✨', mutualFriends: 2, level: 10 },
    { id: 6, name: 'Study Sage', avatar: '📚', mutualFriends: 1, level: 7 },
  ];

  const suggestions = [
    { id: 7, name: 'Creative Coder', avatar: '💻', reason: 'Same interests', level: 11 },
    { id: 8, name: 'Nature Lover', avatar: '🌲', reason: 'Team member', level: 6 },
    { id: 9, name: 'Book Buddy', avatar: '📖', reason: 'Similar habits', level: 13 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Friends</h1>
          <p className="text-gray-600">Connect with fellow adventurers on your growth journey</p>
        </div>

        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
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
          placeholder="Search friends..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Friends List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Friends ({friends.length})</h2>
          <div className="space-y-4">
            {friends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                statusColor={getStatusColor(friend.status)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Friend Requests */}
          {friendRequests.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
              <h3 className="font-bold text-gray-800 mb-4">Friend Requests</h3>
              <div className="space-y-3">
                {friendRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{request.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-800">{request.name}</p>
                        <p className="text-xs text-gray-500">Level {request.level} • {request.mutualFriends} mutual</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                        Accept
                      </button>
                      <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <h3 className="font-bold text-gray-800 mb-4">Suggested Friends</h3>
            <div className="space-y-3">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{suggestion.avatar}</span>
                    <div>
                      <p className="font-medium text-gray-800">{suggestion.name}</p>
                      <p className="text-xs text-gray-500">Level {suggestion.level} • {suggestion.reason}</p>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FriendCard: React.FC<{
  friend: any;
  statusColor: string;
}> = ({ friend, statusColor }) => {
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
              <span>{friend.currentStreak} day streak</span>
              {friend.mutualTeams > 0 && (
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
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Remove">
            <FaUserTimes />
          </button>
        </div>
      </div>
    </div>
  );
};