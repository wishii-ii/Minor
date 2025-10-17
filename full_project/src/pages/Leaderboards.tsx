

import React, { useMemo, useState } from 'react';
import { FaMedal, FaFire, FaFlagCheckered, FaCrown, FaAward } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';

const categoryOptions = [
  { key: 'xp', label: 'XP', icon: <FaMedal /> },
  { key: 'streaks', label: 'Streaks', icon: <FaFire /> },
  { key: 'quests', label: 'Quests', icon: <FaFlagCheckered /> },
];


export const Leaderboards: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [category, setCategory] = useState<'xp' | 'streaks' | 'quests'>('xp');

  const { user } = useUser();

  type LeaderboardUser = { id?: string; name: string; avatar: string; xp: number; streaks: number; quests: number };

  const leaderboardData = useMemo(() => {
    // Realistic sample users (unsorted). We'll merge the real current user into this list if present.
    const sampleUsers: LeaderboardUser[] = [
      { name: 'Quest Master', avatar: '⚔️', xp: 4200, streaks: 25, quests: 7 },
      { name: 'Habit Hero', avatar: '🧙‍♂️', xp: 3450, streaks: 28, quests: 5 },
      { name: 'Streak Keeper', avatar: '🔥', xp: 2980, streaks: 32, quests: 3 },
      { name: 'Growth Guru', avatar: '🌱', xp: 2750, streaks: 20, quests: 4 },
      { name: 'Mindful Monk', avatar: '🧘', xp: 2500, streaks: 18, quests: 6 },
      { name: 'Fitness Fighter', avatar: '💪', xp: 2340, streaks: 15, quests: 2 },
    ];

    const getValue = (u: LeaderboardUser) => {
      switch (category) {
        case 'xp': return u.xp;
        case 'streaks': return u.streaks;
        case 'quests': return u.quests;
        default: return u.xp;
      }
    };

    const merged: LeaderboardUser[] = [...sampleUsers];

    if (user) {
      const current: LeaderboardUser = {
        id: user.id,
        name: user.displayName || 'You',
        avatar: user.avatar ?? '🧙‍♂️',
        xp: user.xp ?? 0,
        streaks: user.streakCount ?? 0,
        quests: (user as unknown as { quests?: number })?.quests ?? 0,
      };

      merged.push(current);
    }

    // Sort by selected metric (descending). If tie, fall back to xp then streaks.
    merged.sort((a, b) => {
      const valA = getValue(a);
      const valB = getValue(b);
      if (valA !== valB) return valB - valA;
      if (a.xp !== b.xp) return b.xp - a.xp;
      return b.streaks - a.streaks;
    });

    // Attach rank
    return merged.map((u, idx) => ({ ...u, rank: idx + 1 } as LeaderboardUser & { rank: number }));
  }, [category, user]);

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
              onClick={() => setTimeFilter(filter as 'weekly' | 'monthly' | 'allTime')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${timeFilter === filter
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
          {categoryOptions.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key as 'xp' | 'streaks' | 'quests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${category === cat.key
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
          {leaderboardData.map((row, index) => (
            <div key={row.rank} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {index < 3 ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                        'bg-orange-500'
                      }`}>
                      {index === 0 ? <FaCrown className="text-yellow-200" /> :
                        index === 1 ? <FaMedal className="text-gray-200" /> :
                          <FaAward className="text-orange-200" />}
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-gray-500">#{row.rank}</span>
                  )}
                </div>

                <div className="text-2xl">{row.avatar}</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{row.name}</h3>
                  {row.id && row.id === user?.id && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">You</span>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">
                    {(category === 'xp' ? row.xp : category === 'streaks' ? row.streaks : row.quests).toLocaleString()}
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