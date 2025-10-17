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
}

export interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  signIn: () => Promise<void>;
  signInWithAvatar: (avatar: string) => Promise<void>;
  signOut: () => Promise<void>;
}
