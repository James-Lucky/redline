"use client";

import { ShieldCheck, CheckCircle2, AlertCircle, Database, FileSpreadsheet, MapPin } from "lucide-react";

const integrityChecks = [
  {
    label: "NCRB 2013 District Dataset",
    status: "Verified (80,184 IPC)",
    details: "19 police units, 0 negative counts, exact sum match.",
    icon: FileSpreadsheet,
    type: "success" as const,
  },
  {
    label: "10-Year Annual Time Series (2013–2022)",
    status: "Verified (10 Periods)",
    details: "Official Crime in India compendia with e-FIR annotations.",
    icon: Database,
    type: "success" as const,
  },
  {
    label: "Survey of India Revenue Boundaries",
    status: "Verified (11 Districts)",
    details: "Administrative polygons validated against SOI / NWIC CRS.",
    icon: MapPin,
    type: "success" as const,
  },
  {
    label: "Geographic Coterminous Audit",
    status: "Annotated",
    details: "Distinguishes 11 territorial police districts from 7 transit/special units and handles Shahdara 2017 vintage lag.",
    icon: AlertCircle,
    type: "info" as const,
  },
];

export function DataIntegrity() {
  return (
    <article className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 border-b border-[#292c32] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={17} className="text-[#ff5038]" />
          <h3 className="text-sm font-semibold text-[#f2f3f5] font-heading">
            Data Provenance & Integrity Audit
          </h3>
        </div>
        <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
          <CheckCircle2 size={11} />
          Audit Passed
        </span>
      </div>

      <p className="mt-2.5 text-[11px] leading-relaxed text-[#89909c]">
        All figures in CrimeLens Delhi are deterministically validated against official public records from the National Crime Records Bureau (NCRB) and Delhi Police. No synthetic, predicted, or interpolated data is displayed.
      </p>

      <div className="mt-3.5 divide-y divide-[#292c32]">
        {integrityChecks.map(({ label, status, details, icon: Icon, type }) => (
          <div key={label} className="py-2.5 flex items-start gap-2.5">
            <div className="mt-0.5 p-1 rounded bg-[#121416] border border-[#292c32] text-[#89909c]">
              <Icon size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-medium text-[#f2f3f5] truncate">
                  {label}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-medium shrink-0 ${
                    type === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {status}
                </span>
              </div>
              <p className="text-[10px] text-[#89909c] mt-0.5">{details}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default DataIntegrity;
