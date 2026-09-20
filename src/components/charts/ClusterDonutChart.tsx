import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Cluster } from '../../types';

interface ClusterDonutChartProps {
  clusters: Cluster[];
  height?: number;
  onSelectCluster?: (clusterId: number) => void;
}

export const ClusterDonutChart: React.FC<ClusterDonutChartProps> = ({
  clusters,
  height = 300,
  onSelectCluster,
}) => {
  const data = clusters.map((c) => ({
    id: c.id,
    name: `Cluster ${c.id}: ${c.name}`,
    shortName: `Cluster ${c.id}`,
    value: c.customerCount,
    percentage: c.percentage,
    color: c.color,
  }));

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
            {item.name}
          </p>
          <div className="text-gray-600 space-y-0.5 pt-1 border-t border-gray-100">
            <p>
              Count: <span className="font-medium text-gray-900">{item.value.toLocaleString()} customers</span>
            </p>
            <p>
              Proportion: <span className="font-medium text-gray-900">{item.percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={3}
            dataKey="value"
            onClick={(d: any) => onSelectCluster && onSelectCluster(d.id)}
            className="cursor-pointer"
          >
            {data.map((entry, index) => (
              <Cell key={`donut-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value: string) => (
              <span className="text-xs text-gray-600 font-medium px-1 truncate">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
