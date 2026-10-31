# Research brief: physical sites for Folketrygdfondet portfolio companies

Repo: /Users/egilfurnes/Documents/Github/hqs — interactive map of HQs + operational sites for companies held by Folketrygdfondet (SPN + SFT). Existing sites: data/facilities*.js (fields parentName, name, lat, lng). HQ records: data/hq_companies*.js — do NOT re-add the HQ itself.
DO NOT edit any repo file other than your own output file, and do NOT run git (the coordinator commits).

Task: for each company in your list, find its REAL, currently operated (2026) physical sites: factories, plants, mines, labs, data centers, distribution/fulfilment centers, terminals/bases/yards, major subsidiary HQs, large regional offices; for real-estate firms 2-5 flagship properties/logistics parks; for banks/insurers at most 2 (major operations/IT centers or regional HQs); for shipping/airlines fixed sites only (offices in key hubs, technical/crew centers, terminals, hangars). Aim for 2-6 significant sites per company; skip a company if it truly has nothing beyond its HQ. Before adding, grep data/facilities*.js for the company name to avoid duplicates.

Use WebSearch / WebFetch (company sites, annual reports, Wikipedia, registries) for exact street addresses. DO NOT call nominatim.openstreetmap.org, photon, or overpass-api (shared, rate-limited; geocoding is done centrally). If a source gives exact coordinates (e.g. Wikipedia infobox, Sodir factpages), include them with coordsExact true; otherwise give approximate coords (city-level is fine).

SAVE AS YOU GO: after finishing EACH company, rewrite your full output file (JSON array, Write tool) so nothing is lost if you are interrupted. Also keep the companies you've finished (including skipped ones, with reason) in a sibling file <output>.done.txt, one per line. If the output file already exists when you start, read it and the .done.txt first and continue from where it left off.

Each object:
{
  "parentName": "<EXACT company name as in your list, without the parenthetical>",
  "name": "<specific descriptive site name, e.g. 'Nolato Hörby Medical Cleanroom Plant'>",
  "facilityType": exactly one of "Factory & Manufacturing" | "Mill, Smelter & Mine" | "Offshore, Marine & Energy" | "Aquaculture & Fishery" | "Data Center, Telecom & Cloud" | "R&D, Biotech & Medtech Lab" | "Filial, Logistics & Subsidiary HQ",
  "city": "...", "country": "Norge|Sverige|Danmark|Finland|Island|Færøyene or English name (USA, UK, Germany, Poland, ...)",
  "address": "<full street address incl. postcode>",
  "geoQueries": ["<2-4 strings likely to match the OSM feature, most specific first: 'Nolato Hörby', 'Nolato MediTech Hörby', '<street address, postcode city>'>"],
  "approxLat": 55.85, "approxLng": 13.66, "coordsExact": false,
  "footprintRadiusMeters": 160-350,
  "description": "<one factual sentence: what is made/done there; ownership share if partial>",
  "source": "<URL>"
}
Accuracy beats volume: only sites you confirmed. Final reply: one short line with count written and companies skipped.
