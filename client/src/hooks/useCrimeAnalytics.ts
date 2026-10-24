"use client";

import { useMemo } from "react";
import { useCrimeData } from "./useCrimeData";
import { DashboardFilters, MetricSummary } from "@/types/crime";
import {
  calculateAbsoluteChange,
  calculatePercentageChange,
  formatPercentageChange,
  getDistrictMetricValue,
  getAnnualMetricValue,
  getRankedDistricts,
  CRIME_CATEGORIES,
} from "@/lib/analytics/calculations";

export function useCrimeAnalytics(filters: DashboardFilters) {
  const { districtRecords, annualRecords } = useCrimeData();

  // Find annual record matching selected year or default to latest
  const currentAnnual = useMemo(() => {
    return annualRecords.find((r) => r.year === filters.year) || annualRecords[0];
  }, [annualRecords, filters.year]);

  // Find previous annual record for trend calculation
  const previousAnnual = useMemo(() => {
    const currentIndex = annualRecords.findIndex((r) => r.year === currentAnnual.year);
    if (currentIndex > 0) {
      return annualRecords[currentIndex - 1];
    }
    return null;
  }, [annualRecords, currentAnnual]);

  // Citywide summary metric cards
  const metrics = useMemo<MetricSummary[]>(() => {
    if (!currentAnnual) return [];

    const totalCrimes = currentAnnual.total_ipc_crimes;
    const prevTotal = previousAnnual?.total_ipc_crimes ?? null;
    const pctChange = prevTotal != null ? calculatePercentageChange(totalCrimes, prevTotal) : null;
    const absChange = prevTotal != null ? calculateAbsoluteChange(totalCrimes, prevTotal) : null;

    // In civic crime stats, an increase in cases is marked visually with caution/warning
    const isTotalPositive = pctChange != null ? pctChange <= 0 : true;

    // Theft & Property Crime (major category)
    const theftCount = currentAnnual.theft;
    const prevTheft = previousAnnual?.theft ?? null;
    const theftPct = prevTheft != null ? calculatePercentageChange(theftCount, prevTheft) : null;

    // Violent Crime: Murder + Robbery + Rape
    const violentCount = currentAnnual.murder + currentAnnual.robbery + currentAnnual.rape;
    const prevViolent = previousAnnual
      ? previousAnnual.murder + previousAnnual.robbery + previousAnnual.rape
      : null;
    const violentPct = prevViolent != null ? calculatePercentageChange(violentCount, prevViolent) : null;

    // Crimes against women
    const womenCount = currentAnnual.assault_on_women_modesty + currentAnnual.rape;
    const prevWomen = previousAnnual
      ? previousAnnual.assault_on_women_modesty + previousAnnual.rape
      : null;
    const womenPct = prevWomen != null ? calculatePercentageChange(womenCount, prevWomen) : null;

    return [
      {
        label: "Total IPC Crimes",
        value: totalCrimes.toLocaleString(),
        rawValue: totalCrimes,
        change: prevTotal != null ? formatPercentageChange(pctChange) : "Baseline Year",
        isPositive: isTotalPositive,
        trendDescription: absChange != null ? `${absChange > 0 ? "+" : ""}${absChange.toLocaleString()} cases vs prev year` : "Authoritative baseline",
        timeRange: `Reporting Year: ${currentAnnual.year}`,
        definition: "Total cognizable Indian Penal Code crimes registered by Delhi Police.",
        caveat: currentAnnual.procedural_warning,
      },
      {
        label: "Theft & Property Offenses",
        value: theftCount.toLocaleString(),
        rawValue: theftCount,
        change: prevTheft != null ? formatPercentageChange(theftPct) : "Baseline Year",
        isPositive: theftPct != null ? theftPct <= 0 : true,
        trendDescription: `${((theftCount / totalCrimes) * 100).toFixed(1)}% of all registered IPC crimes`,
        timeRange: `Reporting Year: ${currentAnnual.year}`,
        definition: "Includes motor vehicle thefts and general burglary/thefts reported via police stations & e-FIR portal.",
      },
      {
        label: "Major Violent Crimes",
        value: violentCount.toLocaleString(),
        rawValue: violentCount,
        change: prevViolent != null ? formatPercentageChange(violentPct) : "Baseline Year",
        isPositive: violentPct != null ? violentPct <= 0 : true,
        trendDescription: "Murder, robbery, and rape combined",
        timeRange: `Reporting Year: ${currentAnnual.year}`,
        definition: "Sum of homicide (Sec 302), robbery (Sec 392), and rape (Sec 376) offenses.",
      },
      {
        label: "Crimes Against Women (Key IPC)",
        value: womenCount.toLocaleString(),
        rawValue: womenCount,
        change: prevWomen != null ? formatPercentageChange(womenPct) : "Baseline Year",
        isPositive: womenPct != null ? womenPct <= 0 : true,
        trendDescription: "Assault to outrage modesty & rape",
        timeRange: `Reporting Year: ${currentAnnual.year}`,
        definition: "Includes Sec 354 and Sec 376 IPC offenses registered in official records.",
      },
    ];
  }, [currentAnnual, previousAnnual]);

  // Ranked districts for selected category
  const districtRankings = useMemo(() => {
    return getRankedDistricts(
      districtRecords,
      filters.category,
      filters.unitType === "territorial"
    );
  }, [districtRecords, filters.category, filters.unitType]);

  // Selected district detail
  const selectedDistrictData = useMemo(() => {
    const sel = filters.selectedDistrict;
    if (!sel) return null;
    return (
      districtRecords.find(
        (d) =>
          d.district === sel ||
          d.displayName.toLowerCase().includes(sel.toLowerCase())
      ) || null
    );
  }, [districtRecords, filters.selectedDistrict]);

  return {
    currentAnnual,
    previousAnnual,
    metrics,
    districtRankings,
    selectedDistrictData,
    crimeCategories: CRIME_CATEGORIES,
  };
}
