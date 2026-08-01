import React from 'react';
import { PageName } from '../types';
import { Globe, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageName) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                K2
              </div>
              <span className="font-bold text-xl text-white">
                K2WUG<span className="text-indigo-400">.app</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier East African digital platform unifying verified service providers, job opportunities, regional marketplace commerce, and instant wallet transactions across Kenya, Uganda, and Rwanda.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 w-fit">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Powered by MongoDB & REST API Backend
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Core Modules</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-indigo-400 transition-colors">Home Page</button></li>
              <li><button onClick={() => onNavigate('machines')} className="hover:text-indigo-400 transition-colors text-indigo-300 font-semibold flex items-center gap-1">SK Machines ($20/7d)</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-indigo-400 transition-colors">Service Directory</button></li>
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-indigo-400 transition-colors">Job Portal</button></li>
              <li><button onClick={() => onNavigate('marketplace')} className="hover:text-indigo-400 transition-colors">Trade Marketplace</button></li>
              <li><button onClick={() => onNavigate('wallet')} className="hover:text-indigo-400 transition-colors">Digital Wallet</button></li>
            </ul>
          </div>

          {/* Account & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Account & Info</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('about')} className="hover:text-indigo-400 transition-colors">About K2WUG</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-400 transition-colors">User Dashboard</button></li>
              <li><button onClick={() => onNavigate('profile')} className="hover:text-indigo-400 transition-colors">Member Profile</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-indigo-400 transition-colors">Support & Contact</button></li>
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Regional Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Nairobi, Kenya</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Kampala, Uganda</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Kigali, Rwanda</li>
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> +254 700 K2WUG</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> support@k2wug.org</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} K2WUG Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Systems Operational
            </span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
