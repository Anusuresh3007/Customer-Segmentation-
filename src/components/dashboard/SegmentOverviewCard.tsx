import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, CreditCard, Repeat, Sparkles } from 'lucide-react';
import { Cluster } from '../../types';
import { Badge } from '../common/Badge';

interface SegmentOverviewCardProps {
  cluster: Cluster;
  currency?: string;
}

export const SegmentOverviewCard: React.FC<SegmentOverviewCardProps> = ({
  cluster,
  currency = '₹',
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/clusters?id=${cluster.id}`)}
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-card hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cluster" clusterId={cluster.id} size="sm">
                Cluster {cluster.id}
              </Badge>
              <span className="text-xs font-semibold text-gray-500">
                {cluster.percentage}% share
              </span>
            </div>
            <h4 className="text-base font-bold text-gray-900 mt-1.5 group-hover:text-blue-600 transition-colors">
              {cluster.name}
            </h4>
          </div>
          <div
            className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 shadow-xs"
            style={{ backgroundColor: cluster.color }}
          />
        </div>

        {cluster.tagline && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4">
            {cluster.tagline}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-gray-50/80 rounded-lg border border-gray-100 mb-3">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-gray-400" /> Customers
            </span>
            <span className="text-xs font-bold text-gray-900 mt-0.5 block">
              {cluster.customerCount.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block font-medium flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-gray-400" /> Avg Spend
            </span>
            <span className="text-xs font-bold text-gray-900 mt-0.5 block">
              {currency}{cluster.averageOrderValue.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block font-medium flex items-center gap-1">
              <Repeat className="w-3 h-3 text-gray-400" /> Freq / yr
            </span>
            <span className="text-xs font-bold text-gray-900 mt-0.5 block">
              {cluster.averagePurchaseFrequency}
            </span>
          </div>
        </div>

        {/* Traits Pills */}
        {cluster.traits && cluster.traits.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {cluster.traits.slice(0, 2).map((trait, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium truncate max-w-[140px]"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
        <span className="flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-blue-500" /> View cluster analysis
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
