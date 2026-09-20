import React, { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'cluster';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  clusterId?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  clusterId,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded',
    md: 'text-xs px-2.5 py-0.5 font-medium rounded-full',
  };

  if (variant === 'cluster' && clusterId) {
    const clusterStyles: Record<number, string> = {
      1: 'bg-blue-50 text-blue-700 border-blue-200',
      2: 'bg-green-50 text-green-700 border-green-200',
      3: 'bg-amber-50 text-amber-700 border-amber-200',
      4: 'bg-red-50 text-red-700 border-red-200',
      5: 'bg-purple-50 text-purple-700 border-purple-200',
      6: 'bg-pink-50 text-pink-700 border-pink-200',
      7: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      8: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      9: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      10: 'bg-orange-50 text-orange-700 border-orange-200',
    };

    const style = clusterStyles[clusterId] || 'bg-gray-100 text-gray-700 border-gray-200';
    return (
      <span className={`inline-flex items-center gap-1 border ${sizeClasses[size]} ${style} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
        {children}
      </span>
    );
  }

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    cluster: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`inline-flex items-center border ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
