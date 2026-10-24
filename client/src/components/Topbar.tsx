"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Bell,
  ShieldCheck,
} from "lucide-react";

interface TopbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  placeholder?: string;
  title?: string;
  subtitle?: string;
}

export function Topbar({
  onSearch,
  searchQuery,
  placeholder = "Search Delhi districts (e.g., South, North, Outer, Metro)...",
  title,
  subtitle,
}: TopbarProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const query = searchQuery !== undefined ? searchQuery : internalQuery;

  function handleSearch(val: string) {
    setInternalQuery(val);
    onSearch?.(val);
  }

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 bg-[#0e1013]/90 px-4 backdrop-blur-md md:px-8 border-b border-[#20232b]">
      {/* Search Bar */}
      <div className="flex flex-1 items-center max-w-[420px] ml-12 md:ml-0">
        <div className="relative w-full">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7582]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-[#232731] bg-[#17191e] py-2 pl-10 pr-4 text-[13px] text-white placeholder-[#6e7582] transition-colors focus:border-[#ff5530]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Date Selector Pill */}
        <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-[#232731] bg-[#17191e] px-3.5 py-2 text-[12px] font-medium text-[#c0c5cf]">
          <span>Delhi NCRB Baseline · 2013–2022</span>
          <Calendar size={15} className="text-[#8d939e]" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#232731] bg-[#17191e] text-[#8d939e] transition-colors hover:text-white hover:border-[#353b49]"
          >
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff5530]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[#232731] bg-[#16181d] p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#232731] pb-2 px-1">
                <span className="text-[13px] font-semibold text-white font-heading">
                  System Updates
                </span>
                <span className="rounded-md bg-[#ff5530]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#ff5530]">
                  Verified
                </span>
              </div>
              <div className="mt-2 space-y-1.5 text-[11px]">
                <div className="rounded-xl p-2 bg-[#1d2028]">
                  <p className="font-medium text-white">
                    NCRB 2013 Dataset Loaded
                  </p>
                  <span className="text-[10px] text-[#6b7280]">
                    19 units, 80,184 IPC crimes verified
                  </span>
                </div>
                <div className="rounded-xl p-2 bg-[#1d2028]">
                  <p className="font-medium text-white">
                    Survey of India Boundaries Active
                  </p>
                  <span className="text-[10px] text-[#6b7280]">
                    11 administrative district polygons
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User / Verified Profile Avatar */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#252830] p-0.5 ring-2 ring-[#ff5530]/20">
          <div className="relative h-8 w-8 overflow-hidden rounded-full flex items-center justify-center bg-[#1e222a] text-[11px] font-bold text-white font-heading">
            RL
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
