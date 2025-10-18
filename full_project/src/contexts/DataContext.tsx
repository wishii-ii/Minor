import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc, increment, query } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./UserContext";
import type { Habit, Achievement, Quest, DataContextType } from "../types/models";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addXP, addCoins } = useUser();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load Habits live
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const q = query(collection(db, "users", user.id, "habits"));
      const unsub = onSnapshot(q, 
        (snap) => {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Habit[];
          setHabits(data);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error("Error loading habits:", err);
          setError("Failed to load habits");
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (err) {
      setError("Error setting up habits listener");
      setLoading(false);
    }
  }, [user]);

  // 🔹 Load Achievements live
  useEffect(() => {
    if (!user) {
      setAchievements([]);
      return;
    }
    
    try {
      const q = query(collection(db, "users", user.id, "achievements"));
      const unsub = onSnapshot(q, 
        (snap) => {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Achievement[];
          setAchievements(data);
        },
        (err) => {
          console.error("Error loading achievements:", err);
        }
      );
      return () => unsub();
    } catch (err) {
      console.error("Error setting up achievements listener:", err);
    }
  }, [user]);

  // 🔹 Mock quests
  useEffect(() => {
    const mockQuests: Quest[] = [
      { 
        name: "Complete 5 habits", 
        description: "Do 5 habits today!", 
        progress: 0, 
        maxProgress: 5, 
        participants: [], 
        deadline: "2025-12-31", 
        status: "active" 
      },
    ];
    setQuests(mockQuests);
  }, []);

  // 🔹 Add a new habit
  const addHabit = useCallback(async (habit: Omit<Habit, 'id'>) => {
    if (!user) throw new Error("User must be logged in to add habits");
    
    try {
      await addDoc(collection(db, "users", user.id, "habits"), {
        name: habit.name ?? "Untitled",
        title: habit.title,
        frequency: habit.frequency ?? "daily",
        customFrequency: habit.customFrequency,
        timesPerCompletion: habit.timesPerCompletion ?? 1,
        xpReward: habit.xpReward ?? 50,
        coinReward: habit.coinReward ?? 10,
        penaltyXP: habit.penaltyXP ?? 0,
        penaltyApplied: false,
        lastPenaltyCheck: habit.lastPenaltyCheck,
        description: habit.description,
        category: habit.category,
        schedule4Days: habit.schedule4Days,
        scheduledDays: habit.scheduledDays,
        schedule: habit.schedule,
        completions: 0,
        streak: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastCompletedAt: null,
        completedToday: false,
      });
    } catch (err) {
      console.error("Error adding habit:", err);
      throw new Error("Failed to create habit");
    }
  }, [user]);

  // 🔹 Remove a habit
  const removeHabit = useCallback(async (id: string) => {
    if (!user) throw new Error("User must be logged in to remove habits");
    
    try {
      await deleteDoc(doc(db, "users", user.id, "habits", id));
    } catch (err) {
      console.error("Error removing habit:", err);
      throw new Error("Failed to delete habit");
    }
  }, [user]);

  // 🔹 Delete a habit (alias for removeHabit)
  const deleteHabit = useCallback(async (habitId: string) => {
    return removeHabit(habitId);
  }, [removeHabit]);

  // 🔹 Complete a habit
  const completeHabit = useCallback(async (id: string) => {
    if (!user) throw new Error("User must be logged in to complete habits");
    
    const habit = habits.find(h => h.id === id);
    if (!habit) throw new Error("Habit not found");

    try {
      const ref = doc(db, "users", user.id, "habits", id);
      await updateDoc(ref, {
        completions: increment(1),
        lastCompletedAt: new Date().toISOString(),
        penaltyApplied: false, // Reset penalty when completed
        streak: increment(1),
      });

      await addXP(habit.xpReward || 50);
      await addCoins(habit.coinReward || 10);
    } catch (err) {
      console.error("Error completing habit:", err);
      throw new Error("Failed to complete habit");
    }
  }, [user, addXP, addCoins, habits]);

  // 🔹 Update a habit
  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    if (!user) throw new Error("User must be logged in to update habits");
    
    try {
      const ref = doc(db, "users", user.id, "habits", habitId);
      await updateDoc(ref, updates);
    } catch (err) {
      console.error("Error updating habit:", err);
      throw new Error("Failed to update habit");
    }
  }, [user]);

  // 🔹 Unlock achievement
  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!user) throw new Error("User must be logged in to unlock achievements");
    
    try {
      const ref = doc(db, "users", user.id, "achievements", achievementId);
      await updateDoc(ref, {
        earned: true,
        earnedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error unlocking achievement:", err);
      throw new Error("Failed to unlock achievement");
    }
  }, [user]);

  // 🔹 Update quest progress
  const updateQuestProgress = useCallback(async (questName: string, progress: number) => {
    setQuests(prev => prev.map(quest => 
      quest.name === questName 
        ? { ...quest, progress: Math.min(progress, quest.maxProgress) }
        : quest
    ));
  }, []);

  const value: DataContextType = {
    habits,
    achievements,
    quests,
    addHabit,
    removeHabit,
    deleteHabit,
    completeHabit,
    updateHabit,
    unlockAchievement,
    updateQuestProgress,
    loading,
    error,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
};