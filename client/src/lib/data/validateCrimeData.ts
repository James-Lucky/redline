import { DistrictCrimeRecord, AnnualCrimeRecord } from "@/types/crime";

export interface ValidationIssue {
  field: string;
  severity: "error" | "warning";
  message: string;
}

/**
 * Validates district crime records against civic data rules.
 * Enforces non-negative values, non-empty district names, and consistency.
 */
export function validateDistrictCrimeRecords(records: DistrictCrimeRecord[]): {
  isValid: boolean;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];

  if (!records || records.length === 0) {
    issues.push({
      field: "records",
      severity: "error",
      message: "No district crime records provided for validation.",
    });
    return { isValid: false, issues };
  }

  records.forEach((rec, idx) => {
    if (!rec.district) {
      issues.push({
        field: `records[${idx}].district`,
        severity: "error",
        message: "District name is missing or blank.",
      });
    }

    if (rec.totalIpc < 0) {
      issues.push({
        field: `records[${idx}].totalIpc`,
        severity: "error",
        message: `Negative total IPC count found for district ${rec.district}: ${rec.totalIpc}`,
      });
    }

    const checkFields: Array<keyof DistrictCrimeRecord> = [
      "murder", "rape", "robbery", "burglary", "theft", "riots", "cheating"
    ];

    for (const f of checkFields) {
      const val = rec[f];
      if (typeof val === "number" && val < 0) {
        issues.push({
          field: `records[${idx}].${String(f)}`,
          severity: "error",
          message: `Negative value in category ${String(f)} for district ${rec.district}: ${val}`,
        });
      }
    }
  });

  const hasErrors = issues.some(i => i.severity === "error");
  return { isValid: !hasErrors, issues };
}

/**
 * Validates annual crime trend records.
 */
export function validateAnnualCrimeRecords(records: AnnualCrimeRecord[]): {
  isValid: boolean;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];

  if (!records || records.length === 0) {
    issues.push({
      field: "records",
      severity: "error",
      message: "No annual records provided.",
    });
    return { isValid: false, issues };
  }

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (!r.year || r.year < 1950 || r.year > 2050) {
      issues.push({
        field: `records[${i}].year`,
        severity: "error",
        message: `Invalid calendar year ${r.year}.`,
      });
    }

    if (r.total_ipc_crimes <= 0) {
      issues.push({
        field: `records[${i}].total_ipc_crimes`,
        severity: "warning",
        message: `Zero or negative annual crimes for year ${r.year}: ${r.total_ipc_crimes}`,
      });
    }
  }

  const hasErrors = issues.some(i => i.severity === "error");
  return { isValid: !hasErrors, issues };
}
