import React from 'react';
import { FaMedal, FaCheckCircle, FaFire, FaTrophy, FaCalendarCheck, FaCoins } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { StatsWidget } from '../components/StatsWidget';
import { Habit } from '../types/models';

export const Dashboard: React.FC = () => {
  const { user } = useUser();
  const { habits, completeHabit } = useData();

  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get today's date in YYYY-MM-DD format for completion tracking
  const todayDate = new Date().toISOString().split('T')[0];
  
  // Filter habits for today - include ALL active habits for now (you can add scheduling logic later)
  const todaysHabits = habits.filter((habit: Habit) => {
    if (!habit.isActive) return false;
    
    // If habit has scheduling, use it. Otherwise include all active habits
    const scheduledDays = (habit as any).schedule4Days || (habit as any).scheduledDays;
    if (scheduledDays && scheduledDays.length > 0) {
      return scheduledDays.includes(today);
    }
    
    // If no scheduling set, include habit for today
    return true;
  });

  // Check if habit was completed today
  const isHabitCompletedToday = (habit: Habit) => {
    if (!habit.lastCompletedAt) return false;
    const lastCompletedDate = new Date(habit.lastCompletedAt).toISOString().split('T')[0];
    return lastCompletedDate === todayDate;
  };

  const completedToday = todaysHabits.filter(isHabitCompletedToday).length;
  const xpEarnedToday = todaysHabits
    .filter(isHabitCompletedToday)
    .reduce((total, habit) => total + (habit.xpReward || 50), 0);

  const handleCompleteHabit = async (habitId: string) => {
    const habit = habits.find((h: Habit) => h.id === habitId);
    if (habit && !isHabitCompletedToday(habit)) {
      try {
        await completeHabit(habitId);
        // Note: completeHabit already calls addXP and addCoins in DataContext
        // So we don't need to call them again here
      } catch (error) {
        console.error('Error completing habit:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600">Please sign in to view your dashboard</h2>
          <p className="text-gray-500 mt-2">Your progress and habits will appear here once you're signed in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section with avatar fix */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {user.avatar && user.avatar.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
            // If avatar is an image URL
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-16 h-16 rounded-full border-2 border-indigo-200 object-cover"
            />
          ) : (
            // If avatar is an emoji or text
            <div className="w-16 h-16 rounded-full border-2 border-indigo-200 bg-indigo-500 flex items-center justify-center text-white text-2xl">
              {user.avatar || user.displayName?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Welcome back, {user.displayName}!
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                user.status === 'online' ? 'bg-green-500' :
                user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></span>
              {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Away' : 'Offline'}
            </p>
          </div>
        </div>
        <p className="text-gray-600">
          {todaysHabits.length > 0 
            ? `You have ${todaysHabits.length} habit${todaysHabits.length === 1 ? '' : 's'} to complete today.`
            : 'No habits to complete today. Add some habits to start tracking your progress!'
          }
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsWidget
          icon={<FaMedal size={24} />}
          label="Level"
          value={`Lv ${user.level}`}
          color="from-yellow-400 to-orange-500"
          subtitle={`${user.xp} / ${user.xpToNext} XP`}
          progress={user.xpToNext > 0 ? (user.xp / user.xpToNext) * 100 : 0}
        />
        <StatsWidget
          icon={<FaCheckCircle size={24} />}
          label="Today's Progress"
          value={`${completedToday}/${todaysHabits.length}`}
          color="from-green-400 to-emerald-500"
          subtitle="habits completed"
          progress={todaysHabits.length > 0 ? (completedToday / todaysHabits.length) * 100 : 0}
        />
        <StatsWidget
          icon={<FaFire size={24} />}
          label="Current Streak"
          value={user.streakCount.toString()}
          color="from-blue-400 to-indigo-500"
          subtitle="days strong"
        />
        <StatsWidget
          icon={<FaTrophy size={24} />}
          label="Achievements"
          value={(user.achievements?.length || 0).toString()}
          color="from-purple-400 to-pink-500"
          subtitle="unlocked"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarCheck className="text-purple-500" />
              Today's Habits ({todaysHabits.length})
            </h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="grid gap-4">
            {todaysHabits.length > 0 ? (
              todaysHabits.map((habit: Habit) => (
                <div 
                  key={habit.id} 
                  className={`bg-white rounded-lg border-2 p-4 shadow-sm transition-all ${
                    isHabitCompletedToday(habit) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                        {habit.name}
                        {isHabitCompletedToday(habit) && (
                          <span className="text-green-500 text-sm">✓ Completed</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>+{habit.xpReward || 50} XP</span>
                        <span>+{habit.coinReward || 10} Coins</span>
                        <span className="capitalize">{habit.frequency || 'daily'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCompleteHabit(habit.id)}
                      disabled={isHabitCompletedToday(habit)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isHabitCompletedToday(habit)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isHabitCompletedToday(habit) ? 'Completed' : 'Complete'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FaCalendarCheck className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-500 text-lg font-medium">No habits for today</p>
                <p className="text-sm text-gray-400 mt-1">Add habits to see them here</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Your Coins</p>
                <p className="text-2xl font-bold">{user.coins || 0}</p>
                <p className="text-xs opacity-80 mt-1">Available to spend on rewards</p>
              </div>
              <FaCoins className="text-3xl opacity-90" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Habits Completed</span>
                <span className="font-medium text-green-600">
                  {completedToday} / {todaysHabits.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">XP Earned Today</span>
                <span className="font-medium text-blue-600">+{xpEarnedToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Streak</span>
                <span className="font-medium text-red-600">{user.streakCount} days</span>
              </div>
              {user.joinDate && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-xs font-medium text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Level Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Level</span>
                <span className="font-medium">Lv {user.level}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to Next</span>
                <span className="font-medium">
                  {user.xp} / {user.xpToNext} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${user.xpToNext > 0 ? (user.xp / user.xpToNext) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">
                {user.xpToNext - user.xp} XP needed for level {user.level + 1}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};