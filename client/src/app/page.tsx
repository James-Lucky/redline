"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MetricCard } from "@/components/MetricCard";
import { Geography } from "@/components/Geography";
import { DistrictRankings } from "@/components/TopProductSales";
import { Analytics } from "@/components/Analytics";
import { useCrimeData } from "@/hooks/useCrimeData";
import { DELHI_DISTRICT_PATHS } from "@/lib/geo/delhiDistrictPaths";
import { matchAdministrativeDistrict, getNonCoterminousUnits } from "@/lib/geo/matchDistricts";
import { getDistrictMetricValue, CRIME_CATEGORIES } from "@/lib/analytics/calculations";
import {
  MapPin,
  ShieldAlert,
  Sparkles,
  Train,
  Plane,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("total_ipc");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>("South");
  const [aiPromptToAsk, setAiPromptToAsk] = useState<string | null>(null);

  const { districtRecords, territorialDistricts, specializedUnits } = useCrimeData();

  // Match selected district
  const selectedMatch = useMemo(() => {
    if (!selectedDistrict) return null;
    return matchAdministrativeDistrict(selectedDistrict, districtRecords);
  }, [selectedDistrict, districtRecords]);

  // Non-coterminous units
  const nonCoterminous = useMemo(() => {
    const list = getNonCoterminousUnits(districtRecords);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.record.displayName.toLowerCase().includes(q) ||
        item.record.district.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q)
    );
  }, [districtRecords, searchQuery]);

  const activeCategoryMeta =
    CRIME_CATEGORIES.find((c) => c.key === activeCategory) || CRIME_CATEGORIES[0];

  function handleAskAi(districtName: string) {
    const prompt = `Give me a complete crime and boundary intelligence breakdown for ${districtName} in Delhi.`;
    setAiPromptToAsk(prompt);
  }

  return (
    <div className="min-h-screen bg-[#0e1013] text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col md:pl-[230px]">
        {/* Top Header with live district search */}
        <Topbar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          placeholder="Search Delhi districts (e.g., South, North, Outer, Metro)..."
          title="Delhi Districts Intelligence"
          subtitle="Spatial alignment between Survey of India Revenue Districts and Delhi Police Jurisdictions"
        />

        {/* Dashboard Grid Container */}
        <main className="flex-1 space-y-4 px-4 pb-32 pt-4 md:px-8 max-w-[1600px] mx-auto w-full">
          {/* Row 1: Key District Metric Cards */}
          <section
            aria-label="District Performance Indicators"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <MetricCard
              label="Total Police Units"
              value="19 Units"
              change="11 Territorial"
              isPositive={true}
              timeRange="11 Territorial + 7 Transit/Specialized + 1 CB"
            />
            <MetricCard
              label="Recorded IPC Offenses"
              value="80,184"
              change="Baseline 2013"
              isPositive={true}
              timeRange="Verified National Crime Records Bureau record"
            />
            <MetricCard
              label="Highest Volume District"
              value="Outer (9,579)"
              change="11.9% of Delhi"
              isPositive={false}
              timeRange="Outer residential & northern suburban perimeter"
            />
            <MetricCard
              label="Lowest Volume District"
              value="New Delhi (3,595)"
              change="4.5% of Delhi"
              isPositive={true}
              timeRange="Protected administrative & diplomatic enclave"
            />
          </section>

          {/* Row 2: Interactive SVG Map (7 cols) + Selected District Detail Card (5 cols) */}
          <section
            aria-label="Spatial Explorer and District Detail"
            className="grid grid-cols-1 gap-4 lg:grid-cols-12"
          >
            {/* Interactive SVG Delhi District Map */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5 shadow-sm">
              {/* Category Pills Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-[14px] font-semibold text-white font-heading flex items-center gap-2">
                    <MapPin size={16} className="text-[#ff5038]" />
                    Interactive Delhi Revenue Districts Map
                  </h3>
                  <p className="text-[11px] text-[#717887]">
                    Survey of India 11 Administrative Districts · Click to inspect
                  </p>
                </div>

                {/* Category selector pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {CRIME_CATEGORIES.slice(0, 5).map((cat) => {
                    const isActive = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setActiveCategory(cat.key)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all ${
                          isActive
                            ? "bg-[#ff5038] text-white shadow-sm shadow-[#ff5038]/30 font-semibold"
                            : "bg-[#1f222a] text-[#8c92a0] hover:text-white hover:bg-[#252a36]"
                        }`}
                      >
                        {cat.label.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Map Canvas */}
              <Geography
                mode="map"
                districtRecords={districtRecords}
                activeCategory={activeCategory}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
              />
            </div>

            {/* Selected District Drilldown Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5 shadow-sm">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#23272f]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8c92a0] font-semibold">
                      Selected District Drilldown
                    </span>
                    <h3 className="text-[18px] font-bold text-white font-heading mt-0.5 flex items-center gap-2">
                      <MapPin size={18} className="text-[#ff5038]" />
                      {selectedDistrict || "Select a District"}
                    </h3>
                  </div>

                  {selectedMatch?.matchStatus === "matched" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 size={11} />
                      Verified Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                      <AlertCircle size={11} />
                      Unavailable (2013)
                    </span>
                  )}
                </div>

                {/* Stats Breakdown */}
                {selectedMatch?.data ? (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-[#21242e] bg-[#1a1d24] p-3">
                        <span className="text-[10px] text-[#717887] block">Total IPC Cases</span>
                        <span className="text-xl font-bold text-white font-heading">
                          {selectedMatch.data.totalIpc.toLocaleString()}
                        </span>
                      </div>
                      <div className="rounded-xl border border-[#21242e] bg-[#1a1d24] p-3">
                        <span className="text-[10px] text-[#717887] block">Theft & MV Theft</span>
                        <span className="text-xl font-bold text-[#ff5038] font-heading">
                          {selectedMatch.data.theft.toLocaleString()}
                        </span>
                      </div>
                      <div className="rounded-xl border border-[#21242e] bg-[#1a1d24] p-3">
                        <span className="text-[10px] text-[#717887] block">Violent Offenses</span>
                        <span className="text-xl font-bold text-white font-heading">
                          {(
                            selectedMatch.data.murder +
                            selectedMatch.data.robbery +
                            selectedMatch.data.rape
                          ).toLocaleString()}
                        </span>
                        <span className="text-[9px] text-[#6b7280] block mt-0.5">
                          {selectedMatch.data.murder} M · {selectedMatch.data.robbery} Rob · {selectedMatch.data.rape} Rape
                        </span>
                      </div>
                      <div className="rounded-xl border border-[#21242e] bg-[#1a1d24] p-3">
                        <span className="text-[10px] text-[#717887] block">Burglary</span>
                        <span className="text-xl font-bold text-[#c2c7d2] font-heading">
                          {selectedMatch.data.burglary.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-[#6b7280] block mt-0.5">House-breaking</span>
                      </div>
                    </div>

                    {/* Matched unit badge */}
                    <div className="rounded-xl border border-[#21242e] bg-[#1a1d24] p-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8c92a0]">Matched Police District:</span>
                        <span className="font-mono font-semibold text-white">
                          {selectedMatch.matchedPoliceDistrict}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6e7583] mt-2 leading-relaxed">
                        {selectedMatch.boundaryNote}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-[11px] text-[#c2c7d2] space-y-2">
                    <p className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      Historical Provenance Notice
                    </p>
                    <p className="text-[11px] leading-relaxed text-[#9ca3af]">
                      {selectedMatch?.boundaryNote ||
                        "Select any district on the map or rankings table to inspect official crime counts."}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button: Query Redline AI */}
              <div className="mt-5 pt-3 border-t border-[#23272f]">
                <button
                  type="button"
                  onClick={() => handleAskAi(selectedDistrict || "South")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ff5038] px-4 py-2.5 text-[12px] font-semibold text-white shadow-md shadow-[#ff5038]/25 transition hover:bg-[#ff6845]"
                >
                  <Sparkles size={15} />
                  <span>Ask Redline AI About {selectedDistrict || "This District"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Row 3: Territorial Districts Ranking (7 cols) + Specialized & Transit Units (5 cols) */}
          <section
            aria-label="District Rankings and Transit Jurisdictions"
            className="grid grid-cols-1 gap-4 lg:grid-cols-12"
          >
            {/* Territorial Districts Ranking Table */}
            <div className="lg:col-span-7">
              <DistrictRankings
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                searchFilter={searchQuery}
              />
            </div>

            {/* Specialized, Transit & Non-Coterminous Units */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[#23272f] pb-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-white font-heading flex items-center gap-2">
                      <Train size={16} className="text-[#ff5038]" />
                      Specialized & Transit Police Units
                    </h3>
                    <p className="text-[11px] text-[#717887]">
                      Corridor & centralized units operating citywide (2013)
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[#ff5038]">
                    {nonCoterminous.length} Units
                  </span>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {nonCoterminous.map(({ record, reason }) => (
                    <div
                      key={record.district}
                      className="rounded-xl border border-[#21242e] bg-[#1a1d24] p-3 transition hover:border-[#2f3442]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {record.district.includes("RLY") || record.district.includes("METRO") ? (
                            <Train size={14} className="text-[#ff5038]" />
                          ) : record.district.includes("AIRPORT") ? (
                            <Plane size={14} className="text-[#ff5038]" />
                          ) : (
                            <Building2 size={14} className="text-[#ff5038]" />
                          )}
                          <h4 className="text-[12px] font-semibold text-white font-heading">
                            {record.displayName}
                          </h4>
                        </div>
                        <span className="font-mono text-[12px] font-bold text-[#ff5038]">
                          {record.totalIpc.toLocaleString()} IPC
                        </span>
                      </div>
                      <p className="text-[10px] text-[#788090] mt-1.5 leading-relaxed">
                        {reason}
                      </p>
                      <div className="mt-2 pt-2 border-t border-[#23272f]/80 flex items-center justify-between text-[10px] text-[#8c92a0]">
                        <span>Thefts: <strong className="text-white">{record.theft.toLocaleString()}</strong></span>
                        <span>Violent: <strong className="text-white">{(record.murder + record.robbery + record.rape).toLocaleString()}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Floating AI Analyst Dock (100% focused strictly on districts) */}
        <Analytics externalQuery={aiPromptToAsk} />
      </div>
    </div>
  );
}
