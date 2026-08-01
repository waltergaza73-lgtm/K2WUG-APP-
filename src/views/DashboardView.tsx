import React from 'react';
import { PageName } from '../types';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wallet, Wrench, Briefcase, ShoppingBag, Plus, User, ArrowRight, ShieldCheck, CheckCircle2, Cpu, Zap } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (page: PageName) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <LayoutDashboard className="w-12 h-12 text-indigo-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Login Required</h2>
          <p className="text-xs text-slate-400">Please log in to access your personal dashboard and manage your SK machines, services, jobs, and wallet.</p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              id="dash-login-prompt-btn"
              onClick={() => onNavigate('login')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Log In Now
            </button>
            <button
              id="dash-register-prompt-btn"
              onClick={() => onNavigate('register')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              Register Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Welcome back, {user.name}!</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user.email} • {user.location || 'East Africa'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dash-go-machines-btn"
            onClick={() => onNavigate('machines')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Zap className="w-4 h-4 fill-white" /> Rent SK Machine ($20/7d)
          </button>
          <button
            id="dash-edit-profile-btn"
            onClick={() => onNavigate('profile')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4 text-indigo-400" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Wallet Balance</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">${user.walletBalance.toFixed(2)}</p>
          <button
            id="dash-go-wallet-btn"
            onClick={() => onNavigate('wallet')}
            className="text-[11px] text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            Manage Wallet <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">SK Buying Machines</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">$20 / 7 Days</p>
          <button
            id="dash-go-machines-link"
            onClick={() => onNavigate('machines')}
            className="text-[11px] text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            Collect Daily Profit <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Services Offered</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Wrench className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">2 Active</p>
          <button
            id="dash-go-services-btn"
            onClick={() => onNavigate('services')}
            className="text-[11px] text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            View Services <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Job Applications</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">4 Submitted</p>
          <button
            id="dash-go-jobs-btn"
            onClick={() => onNavigate('jobs')}
            className="text-[11px] text-amber-400 font-bold hover:underline flex items-center gap-1"
          >
            Browse Job Board <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Marketplace</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">1 Listed</p>
          <button
            id="dash-go-mkt-btn"
            onClick={() => onNavigate('marketplace')}
            className="text-[11px] text-amber-400 font-bold hover:underline flex items-center gap-1"
          >
            Visit Marketplace <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Quick Launch Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">Quick Management Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="dash-action-service-btn"
            onClick={() => onNavigate('services')}
            className="p-5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">List New Service</h3>
            <p className="text-xs text-slate-400">Offer your skills to regional clients.</p>
          </button>

          <button
            id="dash-action-job-btn"
            onClick={() => onNavigate('jobs')}
            className="p-5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Post Job Vacancy</h3>
            <p className="text-xs text-slate-400">Recruit talent for your business.</p>
          </button>

          <button
            id="dash-action-mkt-btn"
            onClick={() => onNavigate('marketplace')}
            className="p-5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Sell Tech Gear</h3>
            <p className="text-xs text-slate-400">Trade laptops and tools for cash.</p>
          </button>
        </div>
      </div>

      {/* Account Verification & Security Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Verified K2WUG Member Profile</h3>
          </div>
          <p className="text-xs text-slate-400">Your account is fully authenticated with JWT token sessions and protected database access.</p>
        </div>

        <button
          id="dash-contact-support-btn"
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all whitespace-nowrap"
        >
          Contact Regional Support
        </button>
      </div>

    </div>
  );
};
