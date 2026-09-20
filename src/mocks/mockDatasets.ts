import { Dataset } from '../types';

export const INITIAL_DATASETS: Dataset[] = [
  {
    id: 'ds-2026-01',
    name: 'customers_2026.csv',
    size: 4812300, // ~4.8 MB
    rowCount: 24582,
    columnCount: 10,
    uploadedAt: '2026-09-20 12:45:00',
    status: 'Ready',
    missingValuesCount: 143,
    duplicateCount: 28,
    columns: [
      'CustomerID',
      'Age',
      'Gender',
      'AnnualIncome',
      'SpendingScore',
      'PurchaseFrequency',
      'AverageOrderValue',
      'TotalPurchases',
      'Recency',
      'Tenure'
    ],
    sampleRows: [
      { CustomerID: 'CUST-1001', Age: 38, Gender: 'Male', AnnualIncome: 98000, SpendingScore: 89, PurchaseFrequency: 9, AverageOrderValue: 44200, TotalPurchases: 42, Recency: 8, Tenure: 36 },
      { CustomerID: 'CUST-1002', Age: 42, Gender: 'Female', AnnualIncome: 56000, SpendingScore: 62, PurchaseFrequency: 5, AverageOrderValue: 21800, TotalPurchases: 28, Recency: 22, Tenure: 26 },
      { CustomerID: 'CUST-1003', Age: 27, Gender: 'Female', AnnualIncome: 44000, SpendingScore: 55, PurchaseFrequency: 4, AverageOrderValue: 15200, TotalPurchases: 14, Recency: 15, Tenure: 9 },
      { CustomerID: 'CUST-1004', Age: 51, Gender: 'Male', AnnualIncome: 65000, SpendingScore: 24, PurchaseFrequency: 2, AverageOrderValue: 10900, TotalPurchases: 18, Recency: 165, Tenure: 24 },
      { CustomerID: 'CUST-1005', Age: 31, Gender: 'Male', AnnualIncome: 28000, SpendingScore: 38, PurchaseFrequency: 2, AverageOrderValue: 6500, TotalPurchases: 8, Recency: 42, Tenure: 14 },
      { CustomerID: 'CUST-1006', Age: 45, Gender: 'Female', AnnualIncome: 104000, SpendingScore: 92, PurchaseFrequency: 11, AverageOrderValue: 48500, TotalPurchases: 56, Recency: 4, Tenure: 40 },
      { CustomerID: 'CUST-1007', Age: 36, Gender: 'Female', AnnualIncome: 61000, SpendingScore: 68, PurchaseFrequency: 6, AverageOrderValue: 22900, TotalPurchases: 31, Recency: 19, Tenure: 30 },
      { CustomerID: 'CUST-1008', Age: 29, Gender: 'Male', AnnualIncome: 48000, SpendingScore: 49, PurchaseFrequency: 3, AverageOrderValue: 13900, TotalPurchases: 11, Recency: 26, Tenure: 12 },
      { CustomerID: 'CUST-1009', Age: 48, Gender: 'Female', AnnualIncome: 59000, SpendingScore: 31, PurchaseFrequency: 1, AverageOrderValue: 11800, TotalPurchases: 15, Recency: 132, Tenure: 19 },
      { CustomerID: 'CUST-1010', Age: 25, Gender: 'Male', AnnualIncome: 31000, SpendingScore: 41, PurchaseFrequency: 3, AverageOrderValue: 7100, TotalPurchases: 9, Recency: 35, Tenure: 17 }
    ]
  },
  {
    id: 'ds-2026-02',
    name: 'retail_q3_cohort.csv',
    size: 3624000,
    rowCount: 18400,
    columnCount: 10,
    uploadedAt: '2026-09-18 09:30:00',
    status: 'Ready',
    missingValuesCount: 89,
    duplicateCount: 14,
    columns: [
      'CustomerID',
      'Age',
      'Gender',
      'AnnualIncome',
      'SpendingScore',
      'PurchaseFrequency',
      'AverageOrderValue',
      'TotalPurchases',
      'Recency',
      'Tenure'
    ],
    sampleRows: [
      { CustomerID: 'RET-2001', Age: 34, Gender: 'Female', AnnualIncome: 82000, SpendingScore: 84, PurchaseFrequency: 8, AverageOrderValue: 38000, TotalPurchases: 32, Recency: 11, Tenure: 28 },
      { CustomerID: 'RET-2002', Age: 44, Gender: 'Male', AnnualIncome: 54000, SpendingScore: 59, PurchaseFrequency: 4, AverageOrderValue: 19500, TotalPurchases: 20, Recency: 31, Tenure: 21 }
    ]
  },
  {
    id: 'ds-2026-03',
    name: 'ecommerce_pilot.csv',
    size: 1120000,
    rowCount: 5120,
    columnCount: 10,
    uploadedAt: '2026-09-15 15:10:00',
    status: 'Ready',
    missingValuesCount: 22,
    duplicateCount: 3,
    columns: [
      'CustomerID',
      'Age',
      'Gender',
      'AnnualIncome',
      'SpendingScore',
      'PurchaseFrequency',
      'AverageOrderValue',
      'TotalPurchases',
      'Recency',
      'Tenure'
    ],
    sampleRows: [
      { CustomerID: 'ECOM-3001', Age: 29, Gender: 'Female', AnnualIncome: 67000, SpendingScore: 78, PurchaseFrequency: 7, AverageOrderValue: 32000, TotalPurchases: 25, Recency: 14, Tenure: 18 }
    ]
  }
];
