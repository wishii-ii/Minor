import React from 'react';
import { Check, Flame, Calendar } from 'lucide-react';
import { Habit } from '../contexts/DataContext';

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete }) => {
  const progressPercentage = habit.completedToday ? 100 : 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-800">{habit.title}</h3>
            {habit.streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                <Flame className="w-3 h-3" />
                {habit.streak}
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {habit.frequency}
            </div>
            <span>+{habit.xpReward} XP</span>
          </div>
        </div>

        <button
          onClick={onComplete}
          disabled={habit.completedToday}
          className={`ml-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
            habit.completedToday
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-400 hover:bg-purple-500 hover:text-white hover:shadow-md'
          }`}
        >
          <Check className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};