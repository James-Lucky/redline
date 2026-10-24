import { DistrictCrimeRecord, DistrictMatchResult } from "@/types/crime";

/**
 * Explicit Alias and Provenance Mapping:
 * Maps Survey of India Administrative/Revenue Districts to Delhi Police Districts.
 * Provides a verified audit trail and prevents silent fabrication of statistics.
 */
export const DISTRICT_ALIAS_MAP: Record<
  string,
  {
    policeDistrictKey: string | null;
    status: "matched" | "unavailable";
    boundaryNote: string;
  }
> = {
  "Central": {
    policeDistrictKey: "CENTRAL",
    status: "matched",
    boundaryNote: "Direct spatial alignment with Central Delhi Police District (2013 vintage).",
  },
  "East": {
    policeDistrictKey: "EAST",
    status: "matched",
    boundaryNote: "Direct spatial alignment with East Delhi Police District (2013 vintage).",
  },
  "New Delhi": {
    policeDistrictKey: "NEW DELHI",
    status: "matched",
    boundaryNote: "Direct spatial alignment with New Delhi Police District (2013 vintage).",
  },
  "North": {
    policeDistrictKey: "NORTH",
    status: "matched",
    boundaryNote: "Direct spatial alignment with North Delhi Police District (2013 vintage).",
  },
  "North East": {
    policeDistrictKey: "NORTH-EAST",
    status: "matched",
    boundaryNote: "Normalized alias (hyphenated in police records: NORTH-EAST).",
  },
  "North West": {
    policeDistrictKey: "NORTH-WEST",
    status: "matched",
    boundaryNote: "Normalized alias (hyphenated in police records: NORTH-WEST).",
  },
  "South": {
    policeDistrictKey: "SOUTH",
    status: "matched",
    boundaryNote: "Direct spatial alignment with South Delhi Police District (2013 vintage).",
  },
  "South East": {
    policeDistrictKey: "SOUTH-EAST",
    status: "matched",
    boundaryNote: "Normalized alias (hyphenated in police records: SOUTH-EAST).",
  },
  "South West": {
    policeDistrictKey: "SOUTH-WEST",
    status: "matched",
    boundaryNote: "Normalized alias (hyphenated in police records: SOUTH-WEST).",
  },
  "West": {
    policeDistrictKey: "WEST",
    status: "matched",
    boundaryNote: "Direct spatial alignment with West Delhi Police District (2013 vintage).",
  },
  "Shahdara": {
    policeDistrictKey: null,
    status: "unavailable",
    boundaryNote:
      "Data Unavailable for 2013 vintage: Shahdara was created administratively in 2012, but Delhi Police Shahdara District was only notified and reported separately in 2017. In 2013, cases were recorded under East and North-East police districts.",
  },
};

/**
 * Matches an administrative district polygon name to its police crime record.
 * Returns explicit status and audit notes.
 */
export function matchAdministrativeDistrict(
  adminName: string,
  crimeRecords: DistrictCrimeRecord[]
): DistrictMatchResult {
  const mapping = DISTRICT_ALIAS_MAP[adminName] || {
    policeDistrictKey: null,
    status: "unavailable",
    boundaryNote: `No declared mapping for administrative district: '${adminName}'.`,
  };

  if (mapping.status === "unavailable" || !mapping.policeDistrictKey) {
    return {
      administrativeDistrict: adminName,
      matchedPoliceDistrict: undefined,
      matchStatus: "unavailable",
      data: undefined,
      boundaryNote: mapping.boundaryNote,
    };
  }

  const foundRecord = crimeRecords.find(
    (r) => r.district === mapping.policeDistrictKey
  );

  if (!foundRecord) {
    return {
      administrativeDistrict: adminName,
      matchedPoliceDistrict: mapping.policeDistrictKey,
      matchStatus: "unavailable",
      data: undefined,
      boundaryNote: `Police district '${mapping.policeDistrictKey}' was mapped but no crime record was found in dataset.`,
    };
  }

  return {
    administrativeDistrict: adminName,
    matchedPoliceDistrict: mapping.policeDistrictKey,
    matchStatus: "matched",
    data: foundRecord,
    boundaryNote: mapping.boundaryNote,
  };
}

/**
 * Returns specialized or non-coterminous police units that cannot be joined
 * to revenue district polygons without geospatial error.
 */
export function getNonCoterminousUnits(crimeRecords: DistrictCrimeRecord[]): Array<{
  record: DistrictCrimeRecord;
  reason: string;
}> {
  return crimeRecords
    .filter((r) => r.geographyType === "specialized_unit" || r.district === "OUTER")
    .map((record) => {
      let reason = "Specialized investigative or jurisdiction-wide operational unit";
      if (record.district === "OUTER") {
        reason = "Non-coterminous police district in 2013 covering North/North-West outer perimeters";
      } else if (record.district === "GRP(RLY)") {
        reason = "Transit jurisdiction across all Delhi railway stations and tracks";
      } else if (record.district === "METRO RAIL") {
        reason = "Transit jurisdiction across Delhi Metro network";
      } else if (record.district === "IGI AIRPORT") {
        reason = "Aviation perimeter jurisdiction for Indira Gandhi International Airport";
      } else if (record.district === "CAW") {
        reason = "Specialized Crime Against Women Cell";
      } else if (record.district === "CRIME BRANCH") {
        reason = "Centralized specialized crime investigation wing";
      } else if (record.district === "EOW") {
        reason = "Centralized Economic Offences Wing";
      } else if (record.district === "STF") {
        reason = "Special Task Force operations";
      }
      return { record, reason };
    });
}
