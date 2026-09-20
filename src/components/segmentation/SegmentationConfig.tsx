import React from 'react';
import { Database, Sliders, CheckSquare, Sparkles, RefreshCw } from 'lucide-react';
import { Dataset, SegmentationConfig as ConfigType } from '../../types';
import { Button } from '../common/Button';

interface SegmentationConfigProps {
  dataset: Dataset | null;
  config: ConfigType;
  onChangeConfig: (newConfig: ConfigType) => void;
  onRunSegmentation: () => void;
  onChangeDataset: () => void;
  isProcessing: boolean;
}

export const SegmentationConfig: React.FC<SegmentationConfigProps> = ({
  dataset,
  config,
  onChangeConfig,
  onRunSegmentation,
  onChangeDataset,
  isProcessing,
}) => {
  const availableFeatures = [
    { id: 'Age', label: 'Age', desc: 'Customer chronological age' },
    { id: 'Annual Income', label: 'Annual Income', desc: 'Annual earnings capacity' },
    { id: 'Spending Score', label: 'Spending Score', desc: 'Observed propensity to spend (1-100)' },
    { id: 'Purchase Frequency', label: 'Purchase Frequency', desc: 'Orders placed per year' },
    { id: 'Average Order Value', label: 'Average Order Value', desc: 'Mean spend per transaction' },
    { id: 'Recency', label: 'Recency', desc: 'Days elapsed since latest purchase' },
    { id: 'Tenure', label: 'Tenure', desc: 'Months enrolled in customer database' },
  ];

  const handleToggleFeature = (featureId: string) => {
    const exists = config.features.includes(featureId);
    let updated: string[];
    if (exists) {
      if (config.features.length <= 1) return; // keep at least 1
      updated = config.features.filter((f) => f !== featureId);
    } else {
      updated = [...config.features, featureId];
    }
    onChangeConfig({ ...config, features: updated });
  };

  return (
    <div className="space-y-6">
      {/* Dataset Selection Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Target Dataset
              </span>
              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-200">
                Active
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              {dataset ? dataset.name : 'No dataset selected'}
            </h3>
            {dataset && (
              <p className="text-xs text-gray-500 mt-0.5">
                {dataset.rowCount.toLocaleString()} customers • {dataset.columnCount} attributes •{' '}
                {(dataset.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onChangeDataset} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Change Dataset
        </Button>
      </div>

      {/* Segmentation Parameters Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-card space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Segmentation Hyperparameters
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure cluster dimensionality and feature variables passed to the backend clustering algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Cluster Count Slider / Input */}
          <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900">Number of Clusters (K)</label>
              <div className="flex items-center gap-1 font-mono text-sm font-bold bg-white px-3 py-1 rounded-lg border border-gray-200 text-blue-600">
                {config.clusterCount}
              </div>
            </div>

            <input
              type="range"
              min={2}
              max={8}
              value={config.clusterCount}
              onChange={(e) => onChangeConfig({ ...config, clusterCount: Number(e.target.value) })}
              className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
              <span>2 Clusters</span>
              <span className="text-blue-600 font-semibold">5 Recommended</span>
              <span>8 Clusters</span>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <label className="text-xs font-bold text-gray-900 block">Clustering Algorithm</label>
            <div className="space-y-2">
              {[
                { id: 'kmeans', name: 'K-Means Clustering', desc: 'Centroid-based partitioning with Euclidean distance' },
                { id: 'hierarchical', name: 'Hierarchical (Agglomerative)', desc: 'Ward variance minimization tree' },
              ].map((algo) => (
                <label
                  key={algo.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors text-xs ${
                    config.algorithm === algo.id
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="algorithm"
                    checked={config.algorithm === algo.id}
                    onChange={() => onChangeConfig({ ...config, algorithm: algo.id as any })}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold block">{algo.name}</span>
                    <span className="text-[11px] text-gray-500">{algo.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Selection Checkboxes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              Feature Selection ({config.features.length} selected)
            </label>
            <span className="text-[11px] text-gray-500">
              Attributes will be standard scaled before clustering
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availableFeatures.map((feat) => {
              const isChecked = config.features.includes(feat.id);
              return (
                <div
                  key={feat.id}
                  onClick={() => handleToggleFeature(feat.id)}
                  className={`p-3 rounded-lg border cursor-pointer select-none transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-blue-50/50 border-blue-200 text-gray-900'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent div
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className={`text-xs font-semibold ${isChecked ? 'text-gray-900' : 'text-gray-600'}`}>
                      {feat.label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Trigger */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            Running segmentation sends an asynchronous request to the backend clustering endpoint.
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={onRunSegmentation}
            isLoading={isProcessing}
            leftIcon={<Sparkles className="w-5 h-5 text-white" />}
            className="w-full sm:w-auto shadow-md hover:shadow-lg font-bold tracking-wide"
          >
            Segment Customers
          </Button>
        </div>
      </div>
    </div>
  );
};
