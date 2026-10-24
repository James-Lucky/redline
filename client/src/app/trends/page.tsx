"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { CrimeChart } from "@/components/CrimeChart";
import { Analytics } from "@/components/Analytics";
import { useCrimeData } from "@/hooks/useCrimeData";
import {
  calculateAbsoluteChange,
  calculatePercentageChange,
  formatPercentageChange,
  CRIME_CATEGORIES,
} from "@/lib/analytics/calculations";
import { TrendingUp, AlertTriangle, Info, Calendar, FileText } from "lucide-react";

export default function TrendsPage() {
  const { annualRecords } = useCrimeData();
  const [selectedCategory, setSelectedCategory] = useState("total_ipc");

  // Multi-year comparative analysis table
  const trendAnalysis = useMemo(() => {
    return annualRecords.map((rec, index) => {
      const prev = index > 0 ? annualRecords[index - 1] : null;
      const totalChange = prev ? calculateAbsoluteChange(rec.total_ipc_crimes, prev.total_ipc_crimes) : null;
      const totalPct = prev ? calculatePercentageChange(rec.total_ipc_crimes, prev.total_ipc_crimes) : null;

      const theftChange = prev ? calculateAbsoluteChange(rec.theft, prev.theft) : null;
      const theftPct = prev ? calculatePercentageChange(rec.theft, prev.theft) : null;

      const violentCount = rec.murder + rec.robbery + rec.rape;
      const prevViolent = prev ? prev.murder + prev.robbery + prev.rape : null;
      const violentPct = prevViolent ? calculatePercentageChange(violentCount, prevViolent) : null;

      return {
        ...rec,
        totalChange,
        totalPct,
        theftChange,
        theftPct,
        violentCount,
        violentPct,
      };
    });
  }, [annualRecords]);

  return (
    <div className="min-h-screen bg-[#0f1012] text-[#f2f3f5]">
      <Sidebar />

      <div className="flex min-h-screen flex-col md:pl-[230px]">
        <Topbar
          title="Historical Crime Trends (2013–2022)"
          subtitle="Official longitudinal analysis of police-recorded crime in Delhi"
        />

        <main className="flex-1 space-y-4 px-4 pb-28 pt-4 md:px-8">
          {/* Header */}
          <div className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <h2 className="text-lg font-bold text-[#f2f3f5] font-heading flex items-center gap-2">
              <TrendingUp className="text-[#ff5038]" size={18} />
              Delhi Crime Trajectory & Category Comparisons
            </h2>
            <p className="text-[12px] text-[#89909c] mt-1 max-w-3xl leading-relaxed">
              Examine 10 annual reporting periods compiled from official National Crime Records Bureau (NCRB) publications.
              All percentage and absolute changes are calculated between compatible reporting years with procedural notes.
            </p>
          </div>

          {/* Procedural Warnings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                <AlertTriangle size={14} />
                <span>2014 e-FIR Reporting Surge</span>
              </div>
              <p className="text-[10px] text-amber-200/80 leading-relaxed">
                Delhi Police launched the online e-FIR portal for motor vehicles and general thefts in 2014, leading to a massive increase in reported cases without implying an equivalent sudden shift in physical victimizations.
              </p>
            </div>

            <div className="rounded-xl border border-[#292c32] bg-[#17191d] p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f2f3f5] mb-1">
                <Info size={14} className="text-[#ff5038]" />
                <span>2017 Police Reorganization</span>
              </div>
              <p className="text-[10px] text-[#89909c] leading-relaxed">
                Delhi Police restructured its territorial layout from 11 districts to 13 districts, adding Rohini and Shahdara police districts. Citywide totals remain comparable across the decade.
              </p>
            </div>

            <div className="rounded-xl border border-[#292c32] bg-[#17191d] p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f2f3f5] mb-1">
                <Calendar size={14} className="text-emerald-400" />
                <span>2020 COVID-19 Lockdown</span>
              </div>
              <p className="text-[10px] text-[#89909c] leading-relaxed">
                Strict public movement restrictions in Q2 2020 suppressed street robberies and outdoor thefts, while Northeast Delhi civil violence in Feb 2020 resulted in an atypical spike in registered rioting cases.
              </p>
            </div>
          </div>

          {/* Historical Trend Chart */}
          <CrimeChart annualData={annualRecords} height={340} />

          {/* Comprehensive Annual Data & YoY Table */}
          <section
            aria-label="Annual Crime Statistics Table"
            className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5"
          >
            <div className="border-b border-[#292c32] pb-3 mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#f2f3f5] font-heading">
                  Annual Crime Volume and YoY Dynamics (2013–2022)
                </h3>
                <p className="text-[11px] text-[#89909c]">
                  Deterministically computed absolute and percentage differences between consecutive annual reporting cycles
                </p>
              </div>
              <span className="text-[10px] text-[#89909c] font-mono">
                Source: NCRB Crime in India Series
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#292c32] text-[10px] uppercase tracking-wider text-[#89909c]">
                    <th className="pb-2.5 font-semibold">Calendar Year</th>
                    <th className="pb-2.5 font-semibold text-right">Total IPC</th>
                    <th className="pb-2.5 font-semibold text-right">YoY Change</th>
                    <th className="pb-2.5 font-semibold text-right">Thefts</th>
                    <th className="pb-2.5 font-semibold text-right">Theft YoY</th>
                    <th className="pb-2.5 font-semibold text-right">Murder</th>
                    <th className="pb-2.5 font-semibold text-right">Rape</th>
                    <th className="pb-2.5 font-semibold text-right">Burglary</th>
                    <th className="pb-2.5 font-semibold pl-4">Administrative Coverage Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292c32]/60 font-mono">
                  {trendAnalysis.map((row) => (
                    <tr key={row.year} className="transition-colors hover:bg-white/[0.02]">
                      <td className="py-2.5 font-bold text-[#f2f3f5]">
                        {row.year}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-[#f2f3f5]">
                        {row.total_ipc_crimes.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right">
                        {row.totalPct != null ? (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              row.totalPct > 0
                                ? "text-[#ff5038] bg-[#ff5038]/10"
                                : "text-emerald-400 bg-emerald-500/10"
                            }`}
                          >
                            {formatPercentageChange(row.totalPct)}
                          </span>
                        ) : (
                          <span className="text-[#89909c]">Baseline</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right text-[#89909c]">
                        {row.theft.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right">
                        {row.theftPct != null ? (
                          <span className="text-[#89909c]">
                            {formatPercentageChange(row.theftPct)}
                          </span>
                        ) : (
                          <span className="text-[#89909c]">—</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right text-[#f2f3f5]">
                        {row.murder}
                      </td>
                      <td className="py-2.5 text-right text-[#f2f3f5]">
                        {row.rape.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right text-[#89909c]">
                        {row.burglary.toLocaleString()}
                      </td>
                      <td className="py-2.5 pl-4 text-[10px] text-[#89909c] font-sans max-w-sm">
                        {row.procedural_warning || "Standard annual reporting cycle."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <Analytics />
      </div>
    </div>
  );
}
