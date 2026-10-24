import {
  DistrictCrimeRecord,
  AnnualCrimeRecord,
  DatasetManifest,
} from "@/types/crime";
import { normalizeDistrictCrimeRow } from "./normalizeCrimeData";
import {
  STATIC_DISTRICT_RAW,
  STATIC_ANNUAL_DATA,
  STATIC_MANIFEST,
} from "./staticCrimeData";

/**
 * Loads verified district-level crime data for Delhi.
 * Deterministic and synchronous to guarantee SSR safety and zero client hydration mismatch.
 */
export function getDelhiDistrictCrimeData(): DistrictCrimeRecord[] {
  return STATIC_DISTRICT_RAW.map(normalizeDistrictCrimeRow);
}

/**
 * Loads annual historical trend series (2013–2022).
 */
export function getDelhiAnnualCrimeData(): AnnualCrimeRecord[] {
  return STATIC_ANNUAL_DATA as AnnualCrimeRecord[];
}

/**
 * Loads dataset registry and provenance manifest.
 */
export function getDatasetManifest(): DatasetManifest {
  return STATIC_MANIFEST;
}

/**
 * Returns citywide aggregate summary for a specific year.
 */
export function getCitywideAnnualSummary(year: number = 2013): AnnualCrimeRecord | undefined {
  const records = getDelhiAnnualCrimeData();
  return records.find((r) => r.year === year);
}
