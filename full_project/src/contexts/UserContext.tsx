/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  signInWithGoogle,
  signOutCurrentUser,
  db,
  firebaseEnabled,
} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, UserContextType } from '../types/models';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Watch Firebase auth state
  useEffect(() => {
    if (!firebaseEnabled || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }

      const userRef = doc(db!, 'users', fbUser.uid);
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
          coins: 500,
          achievements: [],
        };

        await setDoc(userRef, newUser);
        setUser(newUser);
      } else {
        setUser(snap.data() as User);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Mutators ---
  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    if (!firebaseEnabled || !db) {
      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
      return;
    }
    const userRef = doc(db!, 'users', user.id);
    await updateDoc(userRef, updates);
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const spendCoins = async (amount: number) => {
    if (!user) return false;
    const current = user.coins ?? 0;
    if (amount > current) return false;

    const newAmount = current - amount;
    if (!firebaseEnabled || !db) {
      setUser((prev) => (prev ? { ...prev, coins: newAmount } : prev));
      return true;
    }

    try {
      await updateDoc(doc(db!, 'users', user.id), { coins: newAmount });
      setUser((prev) => (prev ? { ...prev, coins: newAmount } : prev));
      return true;
    } catch (err) {
      console.warn('Failed to spend coins:', err);
      return false;
    }
  };

  const addCoins = async (amount: number) => {
    if (!user) return;
    const newAmount = (user.coins ?? 0) + amount;

    if (!firebaseEnabled || !db) {
      setUser((prev) => (prev ? { ...prev, coins: newAmount } : prev));
      return;
    }

    try {
      await updateDoc(doc(db!, 'users', user.id), { coins: newAmount });
      setUser((prev) => (prev ? { ...prev, coins: newAmount } : prev));
    } catch (err) {
      console.warn('Failed to add coins:', err);
    }
  };

  const addPurchaseId = async (rewardId: number) => {
    if (!user) return;
    const next = [...(user.purchasedRewardIds ?? []), rewardId];

    if (!firebaseEnabled || !db) {
      setUser((prev) => (prev ? { ...prev, purchasedRewardIds: next } : prev));
      return;
    }

    await updateDoc(doc(db!, 'users', user.id), { purchasedRewardIds: next });
    setUser((prev) => (prev ? { ...prev, purchasedRewardIds: next } : prev));
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      if (firebaseEnabled && db) {
        await updateDoc(doc(db!, 'users', user.id), {
          deletedAt: new Date().toISOString(),
          deleted: true,
        });
      }
    } catch (err) {
      console.warn('Failed to mark account deleted:', err);
    }

    await signOutCurrentUser();
    setUser(null);
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    let newXP = user.xp + amount;
    let newLevel = user.level;
    let newXPToNext = user.xpToNext;

    while (newXP >= newXPToNext) {
      newXP -= newXPToNext;
      newLevel += 1;
      newXPToNext = newLevel * 500;
    }

    const updates = { xp: newXP, level: newLevel, xpToNext: newXPToNext };
    await updateUser(updates);
  };

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.warn('Sign-in failed:', err);
    }
  };

  const signInWithAvatar = async (avatar: string) => {
    try {
      await signInWithGoogle();
      if (!auth?.currentUser || !firebaseEnabled || !db) return;

      const fb = auth.currentUser;
      const userRef = doc(db!, 'users', fb.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const newUser: User = {
          id: fb.uid,
          email: fb.email || '',
          displayName: fb.displayName || 'New Adventurer',
          avatar,
          level: 1,
          xp: 0,
          xpToNext: 500,
          streakCount: 0,
          joinDate: new Date().toISOString(),
          status: 'online',
          coins: 500,
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (err) {
      console.warn('Sign-in-with-avatar failed:', err);
    }
  };

  const signOut = async () => {
    await signOutCurrentUser();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        addXP,
        spendCoins,
        addCoins,
        addPurchaseId,
        deleteAccount,
        signIn,
        signInWithAvatar,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
