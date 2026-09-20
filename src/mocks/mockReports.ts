import { SegmentationReport } from '../types';

export const INITIAL_REPORTS: SegmentationReport[] = [
  {
    id: 'REP-2026-001',
    datasetName: 'customers_2026.csv',
    date: '2026-09-20 12:48:30',
    customers: 24582,
    clusters: 5,
    status: 'Completed',
    processingTime: 8.4,
    silhouetteScore: 0.71,
    primaryFeatures: ['Annual Income', 'Spending Score', 'Purchase Frequency', 'Average Order Value']
  },
  {
    id: 'REP-2026-002',
    datasetName: 'retail_q3_cohort.csv',
    date: '2026-09-18 10:15:12',
    customers: 18400,
    clusters: 4,
    status: 'Completed',
    processingTime: 6.2,
    silhouetteScore: 0.68,
    primaryFeatures: ['Annual Income', 'Spending Score', 'Recency', 'Tenure']
  },
  {
    id: 'REP-2026-003',
    datasetName: 'ecommerce_pilot.csv',
    date: '2026-09-15 15:35:40',
    customers: 5120,
    clusters: 5,
    status: 'Completed',
    processingTime: 2.7,
    silhouetteScore: 0.74,
    primaryFeatures: ['Spending Score', 'Purchase Frequency', 'Average Order Value', 'Age']
  },
  {
    id: 'REP-2026-004',
    datasetName: 'summer_promo_leads.csv',
    date: '2026-09-02 11:20:05',
    customers: 12350,
    clusters: 3,
    status: 'Completed',
    processingTime: 4.8,
    silhouetteScore: 0.65,
    primaryFeatures: ['Annual Income', 'Average Order Value', 'Recency']
  },
  {
    id: 'REP-2026-005',
    datasetName: 'loyalty_club_inactive.csv',
    date: '2026-08-25 14:02:18',
    customers: 8400,
    clusters: 4,
    status: 'Completed',
    processingTime: 3.5,
    silhouetteScore: 0.69,
    primaryFeatures: ['Recency', 'Spending Score', 'Purchase Frequency']
  }
];
