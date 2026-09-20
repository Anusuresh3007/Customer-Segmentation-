import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Trash2, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { Button } from '../common/Button';
import { Dataset } from '../../types';
import { datasetApi } from '../../api/datasetApi';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

interface CsvUploaderProps {
  onDatasetUploaded: (dataset: Dataset) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onDatasetUploaded }) => {
  const { success, error: toastError } = useToast();
  const { setSelectedDataset, addActivity } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toastError('Invalid File Format', 'Please select a valid CSV (.csv) file.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toastError('File Too Large', 'Maximum supported file size is 50 MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const newDataset = await datasetApi.uploadDataset(selectedFile);
      success('Dataset Ingested Successfully', `Processed ${newDataset.rowCount.toLocaleString()} records from ${newDataset.name}.`);
      setSelectedDataset(newDataset);
      addActivity('Dataset uploaded', `${newDataset.name} (${(newDataset.size / (1024 * 1024)).toFixed(1)} MB)`, 'upload');
      onDatasetUploaded(newDataset);
      setSelectedFile(null);
    } catch (err: any) {
      toastError('Upload Failed', err.message || 'Unable to process CSV file.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleTemplate = () => {
    const sampleHeaders = 'CustomerID,Age,Gender,AnnualIncome,SpendingScore,PurchaseFrequency,AverageOrderValue,TotalPurchases,Recency,Tenure\n';
    const sampleRows = `CUST-101,35,Female,72000,78,6,28000,24,15,30\nCUST-102,48,Male,54000,45,3,16500,14,40,20\nCUST-103,24,Female,38000,62,5,12000,10,18,12\n`;
    const blob = new Blob([sampleHeaders + sampleRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_segmentation_sample_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-white ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".csv"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Drop your CSV file here, or{' '}
            <span className="text-blue-600 hover:underline">Browse Files</span>
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
            Supports standardized CSV datasets containing customer purchase, demographic, and behavioral metrics.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
            <span>• Max file size: <strong>50 MB</strong></span>
            <span>• Format: <strong>UTF-8 CSV</strong></span>
            <span>• Delimiter: <strong>Comma (,)</strong></span>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{selectedFile.name}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for analysis
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
                leftIcon={<Trash2 className="w-4 h-4 text-gray-500" />}
              >
                Remove
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleProcessUpload}
                isLoading={isUploading}
              >
                Analyze Dataset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Requirements & Sample Downloader Banner */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800">Dataset Column Guidelines</p>
            <p className="text-gray-500 mt-0.5">
              Ideal columns: <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-700">CustomerID</code>, <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-700">Age</code>, <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-700">AnnualIncome</code>, <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-700">SpendingScore</code>, <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-700">PurchaseFrequency</code>.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={downloadSampleTemplate}
          className="shrink-0"
        >
          Download Sample CSV
        </Button>
      </div>
    </div>
  );
};
