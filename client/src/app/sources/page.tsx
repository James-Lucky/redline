"use client";

import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Analytics } from "@/components/Analytics";
import { useCrimeData } from "@/hooks/useCrimeData";
import {
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  Globe,
  AlertCircle,
} from "lucide-react";

export default function SourcesPage() {
  const { manifest } = useCrimeData();

  return (
    <div className="min-h-screen bg-[#0f1012] text-[#f2f3f5]">
      <Sidebar />

      <div className="flex min-h-screen flex-col md:pl-[230px]">
        <Topbar
          title="Dataset Registry & Provenance"
          subtitle="Official open data publishers, temporal vintages, and verification status"
        />

        <main className="flex-1 space-y-4 px-4 pb-28 pt-4 md:px-8">
          {/* Header */}
          <div className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#f2f3f5] font-heading flex items-center gap-2">
                  <Database className="text-[#ff5038]" size={18} />
                  Official Data Registry & Lineage
                </h2>
                <p className="text-[12px] text-[#89909c] mt-1 max-w-3xl leading-relaxed">
                  Every metric in CrimeLens Delhi originates from published civic open data repositories under the Government of India Open Data License.
                  Below is the complete audit registry specifying publishers, source locations, validation checks, and geographic granularity.
                </p>
              </div>

              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 shrink-0">
                <CheckCircle2 size={13} />
                <span>All Sources Verified</span>
              </span>
            </div>
          </div>

          {/* Dataset Cards */}
          <div className="grid grid-cols-1 gap-4">
            {manifest.datasets.map((dataset) => (
              <article
                key={dataset.id}
                className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5 transition hover:border-[#383d47]"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#292c32] pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#ff5038] uppercase tracking-wider">
                      Dataset ID: {dataset.id}
                    </span>
                    <h3 className="text-base font-bold text-[#f2f3f5] font-heading mt-0.5">
                      {dataset.title}
                    </h3>
                    <p className="text-[11px] text-[#89909c]">
                      Publisher: <strong className="text-[#f2f3f5]">{dataset.publisher}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      Status: {dataset.validation_status}
                    </span>
                    <a
                      href={dataset.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-[#292c32] px-2 py-1 text-[11px] text-[#f2f3f5] hover:bg-[#ff5038] hover:text-white transition"
                    >
                      <span>Official Source</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] mb-3">
                  <div className="rounded-lg bg-[#121416] p-2.5 border border-[#292c32]">
                    <span className="text-[#89909c] text-[10px] block">Reporting Vintage</span>
                    <strong className="text-[#f2f3f5]">{dataset.reporting_period}</strong>
                  </div>

                  <div className="rounded-lg bg-[#121416] p-2.5 border border-[#292c32]">
                    <span className="text-[#89909c] text-[10px] block">Geography Type</span>
                    <strong className="text-[#f2f3f5] font-mono">{dataset.geography_type}</strong>
                  </div>

                  <div className="rounded-lg bg-[#121416] p-2.5 border border-[#292c32]">
                    <span className="text-[#89909c] text-[10px] block">Granularity</span>
                    <strong className="text-[#f2f3f5]">{dataset.granularity}</strong>
                  </div>

                  <div className="rounded-lg bg-[#121416] p-2.5 border border-[#292c32]">
                    <span className="text-[#89909c] text-[10px] block">Completeness</span>
                    <strong className="text-emerald-400">{dataset.completeness}</strong>
                  </div>
                </div>

                {/* Audit & Notes */}
                <div className="rounded-lg bg-[#121416]/80 p-3 border border-[#292c32]/80 text-[11px] text-[#89909c]">
                  <strong className="text-[#f2f3f5] block mb-1">Provenance & Audit Notes:</strong>
                  <p className="leading-relaxed">{dataset.audit_notes}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Citation & Licensing Card */}
          <div className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#f2f3f5] font-heading mb-2">
              Attribution, Rights & Public License
            </h3>
            <p className="text-[11px] text-[#89909c] leading-relaxed">
              Data republished under the Government of India National Data Sharing and Accessibility Policy (NDSAP) and open data principles.
              Users citing these analytics must reference the <em>National Crime Records Bureau (NCRB) Crime in India annual reports</em> and <em>Survey of India (SOI)</em> for boundaries.
              CrimeLens Delhi provides non-commercial civic transparency and research infrastructure.
            </p>
          </div>
        </main>

        <Analytics />
      </div>
    </div>
  );
}
