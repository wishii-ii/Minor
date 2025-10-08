import React from 'react';
import { Sparkles, Target, Trophy, Users, Sword } from 'lucide-react';

interface HomeProps {
  onAuth: () => void;
}

export const Home: React.FC<HomeProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-3xl">H</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
              HABITŌRA
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build better days with HABITŌRA — create habits, earn XP, unlock badges, 
              and team up for quests that make growth exciting
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onAuth}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Start Your Adventure
              </button>
              <button className="border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all duration-200">
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Turn Daily Goals Into Epic Adventures
        </h2>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Create Habits"
            description="Build daily routines that stick with smart reminders and tracking"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Track Streaks"
            description="Watch your consistency grow with beautiful streak counters"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Earn Rewards"
            description="Unlock badges, level up, and collect achievements for your progress"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Join Teams"
            description="Connect with friends and stay accountable together"
          />
          <FeatureCard
            icon={<Sword className="w-8 h-8" />}
            title="Complete Quests"
            description="Embark on epic challenges with your party members"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-indigo-100">
      <div className="text-purple-600 mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};