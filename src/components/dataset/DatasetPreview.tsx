import React from 'react';
import { Dataset } from '../../types';

interface DatasetPreviewProps {
  dataset: Dataset;
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ dataset }) => {
  const columns = dataset.columns || Object.keys(dataset.sampleRows[0] || {});
  const rows = dataset.sampleRows || [];

  if (rows.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-xs bg-white rounded-xl border border-gray-200">
        No preview rows available for this dataset.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/60">
        <div>
          <h4 className="text-xs font-bold text-gray-900">Dataset Inspection Preview</h4>
          <p className="text-[11px] text-gray-500">
            Displaying sample sample {rows.length} rows of {dataset.rowCount.toLocaleString()} total
          </p>
        </div>
        <span className="text-[11px] font-mono bg-gray-200/80 px-2 py-0.5 rounded text-gray-700">
          {columns.length} columns detected
        </span>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-12">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-3 py-2 whitespace-nowrap font-mono text-[11px] text-gray-400">
                  {idx + 1}
                </td>
                {columns.map((col) => {
                  const val = row[col];
                  const isNull = val === undefined || val === null || val === '';
                  return (
                    <td
                      key={col}
                      className={`px-4 py-2 whitespace-nowrap ${
                        isNull ? 'text-amber-500 italic text-[11px]' : 'text-gray-800'
                      }`}
                    >
                      {isNull ? 'null' : typeof val === 'number' ? val.toLocaleString() : String(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
