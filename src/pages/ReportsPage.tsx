import React, { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import { SegmentationReport } from '../types';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SkeletonTable } from '../components/common/LoadingSkeleton';
import { Download, FileText, Eye, Calendar, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { clusters, currency } = useApp();
  const { success, error: toastError } = useToast();

  const [reports, setReports] = useState<SegmentationReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Last 90 Days');
  const [selectedReport, setSelectedReport] = useState<SegmentationReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const data = await reportApi.getReports();
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = async (report: SegmentationReport, format: 'csv' | 'json') => {
    try {
      const blob = await reportApi.exportReport(report.id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.id}_${report.datasetName.replace('.csv', '')}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      success('Report Downloaded', `Exported ${report.id} in ${format.toUpperCase()} format.`);
    } catch (err) {
      toastError('Download Failed', 'Unable to download report.');
    }
  };

  // Analytics trend data across past 5 months
  const trendData = [
    { month: 'May 2026', HighValue: 18, Regular: 31, Potential: 16, AtRisk: 21, Budget: 14 },
    { month: 'Jun 2026', HighValue: 19, Regular: 30, Potential: 17, AtRisk: 20, Budget: 14 },
    { month: 'Jul 2026', HighValue: 21, Regular: 29, Potential: 18, AtRisk: 18, Budget: 14 },
    { month: 'Aug 2026', HighValue: 22, Regular: 29, Potential: 18, AtRisk: 17, Budget: 14 },
    { month: 'Sep 2026', HighValue: 22, Regular: 29, Potential: 18, AtRisk: 17, Budget: 14 },
  ];

  // Cluster comparison data
  const valueComparisonData = clusters.map((c) => ({
    name: `C${c.id}`,
    fullName: c.name,
    avgSpend: c.averageOrderValue,
    frequency: c.averagePurchaseFrequency,
    color: c.color,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports &amp; Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit historical segmentation runs, track cohort shift trends, and export analytical summary reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-medium"
            >
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Trend Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Longitudinal Cohort Share Trend */}
        <Card
          title="Customer Segment Size Evolution (%)"
          subtitle="Monthly migration and cohort distribution shifts over time"
        >
          <div className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} unit="%" />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="HighValue" name="High Value" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Regular" name="Regulars" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Potential" name="Potential" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="AtRisk" name="At-Risk" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Budget" name="Budget" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Avg Order Value by Cluster */}
        <Card
          title={`Average Customer Value by Cluster (${currency})`}
          subtitle="Mean transaction spend per order across identified segments"
        >
          <div className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueComparisonData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`${currency}${Number(val).toLocaleString()}`, 'Avg Order Value']}
                  labelFormatter={(lbl) => {
                    const item = valueComparisonData.find((d) => d.name === lbl);
                    return item ? `${item.name}: ${item.fullName}` : lbl;
                  }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                />
                <Bar dataKey="avgSpend" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Segmentation Run History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/60">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Segmentation Job History
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Previous cluster executions with dataset metrics, silhouette quality scores, and export options.
            </p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700">
                    Report ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700">
                    Dataset
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700">
                    Execution Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700">
                    Customers
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700">
                    Clusters
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700">
                    Silhouette Score
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-semibold text-gray-900">
                      {rep.id}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                      {rep.datasetName}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                      {rep.date}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
                      {rep.customers.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                        {rep.clusters} clusters
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-bold text-gray-900">{rep.silhouetteScore}</span>
                      <span className="text-[10px] text-gray-400 ml-1">/ 1.0</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="success" size="sm">
                        {rep.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleDownload(rep, 'csv')}
                        className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-blue-600 font-medium px-2 py-1 bg-gray-50 hover:bg-blue-50 rounded border border-gray-200 transition-colors"
                        title="Download CSV"
                      >
                        <Download className="w-3 h-3" /> CSV
                      </button>

                      <button
                        onClick={() => handleDownload(rep, 'json')}
                        className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-indigo-600 font-medium px-2 py-1 bg-gray-50 hover:bg-indigo-50 rounded border border-gray-200 transition-colors"
                        title="Download JSON"
                      >
                        <Download className="w-3 h-3" /> JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
