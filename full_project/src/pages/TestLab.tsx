
import React, { useState } from 'react';
import { FaFlask, FaExclamationTriangle, FaDatabase } from 'react-icons/fa';


export const TestLab: React.FC = () => {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

  const experiments = [
    {
      id: 'habit-ai',
      title: 'AI Habit Suggestions',
      description: 'Machine learning powered habit recommendations based on your patterns',
      status: 'beta',
      enabled: false
    },
    {
      id: 'voice-commands',
      title: 'Voice Habit Completion',
      description: 'Complete habits using voice commands for hands-free tracking',
      status: 'alpha',
      enabled: false
    },
    {
      id: 'social-challenges',
      title: 'Monthly Challenges',
      description: 'Community-wide challenges with special rewards and recognition',
      status: 'beta',
      enabled: true
    },
    {
      id: 'habit-analytics',
      title: 'Advanced Analytics',
      description: 'Deep insights into your habit patterns with predictive analytics',
      status: 'experimental',
      enabled: false
    }
  ];

  const toggleExperiment = (id: string) => {
    // Toggle experiment logic would go here
    console.log(`Toggling experiment: ${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'alpha': return 'bg-orange-100 text-orange-800';
      case 'experimental': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaFlask className="text-purple-500 text-2xl" />
          <h1 className="text-3xl font-bold text-gray-800">Test Laboratory</h1>
        </div>
        <p className="text-gray-600 mb-4">
          Experimental features and upcoming functionality for testing and feedback
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-400" />
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> Features in this lab are experimental and may not work as expected.
              Use at your own discretion and provide feedback to help us improve!
            </p>
          </div>
        </div>
      </div>

      {/* Experiments Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {experiments.map(experiment => (
          <div
            key={experiment.id}
            className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaFlask className="text-purple-400" />
                <div>
                  <h3 className="font-bold text-gray-800">{experiment.title}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(experiment.status)}`}>
                    {experiment.status}
                  </span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={experiment.enabled}
                  onChange={() => toggleExperiment(experiment.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <p className="text-gray-600 text-sm mb-4">{experiment.description}</p>

            <button
              onClick={() => setActiveExperiment(activeExperiment === experiment.id ? null : experiment.id)}
              className="text-purple-600 font-medium text-sm hover:text-purple-700 transition-colors"
            >
              {activeExperiment === experiment.id ? 'Hide Details' : 'Learn More'}
            </button>

            {activeExperiment === experiment.id && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-800 mb-2">Technical Details</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• This feature is currently in {experiment.status} testing</p>
                  <p>• Expected completion: Next quarter</p>
                  <p>• Feedback collection: Active</p>
                  <p>• Known limitations: Performance may vary</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Test Data Section */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
        <div className="flex items-center gap-3 mb-4">
          <FaDatabase className="text-purple-400" />
          <h2 className="text-xl font-bold text-gray-800">Test Collection Data</h2>
        </div>

        <p className="text-gray-600 mb-4">
          This section contains test data and mock information used for development and QA purposes.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Mock Users</h4>
            <p className="text-2xl font-bold text-purple-600">156</p>
            <p className="text-sm text-gray-500">Test profiles created</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Test Habits</h4>
            <p className="text-2xl font-bold text-purple-600">892</p>
            <p className="text-sm text-gray-500">Sample habits generated</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">API Calls</h4>
            <p className="text-2xl font-bold text-purple-600">1.2K</p>
            <p className="text-sm text-gray-500">Test requests this session</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
            Generate Test Data
          </button>
          <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Clear Test Cache
          </button>
          <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Export Logs
          </button>
        </div>
      </div>
    </div>
  );
};