import React from 'react';
import { UploadCloud, CheckCircle2, FileSearch, UserCheck, Clock } from 'lucide-react';
import { ActivityItem } from '../../context/AppContext';

interface ActivityPanelProps {
  activities: ActivityItem[];
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload':
        return <UploadCloud className="w-4 h-4 text-blue-600" />;
      case 'segmentation':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'analysis':
        return <FileSearch className="w-4 h-4 text-indigo-600" />;
      case 'customer':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBg = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-50 border-blue-100';
      case 'segmentation':
        return 'bg-green-50 border-green-100';
      case 'analysis':
        return 'bg-indigo-50 border-indigo-100';
      case 'customer':
        return 'bg-purple-50 border-purple-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => {
          const isLast = idx === activities.length - 1;
          return (
            <li key={activity.id}>
              <div className="relative pb-6">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 ${getBg(
                      activity.type
                    )}`}
                  >
                    {getIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1 pt-1 flex justify-between space-x-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.detail}</p>
                    </div>
                    <div className="text-right text-[11px] whitespace-nowrap text-gray-400">
                      {activity.timeAgo}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
