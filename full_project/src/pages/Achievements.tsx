import React, { useState } from 'react';
import { FaMedal, FaStar } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';


export const Achievements: React.FC = () => {
  const { achievements } = useData();
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'earned') return achievement.earned;
    if (filter === 'locked') return !achievement.earned;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Achievements</h1>
        <p className="text-gray-600">Your journey to greatness, one badge at a time</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {['all', 'earned', 'locked'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === filterType
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: any }> = ({ achievement }) => {
  const tierColors = {
    bronze: 'from-orange-400 to-orange-600',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-purple-600'
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all duration-200 hover:shadow-lg ${achievement.earned
      ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
      : 'border-gray-200'
      }`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${achievement.earned
          ? `bg-gradient-to-br ${tierColors[achievement.tier as keyof typeof tierColors]} text-white shadow-lg`
          : 'bg-gray-200 text-gray-400'
          }`}>
          {achievement.earned ? achievement.icon : <FaMedal size={32} />}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${achievement.earned ? 'text-gray-800' : 'text-gray-500'}`}>
            {achievement.name}
          </h3>
          <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
            {achievement.description}
          </p>
        </div>
        {achievement.earned && (
          <FaStar size={20} className="text-yellow-400" />
        )}
      </div>

      {!achievement.earned && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm text-gray-500">{achievement.progress}/{achievement.requirement}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
            />
          </div>
        </div>
      )}

      {achievement.earned && achievement.earnedAt && (
        <p className="text-xs text-green-600 mt-4">
          Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};