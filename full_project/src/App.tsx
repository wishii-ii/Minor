import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { Habits } from './pages/Habits';
import { Progress } from './pages/Progress';
import { Achievements } from './pages/Achievements';
import { Quests } from './pages/Quests';
import { Teams } from './pages/Teams';
import { Leaderboards } from './pages/Leaderboards';
import { Messages } from './pages/Messages';
import { Notifications } from './pages/Notifications';
import { Rewards } from './pages/Rewards';
import { Settings } from './pages/Settings';
import { AdminLogs } from './pages/AdminLogs';
import { Friends } from './pages/Friends';
import { Profile } from './pages/Profile';
import { TestLab } from './pages/TestLab';
import { Home } from './pages/Home';
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAuth = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'home') {
      return <Home onAuth={handleAuth} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home onAuth={handleAuth} />;
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <Habits />;
      case 'progress':
        return <Progress />;
      case 'achievements':
        return <Achievements />;
      case 'quests':
        return <Quests />;
      case 'teams':
        return <Teams />;
      case 'leaderboards':
        return <Leaderboards />;
      case 'messages':
        return <Messages />;
      case 'notifications':
        return <Notifications />;
      case 'rewards':
        return <Rewards />;
      case 'settings':
        return <Settings />;
      case 'admin':
        return <AdminLogs />;
      case 'friends':
        return <Friends />;
      case 'profile':
        return <Profile />;
      case 'test-lab':
        return <TestLab />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <UserProvider>
      <DataProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
          {isAuthenticated && (
            <>
              {!isMobile && (
                <Sidebar 
                  currentPage={currentPage} 
                  onPageChange={setCurrentPage} 
                />
              )}
              {isMobile && (
                <MobileNav 
                  currentPage={currentPage} 
                  onPageChange={setCurrentPage} 
                />
              )}
            </>
          )}
          
          <main className={`${isAuthenticated && !isMobile ? 'ml-64' : ''} ${isAuthenticated && isMobile ? 'pb-20' : ''} transition-all duration-200`}>
            {renderPage()}
          </main>
        </div>
      </DataProvider>
    </UserProvider>
  );
}

export default App;