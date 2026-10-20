"use client";

import { useState } from "react";
import { Search, Calendar, Bell } from "lucide-react";

export function Topbar() {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 bg-[#0e1013]/90 px-4 backdrop-blur-md md:px-8">
      {/* Left Search Bar */}
      <div className="flex flex-1 items-center max-w-[420px] ml-12 md:ml-0">
        <div className="relative w-full">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7582]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full rounded-xl border border-[#232731] bg-[#17191e] py-2 pl-10 pr-4 text-[13px] text-white placeholder-[#6e7582] transition-colors focus:border-[#ff5530]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Date Selector Pill */}
        <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-[#232731] bg-[#17191e] px-3.5 py-2 text-[12px] font-medium text-[#c0c5cf]">
          <span>Wed, 29 May 2024</span>
          <button
            type="button"
            aria-label="Calendar view"
            className="rounded p-0.5 text-[#8d939e] hover:text-white"
          >
            <Calendar size={15} />
          </button>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#232731] bg-[#17191e] text-[#8d939e] transition-colors hover:text-white"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff5530]" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-[#252830] ring-2 ring-[#ff5530]/20">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User Avatar"
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback to stylized initials if offline
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-white">
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
