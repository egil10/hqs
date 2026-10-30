// Grok batch 1 — Fiskeridirektoratet Akvakulturregisteret sea-cage localities
// (coordinates are the registered locality positions, in salt water) plus
// Equinor Norne and Ørsted Anholt. Appends via window.EXTRA_FACILITIES.
window.EXTRA_FACILITIES = (window.EXTRA_FACILITIES || []).concat([
  // -------------------------------------------------------------------------
  // MOWI SEAWATER NORWAY AS — marine salmon localities
  // -------------------------------------------------------------------------
  {
    id: "fac-grok-001",
    parentName: "Mowi",
    name: "Mowi Grøttingsøy Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Frøya",
    country: "Norge",
    lat: 63.87955,
    lng: 8.54788,
    address: "Lokalitet 12435 Grøttingsøy, Frohavet, Frøya",
    footprintRadiusMeters: 210,
    description: "Mowi Seawater Norway's largest registered marine locality (10,140 t MTB) on the exposed Frohavet side of Frøya. Atlantic salmon sea cages sit in salt water at the Akvakulturregisteret position."
  },
  {
    id: "fac-grok-002",
    parentName: "Mowi",
    name: "Mowi Rogne Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Haram",
    country: "Norge",
    lat: 62.66973,
    lng: 6.35722,
    address: "Lokalitet 12281 Rogne, Harøyfjorden, Haram",
    footprintRadiusMeters: 210,
    description: "Exposed Mowi marine salmon farm (7,800 t MTB) in Harøyfjorden, Møre og Romsdal. Cages are registered in salt water at locality 12281."
  },
  {
    id: "fac-grok-003",
    parentName: "Mowi",
    name: "Mowi Mulnesodden Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Gildeskål",
    country: "Norge",
    lat: 67.14400,
    lng: 14.28085,
    address: "Lokalitet 35617 Mulnesodden, Gildeskål, Nordland",
    footprintRadiusMeters: 220,
    description: "High-capacity Mowi sea-cage locality (7,800 t MTB) in the Gildeskål archipelago south of Bodø, registered in salt water at locality 35617."
  },
  {
    id: "fac-grok-004",
    parentName: "Mowi",
    name: "Mowi Bjørnstein Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Ibestad",
    country: "Norge",
    lat: 68.88618,
    lng: 17.10922,
    address: "Lokalitet 11340 Bjørnstein, Astafjorden, Ibestad",
    footprintRadiusMeters: 215,
    description: "Arctic Mowi marine salmon farm (6,500 t MTB) in Astafjorden between Senja and the mainland. Sea cages are at the registered salt-water position of locality 11340."
  },
  {
    id: "fac-grok-005",
    parentName: "Mowi",
    name: "Mowi Borvika Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Hammerfest",
    country: "Norge",
    lat: 70.75667,
    lng: 23.43530,
    address: "Lokalitet 36417 Borvika, Sørøysundet, Hammerfest",
    footprintRadiusMeters: 210,
    description: "Mowi's Vest-Finnmark marine salmon locality (3,600 t MTB) in Sørøysundet near Hammerfest. Registered in salt water as locality 36417."
  },
  {
    id: "fac-grok-006",
    parentName: "Mowi",
    name: "Mowi Steinflesa Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Leka",
    country: "Norge",
    lat: 65.13483,
    lng: 11.51598,
    address: "Lokalitet 30537 Steinflesa, Leka, Trøndelag",
    footprintRadiusMeters: 215,
    description: "Exposed Mowi sea-cage farm (7,020 t MTB) off the island of Leka on the Namdal coast. Cages are at the Akvakulturregisteret salt-water coordinate for locality 30537."
  },
  {
    id: "fac-grok-007",
    parentName: "Mowi",
    name: "Mowi Salvågvika Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Flekkefjord",
    country: "Norge",
    lat: 58.22717,
    lng: 6.63277,
    address: "Lokalitet 11856 Salvågvika, Hidra, Flekkefjord",
    footprintRadiusMeters: 210,
    description: "Southern Norwegian Mowi marine salmon locality (7,020 t MTB) in the waters east of Hidra. Registered in salt water as locality 11856."
  },
  {
    id: "fac-grok-008",
    parentName: "Mowi",
    name: "Mowi Langavika Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Stavanger",
    country: "Norge",
    lat: 59.23077,
    lng: 6.00448,
    address: "Lokalitet 11928 Langavika, Ryfylke, Stavanger",
    footprintRadiusMeters: 210,
    description: "Mowi fjord salmon farm (6,720 t MTB) in Ryfylke, registered to Stavanger municipality and placed in salt water at locality 11928."
  },

  // -------------------------------------------------------------------------
  // SALMAR OPPDRETT / SALMAR FARMING — marine salmon localities
  // -------------------------------------------------------------------------
  {
    id: "fac-grok-009",
    parentName: "SalMar",
    name: "SalMar Rataren Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Frøya",
    country: "Norge",
    lat: 63.78130,
    lng: 8.52153,
    address: "Lokalitet 28636 Rataren, Frohavet, Frøya",
    footprintRadiusMeters: 220,
    description: "SalMar Oppdrett's largest registered sea site (10,920 t MTB) on the exposed west side of Frøya. Atlantic salmon cages are in salt water at locality 28636."
  },
  {
    id: "fac-grok-010",
    parentName: "SalMar",
    name: "SalMar Larstangen Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Karlsøy",
    country: "Norge",
    lat: 70.08340,
    lng: 20.09217,
    address: "Lokalitet 37297 Larstangen, Karlsøy, Troms",
    footprintRadiusMeters: 220,
    description: "High-capacity SalMar marine salmon farm (10,000 t MTB) in the Karlsøy islands northeast of Tromsø. Registered in salt water as locality 37297."
  },
  {
    id: "fac-grok-011",
    parentName: "SalMar",
    name: "SalMar Solværet Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Smøla",
    country: "Norge",
    lat: 63.25622,
    lng: 7.85437,
    address: "Lokalitet 27436 Solværet, Edøyfjorden, Smøla",
    footprintRadiusMeters: 215,
    description: "SalMar marine salmon locality (8,580 t MTB) in Edøyfjorden south of Smøla, separate from the Veidholmen site farther north. Cages are at locality 27436."
  },
  {
    id: "fac-grok-012",
    parentName: "SalMar",
    name: "SalMar Øyra Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Lebesby",
    country: "Norge",
    lat: 70.77477,
    lng: 27.21850,
    address: "Lokalitet 34697 Øyra, Laksefjorden, Lebesby",
    footprintRadiusMeters: 220,
    description: "SalMar Arctic sea-cage farm (8,300 t MTB) in Laksefjorden, Finnmark. Registered in salt water as locality 34697."
  },
  {
    id: "fac-grok-013",
    parentName: "SalMar",
    name: "SalMar Trettevik Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Senja",
    country: "Norge",
    lat: 69.51150,
    lng: 18.02217,
    address: "Lokalitet 17077 Trettevik, Malangen, Senja",
    footprintRadiusMeters: 220,
    description: "SalMar Oppdrett marine salmon locality (10,000 t MTB) on the Malangen side of Senja. Sea cages are at the registered salt-water position of locality 17077."
  },
  {
    id: "fac-grok-014",
    parentName: "SalMar",
    name: "SalMar Korsneset Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Heim",
    country: "Norge",
    lat: 63.14340,
    lng: 8.21755,
    address: "Lokalitet 10224 Korsneset, Trondheimsleia, Heim",
    footprintRadiusMeters: 215,
    description: "SalMar sea-cage farm (9,360 t MTB) in Trondheimsleia by Heim. Registered in salt water as locality 10224."
  },
  {
    id: "fac-grok-015",
    parentName: "SalMar",
    name: "SalMar Mortensnes Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Alta",
    country: "Norge",
    lat: 70.12422,
    lng: 23.22383,
    address: "Lokalitet 10794 Mortensnes, Altafjorden, Alta",
    footprintRadiusMeters: 210,
    description: "SalMar Farming Arctic marine salmon locality (5,400 t MTB) in Altafjorden. Cages are in salt water at locality 10794."
  },

  // -------------------------------------------------------------------------
  // LERØY SEAFOOD GROUP — marine salmon localities
  // -------------------------------------------------------------------------
  {
    id: "fac-grok-016",
    parentName: "Lerøy Seafood Group",
    name: "Lerøy Vest Kjerstad Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Haram",
    country: "Norge",
    lat: 62.62257,
    lng: 6.22535,
    address: "Lokalitet 12294 Kjerstad, Harøyfjorden, Haram",
    footprintRadiusMeters: 210,
    description: "Lerøy Vest Sjø marine salmon farm (6,240 t MTB) in Harøyfjorden. Sea cages are at the registered salt-water position of locality 12294."
  },
  {
    id: "fac-grok-017",
    parentName: "Lerøy Seafood Group",
    name: "Lerøy Vest Djupevika Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Tysnes",
    country: "Norge",
    lat: 60.03582,
    lng: 5.34222,
    address: "Lokalitet 26595 Djupevika, Langenuen, Tysnes",
    footprintRadiusMeters: 210,
    description: "Lerøy Vest Sjø sea-cage locality (5,460 t MTB) in Langenuen by Tysnes. Registered in salt water as locality 26595."
  },
  {
    id: "fac-grok-018",
    parentName: "Lerøy Seafood Group",
    name: "Lerøy Midt Kjørsvikgrunn Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Heim",
    country: "Norge",
    lat: 63.45772,
    lng: 9.07560,
    address: "Lokalitet 26135 Kjørsvikgrunn, Hemnfjorden, Heim",
    footprintRadiusMeters: 215,
    description: "Lerøy Midt Sjø marine salmon farm (7,020 t MTB) in Hemnfjorden. Cages are at the Akvakulturregisteret salt-water coordinate for locality 26135."
  },
  {
    id: "fac-grok-019",
    parentName: "Lerøy Seafood Group",
    name: "Lerøy Aurora Mjønes Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Karlsøy",
    country: "Norge",
    lat: 70.10555,
    lng: 19.58358,
    address: "Lokalitet 36257 Mjønes, Karlsøy, Troms",
    footprintRadiusMeters: 220,
    description: "Lerøy Aurora's largest registered sea site (10,200 t MTB) in the Karlsøy islands. Atlantic salmon cages sit in salt water at locality 36257."
  },
  {
    id: "fac-grok-020",
    parentName: "Lerøy Seafood Group",
    name: "Lerøy Midt Endreset Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Kristiansund",
    country: "Norge",
    lat: 63.02968,
    lng: 7.71373,
    address: "Lokalitet 12879 Endreset, Talgsjøen, Kristiansund",
    footprintRadiusMeters: 210,
    description: "Lerøy Midt Sjø sea-cage farm (6,240 t MTB) in Talgsjøen outside Kristiansund. Registered in salt water as locality 12879."
  },
  {
    id: "fac-grok-021",
    parentName: "Lerøy Seafood Group",
    name: "Lerøy Vest Angelskår Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Osterøy",
    country: "Norge",
    lat: 60.52333,
    lng: 5.35262,
    address: "Lokalitet 13563 Angelskår, Osterfjorden, Osterøy",
    footprintRadiusMeters: 210,
    description: "Lerøy Vest Sjø marine salmon locality (4,680 t MTB) in Osterfjorden. Sea cages are at the registered salt-water position of locality 13563."
  },
  {
    id: "fac-grok-022",
    parentName: "Lerøy Seafood Group",
    name: "Lerøy Aurora Angstauren Sea-Cage Salmon Locality",
    facilityType: "Aquaculture & Fishery",
    city: "Tromsø",
    country: "Norge",
    lat: 69.69533,
    lng: 18.17027,
    address: "Lokalitet 13518 Angstauren, Kvaløya, Tromsø",
    footprintRadiusMeters: 215,
    description: "Lerøy Aurora marine salmon farm (5,670 t MTB) in the waters west of Kvaløya. Registered in salt water as locality 13518."
  },

  // -------------------------------------------------------------------------
  // OFFSHORE ENERGY
  // -------------------------------------------------------------------------
  {
    id: "fac-grok-023",
    parentName: "Equinor",
    name: "Norne FPSO (Norwegian Sea)",
    facilityType: "Offshore, Marine & Energy",
    city: "Norskehavet (Norne)",
    country: "Norge",
    lat: 66.01371,
    lng: 8.07402,
    address: "PL 128 / Norne-feltet, Norskehavet",
    footprintRadiusMeters: 280,
    description: "Equinor-operated floating production, storage and offloading vessel on the Norne oil and gas field in the Norwegian Sea, with subsea tie-backs processed on the ship-shaped FPSO."
  },
  {
    id: "fac-grok-024",
    parentName: "Ørsted",
    name: "Ørsted Anholt Offshore Wind Farm",
    facilityType: "Offshore, Marine & Energy",
    city: "Kattegat (Anholt)",
    country: "Danmark",
    lat: 56.60000,
    lng: 11.21000,
    address: "Anholt Havmøllepark, Kattegat",
    footprintRadiusMeters: 350,
    description: "Ørsted-operated 400 MW offshore wind farm in the Kattegat between the island of Anholt and Djursland. The coordinate is the published array center, in open water among the turbines."
  }
]);
