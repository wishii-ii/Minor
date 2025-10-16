
import React, { useState } from 'react';
import { FaDownload, FaList, FaShieldAlt, FaSearch, FaFilter, FaInfoCircle } from 'react-icons/fa';


export const AdminLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activity' | 'audit'>('activity');
  const [searchTerm, setSearchTerm] = useState('');

  const activityLogs = [
    { id: 1, user: 'Habit Hero', action: 'Completed habit', details: 'Morning Meditation', timestamp: '2024-01-15 10:30:00', type: 'habit' },
    { id: 2, user: 'Quest Master', action: 'Joined team', details: 'Wellness Warriors', timestamp: '2024-01-15 10:25:00', type: 'social' },
    { id: 3, user: 'Mindful Monk', action: 'Level up', details: 'Reached Level 5', timestamp: '2024-01-15 10:20:00', type: 'progression' },
    { id: 4, user: 'Growth Guru', action: 'Earned achievement', details: 'Streak Starter Badge', timestamp: '2024-01-15 10:15:00', type: 'achievement' },
    { id: 5, user: 'Fitness Fighter', action: 'Created habit', details: 'Daily Workout', timestamp: '2024-01-15 10:10:00', type: 'habit' },
  ];

  const auditLogs = [
    { id: 1, action: 'USER_ROLE_CHANGED', entity: 'User', entityId: 'user-123', details: 'Role changed from member to admin', user: 'system', timestamp: '2024-01-15 09:45:00' },
    { id: 2, action: 'HABIT_DELETED', entity: 'Habit', entityId: 'habit-456', details: 'Habit "Bad Example" permanently deleted', user: 'admin-1', timestamp: '2024-01-15 09:30:00' },
    { id: 3, action: 'TEAM_SETTINGS_MODIFIED', entity: 'Team', entityId: 'team-789', details: 'Privacy settings updated', user: 'team-leader-2', timestamp: '2024-01-15 09:15:00' },
    { id: 4, action: 'DATA_EXPORT_REQUESTED', entity: 'User', entityId: 'user-321', details: 'Full data export initiated', user: 'user-321', timestamp: '2024-01-15 09:00:00' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Logs</h1>
          <p className="text-gray-600">Monitor system activity and audit critical changes</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
            <FaDownload />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'activity'
            ? 'bg-white text-purple-700 shadow-sm'
            : 'text-gray-600 hover:text-purple-600'
            }`}
        >
          <FaList />
          Activity Logs
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === 'audit'
            ? 'bg-white text-purple-700 shadow-sm'
            : 'text-gray-600 hover:text-purple-600'
            }`}
        >
          <FaShieldAlt />
          Audit Logs
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab} logs...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <FaFilter />
          Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'activity' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">By User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(activeTab === 'activity' ? activityLogs : auditLogs).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  {activeTab === 'activity' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(log as any).user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {(log as any).action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {(log as any).details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(log as any).type === 'habit' ? 'bg-blue-100 text-blue-800' :
                          (log as any).type === 'social' ? 'bg-green-100 text-green-800' :
                            (log as any).type === 'progression' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {(log as any).type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(log as any).timestamp}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(log as any).action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {(log as any).entity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {(log as any).details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {(log as any).user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(log as any).timestamp}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <FaInfoCircle className="text-blue-400 mt-1" size={20} />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Log Retention Policy</h3>
            <p className="text-sm text-blue-600 mt-1">
              {activeTab === 'activity'
                ? 'Activity logs are retained for 90 days for analytics and support purposes.'
                : 'Audit logs are permanently stored for compliance and security monitoring.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};