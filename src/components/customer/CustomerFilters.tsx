import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { CustomerFilters as FiltersType } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useApp } from '../../context/AppContext';

interface CustomerFiltersProps {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
  onReset: () => void;
  onApply: () => void;
  totalFilteredCount?: number;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filters,
  onChange,
  onReset,
  onApply,
  totalFilteredCount,
}) => {
  const { clusters, currency } = useApp();

  const clusterOptions = [
    { value: 'all', label: 'All Clusters' },
    ...clusters.map((c) => ({
      value: String(c.id),
      label: `Cluster ${c.id}: ${c.name}`,
    })),
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-card space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search box */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Search customer ID, name, email..."
            leftIcon={<Search className="w-4 h-4" />}
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {totalFilteredCount !== undefined && (
            <span className="text-xs text-gray-500 font-medium mr-2">
              Found: <strong className="text-gray-900">{totalFilteredCount.toLocaleString()}</strong> records
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Filter className="w-3.5 h-3.5" />}
            onClick={onApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-gray-100">
        <Select
          label="Cluster"
          value={filters.cluster}
          onChange={(e) => onChange({ ...filters, cluster: e.target.value })}
          options={clusterOptions}
        />

        <Select
          label="Gender"
          value={filters.gender}
          onChange={(e) => onChange({ ...filters, gender: e.target.value })}
          options={[
            { value: 'all', label: 'All Genders' },
            { value: 'Female', label: 'Female' },
            { value: 'Male', label: 'Male' },
            { value: 'Other', label: 'Other' },
          ]}
        />

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Max Age</label>
          <input
            type="number"
            min={18}
            max={100}
            value={filters.maxAge}
            onChange={(e) => onChange({ ...filters, maxAge: Number(e.target.value) })}
            className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Min Income ({currency})
          </label>
          <input
            type="number"
            step={5000}
            value={filters.minIncome}
            onChange={(e) => onChange({ ...filters, minIncome: Number(e.target.value) })}
            className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Min Spend Score</label>
          <input
            type="number"
            min={1}
            max={100}
            value={filters.minSpendingScore}
            onChange={(e) => onChange({ ...filters, minSpendingScore: Number(e.target.value) })}
            className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Min Orders / Yr</label>
          <input
            type="number"
            min={0}
            max={50}
            value={filters.minFrequency}
            onChange={(e) => onChange({ ...filters, minFrequency: Number(e.target.value) })}
            className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
