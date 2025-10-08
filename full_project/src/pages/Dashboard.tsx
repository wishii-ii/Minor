import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { StatsWidget } from '../components/StatsWidget';
import { HabitCard } from '../components/HabitCard';
import { QuestPanel } from '../components/QuestPanel';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, addXP } = useUser();
  const { habits, completeHabit, quests } = useData();

  const todaysHabits = habits.filter(h => h.isActive);
  const completedToday = habits.filter(h => h.completedToday).length;
  const activeQuest = quests.find(q => q.status === 'active');

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit && !habit.completedToday) {
      completeHabit(habitId);
      addXP(habit.xpReward);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user.displayName}!
        </h1>
        <p className="text-gray-600">
          Here's today's journey: track habits, keep streaks alive, and earn XP toward your next level
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsWidget
          icon={<Zap className="w-6 h-6" />}
          label="Level"
          value={user.level.toString()}
          color="from-yellow-400 to-orange-500"
          subtitle={`${user.xp}/${user.xpToNext} XP`}
        />
        <StatsWidget
          icon={<Target className="w-6 h-6" />}
          label="Today's Progress"
          value={`${completedToday}/${todaysHabits.length}`}
          color="from-green-400 to-emerald-500"
          subtitle="habits completed"
        />
        <StatsWidget
          icon={<TrendingUp className="w-6 h-6" />}
          label="Current Streak"
          value={user.streakCount.toString()}
          color="from-blue-400 to-indigo-500"
          subtitle="days strong"
        />
        <StatsWidget
          icon={<Award className="w-6 h-6" />}
          label="Achievements"
          value="12"
          color="from-purple-400 to-pink-500"
          subtitle="badges earned"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Habits */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Today's Habits
          </h2>
          <div className="grid gap-4">
            {todaysHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={() => handleCompleteHabit(habit.id)}
              />
            ))}
          </div>
        </div>

        {/* Active Quest */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Quest</h2>
          {activeQuest ? (
            <QuestPanel quest={activeQuest} />
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
              <p className="text-gray-500 text-center">No active quests</p>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                Find a Quest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};