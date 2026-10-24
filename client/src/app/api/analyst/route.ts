import { NextRequest, NextResponse } from "next/server";
import { getDelhiDistrictCrimeData } from "@/lib/data/loadCrimeData";
import { AnalystQueryRequest, AnalystQueryResponse } from "@/types/crime";

// Server-side deterministic analytics interpreter for Delhi Districts
function deriveEvidenceForDistrictQuery(question: string) {
  const districts = getDelhiDistrictCrimeData();
  const q = question.toLowerCase();

  const territorial = districts.filter((d) => d.geographyType === "police_district");
  const specialized = districts.filter((d) => d.geographyType === "specialized_unit");

  // Check if a specific district is mentioned
  const targetDistrict = districts.find((d) => {
    const raw = d.district.toLowerCase();
    const clean = raw.replace("-", " ").replace("(", " ").replace(")", " ");
    return (
      q.includes(raw) ||
      q.includes(clean) ||
      q.includes(d.displayName.toLowerCase())
    );
  });

  const sortedByTotal = [...territorial].sort((a, b) => b.totalIpc - a.totalIpc);
  const sortedByTheft = [...territorial].sort((a, b) => b.theft - a.theft);
  const sortedByViolent = [...territorial].sort(
    (a, b) => b.murder + b.robbery + b.rape - (a.murder + a.robbery + a.rape)
  );

  return {
    targetDistrict,
    totalTerritorial: territorial.length,
    highestVolumeDistrict: sortedByTotal[0],
    lowestVolumeDistrict: sortedByTotal[sortedByTotal.length - 1],
    topTheftDistricts: sortedByTheft.slice(0, 3),
    topViolentDistricts: sortedByViolent.slice(0, 3),
    allDistricts: districts,
    warnings: [
      "In 2013, Delhi had 11 territorial police districts. Rohini and Shahdara police districts were constituted separately in 2017.",
      "Shahdara was recognized as an administrative revenue district in 2012, but police records for the area in 2013 were reported under East and North-East police districts.",
      "The 'Outer' police district in 2013 was a major non-coterminous jurisdiction covering outer residential perimeters with 9,579 crimes.",
    ],
  };
}

// Generate grounded district response
function generateDistrictAnswer(
  question: string,
  evidence: ReturnType<typeof deriveEvidenceForDistrictQuery>
): AnalystQueryResponse {
  const {
    targetDistrict,
    highestVolumeDistrict,
    lowestVolumeDistrict,
    topTheftDistricts,
    topViolentDistricts,
    warnings,
  } = evidence;
  const q = question.toLowerCase();

  let answerText = "";
  const metrics: AnalystQueryResponse["computedMetrics"] = [];

  if (q.includes("shahdara")) {
    answerText = `**Shahdara District (Reporting Vintage Notice):**
- **Status in 2013:** Data is officially marked as *Unavailable for the 2013 police vintage*.
- **Why?** Shahdara was notified as a revenue district by Delhi Government in 2012 by splitting East Delhi. However, Delhi Police did not constitute a separate **Shahdara Police District** until January 2017.
- **Where are the 2013 cases?** Crimes committed in the Shahdara area in 2013 were registered and reported under the **East** and **North-East** police districts.`;

    metrics.push(
      { metric: "Shahdara Police District", value: "Formed in 2017", period: "2013 Baseline", source: "Delhi Police Gazette" },
      { metric: "Parent Districts (2013)", value: "East & North-East", period: "2013", source: "NCRB 2013" }
    );
  } else if (targetDistrict) {
    const violent = targetDistrict.murder + targetDistrict.robbery + targetDistrict.rape;
    answerText = `**${targetDistrict.displayName} (Official 2013 Statistics):**
- **Total IPC Crimes:** ${targetDistrict.totalIpc.toLocaleString()} cases
- **Theft & Motor Vehicle Thefts:** ${targetDistrict.theft.toLocaleString()} cases (${((targetDistrict.theft / (targetDistrict.totalIpc || 1)) * 100).toFixed(1)}% of district total)
- **Violent Offenses:** ${violent.toLocaleString()} cases (${targetDistrict.murder} Murders, ${targetDistrict.robbery} Robberies, ${targetDistrict.rape} Rapes)
- **Crimes Against Women (Key IPC):** ${targetDistrict.assaultOnWomenModesty.toLocaleString()} cases of assault to outrage modesty (Sec 354 IPC)
- **Burglary:** ${targetDistrict.burglary.toLocaleString()} cases
- **Jurisdiction Type:** ${targetDistrict.geographyType === "police_district" ? "Territorial Police District" : "Specialized Non-Coterminous Unit"}`;

    metrics.push(
      { metric: `${targetDistrict.district} Total IPC`, value: targetDistrict.totalIpc.toLocaleString(), period: "2013", source: "NCRB 2013 Table 1.8" },
      { metric: `${targetDistrict.district} Theft`, value: targetDistrict.theft.toLocaleString(), period: "2013", source: "NCRB 2013" },
      { metric: `${targetDistrict.district} Violent`, value: violent.toLocaleString(), period: "2013", source: "NCRB 2013" }
    );
  } else if (q.includes("highest") || q.includes("most") || q.includes("top")) {
    answerText = `**Highest Crime Police Districts in Delhi (2013 Baseline):**
1. **${highestVolumeDistrict.displayName}:** ${highestVolumeDistrict.totalIpc.toLocaleString()} total IPC crimes (including ${highestVolumeDistrict.theft.toLocaleString()} thefts and ${highestVolumeDistrict.murder + highestVolumeDistrict.robbery + highestVolumeDistrict.rape} violent crimes).
2. **Outer Police District:** 9,579 total IPC crimes (covering outer perimeters with 88 murders and 3,383 thefts).
3. **North-East Police District:** 9,041 total IPC crimes (with 223 robberies and 3,703 thefts).

By contrast, **${lowestVolumeDistrict.displayName}** recorded the lowest total volume with **${lowestVolumeDistrict.totalIpc.toLocaleString()} IPC crimes**, reflecting its concentrated administrative/VIP zone.`;

    metrics.push(
      { metric: "Highest Volume District", value: `${highestVolumeDistrict.displayName} (${highestVolumeDistrict.totalIpc.toLocaleString()})`, period: "2013", source: "NCRB 2013" },
      { metric: "Lowest Volume District", value: `${lowestVolumeDistrict.displayName} (${lowestVolumeDistrict.totalIpc.toLocaleString()})`, period: "2013", source: "NCRB 2013" }
    );
  } else if (q.includes("theft")) {
    answerText = `**Theft Incidents Across Delhi Districts (2013 Baseline):**
Theft is the largest single crime category in Delhi, representing over 37% of all registered IPC offenses in 2013.
- **Top Districts by Theft Volume:**
  1. **${topTheftDistricts[0].displayName}:** ${topTheftDistricts[0].theft.toLocaleString()} thefts
  2. **${topTheftDistricts[1].displayName}:** ${topTheftDistricts[1].theft.toLocaleString()} thefts
  3. **${topTheftDistricts[2].displayName}:** ${topTheftDistricts[2].theft.toLocaleString()} thefts
- In addition, specialized transit units registered significant property crimes: **Delhi Metro Rail Unit** (${evidence.allDistricts.find(d => d.district === "METRO RAIL")?.theft || 875} thefts) and **Railway Police GRP** (${evidence.allDistricts.find(d => d.district === "GRP(RLY)")?.theft || 553} thefts).`;

    metrics.push(
      { metric: "Top Theft District", value: `${topTheftDistricts[0].displayName} (${topTheftDistricts[0].theft.toLocaleString()})`, period: "2013", source: "NCRB 2013" }
    );
  } else {
    answerText = `**Delhi Police Districts Overview (2013 Verified NCRB Baseline):**
- **Territorial Police Districts:** 11 districts (Central, East, New Delhi, North, North-East, North-West, Outer, South, South-East, South-West, West).
- **Specialized Units:** 7 units (Crime Against Women Cell, Crime Branch, Economic Offences Wing, GRP Railway, Metro Rail, IGI Airport, Special Task Force).
- **Total Registered IPC Crimes:** 80,184 cases across the capital.
- **Select any district** on the map or search bar above to drill into exact category breakdowns (Theft, Burglary, Violent Crimes, and Women Safety indicators).`;

    metrics.push(
      { metric: "Total Police Districts", value: "11 Territorial + 7 Specialized", period: "2013", source: "NCRB / Delhi Police" },
      { metric: "Delhi Total IPC", value: "80,184", period: "2013", source: "NCRB 2013" }
    );
  }

  return {
    answer: answerText,
    computedMetrics: metrics,
    coverageWarnings: warnings,
    sourcesCited: [
      { title: "District-Wise IPC Crimes 2013", publisher: "National Crime Records Bureau", year: 2013 },
      { title: "Delhi Police Annual Compendium", publisher: "Delhi Police & Ministry of Home Affairs", year: 2014 },
    ],
    isGemmaPowered: false,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalystQueryRequest = await req.json();
    const question = (body.question || "").trim();

    if (!question) {
      return NextResponse.json(
        { error: "Query string cannot be empty." },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: "Query exceeds the maximum allowable length of 500 characters." },
        { status: 400 }
      );
    }

    // Derive deterministic district evidence
    const evidence = deriveEvidenceForDistrictQuery(question);

    // Check for API key (GEMINI_API_KEY or GEMMA_API_KEY)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY;

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        const prompt = `You are the Redline Delhi Districts AI Analyst.
Assist the user strictly regarding official police-recorded crime statistics for Delhi districts (2013 NCRB baseline).
RULES:
1. Rely exclusively on verified district records. Never invent or extrapolate numbers.
2. If asked about Shahdara, explain that Shahdara was created as a revenue district in 2012, but Delhi Police Shahdara district was established in 2017. In 2013, cases were recorded under East and North-East.
3. State when data is from specialized units (Metro Rail, Railways, Airport) vs territorial districts.
4. Keep the answer concise with clear bullet points.

DISTRICT EVIDENCE:
- Target District Match: ${evidence.targetDistrict ? JSON.stringify(evidence.targetDistrict) : "None (citywide query)"}
- Highest Crime District: ${evidence.highestVolumeDistrict.displayName} (${evidence.highestVolumeDistrict.totalIpc.toLocaleString()} IPC)
- Lowest Crime District: ${evidence.lowestVolumeDistrict.displayName} (${evidence.lowestVolumeDistrict.totalIpc.toLocaleString()} IPC)
- Top Theft Districts: ${evidence.topTheftDistricts.map(d => `${d.displayName}: ${d.theft}`).join(", ")}
- Top Violent Districts: ${evidence.topViolentDistricts.map(d => `${d.displayName}: ${d.murder + d.robbery + d.rape}`).join(", ")}

QUESTION: "${question}"`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 600, temperature: 0.1 },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json<AnalystQueryResponse>({
              answer: generatedText,
              computedMetrics: evidence.targetDistrict
                ? [{ metric: `${evidence.targetDistrict.district} Total IPC`, value: evidence.targetDistrict.totalIpc.toLocaleString(), period: "2013", source: "NCRB" }]
                : [{ metric: "Delhi Total IPC", value: "80,184", period: "2013", source: "NCRB" }],
              coverageWarnings: evidence.warnings,
              sourcesCited: [
                { title: "District-Wise IPC Crimes 2013", publisher: "NCRB", year: 2013 },
              ],
              isGemmaPowered: true,
            });
          }
        }
      } catch (genError) {
        console.warn("AI service call failed, using deterministic district fallback:", genError);
      }
    }

    // Default deterministic district grounded response
    const fallbackResponse = generateDistrictAnswer(question, evidence);
    return NextResponse.json(fallbackResponse);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to process district query", details: err?.message },
      { status: 500 }
    );
  }
}
