"use client";

import { useMemo } from "react";
import {
  getDelhiDistrictCrimeData,
  getDelhiAnnualCrimeData,
  getDatasetManifest,
} from "@/lib/data/loadCrimeData";
import { DistrictCrimeRecord, AnnualCrimeRecord, DatasetManifest } from "@/types/crime";

export function useCrimeData() {
  const districtRecords = useMemo<DistrictCrimeRecord[]>(() => {
    return getDelhiDistrictCrimeData();
  }, []);

  const annualRecords = useMemo<AnnualCrimeRecord[]>(() => {
    return getDelhiAnnualCrimeData();
  }, []);

  const manifest = useMemo<DatasetManifest>(() => {
    return getDatasetManifest();
  }, []);

  const territorialDistricts = useMemo(() => {
    return districtRecords.filter((d) => d.geographyType === "police_district");
  }, [districtRecords]);

  const specializedUnits = useMemo(() => {
    return districtRecords.filter((d) => d.geographyType === "specialized_unit");
  }, [districtRecords]);

  return {
    districtRecords,
    annualRecords,
    manifest,
    territorialDistricts,
    specializedUnits,
    isLoading: false,
    error: null,
  };
}
