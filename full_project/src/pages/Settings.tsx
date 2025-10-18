import React from 'react';
import { FaUser, FaPalette, FaLock, FaDatabase } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { useState, useEffect } from 'react';

export const Settings: React.FC = () => {
  const { user, updateUser, deleteAccount } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [ownedAvatars, setOwnedAvatars] = useState<number[]>([]);

  // Apply theme whenever user or theme changes
  useEffect(() => {
    setSelectedAvatar(user?.avatar || null);
    setOwnedAvatars(user?.purchasedRewardIds ?? []);
    applyTheme(user?.theme);
  }, [user]);

  const applyTheme = (theme: string | undefined) => {
    const html = document.documentElement;
    
    // Remove both classes first
    html.classList.remove('light', 'dark');
    
    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.add('light');
    } else if (theme === 'auto') {
      // Use system preference for auto theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.add('light');
      }
    } else {
      // Default to light if no theme set
      html.classList.add('light');
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    updateUser({ theme });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your HABITŌRA experience</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Profile"
          icon={<FaUser />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={user?.displayName || ''}
                onChange={(e) => updateUser({ displayName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avatar
              </label>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedAvatar || user?.avatar}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const options = ['🧙‍♂️', '⚔️', '🐉', '🔥'];
                      const next = options[(options.indexOf(selectedAvatar || user?.avatar || '🧙‍♂️') + 1) % options.length];
                      setSelectedAvatar(next);
                    }}
                    className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    Change Avatar
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedAvatar) return;
                      updateUser({ avatar: selectedAvatar });
                    }}
                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>

              {ownedAvatars.length > 0 && (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="font-medium mb-1">Purchased Avatars</div>
                  <div className="flex gap-2">
                    {ownedAvatars.filter(id => id >= 1 && id <= 4).map(id => (
                      <button 
                        key={id} 
                        onClick={() => {
                          const map: Record<number, string> = { 1: '🧙‍♂️', 2: '⚔️', 3: '🐉', 4: '🔥' };
                          const icon = map[id];
                          setSelectedAvatar(icon);
                          updateUser({ avatar: icon });
                        }} 
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
                      >
                        {id === 1 ? '🧙‍♂️' : id === 2 ? '⚔️' : id === 3 ? '🐉' : '🔥'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection
          title="Appearance"
          icon={<FaPalette />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                    user?.theme === 'light' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                    user?.theme === 'dark' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => handleThemeChange('auto')}
                  className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                    user?.theme === 'auto' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Auto
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Current theme: {user?.theme || 'light'}
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection
          title="Privacy"
          icon={<FaLock />}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Public Profile</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow others to view your profile and achievements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!user?.publicProfile}
                  onChange={(e) => updateUser({ publicProfile: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Show on Leaderboards</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Display your progress on public leaderboards</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!user?.showOnLeaderboards}
                  onChange={(e) => updateUser({ showOnLeaderboards: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </SettingsSection>

        {/* Data & Export */}
        <SettingsSection
          title="Data & Export"
          icon={<FaDatabase />}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Export Your Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Download a copy of your habit data, progress, and achievements
              </p>
              <button disabled className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg font-medium transition-all duration-200">
                Export Data (Coming Soon)
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Delete Account</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Permanently delete your account and all associated data
              </p>
              <button onClick={() => {
                if (!confirm('Are you sure you want to delete your account? This action cannot be undone on the client.')) return;
                deleteAccount();
              }} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

const SettingsSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-purple-600 dark:text-purple-400">{icon}</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
};