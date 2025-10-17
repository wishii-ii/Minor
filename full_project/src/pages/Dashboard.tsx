import React from 'react';
import { FaMedal, FaCheckCircle, FaFire, FaTrophy, FaCalendarCheck } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { StatsWidget } from '../components/StatsWidget';
import { HabitCard } from '../components/HabitCard';


export const Dashboard: React.FC = () => {
  const { user, addXP } = useUser();
  const { habits, completeHabit } = useData();

  const todaysHabits = habits.filter(h => h.isActive);
  const completedToday = habits.filter(h => h.completedToday).length;

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit && !habit.completedToday) {
      completeHabit(habitId);
      addXP(habit.xpReward ?? 0);
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
          icon={<FaMedal size={24} />}
          label="Level"
          value={user.level.toString()}
          color="from-yellow-400 to-orange-500"
          subtitle={`${user.xp}/${user.xpToNext} XP`}
        />
        <StatsWidget
          icon={<FaCheckCircle size={24} />}
          label="Today's Progress"
          value={`${completedToday}/${todaysHabits.length}`}
          color="from-green-400 to-emerald-500"
          subtitle="habits completed"
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
          value="12"
          color="from-purple-400 to-pink-500"
          subtitle="badges earned"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Habits */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarCheck className="text-purple-500" />
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

        {/* Active Quest section removed: quests are not available from context */}
      </div>
    </div>
  );
};