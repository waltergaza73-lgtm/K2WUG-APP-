import React, { useState } from 'react';
import { PageName } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface ContactViewProps {
  onNavigate: (page: PageName) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Service Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(data.message);
        setFormData({ name: '', email: '', subject: 'Service Inquiry', message: '' });
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setErrorMsg('Server error submitting contact inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase">
          K2WUG Support & Regional Offices
        </span>
        <h1 className="text-3xl font-black text-white">We’re Here to Help You Succeed</h1>
        <p className="text-xs sm:text-sm text-slate-300">Have questions about service listings, job applications, or wallet transfers? Get in touch with our team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Send Us a Direct Message</h2>

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                <input
                  id="contact-name-input"
                  type="text"
                  placeholder="e.g. Kiprono Cheruiyot"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  id="contact-email-input"
                  type="email"
                  placeholder="you@domain.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject</label>
              <select
                id="contact-subject-select"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Service Inquiry">Service Listing Inquiry</option>
                <option value="Wallet Support">Wallet & Payment Support</option>
                <option value="Job Listing">Employer / Job Board Inquiry</option>
                <option value="Partnership">Regional Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Message *</label>
              <textarea
                id="contact-message-input"
                rows={5}
                placeholder="How can our regional team assist you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              id="contact-submit-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> {loading ? 'Sending Inquiry...' : 'Submit Message'}
            </button>
          </form>
        </div>

        {/* Support Offices Info Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">East Africa Regional Offices</h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-amber-400">Nairobi Hub (Kenya)</p>
                <p className="text-slate-400">K2W Plaza, Westlands Avenue</p>
                <p className="text-slate-400">+254 712 345 678</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-amber-400">Kampala Hub (Uganda)</p>
                <p className="text-slate-400">Innovation Towers, Nakasero Road</p>
                <p className="text-slate-400">+256 772 987 654</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-amber-400">Eldoret Tech Center</p>
                <p className="text-slate-400">Kipchoge Complex, Eldoret</p>
                <p className="text-slate-400">+254 720 000 111</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <HelpCircle className="w-5 h-5" /> Quick FAQ
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">How fast are wallet deposits?</p>
              <p className="text-slate-400">Mobile Money (M-Pesa / MTN) deposits reflect instantly in your K2WUG wallet balance.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
