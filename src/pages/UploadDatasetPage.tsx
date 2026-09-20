import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CsvUploader } from '../components/dataset/CsvUploader';
import { DatasetStats } from '../components/dataset/DatasetStats';
import { DatasetPreview } from '../components/dataset/DatasetPreview';
import { Button } from '../components/common/Button';
import { Dataset } from '../types';
import { ArrowRight, Sparkles, Database, CheckCircle2 } from 'lucide-react';

export const UploadDatasetPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDataset, setSelectedDataset } = useApp();
  const [activePreviewDataset, setActivePreviewDataset] = useState<Dataset | null>(selectedDataset);

  const handleDatasetReady = (newDataset: Dataset) => {
    setActivePreviewDataset(newDataset);
    setSelectedDataset(newDataset);
  };

  const handleProceedToSegmentation = () => {
    if (activePreviewDataset) {
      setSelectedDataset(activePreviewDataset);
    }
    navigate('/segmentation');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Upload Dataset</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ingest structured customer transaction and demographic CSV datasets for model training and segmentation.
          </p>
        </div>

        {activePreviewDataset && (
          <Button
            variant="primary"
            onClick={handleProceedToSegmentation}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Configure Segmentation
          </Button>
        )}
      </div>

      {/* Upload Zone */}
      <CsvUploader onDatasetUploaded={handleDatasetReady} />

      {/* Dataset Stats and Inspection if dataset selected */}
      {activePreviewDataset && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Active Dataset Health &amp; Diagnostics
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Evaluated properties for <strong className="text-gray-800">{activePreviewDataset.name}</strong>
              </p>
            </div>

            <span className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Pre-validation Passed
            </span>
          </div>

          <DatasetStats dataset={activePreviewDataset} />

          {/* Dynamic Table Preview */}
          <DatasetPreview dataset={activePreviewDataset} />

          {/* Proceed Bottom Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-blue-950">
                Dataset ready for behavioral clustering
              </h4>
              <p className="text-xs text-blue-800 mt-0.5">
                Feature normalization and centroid partitioning can now be configured on this dataset.
              </p>
            </div>

            <Button
              size="md"
              variant="primary"
              onClick={handleProceedToSegmentation}
              leftIcon={<Sparkles className="w-4 h-4 text-white" />}
              rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
            >
              Start Segmentation Workflow
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
