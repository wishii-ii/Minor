import React, { createContext, useContext, useState } from 'react';

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
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'user-1',
    email: 'adventurer@habitora.com',
    displayName: 'Habit Hero',
    avatar: '🧙‍♂️',
    level: 8,
    xp: 2340,
    xpToNext: 2500,
    streakCount: 15,
    joinDate: '2024-01-15',
    status: 'online'
  });

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNext = prev.xpToNext;

      // Level up logic
      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel += 1;
        newXPToNext = newLevel * 500; // XP needed increases with level
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: newXPToNext
      };
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, addXP }}>
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