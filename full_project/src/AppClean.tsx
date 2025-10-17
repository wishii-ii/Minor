import { useEffect, useState } from 'react';
import './index.css';
import { UserProvider, useUser } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './pages/Dashboard';
import Habits from './pages/Habits';
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

function MainApp(): JSX.Element {
  const { user, signIn, signInWithAvatar } = useUser();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // When a user signs in, automatically navigate to dashboard
  useEffect(() => {
    if (user) {
      setCurrentPage('dashboard');
    }
  }, [user]);

  // handleAuth receives an optional avatar via window.__chosenAvatar set by Home
  const handleAuth = (_mode: 'signup' | 'login') => {
    const chosen = (window as any).__chosenAvatar as string | undefined;
    if (_mode === 'signup' && chosen && signInWithAvatar) {
      signInWithAvatar(chosen);
      return;
    }
    signIn();
  };

  const renderPage = () => {
    if (!user && currentPage !== 'home') return <Home onAuth={handleAuth} />;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {user ? (
        <>
          {!isMobile ? (
            <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          ) : (
            <MobileNav currentPage={currentPage} onPageChange={setCurrentPage} />
          )}
        </>
      ) : null}

      <main className={`${user && !isMobile ? 'ml-64' : ''} ${user && isMobile ? 'pb-20' : ''} transition-all duration-200`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function AppClean(): JSX.Element {
  return (
    <UserProvider>
      <DataProvider>
        <ErrorBoundary>
          <MainApp />
        </ErrorBoundary>
      </DataProvider>
    </UserProvider>
  );
}
