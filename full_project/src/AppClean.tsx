import { useEffect, useState, useRef } from 'react';
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
// FIX: Changed import for Quests from named import ({ Quests }) to default import (Quests)
import Quests from './pages/Quests'; 
import { Teams } from './pages/Teams';
import Messages from './pages/Messages';
import { Notifications } from './pages/Notifications';
import { Rewards } from './pages/Rewards';
import { Settings } from './pages/Settings';
import { Friends } from './pages/Friends';
import {Profile} from './pages/Profile';
import { Home } from './pages/Home';
import Auth from './pages/Auth';

function MainApp(): React.ReactElement {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // When a user transitions from signed-out to signed-in, navigate to dashboard.
  // Previously this effect ran on any `user` change (including minor profile edits)
  // which caused navigation away from Settings when the user updated their name.
  const prevUserRef = useRef<typeof user | null>(null);
  useEffect(() => {
    const prev = prevUserRef.current;
    if (!prev && user) {
      // user just signed in
      setCurrentPage('dashboard');
    }
    prevUserRef.current = user;
  }, [user]);

  // Apply user's theme preference by toggling the 'dark' class on <html>
  useEffect(() => {
    const theme = user?.theme || 'light';
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user?.theme]);

  // handleAuth receives optional navigation to a dedicated Auth page
  const handleAuth = (_mode: 'signup' | 'login') => {
    setCurrentPage('auth-' + _mode);
  };

  const renderPage = () => {
    // If user is not signed in, redirect to Home for protected pages
    // but allow `auth-` routes (signup/login) to render.
    if (!user && currentPage !== 'home' && !currentPage.startsWith('auth-')) return <Home onAuth={handleAuth} />;

    switch (currentPage) {
      case 'home':
        return <Home onAuth={handleAuth} />;
      case 'auth-signup':
        return <Auth initialMode="signup" onBack={() => setCurrentPage('home')} />;
      case 'auth-login':
        return <Auth initialMode="login" onBack={() => setCurrentPage('home')} />;
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
      case 'messages':
        return <Messages />;
      case 'notifications':
        return <Notifications />;
      case 'rewards':
        return <Rewards />;
      case 'settings':
        return <Settings />;
      case 'friends':
        return <Friends />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Debug panel to help trace navigation and auth state during development */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md p-2 text-xs text-gray-700 shadow">
        <div className="font-semibold">Debug</div>
        <div>page: {currentPage}</div>
        <div>signed-in: {user ? 'yes' : 'no'}</div>
      </div>
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

export default function AppClean(): React.ReactElement {
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Global handlers to capture uncaught errors and promise rejections and show them in the UI
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (ev) => {
      try {
        setRuntimeError(String(ev.error || ev.message || 'Unknown runtime error'));
      } catch {
        // ignore
      }
    });
    window.addEventListener('unhandledrejection', (ev) => {
      try {
        setRuntimeError(String((ev as PromiseRejectionEvent).reason || 'Unhandled promise rejection'));
      } catch {
        // ignore
      }
    });
  }

  return (
    <UserProvider>
      <DataProvider>
        <ErrorBoundary>
          <MainApp />
        </ErrorBoundary>

        {runtimeError && (
          <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 text-red-900 p-4 rounded-lg shadow-lg z-50">
            <strong className="block font-semibold mb-2">Runtime error detected</strong>
            <pre className="text-sm whitespace-pre-wrap">{runtimeError}</pre>
          </div>
        )}
      </DataProvider>
    </UserProvider>
  );
}