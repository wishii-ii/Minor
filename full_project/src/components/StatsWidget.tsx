import React from 'react';

interface StatsWidgetProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  subtitle?: string;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  icon,
  label,
  value,
  color,
  subtitle
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color} text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};