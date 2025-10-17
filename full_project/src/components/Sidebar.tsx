
import { FaHome, FaBullseye, FaChartLine, FaMedal, FaTrophy, FaUsers, FaEnvelope, FaBell, FaGift, FaCog, FaShieldAlt, FaUserPlus, FaUser, FaFlask } from 'react-icons/fa';
import React from 'react';


interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
  { id: 'habits', label: 'Habits', icon: <FaBullseye /> },
  { id: 'progress', label: 'Progress', icon: <FaChartLine /> },
  { id: 'achievements', label: 'Achievements', icon: <FaMedal /> },
  { id: 'quests', label: 'Quests', icon: <FaTrophy /> },
  { id: 'teams', label: 'Teams', icon: <FaUsers /> },
  { id: 'leaderboards', label: 'Leaderboards', icon: <FaTrophy /> },
  { id: 'messages', label: 'Messages', icon: <FaEnvelope /> },
  { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
  { id: 'rewards', label: 'Rewards', icon: <FaGift /> },
  { id: 'settings', label: 'Settings', icon: <FaCog /> },
  { id: 'admin', label: 'Admin', icon: <FaShieldAlt /> },
  { id: 'friends', label: 'Friends', icon: <FaUserPlus /> },
  { id: 'profile', label: 'Profile', icon: <FaUser /> },
  { id: 'test-lab', label: 'Test Lab', icon: <FaFlask /> }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-indigo-100 z-40">
      <div className="p-6 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              HABITŌRA
            </h1>
            <p className="text-xs text-gray-500">Gamified Growth</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                >
                  <span className={`w-5 h-5 ${isActive ? 'text-white' : ''}`}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'notifications' && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  )}
                  {item.id === 'messages' && (
                    <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};