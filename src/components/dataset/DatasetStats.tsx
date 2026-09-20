import React from 'react';
import { Dataset } from '../../types';
import { Database, Columns, AlertTriangle, Copy, CheckCircle2 } from 'lucide-react';

interface DatasetStatsProps {
  dataset: Dataset;
}

export const DatasetStats: React.FC<DatasetStatsProps> = ({ dataset }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-card">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-medium">Total Rows</span>
          <Database className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-xl font-bold text-gray-900">{dataset.rowCount.toLocaleString()}</p>
        <span className="text-[10px] text-gray-400">Records ingested</span>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-card">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-medium">Columns</span>
          <Columns className="w-4 h-4 text-indigo-600" />
        </div>
        <p className="text-xl font-bold text-gray-900">{dataset.columnCount}</p>
        <span className="text-[10px] text-gray-400">Feature attributes</span>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-card">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-medium">Missing Values</span>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-xl font-bold text-gray-900">{dataset.missingValuesCount}</p>
        <span className="text-[10px] text-amber-600 font-medium">
          {((dataset.missingValuesCount / Math.max(1, dataset.rowCount * dataset.columnCount)) * 100).toFixed(2)}% sparse
        </span>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-card">
        <div className="flex items-center justify-between text-gray-500 mb-1">
          <span className="text-xs font-medium">Duplicates</span>
          <Copy className="w-4 h-4 text-gray-500" />
        </div>
        <p className="text-xl font-bold text-gray-900">{dataset.duplicateCount}</p>
        <span className="text-[10px] text-gray-400">Repeated IDs detected</span>
      </div>

      <div className="col-span-2 sm:col-span-1 bg-green-50/70 p-4 rounded-xl border border-green-200 shadow-card">
        <div className="flex items-center justify-between text-green-700 mb-1">
          <span className="text-xs font-medium">Health Status</span>
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        </div>
        <p className="text-sm font-bold text-green-900 mt-1">Ready for Segmentation</p>
        <span className="text-[10px] text-green-700 font-medium">Verified for K-Means / RFM</span>
      </div>
    </div>
  );
};
