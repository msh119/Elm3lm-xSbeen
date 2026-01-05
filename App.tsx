
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'cart' | 'profile' | 'admin'>('home');
  const [menuFilter, setMenuFilter] = useState<string>('الكل');
  const [profileInitialTab, setProfileInitialTab] = useState<'orders' | 'wheel'>('orders');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleSeeAllMenu = (filter: string = 'الكل') => {
    setMenuFilter(filter);
    setActiveTab('menu');
  };

  const goToWheel = () => {
    setProfileInitialTab('wheel');
    setActiveTab('profile');
  };

  const handleAdminAccess = () => {
    setActiveTab('admin');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home onSeeAllMenu={handleSeeAllMenu} onGoToWheel={goToWheel} onAdminAccess={handleAdminAccess} />;
      case 'menu': return <Menu initialFilter={menuFilter} />;
      case 'cart': return <Cart />;
      case 'profile': return <Profile initialTab={profileInitialTab} />;
      case 'admin': return <Admin />;
      default: return <Home onSeeAllMenu={handleSeeAllMenu} onGoToWheel={goToWheel} onAdminAccess={handleAdminAccess} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onAdminClick={handleAdminAccess}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
