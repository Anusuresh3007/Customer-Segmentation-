import { apiClient, isMockMode } from './apiClient';
import { Customer, CustomerFilters, PaginatedResult } from '../types';
import { INITIAL_CUSTOMERS } from '../mocks/mockCustomers';

// In-memory mock store
let mockCustomersStore: Customer[] = [...INITIAL_CUSTOMERS];

export const customerApi = {
  getCustomers: async (
    filters?: Partial<CustomerFilters>,
    page: number = 1,
    pageSize: number = 25
  ): Promise<PaginatedResult<Customer>> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get('/customers', {
          params: { ...filters, page, pageSize }
        });
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock customer service', err);
      }
    }

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 200)); // simulate slight async delay

    let filtered = [...mockCustomersStore];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    if (filters?.cluster && filters.cluster !== 'all') {
      const clusterId = parseInt(filters.cluster, 10);
      filtered = filtered.filter((c) => c.cluster === clusterId);
    }

    if (filters?.gender && filters.gender !== 'all') {
      filtered = filtered.filter((c) => c.gender === filters.gender);
    }

    if (filters?.minAge !== undefined) {
      filtered = filtered.filter((c) => c.age >= filters.minAge!);
    }
    if (filters?.maxAge !== undefined) {
      filtered = filtered.filter((c) => c.age <= filters.maxAge!);
    }

    if (filters?.minIncome !== undefined) {
      filtered = filtered.filter((c) => c.annualIncome >= filters.minIncome!);
    }
    if (filters?.maxIncome !== undefined) {
      filtered = filtered.filter((c) => c.annualIncome <= filters.maxIncome!);
    }

    if (filters?.minSpendingScore !== undefined) {
      filtered = filtered.filter((c) => c.spendingScore >= filters.minSpendingScore!);
    }
    if (filters?.maxSpendingScore !== undefined) {
      filtered = filtered.filter((c) => c.spendingScore <= filters.maxSpendingScore!);
    }

    if (filters?.sortBy) {
      const field = filters.sortBy;
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const valA = a[field] ?? '';
        const valB = b[field] ?? '';
        if (valA < valB) return -1 * order;
        if (valA > valB) return 1 * order;
        return 0;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIdx = (page - 1) * pageSize;
    const items = filtered.slice(startIdx, startIdx + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages
    };
  },

  getCustomerById: async (id: string): Promise<Customer | null> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get(`/customers/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock customer service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const customer = mockCustomersStore.find((c) => c.id === id);
    return customer || null;
  },

  createCustomer: async (data: Omit<Customer, 'cluster'>): Promise<Customer> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.post('/customers', data);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock customer service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    // Check duplicate ID
    if (mockCustomersStore.some((c) => c.id.toLowerCase() === data.id.toLowerCase())) {
      throw new Error(`Customer ID "${data.id}" already exists.`);
    }

    // Heuristic assignment to a cluster for mock mode
    let cluster = 2;
    let clusterName = 'Loyal Regulars';
    if (data.annualIncome > 80000 && data.spendingScore > 75) {
      cluster = 1;
      clusterName = 'High Value Champions';
    } else if (data.recency > 90) {
      cluster = 4;
      clusterName = 'At-Risk / Inactive';
    } else if (data.annualIncome < 35000) {
      cluster = 5;
      clusterName = 'Budget Conscious';
    } else if (data.spendingScore > 50) {
      cluster = 3;
      clusterName = 'Potential Loyalists';
    }

    const newCustomer: Customer = {
      ...data,
      cluster,
      clusterName
    };

    mockCustomersStore = [newCustomer, ...mockCustomersStore];
    return newCustomer;
  },

  bulkCreateCustomers: async (newCustomers: Customer[]): Promise<{ added: number; errors: number }> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.post('/customers/bulk', newCustomers);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock customer service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const existingIds = new Set(mockCustomersStore.map((c) => c.id.toLowerCase()));
    const validToAdd: Customer[] = [];

    for (const item of newCustomers) {
      if (!existingIds.has(item.id.toLowerCase())) {
        existingIds.add(item.id.toLowerCase());
        validToAdd.push(item);
      }
    }

    mockCustomersStore = [...validToAdd, ...mockCustomersStore];
    return {
      added: validToAdd.length,
      errors: newCustomers.length - validToAdd.length
    };
  },

  deleteCustomer: async (id: string): Promise<boolean> => {
    if (!isMockMode()) {
      try {
        await apiClient.delete(`/customers/${id}`);
        return true;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock customer service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    mockCustomersStore = mockCustomersStore.filter((c) => c.id !== id);
    return true;
  },

  clearAllCustomers: async (): Promise<boolean> => {
    mockCustomersStore = [];
    return true;
  },

  resetMockCustomers: (): void => {
    mockCustomersStore = [...INITIAL_CUSTOMERS];
  }
};
