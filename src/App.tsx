import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { CustomerDataPage } from './pages/CustomerDataPage';
import { UploadDatasetPage } from './pages/UploadDatasetPage';
import { SegmentationPage } from './pages/SegmentationPage';
import { CustomerExplorerPage } from './pages/CustomerExplorerPage';
import { ClusterDetailsPage } from './pages/ClusterDetailsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="customers" element={<CustomerDataPage />} />
              <Route path="upload" element={<UploadDatasetPage />} />
              <Route path="segmentation" element={<SegmentationPage />} />
              <Route path="explorer" element={<CustomerExplorerPage />} />
              <Route path="clusters" element={<ClusterDetailsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
