import { AnnualCrimeRecord, DistrictCrimeRecord } from "@/types/crime";

/**
 * Computes absolute change between two numbers.
 */
export function calculateAbsoluteChange(current: number, previous: number): number {
  return current - previous;
}

/**
 * Computes percentage change.
 * Returns null if baseline is zero or undefined to avoid division by zero or nonsensical percentages.
 */
export function calculatePercentageChange(current: number, previous: number): number | null {
  if (previous === 0 || previous == null || isNaN(previous)) {
    return null;
  }
  const pct = ((current - previous) / previous) * 100;
  return Number(pct.toFixed(1));
}

/**
 * Formats percentage change with sign.
 */
export function formatPercentageChange(pct: number | null): string {
  if (pct === null) return "N/A (zero baseline)";
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

/**
 * Calculates crime rate per 100,000 residents using documented population.
 * Rule: Never label a raw case count as a crime rate.
 */
export function calculateCrimeRatePerLakh(
  cases: number,
  population: number
): { rate: number; formula: string } | null {
  if (!population || population <= 0) return null;
  const rate = Number(((cases / population) * 100000).toFixed(1));
  return {
    rate,
    formula: `(${cases.toLocaleString()} cases / ${population.toLocaleString()} residents) * 100,000`,
  };
}

/**
 * Extracts value for a specific crime category key from DistrictCrimeRecord.
 */
export function getDistrictMetricValue(record: DistrictCrimeRecord, categoryKey: string): number {
  switch (categoryKey) {
    case "total_ipc":
      return record.totalIpc;
    case "murder":
      return record.murder;
    case "attempt_murder":
      return record.attemptMurder;
    case "rape":
      return record.rape;
    case "kidnapping":
      return record.kidnapping;
    case "robbery":
      return record.robbery;
    case "burglary":
      return record.burglary;
    case "theft":
      return record.theft;
    case "auto_theft":
      return record.autoTheft;
    case "riots":
      return record.riots;
    case "cheating":
      return record.cheating;
    case "dowry_deaths":
      return record.dowryDeaths;
    case "assault_women_modesty":
      return record.assaultOnWomenModesty;
    case "cruelty_by_husband":
      return record.crueltyByHusband;
    case "death_by_negligence":
      return record.deathByNegligence;
    default:
      return record.totalIpc;
  }
}

/**
 * Extracts value for a crime category key from AnnualCrimeRecord.
 */
export function getAnnualMetricValue(record: AnnualCrimeRecord, categoryKey: string): number {
  switch (categoryKey) {
    case "total_ipc":
      return record.total_ipc_crimes;
    case "murder":
      return record.murder;
    case "rape":
      return record.rape;
    case "robbery":
      return record.robbery;
    case "burglary":
      return record.burglary;
    case "theft":
      return record.theft;
    case "kidnapping":
      return record.kidnapping_abduction;
    case "riots":
      return record.riots;
    case "cheating":
      return record.cheating;
    case "assault_women_modesty":
      return record.assault_on_women_modesty;
    default:
      return record.total_ipc_crimes;
  }
}

/**
 * Category metadata definitions.
 */
export const CRIME_CATEGORIES = [
  { key: "total_ipc", label: "Total IPC Crimes", description: "Aggregated Indian Penal Code cognizable crimes." },
  { key: "theft", label: "Theft (All Forms)", description: "Ordinary theft and motor vehicle theft (largest category)." },
  { key: "burglary", label: "Burglary / House-breaking", description: "Lurking house-trespass and house-breaking." },
  { key: "robbery", label: "Robbery", description: "Theft with violence or threat of instant hurt." },
  { key: "kidnapping", label: "Kidnapping & Abduction", description: "Kidnapping from lawful guardianship and abduction." },
  { key: "assault_women_modesty", label: "Assault on Women (Modesty)", description: "Section 354 IPC cases." },
  { key: "murder", label: "Murder (Sec 302 IPC)", description: "Intentional culpable homicide." },
  { key: "rape", label: "Rape (Sec 376 IPC)", description: "Reported custodial and non-custodial sexual assault." },
  { key: "cheating", label: "Cheating & Forgery", description: "White collar, fraudulent deception and forgery." },
  { key: "riots", label: "Riots (Sec 147 IPC)", description: "Unlawful assembly with violence or disturbance of public peace." },
];

/**
 * Sorts districts by selected crime category.
 */
export function getRankedDistricts(
  records: DistrictCrimeRecord[],
  categoryKey: string,
  territorialOnly: boolean = true
): Array<{ district: string; displayName: string; value: number; share: number }> {
  const filtered = territorialOnly
    ? records.filter((r) => r.geographyType === "police_district")
    : records;

  const total = filtered.reduce((sum, r) => sum + getDistrictMetricValue(r, categoryKey), 0);

  return filtered
    .map((r) => {
      const val = getDistrictMetricValue(r, categoryKey);
      return {
        district: r.district,
        displayName: r.displayName,
        value: val,
        share: total > 0 ? Number(((val / total) * 100).toFixed(1)) : 0,
      };
    })
    .sort((a, b) => b.value - a.value);
}
