/**
 * CrimeLens Delhi - Type Definitions
 * Typed boundaries for civic crime statistics, geographic provenance, and analytics.
 */

export type GeographyType = "police_district" | "administrative_district" | "specialized_unit" | "state_ut";

export interface CrimeCategoryMeta {
  key: string;
  label: string;
  description: string;
  isViolent: boolean;
  isProperty: boolean;
}

export interface DistrictCrimeRecord {
  district: string;
  displayName: string;
  year: number;
  geographyType: "police_district" | "specialized_unit";
  totalIpc: number;
  murder: number;
  attemptMurder: number;
  rape: number;
  kidnapping: number;
  robbery: number;
  burglary: number;
  theft: number;
  autoTheft: number;
  riots: number;
  cheating: number;
  dowryDeaths: number;
  assaultOnWomenModesty: number;
  crueltyByHusband: number;
  deathByNegligence: number;
  otherIpc: number;
  rawSource: Record<string, string | number>;
}

export interface AnnualCrimeRecord {
  year: number;
  total_ipc_crimes: number;
  murder: number;
  rape: number;
  robbery: number;
  burglary: number;
  theft: number;
  kidnapping_abduction: number;
  riots: number;
  cheating: number;
  assault_on_women_modesty: number;
  source: string;
  coverage: "full_year" | "partial_year";
  procedural_warning?: string;
}

export interface DistrictMatchResult {
  administrativeDistrict: string;
  matchedPoliceDistrict?: string;
  matchStatus: "matched" | "unavailable" | "specialized_unit";
  data?: DistrictCrimeRecord;
  boundaryNote: string;
}

export interface DashboardFilters {
  year: number;
  category: string;
  selectedDistrict: string | null;
  unitType: "all" | "territorial" | "specialized";
}

export interface DatasetEntry {
  id: string;
  title: string;
  publisher: string;
  publication_year: number;
  reporting_period: string;
  geography_type: GeographyType;
  temporal_coverage: string;
  granularity: string;
  source_file: string;
  source_url: string;
  row_count: number;
  validation_status: "verified" | "warning" | "unverified";
  completeness: string;
  audit_notes: string;
}

export interface DatasetManifest {
  generated_at: string;
  application: string;
  description: string;
  datasets: DatasetEntry[];
}

export interface MetricSummary {
  label: string;
  value: string;
  rawValue: number;
  change?: string;
  isPositive?: boolean; // For crime, decrease is positive for society
  trendDescription?: string;
  timeRange: string;
  definition: string;
  caveat?: string;
}

export interface AnalystQueryRequest {
  question: string;
  activeFilters?: Partial<DashboardFilters>;
}

export interface AnalystQueryResponse {
  answer: string;
  computedMetrics: Array<{
    metric: string;
    value: string | number;
    period: string;
    source: string;
  }>;
  coverageWarnings: string[];
  sourcesCited: Array<{
    title: string;
    publisher: string;
    year: string | number;
  }>;
  isGemmaPowered: boolean;
}
