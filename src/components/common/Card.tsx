import React, { ReactNode } from 'react';

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  bodyClassName = '',
  noPadding = false,
}) => {
  return (
    <div className={`bg-white rounded-xl border border-[#E5E7EB] shadow-card transition-shadow ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-[#111827]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? bodyClassName : `p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};
