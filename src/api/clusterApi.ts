import { apiClient, isMockMode } from './apiClient';
import { Cluster } from '../types';
import { INITIAL_CLUSTERS } from '../mocks/mockClusters';

let mockClustersStore: Cluster[] = [...INITIAL_CLUSTERS];

export const clusterApi = {
  getClusters: async (): Promise<Cluster[]> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get('/clusters');
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock cluster service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...mockClustersStore];
  },

  getClusterById: async (id: number): Promise<Cluster | null> => {
    if (!isMockMode()) {
      try {
        const response = await apiClient.get(`/clusters/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock cluster service', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    const cl = mockClustersStore.find((c) => c.id === id);
    return cl || null;
  },

  updateClustersFromSegmentation: (clusters: Cluster[]): void => {
    mockClustersStore = clusters;
  }
};
