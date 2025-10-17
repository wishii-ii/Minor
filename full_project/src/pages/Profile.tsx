import React from 'react';
import { FaMedal, FaFire, FaTrophy, FaCalendarAlt, FaCoins, FaUser, FaCheckCircle } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';

export const Profile: React.FC = () => {
  const { user } = useUser();
  const { habits, achievements } = useData();

  if (!user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600">Please sign in to view your profile</h2>
          <p className="text-gray-500 mt-2">Your profile will appear here once you're signed in.</p>
        </div>
      </div>
    );
  }

  const completedHabits = habits.filter(habit => habit.completions && habit.completions > 0).length;
  const totalCompletions = habits.reduce((total, habit) => total + (habit.completions || 0), 0);
  const earnedAchievements = achievements.filter(ach => ach.earned).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Profile Header - Same as Dashboard */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {user.avatar && user.avatar.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-20 h-20 rounded-full border-2 border-indigo-200 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-indigo-200 bg-indigo-500 flex items-center justify-center text-white text-2xl">
              {user.avatar || user.displayName?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">{user.displayName}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                user.status === 'online' ? 'bg-green-500' :
                user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></span>
              {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Away' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid - Same style as Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
              <FaMedal className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">Lv {user.level}</div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
              <FaFire className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{user.streakCount}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
              <FaTrophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{earnedAchievements}</div>
              <div className="text-xs text-gray-500">Achievements</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
              <FaCoins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{user.coins || 0}</div>
              <div className="text-xs text-gray-500">Coins</div>
            </div>
          </div>

          {/* Progress Section - Same as Dashboard */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Level Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Level</span>
                <span className="font-medium">Lv {user.level}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to Next Level</span>
                <span className="font-medium">{user.xp} / {user.xpToNext} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${user.xpToNext > 0 ? (user.xp / user.xpToNext) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {user.xpToNext - user.xp} XP needed for level {user.level + 1}
              </p>
            </div>
          </div>

          {/* Habits Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              Habits Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{habits.length}</div>
                <div className="text-sm text-gray-600">Total Habits</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{totalCompletions}</div>
                <div className="text-sm text-gray-600">Total Completions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-indigo-500" />
              Profile Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Display Name</span>
                <span className="font-medium text-gray-800">{user.displayName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email</span>
                <span className="font-medium text-gray-800">{user.email}</span>
              </div>
              {user.joinDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-400" />
                    Member Since
                  </span>
                  <span className="font-medium text-gray-800">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Achievements</h3>
            <div className="text-center py-4">
              <FaTrophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-gray-800 font-medium">
                {earnedAchievements} of {achievements.length} unlocked
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {earnedAchievements === 0 
                  ? 'Complete habits to earn achievements!'
                  : 'Keep going to earn more achievements!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};