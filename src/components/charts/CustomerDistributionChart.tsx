import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Cluster } from '../../types';
import { useNavigate } from 'react-router-dom';

interface CustomerDistributionChartProps {
  clusters: Cluster[];
  height?: number;
  onSelectCluster?: (clusterId: number) => void;
}

export const CustomerDistributionChart: React.FC<CustomerDistributionChartProps> = ({
  clusters,
  height = 300,
  onSelectCluster,
}) => {
  const navigate = useNavigate();

  const data = clusters.map((c) => ({
    id: c.id,
    name: `Cluster ${c.id}`,
    label: c.name,
    customers: c.customerCount,
    percentage: c.percentage,
    avgSpend: c.averageOrderValue,
    color: c.color,
  }));

  const handleClick = (dataPoint: any) => {
    if (onSelectCluster) {
      onSelectCluster(dataPoint.id);
    } else {
      navigate(`/clusters?id=${dataPoint.id}`);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs space-y-1">
          <p className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: {item.label}
          </p>
          <div className="text-gray-600 space-y-0.5 pt-1 border-t border-gray-100">
            <p>
              Count: <span className="font-medium text-gray-900">{item.customers.toLocaleString()} customers</span>
            </p>
            <p>
              Share: <span className="font-medium text-gray-900">{item.percentage}% of total</span>
            </p>
            <p>
              Avg Order Value: <span className="font-medium text-gray-900">₹{item.avgSpend.toLocaleString()}</span>
            </p>
          </div>
          <p className="text-[10px] text-blue-600 font-medium pt-1">Click to view cluster details →</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          className="cursor-pointer"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="customers"
            radius={[6, 6, 0, 0]}
            onClick={(d) => handleClick(d)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
