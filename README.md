# Nordic Portfolio Atlas

Minimal light-mode interactive OpenStreetMap application mapping all **204 Nordic equity portfolio companies** in [`investments-equities.xlsx`](file:///Users/egilfurnes/Documents/Github/hqs/investments-equities.xlsx) (`SFT` / Folketrygdfondet / Statens pensjonsfond Norge — **14,625 MNOK** total market value) alongside **200+ subsidiary filials, salmon & pelagic fish processing plants, RAS smolt hatcheries, fish feed mills, pulp & paper mega-mills, silicon smelters, underground mines, heavy machinery & cleantech factories, R&D labs, offshore supply bases, and logistics hubs** (**400+ total mapped sites**).

## Quick Start

Open [`index.html`](file:///Users/egilfurnes/Documents/Github/hqs/index.html) directly in any browser (`file://` works out of the box with zero tile blocking).

- Uses unblocked **CARTO Positron Light (`light_all`)**, **CARTO Voyager (`voyager`)**, and **Esri World Imagery** tiles so opening `index.html` locally never triggers `tile.openstreetmap.org` HTTP 403 `Referer` blocks.
- Clicking any HQ or facility colours its building complex footprint and queries live OpenStreetMap Overpass building/industrial geometry (`overpass.kumi.systems` + `overpass-api.de` fallback with in-memory caching).

## Data Architecture

- **Company HQs (204 companies)**:
  - [`data/hq_companies_part1.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/hq_companies_part1.js) (`#1–#102`)
  - [`data/hq_companies_part2.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/hq_companies_part2.js) (`#103–#204`)
- **Corporate Intelligence (100% coverage across all 204 companies)**:
  - [`data/company_intelligence.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/company_intelligence.js)
  - [`data/company_intelligence_part2.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/company_intelligence_part2.js)
  - [`data/company_intelligence_part3.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/company_intelligence_part3.js)
- **Subsidiary Filials, Fish Plants, Factories, Mills & Mines (200+ sites)**:
  - [`data/facilities_expansion.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion.js)
  - [`data/facilities_expansion_part2.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part2.js)
  - [`data/facilities_expansion_part3.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part3.js)
  - [`data/facilities_expansion_part4.js`](file:///Users/egilfurnes/Documents/Github/hqs/data/facilities_expansion_part4.js)
- **Minimal Light UI**:
  - [`index.html`](file:///Users/egilfurnes/Documents/Github/hqs/index.html), [`styles.css`](file:///Users/egilfurnes/Documents/Github/hqs/styles.css), and [`app.js`](file:///Users/egilfurnes/Documents/Github/hqs/app.js)