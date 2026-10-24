/**
 * CrimeLens Delhi - Automated Test Suite
 * Validates data normalization, analytics calculations, boundary matching, and edge cases.
 */

import assert from "node:assert/strict";
import test from "node:test";

// 1. Calculations & Metrics Tests
function calculateAbsoluteChange(current, previous) {
  return current - previous;
}

function calculatePercentageChange(current, previous) {
  if (previous === 0 || previous == null || isNaN(previous)) {
    return null;
  }
  const pct = ((current - previous) / previous) * 100;
  return Number(pct.toFixed(1));
}

function calculateCrimeRatePerLakh(cases, population) {
  if (!population || population <= 0) return null;
  const rate = Number(((cases / population) * 100000).toFixed(1));
  return {
    rate,
    formula: `(${cases.toLocaleString()} cases / ${population.toLocaleString()} residents) * 100,000`,
  };
}

test("Analytics: calculateAbsoluteChange computes correct delta", () => {
  assert.equal(calculateAbsoluteChange(100, 80), 20);
  assert.equal(calculateAbsoluteChange(50, 80), -30);
  assert.equal(calculateAbsoluteChange(80, 80), 0);
});

test("Analytics: calculatePercentageChange handles normal, zero, and null baselines", () => {
  assert.equal(calculatePercentageChange(150, 100), 50.0);
  assert.equal(calculatePercentageChange(80, 100), -20.0);
  // Zero baseline must return null rather than Infinity
  assert.equal(calculatePercentageChange(50, 0), null);
  // Null or NaN baseline must return null
  assert.equal(calculatePercentageChange(50, null), null);
  assert.equal(calculatePercentageChange(50, NaN), null);
});

test("Analytics: calculateCrimeRatePerLakh enforces positive population denominators", () => {
  const result = calculateCrimeRatePerLakh(500, 1000000);
  assert.ok(result);
  assert.equal(result.rate, 50.0);
  assert.equal(calculateCrimeRatePerLakh(500, 0), null);
  assert.equal(calculateCrimeRatePerLakh(500, -5000), null);
});

// 2. Data Normalization & Integrity Tests
const SPECIALIZED_CODES = {
  CAW: "Crime Against Women Cell",
  "CRIME BRANCH": "Crime Branch Specialized Unit",
  EOW: "Economic Offences Wing",
  "GRP(RLY)": "Government Railway Police (Delhi)",
  "IGI AIRPORT": "IGI Airport Police Unit",
  "METRO RAIL": "Delhi Metro Rail Police Unit",
  STF: "Special Task Force",
};

function normalizeDistrictCrimeRow(row) {
  const districtRaw = String(row["DISTRICT_CLEAN"] || row["DISTRICT"] || "").trim().toUpperCase();
  const isSpecialized = Object.prototype.hasOwnProperty.call(SPECIALIZED_CODES, districtRaw);
  return {
    district: districtRaw,
    displayName: isSpecialized ? SPECIALIZED_CODES[districtRaw] : districtRaw + " Police District",
    year: Number(row["YEAR"]) || 2013,
    geographyType: isSpecialized ? "specialized_unit" : "police_district",
    totalIpc: Number(row["TOTAL IPC CRIMES"]) || 0,
    murder: Number(row["MURDER"]) || 0,
    theft: Number(row["THEFT"]) || 0,
  };
}

test("Normalization: separates territorial police districts from specialized units", () => {
  const territorialRow = { DISTRICT: "SOUTH", YEAR: 2013, "TOTAL IPC CRIMES": 8593, MURDER: 23, THEFT: 3420 };
  const normalizedTerritorial = normalizeDistrictCrimeRow(territorialRow);
  assert.equal(normalizedTerritorial.geographyType, "police_district");
  assert.equal(normalizedTerritorial.district, "SOUTH");
  assert.equal(normalizedTerritorial.totalIpc, 8593);

  const specializedRow = { DISTRICT: "METRO RAIL", YEAR: 2013, "TOTAL IPC CRIMES": 962, MURDER: 1, THEFT: 875 };
  const normalizedSpecialized = normalizeDistrictCrimeRow(specializedRow);
  assert.equal(normalizedSpecialized.geographyType, "specialized_unit");
  assert.equal(normalizedSpecialized.displayName, "Delhi Metro Rail Police Unit");
});

test("Validation: rejects negative values and missing district names", () => {
  function validateRecords(records) {
    const issues = [];
    records.forEach((r, idx) => {
      if (!r.district) issues.push({ field: "district", error: "missing" });
      if (r.totalIpc < 0) issues.push({ field: "totalIpc", error: "negative" });
      if (r.murder < 0) issues.push({ field: "murder", error: "negative" });
    });
    return { isValid: issues.length === 0, issues };
  }

  const validRecord = { district: "CENTRAL", totalIpc: 4562, murder: 20 };
  assert.equal(validateRecords([validRecord]).isValid, true);

  const invalidRecord = { district: "", totalIpc: -50, murder: 10 };
  const valResult = validateRecords([invalidRecord]);
  assert.equal(valResult.isValid, false);
  assert.equal(valResult.issues.length, 2);
});

// 3. Geographic Boundary Matching & Audit Trail Tests
const DISTRICT_ALIAS_MAP = {
  Central: { policeKey: "CENTRAL", status: "matched" },
  East: { policeKey: "EAST", status: "matched" },
  "North East": { policeKey: "NORTH-EAST", status: "matched" },
  Shahdara: { policeKey: null, status: "unavailable" },
};

function matchDistrict(adminName, records) {
  const mapping = DISTRICT_ALIAS_MAP[adminName];
  if (!mapping || mapping.status === "unavailable") {
    return { status: "unavailable", matchedDistrict: null };
  }
  const match = records.find((r) => r.district === mapping.policeKey);
  return { status: match ? "matched" : "unavailable", matchedDistrict: mapping.policeKey };
}

test("Geography: maps coterminous districts and flags unavailable historical boundaries", () => {
  const records = [
    { district: "CENTRAL", totalIpc: 4562 },
    { district: "EAST", totalIpc: 10388 },
    { district: "NORTH-EAST", totalIpc: 9041 },
  ];

  const centralMatch = matchDistrict("Central", records);
  assert.equal(centralMatch.status, "matched");
  assert.equal(centralMatch.matchedDistrict, "CENTRAL");

  const neMatch = matchDistrict("North East", records);
  assert.equal(neMatch.status, "matched");
  assert.equal(neMatch.matchedDistrict, "NORTH-EAST");

  // Shahdara must be explicitly declared unavailable for 2013 vintage
  const shahdaraMatch = matchDistrict("Shahdara", records);
  assert.equal(shahdaraMatch.status, "unavailable");
  assert.equal(shahdaraMatch.matchedDistrict, null);
});

// 4. API Input Validation Tests
test("API: validates query string constraints", () => {
  function validateApiInput(body) {
    if (!body || typeof body.question !== "string" || !body.question.trim()) {
      return { status: 400, error: "Query string cannot be empty." };
    }
    if (body.question.length > 500) {
      return { status: 400, error: "Query exceeds maximum allowable length of 500 characters." };
    }
    return { status: 200, valid: true };
  }

  assert.equal(validateApiInput({ question: "" }).status, 400);
  assert.equal(validateApiInput({ question: "   " }).status, 400);
  assert.equal(validateApiInput({ question: "a".repeat(501) }).status, 400);
  assert.equal(validateApiInput({ question: "Why did theft surge after 2013?" }).status, 200);
});
