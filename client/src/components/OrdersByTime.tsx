"use client";

import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm"];

// Heatmap data representing order density (0: <200, 1: 200+, 2: 500+, 3: 1000+, 4: 2000+)
// Matches the circular/diamond heat concentration around 12pm-1pm Wed-Thu-Fri seen in the design
const matrix = [
  // 9 am
  [0, 0, 0, 0, 0, 0, 0],
  // 10 am
  [0, 0, 0, 2, 0, 0, 0],
  // 11 am
  [0, 1, 2, 3, 2, 1, 0],
  // 12 pm
  [0, 2, 3, 4, 3, 2, 1],
  // 1 pm
  [1, 2, 3, 4, 2, 2, 0],
  // 2 pm
  [0, 0, 2, 3, 2, 0, 0],
  // 3 pm
  [0, 0, 0, 2, 0, 0, 0],
];

const legendLevels = [
  { label: "200+", color: "bg-[#331c20]" },
  { label: "500+", color: "bg-[#662222]" },
  { label: "1,000+", color: "bg-[#b83828]" },
  { label: "2,000+", color: "bg-[#ff5530]" },
];

function getCellColor(level: number) {
  switch (level) {
    case 4:
      return "bg-[#ff5530] text-white shadow-sm shadow-[#ff5530]/40";
    case 3:
      return "bg-[#b83828] text-white/90";
    case 2:
      return "bg-[#662222] text-white/80";
    case 1:
      return "bg-[#331c20] text-white/70";
    default:
      return "bg-[#1c1f26] hover:bg-[#232731]";
  }
}

export function OrdersByTime() {
  const [hoveredCell, setHoveredCell] = useState<{
    day: string;
    time: string;
    orders: string;
  } | null>(null);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      {/* Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-[14px] font-semibold text-white">Orders by time</h3>
        <div className="flex items-center gap-3 text-[10px] text-[#717886]">
          {legendLevels.map((lvl) => (
            <div key={lvl.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${lvl.color}`} />
              <span>{lvl.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[340px]">
          {/* Heatmap Grid */}
          <div className="grid grid-cols-[45px_repeat(7,1fr)] gap-1.5">
            {/* Rows */}
            {times.map((time, rowIdx) => (
              <div key={time} className="contents">
                {/* Y-axis Time Label */}
                <span className="flex items-center text-[10px] text-[#5c6371]">
                  {time}
                </span>

                {/* 7 Days Columns for this Time */}
                {days.map((day, colIdx) => {
                  const level = matrix[rowIdx][colIdx];
                  const approxOrders =
                    level === 4
                      ? "2,420 orders"
                      : level === 3
                      ? "1,250 orders"
                      : level === 2
                      ? "640 orders"
                      : level === 1
                      ? "280 orders"
                      : "85 orders";

                  return (
                    <div
                      key={`${time}-${day}`}
                      onMouseEnter={() =>
                        setHoveredCell({ day, time, orders: approxOrders })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative aspect-square cursor-pointer rounded-md transition-all hover:ring-2 hover:ring-white/40 ${getCellColor(
                        level
                      )}`}
                    />
                  );
                })}
              </div>
            ))}

            {/* X-axis Day Labels */}
            <div />
            {days.map((day) => (
              <span
                key={day}
                className="mt-2 text-center text-[10px] text-[#5c6371]"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover info or subtle status */}
      <div className="mt-3 min-h-[18px] text-[10px] text-[#717886]">
        {hoveredCell ? (
          <span className="text-white">
            {hoveredCell.day} at {hoveredCell.time} —{" "}
            <span className="text-[#ff5530] font-semibold">
              {hoveredCell.orders}
            </span>
          </span>
        ) : (
          <span>Peak order density occurs between 11 am – 1 pm</span>
        )}
      </div>
    </div>
  );
}
