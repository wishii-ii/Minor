import { useState, useEffect } from "react"; // Added useEffect import
import { useData } from "../contexts/DataContext";
import { CreateHabitModal } from "../components/CreateHabitModal";
import { BaseLayout } from '../components/BaseLayout';
import { useUser } from '../contexts/UserContext'; // Added useUser import

export default function Habits() {
  const { habits, removeHabit, completeHabit, updateHabit } = useData();
  const { user, addXP } = useUser(); // Added user and addXP from UserContext
  const [showModal, setShowModal] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false); // Added showPenalty state
  const [penaltyAmount, setPenaltyAmount] = useState(0); // Added penaltyAmount state
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Check for missed habits and apply penalties
  useEffect(() => {
    if (!user || habits.length === 0) return;

    const checkMissedHabits = async () => {
      const now = new Date();
      let totalPenalty = 0;

      for (const habit of habits) {
        if (!habit.lastCompletedAt || habit.penaltyXP <= 0) continue;

        const lastCompleted = new Date(habit.lastCompletedAt);
        const hoursSinceCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
        
        const shouldHaveCompleted = shouldHabitBeCompleted(habit, hoursSinceCompletion);
        
        if (shouldHaveCompleted && !habit.penaltyApplied) {
          totalPenalty += habit.penaltyXP;
          // Mark penalty as applied
          await updateHabit(habit.id, { 
            ...habit, 
            penaltyApplied: true,
            lastPenaltyCheck: now.toISOString()
          });
        }
      }

      if (totalPenalty > 0) {
        setPenaltyAmount(totalPenalty);
        setShowPenalty(true);
        setTimeout(() => setShowPenalty(false), 3000);
        
        // Apply penalty to user XP
        await addXP(-totalPenalty);
      }
    };

    checkMissedHabits();
  }, [habits, user, updateHabit, addXP]); // Added dependencies

  const shouldHabitBeCompleted = (habit: any, hoursSinceCompletion: number) => {
    if (habit.customFrequency) {
      const [value, unit] = habit.customFrequency.split(' ');
      const numValue = parseInt(value);
      
      switch (unit) {
        case 'hours':
        case 'hour':
          return hoursSinceCompletion >= numValue * 2; // Give some grace period
        case 'days':
        case 'day':
          return hoursSinceCompletion >= numValue * 24 + 12; // Half day grace period
        case 'weeks':
        case 'week':
          return hoursSinceCompletion >= numValue * 168 + 24; // 1 day grace period
        case 'months':
        case 'month':
          return hoursSinceCompletion >= numValue * 720 + 168; // 1 week grace period
        default:
          return hoursSinceCompletion >= 36; // Default with grace period
      }
    }
    
    switch (habit.frequency) {
      case "hourly":
        return hoursSinceCompletion >= 2;
      case "daily":
        return hoursSinceCompletion >= 36;
      case "weekly":
        return hoursSinceCompletion >= 192; // 8 days
      case "monthly":
        return hoursSinceCompletion >= 744; // 31 days
      default:
        return hoursSinceCompletion >= 36;
    }
  };

  // REMOVED THE DUPLICATE handleComplete FUNCTION - KEEP ONLY THIS ONE
  const handleComplete = async (id: string) => {
    if (completingId) return;
    
    setCompletingId(id);
    const habit = habits.find(h => h.id === id);
    
    if (habit) {
      // Reset penalty applied flag when completing habit
      await updateHabit(id, { 
        ...habit, 
        penaltyApplied: false,
        lastCompletedAt: new Date().toISOString()
      });
      await completeHabit(id);
    }
    
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
    setCompletingId(null);
  };

  const canCompleteAgain = (habit: any) => {
    if (!habit.lastCompletedAt) return true;
    
    const now = new Date();
    const lastCompleted = new Date(habit.lastCompletedAt);
    const hoursSinceCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
    
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
          return hoursSinceCompletion >= numValue * 168;
        case 'months':
        case 'month':
          return hoursSinceCompletion >= numValue * 720;
        default:
          return hoursSinceCompletion >= 24;
      }
    }
    
    switch (habit.frequency) {
      case "hourly":
        return hoursSinceCompletion >= 1;
      case "daily":
        return hoursSinceCompletion >= 24;
      case "weekly":
        return hoursSinceCompletion >= 168;
      case "monthly":
        return hoursSinceCompletion >= 720;
      default:
        return hoursSinceCompletion >= 24;
    }
  };

  const formatFrequencyDisplay = (habit: any) => {
    if (habit.customFrequency) {
      return habit.customFrequency;
    }
    return habit.frequency || 'daily';
  };

  const getNextDueTime = (habit: any) => {
    if (!habit.lastCompletedAt) return 'Now';
    
    const lastCompleted = new Date(habit.lastCompletedAt);
    let nextDue = new Date(lastCompleted);
    
    if (habit.customFrequency) {
      const [value, unit] = habit.customFrequency.split(' ');
      const numValue = parseInt(value);
      
      switch (unit) {
        case 'hours':
        case 'hour':
          nextDue.setHours(nextDue.getHours() + numValue);
          break;
        case 'days':
        case 'day':
          nextDue.setDate(nextDue.getDate() + numValue);
          break;
        case 'weeks':
        case 'week':
          nextDue.setDate(nextDue.getDate() + (numValue * 7));
          break;
        case 'months':
        case 'month':
          nextDue.setMonth(nextDue.getMonth() + numValue);
          break;
        default:
          nextDue.setDate(nextDue.getDate() + 1);
      }
    } else {
      switch (habit.frequency) {
        case "hourly":
          nextDue.setHours(nextDue.getHours() + 1);
          break;
        case "daily":
          nextDue.setDate(nextDue.getDate() + 1);
          break;
        case "weekly":
          nextDue.setDate(nextDue.getDate() + 7);
          break;
        case "monthly":
          nextDue.setMonth(nextDue.getMonth() + 1);
          break;
        default:
          nextDue.setDate(nextDue.getDate() + 1);
      }
    }
    
    return nextDue.toLocaleDateString();
  };

  return (
    <BaseLayout className="max-w-6xl mx-auto p-6">
      {/* Reward Notification */}
      {showReward && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          🎉 +50 XP & +10 Coins!
        </div>
      )}

      {/* Penalty Notification */}
      {showPenalty && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ⚠️ Missed habits! -{penaltyAmount} XP penalty
        </div>
      )}

      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Habits</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Build good habits and earn rewards - but be careful of penalties!
          </p>
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
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No habits yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Create your first habit to start your journey!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => {
              const canComplete = canCompleteAgain(habit);
              const isCompleting = completingId === habit.id;
              const isOverdue = habit.penaltyApplied;
              
              return (
                <div 
                  key={habit.id} 
                  className={`bg-white dark:bg-gray-800 rounded-lg border p-4 shadow-sm transition-all ${
                    isOverdue 
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Habit Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{habit.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {formatFrequencyDisplay(habit)}
                        </span>
                        {(habit.timesPerCompletion && habit.timesPerCompletion > 1) && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {habit.timesPerCompletion}x per completion
                          </span>
                        )}
                        {habit.penaltyXP > 0 && (
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                            -{habit.penaltyXP} XP penalty
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
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span>Progress</span>
                      <span>{habit.completions || 0} completions</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(((habit.completions || 0) / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>+{habit.xpReward || 50} XP</span>
                      <span>+{habit.coinReward || 10} Coins</span>
                    </div>
                  </div>

                  {/* Due Date & Penalty Info */}
                  <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                    {isOverdue ? (
                      <p className="text-red-500 dark:text-red-400 font-medium">⚠️ Overdue! Complete to avoid penalty</p>
                    ) : (
                      <p>Next due: {getNextDueTime(habit)}</p>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleComplete(habit.id)}
                    disabled={!canComplete || isCompleting}
                    className={`w-full py-2 px-4 rounded-lg transition-colors font-medium ${
                      canComplete && !isCompleting
                        ? isOverdue
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleting ? 'Completing...' : canComplete ? '+ Complete' : 'Already Completed'}
                  </button>
                  
                  {!canComplete && habit.lastCompletedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
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
    </BaseLayout>
  );
}