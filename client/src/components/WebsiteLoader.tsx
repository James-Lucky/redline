"use client";

import React, { useEffect, useState } from "react";

export function WebsiteLoader() {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Lock scroll during initial load
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    let currentVal = 0;
    const interval = setInterval(() => {
      // Brisk, natural progression (~1.1s total)
      const increment = Math.floor(Math.random() * 4) + 3;
      currentVal = Math.min(currentVal + increment, 100);
      setProgress(currentVal);

      if (currentVal >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsCompleted(true);
            if (typeof document !== "undefined") {
              document.body.style.overflow = "";
            }
          }, 450);
        }, 160);
      }
    }, 28);

    return () => {
      clearInterval(interval);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  if (isCompleted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0e1013] text-white transition-opacity duration-500 ease-out select-none ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle warm ambient glow */}
      <div className="pointer-events-none absolute h-60 w-60 rounded-full bg-[#ff5530]/10 blur-[80px]" />

      <div className="relative flex flex-col items-center">
        {/* User's Redline Brand Logo */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#ff5530]/20 blur-md" />
          <img
            src="/logo.png"
            alt="Redline Logo"
            className="relative z-10 h-14 w-14 object-contain drop-shadow-[0_0_12px_rgba(255,85,48,0.35)]"
          />
        </div>

        {/* Brand Name */}
        <h2 className="mt-4 text-[18px] font-bold tracking-tight text-white font-heading">
          Redline
        </h2>

        {/* Minimal Thin Progress Bar */}
        <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-[#1e222b]">
          <div
            className="h-full rounded-full bg-[#ff5530] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Simple Progress / Percentage */}
        <div className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-[#7d8494]">
          <span>Loading</span>
          <span className="font-mono text-[#c5cbd6] tabular-nums">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
