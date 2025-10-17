
import React from 'react';
import { FaCrown, FaUser, FaLock } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';


export const Teams: React.FC = () => {
  useUser();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teams</h1>
          <p className="text-gray-600">Connect with friends and stay accountable together</p>
        </div>

        <div>
          {/* Force-locked: Create disabled for all users */}
          <button
            disabled
            aria-disabled="true"
            title="Teams are locked until you reach level 5"
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 cursor-not-allowed"
          >
            <FaLock />
            Create Team (Locked)
          </button>
        </div>
      </div>

      {/* Locked banner */}
      <div className="mb-8 p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-800">
        <div className="flex items-center gap-3">
          <FaLock className="text-yellow-600" />
          <div>
            <strong>Teams are locked</strong>
            <div className="text-sm">Reach level 5 to unlock full Teams functionality (create, join, and manage teams).</div>
          </div>
        </div>
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
            locked
          />
          <TeamCard
            name="Study Squad"
            members={5}
            role="member"
            activeQuests={1}
            teamXP={1200}
            avatar="📚"
            locked
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
            locked
          />
          <TeamCard
            name="Mindful Minds"
            members={6}
            role="none"
            activeQuests={1}
            teamXP={980}
            avatar="🧘"
            canJoin
            locked
          />
          <TeamCard
            name="Creative Crew"
            members={9}
            role="none"
            activeQuests={2}
            teamXP={3100}
            avatar="🎨"
            canJoin
            locked
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
  locked?: boolean;
}> = ({ name, members, role, activeQuests, teamXP, avatar, canJoin, locked = false }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
          {avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{name}</h3>
            {role === 'leader' && <FaCrown className="text-yellow-500" />}
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
          {role === 'leader' ? <FaCrown className="text-yellow-500" /> : <FaUser className="text-purple-400" />}
          <span className="text-sm font-medium text-gray-700">
            {role === 'leader' ? 'Team Leader' : 'Member'}
          </span>
        </div>
      )}

      <button
        disabled={locked || !canJoin}
        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${locked || !canJoin
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
          : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
          }`}
      >
        {locked ? 'Locked (Reach level 5)' : canJoin ? 'Join Team' : role === 'leader' ? 'Manage Team' : 'View Team'}
      </button>
    </div>
  );
};