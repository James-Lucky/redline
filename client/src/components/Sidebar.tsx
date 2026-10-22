"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Megaphone,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Products", icon: Package },
  { label: "Customers", icon: Users },
  { label: "Analysis", icon: BarChart2 },
  { label: "Marketing", icon: Megaphone },
];

export function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#16181d] text-white shadow-lg md:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[230px] flex-col justify-between border-r border-[#20232b] bg-[#121417] px-4 py-6 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md shadow-[#ff5530]/25">
              {/* Metric Flow geometric icon */}
<img src="/logo.png" alt="Redline" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white">
              Redline
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {navItems.map(({ label, icon: Icon }) => {
              const isActive = active === label;
              return (
                <button
                  key={label}
                  onClick={() => {
                    setActive(label);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-[#281f21] text-[#ff5530]"
                      : "text-[#8d939e] hover:bg-[#1a1c22] hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-[#ff5530]" : "text-[#8d939e]"}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-1.5 pt-6 border-t border-[#20232b]">
          <button className="flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#8d939e] transition-all hover:bg-[#1a1c22] hover:text-white">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button className="flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#8d939e] transition-all hover:bg-[#1a1c22] hover:text-white">
            <HelpCircle size={18} />
            <span>Help Center</span>
          </button>
        </div>
      </aside>
    </>
  );
}
