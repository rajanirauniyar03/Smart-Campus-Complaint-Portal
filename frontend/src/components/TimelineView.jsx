import React from 'react';
import { formatDateTime } from '../utils/formatters';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  RefreshCw,
  XCircle,
  AlertCircle,
  Shield,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export default function TimelineView({ timeline = [] }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'In Progress':
        return <RefreshCw className="w-3.5 h-3.5 text-slate-700" />;
      case 'Assigned':
        return <UserCheck className="w-3.5 h-3.5 text-blue-700" />;
      case 'Under Review':
        return <AlertCircle className="w-3.5 h-3.5 text-sky-700" />;
      case 'Rejected':
        return <XCircle className="w-3.5 h-3.5 text-rose-700" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-amber-700" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-6">
        {timeline.map((event, idx) => {
          const isLast = idx === timeline.length - 1;
          return (
            <li key={event._id || idx}>
              <div className="relative pb-6">
                {!isLast && (
                  <span
                    className="absolute top-3.5 left-3.5 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <div className="h-7 w-7 bg-white rounded-full flex items-center justify-center ring-2 ring-slate-100 shadow-xs border border-slate-300">
                      {getStatusIcon(event.status)}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">
                          {event.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          by {event.updatedByName || 'System'} ({event.updatedByRole})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>

                    {event.note && (
                      <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-200 leading-relaxed font-sans">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
