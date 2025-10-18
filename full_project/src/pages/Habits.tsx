import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { CreateHabitModal } from "../components/CreateHabitModal";

export default function Habits() {
  const { habits, removeHabit, completeHabit } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const handleComplete = async (id: string) => {
    if (completingId) return; // Prevent spam
    
    setCompletingId(id);
    await completeHabit(id);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
    setCompletingId(null);
  };

  const canCompleteAgain = (habit: any) => {
    if (!habit.lastCompletedAt) return true;
    
    const now = new Date();
    const lastCompleted = new Date(habit.lastCompletedAt);
    const hoursSinceCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
    
    // Handle custom frequency with number + unit format
    if (habit.customFrequency) {
      const [value, unit] = habit.customFrequency.split(' ');
      const numValue = parseInt(value);
      
      switch (unit) {
        case 'hours':
        case 'hour':
          return hoursSinceCompletion >= numValue;
        case 'days':
        case 'day':
          return hoursSinceCompletion >= numValue * 24;
        case 'weeks':
        case 'week':
          return hoursSinceCompletion >= numValue * 168; // 7 days
        case 'months':
        case 'month':
          return hoursSinceCompletion >= numValue * 720; // 30 days
        default:
          return hoursSinceCompletion >= 24; // Default to daily
      }
    }
    
    // Handle preset frequencies
    switch (habit.frequency) {
      case "hourly":
        return hoursSinceCompletion >= 1;
      case "daily":
        return hoursSinceCompletion >= 24;
      case "weekly":
        return hoursSinceCompletion >= 168; // 7 days
      case "monthly":
        return hoursSinceCompletion >= 720; // 30 days
      default:
        return hoursSinceCompletion >= 24; // Default to daily
    }
  };

  const formatFrequencyDisplay = (habit: any) => {
    if (habit.customFrequency) {
      return habit.customFrequency;
    }
    return habit.frequency || 'daily';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Reward Notification */}
      {showReward && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          🎉 +50 XP & +10 Coins!
        </div>
      )}

      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Habits</h1>
          <p className="text-gray-600 mt-2">Build good habits and earn rewards</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Create Habit
        </button>
      </header>

      <section>
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No habits yet</h3>
            <p className="text-gray-500">Create your first habit to start your journey!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => {
              const canComplete = canCompleteAgain(habit);
              const isCompleting = completingId === habit.id;
              
              return (
                <div key={habit.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  {/* Habit Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{habit.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 capitalize">
                          {formatFrequencyDisplay(habit)}
                        </span>
                        {(habit.timesPerCompletion && habit.timesPerCompletion > 1) && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {habit.timesPerCompletion}x per completion
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  {/* Progress & Rewards */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{habit.completions || 0} completions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(((habit.completions || 0) / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>+{habit.xpReward || 50} XP</span>
                      <span>+{habit.coinReward || 10} Coins</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleComplete(habit.id)}
                    disabled={!canComplete || isCompleting}
                    className={`w-full py-2 px-4 rounded-lg transition-colors font-medium ${
                      canComplete && !isCompleting
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isCompleting ? 'Completing...' : canComplete ? '+ Complete' : 'Already Completed'}
                  </button>
                  
                  {!canComplete && habit.lastCompletedAt && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Next available: {new Date(habit.lastCompletedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showModal && <CreateHabitModal onClose={() => setShowModal(false)} />}
    </div>
  );
}