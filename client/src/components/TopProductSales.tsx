"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const products = [
  {
    name: "MagStand Pro 1",
    revenue: "$24,500",
    sales: "846",
    growth: "32%",
    isPositive: true,
    reviews: "570",
    views: "978",
  },
  {
    name: "MagStand Pro 2",
    revenue: "$16,300",
    sales: "598",
    growth: "26%",
    isPositive: true,
    reviews: "385",
    views: "945",
  },
  {
    name: "MagStand Pro 3",
    revenue: "$12,980",
    sales: "389",
    growth: "13%",
    isPositive: true,
    reviews: "127",
    views: "437",
  },
  {
    name: "MagStand Pro 4",
    revenue: "$10,984",
    sales: "265",
    growth: "11%",
    isPositive: false,
    reviews: "190",
    views: "265",
  },
];

export function TopProductSales() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-white">Top Product Sales</h3>
        <button
          type="button"
          className="text-[11px] font-medium text-[#737a89] transition-colors hover:text-white"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-[#21242e] text-[10px] uppercase tracking-wider text-[#646b7a]">
              <th className="pb-3 font-medium">PRODUCT</th>
              <th className="pb-3 font-medium">REVENUE</th>
              <th className="pb-3 font-medium">SALES</th>
              <th className="pb-3 font-medium">GROWTH</th>
              <th className="pb-3 font-medium">REVIEWS</th>
              <th className="pb-3 font-medium">VIEWS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e222a]">
            {products.map((item) => (
              <tr
                key={item.name}
                className="transition-colors hover:bg-white/[0.02]"
              >
                <td className="py-3 font-medium text-white">{item.name}</td>
                <td className="py-3 text-[#c2c7d2]">{item.revenue}</td>
                <td className="py-3 text-[#8f96a4]">{item.sales}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold ${
                      item.isPositive ? "text-[#7a88cf]" : "text-[#ff5530]"
                    }`}
                  >
                    {item.isPositive ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {item.growth}
                  </span>
                </td>
                <td className="py-3 text-[#8f96a4]">{item.reviews}</td>
                <td className="py-3 text-[#8f96a4]">{item.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProductSales;
