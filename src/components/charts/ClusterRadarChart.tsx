import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  clusterValue: number;
  benchmarkValue: number;
  fullMark: number;
}

interface ClusterRadarChartProps {
  data: RadarDataPoint[];
  clusterName?: string;
  benchmarkName?: string;
  clusterColor?: string;
  height?: number;
}

export const ClusterRadarChart: React.FC<ClusterRadarChartProps> = ({
  data,
  clusterName = 'Cluster Profile',
  benchmarkName = 'Overall Average',
  clusterColor = '#2563EB',
  height = 320,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <Radar
            name={clusterName}
            dataKey="clusterValue"
            stroke={clusterColor}
            fill={clusterColor}
            fillOpacity={0.4}
          />
          <Radar
            name={benchmarkName}
            dataKey="benchmarkValue"
            stroke="#9CA3AF"
            fill="#9CA3AF"
            fillOpacity={0.2}
          />
          <Tooltip
            formatter={(value: any, name: any) => [`${value}/100`, name]}
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value: string) => <span className="text-xs text-gray-600 font-medium px-1">{value}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
