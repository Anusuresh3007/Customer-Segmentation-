import React, { ReactNode } from 'react';
import { Database, Users, PieChart, FileText, Search, Plus } from 'lucide-react';
import { Button } from './Button';

export type EmptyStateType = 'dataset' | 'customers' | 'segmentation' | 'clusters' | 'reports' | 'search' | 'generic';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  const configs: Record<EmptyStateType, { icon: ReactNode; title: string; desc: string; action?: string }> = {
    dataset: {
      icon: <Database className="w-10 h-10 text-blue-500" />,
      title: 'No customer dataset available',
      desc: 'Upload a CSV dataset to start customer segmentation and behavioral analytics.',
      action: 'Upload Dataset',
    },
    customers: {
      icon: <Users className="w-10 h-10 text-indigo-500" />,
      title: 'No customers found',
      desc: 'Add individual customers manually, import bulk records, or upload a dataset.',
      action: 'Add Customer',
    },
    segmentation: {
      icon: <PieChart className="w-10 h-10 text-blue-500" />,
      title: 'No segmentation results yet',
      desc: 'Select a dataset and run the segmentation algorithm to discover customer clusters.',
      action: 'Configure Segmentation',
    },
    clusters: {
      icon: <PieChart className="w-10 h-10 text-amber-500" />,
      title: 'No clusters available',
      desc: 'Cluster profiles will appear once a dataset has been segmented.',
      action: 'Run Segmentation',
    },
    reports: {
      icon: <FileText className="w-10 h-10 text-purple-500" />,
      title: 'No reports generated yet',
      desc: 'Historical reports are archived automatically whenever a segmentation job runs.',
      action: 'Run New Segmentation',
    },
    search: {
      icon: <Search className="w-10 h-10 text-gray-400" />,
      title: 'No matching records',
      desc: 'No customers match your current filter and search criteria. Try adjusting or resetting filters.',
      action: 'Reset Filters',
    },
    generic: {
      icon: <Database className="w-10 h-10 text-gray-400" />,
      title: 'No data available',
      desc: 'There is nothing to display here at the moment.',
    },
  };

  const current = configs[type];
  const finalTitle = title || current.title;
  const finalDesc = description || current.desc;
  const finalAction = actionText || current.action;
  const finalIcon = icon || current.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-gray-200 shadow-xs max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
        {finalIcon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{finalTitle}</h3>
      <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">{finalDesc}</p>
      {finalAction && onAction && (
        <Button onClick={onAction} leftIcon={<Plus className="w-4 h-4" />}>
          {finalAction}
        </Button>
      )}
    </div>
  );
};
