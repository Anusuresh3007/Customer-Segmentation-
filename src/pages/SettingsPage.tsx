import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import {
  Server,
  Sliders,
  Palette,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Save,
  HelpCircle
} from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, testBackendConnection } from '../api/apiClient';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency, isMock, toggleMockMode, backendStatus, checkBackendStatus } = useApp();
  const { success, error: toastError, info } = useToast();

  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  // Preference states
  const [defaultClusterCount, setDefaultClusterCount] = useState(5);
  const [tableDensity, setTableDensity] = useState('comfortable');

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testBackendConnection(apiUrl);
      setTestResult(res);
      if (res.success) {
        success('Backend Reachable', res.message);
      } else {
        toastError('Connection Failed', res.message);
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Connection failed' });
      toastError('Connection Error', err.message);
    } finally {
      setIsTesting(false);
      checkBackendStatus();
    }
  };

  const handleSaveApiSettings = () => {
    setApiBaseUrl(apiUrl);
    success('Settings Saved', 'API Endpoint URL has been updated successfully.');
  };

  const handleSavePreferences = () => {
    success('Preferences Updated', 'General and display preferences saved.');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure backend API endpoints, service mock switches, algorithm defaults, and interface preferences.
        </p>
      </div>

      {/* Section 1: Backend API Configuration */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            Backend REST API Configuration
          </span>
        }
        subtitle="Manage the connection to your Spring Boot, FastAPI, or Flask segmentation server."
      >
        <div className="space-y-5 text-xs">
          {/* Mock Mode Switcher Banner */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">API Service Mock Mode</span>
                <Badge variant={isMock ? 'warning' : 'success'} size="sm">
                  {isMock ? 'Mock Services Active' : 'Live REST Connected'}
                </Badge>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed max-w-lg">
                When enabled, the application uses realistic in-memory mock datasets and simulates clustering workflows. Toggle off when connecting to a live backend.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={isMock}
                onChange={(e) => {
                  toggleMockMode(e.target.checked);
                  if (e.target.checked) {
                    info('Mock Mode Enabled', 'Using local mock service and simulated endpoints.');
                  } else {
                    info('Mock Mode Disabled', 'Directing requests to backend URL.');
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Endpoint Input & Test Connection */}
          <div className="space-y-3">
            <Input
              label="Backend API Base URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8080/api"
              helperText="Target REST API base path (e.g. http://localhost:8080/api or https://api.yourdomain.com/v1)"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Status:</span>
                {backendStatus === 'checking' ? (
                  <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking...
                  </span>
                ) : backendStatus === 'connected' ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    <XCircle className="w-3.5 h-3.5" /> Disconnected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  isLoading={isTesting}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Test Connection
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveApiSettings}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save URL
                </Button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Section 2: Segmentation Hyperparameter Defaults */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Segmentation Defaults
          </span>
        }
        subtitle="Default configurations pre-populated in the segmentation workflow."
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Default Number of Clusters (K)
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={defaultClusterCount}
                onChange={(e) => setDefaultClusterCount(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Standard recommended count between 3 and 8.
              </span>
            </div>

            <Select
              label="Standard Scaler Algorithm"
              options={[
                { value: 'standard', label: 'Standard Normal Scaler (z-score)' },
                { value: 'minmax', label: 'Min-Max Normalization (0-1)' },
                { value: 'robust', label: 'Robust Scaler (IQR-based)' },
              ]}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="outline" onClick={handleSavePreferences}>
              Save Defaults
            </Button>
          </div>
        </div>
      </Card>

      {/* Section 3: Display & Localization Preferences */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            Display &amp; Localization
          </span>
        }
        subtitle="Currency formatting and interface visual density."
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Currency Symbol"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                success('Currency Updated', `Active display currency set to ${e.target.value}`);
              }}
              options={[
                { value: '₹', label: '₹ — Indian Rupee (INR)' },
                { value: '$', label: '$ — US Dollar (USD)' },
                { value: '€', label: '€ — Euro (EUR)' },
                { value: '£', label: '£ — British Pound (GBP)' },
              ]}
            />

            <Select
              label="Table Display Density"
              value={tableDensity}
              onChange={(e) => setTableDensity(e.target.value)}
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'comfortable', label: 'Comfortable (Default)' },
                { value: 'spacious', label: 'Spacious' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Security & Backend Integration Note */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Enterprise Backend Integration Ready</p>
          <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
            All API calls are strictly decoupled into <code className="bg-blue-100 px-1 py-0.5 rounded">src/api/*Api.ts</code>. You can easily connect this frontend to a Spring Boot backend, FastAPI cluster service, or Node.js microservice by switching off Mock Mode above.
          </p>
        </div>
      </div>
    </div>
  );
};
