import React from 'react';
import { Users, Sword, Clock } from 'lucide-react';
import { Quest } from '../contexts/DataContext';

interface QuestPanelProps {
  quest: Quest;
}

export const QuestPanel: React.FC<QuestPanelProps> = ({ quest }) => {
  const progressPercentage = (quest.progress / quest.maxProgress) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
      <div className="flex items-center gap-2 mb-3">
        <Sword className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-gray-800">{quest.name}</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{quest.description}</p>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{quest.progress}/{quest.maxProgress}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Quest Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{quest.participants.length} participants</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Due {new Date(quest.deadline).toLocaleDateString()}</span>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
        Rally Team
      </button>
    </div>
  );
};