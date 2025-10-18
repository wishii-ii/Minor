// components/BaseLayout.tsx
import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Make sure you're using export const (not export default)
export const BaseLayout: React.FC<BaseLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
};

