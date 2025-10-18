import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc, increment, query } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./UserContext";
import type { Habit, Achievement, Quest } from "../types/models";

interface DataContextType {
  habits: Habit[];
  achievements: Achievement[];
  quests: Quest[];
  addHabit: (habit: Partial<Habit>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  completeHabit: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addXP, addCoins } = useUser();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);

  // 🔹 Load Habits live
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.id, "habits"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Habit[];
      setHabits(data);
    });
    return () => unsub();
  }, [user]);

  // 🔹 Load Achievements live
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.id, "achievements"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Achievement[];
      setAchievements(data);
    });
    return () => unsub();
  }, [user]);

  // 🔹 Mock quests
  useEffect(() => {
    const mockQuests: Quest[] = [
      { name: "Complete 5 habits", description: "Do 5 habits today!", progress: 0, maxProgress: 5, participants: [], deadline: "2025-12-31", status: "active" },
    ];
    setQuests(mockQuests);
  }, []);

  // In your addHabit function, update to include all properties:
const addHabit = useCallback(async (habit: Partial<Habit>) => {
  if (!user) return;
  await addDoc(collection(db, "users", user.id, "habits"), {
    name: habit.name ?? "Untitled",
    frequency: habit.frequency ?? "daily",
    timesPerCompletion: habit.timesPerCompletion ?? 1,
    xpReward: habit.xpReward ?? 50,
    coinReward: habit.coinReward ?? 10,
    completions: 0,
    createdAt: new Date().toISOString(),
    isActive: true,
  });
}, [user]);

  // 🔹 Remove a habit
  const removeHabit = useCallback(async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.id, "habits", id));
  }, [user]);

  // 🔹 Complete a habit
  // Replace your completeHabit function with this:
  const completeHabit = useCallback(async (id: string) => {
    if (!user) return;
  
  const habit = habits.find(h => h.id === id);
    if (!habit) return;

  const ref = doc(db, "users", user.id, "habits", id);
    await updateDoc(ref, {
      completions: increment(1),
      lastCompletedAt: new Date().toISOString(),
  });
  
  // Use custom rewards if they exist, otherwise defaults
    await addXP(habit.xpReward || 50);
    await addCoins(habit.coinReward || 10);
}, [user, addXP, addCoins, habits]);

  return (
    <DataContext.Provider value={{ habits, achievements, quests, addHabit, removeHabit, completeHabit }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
};
