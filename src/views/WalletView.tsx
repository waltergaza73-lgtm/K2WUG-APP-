import React, { useState, useEffect } from 'react';
import { Transaction, PageName } from '../types';
import { useAuth } from '../context/AuthContext';
import { Wallet, ArrowUpRight, ArrowDownLeft, Send, PlusCircle, History, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface WalletViewProps {
  onNavigate: (page: PageName) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onNavigate }) => {
  const { user, refreshWallet } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');

  // Deposit modal
  const [depositOpen, setDepositOpen] = useState<boolean>(false);
  const [depositAmt, setDepositAmt] = useState<string>('100');
  const [depositMethod, setDepositMethod] = useState<string>('Mobile Money (M-Pesa / MTN)');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  // Withdraw modal
  const [withdrawOpen, setWithdrawOpen] = useState<boolean>(false);
  const [withdrawAmt, setWithdrawAmt] = useState<string>('50');
  const [withdrawDestination, setWithdrawDestination] = useState<string>('M-Pesa +254 712 345 678');
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  // Transfer modal
  const [transferOpen, setTransferOpen] = useState<boolean>(false);
  const [transferEmail, setTransferEmail] = useState<string>('amina@k2wug.org');
  const [transferAmt, setTransferAmt] = useState<string>('25');
  const [transferNote, setTransferNote] = useState<string>('Project milestone advance');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWalletInfo = async () => {
    setLoading(true);
    try {
      const uid = user ? user.id : 'usr_demo_101';
      const res = await fetch(`/api/wallet?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Error loading wallet info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
  }, [user]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsDepositing(true);

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          amount: Number(depositAmt),
          paymentMethod: depositMethod
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: `Successfully deposited $${Number(depositAmt).toFixed(2)} to your wallet!` });
        await refreshWallet();
        setDepositOpen(false);
        fetchWalletInfo();
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || 'Deposit failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error during deposit.' });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsWithdrawing(true);

    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          amount: Number(withdrawAmt),
          destination: withdrawDestination
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `Successfully withdrew $${Number(withdrawAmt).toFixed(2)} to ${withdrawDestination}` });
        await refreshWallet();
        setWithdrawOpen(false);
        fetchWalletInfo();
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || 'Withdrawal failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error during withdrawal.' });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsTransferring(true);

    try {
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user?.id,
          recipientEmail: transferEmail,
          amount: Number(transferAmt),
          note: transferNote
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: data.message });
        await refreshWallet();
        setTransferOpen(false);
        fetchWalletInfo();
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || 'Transfer failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error during transfer.' });
    } finally {
      setIsTransferring(false);
    }
  };

  const filteredTxs = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Wallet Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Wallet Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">K2WUG Digital Wallet</span>
                <p className="text-sm text-slate-300 font-medium">{user ? user.name : 'Guest Account'}</p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium">Available Balance</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-1">
              ${user ? user.walletBalance.toFixed(2) : '0.00'} <span className="text-sm font-semibold text-amber-400">USD</span>
            </h1>
          </div>

          {/* Wallet Actions */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
            <button
              id="wallet-deposit-btn"
              onClick={() => {
                if (!user) onNavigate('login');
                else setDepositOpen(true);
              }}
              className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Deposit
            </button>

            <button
              id="wallet-withdraw-btn"
              onClick={() => {
                if (!user) onNavigate('login');
                else setWithdrawOpen(true);
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-400" /> Withdraw
            </button>

            <button
              id="wallet-transfer-btn"
              onClick={() => {
                if (!user) onNavigate('login');
                else setTransferOpen(true);
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-400" /> P2P Send
            </button>
          </div>
        </div>

        {/* Wallet Overview Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" /> Regional Payment Methods
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              K2WUG supports instant top-ups and cashouts via M-Pesa (Kenya), MTN Mobile Money (Uganda), Airtel Money, and Visa/Mastercard.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Deposit Fee:</span>
              <span className="font-bold text-emerald-400">0.0% Free</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Instant P2P Transfer:</span>
              <span className="font-bold text-emerald-400">Zero Fee</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Cross-Border Conversion:</span>
              <span className="font-bold text-amber-400">Live FX Rate</span>
            </div>
          </div>
        </div>

      </div>

      {/* Alert Message */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Transaction History Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
            {['all', 'deposit', 'withdrawal', 'payment', 'transfer', 'earned'].map((t) => (
              <button
                key={t}
                id={`tx-filter-${t}`}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  filterType === t ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table/List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Fetching transactions...</div>
        ) : filteredTxs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No transactions found for this filter.</div>
        ) : (
          <div className="space-y-3">
            {filteredTxs.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div key={tx.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-800/80 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${
                      isPositive
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{tx.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {tx.recipientOrSender ? ` • ${tx.recipientOrSender}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-black font-mono ${isPositive ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {isPositive ? '+' : ''}${tx.amount.toFixed(2)}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-slate-500">{tx.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Deposit Modal */}
      {depositOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 relative">
            <button onClick={() => setDepositOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">Deposit Wallet Funds</h2>
              <p className="text-xs text-slate-400">Top up your wallet via Mobile Money or Bank Card.</p>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount ($ USD) *</label>
                <input
                  id="modal-deposit-amt"
                  type="number"
                  min="5"
                  value={depositAmt}
                  onChange={(e) => setDepositAmt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                <select
                  id="modal-deposit-method"
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Mobile Money (M-Pesa / MTN)">M-Pesa / MTN Mobile Money</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Visa / Mastercard">Credit / Debit Card</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDepositOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button
                  id="submit-deposit-btn"
                  type="submit"
                  disabled={isDepositing}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {isDepositing ? 'Processing...' : 'Confirm Top-Up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 relative">
            <button onClick={() => setWithdrawOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
              <p className="text-xs text-slate-400">Cash out to your local Mobile Money or Bank Account.</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Withdrawal Amount ($ USD) *</label>
                <input
                  id="modal-withdraw-amt"
                  type="number"
                  min="5"
                  max={user?.walletBalance}
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Destination Account *</label>
                <input
                  id="modal-withdraw-dest"
                  type="text"
                  placeholder="M-Pesa / MTN Phone Number or Bank A/C"
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setWithdrawOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button
                  id="submit-withdraw-btn"
                  type="submit"
                  disabled={isWithdrawing}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {isWithdrawing ? 'Processing...' : 'Process Cashout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 relative">
            <button onClick={() => setTransferOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">Peer-to-Peer Transfer</h2>
              <p className="text-xs text-slate-400">Send money instantly to any registered K2WUG member.</p>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recipient Email *</label>
                <input
                  id="modal-transfer-email"
                  type="email"
                  placeholder="e.g. amina@k2wug.org"
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount ($ USD) *</label>
                <input
                  id="modal-transfer-amt"
                  type="number"
                  min="1"
                  max={user?.walletBalance}
                  value={transferAmt}
                  onChange={(e) => setTransferAmt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Transfer Note</label>
                <input
                  id="modal-transfer-note"
                  type="text"
                  placeholder="Payment for design service"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setTransferOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button
                  id="submit-transfer-btn"
                  type="submit"
                  disabled={isTransferring}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> {isTransferring ? 'Sending...' : 'Send Funds'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
