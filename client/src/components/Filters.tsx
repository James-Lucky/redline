"use client";

import { Calendar, SlidersHorizontal, Layers, Tag } from "lucide-react";
import { DashboardFilters } from "@/types/crime";
import { CRIME_CATEGORIES } from "@/lib/analytics/calculations";

interface FiltersProps {
  filters: DashboardFilters;
  onYearChange?: (year: number) => void;
  onCategoryChange?: (category: string) => void;
  onUnitTypeChange?: (unitType: "all" | "territorial" | "specialized") => void;
  availableYears?: number[];
  showUnitFilter?: boolean;
}

export function Filters({
  filters,
  onYearChange,
  onCategoryChange,
  onUnitTypeChange,
  availableYears = [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
  showUnitFilter = true,
}: FiltersProps) {
  return (
    <section
      aria-label="Crime Dashboard Filters"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#292c32] bg-[#17191d] px-4 py-3"
    >
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f2f3f5]">
          <SlidersHorizontal size={14} className="text-[#ff5038]" />
          <span>Filters</span>
        </div>

        {/* Year Filter */}
        <label className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-[#89909c] uppercase">
            Reporting Period
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-[#292c32] bg-[#121416] px-2.5 py-1 text-xs text-[#f2f3f5]">
            <Calendar size={13} className="text-[#89909c]" />
            <select
              value={filters.year}
              onChange={(e) => onYearChange?.(Number(e.target.value))}
              aria-label="Select reporting year"
              className="bg-transparent outline-none cursor-pointer pr-1"
            >
              {availableYears.map((y) => (
                <option className="bg-[#17191d] text-[#f2f3f5]" key={y} value={y}>
                  {y} {y === 2013 ? "(Full District Data)" : ""}
                </option>
              ))}
            </select>
          </span>
        </label>

        {/* Crime Category Filter */}
        <label className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-[#89909c] uppercase">
            Crime Category
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-[#292c32] bg-[#121416] px-2.5 py-1 text-xs text-[#f2f3f5]">
            <Tag size={13} className="text-[#89909c]" />
            <select
              value={filters.category}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              aria-label="Select crime category"
              className="bg-transparent outline-none cursor-pointer pr-1 max-w-[200px] truncate"
            >
              {CRIME_CATEGORIES.map((c) => (
                <option className="bg-[#17191d] text-[#f2f3f5]" key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </span>
        </label>

        {/* Unit Type Filter */}
        {showUnitFilter && (
          <label className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-wider text-[#89909c] uppercase">
              Jurisdiction
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-[#292c32] bg-[#121416] px-2.5 py-1 text-xs text-[#f2f3f5]">
              <Layers size={13} className="text-[#89909c]" />
              <select
                value={filters.unitType}
                onChange={(e) =>
                  onUnitTypeChange?.(e.target.value as "all" | "territorial" | "specialized")
                }
                aria-label="Select jurisdiction scope"
                className="bg-transparent outline-none cursor-pointer pr-1"
              >
                <option className="bg-[#17191d] text-[#f2f3f5]" value="territorial">
                  Territorial Police Districts (11)
                </option>
                <option className="bg-[#17191d] text-[#f2f3f5]" value="all">
                  All Units (Territorial + Specialized)
                </option>
                <option className="bg-[#17191d] text-[#f2f3f5]" value="specialized">
                  Specialized & Transit Units Only
                </option>
              </select>
            </span>
          </label>
        )}
      </div>

      {filters.year !== 2013 && (
        <div className="text-[10px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
          District-level drilldown is verified for 2013; citywide annual trend active for {filters.year}.
        </div>
      )}
    </section>
  );
}

export default Filters;
