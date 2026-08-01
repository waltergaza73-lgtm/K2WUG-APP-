import React, { useState, useEffect } from 'react';
import { JobItem, PageName } from '../types';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Plus, Search, MapPin, Clock, DollarSign, CheckCircle2, X, Send } from 'lucide-react';

interface JobsViewProps {
  onNavigate: (page: PageName) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Apply Modal state
  const [applyJob, setApplyJob] = useState<JobItem | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [applySuccess, setApplySuccess] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // Post Job Modal state
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>('');
  const [postSuccess, setPostSuccess] = useState<string>('');

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    category: 'Software Engineering',
    type: 'Full-time',
    location: '',
    salaryRange: '',
    description: '',
    requirements: ''
  });

  const categories = ['All', 'Software Engineering', 'Logistics & Operations', 'Sales & Marketing', 'Finance & Accounting', 'Administrative'];
  const jobTypes = ['All', 'Full-time', 'Contract', 'Remote', 'Part-time'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const url = `/api/jobs?category=${encodeURIComponent(selectedCategory)}&type=${encodeURIComponent(selectedType)}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedType, searchQuery]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyJob) return;

    setIsApplying(true);
    try {
      const res = await fetch(`/api/jobs/${applyJob.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setApplySuccess('Application submitted successfully! The employer will review your profile.');
        setTimeout(() => {
          setApplyJob(null);
          setApplySuccess('');
          setCoverLetter('');
          fetchJobs();
        }, 1500);
      }
    } catch (err) {
      console.error('Apply error:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    setPostSuccess('');

    if (!newJob.title || !newJob.company || !newJob.description) {
      setPostError('Please provide title, company, and job description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newJob,
          employerId: user ? user.id : 'usr_demo_101'
        })
      });

      if (res.ok) {
        setPostSuccess('Job vacancy published successfully!');
        setNewJob({
          title: '',
          company: '',
          category: 'Software Engineering',
          type: 'Full-time',
          location: '',
          salaryRange: '',
          description: '',
          requirements: ''
        });
        setTimeout(() => {
          setPostModalOpen(false);
          setPostSuccess('');
          fetchJobs();
        }, 1200);
      } else {
        const errData = await res.json();
        setPostError(errData.error || 'Failed to post job.');
      }
    } catch (err) {
      setPostError('Server error while posting job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" /> East Africa Employment Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Regional Job & Career Opportunities</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Discover full-time, contract, and remote positions or recruit regional talent.</p>
        </div>

        <button
          id="post-job-btn"
          onClick={() => {
            if (!user) {
              onNavigate('login');
            } else {
              setPostModalOpen(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Post a Vacancy
        </button>
      </div>

      {/* Filter Controls */}
      <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="job-search-input"
              type="text"
              placeholder="Search job title, company, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Type:</span>
            {jobTypes.map((t) => (
              <button
                key={t}
                id={`job-type-${t.toLowerCase()}`}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  selectedType === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`job-cat-${cat.replace(/[^a-zA-Z0-9]/g, '')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                selectedCategory === cat ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Searching job vacancies...</div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No jobs match your criteria</h3>
          <p className="text-xs text-slate-400">Try clearing filters or searching for different keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400">
                      {job.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{job.company}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{job.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                </div>

                <button
                  id={`apply-job-btn-${job.id}`}
                  onClick={() => {
                    if (!user) {
                      onNavigate('login');
                    } else {
                      setApplyJob(job);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start md:self-center"
                >
                  Apply Now
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{job.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-amber-400" /> {job.salaryRange}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{job.applicationsCount} Applications Received</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applyJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 relative">
            <button onClick={() => setApplyJob(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-xs text-amber-400 font-semibold">{applyJob.company}</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{applyJob.title}</h2>
            </div>

            {applySuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {applySuccess}
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Applicant Name</label>
                  <input type="text" disabled value={user?.name} className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400" />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cover Note / Brief Pitch</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly explain why you are a great fit for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setApplyJob(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                    Cancel
                  </button>
                  <button
                    id="submit-job-apply-btn"
                    type="submit"
                    disabled={isApplying}
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> {isApplying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => setPostModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Post a New Job Opportunity</h2>
              <p className="text-xs text-slate-400">Reach skilled professionals across East Africa.</p>
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

            <form onSubmit={handlePostJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
                  <input
                    id="modal-job-title"
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                  <input
                    id="modal-job-company"
                    type="text"
                    placeholder="e.g. K2W Tech Ventures"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    id="modal-job-category"
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employment Type</label>
                  <select
                    id="modal-job-type"
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    id="modal-job-location"
                    type="text"
                    placeholder="Nairobi / Kampala / Hybrid"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Salary Range</label>
                  <input
                    id="modal-job-salary"
                    type="text"
                    placeholder="$1,500 - $2,500 / month"
                    value={newJob.salaryRange}
                    onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Description *</label>
                <textarea
                  id="modal-job-desc"
                  rows={4}
                  placeholder="Responsibilities, team context, and expectations..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setPostModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button
                  id="submit-job-post-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  {isSubmitting ? 'Posting...' : 'Post Vacancy'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
