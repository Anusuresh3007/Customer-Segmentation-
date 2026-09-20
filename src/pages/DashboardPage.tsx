import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Layers,
  CreditCard,
  Clock,
  Database,
  CheckCircle2,
  Sparkles,
  UploadCloud,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { CustomerDistributionChart } from '../components/charts/CustomerDistributionChart';
import { SegmentOverviewCard } from '../components/dashboard/SegmentOverviewCard';
import { ActivityPanel } from '../components/dashboard/ActivityPanel';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDataset, clusters, activities, currency } = useApp();

  const totalCustomers = selectedDataset ? selectedDataset.rowCount : 24582;
  const datasetSizeMb = selectedDataset ? (selectedDataset.size / (1024 * 1024)).toFixed(1) : '4.8';

  return (
    <div className="space-y-8">
      {/* Top Header & CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-600" /> Administrative &amp; Behavioral Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            Customer Segmentation
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Analyze customer behavior, evaluate purchasing patterns, and discover meaningful customer cohorts using unsupervised machine learning.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => navigate('/upload')}
            leftIcon={<UploadCloud className="w-4 h-4 text-gray-600" />}
          >
            Upload Dataset
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate('/segmentation')}
            leftIcon={<Sparkles className="w-4 h-4 text-white" />}
            className="shadow-sm"
          >
            Segment Customers
          </Button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Total Customers"
          value={totalCustomers.toLocaleString()}
          icon={<Users className="w-4 h-4 text-blue-600" />}
          change={{ value: '+12.4%', trend: 'up', label: 'vs prev dataset' }}
        />

        <MetricCard
          label="Segments Identified"
          value={clusters.length}
          icon={<Layers className="w-4 h-4 text-indigo-600" />}
          supportingText="Optimal K clusters"
        />

        <MetricCard
          label="Avg Customer Value"
          value={`${currency}18,450`}
          icon={<CreditCard className="w-4 h-4 text-green-600" />}
          change={{ value: '+5.8%', trend: 'up' }}
        />

        <MetricCard
          label="Last Segmentation"
          value="2 min ago"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
          supportingText="K-Means (k=5)"
        />

        <MetricCard
          label="Dataset Size"
          value={`${datasetSizeMb} MB`}
          icon={<Database className="w-4 h-4 text-purple-600" />}
          supportingText={selectedDataset?.name || 'customers.csv'}
        />

        <MetricCard
          label="Segmentation Status"
          value="Ready"
          icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
          badgeText="Completed"
          badgeVariant="success"
          supportingText="Silhouette 0.71"
        />
      </div>

      {/* Customer Distribution Chart Section */}
      <Card
        title="Customer Distribution by Segment"
        subtitle="Distribution of customers mapped across cluster centroids. Hover to inspect or click to view cohort details."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/clusters')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore All Clusters
          </Button>
        }
      >
        <div className="pt-2">
          <CustomerDistributionChart
            clusters={clusters}
            height={320}
            onSelectCluster={(id) => navigate(`/clusters?id=${id}`)}
          />
        </div>
      </Card>

      {/* Two Column Section: Segment Overview Cards & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment Overview (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Segment Overview</h3>
              <p className="text-xs text-gray-500">
                Key traits, spend behavior, and volume breakdown for active clusters.
              </p>
            </div>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/clusters')}>
              Detailed Matrix →
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clusters.map((cluster) => (
              <SegmentOverviewCard
                key={cluster.id}
                cluster={cluster}
                currency={currency}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity Panel (1 Col) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
            <p className="text-xs text-gray-500">
              Audit log of dataset ingestions and segmentation jobs.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-card">
            <ActivityPanel activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};
