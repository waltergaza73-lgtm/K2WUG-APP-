import React, { useState } from 'react';
import { PageName } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Info, 
  Briefcase, 
  ShoppingBag, 
  Wallet, 
  LayoutDashboard, 
  User as UserIcon, 
  Mail, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  Wrench,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { page: PageName; label: string; icon: React.ReactNode; isHot?: boolean }[] = [
    { page: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { page: 'machines', label: 'SK Machines', icon: <Cpu className="w-4 h-4 text-indigo-400" />, isHot: true },
    { page: 'services', label: 'Services', icon: <Wrench className="w-4 h-4" /> },
    { page: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { page: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { page: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
    { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { page: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <button 
            id="nav-logo-btn"
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-indigo-500 transition-colors">
              K2
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                K2WUG<span className="text-indigo-400 font-extrabold">.app</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase flex items-center gap-1 font-medium">
                <Globe className="w-2.5 h-2.5 text-indigo-400" /> East Africa Hub
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => onNavigate(item.page)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                    active
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.isHot && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-indigo-500 text-white leading-tight">
                      $20/7d
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Section / Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                {/* Wallet Balance Badge */}
                <button
                  id="nav-wallet-badge"
                  onClick={() => onNavigate('wallet')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-indigo-400 transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                  ${user.walletBalance.toFixed(2)}
                </button>

                {/* Profile Link */}
                <button
                  id="nav-profile-btn"
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border transition-all ${
                    currentPage === 'profile'
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'} 
                    alt={user.name} 
                    className="w-6 h-6 rounded-full object-cover border border-slate-600"
                  />
                  <span className="text-xs font-medium max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {/* Logout Button */}
                <button
                  id="nav-logout-btn"
                  onClick={() => {
                    logout();
                    onNavigate('home');
                  }}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('login')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === 'login'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" /> Login
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <button
                id="mobile-wallet-btn"
                onClick={() => onNavigate('wallet')}
                className="px-2 py-1 rounded bg-slate-800 text-amber-400 font-mono text-xs border border-slate-700"
              >
                ${user.walletBalance.toFixed(0)}
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              id={`mobile-nav-${item.page}`}
              onClick={() => {
                onNavigate(item.page);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPage === item.page
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  id="mobile-profile-btn"
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800"
                >
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  My Profile ({user.name})
                </button>
                <button
                  id="mobile-logout-btn"
                  onClick={() => {
                    logout();
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="mobile-login-btn"
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 text-center rounded-lg bg-slate-800 text-white font-semibold text-xs"
                >
                  Login
                </button>
                <button
                  id="mobile-register-btn"
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 text-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
