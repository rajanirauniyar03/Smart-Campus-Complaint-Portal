import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) {
  const variantStyles = {
    default: 'border-slate-200 bg-white',
    highlight: 'border-blue-200 bg-blue-50/30',
    urgent: 'border-red-200 bg-red-50/30',
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border shadow-xs transition hover:border-slate-300 ${
        variantStyles[variant] || variantStyles.default
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
