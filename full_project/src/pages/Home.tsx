import React, { useRef } from 'react';
import { FaPlusCircle, FaFire, FaTrophy, FaUsers, FaFlagCheckered } from 'react-icons/fa';

interface HomeProps {
  onAuth: (mode: 'signup' | 'login') => void;
}

export const Home: React.FC<HomeProps> = ({ onAuth }) => {
  // 1. Create a ref to attach to the features section
  const featuresRef = useRef<HTMLDivElement>(null);

  // 2. Handler function to scroll to the ref's position
  const handleScrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-3xl">H</span>
              </div>
            </div>

            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              HABITŌRA
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build better days with HABITŌRA — create habits, earn XP, unlock badges,
              and team up for quests that make growth exciting
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onAuth('signup')}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-purple-600 hover:to-indigo-700"
              >
                Sign Up
              </button>
              <button
                onClick={() => onAuth('login')}
                className="bg-gray-800 border-2 border-purple-500/30 text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 hover:border-purple-400 transition-all duration-200"
              >
                Log In
              </button>
              {/* Attach the scroll handler */}
              <button
                onClick={handleScrollToFeatures}
                className="border-2 border-purple-500/30 text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 hover:border-purple-400 transition-all duration-200"
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Attach the ref here */}
      <div ref={featuresRef} className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Turn Daily Goals Into Epic Adventures
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          <FeatureCard
            icon={<FaPlusCircle size={32} />}
            title="Create Habits"
            description="Build daily routines that stick with smart reminders and tracking"
          />
          <FeatureCard
            icon={<FaFire size={32} />}
            title="Track Streaks"
            description="Watch your consistency grow with beautiful streak counters"
          />
          <FeatureCard
            icon={<FaTrophy size={32} />}
            title="Earn Rewards"
            description="Unlock badges, level up, and collect achievements for your progress"
          />
          <FeatureCard
            icon={<FaUsers size={32} />}
            title="Join Teams"
            description="Connect with friends and stay accountable together"
          />
          <FeatureCard
            icon={<FaFlagCheckered size={32} />}
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
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-indigo-500/20 hover:border-indigo-400/40">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
};