# Grok research brief — physical sites (wave 2026-11-01)

Repo: /Users/egilfurnes/Documents/Github/hqs

Another agent (Claude) is working in this same repo RIGHT NOW.
- Do not edit anything under research/claude/, data/facilities_claude*, index.html, app.js, or any existing data file.
- Do not run git.
- Do not call nominatim.openstreetmap.org, photon, or overpass-api. Claude is geocoding through those and they are rate-limited. Geocoding is done later by the coordinator.
- Write ONLY your two output files.

Task: for each assigned company, find REAL sites it operates in 2026: factories, plants, mills, mines, labs, data centers, distribution centers, terminals, ports, yards, hangars, major subsidiary HQs. Banks/insurers: at most 2. Real-estate: 2-5 flagship properties. Shipping/airlines: fixed sites only. Aim for 3-6 significant sites. Skip a company if nothing exists beyond the HQ and the sites already listed. Do not re-add the HQ office. Do not re-add a site already listed.

Accuracy beats volume. Only sites you confirmed on a page you opened. If a plant was closed, sold, or you cannot confirm it is still operated, leave it out.

Coordinates: if the source page states latitude/longitude (Wikipedia infobox, port authority, permit, company map), copy them and set coordsExact true. Otherwise give a city-or-address approximate lat/lng and set coordsExact false. Never mark a guess as exact.

SAVE AFTER EVERY COMPANY. Rewrite the whole JSON array with the Write tool so the file is always valid JSON. Append one line to the .done.txt file. If web search starts failing or rate-limiting, flush what you have and stop. Do not retry in a loop.

Each object:
{
  "parentName": "<EXACT name from your assignment>",
  "name": "<specific site name>",
  "facilityType": "Factory & Manufacturing" | "Mill, Smelter & Mine" | "Offshore, Marine & Energy" | "Aquaculture & Fishery" | "Data Center, Telecom & Cloud" | "R&D, Biotech & Medtech Lab" | "Filial, Logistics & Subsidiary HQ",
  "city": "...",
  "country": "Norge|Sverige|Danmark|Finland|Island|Færøyene or English name",
  "address": "<street, postcode, city>",
  "geoQueries": ["most specific", "alternate", "street postcode city"],
  "approxLat": 0.0,
  "approxLng": 0.0,
  "coordsExact": false,
  "footprintRadiusMeters": 220,
  "description": "<one factual sentence, include ownership share if partial>",
  "source": "<URL you opened>"
}

Before adding, grep data/facilities*.js for the site and the company so you do not duplicate.
Final reply: one line, sites written and companies skipped.
