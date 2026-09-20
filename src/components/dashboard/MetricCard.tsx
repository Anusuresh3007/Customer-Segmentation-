import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  supportingText?: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  change,
  supportingText,
  badgeText,
  badgeVariant = 'success',
}) => {
  const badgeStyles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-[#6B7280] tracking-wide uppercase">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold text-[#111827] tracking-tight">{value}</span>
        {badgeText && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeStyles[badgeVariant]}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-xs">
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              change.trend === 'up'
                ? 'text-[#16A34A]'
                : change.trend === 'down'
                ? 'text-[#DC2626]'
                : 'text-gray-500'
            }`}
          >
            {change.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {change.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {change.trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            {change.value}
          </span>
        )}
        {change?.label && <span className="text-[#6B7280] truncate">{change.label}</span>}
        {supportingText && !change && (
          <span className="text-[#6B7280] truncate">{supportingText}</span>
        )}
      </div>
    </div>
  );
};
