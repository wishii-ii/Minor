import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export const Leaderboards: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [category, setCategory] = useState<'xp' | 'streaks' | 'quests'>('xp');

  const leaderboardData = [
    { rank: 1, name: 'Habit Hero', avatar: '🧙‍♂️', xp: 3450, streaks: 28, quests: 5 },
    { rank: 2, name: 'Quest Master', avatar: '⚔️', xp: 3200, streaks: 25, quests: 7 },
    { rank: 3, name: 'Streak Keeper', avatar: '🔥', xp: 2980, streaks: 32, quests: 3 },
    { rank: 4, name: 'Growth Guru', avatar: '🌱', xp: 2750, streaks: 20, quests: 4 },
    { rank: 5, name: 'Mindful Monk', avatar: '🧘', xp: 2500, streaks: 18, quests: 6 },
    { rank: 6, name: 'Fitness Fighter', avatar: '💪', xp: 2340, streaks: 15, quests: 2 },
  ];

  const getValue = (user: any) => {
    switch (category) {
      case 'xp': return user.xp;
      case 'streaks': return user.streaks;
      case 'quests': return user.quests;
      default: return user.xp;
    }
  };

  const getLabel = () => {
    switch (category) {
      case 'xp': return 'XP';
      case 'streaks': return 'Streak Days';
      case 'quests': return 'Quests Completed';
      default: return 'XP';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboards</h1>
        <p className="text-gray-600">See how you stack up against fellow adventurers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <span className="font-medium text-gray-700 self-center">Period:</span>
          {['weekly', 'monthly', 'allTime'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                timeFilter === filter
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter === 'allTime' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <span className="font-medium text-gray-700 self-center">Category:</span>
          {[
            { key: 'xp', label: 'XP', icon: <TrendingUp className="w-4 h-4" /> },
            { key: 'streaks', label: 'Streaks', icon: <Award className="w-4 h-4" /> },
            { key: 'quests', label: 'Quests', icon: <Trophy className="w-4 h-4" /> },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                category === cat.key
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <h2 className="text-lg font-bold">{getLabel()} Leaderboard</h2>
          <p className="text-purple-100 text-sm">{timeFilter} rankings</p>
        </div>

        <div className="divide-y divide-gray-100">
          {leaderboardData.map((user, index) => (
            <div key={user.rank} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {index < 3 ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      'bg-orange-500'
                    }`}>
                      {index === 0 ? <Trophy className="w-5 h-5 text-white" /> :
                       index === 1 ? <Medal className="w-5 h-5 text-white" /> :
                       <Award className="w-5 h-5 text-white" />}
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-gray-500">#{user.rank}</span>
                  )}
                </div>

                <div className="text-2xl">{user.avatar}</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  {user.name === 'Habit Hero' && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">You</span>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">
                    {getValue(user).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{getLabel()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Notice */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
        <p className="text-sm text-gray-600">
          <strong>Fair Play Notice:</strong> Rankings are updated daily and monitored for authentic progress. 
          Keep building those habits consistently!
        </p>
      </div>
    </div>
  );
};