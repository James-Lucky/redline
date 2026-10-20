"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export type MetricCardProps = {
  label: string;
  value: string;
  currencyPrefix?: string;
  change: string;
  isPositive?: boolean;
  timeRange?: string;
};

export function MetricCard({
  label,
  value,
  currencyPrefix,
  change,
  isPositive = true,
  timeRange = "From Jun 01,2024 To Jun 29, 2024",
}: MetricCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5 shadow-sm transition-all hover:border-[#2f3340]">
      {/* Top Header with Label & Change Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#8d939e]">{label}</span>
        <div
          className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold ${
            isPositive
              ? "bg-[#212638] text-[#7988cf]"
              : "bg-[#332124] text-[#ff5530]"
          }`}
        >
          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          <span>{change}</span>
        </div>
      </div>

      {/* Main Value */}
      <div className="mt-4 flex items-baseline">
        {currencyPrefix && (
          <span className="mr-1.5 text-2xl font-bold text-[#ff5530]">
            {currencyPrefix}
          </span>
        )}
        <span className="text-[28px] font-bold tracking-tight text-white">
          {value}
        </span>
      </div>

      {/* Date Range Subtext */}
      <p className="mt-4 text-[11px] font-normal text-[#5a606d]">
        {timeRange}
      </p>
    </div>
  );
}
