import React, { useState } from 'react';
import { Customer } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Download, CheckCircle2, AlertTriangle, FileSpreadsheet, Copy } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import { useToast } from '../../context/ToastContext';

interface BulkEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ValidationSummary {
  valid: Customer[];
  invalid: { line: number; raw: string; error: string }[];
  duplicates: string[];
}

export const BulkEntryModal: React.FC<BulkEntryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { success, error: toastError } = useToast();
  const [csvText, setCsvText] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleCsvData = `CustomerID,Age,Gender,AnnualIncome,SpendingScore,PurchaseFrequency,AverageOrderValue,TotalPurchases,Recency,Tenure
CUST-9001,34,Female,78000,82,7,32000,28,12,24
CUST-9002,45,Male,52000,58,4,18500,16,28,18
CUST-9003,26,Female,41000,48,3,11000,9,20,10
CUST-9004,58,Male,67000,22,2,9500,12,140,22
CUST-9005,29,Male,26000,32,2,5400,6,38,12
CUST-9006,-5,InvalidGender,ABC,150,0,0,0,-10,0
CUST-1001,38,Male,98000,89,9,44200,42,8,36`;

  const handleInsertSample = () => {
    setCsvText(sampleCsvData);
    setValidationResult(null);
  };

  const validateCsv = () => {
    if (!csvText.trim()) {
      toastError('Empty Input', 'Please paste CSV content to validate.');
      return;
    }

    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length <= 1) {
      toastError('Invalid CSV', 'CSV must contain at least a header row and one data row.');
      return;
    }

    const valid: Customer[] = [];
    const invalid: { line: number; raw: string; error: string }[] = [];
    const seenIds = new Set<string>();
    const duplicates: string[] = [];

    // Parse header
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const idIdx = headers.findIndex((h) => h.includes('id'));
    const ageIdx = headers.findIndex((h) => h.includes('age'));
    const genderIdx = headers.findIndex((h) => h.includes('gender'));
    const incomeIdx = headers.findIndex((h) => h.includes('income'));
    const scoreIdx = headers.findIndex((h) => h.includes('score'));
    const freqIdx = headers.findIndex((h) => h.includes('freq'));
    const aovIdx = headers.findIndex((h) => h.includes('aov') || h.includes('order') || h.includes('spend'));
    const totalIdx = headers.findIndex((h) => h.includes('total'));
    const recencyIdx = headers.findIndex((h) => h.includes('recency'));
    const tenureIdx = headers.findIndex((h) => h.includes('tenure'));

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));

      const id = idIdx !== -1 ? parts[idIdx] : parts[0];
      if (!id) {
        invalid.push({ line: i + 1, raw: line, error: 'Missing Customer ID' });
        continue;
      }

      if (seenIds.has(id.toLowerCase())) {
        duplicates.push(id);
        invalid.push({ line: i + 1, raw: line, error: `Duplicate ID in dataset: ${id}` });
        continue;
      }
      seenIds.add(id.toLowerCase());

      const age = ageIdx !== -1 ? Number(parts[ageIdx]) : Number(parts[1]);
      const gender = (genderIdx !== -1 ? parts[genderIdx] : parts[2]) || 'Other';
      const annualIncome = incomeIdx !== -1 ? Number(parts[incomeIdx]) : Number(parts[3]);
      const spendingScore = scoreIdx !== -1 ? Number(parts[scoreIdx]) : Number(parts[4]);
      const purchaseFrequency = freqIdx !== -1 ? Number(parts[freqIdx]) : Number(parts[5] || 4);
      const averageOrderValue = aovIdx !== -1 ? Number(parts[aovIdx]) : Number(parts[6] || 15000);
      const totalPurchases = totalIdx !== -1 ? Number(parts[totalIdx]) : Number(parts[7] || 10);
      const recency = recencyIdx !== -1 ? Number(parts[recencyIdx]) : Number(parts[8] || 30);
      const tenure = tenureIdx !== -1 ? Number(parts[tenureIdx]) : Number(parts[9] || 12);

      if (isNaN(age) || age < 18 || age > 110) {
        invalid.push({ line: i + 1, raw: line, error: `Invalid Age: "${parts[1]}" (must be 18-110)` });
        continue;
      }
      if (isNaN(annualIncome) || annualIncome < 0) {
        invalid.push({ line: i + 1, raw: line, error: `Invalid Income: "${parts[3]}"` });
        continue;
      }
      if (isNaN(spendingScore) || spendingScore < 1 || spendingScore > 100) {
        invalid.push({ line: i + 1, raw: line, error: `Invalid Spending Score: "${parts[4]}" (must be 1-100)` });
        continue;
      }

      valid.push({
        id,
        name: `Customer ${id}`,
        email: `${id.toLowerCase()}@customer.com`,
        age,
        gender: ['Male', 'Female'].includes(gender) ? (gender as 'Male' | 'Female') : 'Other',
        annualIncome,
        spendingScore,
        purchaseFrequency: isNaN(purchaseFrequency) ? 3 : purchaseFrequency,
        averageOrderValue: isNaN(averageOrderValue) ? 10000 : averageOrderValue,
        totalPurchases: isNaN(totalPurchases) ? 10 : totalPurchases,
        recency: isNaN(recency) ? 20 : recency,
        tenure: isNaN(tenure) ? 12 : tenure,
        cluster: (valid.length % 5) + 1,
      });
    }

    setValidationResult({ valid, invalid, duplicates });
  };

  const handleImportValid = async () => {
    if (!validationResult || validationResult.valid.length === 0) return;

    setIsProcessing(true);
    try {
      const res = await customerApi.bulkCreateCustomers(validationResult.valid);
      success(
        'Bulk Import Completed',
        `Successfully imported ${res.added} customer records (${res.errors} duplicates skipped).`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError('Import Failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadErrorReport = () => {
    if (!validationResult || validationResult.invalid.length === 0) return;
    const header = 'Line,OriginalContent,ValidationError\n';
    const rows = validationResult.invalid
      .map((item) => `${item.line},"${item.raw.replace(/"/g, '""')}","${item.error}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer_bulk_errors_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Customer Entry"
      subtitle="Paste comma-separated rows or upload CSV text to validate and import customer records."
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-800 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            Paste CSV Data
          </label>
          <button
            type="button"
            onClick={handleInsertSample}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
          >
            <Copy className="w-3.5 h-3.5" />
            Insert Sample CSV
          </button>
        </div>

        <textarea
          rows={7}
          value={csvText}
          onChange={(e) => {
            setCsvText(e.target.value);
            setValidationResult(null);
          }}
          placeholder="CustomerID,Age,Gender,AnnualIncome,SpendingScore,PurchaseFrequency,AverageOrderValue..."
          className="w-full font-mono text-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all leading-relaxed"
        />

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={validateCsv}>
            Validate Records
          </Button>
        </div>

        {/* Validation Results Panel */}
        {validationResult && (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 space-y-3 animate-in fade-in">
            <h4 className="font-semibold text-gray-900 text-xs">Validation Results</h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-[11px] text-green-700 font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Valid Records
                </p>
                <p className="text-lg font-bold text-green-900 mt-1">
                  {validationResult.valid.length}
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-[11px] text-red-700 font-medium flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Invalid Records
                </p>
                <p className="text-lg font-bold text-red-900 mt-1">
                  {validationResult.invalid.length}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <p className="text-[11px] text-amber-700 font-medium flex items-center justify-center gap-1">
                  <Copy className="w-3.5 h-3.5 text-amber-600" /> Duplicates
                </p>
                <p className="text-lg font-bold text-amber-900 mt-1">
                  {validationResult.duplicates.length}
                </p>
              </div>
            </div>

            {validationResult.invalid.length > 0 && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-red-600 text-xs">
                  {validationResult.invalid.length} records have validation issues.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleDownloadErrorReport}
                >
                  Download Error Report
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImportValid}
            disabled={!validationResult || validationResult.valid.length === 0}
            isLoading={isProcessing}
          >
            Add {validationResult?.valid.length || 0} Valid Records
          </Button>
        </div>
      </div>
    </Modal>
  );
};
