import { useState } from "react";
import { useData } from "../contexts/DataContext";

interface CreateHabitModalProps {
  onClose: () => void;
}

export function CreateHabitModal({ onClose }: CreateHabitModalProps) {
  const { addHabit } = useData();
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [customFrequency, setCustomFrequency] = useState("");
  const [timesPerCompletion, setTimesPerCompletion] = useState(1);
  const [xpReward, setXpReward] = useState(50);
  const [coinReward, setCoinReward] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const habitData: any = {
      name: name.trim(),
      frequency,
      timesPerCompletion,
      xpReward,
      coinReward,
      completions: 0,
    };

    // Add custom frequency if set
    if (frequency === "custom" && customFrequency) {
      habitData.customFrequency = customFrequency;
    }

    await addHabit(habitData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Habit</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Exercise, Read, Meditate"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {frequency === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Frequency
              </label>
              <input
                type="text"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 3 days, 2 weeks, 6 months"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: number + unit (e.g., "3 days", "2 weeks", "6 months")
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Times per Completion
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={timesPerCompletion}
              onChange={(e) => setTimesPerCompletion(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              How many times you need to do this habit for one completion
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                XP Reward
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                value={xpReward}
                onChange={(e) => setXpReward(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coin Reward
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={coinReward}
                onChange={(e) => setCoinReward(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}