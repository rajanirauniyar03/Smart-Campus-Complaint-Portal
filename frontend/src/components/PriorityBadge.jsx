import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function PriorityBadge({ priority, size = 'sm' }) {
  const configs = {
    Urgent: {
      bg: 'bg-red-50 text-red-800 border-red-200',
      dot: 'bg-red-600',
    },
    High: {
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      dot: 'bg-orange-500',
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    },
    Low: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500',
    },
  };

  const config = configs[priority] || configs['Medium'];
  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md whitespace-nowrap ${
        isXs ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{priority}</span>
    </span>
  );
}
