# CrimeLens Delhi - Data Preprocessing & Validation Report
**Generated**: 2026-10-22T17:39:07.495983

## 1. Raw Inputs Inspected
- **Crime Source File**: `data/raw/crime\dstrIPC_2013.csv` (Size: 95,088 bytes)
  - Total National Rows: 823
  - Delhi Records Found: 19 rows
  - [PASS] Zero negative values detected.
  - [PASS] Zero null values in numeric crime fields.
  - **Integrity Check**: Sum of unit crimes (80184) vs Reported Total (80184) -> Discrepancy: 0
- **Generated Output**: `data/processed\delhi_district_crime.csv` (18 rows)
- **Generated Output**: `data/processed\delhi_crime_annual.csv` (10 years: 2013-2022)
  - Extracted 11 Delhi administrative district polygons from Survey of India.
- **Generated Output**: `data/processed\delhi_district_boundaries.geojson`
- **Copied to Client**: `client/public/data\delhi_district_boundaries.geojson`
- **Generated Output**: `data/processed\dataset_manifest.json`