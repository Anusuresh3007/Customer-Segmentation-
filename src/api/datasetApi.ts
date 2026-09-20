import { apiClient, isMockMode } from './apiClient';
import { Dataset } from '../types';
import { INITIAL_DATASETS } from '../mocks/mockDatasets';

let mockDatasetsStore: Dataset[] = [...INITIAL_DATASETS];

export const datasetApi = {
  getDatasets: async (): Promise<Dataset[]> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get('/datasets');
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock dataset service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockDatasetsStore];
  },

  getDatasetById: async (id: string): Promise<Dataset | null> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get(`/datasets/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock dataset service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const ds = mockDatasetsStore.find((d) => d.id === id);
    return ds || null;
  },

  uploadDataset: async (file: File): Promise<Dataset> => {
    if (!isMockMode()) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/datasets/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to client-side parsing', err);
      }
    }

    // Parse CSV client-side to generate realistic dataset preview & stats
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

    let columns: string[] = ['CustomerID', 'Age', 'Gender', 'AnnualIncome', 'SpendingScore'];
    let sampleRows: Record<string, string | number>[] = [];
    let rowCount = 0;
    let duplicateCount = 0;
    let missingValuesCount = 0;

    if (lines.length > 0) {
      columns = lines[0].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      const seenIds = new Set<string>();

      for (let i = 1; i < lines.length; i++) {
        const rawValues = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
        if (rawValues.length === 0 || (rawValues.length === 1 && !rawValues[0])) continue;

        rowCount++;
        const rowObj: Record<string, string | number> = {};

        columns.forEach((col, idx) => {
          const val = rawValues[idx] ?? '';
          if (val === '') {
            missingValuesCount++;
          }
          const numVal = Number(val);
          rowObj[col] = !isNaN(numVal) && val !== '' ? numVal : val;
        });

        // Duplicate check on first column
        const firstVal = String(rawValues[0]);
        if (seenIds.has(firstVal)) {
          duplicateCount++;
        } else {
          seenIds.add(firstVal);
        }

        if (sampleRows.length < 15) {
          sampleRows.push(rowObj);
        }
      }
    }

    const newDataset: Dataset = {
      id: `ds-${Date.now()}`,
      name: file.name,
      size: file.size,
      rowCount: Math.max(rowCount, 1),
      columnCount: columns.length,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Ready',
      missingValuesCount,
      duplicateCount,
      columns,
      sampleRows
    };

    mockDatasetsStore = [newDataset, ...mockDatasetsStore];
    return newDataset;
  },

  deleteDataset: async (id: string): Promise<boolean> => {
    if (!isMockMode()) {
      try {
        await apiClient.delete(`/datasets/${id}`);
        return true;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock dataset service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    mockDatasetsStore = mockDatasetsStore.filter((d) => d.id !== id);
    return true;
  }
};
