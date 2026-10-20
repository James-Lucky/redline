"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", sales: 3100, target: 2750 },
  { month: "Feb", sales: 4400, target: 3800 },
  { month: "Mar", sales: 3500, target: 4150 },
  { month: "Apr", sales: 4790, target: 3830 },
  { month: "May", sales: 4200, target: 4100 },
  { month: "Jun", sales: 5350, target: 4700 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const salesVal = payload.find((p: any) => p.dataKey === "sales")?.value;
    const targetVal = payload.find((p: any) => p.dataKey === "target")?.value;

    return (
      <div className="rounded-xl border border-[#2b303c] bg-[#1a1c22] p-3 text-[11px] shadow-2xl backdrop-blur-md">
        <p className="font-semibold text-white/90 mb-1.5">{label} 1, 2025</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5530]" />
            <span className="text-[#8c92a0]">Total sales:</span>
            <span className="font-semibold text-white">{salesVal?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#5d6b98]" />
            <span className="text-[#8c92a0]">Target sales:</span>
            <span className="font-semibold text-white">{targetVal?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function MonthlySalesChart() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      {/* Header and Legend */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-white">
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
      <div className="h-[235px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#21252e"
              strokeDasharray="0 0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#626978", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#626978", fontSize: 11 }}
              domain={[0, 6000]}
              ticks={[0, 1500, 3000, 4500, 6000]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Smooth Sales Curve (Coral Red) */}
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

// Retain alias export for backwards compatibility
export const CrimeTrendChart = MonthlySalesChart;
export default MonthlySalesChart;
