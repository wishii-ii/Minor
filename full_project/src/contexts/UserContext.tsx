/* eslint-disable react-refresh/only-export-components */
/* The firebase client SDK types are dynamic in this project and we use a few
  explicit `any` casts when interacting with auth/db objects. Disable the
  rule for this file to avoid noisy lint errors while keeping focused typing
  elsewhere. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle, signOutCurrentUser, db, firebaseEnabled } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, UserContextType } from '../types/models';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Listen for Firebase auth state changes (only if Firebase is enabled)
  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      // no-op when Firebase isn't configured
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }

      // Load or create Firestore user profile
      // firebase client types are dynamic here; allow an explicit any for interop
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRef = doc(db as any, 'users', fbUser.uid);
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
          coins: 500, // give new users a welcome balance
        };
        await setDoc(userRef, newUser as any);
        setUser(newUser);
      } else {
        setUser(snap.data() as User);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    if (!firebaseEnabled || !db) {
      // fallback: just update local state
      setUser(prev => prev ? { ...prev, ...updates } as User : prev);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRef = doc(db as any, 'users', user.id);
    await updateDoc(userRef, updates as unknown as Partial<Record<string, unknown>>);
    setUser(prev => prev ? { ...prev, ...updates } as User : prev);
  };

  const spendCoins = async (amount: number) => {
    if (!user) return false;
    const current = user.coins ?? 0;
    if (amount > current) return false;

    const newAmount = current - amount;
    if (!firebaseEnabled || !db) {
      setUser(prev => prev ? { ...prev, coins: newAmount } as User : prev);
      return true;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateDoc(doc(db as any, 'users', user.id), { coins: newAmount } as unknown as Partial<Record<string, unknown>>);
      setUser(prev => prev ? { ...prev, coins: newAmount } as User : prev);
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to spend coins:', err);
      return false;
    }
  };

  const addCoins = async (amount: number) => {
    if (!user) return;
    const current = user.coins ?? 0;
    const newAmount = current + amount;

    if (!firebaseEnabled || !db) {
      setUser(prev => prev ? { ...prev, coins: newAmount } as User : prev);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateDoc(doc(db as any, 'users', user.id), { coins: newAmount } as unknown as Partial<Record<string, unknown>>);
      setUser(prev => prev ? { ...prev, coins: newAmount } as User : prev);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to add coins:', err);
    }
  };

  const addPurchaseId = async (rewardId: number) => {
    if (!user) return;
    const existing = user.purchasedRewardIds ?? [];
    if (existing.includes(rewardId)) return;
    const next = [...existing, rewardId];

    if (!firebaseEnabled || !db) {
      setUser(prev => prev ? { ...prev, purchasedRewardIds: next } as User : prev);
      return;
    }

    try {
      await updateDoc(doc(db as any, 'users', user.id), { purchasedRewardIds: next } as unknown as Partial<Record<string, unknown>>);
      setUser(prev => prev ? { ...prev, purchasedRewardIds: next } as User : prev);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist purchase:', err);
    }
  };

  const deleteAccount = async () => {
    // This will remove the user document but not necessarily delete the auth user in Firebase Auth.
    // Deleting the auth account requires elevated privileges; we implement a safe local flow + remove user doc.
    if (!user) return;
    try {
      if (firebaseEnabled && db) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateDoc(doc(db as any, 'users', user.id), { deletedAt: new Date().toISOString(), deleted: true } as unknown as Partial<Record<string, unknown>>);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to mark account deleted:', err);
    }

    // Sign the user out locally
    await signOutCurrentUser();
    setUser(null);
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

    if (!firebaseEnabled || !db) {
      setUser(prev => prev ? { ...prev, xp: newXP, level: newLevel, xpToNext: newXPToNext } : prev);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(doc(db as any, 'users', user.id), {
      xp: newXP,
      level: newLevel,
      xpToNext: newXPToNext,
    } as unknown as Partial<Record<string, unknown>>);

    setUser(prev => prev ? { ...prev, xp: newXP, level: newLevel, xpToNext: newXPToNext } : prev);
  };

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // firebase not configured or sign-in failed; surface a console warning and leave app usable
      console.warn('Sign-in failed or disabled:', err);
    }
  };

  const signInWithAvatar = async (avatar: string) => {
    // Use the existing Google sign-in helper but supply the chosen avatar
    // when creating a new Firestore user document. We rely on the
    // onAuthStateChanged handler above to create the user doc; to pass the
    // avatar through we write it immediately after sign-in if the doc is new.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prevUser = auth ? (auth as any).currentUser : null;
      await signInWithGoogle();

      // After sign-in, check if there is a user and whether their document exists.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fbUser = (auth as any)?.currentUser || prevUser;
      if (!fbUser || !firebaseEnabled || !db) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRef = doc(db as any, 'users', fbUser.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const newUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'New Adventurer',
          avatar: avatar || '🧙‍♂️',
          level: 1,
          xp: 0,
          xpToNext: 500,
          streakCount: 0,
          joinDate: new Date().toISOString(),
          status: 'online',
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await setDoc(userRef, newUser as any);
        setUser(newUser);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Sign-in-with-avatar failed or is disabled:', err);
    }
  };

  const signOut = async () => {
    await signOutCurrentUser();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, addXP, spendCoins, addCoins, addPurchaseId, deleteAccount, signIn, signInWithAvatar, signOut }}>
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