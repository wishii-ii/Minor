import React from 'react';
import { Users, Plus, Crown, Star } from 'lucide-react';

export const Teams: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teams</h1>
          <p className="text-gray-600">Connect with friends and stay accountable together</p>
        </div>
        
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Team
        </button>
      </div>

      {/* My Teams */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Teams</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TeamCard
            name="Wellness Warriors"
            members={8}
            role="leader"
            activeQuests={2}
            teamXP={2450}
            avatar="⚡"
          />
          <TeamCard
            name="Study Squad"
            members={5}
            role="member"
            activeQuests={1}
            teamXP={1200}
            avatar="📚"
          />
        </div>
      </div>

      {/* Available Teams */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Discover Teams</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TeamCard
            name="Fitness Fanatics"
            members={12}
            role="none"
            activeQuests={3}
            teamXP={5200}
            avatar="💪"
            canJoin
          />
          <TeamCard
            name="Mindful Minds"
            members={6}
            role="none"
            activeQuests={1}
            teamXP={980}
            avatar="🧘"
            canJoin
          />
          <TeamCard
            name="Creative Crew"
            members={9}
            role="none"
            activeQuests={2}
            teamXP={3100}
            avatar="🎨"
            canJoin
          />
        </div>
      </div>
    </div>
  );
};

const TeamCard: React.FC<{
  name: string;
  members: number;
  role: 'leader' | 'member' | 'none';
  activeQuests: number;
  teamXP: number;
  avatar: string;
  canJoin?: boolean;
}> = ({ name, members, role, activeQuests, teamXP, avatar, canJoin }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
          {avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{name}</h3>
            {role === 'leader' && <Crown className="w-4 h-4 text-yellow-500" />}
          </div>
          <p className="text-sm text-gray-600">{members} members</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Active Quests</span>
          <span className="font-medium text-gray-800">{activeQuests}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Team XP</span>
          <span className="font-medium text-purple-600">{teamXP.toLocaleString()}</span>
        </div>
      </div>

      {role !== 'none' && (
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            {role === 'leader' ? 'Team Leader' : 'Member'}
          </span>
        </div>
      )}

      <button className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
        canJoin
          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}>
        {canJoin ? 'Join Team' : role === 'leader' ? 'Manage Team' : 'View Team'}
      </button>
    </div>
  );
};