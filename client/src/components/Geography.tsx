"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DELHI_DISTRICT_PATHS } from "@/lib/geo/delhiDistrictPaths";
import { matchAdministrativeDistrict } from "@/lib/geo/matchDistricts";
import { getDistrictMetricValue } from "@/lib/analytics/calculations";
import { MapPin, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

interface GeographyProps {
  districtRecords?: any[];
  activeCategory?: string;
  selectedDistrict?: string | null;
  onSelectDistrict?: (districtName: string | null) => void;
  mode?: "cards" | "map";
}

const defaultDelhiTerritories = [
  {
    name: "Outer Delhi",
    code: "OD",
    metric: "9,579",
    label: "Total IPC",
    detail: "Highest volume",
  },
  {
    name: "North-East Delhi",
    code: "NED",
    metric: "9,041",
    label: "Total IPC",
    detail: "3,703 thefts",
  },
  {
    name: "South Delhi",
    code: "SD",
    metric: "7,330",
    label: "Total IPC",
    detail: "349 violent crimes",
  },
  {
    name: "West Delhi",
    code: "WD",
    metric: "6,707",
    label: "Total IPC",
    detail: "2,367 thefts",
  },
  {
    name: "Central Delhi",
    code: "CD",
    metric: "5,821",
    label: "Total IPC",
    detail: "Old Delhi commercial",
  },
  {
    name: "New Delhi",
    code: "NDD",
    metric: "3,595",
    label: "Total IPC",
    detail: "Diplomatic enclave",
  },
];

export function Geography({
  districtRecords,
  activeCategory = "total_ipc",
  selectedDistrict,
  onSelectDistrict,
  mode = "map",
}: GeographyProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // If map mode is requested
  const isMap = mode === "map";

  // Compute matched data for all 11 administrative districts if map mode
  const districtMatches = useMemo(() => {
    if (!districtRecords) return [];
    return DELHI_DISTRICT_PATHS.map((item) => {
      const match = matchAdministrativeDistrict(item.name, districtRecords);
      const val = match.data ? getDistrictMetricValue(match.data, activeCategory) : 0;
      return {
        ...item,
        match,
        value: val,
      };
    });
  }, [districtRecords, activeCategory]);

  const { minVal, maxVal } = useMemo(() => {
    const vals = districtMatches
      .filter((d) => d.match.matchStatus === "matched")
      .map((d) => d.value);
    if (vals.length === 0) return { minVal: 0, maxVal: 1 };
    return {
      minVal: Math.min(...vals),
      maxVal: Math.max(...vals),
    };
  }, [districtMatches]);

  const getFillColor = (item: (typeof districtMatches)[0]) => {
    if (item.match.matchStatus === "unavailable") return "#1a1d24";
    if (maxVal === minVal) return "#ff5038";
    const ratio = Math.max(0, Math.min(1, (item.value - minVal) / (maxVal - minVal || 1)));
    if (ratio < 0.25) return "#2c2024";
    if (ratio < 0.5) return "#5c2827";
    if (ratio < 0.75) return "#a63628";
    return "#ff5038";
  };

  if (isMap) {
    const activeItem = districtMatches.find((d) => d.name === (hoveredDistrict || selectedDistrict));

    return (
      <div className="relative flex flex-col items-center rounded-2xl border border-[#232630] bg-[#16181d] p-5 shadow-sm">
        {/* Floating tooltip on hover */}
        {activeItem && (
          <div className="absolute top-4 left-4 z-10 rounded-xl border border-[#2c303d] bg-[#1a1d24]/95 px-3 py-1.5 shadow-xl backdrop-blur-md text-[11px] pointer-events-none">
            <span className="font-semibold text-white">{activeItem.name}</span>
            <span className="text-[#8c92a0] ml-2">
              {activeItem.match.matchStatus === "unavailable"
                ? "Unavailable (2013)"
                : `${activeItem.value.toLocaleString()} cases`}
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 560 600"
          className="w-full max-h-[460px] select-none"
          aria-label="Interactive map of Delhi administrative districts"
        >
          <defs>
            <pattern
              id="unavailable-hatch"
              width="8"
              height="8"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="#333842" strokeWidth="2" />
            </pattern>
          </defs>

          {districtMatches.map((item) => {
            const isHovered = hoveredDistrict === item.name;
            const isSelected = selectedDistrict === item.name;
            const isUnavailable = item.match.matchStatus === "unavailable";
            const fillColor = isUnavailable ? "url(#unavailable-hatch)" : getFillColor(item);

            return (
              <path
                key={item.name}
                d={item.path}
                fill={fillColor}
                stroke={isSelected ? "#ffffff" : isHovered ? "#ff5038" : "#383d47"}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                className="transition-colors duration-150 cursor-pointer focus:outline-none"
                tabIndex={0}
                onMouseEnter={() => setHoveredDistrict(item.name)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() =>
                  onSelectDistrict?.(selectedDistrict === item.name ? null : item.name)
                }
              />
            );
          })}
        </svg>

        <div className="w-full mt-3 pt-3 border-t border-[#23272f] flex items-center justify-between text-[11px] text-[#8d93a1]">
          <span>Low ({minVal.toLocaleString()})</span>
          <div className="flex h-2 w-28 rounded overflow-hidden border border-[#292c32]">
            <span className="flex-1 bg-[#2c2024]" />
            <span className="flex-1 bg-[#5c2827]" />
            <span className="flex-1 bg-[#a63628]" />
            <span className="flex-1 bg-[#ff5038]" />
          </div>
          <span>High ({maxVal.toLocaleString()})</span>
        </div>
      </div>
    );
  }

  // Cards mode: Top Delhi Districts
  const territories = defaultDelhiTerritories;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#232630] bg-[#16181d] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white font-heading">
            Key Police Districts
          </h3>
          <p className="text-[11px] text-[#717887]">
            2013 Verified Official Baseline
          </p>
        </div>
        <Link
          href="/"
          className="text-[11px] font-medium text-[#737a89] transition-colors hover:text-white"
        >
          View Map
        </Link>
      </div>

      {/* 2x3 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {territories.map((territory) => (
          <div
            key={territory.name}
            onClick={() => onSelectDistrict?.(territory.name)}
            className="flex flex-col justify-between rounded-xl border border-[#21242e] bg-[#1a1d24] p-3 transition-colors hover:border-[#2f3442] cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#252a36] text-[9px] font-mono font-bold text-[#ff5038]">
                {territory.code}
              </span>
              <span className="text-[11px] font-medium text-[#8d93a1] truncate">
                {territory.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] font-bold text-white font-heading">
                {territory.metric}
              </span>
              <span className="text-[10px] text-[#636a78]">{territory.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Backwards compatibility alias
export const SalesByCountry = Geography;
export const GeographicPreview = Geography;
export default Geography;
