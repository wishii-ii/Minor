// src/components/CreateHabitModal.tsx
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { Habit } from "../types/models";

interface CreateHabitModalProps {
  onClose: () => void;
}

export function CreateHabitModal({ onClose }: CreateHabitModalProps) {
  const { addHabit } = useData();
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<Habit['frequency']>("daily");
  const [customFrequency, setCustomFrequency] = useState("");
  const [timesPerCompletion, setTimesPerCompletion] = useState(1);
  const [xpReward, setXpReward] = useState(50);
  const [coinReward, setCoinReward] = useState(10);
  const [penaltyXP, setPenaltyXP] = useState(0); // Added missing state
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [scheduleDays, setScheduleDays] = useState<number[]>([]);

  const daysOfWeek = [
    { id: 0, name: "Sun" },
    { id: 1, name: "Mon" },
    { id: 2, name: "Tue" },
    { id: 3, name: "Wed" },
    { id: 4, name: "Thu" },
    { id: 5, name: "Fri" },
    { id: 6, name: "Sat" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const newHabit: Omit<Habit, 'id'> = {
      name: name.trim(),
      frequency,
      timesPerCompletion: timesPerCompletion > 1 ? timesPerCompletion : undefined,
      xpReward,
      coinReward,
      penaltyXP, // Added penaltyXP
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      schedule4Days: scheduleDays.length > 0 ? scheduleDays : undefined,
      completions: 0,
      streak: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastCompletedAt: null,
      penaltyApplied: false // Initialize penaltyApplied as false
    };

    try {
      await addHabit(newHabit);
      onClose();
    } catch (error) {
      console.error("Failed to create habit:", error);
    }
  };

  const toggleDay = (dayId: number) => {
    setScheduleDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const isCustomFrequency = frequency === "custom";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Create New Habit
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Exercise"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your habit..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Health, Work, Personal"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Custom Frequency Input */}
          {isCustomFrequency && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Custom Frequency
              </label>
              <input
                type="text"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
                placeholder="e.g., 2 days, 3 weeks, 6 hours"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* Weekly Schedule */}
          {frequency === "weekly" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scheduleDays.includes(day.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Times Per Completion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Times Per Completion
            </label>
            <input
              type="number"
              value={timesPerCompletion}
              onChange={(e) => setTimesPerCompletion(parseInt(e.target.value) || 1)}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* XP Reward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              XP Reward
            </label>
            <input
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
              min="0"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Coin Reward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Coin Reward
            </label>
            <input
              type="number"
              value={coinReward}
              onChange={(e) => setCoinReward(parseInt(e.target.value) || 0)}
              min="0"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Penalty XP - NEW FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Penalty XP (for missed habits)
            </label>
            <input
              type="number"
              value={penaltyXP}
              onChange={(e) => setPenaltyXP(parseInt(e.target.value) || 0)}
              min="0"
              max="500"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              XP deducted when you miss this habit (optional)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}