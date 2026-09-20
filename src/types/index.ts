export interface Customer {
  id: string;
  name?: string;
  email?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  annualIncome: number; // in currency units (e.g. ₹ or $)
  spendingScore: number; // 1 - 100
  purchaseFrequency: number; // orders per year
  averageOrderValue: number; // average spend per order
  totalPurchases: number; // lifetime orders
  recency: number; // days since last order
  tenure: number; // months as a customer
  cluster?: number; // assigned cluster ID (1-indexed)
  clusterName?: string;
}

export interface CustomerFilters {
  search: string;
  cluster: string; // 'all' | '1' | '2' ...
  gender: string; // 'all' | 'Male' | 'Female' | 'Other'
  minAge: number;
  maxAge: number;
  minIncome: number;
  maxIncome: number;
  minSpendingScore: number;
  maxSpendingScore: number;
  minFrequency: number;
  maxFrequency: number;
  sortBy: keyof Customer;
  sortOrder: 'asc' | 'desc';
}

export interface Cluster {
  id: number;
  name: string;
  tagline?: string;
  customerCount: number;
  percentage: number;
  averageIncome: number;
  averageSpendingScore: number;
  averagePurchaseFrequency: number;
  averageOrderValue: number;
  averageAge?: number;
  averageRecency?: number;
  averageTenure?: number;
  color: string;
  description: string;
  traits: string[];
  recommendedAction: string;
}

export interface Dataset {
  id: string;
  name: string;
  size: number; // in bytes
  rowCount: number;
  columnCount: number;
  uploadedAt: string;
  status: 'Ready' | 'Processing' | 'Failed';
  missingValuesCount: number;
  duplicateCount: number;
  columns: string[];
  sampleRows: Record<string, string | number>[];
}

export interface SegmentationConfig {
  datasetId: string;
  clusterCount: number;
  features: string[];
  algorithm: 'kmeans' | 'hierarchical' | 'dbscan';
  maxIterations?: number;
}

export interface SegmentationProgressStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface SegmentationResult {
  id: string;
  datasetId: string;
  datasetName: string;
  totalCustomers: number;
  clusterCount: number;
  processingTime: number; // in seconds
  silhouetteScore: number; // e.g. 0.71
  clusters: Cluster[];
  featuresUsed: string[];
  completedAt: string;
  inertia?: number;
}

export interface SegmentationReport {
  id: string;
  datasetName: string;
  date: string;
  customers: number;
  clusters: number;
  status: 'Completed' | 'Failed' | 'In Progress';
  processingTime: number;
  silhouetteScore: number;
  primaryFeatures: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
