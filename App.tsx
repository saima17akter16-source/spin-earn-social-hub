import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { AuthModal } from './components/auth/AuthModal';
import { HeroBanner } from './components/home/HeroBanner';
import { AnnouncementsTicker } from './components/home/AnnouncementsTicker';
import { DailyRewardCard } from './components/home/DailyRewardCard';
import { Leaderboard } from './components/home/Leaderboard';
import { SocialTasksSection } from './components/home/SocialTasksSection';
import { SpinWheel } from './components/spin/SpinWheel';
import { RewardedAdPlayer } from './components/ads/RewardedAdPlayer';
import { WalletOverview } from './components/wallet/WalletOverview';
import { WithdrawModal } from './components/wallet/WithdrawModal';
import { DepositModal } from './components/wallet/DepositModal';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { MaintenanceScreen } from './components/common/MaintenanceScreen';
import { AdsterraNativeBanner } from './components/ads/AdsterraNativeBanner';
import { AdsterraBanner } from './components/ads/AdsterraBanner';
import { AdsterraSocialBar } from './components/ads/AdsterraSocialBar';

function MainAppContent() {
  const { userProfile, appSettings, loading, isAdmin } = useAuth();

  // Sync activeTab with URL pathname (/admin vs /)
  const getInitialTab = () => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      return 'admin';
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sync window location path on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'admin') {
        window.history.pushState({}, '', '/admin');
      } else if (window.location.pathname === '/admin') {
        window.history.pushState({}, '', '/');
      }
    }
  };

  // Listen to popstate (back/forward navigation)
  React.useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // If loading user state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
        <p className="font-bold text-sm tracking-wider uppercase text-amber-400">
          Loading Spin & Earn Social Hub...
        </p>
      </div>
    );
  }

  // Maintenance mode check
  if (appSettings.maintenanceMode && !isAdmin) {
    return <MaintenanceScreen />;
  }

  const handleOpenWithdraw = () => {
    if (!userProfile) {
      setAuthModalOpen(true);
      return;
    }
    setWithdrawModalOpen(true);
  };

  const handleOpenDeposit = () => {
    if (!userProfile) {
      setAuthModalOpen(true);
      return;
    }
    setDepositModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-20 md:pb-8 flex flex-col">
      
      {/* Adsterra Social Bar Safe Dynamic Loader */}
      <AdsterraSocialBar />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadCount={0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Announcements Ticker Banner */}
            <AnnouncementsTicker />

            {/* Hero Main Banner */}
            <HeroBanner
              onNavigate={handleTabChange}
              onOpenWithdraw={handleOpenWithdraw}
              onOpenDeposit={handleOpenDeposit}
            />

            {/* Daily Streak Reward */}
            <DailyRewardCard />

            {/* Social Tasks & Promotions */}
            <SocialTasksSection />

            {/* Top Earners Leaderboard */}
            <Leaderboard />

            {/* Adsterra Native Banner */}
            <AdsterraNativeBanner locationLabel="Home Screen" />

            {/* Adsterra 468x60 Banner */}
            <AdsterraBanner locationLabel="Home Screen" />
          </div>
        )}

        {/* SPIN WHEEL VIEW */}
        {activeTab === 'spin' && (
          <div className="animate-fade-in">
            <SpinWheel onOpenAuth={() => setAuthModalOpen(true)} />
          </div>
        )}

        {/* WATCH ADS VIEW */}
        {activeTab === 'ads' && (
          <div className="animate-fade-in">
            <RewardedAdPlayer onOpenAuth={() => setAuthModalOpen(true)} />
          </div>
        )}

        {/* SOCIAL TASKS VIEW */}
        {activeTab === 'tasks' && (
          <div className="animate-fade-in">
            <SocialTasksSection />
          </div>
        )}

        {/* WALLET VIEW */}
        {activeTab === 'wallet' && (
          <div className="animate-fade-in">
            <WalletOverview
              onOpenWithdraw={handleOpenWithdraw}
              onOpenDeposit={handleOpenDeposit}
            />
          </div>
        )}

        {/* PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in">
            {userProfile ? (
              <ProfileView />
            ) : (
              <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
                <p className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                  Please log in to manage your profile
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-extrabold text-sm shadow-lg shadow-amber-500/30"
                >
                  Log In / Sign Up
                </button>
              </div>
            )}
          </div>
        )}

        {/* ADMIN PANEL VIEW */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <AdminDashboard />
          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
      />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
