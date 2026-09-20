import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Dataset, Cluster, SegmentationResult } from '../types';
import { datasetApi } from '../api/datasetApi';
import { clusterApi } from '../api/clusterApi';
import { segmentationApi } from '../api/segmentationApi';
import { isMockMode, setMockMode, testBackendConnection } from '../api/apiClient';
import { INITIAL_DATASETS } from '../mocks/mockDatasets';
import { INITIAL_CLUSTERS } from '../mocks/mockClusters';

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  timeAgo: string;
  type: 'upload' | 'segmentation' | 'analysis' | 'customer';
}

interface AppContextType {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  setSelectedDataset: (dataset: Dataset) => void;
  clusters: Cluster[];
  latestResult: SegmentationResult | null;
  setLatestResult: (result: SegmentationResult) => void;
  activities: ActivityItem[];
  addActivity: (action: string, detail: string, type?: ActivityItem['type']) => void;
  currency: string;
  setCurrency: (c: string) => void;
  isMock: boolean;
  toggleMockMode: (enable: boolean) => void;
  backendStatus: 'connected' | 'disconnected' | 'checking';
  checkBackendStatus: () => Promise<boolean>;
  reloadAllData: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(INITIAL_DATASETS[0]);
  const [clusters, setClusters] = useState<Cluster[]>(INITIAL_CLUSTERS);
  const [latestResult, setLatestResultState] = useState<SegmentationResult | null>(null);
  const [currency, setCurrency] = useState<string>('₹');
  const [isMock, setIsMock] = useState<boolean>(isMockMode());
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('connected');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act-1',
      action: 'Dataset uploaded',
      detail: 'customers_2026.csv',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      timeAgo: '2 minutes ago',
      type: 'upload'
    },
    {
      id: 'act-2',
      action: 'Segmentation completed',
      detail: '5 clusters identified (Silhouette: 0.71)',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      timeAgo: '5 minutes ago',
      type: 'segmentation'
    },
    {
      id: 'act-3',
      action: 'Dataset analyzed',
      detail: 'customer_data.csv (24,582 records)',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      timeAgo: '1 hour ago',
      type: 'analysis'
    },
    {
      id: 'act-4',
      action: 'Customer cohort exported',
      detail: 'High Value Champions (5,408 records)',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      timeAgo: '3 hours ago',
      type: 'customer'
    }
  ]);

  const addActivity = useCallback((action: string, detail: string, type: ActivityItem['type'] = 'analysis') => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      action,
      detail,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      type
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  }, []);

  const toggleMockMode = useCallback((enable: boolean) => {
    setMockMode(enable);
    setIsMock(enable);
  }, []);

  const checkBackendStatus = useCallback(async (): Promise<boolean> => {
    setBackendStatus('checking');
    const res = await testBackendConnection();
    setBackendStatus(res.success ? 'connected' : 'disconnected');
    return res.success;
  }, []);

  const reloadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dsets, cls, segRes] = await Promise.all([
        datasetApi.getDatasets(),
        clusterApi.getClusters(),
        segmentationApi.getLatestResult()
      ]);
      setDatasets(dsets);
      if (dsets.length > 0 && (!selectedDataset || !dsets.some((d) => d.id === selectedDataset.id))) {
        setSelectedDataset(dsets[0]);
      }
      setClusters(cls);
      setLatestResultState(segRes);
    } catch (e) {
      console.error('Failed loading app data', e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset]);

  const setLatestResult = useCallback((res: SegmentationResult) => {
    setLatestResultState(res);
    setClusters(res.clusters);
    addActivity('Segmentation completed', `${res.clusterCount} clusters identified`, 'segmentation');
  }, [addActivity]);

  useEffect(() => {
    reloadAllData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        datasets,
        selectedDataset,
        setSelectedDataset,
        clusters,
        latestResult,
        setLatestResult,
        activities,
        addActivity,
        currency,
        setCurrency,
        isMock,
        toggleMockMode,
        backendStatus,
        checkBackendStatus,
        reloadAllData,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
