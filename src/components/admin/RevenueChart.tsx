"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export interface DailyRevenue {
  date: string;
  glamping: number;
  cafe: number;
  pool: number;
}

interface RevenueChartProps {
  data: DailyRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Custom formatter for Rupiah
  const formatRupiah = (value: number) => {
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}K`;
    return `Rp ${value}`;
  };

  return (
    <div className="h-[400px] w-full mt-8 bg-surface-900 border border-surface-600/30 p-6 rounded-sm">
      <h2 className="text-sm uppercase tracking-widest text-surface-200 mb-6">Tren Pendapatan (7 Hari Terakhir)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#a1a1aa", fontSize: 12 }} 
            tickMargin={12}
            axisLine={{ stroke: "#3f3f46" }}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatRupiah} 
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickMargin={12}
          />
          <Tooltip 
            cursor={{ fill: '#27272a' }}
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '4px' }}
            itemStyle={{ color: '#f4f4f5' }}
            formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, ""]}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = { glamping: "Glamping", cafe: "Kafe", pool: "Kolam" };
              return <span className="text-surface-200 text-xs ml-1">{labels[value] || value}</span>;
            }}
          />
          <Bar dataKey="glamping" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} />
          <Bar dataKey="cafe" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
          <Bar dataKey="pool" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
