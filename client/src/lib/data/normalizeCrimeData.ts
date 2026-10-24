import { DistrictCrimeRecord } from "@/types/crime";

const SPECIALIZED_CODES: Record<string, string> = {
  "CAW": "Crime Against Women Cell",
  "CRIME BRANCH": "Crime Branch Specialized Unit",
  "EOW": "Economic Offences Wing",
  "GRP(RLY)": "Government Railway Police (Delhi)",
  "IGI AIRPORT": "IGI Airport Police Unit",
  "METRO RAIL": "Delhi Metro Rail Police Unit",
  "STF": "Special Task Force",
};

/**
 * Normalizes raw NCRB CSV row into typed DistrictCrimeRecord.
 * Preserves source values without zeroing nulls or distorting definitions.
 */
export function normalizeDistrictCrimeRow(row: Record<string, any>): DistrictCrimeRecord {
  const districtRaw = String(row["DISTRICT_CLEAN"] || row["DISTRICT"] || "").trim().toUpperCase();
  const isSpecialized = Object.prototype.hasOwnProperty.call(SPECIALIZED_CODES, districtRaw);

  const displayName = isSpecialized
    ? SPECIALIZED_CODES[districtRaw]
    : districtRaw.split("-").map(part => part.charAt(0) + part.slice(1).toLowerCase()).join("-") + " Police District";

  return {
    district: districtRaw,
    displayName,
    year: Number(row["YEAR"]) || 2013,
    geographyType: isSpecialized ? "specialized_unit" : "police_district",
    totalIpc: Number(row["TOTAL IPC CRIMES"]) || 0,
    murder: Number(row["MURDER"]) || 0,
    attemptMurder: Number(row["ATTEMPT TO MURDER"]) || 0,
    rape: Number(row["RAPE"]) || 0,
    kidnapping: Number(row["KIDNAPPING & ABDUCTION"]) || 0,
    robbery: Number(row["ROBBERY"]) || 0,
    burglary: Number(row["BURGLARY"]) || 0,
    theft: Number(row["THEFT"]) || 0,
    autoTheft: Number(row["AUTO THEFT"]) || 0,
    riots: Number(row["RIOTS"]) || 0,
    cheating: Number(row["CHEATING"]) || 0,
    dowryDeaths: Number(row["DOWRY DEATHS"]) || 0,
    assaultOnWomenModesty: Number(row["ASSAULT ON WOMEN WITH INTENT TO OUTRAGE HER MODESTY"]) || 0,
    crueltyByHusband: Number(row["CRUELTY BY HUSBAND OR HIS RELATIVES"]) || 0,
    deathByNegligence: Number(row["CAUSING DEATH BY NEGLIGENCE"]) || 0,
    otherIpc: Number(row["OTHER IPC CRIMES"]) || 0,
    rawSource: row,
  };
}
