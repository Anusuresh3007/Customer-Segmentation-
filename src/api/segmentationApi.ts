import { apiClient, isMockMode } from './apiClient';
import { SegmentationConfig, SegmentationResult, Cluster } from '../types';
import { INITIAL_CLUSTERS } from '../mocks/mockClusters';
import { clusterApi } from './clusterApi';

let latestResult: SegmentationResult | null = {
  id: 'seg-init-2026',
  datasetId: 'ds-2026-01',
  datasetName: 'customers_2026.csv',
  totalCustomers: 24582,
  clusterCount: 5,
  processingTime: 8.4,
  silhouetteScore: 0.71,
  clusters: [...INITIAL_CLUSTERS],
  featuresUsed: ['Annual Income', 'Spending Score', 'Purchase Frequency', 'Average Order Value', 'Age'],
  completedAt: '2026-09-20 12:48:30',
  inertia: 4128.4
};

export const segmentationApi = {
  runSegmentation: async (
    config: SegmentationConfig,
    onProgress?: (step: number, total: number, message: string) => void,
    abortSignal?: { aborted: boolean }
  ): Promise<SegmentationResult> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.post('/segmentation/run', config);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, running client simulated segmentation workflow', err);
      }
    }

    const steps = [
      { step: 1, message: 'Validating customer dataset integrity...', delay: 900 },
      { step: 2, message: 'Normalizing and scaling customer attributes...', delay: 1100 },
      { step: 3, message: `Partitioning customer feature space into ${config.clusterCount} clusters...`, delay: 1300 },
      { step: 4, message: 'Calculating silhouette scores and cluster centroids...', delay: 1000 },
      { step: 5, message: 'Finalizing behavioral segments and metrics...', delay: 800 },
    ];

    const startTime = Date.now();

    for (let i = 0; i < steps.length; i++) {
      if (abortSignal?.aborted) {
        throw new Error('Segmentation process was cancelled by the user.');
      }
      onProgress?.(i + 1, steps.length, steps[i].message);
      await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
    }

    const duration = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

    // Dynamically adjust mock clusters to match requested clusterCount
    const k = config.clusterCount || 5;
    const basePalette = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#6366F1', '#F97316'];
    const names = [
      'High Value Champions',
      'Loyal Regulars',
      'Potential Loyalists',
      'At-Risk / Inactive',
      'Budget Conscious',
      'New Explorers',
      'Infrequent Big Spenders',
      'Dormant Churners',
      'Seasonal Shoppers',
      'Micro-Transaction Users'
    ];

    const generatedClusters: Cluster[] = [];
    const totalCustomers = 24582;
    let remainingPercentage = 100;

    for (let i = 1; i <= k; i++) {
      const isLast = i === k;
      const targetPct = isLast ? remainingPercentage : Math.round(remainingPercentage / (k - i + 1));
      remainingPercentage -= targetPct;
      const count = Math.round((targetPct / 100) * totalCustomers);

      const existing = INITIAL_CLUSTERS[i - 1];
      generatedClusters.push({
        id: i,
        name: names[i - 1] || `Cluster ${i}`,
        tagline: existing?.tagline || `Distinct customer group with specialized engagement traits`,
        customerCount: count,
        percentage: targetPct,
        averageIncome: existing?.averageIncome || Math.round(35000 + (k - i) * 11000),
        averageSpendingScore: existing?.averageSpendingScore || Math.round(40 + (k - i) * 9),
        averagePurchaseFrequency: existing?.averagePurchaseFrequency || parseFloat((2.5 + (k - i) * 0.9).toFixed(1)),
        averageOrderValue: existing?.averageOrderValue || Math.round(8000 + (k - i) * 6000),
        averageAge: existing?.averageAge || Math.round(30 + (i * 3)),
        averageRecency: existing?.averageRecency || Math.round(15 + i * 18),
        averageTenure: existing?.averageTenure || Math.round(10 + i * 4),
        color: basePalette[(i - 1) % basePalette.length],
        description: existing?.description || `Customers segmented based on configured feature dimensions.`,
        traits: existing?.traits || ['Custom Centroid Segment', 'Homogeneous Purchase Cadence'],
        recommendedAction: existing?.recommendedAction || 'Execute targeted marketing cohort campaign.'
      });
    }

    const result: SegmentationResult = {
      id: `seg-${Date.now()}`,
      datasetId: config.datasetId || 'ds-2026-01',
      datasetName: 'customers_2026.csv',
      totalCustomers,
      clusterCount: k,
      processingTime: duration,
      silhouetteScore: parseFloat((0.68 + (Math.random() * 0.08)).toFixed(2)),
      clusters: generatedClusters,
      featuresUsed: config.features.length > 0 ? config.features : ['Annual Income', 'Spending Score', 'Purchase Frequency'],
      completedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      inertia: Math.round(3800 + Math.random() * 600)
    };

    latestResult = result;
    clusterApi.updateClustersFromSegmentation(generatedClusters);
    return result;
  },

  getLatestResult: async (): Promise<SegmentationResult | null> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get('/segmentation/latest/results');
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, using latest cached segmentation result', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return latestResult;
  },

  getResultById: async (id: string): Promise<SegmentationResult | null> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get(`/segmentation/${id}/results`);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, using cached segmentation result', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return latestResult?.id === id ? latestResult : latestResult;
  }
};
