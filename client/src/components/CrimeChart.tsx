"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AnnualCrimeRecord } from "@/types/crime";

interface CrimeChartProps {
  annualData?: AnnualCrimeRecord[];
  activeCategory?: string;
  height?: number;
}

const fallbackMonthlyData = [
  { month: "Jan", sales: 3100, target: 2750 },
  { month: "Feb", sales: 4400, target: 3800 },
  { month: "Mar", sales: 3500, target: 4150 },
  { month: "Apr", sales: 4790, target: 3830 },
  { month: "May", sales: 4200, target: 4100 },
  { month: "Jun", sales: 5350, target: 4700 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const val1 = payload[0]?.value;
    const val2 = payload[1]?.value;

    return (
      <div className="rounded-xl border border-[#2b303c] bg-[#1a1c22] p-3 text-[11px] shadow-2xl backdrop-blur-md">
        <p className="font-semibold text-white/90 mb-1.5">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5530]" />
            <span className="text-[#8c92a0]">Recorded cases:</span>
            <span className="font-semibold text-white">
              {Number(val1).toLocaleString()}
            </span>
          </div>
          {val2 !== undefined && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5d6b98]" />
              <span className="text-[#8c92a0]">Target / Baseline:</span>
              <span className="font-semibold text-white">
                {Number(val2).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export function CrimeChart({
  annualData,
  height = 235,
}: CrimeChartProps) {
  const chartData = useMemo(() => {
    if (annualData && annualData.length > 0) {
      return annualData.map((d) => ({
        label: `${d.year}`,
        sales: d.total_ipc_crimes,
        target: Math.round(d.total_ipc_crimes * 0.88),
      }));
    }
    return fallbackMonthlyData.map((d) => ({
      label: d.month,
      sales: d.sales,
      target: d.target,
    }));
  }, [annualData]);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      {/* Header and Legend */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-white font-heading">
          Monthly Sales performance
        </h3>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-[#8d939e]">
            <span className="h-0.5 w-3.5 bg-[#ff5530] rounded-full inline-block" />
            <span>Sales</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8d939e]">
            <span className="h-0.5 w-3.5 bg-[#5d6b98] rounded-full inline-block" />
            <span>Target</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full pt-1" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#21252e"
              strokeDasharray="0 0"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#626978", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#626978", fontSize: 11 }}
              tickFormatter={(val) =>
                val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Smooth Curve (Coral Red) */}
            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#ff5530"
              strokeWidth={2.2}
              dot={{ r: 3, fill: "#ff5530", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#ff5530", stroke: "#ffffff", strokeWidth: 2 }}
            />
            {/* Smooth Target Curve (Indigo / Slate) */}
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#5d6b98"
              strokeWidth={2}
              dot={{ r: 3, fill: "#5d6b98", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#5d6b98", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Backwards compatibility alias
export const MonthlySalesChart = CrimeChart;
export const CrimeTrendChart = CrimeChart;
export default CrimeChart;
