import React, { useState, useEffect } from 'react';
import { PageName, ServiceItem, JobItem, MarketplaceItem, PlatformStats } from '../types';
import { 
  Search, 
  Wrench, 
  Briefcase, 
  ShoppingBag, 
  Wallet, 
  Users, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Clock,
  Cpu,
  Zap,
  Sparkles
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: PageName) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 450,
    activeServices: 12,
    openJobs: 8,
    marketplaceItems: 15,
    processedTransactions: 1200
  });

  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [latestJobs, setLatestJobs] = useState<JobItem[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch stats
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((e) => console.error('Error fetching stats:', e));

    // Fetch top services
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => setFeaturedServices(data.slice(0, 3)))
      .catch((e) => console.error('Error fetching services:', e));

    // Fetch top jobs
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => setLatestJobs(data.slice(0, 3)))
      .catch((e) => console.error('Error fetching jobs:', e));

    // Fetch top marketplace items
    fetch('/api/marketplace')
      .then((r) => r.json())
      .then((data) => setMarketplaceItems(data.slice(0, 3)))
      .catch((e) => console.error('Error fetching marketplace:', e));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('services');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800 text-white pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-slate-900 to-slate-950 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Integrated MongoDB & Digital Wallet Hub
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              East Africa’s Unified Platform for <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Services, Jobs & Trade</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              K2WUG connects individuals, verified professionals, and regional enterprises. Hire skilled experts, apply for career openings, trade tech gear, and pay seamlessly using our digital wallet.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="home-search-input"
                  type="text"
                  placeholder="Search web dev, solar, laptops, software jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 text-sm shadow-inner"
                />
              </div>
              <button
                id="home-search-btn"
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Find Now
              </button>
            </form>

            {/* Core Action Chips */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-300">
              <button onClick={() => onNavigate('machines')} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-sm">
                <Cpu className="w-3.5 h-3.5" /> Rent SK Machine ($20/7d)
              </button>
              <button onClick={() => onNavigate('services')} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-400 transition-colors flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-indigo-400" /> Browse Services
              </button>
              <button onClick={() => onNavigate('jobs')} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-400 transition-colors flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Find Jobs
              </button>
              <button onClick={() => onNavigate('marketplace')} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-400 transition-colors flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" /> Trade Items
              </button>
              <button onClick={() => onNavigate('wallet')} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-400 transition-colors flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-indigo-400" /> Wallet Transfer
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats.totalUsers}+</p>
              <p className="text-xs text-slate-400 font-medium">Registered Members</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">$3.50/day</p>
              <p className="text-xs text-slate-400 font-medium">$20 for 7 Days Yield</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats.openJobs}</p>
              <p className="text-xs text-slate-400 font-medium">Open Jobs</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">${stats.processedTransactions}</p>
              <p className="text-xs text-slate-400 font-medium">Wallet Volume</p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED SK BUYING MACHINE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-8 shadow-2xl">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Featured SK Buying Machine Plan
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                SK Starter Machine 1.0 <br />
                <span className="text-indigo-400 font-extrabold">$20 Price for 7 Days ($3.50/day profit)</span>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Rent our flagship SK buying machine for $20. Earn $3.50 daily yield collected directly into your digital wallet, returning a total of $24.50 in 7 days (122.5% ROI)!
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guaranteed Daily Returns
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Wallet Payouts
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Automated Mining
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl w-full lg:w-80 space-y-4 shadow-xl">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SK Starter Model</span>
                <div className="text-3xl font-black text-white">$20.00 <span className="text-xs text-indigo-400 font-semibold">/ 7 Days</span></div>
              </div>

              <div className="space-y-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Profit:</span>
                  <span className="font-mono font-bold text-emerald-400">$3.50 / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Return:</span>
                  <span className="font-mono font-bold text-emerald-400">$24.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-mono font-bold text-indigo-300">7 Days</span>
                </div>
              </div>

              <button
                id="home-buy-20-machine-btn"
                onClick={() => onNavigate('machines')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" /> Rent Machine ($20 / 7d)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Top Service Listings</h2>
            <p className="text-xs text-slate-400 mt-1">Hire verified regional professionals with ratings & reviews</p>
          </div>
          <button
            id="view-all-services-btn"
            onClick={() => onNavigate('services')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Explore All Services <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((srv) => (
            <div key={srv.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm">
              <div>
                <div className="h-44 relative overflow-hidden bg-slate-800">
                  <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-semibold text-indigo-400">
                    {srv.category}
                  </div>
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {srv.location}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400" /> {srv.providerRating}</span>
                  </div>

                  <h3 className="font-bold text-base text-white line-clamp-1">{srv.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{srv.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Price Rate</p>
                  <p className="text-lg font-black text-white">${srv.price} <span className="text-xs font-normal text-slate-400">/{srv.priceUnit}</span></p>
                </div>
                <button
                  id={`home-book-service-${srv.id}`}
                  onClick={() => onNavigate('services')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Job Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Job Openings</h2>
            <p className="text-xs text-slate-400 mt-1">Full-time, contract, and remote positions across East Africa</p>
          </div>
          <button
            id="view-all-jobs-btn"
            onClick={() => onNavigate('jobs')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Browse All Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {latestJobs.map((job) => (
            <div key={job.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-all shadow-sm">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-indigo-400">
                    {job.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{job.company}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {job.salaryRange}</span>
                </div>
              </div>

              <button
                id={`home-apply-job-${job.id}`}
                onClick={() => onNavigate('jobs')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-semibold text-xs border border-slate-700 transition-all whitespace-nowrap"
              >
                View & Apply
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Marketplace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Marketplace Tech & Gear</h2>
            <p className="text-xs text-slate-400 mt-1">Buy and sell equipment safely using K2WUG wallet balance</p>
          </div>
          <button
            id="view-all-marketplace-btn"
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Visit Marketplace <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketplaceItems.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all shadow-sm">
              <div className="h-44 bg-slate-800 relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-white border border-slate-700">
                  {item.condition}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base text-white line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-lg font-black text-indigo-400">${item.price}</span>
                  <button
                    id={`home-buy-item-${item.id}`}
                    onClick={() => onNavigate('marketplace')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose K2WUG Platform */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-md">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Built for Regional Scale</h2>
            <p className="text-sm text-slate-400 mt-2">Connecting local talent and businesses with modern digital tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <CheckCircle2 className="w-8 h-8 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Verified Talent</h3>
              <p className="text-xs text-slate-400">All service providers undergo profile checks to ensure reliability and standard quality.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Digital Wallet Escrow</h3>
              <p className="text-xs text-slate-400">Funds are safely managed until services are delivered and verified by both parties.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <TrendingUp className="w-8 h-8 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Cross-Border Hub</h3>
              <p className="text-xs text-slate-400">Transact effortlessly across Kenya, Uganda, and Rwanda with real-time conversion.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
