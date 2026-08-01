import React, { useState, useEffect } from 'react';
import { BuyingMachine, UserActiveMachine, PageName } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Cpu, 
  Zap, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Wallet, 
  Play, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw,
  Server
} from 'lucide-react';

interface MachinesViewProps {
  onNavigate: (page: PageName) => void;
}

export const MachinesView: React.FC<MachinesViewProps> = ({ onNavigate }) => {
  const { user, updateUser, refreshWallet } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_machines' | 'calculator'>('catalog');
  const [machines, setMachines] = useState<BuyingMachine[]>([]);
  const [userActiveMachines, setUserActiveMachines] = useState<UserActiveMachine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Calculator State
  const [calcPrice, setCalcPrice] = useState<number>(20);
  const [calcDays, setCalcDays] = useState<number>(7);

  // Quick Wallet Topup Modal
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(20);

  useEffect(() => {
    fetchCatalog();
    if (user) {
      fetchUserActiveMachines();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/machines');
      if (res.ok) {
        const data = await res.json();
        setMachines(data.machines || []);
      }
    } catch (err) {
      console.error('Error fetching SK machines:', err);
    }
  };

  const fetchUserActiveMachines = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/machines/active?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserActiveMachines(data.activeMachines || []);
      }
    } catch (err) {
      console.error('Error fetching active machines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyMachine = async (machine: BuyingMachine) => {
    setFeedback(null);
    if (!user) {
      onNavigate('login');
      return;
    }

    if (user.walletBalance < machine.price) {
      setFeedback({
        type: 'error',
        message: `Insufficient wallet balance ($${user.walletBalance.toFixed(2)}). You need $${machine.price.toFixed(2)} to buy ${machine.name}. Please recharge your wallet.`
      });
      setTopupAmount(machine.price - user.walletBalance > 0 ? Math.ceil(machine.price - user.walletBalance) : 20);
      setTopupModalOpen(true);
      return;
    }

    setBuyingId(machine.id);
    try {
      const res = await fetch('/api/machines/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          machineId: machine.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: data.message || `Successfully purchased ${machine.name}!`
        });
        updateUser({ walletBalance: data.walletBalance });
        await fetchUserActiveMachines();
        setActiveTab('my_machines');
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to purchase machine plan.'
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error processing purchase.' });
    } finally {
      setBuyingId(null);
    }
  };

  const handleClaimProfit = async (activeMachine: UserActiveMachine) => {
    if (!user) return;
    setClaimingId(activeMachine.id);
    setFeedback(null);

    try {
      const res = await fetch('/api/machines/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          activeMachineId: activeMachine.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: 'success',
          message: data.message || `Claimed $${activeMachine.dailyIncome.toFixed(2)} daily profit!`
        });
        updateUser({ walletBalance: data.walletBalance });
        await fetchUserActiveMachines();
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to claim daily profit.'
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error communicating with server.' });
    } finally {
      setClaimingId(null);
    }
  };

  const handleQuickTopup = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: topupAmount,
          method: 'M-Pesa / Mobile Money Instant'
        })
      });

      if (res.ok) {
        const data = await res.json();
        updateUser({ walletBalance: data.walletBalance });
        setFeedback({
          type: 'success',
          message: `Successfully recharged $${topupAmount.toFixed(2)} to your digital wallet!`
        });
        setTopupModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Featured $20 Machine Plan
  const featured20Machine = machines.find((m) => m.price === 20) || machines[0];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800 text-white pt-12 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900 to-slate-950 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
                <Cpu className="w-4 h-4 text-indigo-400" /> SK Buying Machine & Power Yield Engine
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                SK Buying Machines <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  $20 for 7 Days ($3.50/day)
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Rent high-yield SK digital machines with daily automated payouts directly into your digital wallet. Start today with the $20 starter plan and receive guaranteed daily profits!
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  id="hero-rent-20-btn"
                  onClick={() => {
                    if (featured20Machine) handleBuyMachine(featured20Machine);
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" /> Rent $20 Machine (7 Days)
                </button>

                <button
                  id="hero-my-machines-btn"
                  onClick={() => setActiveTab('my_machines')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <Server className="w-4 h-4 text-indigo-400" /> My Active Machines ({userActiveMachines.length})
                </button>
              </div>
            </div>

            {/* Live Network Stats Box */}
            <div className="w-full md:w-80 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Network Status
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">ONLINE</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total SK Nodes Active:</span>
                  <span className="text-white font-mono font-bold">2,480 Units</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Network Hashrate:</span>
                  <span className="text-indigo-400 font-mono font-bold">18.5 TH/s</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">24h Paid Yields:</span>
                  <span className="text-emerald-400 font-mono font-bold">$18,450.00</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">User Wallet Balance:</span>
                  <span className="text-indigo-300 font-mono font-bold">${user ? user.walletBalance.toFixed(2) : '0.00'}</span>
                </div>
              </div>

              {user && (
                <button
                  onClick={() => {
                    setTopupAmount(20);
                    setTopupModalOpen(true);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-400 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" /> Recharge Balance ($20+)
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Global Feedback Alert */}
        {feedback && (
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs text-slate-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Featured $20 Machine Plan Highlight Banner */}
        {featured20Machine && (
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-2xl">
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Featured SK Starter Deal
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-indigo-400" /> {featured20Machine.name}
                </h3>
                <p className="text-sm text-slate-300 max-w-xl">
                  {featured20Machine.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
                  <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-indigo-400">
                    Price: <strong>${featured20Machine.price}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-indigo-400">
                    Duration: <strong>{featured20Machine.durationDays} Days</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-emerald-400">
                    Daily Profit: <strong>${featured20Machine.dailyIncome.toFixed(2)}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700 text-emerald-400">
                    Total Return: <strong>${featured20Machine.totalReturn.toFixed(2)}</strong> ({featured20Machine.roiPercentage}% ROI)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  id="buy-featured-20-btn"
                  onClick={() => handleBuyMachine(featured20Machine)}
                  disabled={buyingId === featured20Machine.id}
                  className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {buyingId === featured20Machine.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 fill-white" />
                  )}
                  Rent $20 Plan Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            id="tab-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" /> Machine Plans Catalog
          </button>

          <button
            id="tab-my-machines"
            onClick={() => setActiveTab('my_machines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my_machines'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server className="w-4 h-4" /> My Active SK Machines ({userActiveMachines.length})
          </button>

          <button
            id="tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" /> Profit Calculator
          </button>
        </div>

        {/* TAB 1: MACHINE PLANS CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">SK Buying Machine Catalog</h2>
                <p className="text-xs text-slate-400">Choose a plan duration and daily yield model that suits your investment target.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {machines.map((mac) => {
                const isFeatured20 = mac.price === 20;
                return (
                  <div 
                    key={mac.id} 
                    className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-slate-700 shadow-sm ${
                      isFeatured20 ? 'border-indigo-500/60 ring-1 ring-indigo-500/30' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      {/* Image header with tag */}
                      <div className="h-40 bg-slate-800 relative overflow-hidden">
                        <img 
                          src={mac.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'} 
                          alt={mac.name}
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          {mac.tag}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-2xl font-black text-white">${mac.price.toFixed(2)}</span>
                          <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                            {mac.durationDays} Days Duration
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg text-white">{mac.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{mac.description}</p>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          <div>
                            <span className="text-[11px] text-slate-400 block">Daily Profit</span>
                            <span className="font-mono font-bold text-emerald-400 text-sm">${mac.dailyIncome.toFixed(2)} / day</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block">Total Return</span>
                            <span className="font-mono font-bold text-emerald-400 text-sm">${mac.totalReturn.toFixed(2)}</span>
                          </div>
                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-[11px] text-slate-400 block">ROI Return</span>
                            <span className="font-mono font-bold text-indigo-400">{mac.roiPercentage}%</span>
                          </div>
                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-[11px] text-slate-400 block">Mining Speed</span>
                            <span className="font-mono font-bold text-slate-200">{mac.hashRate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-5 pt-0">
                      <button
                        id={`buy-machine-btn-${mac.id}`}
                        onClick={() => handleBuyMachine(mac)}
                        disabled={buyingId === mac.id}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                          isFeatured20 
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                        }`}
                      >
                        {buyingId === mac.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 fill-current" />
                        )}
                        Rent Plan for ${mac.price}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MY ACTIVE MACHINES */}
        {activeTab === 'my_machines' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">My Active SK Machines</h2>
                <p className="text-xs text-slate-400">Track your running machines and collect your daily yield every 24 hours.</p>
              </div>
              
              <button
                onClick={fetchUserActiveMachines}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
              </button>
            </div>

            {userActiveMachines.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                  <Server className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No Active SK Machines</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    You haven’t rented any SK machine plans yet. Start with the $20 for 7 days starter plan to begin earning daily profits immediately.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Browse SK Machines ($20/7 Days)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userActiveMachines.map((act) => {
                  const progressPct = Math.min(100, Math.round((act.daysCompleted / act.durationDays) * 100));
                  return (
                    <div key={act.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            <h3 className="font-bold text-base text-white">{act.machineName}</h3>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-1">
                            Activated: {new Date(act.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          act.status === 'active' 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {act.status}
                        </span>
                      </div>

                      {/* Machine Progress Engine */}
                      <div className="space-y-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-400">Runtime Progress</span>
                          <span className="text-indigo-400 font-mono">Day {act.daysCompleted} of {act.durationDays} ({progressPct}%)</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-400">Earned So Far: <strong className="text-emerald-400">${act.totalEarnedSoFar.toFixed(2)}</strong></span>
                          <span className="text-slate-400">Daily Profit: <strong className="text-indigo-300">${act.dailyIncome.toFixed(2)}</strong></span>
                        </div>
                      </div>

                      {/* Claim Action */}
                      <div className="pt-1 flex items-center justify-between gap-4">
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          <span>Payout schedule: Every 24 hours</span>
                        </div>

                        <button
                          id={`claim-btn-${act.id}`}
                          onClick={() => handleClaimProfit(act)}
                          disabled={claimingId === act.id || act.status === 'completed'}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                            act.status === 'completed'
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          }`}
                        >
                          {claimingId === act.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <DollarSign className="w-4 h-4" />
                          )}
                          {act.status === 'completed' ? 'Plan Completed' : `Collect Today's $${act.dailyIncome.toFixed(2)}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFIT CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" /> SK Machine Yield & ROI Calculator
              </h2>
              <p className="text-xs text-slate-400">Simulate expected profits across different rental costs and plan durations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Select Investment Amount: <strong className="text-indigo-400">${calcPrice}</strong>
                  </label>
                  <div className="flex gap-2">
                    {[20, 50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setCalcPrice(amt);
                          if (amt === 20) setCalcDays(7);
                          else if (amt === 50) setCalcDays(15);
                          else if (amt === 100) setCalcDays(30);
                          else if (amt === 250) setCalcDays(45);
                          else if (amt === 500) setCalcDays(60);
                        }}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                          calcPrice === amt
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Plan Duration: <strong className="text-indigo-400">{calcDays} Days</strong>
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="60"
                    step="1"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculator Outcome Box */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected Returns Summary</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Daily Earnings</span>
                    <span className="text-xl font-mono font-bold text-emerald-400">
                      ${(calcPrice === 20 ? 3.5 : (calcPrice * 0.15) / (calcDays / 7)).toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Total Profit Return</span>
                    <span className="text-xl font-mono font-bold text-indigo-400">
                      ${(calcPrice + (calcPrice === 20 ? 4.5 : calcPrice * 0.4)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Machine Catalog <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* QUICK RECHARGE WALLET MODAL */}
      {topupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" /> Recharge Digital Wallet
              </h3>
              <button onClick={() => setTopupModalOpen(false)} className="text-xs text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Top up your balance instantly via M-Pesa, Mobile Money, or Bank Transfer to purchase SK Machine plans.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Recharge Amount ($)</label>
              <div className="flex gap-2 mb-3">
                {[20, 50, 100, 250].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTopupAmount(val)}
                    className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg border ${
                      topupAmount === val ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setTopupModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickTopup}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Topup (${topupAmount})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
