import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { segmentationApi } from '../api/segmentationApi';
import { SegmentationConfig as ConfigType, SegmentationResult } from '../types';
import { SegmentationConfig } from '../components/segmentation/SegmentationConfig';
import { SegmentationProgress } from '../components/segmentation/SegmentationProgress';
import { SegmentationResults } from '../components/segmentation/SegmentationResults';
import { Modal } from '../components/common/Modal';
import { Database, CheckCircle2 } from 'lucide-react';

export const SegmentationPage: React.FC = () => {
  const { selectedDataset, setSelectedDataset, datasets, latestResult, setLatestResult } = useApp();
  const { success, error: toastError, warning } = useToast();

  const [config, setConfig] = useState<ConfigType>({
    datasetId: selectedDataset?.id || 'ds-2026-01',
    clusterCount: 5,
    features: ['Age', 'Annual Income', 'Spending Score', 'Purchase Frequency', 'Average Order Value', 'Recency'],
    algorithm: 'kmeans',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepMessage, setStepMessage] = useState('Initializing cluster runner...');
  const [currentResult, setCurrentResult] = useState<SegmentationResult | null>(latestResult);
  const [isChangeDatasetOpen, setIsChangeDatasetOpen] = useState(false);

  const abortSignalRef = useRef<{ aborted: boolean }>({ aborted: false });

  const handleRunSegmentation = async () => {
    if (config.features.length === 0) {
      toastError('Feature Selection Required', 'Please select at least one feature attribute for clustering.');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(1);
    setStepMessage('Validating customer dataset integrity...');
    abortSignalRef.current = { aborted: false };

    try {
      const res = await segmentationApi.runSegmentation(
        {
          ...config,
          datasetId: selectedDataset?.id || 'ds-2026-01',
        },
        (step, total, msg) => {
          setCurrentStep(step);
          setStepMessage(msg);
        },
        abortSignalRef.current
      );

      setCurrentResult(res);
      setLatestResult(res);
      success(
        'Segmentation Complete',
        `Successfully partitioned ${res.totalCustomers.toLocaleString()} customers into ${res.clusterCount} cohorts.`
      );
    } catch (err: any) {
      if (err.message.includes('cancelled')) {
        warning('Job Cancelled', 'Segmentation job was cancelled.');
      } else {
        toastError('Segmentation Failed', err.message || 'Please check dataset attributes.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    abortSignalRef.current.aborted = true;
    setIsProcessing(false);
  };

  const handleReconfigure = () => {
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Segmentation</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure model hyperparameters and run unsupervised centroid clustering on customer datasets.
        </p>
      </div>

      {/* Main Content: Running Progress | Results View | Configuration View */}
      {isProcessing ? (
        <SegmentationProgress
          currentStep={currentStep}
          totalSteps={5}
          stepMessage={stepMessage}
          onCancel={handleCancel}
        />
      ) : currentResult ? (
        <SegmentationResults
          result={currentResult}
          onReconfigure={handleReconfigure}
        />
      ) : (
        <SegmentationConfig
          dataset={selectedDataset}
          config={config}
          onChangeConfig={setConfig}
          onRunSegmentation={handleRunSegmentation}
          onChangeDataset={() => setIsChangeDatasetOpen(true)}
          isProcessing={isProcessing}
        />
      )}

      {/* Change Dataset Modal */}
      <Modal
        isOpen={isChangeDatasetOpen}
        onClose={() => setIsChangeDatasetOpen(false)}
        title="Select Target Dataset"
        subtitle="Choose which ingested customer dataset to run segmentation on."
        maxWidth="md"
      >
        <div className="space-y-2 text-xs">
          {datasets.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                setSelectedDataset(d);
                setConfig((prev) => ({ ...prev, datasetId: d.id }));
                setIsChangeDatasetOpen(false);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                selectedDataset?.id === d.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-bold text-gray-900">{d.name}</h4>
                  <p className="text-[11px] text-gray-500">
                    {d.rowCount.toLocaleString()} customers • {d.columnCount} columns
                  </p>
                </div>
              </div>

              {selectedDataset?.id === d.id && (
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
