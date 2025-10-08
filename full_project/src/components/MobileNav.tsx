import React from 'react';
import { 
  Home, 
  Target, 
  Award, 
  Users, 
  User
} from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const mobileItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'habits', label: 'Habits', icon: Target },
  { id: 'achievements', label: 'Badges', icon: Award },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'profile', label: 'Profile', icon: User }
];

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onPageChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-indigo-100 z-50">
      <nav className="flex items-center justify-around px-4 py-2">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-purple-600'
                  : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};