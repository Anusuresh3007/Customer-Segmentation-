import React from 'react';
import { Customer } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Eye, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CustomerTableProps {
  customers: Customer[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onSelectCustomer: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  sortBy?: keyof Customer;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: keyof Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  total,
  page,
  pageSize,
  onPageChange,
  onSelectCustomer,
  onDeleteCustomer,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const { currency } = useApp();
  const totalPages = Math.ceil(total / pageSize);
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const renderSortHeader = (label: string, field: keyof Customer) => (
    <th
      scope="col"
      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => onSort && onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <ArrowUpDown
          className={`w-3.5 h-3.5 ${
            sortBy === field ? 'text-blue-600' : 'text-gray-400'
          }`}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50/80 sticky top-0 z-10">
            <tr>
              {renderSortHeader('Customer ID', 'id')}
              {renderSortHeader('Age', 'age')}
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                Gender
              </th>
              {renderSortHeader(`Income (${currency})`, 'annualIncome')}
              {renderSortHeader('Spending Score', 'spendingScore')}
              {renderSortHeader('Frequency', 'purchaseFrequency')}
              {renderSortHeader(`Avg Order Value`, 'averageOrderValue')}
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                Cluster
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {customers.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                onClick={() => onSelectCustomer(c)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-semibold text-gray-900 font-mono">{c.id}</div>
                  {c.name && <div className="text-[11px] text-gray-500 truncate max-w-[120px]">{c.name}</div>}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{c.age}</td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-600">{c.gender}</td>

                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  {currency}{c.annualIncome.toLocaleString()}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{c.spendingScore}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 hidden sm:block">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${c.spendingScore}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {c.purchaseFrequency} / yr
                </td>

                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  {currency}{c.averageOrderValue.toLocaleString()}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {c.cluster ? (
                    <Badge variant="cluster" clusterId={c.cluster} size="sm">
                      Cluster {c.cluster}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-[11px]">Unassigned</span>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectCustomer(c)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {onDeleteCustomer && (
                    <button
                      onClick={() => onDeleteCustomer(c.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div>
          Showing <strong className="text-gray-900">{startItem}</strong> to{' '}
          <strong className="text-gray-900">{endItem}</strong> of{' '}
          <strong className="text-gray-900">{total.toLocaleString()}</strong> customers
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          >
            Previous
          </Button>

          {/* Page numbers preview */}
          <div className="hidden sm:flex items-center gap-1 px-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              let p = idx + 1;
              if (totalPages > 5 && page > 3) {
                p = page - 2 + idx;
                if (p > totalPages) p = totalPages - (4 - idx);
              }
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    page === p
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
