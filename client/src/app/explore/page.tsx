"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Geography } from "@/components/Geography";
import { Filters } from "@/components/Filters";
import { Analytics } from "@/components/Analytics";
import { useCrimeFilters } from "@/hooks/useCrimeFilters";
import { useCrimeData } from "@/hooks/useCrimeData";
import { DELHI_DISTRICT_PATHS } from "@/lib/geo/delhiDistrictPaths";
import { matchAdministrativeDistrict, getNonCoterminousUnits } from "@/lib/geo/matchDistricts";
import { getDistrictMetricValue, CRIME_CATEGORIES } from "@/lib/analytics/calculations";
import { MapPin, Info, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ExplorePage() {
  const { filters, setCategory, setSelectedDistrict, setUnitType } = useCrimeFilters({
    year: 2013,
    category: "total_ipc",
  });

  const { districtRecords } = useCrimeData();

  const districtTableRows = DELHI_DISTRICT_PATHS.map((item) => {
    const match = matchAdministrativeDistrict(item.name, districtRecords);
    const value = match.data ? getDistrictMetricValue(match.data, filters.category) : null;
    return {
      adminName: item.name,
      dtcode: item.dtcode,
      match,
      value,
    };
  });

  const nonCoterminous = getNonCoterminousUnits(districtRecords);
  const activeCategoryMeta = CRIME_CATEGORIES.find((c) => c.key === filters.category) || CRIME_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#0f1012] text-[#f2f3f5]">
      <Sidebar />

      <div className="flex min-h-screen flex-col md:pl-[230px]">
        <Topbar
          title="District Crime Explorer"
          subtitle="Spatial alignment between Survey of India Revenue Districts and Delhi Police Jurisdictions"
        />

        <main className="flex-1 space-y-4 px-4 pb-28 pt-4 md:px-8">
          {/* Header Card */}
          <div className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#f2f3f5] font-heading flex items-center gap-2">
                  <MapPin className="text-[#ff5038]" size={18} />
                  Interactive Geographic Explorer
                </h2>
                <p className="text-[12px] text-[#89909c] mt-1 max-w-3xl leading-relaxed">
                  Inspect official crime statistics mapped to verified Survey of India boundaries.
                  Delhi Police jurisdictions and revenue districts do not share 1:1 boundaries in all historical periods.
                  Records are joined with an explicit provenance audit trail to ensure zero data fabrication.
                </p>
              </div>

              <span className="hidden sm:inline-flex rounded-md bg-[#ff5038]/10 border border-[#ff5038]/20 px-2.5 py-1 text-[11px] font-semibold text-[#ff5038]">
                2013 Verified Baseline
              </span>
            </div>
          </div>

          {/* Filters */}
          <Filters
            filters={filters}
            onCategoryChange={setCategory}
            onUnitTypeChange={setUnitType}
            availableYears={[2013]}
            showUnitFilter={true}
          />

          {/* Map & Detail Component */}
          <Geography
            mode="map"
            districtRecords={districtRecords}
            activeCategory={filters.category}
            selectedDistrict={filters.selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
          />

          {/* Geographic Join Audit Table */}
          <section
            aria-label="Geographic Matching Audit Table"
            className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#292c32] pb-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f2f3f5] font-heading">
                  Administrative vs Police Jurisdiction Audit Log
                </h3>
                <p className="text-[11px] text-[#89909c]">
                  Detailed verification status for each of the 11 Survey of India Revenue Districts
                </p>
              </div>
              <span className="text-[11px] text-[#89909c]">
                Active Metric: <strong className="text-[#ff5038]">{activeCategoryMeta.label}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#292c32] text-[10px] uppercase tracking-wider text-[#89909c]">
                    <th className="pb-2.5 font-semibold">Revenue District (SOI)</th>
                    <th className="pb-2.5 font-semibold">Matched Police District</th>
                    <th className="pb-2.5 font-semibold">Match Status</th>
                    <th className="pb-2.5 font-semibold text-right">{activeCategoryMeta.label}</th>
                    <th className="pb-2.5 font-semibold text-right">Total IPC (2013)</th>
                    <th className="pb-2.5 font-semibold pl-4">Boundary Provenance Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292c32]/60">
                  {districtTableRows.map((row) => {
                    const isMatched = row.match.matchStatus === "matched";
                    return (
                      <tr
                        key={row.adminName}
                        onClick={() => setSelectedDistrict(row.adminName)}
                        className="transition-colors hover:bg-white/[0.02] cursor-pointer"
                      >
                        <td className="py-2.5 font-medium text-[#f2f3f5]">
                          {row.adminName}
                        </td>
                        <td className="py-2.5 font-mono text-[#89909c]">
                          {row.match.matchedPoliceDistrict || "—"}
                        </td>
                        <td className="py-2.5">
                          {isMatched ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                              <CheckCircle2 size={10} />
                              Verified Match
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
                              <AlertCircle size={10} />
                              Unavailable (2013)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-[#ff5038]">
                          {row.value != null ? row.value.toLocaleString() : "N/A"}
                        </td>
                        <td className="py-2.5 text-right font-mono text-[#f2f3f5]">
                          {row.match.data ? row.match.data.totalIpc.toLocaleString() : "N/A"}
                        </td>
                        <td className="py-2.5 pl-4 text-[10px] text-[#89909c] max-w-sm">
                          {row.match.boundaryNote}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Specialized / Non-Coterminous Police Jurisdictions */}
          <section
            aria-label="Specialized Police Jurisdictions"
            className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5"
          >
            <div className="border-b border-[#292c32] pb-3 mb-3">
              <h3 className="text-sm font-semibold text-[#f2f3f5] font-heading">
                Specialized, Transit & Non-Coterminous Police Jurisdictions (2013)
              </h3>
              <p className="text-[11px] text-[#89909c]">
                These official Delhi Police units hold citywide or corridor jurisdictions and cannot be joined to revenue district polygons without distorting geographic boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nonCoterminous.map(({ record, reason }) => (
                <div
                  key={record.district}
                  className="rounded-lg border border-[#292c32] bg-[#121416] p-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[12px] font-bold text-[#f2f3f5]">
                        {record.displayName}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-[#ff5038]">
                        {record.totalIpc.toLocaleString()} IPC
                      </span>
                    </div>
                    <p className="text-[10px] text-[#89909c] mt-1 leading-relaxed">
                      {reason}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#292c32] flex items-center justify-between text-[10px] text-[#89909c]">
                    <span>Thefts: {record.theft.toLocaleString()}</span>
                    <span>Violent: {(record.murder + record.robbery + record.rape).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Analytics />
      </div>
    </div>
  );
}
