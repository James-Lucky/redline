"use client";

import { useState, useCallback } from "react";
import { DashboardFilters } from "@/types/crime";

export function useCrimeFilters(initialFilters?: Partial<DashboardFilters>) {
  const [filters, setFilters] = useState<DashboardFilters>({
    year: initialFilters?.year ?? 2013,
    category: initialFilters?.category ?? "total_ipc",
    selectedDistrict: initialFilters?.selectedDistrict ?? null,
    unitType: initialFilters?.unitType ?? "territorial",
  });

  const setYear = useCallback((year: number) => {
    setFilters((prev) => ({ ...prev, year }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSelectedDistrict = useCallback((selectedDistrict: string | null) => {
    setFilters((prev) => ({ ...prev, selectedDistrict }));
  }, []);

  const setUnitType = useCallback((unitType: "all" | "territorial" | "specialized") => {
    setFilters((prev) => ({ ...prev, unitType }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      year: 2013,
      category: "total_ipc",
      selectedDistrict: null,
      unitType: "territorial",
    });
  }, []);

  return {
    filters,
    setYear,
    setCategory,
    setSelectedDistrict,
    setUnitType,
    resetFilters,
  };
}
