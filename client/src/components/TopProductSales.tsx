"use client";

import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, ShieldAlert, MapPin } from "lucide-react";
import Link from "next/link";
import { getDelhiDistrictCrimeData } from "@/lib/data/loadCrimeData";

interface DistrictRankingsProps {
  onSelectDistrict?: (districtName: string) => void;
  selectedDistrict?: string | null;
  searchFilter?: string;
}

export function DistrictRankings({
  onSelectDistrict,
  selectedDistrict,
  searchFilter = "",
}: DistrictRankingsProps) {
  const records = useMemo(() => {
    const all = getDelhiDistrictCrimeData();
    const territorial = all.filter((d) => d.geographyType === "police_district");
    const totalTerritorialIpc = territorial.reduce((acc, cur) => acc + cur.totalIpc, 0);

    const mapped = territorial.map((item) => {
      const violent = item.murder + item.robbery + item.rape;
      const share = totalTerritorialIpc > 0
        ? ((item.totalIpc / totalTerritorialIpc) * 100).toFixed(1)
        : "0";

      return {
        name: item.displayName,
        rawName: item.district,
        totalIpc: item.totalIpc,
        theft: item.theft,
        violent,
        burglary: item.burglary,
        share: `${share}%`,
        isHigh: item.totalIpc > 7000,
      };
    });

    mapped.sort((a, b) => b.totalIpc - a.totalIpc);

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return mapped.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.rawName.toLowerCase().includes(q)
      );
    }

    return mapped;
  }, [searchFilter]);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white font-heading flex items-center gap-2">
            <ShieldAlert size={16} className="text-[#ff5530]" />
            Delhi Territorial Districts Ranking
          </h3>
          <p className="text-[11px] text-[#717887]">
            Ranked by total recorded IPC offenses (2013 Verified Baseline)
          </p>
        </div>
        <span className="text-[11px] font-semibold font-mono text-[#ff5530]">
          11 Districts
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-[#21242e] text-[10px] uppercase tracking-wider text-[#646b7a]">
              <th className="pb-3 font-medium">DISTRICT</th>
              <th className="pb-3 font-medium text-right">TOTAL IPC</th>
              <th className="pb-3 font-medium text-right">THEFTS</th>
              <th className="pb-3 font-medium text-right">VIOLENT (M+R+R)</th>
              <th className="pb-3 font-medium text-right">BURGLARY</th>
              <th className="pb-3 font-medium text-right">CITY SHARE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e222a]">
            {records.map((item) => {
              const isSelected = selectedDistrict?.toLowerCase() === item.name.toLowerCase() ||
                selectedDistrict?.toLowerCase() === item.rawName.toLowerCase();

              return (
                <tr
                  key={item.name}
                  onClick={() => onSelectDistrict?.(item.name)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#ff5530]/10 border-l-2 border-[#ff5530]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-3 font-medium text-white flex items-center gap-2">
                    <MapPin size={13} className={isSelected ? "text-[#ff5530]" : "text-[#5e6676]"} />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-white">
                    {item.totalIpc.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-[#c2c7d2] font-mono">
                    {item.theft.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-[#ff5530] font-mono font-semibold">
                    {item.violent.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-[#8f96a4] font-mono">
                    {item.burglary.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-semibold font-mono ${
                        item.isHigh ? "text-[#ff5530]" : "text-[#7a88cf]"
                      }`}
                    >
                      {item.isHigh ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {item.share}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Backwards compatibility aliases
export const TopProductSales = DistrictRankings;
export default DistrictRankings;
