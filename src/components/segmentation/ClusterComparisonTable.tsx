import React, { useState } from 'react';
import { Cluster } from '../../types';
import { Badge } from '../common/Badge';
import { ArrowUpDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ClusterComparisonTableProps {
  clusters: Cluster[];
}

export const ClusterComparisonTable: React.FC<ClusterComparisonTableProps> = ({ clusters }) => {
  const navigate = useNavigate();
  const { currency } = useApp();
  const [sortField, setSortField] = useState<keyof Cluster>('customerCount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Cluster) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedClusters = [...clusters].sort((a, b) => {
    const valA = a[sortField] ?? 0;
    const valB = b[sortField] ?? 0;
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortTh = (label: string, field: keyof Cluster) => (
    <th
      scope="col"
      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <ArrowUpDown
          className={`w-3.5 h-3.5 ${
            sortField === field ? 'text-blue-600' : 'text-gray-400'
          }`}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/60">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Cluster Characteristics Matrix</h4>
          <p className="text-xs text-gray-500">
            Compare centroid metrics across identified behavioral segments. Click headers to sort.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                Cluster
              </th>
              {renderSortTh('Customers', 'customerCount')}
              {renderSortTh('Share (%)', 'percentage')}
              {renderSortTh(`Avg Income (${currency})`, 'averageIncome')}
              {renderSortTh('Avg Spend Score', 'averageSpendingScore')}
              {renderSortTh('Avg Frequency', 'averagePurchaseFrequency')}
              {renderSortTh(`Avg Order Value (${currency})`, 'averageOrderValue')}
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                Drill Down
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sortedClusters.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/clusters?id=${c.id}`)}
                className="hover:bg-blue-50/40 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <div>
                      <span className="font-semibold text-gray-900 block">
                        Cluster {c.id}: {c.name}
                      </span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        {c.tagline}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
                  {c.customerCount.toLocaleString()}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant="cluster" clusterId={c.id} size="sm">
                    {c.percentage}%
                  </Badge>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-800 font-medium">
                  {currency}{c.averageIncome.toLocaleString()}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{c.averageSpendingScore}</span>
                    <div className="w-12 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, c.averageSpendingScore)}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {c.averagePurchaseFrequency} / yr
                </td>

                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  {currency}{c.averageOrderValue.toLocaleString()}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clusters?id=${c.id}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium p-1 hover:bg-blue-50 rounded"
                    title="View Cluster Details"
                  >
                    <Eye className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
