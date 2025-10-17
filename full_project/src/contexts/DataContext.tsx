/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
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
  const { user } = useUser();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // ✅ Load habits live from Firestore
  useEffect(() => {
    if (!user) {
      setHabits([]);
      return;
    }

    const q = query(collection(db, "users", user.id, "habits"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitData: Habit[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabits(habitData);
    });

    return () => unsubscribe();
  }, [user]);

  // Place this after the other useEffect

  useEffect(() => { // <-- ADD THIS ENTIRE BLOCK
    if (user) {
      // This code gets the achievements from your database...
      const achievementsCollection = collection(db, "users", user.id, "achievements");

      // ...and then it writes them onto our whiteboard section.
      const unsubscribe = onSnapshot(achievementsCollection, (snapshot) => {
        setAchievements(
          snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Partial<Achievement>) })) as Achievement[]
        );
      });
      return () => unsubscribe();
    }
  }, [user]);

  // ✅ Add habit
  const addHabit = async (habit: Partial<Habit>) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.id, "habits"), {
      ...habit,
      completions: habit.completions ?? 0,
      lastCompletedAt: habit.lastCompletedAt ?? null,
    });
  };

  // ✅ Delete habit
  const removeHabit = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.id, "habits", id));
  };

  // ✅ Complete habit (increment count)
  const completeHabit = async (id: string) => {
    if (!user) return;
    const habitRef = doc(db, "users", user.id, "habits", id);
    await updateDoc(habitRef, {
      completions: increment(1),
      lastCompletedAt: new Date().toISOString(),
    });
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
