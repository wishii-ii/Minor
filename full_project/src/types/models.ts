// src/types/models.ts

// ====================
// Core Data Interfaces
// ====================

export interface Quest {
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  participants: string[];
  deadline: string;
  status?: string;
}

export interface Habit {
  id: string;
  name?: string;
  title?: string;
  frequency?: string;
  completions?: number;
  lastCompletedAt?: string | null;
  completedToday?: boolean;
  streak?: number;
  description?: string;
  xpReward?: number;
  isActive?: boolean;
  createdAt?: string;
  category?: string;
  
  // ADDED: Missing properties for scheduling
  schedule4Days?: number[]; // Array of day numbers (0-6) when habit is scheduled
  scheduledDays?: number[]; // Alternative property name
  schedule?: {
    type: 'daily' | 'weekly' | 'custom';
    days?: number[]; // For weekly: [0,1,2,3,4,5,6] where 0=Sunday
    customSchedule?: any;
  };
}

export interface Achievement {
  id: string;
  name: string;
  earned?: boolean;
  tier?: string;
  icon?: string;
  description?: string;
  progress?: number;
  requirement?: number;
  earnedAt?: string;
}

// ====================
// User & Context Types
// ====================

export interface User {
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

  // virtual currency / coins used in Rewards
  coins?: number;

  // optional fields for richer profile handling
  theme?: 'light' | 'dark' | 'auto';
  publicProfile?: boolean;
  showOnLeaderboards?: boolean;
  activityStatus?: boolean;

  // inventory + unlocks
  purchasedRewardIds?: number[];

  // additional metadata used in Dashboard & context
  achievements?: string[];
  lastLoginDate?: string;
  deleted?: boolean;
  deletedAt?: string;
}

export interface UserContextType {
  user: User | null;

  // Update user fields in Firestore and local state
  updateUser: (updates: Partial<User>) => Promise<void>;

  // Add XP and automatically handle level ups
  addXP: (amount: number) => Promise<void>;

  // Spend coins; returns true if the purchase succeeds
  spendCoins: (amount: number) => Promise<boolean>;

  // Add coins to the user's wallet
  addCoins: (amount: number) => Promise<void>;

  // Record a purchased reward ID in user data
  addPurchaseId: (rewardId: number) => Promise<void>;

  // Mark account deleted and sign out
  deleteAccount: () => Promise<void>;

  // Authentication
  signIn: () => Promise<void>;
  signInWithAvatar: (avatar: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// ====================
// Additional Types for Data Context
// ====================

export interface DataContextType {
  habits: Habit[];
  achievements: Achievement[];
  quests: Quest[];
  
  // Habit operations
  completeHabit: (habitId: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  
  // Achievement operations
  unlockAchievement: (achievementId: string) => Promise<void>;
  
  // Quest operations
  updateQuestProgress: (questName: string, progress: number) => Promise<void>;
  
  // Loading states
  loading: boolean;
  error: string | null;
}