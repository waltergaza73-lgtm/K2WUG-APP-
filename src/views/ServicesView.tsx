import React, { useState, useEffect } from 'react';
import { ServiceItem, PageName } from '../types';
import { useAuth } from '../context/AuthContext';
import { Wrench, Plus, Search, Filter, Star, MapPin, CheckCircle2, X } from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (page: PageName) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Post Service Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  const [newService, setNewService] = useState({
    title: '',
    category: 'Technology & IT',
    price: '',
    priceUnit: 'fixed',
    location: '',
    description: '',
    tags: '',
    imageUrl: ''
  });

  const categories = [
    'All',
    'Technology & IT',
    'Design & Creative',
    'Engineering & Construction',
    'Marketing & Sales',
    'Consulting & Legal'
  ];

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = `/api/services?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const handlePostService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newService.title || !newService.description || !newService.price) {
      setFormError('Please fill in title, description, and price.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newService,
          price: Number(newService.price),
          providerId: user ? user.id : 'usr_demo_101',
          providerName: user ? user.name : 'K2WUG Provider',
          providerAvatar: user ? user.avatar : ''
        })
      });

      if (res.ok) {
        setFormSuccess('Service listed successfully!');
        setNewService({
          title: '',
          category: 'Technology & IT',
          price: '',
          priceUnit: 'fixed',
          location: '',
          description: '',
          tags: '',
          imageUrl: ''
        });
        setTimeout(() => {
          setModalOpen(false);
          setFormSuccess('');
          fetchServices();
        }, 1200);
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Failed to list service.');
      }
    } catch (err) {
      setFormError('Server error while posting service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5" /> Regional Service Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Find & Hire Expert Service Providers</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Browse verified talent across IT, solar installation, design, and marketing.</p>
        </div>

        <button
          id="post-service-btn"
          onClick={() => {
            if (!user) {
              onNavigate('login');
            } else {
              setModalOpen(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> List Your Service
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            id="service-search-input"
            type="text"
            placeholder="Search by title, keyword, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`service-cat-${cat.replace(/[^a-zA-Z0-9]/g, '')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading service listings...</div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
          <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No services found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or filter category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="h-48 relative overflow-hidden bg-slate-800">
                  <img src={srv.imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'} alt={srv.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-semibold text-amber-400">
                    {srv.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {srv.location}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400" /> {srv.providerRating}</span>
                  </div>

                  <h3 className="font-bold text-base text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{srv.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {srv.tags?.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Service Rate</p>
                  <p className="text-lg font-black text-white">${srv.price} <span className="text-xs font-normal text-slate-400">/{srv.priceUnit}</span></p>
                </div>
                <button
                  id={`book-service-${srv.id}`}
                  onClick={() => {
                    if (!user) {
                      onNavigate('login');
                    } else {
                      alert(`Inquiry sent to ${srv.providerName}! They will contact you shortly via K2WUG messaging.`);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              id="close-modal-btn"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">List Your Professional Service</h2>
              <p className="text-xs text-slate-400">Post your offering to thousands of clients across Kenya and Uganda.</p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {formSuccess}
              </div>
            )}

            <form onSubmit={handlePostService} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Title *</label>
                <input
                  id="modal-srv-title"
                  type="text"
                  placeholder="e.g. Full-Stack Web Development & API Integration"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    id="modal-srv-category"
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price Rate ($) *</label>
                  <input
                    id="modal-srv-price"
                    type="number"
                    placeholder="e.g. 50"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Billing Unit</label>
                  <select
                    id="modal-srv-unit"
                    value={newService.priceUnit}
                    onChange={(e) => setNewService({ ...newService, priceUnit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hr">Per Hour</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / Coverage</label>
                  <input
                    id="modal-srv-location"
                    type="text"
                    placeholder="e.g. Nairobi / Kampala / Remote"
                    value={newService.location}
                    onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Image URL (Optional)</label>
                <input
                  id="modal-srv-image"
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newService.imageUrl}
                  onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (Comma separated)</label>
                <input
                  id="modal-srv-tags"
                  type="text"
                  placeholder="Web Dev, React, Node.js"
                  value={newService.tags}
                  onChange={(e) => setNewService({ ...newService, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Description *</label>
                <textarea
                  id="modal-srv-desc"
                  rows={3}
                  placeholder="Describe your service scope, deliverables, and turnaround time..."
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  id="submit-service-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Service'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
