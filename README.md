# CrimeLens Delhi — Civic Data Analytics Application

CrimeLens Delhi is a maintainable, responsive, production-quality civic analytics platform designed to explore official police-recorded crime statistics for Delhi. It enables citizens, researchers, and journalists to compare reporting periods, examine crime category distributions, inspect official geographic district boundaries, understand statistical limitations, and consult a source-grounded AI analyst.

> **Civic Purpose & Safety Disclaimer**: CrimeLens Delhi is a public-data exploration tool based strictly on verified historical First Information Reports (FIRs) published by the National Crime Records Bureau (NCRB) and Delhi Police. It is **not** a predictive crime forecasting tool, emergency dispatch service, or public safety alert system.

---

## Architecture & Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a dark analytics dashboard design system:
  - Background canvas: `#0f1012`
  - Sidebar: `#121416`
  - Cards & surfaces: `#17191d`
  - Neutral borders: `#292c32`
  - Restrained primary brand & highlights: `#ff5038`
  - Typography: Manrope (Headings) and Inter (Body) via Google Fonts
- **Visualizations**: [Recharts](https://recharts.org/) for longitudinal annual trend charts and [SVG Choropleth](client/src/components/Geography.tsx) for Survey of India district boundaries
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Preprocessing**: Python 3 with Pandas (`scripts/preprocess_crime_data.py`)
- **Automated Testing**: Node.js test runner (`npm test`)

---

## Directory Structure

```text
redline/
├── data/
│   ├── raw/
│   │   ├── crime/             # Raw official NCRB crime files (e.g., dstrIPC_2013.csv)
│   │   └── boundaries/        # Raw Survey of India (SOI) / NWIC GeoJSON boundaries
│   ├── processed/             # Cleaned, validated application datasets
│   │   ├── delhi_district_crime.csv
│   │   ├── delhi_crime_annual.csv
│   │   ├── delhi_district_boundaries.geojson
│   │   ├── dataset_manifest.json
│   │   └── preprocessing_report.md
│   └── dstrIPC_2013.csv       # Preserved original root raw download
├── scripts/
│   ├── preprocess_crime_data.py  # Deterministic preprocessing & validation pipeline
│   └── generate_svg_paths.py     # Planar SVG coordinate generator
├── client/
│   ├── public/
│   │   └── data/              # Static JSON/GeoJSON for client consumption
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Overview dashboard (Route: /)
│   │   │   ├── explore/page.tsx  # District Geographic Explorer (Route: /explore)
│   │   │   ├── trends/page.tsx   # 10-Year Annual Trend Analysis (Route: /trends)
│   │   │   ├── sources/page.tsx  # Dataset Registry & Provenance (Route: /sources)
│   │   │   ├── methodology/page.tsx # Caveats, e-FIR shift & limits (Route: /methodology)
│   │   │   └── api/analyst/route.ts # Server-side AI analyst endpoint
│   │   ├── components/        # Reusable dashboard, layout, and UI components
│   │   ├── hooks/             # Shared React hooks (useCrimeFilters, useCrimeData, useCrimeAnalytics)
│   │   ├── lib/
│   │   │   ├── analytics/     # Pure calculations (change, percentage, rankings, rates)
│   │   │   ├── data/          # Loaders, normalizers, and schema validators
│   │   │   └── geo/           # Explicit district alias & coterminous matching
│   │   └── types/             # Explicit TypeScript interfaces (crime.ts)
│   └── tests/
│       └── run_tests.mjs      # Automated unit & integration test suite
```

---

## Setup & Running the Application

### 1. Prerequisites
- Node.js `v20.x` or higher (verified on Node `v24.18.0`)
- Python 3.9+ with `pandas` and `numpy` (for data preprocessing)

### 2. Environment Variables
To enable Gemini/Gemma live queries in the AI Analyst endpoint, create a `.env.local` file inside `client/`:

```env
# Optional: Google GenAI API Key for Gemma/Gemini integration
# If omitted or offline, the AI Analyst automatically falls back to deterministic evidence generation
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security Note**: API keys must remain strictly on the server side. Never expose secrets to client browser bundles or commit `.env` files to git.

### 3. Preprocessing Crime & Boundary Data
Run the repeatable Python preprocessing pipeline from the repository root:

```bash
python scripts/preprocess_crime_data.py
```
This script validates data integrity, computes audit sums, extracts Delhi police jurisdictions, extracts Survey of India boundary polygons, and populates `data/processed/` and `client/public/data/`.

### 4. Running the Next.js Development Server
```bash
cd client
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Automated Test Suite
```bash
cd client
npm test
```
Runs tests covering data normalization, analytics calculations, boundary matching, and API input guards.

### 6. Production Build
```bash
cd client
npm run build
```

---

## Pages & Routes

1. **`/` (Overview)**: High-level civic dashboard with reporting-period filters, verified summary metric cards, interactive geographic overview, historical trend chart, district volume rankings, and an AI analyst bottom dock.
2. **`/explore` (District Explorer)**: Interactive map and table linking Survey of India revenue boundaries with 2013 Delhi Police district statistics, detail inspection card, and a dedicated audit panel for non-coterminous/transit units.
3. **`/trends` (Crime Trends)**: 10-year official longitudinal trajectory (2013–2022) with YoY absolute/percentage difference tables and documented procedural notices.
4. **`/sources` (Dataset Registry)**: Dataset catalog detailing publishers, source URLs, temporal coverage, geographic granularity, completeness, and validation status.
5. **`/methodology` (Methodology & Caveats)**: Analytical guide detailing First Information Reports (FIRs), the "dark figure" of crime, the 2014 online e-FIR paradigm shift, population denominators, and boundary differences.

---

## Differences Between Police and Administrative Districts

A critical civic distinction enforced in CrimeLens Delhi:

| Dimension | Administrative (Revenue) Districts | Delhi Police Districts |
| :--- | :--- | :--- |
| **Governance** | Headed by District Magistrates / Revenue Dept | Commanded by Deputy Commissioners of Police (DCP) |
| **2013 Structure** | 11 Districts (Survey of India / Census) | 11 Territorial Districts + 7 Specialized / Transit Units |
| **Shahdara Example** | Created as a revenue district in 2012 | Formed as a separate police district in 2017 (unavailable in 2013 reporting) |
| **Outer District** | No revenue counterpart (covers parts of NW/North) | Major police district covering outer residential/rural perimeters |
| **Transit Corridors** | Enclosed within land boundaries | GRP Railway, Metro Rail, and Airport have corridor-wide jurisdiction |

*Policy: CrimeLens never silently equates administrative boundaries with police jurisdictions and displays explicit "Unavailable Data" states for non-coterminous units.*

---

## Processed Datasets

| Dataset Identifier | Publisher | Reporting Period | Granularity | Validation Status |
| :--- | :--- | :--- | :--- | :--- |
| `delhi_district_crime_2013` | NCRB / Ministry of Home Affairs | 2013 (Full Year) | 18 Police Units (11 territorial + 7 specialized) | **Verified** (Discrepancy: 0) |
| `delhi_crime_annual_series` | NCRB Crime in India Compendia | 2013–2022 (10 Years) | State/UT Level (Delhi) | **Verified** (e-FIR documented) |
| `delhi_administrative_boundaries` | Survey of India (SOI) / NWIC | 2011 Framework | 11 Revenue District Polygons | **Verified** (EPSG:4326/CRS84) |

---

## How to Add a New Dataset

1. Place raw official files into `data/raw/crime/` (CSVs/PDFs) or `data/raw/boundaries/` (GeoJSON).
2. Update `scripts/preprocess_crime_data.py` to add parsing and validation rules for the new reporting vintage.
3. Run `python scripts/preprocess_crime_data.py` to regenerate `data/processed/` outputs.
4. Update `client/src/lib/geo/matchDistricts.ts` if new geographic boundary changes or police district splits (e.g. 2017 Rohini/Shahdara additions) are introduced.
5. Run `npm test` and `npm run build` in `client/` to verify type safety and data integrity.
