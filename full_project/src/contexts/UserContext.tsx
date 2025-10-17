import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle, signOutCurrentUser, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  streakCount: number;
  joinDate: string;
  status: 'online' | 'away' | 'offline';
}

interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }

      // Load or create Firestore user profile
      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const newUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'New Adventurer',
          avatar: '🧙‍♂️',
          level: 1,
          xp: 0,
          xpToNext: 500,
          streakCount: 0,
          joinDate: new Date().toISOString(),
          status: 'online',
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      } else {
        setUser(snap.data() as User);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, updates as any);
    setUser(prev => prev ? { ...prev, ...updates } as User : prev);
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    // optimistic local update
    let newXP = user.xp + amount;
    let newLevel = user.level;
    let newXPToNext = user.xpToNext;
    while (newXP >= newXPToNext) {
      newXP -= newXPToNext;
      newLevel += 1;
      newXPToNext = newLevel * 500;
    }

    await updateDoc(doc(db, 'users', user.id), {
      xp: newXP,
      level: newLevel,
      xpToNext: newXPToNext,
    } as any);

    setUser(prev => prev ? { ...prev, xp: newXP, level: newLevel, xpToNext: newXPToNext } : prev);
  };

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await signOutCurrentUser();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, addXP, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};