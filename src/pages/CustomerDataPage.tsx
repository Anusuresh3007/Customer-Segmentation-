import React, { useState, useEffect, useCallback } from 'react';
import { Customer, CustomerFilters as FiltersType } from '../types';
import { customerApi } from '../api/customerApi';
import { CustomerTable } from '../components/customer/CustomerTable';
import { CustomerFilters } from '../components/customer/CustomerFilters';
import { CustomerForm } from '../components/customer/CustomerForm';
import { BulkEntryModal } from '../components/customer/BulkEntryModal';
import { CustomerDetailsDrawer } from '../components/customer/CustomerDetailsDrawer';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonTable } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';
import { Plus, UploadCloud, FileSpreadsheet, Trash2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  sortBy: 'id',
  sortOrder: 'asc',
};

export const CustomerDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { clusters, currency } = useApp();
  const { success, warning } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [filters, setFilters] = useState<FiltersType>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await customerApi.getCustomers(filters, page, pageSize);
      setCustomers(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchCustomers();
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleSort = (field: keyof Customer) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: newOrder }));
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete customer ${id}?`)) {
      await customerApi.deleteCustomer(id);
      success('Customer Deleted', `Removed customer ${id} from database.`);
      fetchCustomers();
    }
  };

  const handleClearAll = async () => {
    await customerApi.clearAllCustomers();
    setIsClearConfirmOpen(false);
    warning('Dataset Cleared', 'All customer records were cleared from active memory.');
    fetchCustomers();
  };

  const handleRestoreSample = () => {
    customerApi.resetMockCustomers();
    success('Sample Records Restored', 'Reset customer records to initial realistic mock pool.');
    fetchCustomers();
  };

  const activeCluster = selectedCustomer?.cluster
    ? clusters.find((c) => c.id === selectedCustomer.cluster)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header & Page Level Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Data</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Add, upload, inspect, and manage individual customer profiles and behavioral attributes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBulkModalOpen(true)}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-gray-600" />}
          >
            Bulk Entry
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/upload')}
            leftIcon={<UploadCloud className="w-4 h-4 text-gray-600" />}
          >
            Upload CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-white" />}
          >
            Add Customer
          </Button>

          {customers.length > 0 ? (
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setIsClearConfirmOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
              className="text-red-600 hover:bg-red-50"
            >
              Clear Dataset
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestoreSample}
              leftIcon={<RotateCcw className="w-4 h-4 text-blue-600" />}
            >
              Restore Mock Pool
            </Button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <CustomerFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
        totalFilteredCount={total}
      />

      {/* Table / Empty State / Loading */}
      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : customers.length === 0 ? (
        <EmptyState
          type={filters.search || filters.cluster !== 'all' ? 'search' : 'customers'}
          onAction={
            filters.search || filters.cluster !== 'all'
              ? handleResetFilters
              : () => setIsAddModalOpen(true)
          }
        />
      ) : (
        <CustomerTable
          customers={customers}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onSelectCustomer={(c) => setSelectedCustomer(c)}
          onDeleteCustomer={handleDelete}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
        />
      )}

      {/* Single Customer Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Single Customer"
        subtitle="Manually create a customer profile with demographic and transaction metrics."
        maxWidth="2xl"
      >
        <CustomerForm
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchCustomers();
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Bulk Entry Modal */}
      <BulkEntryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={() => fetchCustomers()}
      />

      {/* Customer Details Slide-over Drawer */}
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        cluster={activeCluster}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        currency={currency}
      />

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        title="Clear Customer Dataset"
        subtitle="This action will remove all customer records from memory."
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Are you sure you want to clear the active customer list? You can restore sample mock records at any time.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsClearConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearAll}>
              Yes, Clear All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
