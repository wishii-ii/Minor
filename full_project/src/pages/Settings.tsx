import React from 'react';
import { User, Bell, Palette, Shield, Download, Moon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const Settings: React.FC = () => {
  const { user, updateUser } = useUser();

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
          icon={<User className="w-5 h-5" />}
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
                <span className="text-2xl">{user?.avatar}</span>
                <button className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                  Change Avatar
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          title="Notifications"
          icon={<Bell className="w-5 h-5" />}
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
          icon={<Palette className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <ThemeOption name="Light" active={true} />
                <ThemeOption name="Dark" active={false} />
                <ThemeOption name="Auto" active={false} />
              </div>
            </div>
            <ToggleSetting
              label="Reduced Motion"
              description="Minimize animations and transitions"
              defaultChecked={false}
            />
          </div>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection
          title="Privacy"
          icon={<Shield className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <ToggleSetting
              label="Public Profile"
              description="Allow others to view your profile and achievements"
              defaultChecked={true}
            />
            <ToggleSetting
              label="Show on Leaderboards"
              description="Display your progress on public leaderboards"
              defaultChecked={true}
            />
            <ToggleSetting
              label="Activity Status"
              description="Let team members see when you're online"
              defaultChecked={false}
            />
          </div>
        </SettingsSection>

        {/* Data & Export */}
        <SettingsSection
          title="Data & Export"
          icon={<Download className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Export Your Data</h4>
              <p className="text-sm text-gray-600 mb-4">
                Download a copy of your habit data, progress, and achievements
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                Export Data
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Delete Account</h4>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data
              </p>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
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

const ThemeOption: React.FC<{
  name: string;
  active: boolean;
}> = ({ name, active }) => {
  return (
    <button
      className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 ${
        active
          ? 'border-purple-500 bg-purple-50 text-purple-700'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {name}
    </button>
  );
};