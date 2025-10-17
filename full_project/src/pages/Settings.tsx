
import React from 'react';
import { FaUser, FaBell, FaPalette, FaLock, FaDatabase } from 'react-icons/fa';

import { useUser } from '../contexts/UserContext';
import { useState, useEffect } from 'react';

export const Settings: React.FC = () => {
  const { user, updateUser, deleteAccount } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [ownedAvatars, setOwnedAvatars] = useState<number[]>([]);
  const DARK_MODE_ID = 8; // id used in Rewards for Dark Mode

  useEffect(() => {
    setSelectedAvatar(user?.avatar || null);
    setOwnedAvatars(user?.purchasedRewardIds ?? []);
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your HABITŌRA experience</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Profile"
          icon={<FaUser />}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={user?.displayName || ''}
                onChange={(e) => updateUser({ displayName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar
              </label>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedAvatar || user?.avatar}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // open small picker: for now toggle between a few built-in avatars
                      const options = ['🧙‍♂️', '⚔️', '🐉', '🔥'];
                      const next = options[(options.indexOf(selectedAvatar || user?.avatar || '🧙‍♂️') + 1) % options.length];
                      setSelectedAvatar(next);
                    }}
                    className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
                  >
                    Change Avatar
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedAvatar) return;
                      updateUser({ avatar: selectedAvatar });
                    }}
                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>

              {ownedAvatars.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  <div className="font-medium mb-1">Purchased Avatars</div>
                  <div className="flex gap-2">
                    {ownedAvatars.filter(id => id >= 1 && id <= 4).map(id => (
                      <button key={id} onClick={() => {
                        const map: Record<number, string> = { 1: '🧙‍♂️', 2: '⚔️', 3: '🐉', 4: '🔥' };
                        const icon = map[id];
                        setSelectedAvatar(icon);
                        updateUser({ avatar: icon });
                      }} className="px-3 py-2 bg-gray-100 rounded-lg">{id === 1 ? '🧙‍♂️' : id === 2 ? '⚔️' : id === 3 ? '🐉' : '🔥'}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          title="Notifications"
          icon={<FaBell />}
        >
          <div className="space-y-4">
            <ToggleSetting
              label="Habit Reminders"
              description="Get notified when it's time to complete your habits"
              defaultChecked={true}
            />
            <ToggleSetting
              label="Quest Updates"
              description="Receive notifications about quest progress and team activities"
              defaultChecked={true}
            />
            <ToggleSetting
              label="Achievement Alerts"
              description="Celebrate when you unlock new badges and milestones"
              defaultChecked={true}
            />
            <ToggleSetting
              label="Team Messages"
              description="Get notified about messages from your team members"
              defaultChecked={false}
            />
          </div>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection
          title="Appearance"
          icon={<FaPalette />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => updateUser({ theme: 'light' })}
                  className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${user?.theme === 'light' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Light
                </button>
                <button
                  onClick={() => {
                    // only allow dark if user purchased the dark mode reward
                    if (!user?.purchasedRewardIds?.includes(DARK_MODE_ID)) return;
                    updateUser({ theme: 'dark' });
                  }}
                  className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${user?.theme === 'dark' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  disabled={!user?.purchasedRewardIds?.includes(DARK_MODE_ID)}
                >
                  Dark {user?.purchasedRewardIds?.includes(DARK_MODE_ID) ? '' : '(Locked)'}
                </button>
                <button
                  onClick={() => updateUser({ theme: 'auto' })}
                  className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${user?.theme === 'auto' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Auto
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection
          title="Privacy"
          icon={<FaLock />}
        >
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Public Profile</h4>
                  <p className="text-sm text-gray-600">Allow others to view your profile and achievements</p>
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
                  <h4 className="font-medium text-gray-800">Show on Leaderboards</h4>
                  <p className="text-sm text-gray-600">Display your progress on public leaderboards</p>
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

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Activity Status</h4>
                  <p className="text-sm text-gray-600">Let team members see when you're online</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!user?.activityStatus}
                    onChange={(e) => updateUser({ activityStatus: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
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
              <h4 className="font-medium text-gray-800 mb-2">Export Your Data</h4>
              <p className="text-sm text-gray-600 mb-4">
                Download a copy of your habit data, progress, and achievements
              </p>
              <button disabled className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-medium transition-all duration-200">
                Export Data (Coming Soon)
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Delete Account</h4>
              <p className="text-sm text-gray-600 mb-4">
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
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-purple-600">{icon}</div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};

const ToggleSetting: React.FC<{
  label: string;
  description: string;
  defaultChecked: boolean;
}> = ({ label, description, defaultChecked }) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-medium text-gray-800">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      </label>
    </div>
  );
};

// ThemeOption component removed; theme selection is now handled inline above.