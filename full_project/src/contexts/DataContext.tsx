/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { db, firebaseEnabled } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useUser } from "./UserContext";
import { Habit, Achievement } from "../types/models";
interface DataContextType {
  habits: Habit[];
  achievements: Achievement[];
  addHabit: (habit: Partial<Habit>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  completeHabit: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addXP, addCoins } = useUser();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // LocalStorage key for fallback when Firebase is not available or user isn't signed in
  const LOCAL_HABITS_KEY = 'habitora_local_habits';

  const loadLocalHabits = () => {
    try {
      const raw = localStorage.getItem(LOCAL_HABITS_KEY);
      if (!raw) return [] as Habit[];
      return JSON.parse(raw) as Habit[];
    } catch {
      return [] as Habit[];
    }
  };

  const saveLocalHabits = (items: Habit[]) => {
    try {
      localStorage.setItem(LOCAL_HABITS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  // ✅ Load habits live from Firestore
  useEffect(() => {
    // If Firebase is configured and user present, load from Firestore. Otherwise, fall back to localStorage.
    if (firebaseEnabled && user) {
      const q = query(collection(db as any, "users", user.id, "habits"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const habitData: Habit[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        })) as Habit[];
        setHabits(habitData);
      });

      return () => unsubscribe();
    }

    // Load from localStorage
    const local = loadLocalHabits();
    setHabits(local);
    return;
  }, [user]);

  // Place this after the other useEffect

  useEffect(() => {
    if (firebaseEnabled && user) {
      const achievementsCollection = collection(db as any, "users", user.id, "achievements");
      const unsubscribe = onSnapshot(achievementsCollection, (snapshot) => {
        setAchievements(
          snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Partial<Achievement>) })) as Achievement[]
        );
      });
      return () => unsubscribe();
    }

    // otherwise clear achievements
    setAchievements([]);
  }, [user]);

  // ✅ Add habit
  const addHabit = async (habit: Partial<Habit>) => {
    if (!firebaseEnabled || !user) {
      // local fallback
      const newHabit: Habit = {
        id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
        name: (habit as any).name || (habit.title ?? 'Untitled Habit'),
        title: habit.title,
        frequency: habit.frequency ?? 'daily',
        completions: habit.completions ?? 0,
        lastCompletedAt: habit.lastCompletedAt ?? null,
        completedToday: habit.completedToday ?? false,
        streak: habit.streak ?? 0,
        description: habit.description ?? '',
        xpReward: habit.xpReward ?? 50,
        isActive: habit.isActive ?? true,
        createdAt: habit.createdAt ?? new Date().toISOString(),
        category: habit.category ?? 'wellness',
      };
      setHabits((prev) => {
        const next = [newHabit, ...prev];
        saveLocalHabits(next);
        return next;
      });
      return;
    }

    await addDoc(collection(db as any, "users", user.id, "habits"), {
      ...habit,
      completions: habit.completions ?? 0,
      lastCompletedAt: habit.lastCompletedAt ?? null,
    });
  };

  // ✅ Delete habit
  const removeHabit = async (id: string) => {
    if (!firebaseEnabled || !user) {
      setHabits((prev) => {
        const next = prev.filter((h) => h.id !== id);
        saveLocalHabits(next);
        return next;
      });
      return;
    }

    await deleteDoc(doc(db as any, "users", user.id, "habits", id));
  };

  // ✅ Complete habit (increment count)
  const completeHabit = async (id: string) => {
    if (!firebaseEnabled || !user) {
      // Compute reward from current local state (fallback to 50)
      const existing = habits.find((h) => h.id === id);
      const xpReward = existing?.xpReward ?? 50;

      setHabits((prev) => {
        const next = prev.map((h) => (h.id === id ? { ...h, completions: (h.completions ?? 0) + 1, lastCompletedAt: new Date().toISOString() } : h));
        saveLocalHabits(next);
        return next;
      });

      // Award XP and coins (best-effort)
      try {
        if (addXP) addXP(xpReward);
        // derive coin reward from xpReward (e.g., 1 coin per 5 xp)
        const coinReward = Math.max(1, Math.round((existing?.xpReward ?? xpReward) / 5));
        if (addCoins) addCoins(coinReward);
      } catch {
        // ignore award failures
      }
      return;
    }

    // Firestore path: increment completions and award xp based on local cached habit if available
    const habitRef = doc(db as any, "users", user.id, "habits", id);
    await updateDoc(habitRef, {
      completions: increment(1),
      lastCompletedAt: new Date().toISOString(),
    });

    // Determine xp reward and coin reward from local cache and call addXP/addCoins
    try {
      const existing = habits.find((h) => h.id === id);
      const xpReward = existing?.xpReward ?? 50;
      if (addXP) await addXP(xpReward);
      const coinReward = Math.max(1, Math.round((existing?.xpReward ?? xpReward) / 5));
      if (addCoins) await addCoins(coinReward);
    } catch {
      // ignore
    }
  };



  return (
    <DataContext.Provider value={{ habits, achievements, addHabit, removeHabit, completeHabit }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
