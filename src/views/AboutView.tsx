import React from 'react';
import { PageName } from '../types';
import { Globe, Target, Award, Users, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: PageName) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          About K2WUG Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Empowering East Africa’s Next Generation Digital Economy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          K2WUG was founded to bridge the geographical and financial gap between service providers, job seekers, buyers, and regional merchants across Kenya, Uganda, and East Africa.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl w-fit">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            To provide an all-in-one digital ecosystem where individuals and businesses can list services, secure jobs, trade products, and transfer funds instantly using transparent, protected escrow wallet technology.
          </p>
          <ul className="space-y-2 text-xs text-slate-400 pt-2">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Transparent service directory</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Verified job matching</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Secure wallet transaction processing</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl w-fit">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            To become the premier cross-border platform connecting 100,000+ service providers, employers, and buyers across Kenya, Uganda, Rwanda, and Tanzania by 2028.
          </p>
          <ul className="space-y-2 text-xs text-slate-400 pt-2">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Regional cross-border trade</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Zero-friction mobile payments</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-400" /> Community skill building</li>
          </ul>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Why Community Trusts K2WUG</h2>
          <p className="text-xs text-slate-400 mt-1">Our core operational principles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
            <h3 className="font-bold text-white text-base">Security First</h3>
            <p className="text-xs text-slate-400">All data and user wallet balances are protected with encrypted authentication & JWT tokens.</p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <Award className="w-7 h-7 text-amber-400" />
            <h3 className="font-bold text-white text-base">Quality Assured</h3>
            <p className="text-xs text-slate-400">Service providers maintain transparent ratings and work portfolios for client peace of mind.</p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <Users className="w-7 h-7 text-amber-400" />
            <h3 className="font-bold text-white text-base">Inclusive Access</h3>
            <p className="text-xs text-slate-400">Built for both mobile money users and traditional banking clients across East Africa.</p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <HeartHandshake className="w-7 h-7 text-amber-400" />
            <h3 className="font-bold text-white text-base">Dedicated Support</h3>
            <p className="text-xs text-slate-400">Our regional hubs in Nairobi, Kampala, and Eldoret provide 24/7 assistance.</p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to expand your reach?</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-900">Create your account today and start offering services or posting jobs in under 2 minutes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="about-register-btn"
            onClick={() => onNavigate('register')}
            className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 transition-all cursor-pointer whitespace-nowrap"
          >
            Join K2WUG Now
          </button>
        </div>
      </div>

    </div>
  );
};
