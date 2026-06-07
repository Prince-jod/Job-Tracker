import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  wishlist: { label: "Wishlist", bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-400" },
  applied: { label: "Applied", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
  interview: { label: "Interview", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  offer: { label: "Offer", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400" },
  rejected: { label: "Rejected", bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-400" },
};

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
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

  const color =
    AVATAR_COLORS[
      job.company.charCodeAt(0) % AVATAR_COLORS.length
    ];

  const dateStr = new Date(job.dateApplied).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-5">
      <h3 className="font-semibold">{job.position}</h3>

      <p>{job.company}</p>

      <StatusBadge status={job.status} />

      <p>{dateStr}</p>

      <div className="flex gap-2 mt-3">
        <Link to={`/edit-job/${job._id}`}>
          Edit
        </Link>

        <button onClick={() => onDelete(job._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;