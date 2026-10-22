"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Bell,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  Settings,
  X,
  Check,
  ShieldCheck,
} from "lucide-react";

export function Topbar() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Form states for login/signup modal
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Restore auth state from localStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("redline_auth");
      if (savedAuth === "true") {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLoginSuccess = (userName?: string) => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("redline_auth", "true");
      if (userName) {
        localStorage.setItem("redline_user_name", userName);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("redline_auth");
      localStorage.removeItem("redline_user_name");
    }
  };

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
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
              placeholder="Search analytics, orders, metrics..."
              className="w-full rounded-xl border border-[#232731] bg-[#17191e] py-2 pl-10 pr-4 text-[13px] text-white placeholder-[#6e7582] transition-colors focus:border-[#ff5530]/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
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

          {/* Conditional Auth Section */}
          {!isLoggedIn ? (
            /* Logged OUT State: Show Login & Sign Up buttons */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuth("login")}
                className="flex items-center gap-1.5 rounded-xl border border-[#232731] bg-[#17191e] px-3.5 py-2 text-[13px] font-medium text-[#c0c5cf] transition-all hover:border-[#353b49] hover:bg-[#1f2229] hover:text-white"
              >
                <LogIn size={15} className="text-[#8d939e]" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="flex items-center gap-1.5 rounded-xl bg-[#ff5530] px-4 py-2 text-[13px] font-semibold text-white shadow-md shadow-[#ff5530]/25 transition-all hover:bg-[#ff6745]"
              >
                <UserPlus size={15} />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            /* Logged IN State: Show Notification Bell & User Profile Avatar */
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => {
                    setShowNotificationMenu(!showNotificationMenu);
                    setShowProfileMenu(false);
                  }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#232731] bg-[#17191e] text-[#8d939e] transition-colors hover:text-white hover:border-[#353b49]"
                >
                  <Bell size={17} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff5530]" />
                </button>

                {/* Notifications Dropdown */}
                {showNotificationMenu && (
                  <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[#232731] bg-[#16181d] p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-[#232731] pb-2 px-1">
                      <span className="text-[13px] font-semibold text-white font-heading">
                        Notifications
                      </span>
                      <span className="rounded-md bg-[#ff5530]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#ff5530]">
                        2 New
                      </span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="rounded-xl p-2 transition-colors hover:bg-[#1d2028]">
                        <p className="text-[12px] font-medium text-white">
                          Target Reached: Revenue +12.5%
                        </p>
                        <span className="text-[10px] text-[#6b7280]">
                          10 minutes ago
                        </span>
                      </div>
                      <div className="rounded-xl p-2 transition-colors hover:bg-[#1d2028]">
                        <p className="text-[12px] font-medium text-white">
                          New order spike in Germany & USA
                        </p>
                        <span className="text-[10px] text-[#6b7280]">
                          1 hour ago
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar with Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="User profile menu"
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotificationMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-[#252830] p-0.5 ring-2 ring-[#ff5530]/20 transition-all hover:ring-[#ff5530]/50"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="User Avatar"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-white">
                      RL
                    </div>
                  </div>
                </button>

                {/* Profile Menu Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-[#232731] bg-[#16181d] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                    {/* User Info Header */}
                    <div className="border-b border-[#232731] px-3 py-2.5">
                      <p className="text-[13px] font-bold text-white font-heading">
                        John Doe
                      </p>
                      <p className="text-[11px] text-[#8d939e]">
                        admin@redline.io
                      </p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#ff5530]">
                        <ShieldCheck size={12} />
                        <span>Verified Account</span>
                      </div>
                    </div>

                    {/* Menu links */}
                    <div className="mt-1 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-[#c0c5cf] transition-colors hover:bg-[#1e222a] hover:text-white"
                      >
                        <UserIcon size={14} className="text-[#8d939e]" />
                        <span>My Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-[#c0c5cf] transition-colors hover:bg-[#1e222a] hover:text-white"
                      >
                        <Settings size={14} className="text-[#8d939e]" />
                        <span>Settings</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-1 border-t border-[#232731] pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-[#ff5530] transition-colors hover:bg-[#331c1d]"
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal (Login / Sign Up) */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#262a34] bg-[#14161c] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-[#8d939e] transition-colors hover:bg-[#20232b] hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Redline Logo & Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl">
                <img
                  src="/logo.png"
                  alt="Redline"
                  className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(255,85,48,0.3)]"
                />
              </div>
              <h3 className="mt-3 text-lg font-bold text-white font-heading">
                {authMode === "login"
                  ? "Welcome to Redline"
                  : "Create your Redline account"}
              </h3>
              <p className="mt-1 text-xs text-[#8d939e]">
                {authMode === "login"
                  ? "Access your live sales performance and intelligence"
                  : "Start analyzing your sales and global revenue in real-time"}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-5 grid grid-cols-2 rounded-xl bg-[#0e1013] p-1 border border-[#232731]">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`rounded-lg py-1.5 text-[13px] font-semibold transition-all ${
                  authMode === "login"
                    ? "bg-[#1f232c] text-white shadow-sm"
                    : "text-[#8d939e] hover:text-white"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`rounded-lg py-1.5 text-[13px] font-semibold transition-all ${
                  authMode === "signup"
                    ? "bg-[#1f232c] text-white shadow-sm"
                    : "text-[#8d939e] hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLoginSuccess(name || "John Doe");
              }}
              className="mt-4 space-y-3.5"
            >
              {authMode === "signup" && (
                <div>
                  <label className="block text-[12px] font-medium text-[#a0a6b5] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#262a34] bg-[#1a1d24] px-3.5 py-2 text-[13px] text-white placeholder-[#606775] focus:border-[#ff5530]/60 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-medium text-[#a0a6b5] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#262a34] bg-[#1a1d24] px-3.5 py-2 text-[13px] text-white placeholder-[#606775] focus:border-[#ff5530]/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#a0a6b5] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#262a34] bg-[#1a1d24] px-3.5 py-2 text-[13px] text-white placeholder-[#606775] focus:border-[#ff5530]/60 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-[#ff5530] py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-[#ff5530]/25 transition-all hover:bg-[#ff6745]"
              >
                {authMode === "login" ? "Sign In" : "Create Account"}
              </button>

              {/* Instant 1-Click Demo Login */}
              <button
                type="button"
                onClick={() => handleLoginSuccess("Demo User")}
                className="w-full rounded-xl border border-[#2b303c] bg-[#1b1e26] py-2 text-[12px] font-medium text-[#9ca3af] transition-all hover:border-[#ff5530]/40 hover:bg-[#20242f] hover:text-white"
              >
                Instant 1-Click Demo Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
