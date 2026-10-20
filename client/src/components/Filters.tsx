"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, SlidersHorizontal } from "lucide-react";

export function Filters() {
  const [year, setYear] = useState("2024");
  const [category, setCategory] = useState("All Products");

  return (
    <section className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl border border-[#232630] bg-[#16181d] px-5 py-3.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-white">
        <SlidersHorizontal size={15} className="text-[#ff5530]" /> Filters
      </div>
      <label className="flex items-center gap-2">
        <span className="text-[10px] font-medium tracking-wider text-[#6d7482]">
          TIMEFRAME
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-[#232731] bg-[#1a1d24] px-2.5 py-1 text-xs text-[#c2c7d2]">
          <CalendarDays size={13} className="text-[#6d7482]" />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-transparent outline-none cursor-pointer"
          >
            {["2024", "2023", "2022"].map((y) => (
              <option className="bg-[#17191e]" key={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="text-[#6d7482]" />
        </span>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-[10px] font-medium tracking-wider text-[#6d7482]">
          CATEGORY
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-[#232731] bg-[#1a1d24] px-2.5 py-1 text-xs text-[#c2c7d2]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent outline-none cursor-pointer"
          >
            {["All Products", "MagStand Series", "Accessories", "Cables"].map(
              (c) => (
                <option className="bg-[#17191e]" key={c}>
                  {c}
                </option>
              )
            )}
          </select>
          <ChevronDown size={12} className="text-[#6d7482]" />
        </span>
      </label>
    </section>
  );
}

export default Filters;
