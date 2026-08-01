import React, { useState } from 'react';
import { PageName } from './types';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { MachinesView } from './views/MachinesView';
import { ServicesView } from './views/ServicesView';
import { JobsView } from './views/JobsView';
import { MarketplaceView } from './views/MarketplaceView';
import { WalletView } from './views/WalletView';
import { DashboardView } from './views/DashboardView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ProfileView } from './views/ProfileView';
import { ContactView } from './views/ContactView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('home');

  const handleNavigate = (page: PageName) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      case 'machines':
        return <MachinesView onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesView onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobsView onNavigate={handleNavigate} />;
      case 'marketplace':
        return <MarketplaceView onNavigate={handleNavigate} />;
      case 'wallet':
        return <WalletView onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'login':
        return <LoginView onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterView onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileView onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactView onNavigate={handleNavigate} />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
        <div>
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
          <main className="min-h-[calc(100vh-16rem)]">
            {renderView()}
          </main>
        </div>
        <Footer onNavigate={handleNavigate} />
      </div>
    </AuthProvider>
  );
}
