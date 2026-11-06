import React from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, Eye, XCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const configs = {
    Pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Pending Review',
    },
    'Under Review': {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      dot: 'bg-sky-500',
      label: 'Under Scrutiny',
    },
    Assigned: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      dot: 'bg-blue-600',
      label: 'Cell Allocated',
    },
    'In Progress': {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      dot: 'bg-indigo-600',
      label: 'Action Underway',
    },
    Resolved: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600',
      label: 'Redressed / Closed',
    },
    Rejected: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-600',
      label: 'Inadmissible / Closed',
    },
  };

  const config = configs[status] || {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
    label: status,
  };

  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md whitespace-nowrap ${
        isXs ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
}
