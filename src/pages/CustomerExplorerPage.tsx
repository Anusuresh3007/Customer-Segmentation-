import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Customer, CustomerFilters as FiltersType } from '../types';
import { customerApi } from '../api/customerApi';
import { CustomerTable } from '../components/customer/CustomerTable';
import { CustomerFilters } from '../components/customer/CustomerFilters';
import { CustomerDetailsDrawer } from '../components/customer/CustomerDetailsDrawer';
import { SkeletonTable } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

const defaultFilters: FiltersType = {
  search: '',
  cluster: 'all',
  gender: 'all',
  minAge: 18,
  maxAge: 100,
  minIncome: 0,
  maxIncome: 200000,
  minSpendingScore: 1,
  maxSpendingScore: 100,
  minFrequency: 0,
  maxFrequency: 50,
  sortBy: 'spendingScore',
  sortOrder: 'desc',
};

export const CustomerExplorerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCluster = searchParams.get('cluster') || 'all';

  const { clusters, currency } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [filters, setFilters] = useState<FiltersType>({
    ...defaultFilters,
    search: initialQuery,
    cluster: initialCluster,
  });

  const fetchFilteredCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await customerApi.getCustomers(filters, page, pageSize);
      setCustomers(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchFilteredCustomers();
  }, [fetchFilteredCustomers]);

  const handleApply = () => {
    setPage(1);
    fetchFilteredCustomers();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleSort = (field: keyof Customer) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: newOrder }));
  };

  const activeCluster = selectedCustomer?.cluster
    ? clusters.find((c) => c.id === selectedCustomer.cluster)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Explorer</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Explore, filter, and compare customer accounts across behavioral clusters with multi-attribute search.
        </p>
      </div>

      {/* Filter Bar */}
      <CustomerFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        onApply={handleApply}
        totalFilteredCount={total}
      />

      {/* Customer Data Table */}
      {isLoading ? (
        <SkeletonTable rows={10} />
      ) : customers.length === 0 ? (
        <EmptyState
          type="search"
          onAction={handleReset}
          actionText="Reset All Filters"
        />
      ) : (
        <CustomerTable
          customers={customers}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onSelectCustomer={(c) => setSelectedCustomer(c)}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
        />
      )}

      {/* Customer Details Drawer */}
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        cluster={activeCluster}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        currency={currency}
      />
    </div>
  );
};
