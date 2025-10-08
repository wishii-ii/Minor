import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { Calendar, Award, Target, TrendingUp, Users } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useUser();
  const { habits, achievements } = useData();

  if (!user) return null;

  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completions, 0);
  const earnedAchievements = achievements.filter(a => a.earned);
  const joinDate = new Date(user.joinDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
            {user.avatar}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.displayName}</h1>
            <div className="flex items-center gap-6 text-purple-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Level {user.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  user.status === 'online' ? 'bg-green-400' : 
                  user.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
                <span className="capitalize">{user.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span>Progress to Level {user.level + 1}</span>
            <span>{user.xp}/{user.xpToNext} XP</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Statistics</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <StatCard
              icon={<Target className="w-6 h-6" />}
              title="Total Completions"
              value={totalCompletions.toString()}
              subtitle="across all habits"
              color="from-blue-500 to-indigo-600"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Current Streak"
              value={user.streakCount.toString()}
              subtitle="days in a row"
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              icon={<Award className="w-6 h-6" />}
              title="Achievements"
              value={earnedAchievements.length.toString()}
              subtitle={`of ${achievements.length} total`}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Team Contributions"
              value="47"
              subtitle="quest points earned"
              color="from-yellow-500 to-orange-600"
            />
          </div>

          {/* Recent Activity */}
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <div className="space-y-4">
              <ActivityItem
                icon="🏆"
                title="Achievement Unlocked"
                description="Earned the Streak Starter badge"
                time="2 hours ago"
              />
              <ActivityItem
                icon="✅"
                title="Habit Completed"
                description="Finished Morning Meditation"
                time="3 hours ago"
              />
              <ActivityItem
                icon="⚔️"
                title="Quest Progress"
                description="Contributed to Tower of Wellness"
                time="5 hours ago"
              />
              <ActivityItem
                icon="📈"
                title="Level Up"
                description="Reached Level 8"
                time="Yesterday"
              />
            </div>
          </div>
        </div>

        {/* Achievements Sidebar */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            {earnedAchievements.slice(0, 5).map(achievement => (
              <div
                key={achievement.id}
                className="bg-white rounded-xl p-4 shadow-md border border-indigo-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    achievement.tier === 'gold' ? 'bg-yellow-100 text-yellow-600' :
                    achievement.tier === 'silver' ? 'bg-gray-100 text-gray-600' :
                    achievement.tier === 'bronze' ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{achievement.name}</h4>
                    <p className="text-xs text-gray-500">{achievement.tier} tier</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Settings */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <h3 className="font-bold text-gray-800 mb-4">Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Public Profile</span>
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Show on Leaderboards</span>
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Activity Status</span>
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              </div>
            </div>
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
    <div className="bg-white rounded-xl p-4 shadow-md border border-indigo-100">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${color} text-white mb-3`}>
        {icon}
      </div>
      <h3 className="font-medium text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
};

const ActivityItem: React.FC<{
  icon: string;
  title: string;
  description: string;
  time: string;
}> = ({ icon, title, description, time }) => {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
};