import { apiClient, isMockMode } from './apiClient';
import { SegmentationReport } from '../types';
import { INITIAL_REPORTS } from '../mocks/mockReports';

let mockReportsStore: SegmentationReport[] = [...INITIAL_REPORTS];

export const reportApi = {
  getReports: async (): Promise<SegmentationReport[]> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get('/reports');
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock report service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...mockReportsStore];
  },

  getReportById: async (id: string): Promise<SegmentationReport | null> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get(`/reports/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock report service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    const rep = mockReportsStore.find((r) => r.id === id);
    return rep || null;
  },

  exportReport: async (id: string, format: 'csv' | 'json'): Promise<Blob> => {
    const report = mockReportsStore.find((r) => r.id === id) || mockReportsStore[0];

    if (format === 'json') {
      const dataStr = JSON.stringify(report, null, 2);
      return new Blob([dataStr], { type: 'application/json' });
    }

    // CSV format
    const headers = ['ReportID', 'DatasetName', 'RunDate', 'CustomerCount', 'ClusterCount', 'SilhouetteScore', 'Status'];
    const row = [
      report.id,
      report.datasetName,
      report.date,
      report.customers,
      report.clusters,
      report.silhouetteScore,
      report.status
    ].join(',');

    const csvContent = `${headers.join(',')}\n${row}\n`;
    return new Blob([csvContent], { type: 'text/csv' });
  }
};
