import React from 'react';
import { Customer, Cluster } from '../../types';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ClusterRadarChart } from '../charts/ClusterRadarChart';
import {
  User,
  CreditCard,
  ShoppingBag,
  Calendar,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerDetailsDrawerProps {
  customer: Customer | null;
  cluster?: Cluster;
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
}

export const CustomerDetailsDrawer: React.FC<CustomerDetailsDrawerProps> = ({
  customer,
  cluster,
  isOpen,
  onClose,
  currency = '₹',
}) => {
  const navigate = useNavigate();
  if (!customer) return null;

  // Normalize metrics for comparison radar chart (0-100 scale)
  const radarData = [
    {
      subject: 'Income',
      clusterValue: Math.min(100, Math.round((customer.annualIncome / 120000) * 100)),
      benchmarkValue: cluster ? Math.min(100, Math.round((cluster.averageIncome / 120000) * 100)) : 50,
      fullMark: 100,
    },
    {
      subject: 'Spend Score',
      clusterValue: customer.spendingScore,
      benchmarkValue: cluster ? Math.round(cluster.averageSpendingScore) : 50,
      fullMark: 100,
    },
    {
      subject: 'Frequency',
      clusterValue: Math.min(100, Math.round((customer.purchaseFrequency / 12) * 100)),
      benchmarkValue: cluster ? Math.min(100, Math.round((cluster.averagePurchaseFrequency / 12) * 100)) : 40,
      fullMark: 100,
    },
    {
      subject: 'Order Value',
      clusterValue: Math.min(100, Math.round((customer.averageOrderValue / 50000) * 100)),
      benchmarkValue: cluster ? Math.min(100, Math.round((cluster.averageOrderValue / 50000) * 100)) : 45,
      fullMark: 100,
    },
    {
      subject: 'Tenure',
      clusterValue: Math.min(100, Math.round((customer.tenure / 48) * 100)),
      benchmarkValue: cluster?.averageTenure ? Math.min(100, Math.round((cluster.averageTenure / 48) * 100)) : 50,
      fullMark: 100,
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Customer Profile</span>
          <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
            {customer.id}
          </span>
        </div>
      }
      subtitle="Detailed behavioral attributes, cluster assignment, and comparative metrics."
      width="lg"
    >
      <div className="space-y-6 text-xs">
        {/* Profile Card */}
        <div className="bg-gray-50/90 rounded-xl p-4 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
              {customer.name ? customer.name.charAt(0) : customer.id.slice(-2)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{customer.name || customer.id}</h3>
              <p className="text-gray-500 text-xs">{customer.email || `${customer.id.toLowerCase()}@client.com`}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-600 font-medium">
                  {customer.gender} • {customer.age} yrs
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
              Segment Assignment
            </p>
            {customer.cluster ? (
              <Badge variant="cluster" clusterId={customer.cluster} size="md">
                Cluster {customer.cluster}: {customer.clusterName || `Segment ${customer.cluster}`}
              </Badge>
            ) : (
              <span className="text-gray-400">Unsegmented</span>
            )}
          </div>
        </div>

        {/* Purchase & Financial Metrics Grid */}
        <div>
          <h4 className="font-semibold text-gray-900 text-xs mb-3 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-blue-600" />
            Behavioral &amp; Financial Metrics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block">Annual Income</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">
                {currency}{customer.annualIncome.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block">Spending Score</span>
              <span className="text-sm font-bold text-blue-600 mt-1 block">
                {customer.spendingScore} / 100
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block">Avg Order Value</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">
                {currency}{customer.averageOrderValue.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block">Purchase Frequency</span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">
                {customer.purchaseFrequency} / yr
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 text-gray-400" /> Total Purchases
              </span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">
                {customer.totalPurchases} orders
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" /> Recency
              </span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">
                {customer.recency} days ago
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" /> Customer Tenure
              </span>
              <span className="text-sm font-bold text-gray-900 mt-1 block">
                {customer.tenure} months
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
              <span className="text-[10px] text-gray-500 block flex items-center gap-1">
                <User className="w-3 h-3 text-gray-400" /> Est. Lifetime Value
              </span>
              <span className="text-sm font-bold text-green-600 mt-1 block">
                {currency}{(customer.totalPurchases * customer.averageOrderValue).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Multi-Attribute Radar Comparison */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-xs">
              Customer vs. Cluster Centroid Benchmark
            </h4>
            <span className="text-[11px] text-gray-500">Normalized Index (0-100)</span>
          </div>
          <ClusterRadarChart
            data={radarData}
            clusterName={`Customer ${customer.id}`}
            benchmarkName={cluster ? `Cluster ${cluster.id} Avg` : 'Benchmark'}
            clusterColor="#2563EB"
            height={250}
          />
        </div>

        {/* Cluster Characteristics Card */}
        {cluster && (
          <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-100 space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold text-blue-950 text-xs">
                {cluster.name} Cluster Profile
              </h5>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/clusters?id=${cluster.id}`);
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
              >
                View Full Cluster <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">{cluster.description}</p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-gray-700 block mb-1">
                Recommended Action:
              </span>
              <p className="text-[11px] text-gray-600 bg-white p-2.5 rounded-lg border border-blue-200">
                {cluster.recommendedAction}
              </p>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
