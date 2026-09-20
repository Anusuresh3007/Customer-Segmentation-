import React, { useState } from 'react';
import { SegmentationResult } from '../../types';
import { MetricCard } from '../dashboard/MetricCard';
import { CustomerDistributionChart } from '../charts/CustomerDistributionChart';
import { ClusterDonutChart } from '../charts/ClusterDonutChart';
import { ClusterComparisonTable } from './ClusterComparisonTable';
import { Button } from '../common/Button';
import {
  Users,
  Layers,
  Sparkles,
  Clock,
  Award,
  BarChart2,
  PieChart as PieIcon,
  RotateCcw,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SegmentationResultsProps {
  result: SegmentationResult;
  onReconfigure: () => void;
}

export const SegmentationResults: React.FC<SegmentationResultsProps> = ({
  result,
  onReconfigure,
}) => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');

  // Find largest cluster
  const largestCluster = [...result.clusters].sort((a, b) => b.customerCount - a.customerCount)[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Completion Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Segmentation Complete
            </span>
            <span className="text-white/70 text-xs">Dataset: {result.datasetName}</span>
          </div>
          <h2 className="text-xl font-bold mt-2 tracking-tight">
            {result.totalCustomers.toLocaleString()} customers analyzed across {result.clusterCount} distinct behavioral clusters
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Processing completed in {result.processingTime} seconds with an average silhouette score of {result.silhouetteScore}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onReconfigure}
            leftIcon={<RotateCcw className="w-4 h-4 text-blue-600" />}
            className="bg-white text-blue-700 hover:bg-blue-50 border-0"
          >
            Reconfigure
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/explorer')}
            leftIcon={<Compass className="w-4 h-4 text-white" />}
            className="bg-blue-900/40 hover:bg-blue-900/60 text-white border border-white/20"
          >
            Explore Customers
          </Button>
        </div>
      </div>

      {/* Result Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Customers"
          value={result.totalCustomers.toLocaleString()}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          supportingText="Dataset population"
        />

        <MetricCard
          label="Clusters"
          value={result.clusterCount}
          icon={<Layers className="w-5 h-5 text-indigo-600" />}
          supportingText="Optimal K identified"
        />

        <MetricCard
          label="Largest Segment"
          value={`Cluster ${largestCluster?.id || 1}`}
          icon={<Award className="w-5 h-5 text-green-600" />}
          badgeText={`${largestCluster?.percentage || 0}% share`}
          badgeVariant="success"
        />

        <MetricCard
          label="Silhouette Score"
          value={result.silhouetteScore.toFixed(2)}
          icon={<Sparkles className="w-5 h-5 text-amber-500" />}
          badgeText={result.silhouetteScore > 0.7 ? 'Strong Separation' : 'Good Fit'}
          badgeVariant={result.silhouetteScore > 0.7 ? 'success' : 'info'}
        />

        <MetricCard
          label="Processing Time"
          value={`${result.processingTime}s`}
          icon={<Clock className="w-5 h-5 text-gray-600" />}
          supportingText="Algorithm execution"
        />
      </div>

      {/* Cluster Distribution Visualizer */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Cluster Population Breakdown</h3>
            <p className="text-xs text-gray-500">
              Interactive distribution of customers per identified cohort.
            </p>
          </div>

          {/* Toggle View */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                chartType === 'bar' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Bar Chart
            </button>
            <button
              onClick={() => setChartType('donut')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                chartType === 'donut' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" /> Donut Chart
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="pt-2">
          {chartType === 'bar' ? (
            <CustomerDistributionChart clusters={result.clusters} height={320} />
          ) : (
            <ClusterDonutChart clusters={result.clusters} height={320} />
          )}
        </div>

        {/* Legend Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-gray-100">
          {result.clusters.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/clusters?id=${c.id}`)}
              className="p-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="font-semibold text-gray-900 text-xs truncate">
                  Cluster {c.id}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-gray-600">
                <span className="font-bold text-gray-900">{c.percentage}%</span>
                <span className="text-[11px] text-gray-400 font-mono">{c.customerCount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cluster Comparison Table */}
      <ClusterComparisonTable clusters={result.clusters} />
    </div>
  );
};
