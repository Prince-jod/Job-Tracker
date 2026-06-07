import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import JobCard from "../components/JobCard";

const STATUS_CONFIG = {
  wishlist:  { label: "Wishlist",   bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-400" },
  applied:   { label: "Applied",    bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-400"   },
  interview: { label: "Interview",  bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-400"  },
  offer:     { label: "Offer",      bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-400" },
  rejected:  { label: "Rejected",   bg: "bg-rose-100",   text: "text-rose-700",   dot: "bg-rose-400"   },
};

const AVATAR_COLORS = [
  "bg-blue-500","bg-violet-500","bg-emerald-500",
  "bg-amber-500","bg-rose-500","bg-cyan-500",
];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.applied;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const JobCard = ({ job, onDelete }) => {
  const initials = job.company.slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[job.company.charCodeAt(0) % AVATAR_COLORS.length];
  const dateStr = new Date(job.dateApplied).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm leading-tight">{job.position}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Link to={`/edit-job/${job._id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </Link>
          <button onClick={() => onDelete(job._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={job.status} />
        {job.location && <span className="text-xs text-gray-400">📍 {job.location}</span>}
        <span className="ml-auto text-xs text-gray-400">{dateStr}</span>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, emoji, borderCls, labelCls, iconBgCls }) => (
  <div className={`bg-white border ${borderCls} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
    <div className={`w-12 h-12 rounded-xl ${iconBgCls} flex items-center justify-center text-2xl flex-shrink-0`}>
      {emoji}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className={`text-sm font-medium mt-1 ${labelCls}`}>{label}</p>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
    <div className="h-5 bg-gray-100 rounded w-1/3" />
  </div>
);


function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search.trim()) params.append("search", search.trim());
      const { data } = await API.get(`/jobs?${params}`);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchJobs, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, statusFilter, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const stats = {
    total:     jobs.length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer:     jobs.filter((j) => j.status === "offer").length,
    rejected:  jobs.filter((j) => j.status === "rejected").length,
  };

  const isFiltered = statusFilter !== "all" || search.trim() !== "";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">JobTrackr</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/analytics" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Analytics
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-rose-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage your job search</p>
          </div>
          <Link to="/add-job" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Add Job
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Applied"  value={stats.total}     emoji="📨" borderCls="border-blue-100"    iconBgCls="bg-blue-50"    labelCls="text-blue-600"    />
          <StatCard label="Interviews"     value={stats.interview} emoji="🎙️" borderCls="border-amber-100"   iconBgCls="bg-amber-50"   labelCls="text-amber-600"   />
          <StatCard label="Offers"         value={stats.offer}     emoji="🎉" borderCls="border-emerald-100" iconBgCls="bg-emerald-50" labelCls="text-emerald-600" />
          <StatCard label="Rejected"       value={stats.rejected}  emoji="❌" borderCls="border-rose-100"    iconBgCls="bg-rose-50"    labelCls="text-rose-600"    />
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search company or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder-gray-400 text-gray-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 min-w-[140px]"
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 min-w-[140px]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="a-z">Company A–Z</option>
            <option value="z-a">Company Z–A</option>
          </select>
        </div>

        {/* Job count */}
        {!loading && jobs.length > 0 && (
          <p className="text-sm text-gray-400 mb-4">
            {jobs.length} {jobs.length === 1 ? "application" : "applications"}
            {isFiltered ? " match your filters" : ""}
          </p>
        )}

        {/* Jobs */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">{isFiltered ? "🔍" : "📋"}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {isFiltered ? "No jobs match your filters" : "No applications yet"}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {isFiltered ? "Try adjusting your search or filter" : "Start tracking your job search journey"}
            </p>
            {!isFiltered && (
              <Link to="/add-job" className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                + Add your first job
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile FAB */}
      <Link
        to="/add-job"
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-300 text-white text-2xl font-light hover:bg-blue-700 active:scale-95 transition-all z-40"
      >
        +
      </Link>
    </div>
  );
}

export default Dashboard;
