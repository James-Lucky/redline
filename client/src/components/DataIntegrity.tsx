import { Database, FileCheck2, Globe, ShieldCheck } from "lucide-react";

const checks = [
  { label: "Stripe & Shopify Gateway", status: "Verified", icon: Database },
  { label: "Sync Latency (Realtime)", status: "Active (20ms)", icon: FileCheck2 },
  { label: "Multi-Region Inventory", status: "Connected", icon: Globe },
];

export function DataIntegrity() {
  return (
    <article className="rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <ShieldCheck size={16} className="text-[#ff5530]" /> System & Data Integrity
      </div>
      <p className="mt-2 text-[11px] leading-5 text-[#6f7685]">
        Realtime telemetry synchronized across all checkout endpoints and regional logistics nodes.
      </p>
      <div className="mt-4 divide-y divide-[#20242d]">
        {checks.map(({ label, status, icon: Icon }) => (
          <div key={label} className="flex items-center gap-2.5 py-2.5">
            <Icon size={14} className="text-[#646b7a]" />
            <span className="flex-1 text-[11px] text-[#9ba2af]">{label}</span>
            <span className="rounded-md bg-[#212638] px-2 py-0.5 text-[10px] font-medium text-[#7a88cf]">
              {status}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default DataIntegrity;
