"use client";

import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Analytics } from "@/components/Analytics";
import {
  BookOpen,
  AlertTriangle,
  Layers,
  Users,
  ShieldCheck,
  Scale,
  FileCheck,
} from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#0f1012] text-[#f2f3f5]">
      <Sidebar />

      <div className="flex min-h-screen flex-col md:pl-[230px]">
        <Topbar
          title="Methodology & Data Limitations"
          subtitle="Critical guidance on interpreting police-recorded crime statistics in Delhi"
        />

        <main className="flex-1 space-y-4 px-4 pb-28 pt-4 md:px-8">
          {/* Header */}
          <div className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <h2 className="text-lg font-bold text-[#f2f3f5] font-heading flex items-center gap-2">
              <BookOpen className="text-[#ff5038]" size={18} />
              Analytical Framework & Caveats
            </h2>
            <p className="text-[12px] text-[#89909c] mt-1 max-w-3xl leading-relaxed">
              Crime statistics are sensitive civic indicators often subject to misinterpretation.
              Understanding how data is captured, categorized, and geographically assigned is essential for responsible civic analysis, journalism, and research.
            </p>
          </div>

          {/* Section 1: Police-Recorded Crime vs Actual Incidence */}
          <section className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#f2f3f5] font-heading mb-2">
              <FileCheck size={16} className="text-[#ff5038]" />
              <span>1. Police-Recorded Crime vs. True Victimization</span>
            </div>
            <p className="text-[11px] text-[#89909c] leading-relaxed mb-3">
              All numbers in CrimeLens represent <strong>cognizable crimes officially recorded by Delhi Police under the Indian Penal Code (IPC)</strong> through registered First Information Reports (FIRs).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="rounded-lg bg-[#121416] p-3 border border-[#292c32]">
                <strong className="text-[#f2f3f5] block mb-1">The &quot;Dark Figure&quot; of Crime</strong>
                <p className="text-[#89909c] leading-relaxed">
                  Offenses that are unnotified, settled informally, or not registered by local police stations do not appear in official NCRB tables. Changes in counts often reflect shifts in police registration willingness rather than actual changes in social victimization.
                </p>
              </div>

              <div className="rounded-lg bg-[#121416] p-3 border border-[#292c32]">
                <strong className="text-[#f2f3f5] block mb-1">Principal Offense Rule</strong>
                <p className="text-[#89909c] leading-relaxed">
                  Under standard NCRB counting rules, when a single criminal incident involves multiple offenses (for example, burglary accompanied by murder), the incident is counted only once under the most heinous crime category (murder).
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: The 2014 Online e-FIR Paradigm Shift */}
          <section className="rounded-xl border border-amber-500/20 bg-[#17191d] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300 font-heading mb-2">
              <AlertTriangle size={16} className="text-amber-400" />
              <span>2. The 2014 e-FIR Reporting Paradigm Shift</span>
            </div>
            <p className="text-[11px] text-[#89909c] leading-relaxed mb-3">
              One of the most dramatic patterns in Delhi&apos;s crime trajectory is the massive rise in total IPC crimes from 80,184 in 2013 to 155,654 in 2014, and continuing upward to 298,988 in 2022.
            </p>
            <div className="rounded-lg bg-[#121416] p-3.5 border border-[#292c32] text-[11px] space-y-2">
              <p className="text-[#f2f3f5] font-medium">
                Why did reported crimes surge over 250% across this decade?
              </p>
              <p className="text-[#89909c] leading-relaxed">
                In 2014, Delhi Police became one of India&apos;s first state forces to launch a public <strong>web & mobile e-FIR registration portal</strong> specifically for motor vehicle theft, mobile snatching, and property loss.
                Previously, filing a theft FIR required physical station visits, which faced institutional friction. When citizens could generate verified FIRs digitally for insurance claims, registered theft jumped from 30,124 in 2013 to 50,570 in 2014, and reached 218,200 in 2022.
              </p>
              <div className="pt-2 border-t border-[#292c32] text-[10px] text-amber-300/90 font-mono">
                Key Rule: Do not compare pre-2014 and post-2014 total IPC counts without highlighting this procedural reporting shift.
              </div>
            </div>
          </section>

          {/* Section 3: Administrative vs Police Jurisdictions */}
          <section className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#f2f3f5] font-heading mb-2">
              <Layers size={16} className="text-[#ff5038]" />
              <span>3. Police Districts vs. Administrative Revenue Districts</span>
            </div>
            <p className="text-[11px] text-[#89909c] leading-relaxed mb-3">
              A frequent error in civic analysis is assuming that revenue districts (governed by District Magistrates) and police districts (commanded by Deputy Commissioners of Police) have identical borders.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              <div className="rounded-lg bg-[#121416] p-3 border border-[#292c32]">
                <strong className="text-[#f2f3f5] block mb-1">Shahdara Boundary Vintage</strong>
                <p className="text-[#89909c] leading-relaxed">
                  Shahdara was notified as a revenue district by the Government of Delhi in 2012. However, Delhi Police did not constitute a separate Shahdara Police District until 2017. In the 2013 NCRB report, crimes in Shahdara were recorded under East and North-East police districts.
                </p>
              </div>

              <div className="rounded-lg bg-[#121416] p-3 border border-[#292c32]">
                <strong className="text-[#f2f3f5] block mb-1">The &quot;Outer&quot; Police District</strong>
                <p className="text-[#89909c] leading-relaxed">
                  In 2013, Delhi Police operated an &quot;Outer&quot; district that spanned outer perimeters of multiple revenue districts. It recorded 9,579 crimes in 2013, but does not correspond to any single Survey of India revenue polygon.
                </p>
              </div>

              <div className="rounded-lg bg-[#121416] p-3 border border-[#292c32]">
                <strong className="text-[#f2f3f5] block mb-1">Specialized Transit Units</strong>
                <p className="text-[#89909c] leading-relaxed">
                  The Delhi Metro Rail unit, Government Railway Police (GRP), and IGI Airport unit have jurisdiction over transit lines rather than land areas. Joining these to geographic polygons would introduce spatial error.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Crime Rates & Population Denominators */}
          <section className="rounded-xl border border-[#292c32] bg-[#17191d] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#f2f3f5] font-heading mb-2">
              <Users size={16} className="text-[#ff5038]" />
              <span>4. Population Denominators & Crime Rates</span>
            </div>
            <p className="text-[11px] text-[#89909c] leading-relaxed mb-3">
              Raw case counts cannot be labeled as a &quot;crime rate&quot;. A crime rate measures risk relative to population:
            </p>
            <div className="rounded-lg bg-[#121416] p-3 border border-[#292c32] font-mono text-[11px] text-[#ff5038] mb-3">
              Crime Rate = (Number of Registered Offenses / Estimated Resident Population) * 100,000
            </div>
            <p className="text-[11px] text-[#89909c] leading-relaxed">
              Because district boundaries changed between 2011 Census and 2017 police redistricting, ward-level census denominators do not cleanly match historical police district lines. For this reason, CrimeLens displays raw verified counts with clear volume shares, avoiding estimated per-capita rates unless authoritative ward matching is certified.
            </p>
          </section>
        </main>

        <Analytics />
      </div>
    </div>
  );
}
