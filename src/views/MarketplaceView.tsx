import React, { useState, useEffect } from 'react';
import { MarketplaceItem, PageName } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Plus, Search, Tag, MapPin, CheckCircle2, X, Wallet } from 'lucide-react';

interface MarketplaceViewProps {
  onNavigate: (page: PageName) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigate }) => {
  const { user, refreshWallet } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Post Item Modal state
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>('');
  const [postSuccess, setPostSuccess] = useState<string>('');

  // Purchase Modal state
  const [buyingItem, setBuyingItem] = useState<MarketplaceItem | null>(null);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [buyError, setBuyError] = useState<string>('');
  const [buySuccess, setBuySuccess] = useState<string>('');

  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Electronics & Computers',
    price: '',
    condition: 'Like New',
    description: '',
    imageUrl: ''
  });

  const categories = ['All', 'Electronics & Computers', 'Furniture & Office', 'Vehicles & Transport', 'Tools & Machinery', 'General Trade'];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = `/api/marketplace?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch marketplace items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, searchQuery]);

  const handlePostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    setPostSuccess('');

    if (!newItem.title || !newItem.price || !newItem.description) {
      setPostError('Title, price, and description are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          price: Number(newItem.price),
          sellerId: user ? user.id : 'usr_demo_101',
          sellerName: user ? user.name : 'K2WUG Seller',
          sellerLocation: user?.location || 'Nairobi, Kenya'
        })
      });

      if (res.ok) {
        setPostSuccess('Item listed on K2WUG Marketplace!');
        setNewItem({
          title: '',
          category: 'Electronics & Computers',
          price: '',
          condition: 'Like New',
          description: '',
          imageUrl: ''
        });
        setTimeout(() => {
          setPostModalOpen(false);
          setPostSuccess('');
          fetchItems();
        }, 1200);
      } else {
        const errData = await res.json();
        setPostError(errData.error || 'Failed to list item.');
      }
    } catch (err) {
      setPostError('Server error while listing item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyItem = async () => {
    if (!buyingItem || !user) return;
    setBuyError('');
    setBuySuccess('');

    if (user.walletBalance < buyingItem.price) {
      setBuyError(`Insufficient wallet balance ($${user.walletBalance.toFixed(2)}). Please deposit funds in your wallet first.`);
      return;
    }

    setIsBuying(true);
    try {
      const res = await fetch(`/api/marketplace/${buyingItem.id}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: user.id })
      });

      if (res.ok) {
        setBuySuccess('Item purchased! Payment deducted from your K2WUG wallet.');
        await refreshWallet();
        setTimeout(() => {
          setBuyingItem(null);
          setBuySuccess('');
          fetchItems();
        }, 1500);
      } else {
        const errData = await res.json();
        setBuyError(errData.error || 'Purchase failed.');
      }
    } catch (err) {
      setBuyError('Server error processing purchase.');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" /> Regional Trade & Equipment Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Buy & Sell Laptops, Office Gear & Tools</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Instant wallet checkout with escrow protection for buyers and sellers.</p>
        </div>

        <button
          id="sell-item-btn"
          onClick={() => {
            if (!user) {
              onNavigate('login');
            } else {
              setPostModalOpen(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Sell an Item
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            id="mkt-search-input"
            type="text"
            placeholder="Search MacBook, monitor, chair, solar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`mkt-cat-${cat.replace(/[^a-zA-Z0-9]/g, '')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                selectedCategory === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading marketplace items...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No items listed</h3>
          <p className="text-xs text-slate-400">Be the first to list a product in this category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="h-48 bg-slate-800 relative">
                  <img src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-white border border-slate-700">
                    {item.condition}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-amber-400" /> {item.category}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {item.sellerLocation}</span>
                  </div>

                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Price</p>
                  <p className="text-xl font-black text-amber-400">${item.price}</p>
                </div>

                <button
                  id={`buy-item-btn-${item.id}`}
                  onClick={() => {
                    if (!user) {
                      onNavigate('login');
                    } else {
                      setBuyingItem(item);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" /> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Modal */}
      {buyingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 relative">
            <button onClick={() => setBuyingItem(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-xs text-amber-400 font-semibold">Marketplace Purchase</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{buyingItem.title}</h2>
            </div>

            {buyError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                {buyError}
                <button onClick={() => onNavigate('wallet')} className="block mt-2 underline text-amber-400 font-bold">
                  Go to Wallet to Deposit Funds
                </button>
              </div>
            )}

            {buySuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {buySuccess}
              </div>
            )}

            <div className="bg-slate-800/80 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Item Price:</span>
                <span className="font-bold text-white">${buyingItem.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Wallet Balance:</span>
                <span className="font-bold text-amber-400">${user?.walletBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span>Balance After Purchase:</span>
                <span className="font-bold text-white">${((user?.walletBalance || 0) - buyingItem.price).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setBuyingItem(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                Cancel
              </button>
              <button
                id="confirm-buy-btn"
                onClick={handleBuyItem}
                disabled={isBuying}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                {isBuying ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => setPostModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">List Item on Marketplace</h2>
              <p className="text-xs text-slate-400">Sell tech equipment, laptops, and office goods.</p>
            </div>

            {postError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                {postError}
              </div>
            )}

            {postSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {postSuccess}
              </div>
            )}

            <form onSubmit={handlePostItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Title *</label>
                <input
                  id="modal-item-title"
                  type="text"
                  placeholder="e.g. MacBook Pro M2 14-inch"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    id="modal-item-category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($) *</label>
                  <input
                    id="modal-item-price"
                    type="number"
                    placeholder="e.g. 850"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Condition</label>
                  <select
                    id="modal-item-condition"
                    value={newItem.condition}
                    onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="New">New (Unopened)</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Image URL</label>
                  <input
                    id="modal-item-image"
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Description *</label>
                <textarea
                  id="modal-item-desc"
                  rows={3}
                  placeholder="Include specs, inclusions, warranty status..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setPostModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button
                  id="submit-item-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
