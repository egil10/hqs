# Nordic Portfolio Atlas

Minimal light-mode interactive **MapLibre GL JS + OpenFreeMap Vector** atlas mapping all **204 Nordic equity portfolio companies** in [`investments-equities.xlsx`](file:///Users/egilfurnes/Documents/Github/hqs/investments-equities.xlsx) (`SFT` / Folketrygdfondet / Statens pensjonsfond Norge — **14,625 MNOK** total market value) alongside **275+ subsidiary filials, marine sea-cage salmon farms, RAS smolt hatcheries, pelagic fish factories, open-pit & underground mines, silicon smelters, pulp & paper mega-mills, hydropower dams, wind parks, sovereign data centers, satellite teleports, and mega-logistics parks** (**479+ total mapped sites**).

## Map Architecture (MapLibre GL JS + OpenFreeMap Vector Buildings)

Inspired by [`test.offentligdata.com`](https://test.offentligdata.com/), the map runs on **MapLibre GL JS** and **OpenFreeMap Vector Tiles (`https://tiles.openfreemap.org`)**:
- **Zero API keys, zero watermarks**: Uses OpenFreeMap's `positron` (minimal light) and `liberty` vector styles plus Esri World Imagery satellite tiles.
- **All Buildings Overlaid (`All Buildings` & `3D Roofs`)**: Directly renders OpenFreeMap's `openmaptiles` `building` vector layer across the entire world (both 2D architectural footprints and 3D extruded roofs).
- **100% Exact Roof Alignment**: Instead of drawing synthetic rectangles over land buildings, [`app.js`](file:///Users/egilfurnes/Documents/Github/hqs/app.js) queries the actual rendered `openmaptiles` `building` vector polygons at each HQ/facility coordinate (`map.queryRenderedFeatures`) plus live OpenStreetMap Overpass building/industrial ways, colouring the **exact underlying building polygon**.

## Datasets

- **Company HQs (204 companies)**:
  - [`data/hq_companies_part1.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/hq_companies_part1.js) (`#1–#102`)
  - [`data/hq_companies_part2.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/hq_companies_part2.js) (`#103–#204`)
- **Corporate Intelligence (100% coverage across all 204 companies)**:
  - [`data/company_intelligence.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/company_intelligence.js)
  - [`data/company_intelligence_part2.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/company_intelligence_part2.js)
  - [`data/company_intelligence_part3.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/company_intelligence_part3.js)
- **Subsidiary Filials, Sea-Cage Fish Farms, Mines, Data Centers, Factories & Mills (275+ sites)**:
  - [`data/facilities_expansion.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion.js) — Core salmon/pelagic plants, mills, smelters, mines & factories
  - [`data/facilities_expansion_part2.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part2.js) — Additional RAS hatcheries, whitefish plants, paperboard mills & factories
  - [`data/facilities_expansion_part3.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part3.js) — Medtech/pharma plants, engineering hubs & Nordic logistics terminals
  - [`data/facilities_expansion_part4.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part4.js) — International & Nordic aquaculture, smelter & heavy machinery plants
  - [`data/facilities_expansion_part5.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part5.js) — 60 open-pit quartzite/gold/silver/copper mines, hydropower dams, wind parks, sovereign data centers, satellite teleports & mega-logistics parks
  - [`data/facilities_expansion_part6.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part6.js) — 28 marine sea-cage salmon & trout farming localities (with official Norwegian Fiskeridirektoratet locality numbers) & aquaculture trial sites