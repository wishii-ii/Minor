import React from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';

export const Progress: React.FC = () => {
  const { habits } = useData();
  const { user } = useUser();

  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completions, 0);
  const averageStreak = habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + habit.streak, 0) / habits.length)
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress Analytics</h1>
        <p className="text-gray-600">Track your momentum and consistency over time</p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Total Completions"
          value={totalCompletions.toString()}
          subtitle="all time"
          color="from-blue-500 to-indigo-600"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          title="Current Streak"
          value={user?.streakCount.toString() || '0'}
          subtitle="days"
          color="from-green-500 to-emerald-600"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          title="Average Streak"
          value={averageStreak.toString()}
          subtitle="per habit"
          color="from-purple-500 to-pink-600"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          title="Current Level"
          value={user?.level.toString() || '1'}
          subtitle={`${user?.xp || 0} XP`}
          color="from-yellow-500 to-orange-600"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartCard
          title="Weekly Progress"
          description="Your habit completion trends over the past 7 days"
        />
        <ChartCard
          title="Monthly Overview"
          description="Long-term consistency patterns and streak analysis"
        />
      </div>

      {/* Habit Breakdown */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Habit Performance</h2>
        <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-4 gap-4 font-medium text-gray-600 text-sm">
              <span>Habit</span>
              <span>Completions</span>
              <span>Streak</span>
              <span>Success Rate</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {habits.map(habit => {
              const successRate = Math.round((habit.completions / Math.max(habit.completions + 10, 30)) * 100);
              return (
                <div key={habit.id} className="p-4">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="font-medium text-gray-800">{habit.title}</p>
                      <p className="text-sm text-gray-500">{habit.category}</p>
                    </div>
                    <span className="text-gray-600">{habit.completions}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{habit.streak}</span>
                      {habit.streak > 7 && (
                        <span className="text-orange-500">🔥</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{successRate}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}> = ({ icon, title, value, subtitle, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-medium text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

const ChartCard: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="h-64 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Chart visualization would go here</p>
          <p className="text-sm">Interactive progress charts coming soon</p>
        </div>
      </div>
    </div>
  );
};