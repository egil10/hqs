(function () {
  "use strict";

  const SECTOR_COLORS = {
    "Industri": "#2563eb",
    "Industrials": "#2563eb",
    "Finans": "#0284c7",
    "Financials": "#0284c7",
    "Teknologi": "#4f46e5",
    "Information Technology": "#4f46e5",
    "Technology": "#4f46e5",
    "Helse": "#059669",
    "Health Care": "#059669",
    "Varige konsumvarer": "#d97706",
    "Consumer Discretionary": "#d97706",
    "Konsumvarer": "#16a34a",
    "Consumer Staples": "#16a34a",
    "Materialer": "#b45309",
    "Materials": "#b45309",
    "Basic Materials": "#b45309",
    "Eiendom": "#7c3aed",
    "Real Estate": "#7c3aed",
    "Telekommunikasjon": "#db2777",
    "Communication Services": "#db2777",
    "Telecommunications": "#db2777",
    "Energi": "#dc2626",
    "Energy": "#dc2626",
    "Forsyning": "#0d9488",
    "Utilities": "#0d9488"
  };

  const FACILITY_COLORS = {
    "Factory & Manufacturing": "#2563eb",
    "Mill, Smelter & Mine": "#d97706",
    "R&D, Biotech & Medtech Lab": "#059669",
    "Offshore, Marine & Energy": "#dc2626",
    "Oil & Gas Drilling / Platform": "#dc2626",
    "Aquaculture & Fishery": "#0284c7",
    "Data Center, Telecom & Cloud": "#7c3aed",
    "Filial, Logistics & Subsidiary HQ": "#475569"
  };

  const COUNTRY_FLAGS = {
    "Norge": "🇳🇴",
    "Norway": "🇳🇴",
    "Sverige": "🇸🇪",
    "Sweden": "🇸🇪",
    "Danmark": "🇩🇰",
    "Denmark": "🇩🇰",
    "Finland": "🇫🇮",
    "Island": "🇮🇸",
    "Iceland": "🇮🇸",
    "Færøyene": "🇫🇴",
    "Faroe Islands": "🇫🇴",
    "Tyskland": "🇩🇪",
    "Germany": "🇩🇪",
    "Storbritannia": "🇬🇧",
    "UK": "🇬🇧",
    "United Kingdom": "🇬🇧",
    "USA": "🇺🇸",
    "United States": "🇺🇸",
    "Brasil": "🇧🇷",
    "Brazil": "🇧🇷",
    "Gabon": "🇬🇦",
    "Ekvatorial-Guinea": "🇬🇶",
    "Tunisia": "🇹🇳",
    "Polen": "🇵🇱",
    "Belgia": "🇧🇪",
    "Nederland": "🇳🇱",
    "Frankrike": "🇫🇷",
    " Sveits": "🇨🇭",
    "Sveits": "🇨🇭",
    "Spania": "🇪🇸",
    "Italia": "🇮🇹",
    "Canada": "🇨🇦",
    "Singapore": "🇸🇬",
    "Kina": "🇨🇳"
  };

  const FACILITY_LUCIDE_SVG = {
    "Offshore, Marine & Energy": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    "Oil & Gas Drilling / Platform": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    "Aquaculture & Fishery": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/></svg>`,
    "Mill, Smelter & Mine": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
    "Factory & Manufacturing": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>`,
    "Data Center, Telecom & Cloud": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
    "R&D, Biotech & Medtech Lab": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
    "Filial, Logistics & Subsidiary HQ": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`
  };

  function getMiniTypeIcon(facilityType) {
    const color = FACILITY_COLORS[facilityType] || "#475569";
    const svg = FACILITY_LUCIDE_SVG[facilityType] || FACILITY_LUCIDE_SVG["Filial, Logistics & Subsidiary HQ"];
    return `<span class="mini-type-icon" style="color:${color}">${svg}</span>`;
  }

  function shortCompanyName(name) {
    return String(name || "")
      .replace(/\s+(ASA|AS|AB|Oyj|Oy|A\/S|Plc|SE|Hf\.?|Holding|Holdings|Group|International|Breweries|i Skandinavien)\b/gi, "")
      .trim();
  }

  function shortFacilityName(facName, parentName) {
    const pShort = shortCompanyName(parentName);
    let s = String(facName || "");
    if (pShort && s.toLowerCase().startsWith(pShort.toLowerCase() + " ")) {
      s = s.slice(pShort.length).trim();
    }
    return s.replace(/^[-–—·\s]+/, "");
  }

  function normName(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/æ/g, "ae")
      .replace(/ø/g, "o")
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/\b(asa|as|ab|oyj|oy|a\/s|plc|se|sa|hf|group|holding|holdings|corp|inc)\b/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // --- STAGE 1: Load Main HQs Immediately ---
  const sftRaw = [
    ...(window.HQ_COMPANIES || []),
    ...(window.HQ_COMPANIES_PART1 || []),
    ...(window.HQ_COMPANIES_PART2 || [])
  ];
  const spnRaw = window.HQ_COMPANIES_SPN || window.SPN_COMPANIES || [];

  function buildUnifiedCompanies() {
    const byKey = new Map();

    sftRaw.forEach((c) => {
      const key = c.issuerId || normName(c.name);
      byKey.set(key, {
        ...c,
        sftRank: c.rank,
        spnRank: null,
        funds: ["SFT"],
        sftMarketValue: Number(c.marketValue) || 0,
        spnMarketValue: 0,
        marketValue: Number(c.marketValue) || 0,
        sftOwnership: Number(c.ownershipPercent) || 0,
        spnOwnership: 0
      });
    });

    spnRaw.forEach((spn) => {
      let existing = byKey.get(spn.issuerId);
      if (!existing) {
        const nTarget = normName(spn.name);
        for (const item of byKey.values()) {
          if (normName(item.name) === nTarget) {
            existing = item;
            break;
          }
        }
      }

      if (existing) {
        if (!existing.funds.includes("SPN")) existing.funds.unshift("SPN");
        existing.spnRank = spn.spnRank;
        existing.spnMarketValue = Number(spn.marketValue) || 0;
        existing.marketValue = Number((existing.sftMarketValue + existing.spnMarketValue).toFixed(2));
        existing.spnOwnership = Number(spn.ownershipPercent) || 0;
        existing.ownershipPercent = Number((existing.sftOwnership + existing.spnOwnership).toFixed(2));
      } else {
        const key = spn.issuerId || normName(spn.name);
        byKey.set(key, {
          ...spn,
          sftRank: null,
          spnRank: spn.spnRank,
          funds: ["SPN"],
          sftMarketValue: 0,
          spnMarketValue: Number(spn.marketValue) || 0,
          marketValue: Number(spn.marketValue) || 0,
          sftOwnership: 0,
          spnOwnership: Number(spn.ownershipPercent) || 0
        });
      }
    });

    const unified = Array.from(byKey.values()).sort((a, b) => b.marketValue - a.marketValue);
    unified.forEach((c, idx) => {
      c.rank = idx + 1;
      c.shortName = shortCompanyName(c.name);
      c.ownershipPercent = Number(c.ownershipPercent) || 0;
      c.impliedMarketCap =
        c.ownershipPercent > 0.05
          ? Math.round(c.marketValue / (c.ownershipPercent / 100))
          : Math.round(c.marketValue * 25);
      c.quote = (window.MARKET_QUOTES && window.MARKET_QUOTES[normName(c.name)]) || null;
    });
    return unified;
  }

  const companies = buildUnifiedCompanies();
  const companyBySftRank = {};
  const companyByNormName = {};
  const companyByRank = {};

  companies.forEach((c) => {
    companyByRank[c.rank] = c;
    if (c.sftRank) companyBySftRank[c.sftRank] = c;
    companyByNormName[normName(c.name)] = c;
  });

  const PARENT_ALIASES = {
    "carlsberg": "carlsbergbreweries",
    "sca": "svenskacellulosa",
    "svenskacellulosasca": "svenskacellulosa",
    "nibe": "nibeindustrier",
    "autostore": "autostore",
    "tokmanni": "tokmanni",
    "upm": "upmkymmene",
    "seb": "skandinaviskaenskildabanken",
    "handelsbanken": "svenskahandelsbanken",
    "visma": "synaferdeierselskapivisma",
    "sparebank1srnorge": "sparebank1sornorge",
    "leroyseafood": "leroyseafood"
  };

  // --- STAGE 2: Progressive Facility & Quote Loader ---
  let facilities = [];

  function attachMarketQuotes() {
    if (!window.MARKET_QUOTES) return false;
    let newlyAttached = false;
    companies.forEach((c) => {
      if (!c.quote) {
        const q = window.MARKET_QUOTES[normName(c.name)];
        if (q) {
          c.quote = q;
          newlyAttached = true;
        }
      }
    });
    return newlyAttached;
  }

  function ingestFacilityAdditions() {
    const newQuotes = attachMarketQuotes();

    const discoveredFacilityArrays = Object.keys(window)
      .filter((k) => k === "FACILITIES_EXPANSION" || k.startsWith("FACILITIES_EXPANSION_"))
      .sort()
      .map((k) => window[k] || []);

    const combinedRawFacilities = [
      ...discoveredFacilityArrays.flat(),
      ...(window.EXTRA_FACILITIES || [])
    ];

    const seenFacilityKeys = new Set();
    const rawFacilities = combinedRawFacilities.filter((f) => {
      if (!f || !f.name || typeof f.lat !== "number" || typeof f.lng !== "number") return false;
      const key = `${normName(f.parentName)}::${normName(f.name)}`;
      if (seenFacilityKeys.has(key) || (f.id && seenFacilityKeys.has(f.id))) return false;
      seenFacilityKeys.add(key);
      if (f.id) seenFacilityKeys.add(f.id);
      return true;
    });

    if (rawFacilities.length === facilities.length && !newQuotes) return;

    if (rawFacilities.length !== facilities.length) {
      facilities = rawFacilities.map((f) => {
        const nParent = normName(f.parentName);
        const aliased = PARENT_ALIASES[nParent] || nParent;
        let parent = companyByNormName[aliased];
        if (!parent && f.parentRank && companyBySftRank[f.parentRank]) {
          parent = companyBySftRank[f.parentRank];
        }
        if (!parent) {
          parent = companies.find(
            (c) => normName(c.name).includes(aliased) || aliased.includes(normName(c.name))
          );
        }
        const pName = parent ? parent.name : f.parentName;
        return {
          ...f,
          parentRank: parent ? parent.rank : f.parentRank || 1,
          parentName: pName,
          shortName: shortFacilityName(f.name, pName)
        };
      });
    }

    renderAll();
    if (selectedCompanyRank && !selectedFacilityId) {
      const c = companyByRank[selectedCompanyRank];
      if (c) showCompanySheet(c, facilities.filter((f) => f.parentRank === selectedCompanyRank));
    }
  }

  // --- Helpers ---
  function formatCompactValue(mnok) {
    const v = Number(mnok) || 0;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}B`;
    return `${Math.round(v)}M`;
  }

  function renderSparklineSvg(closes, isPos, w = 44, h = 15) {
    if (!Array.isArray(closes) || closes.length < 2) return "";
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const span = max - min || 1;
    const pts = closes
      .map((v, i) => {
        const x = (i / (closes.length - 1)) * (w - 4) + 2;
        const y = h - 2 - ((v - min) / span) * (h - 4);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
    const stroke = isPos ? "#16a34a" : "#dc2626";
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none"><polyline points="${pts}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function getCompanyDomain(website) {
    if (!website) return "";
    try {
      const u = new URL(website.startsWith("http") ? website : "https://" + website);
      return u.hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  }

  function getCompanyInitials(name) {
    const words = String(name || "")
      .replace(/[^A-Za-z0-9ÆØÅÄÖæøåäö\s]/g, "")
      .trim()
      .split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return String(name || "HQ").slice(0, 2).toUpperCase();
  }

  function renderLogoHtml(company) {
    if (!company) return "";
    const domain = getCompanyDomain(company.website);
    const color = SECTOR_COLORS[company.sector] || "#2563eb";
    const initials = getCompanyInitials(company.name);

    if (!domain) {
      return `<div class="logo-box"><span class="logo-fallback" style="background:${color}">${initials}</span></div>`;
    }
    const primaryUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
    return `<div class="logo-box"><img src="${primaryUrl}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span class="logo-fallback" style="display:none;background:${color}">${initials}</span></div>`;
  }

  // --- State ---
  let activeTab = "companies"; // "companies" | "grid" | "facilities"
  let activeRegion = "ALL";
  let activeType = "all";
  let activeSort = "value_desc";
  let selectedCompanyRank = null;
  let selectedFacilityId = null;
  let showLogos = true;
  let showSites = true;
  let showLinks = true;
  let is3dEnabled = false;
  let currentBasemap = "light";
  let buildingMatchTimer = null;
  const logoMarkerPool = new Map();
  const visibleLogoRanks = new Set();

  // --- Map Initialization ---
  // isStyleLoaded() stays false while any source is still fetching tiles, so gate on our own ready flag instead
  let mapReady = false;
  const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [11.5, 61.5],
    zoom: 4.4,
    pitch: 0,
    bearing: 0,
    maxPitch: 65,
    attributionControl: false
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-left");

  const hoverPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 10
  });

  // --- Geometry Helpers ---
  function metersToLngLatStep(lat, dxMeters, dyMeters) {
    const dLat = dyMeters / 111320;
    const dLng = dxMeters / (111320 * Math.cos((lat * Math.PI) / 180));
    return [dLng, dLat];
  }

  function createCircleRing(lng, lat, radiusMeters, steps = 20) {
    const ring = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const [dLng, dLat] = metersToLngLatStep(lat, Math.cos(a) * radiusMeters, Math.sin(a) * radiusMeters);
      ring.push([lng + dLng, lat + dLat]);
    }
    return ring;
  }

  function createRectRing(lng, lat, widthM, heightM) {
    const hw = widthM / 2;
    const hh = heightM / 2;
    const corners = [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, hh],
      [-hw, -hh]
    ];
    return corners.map(([dx, dy]) => {
      const [dLng, dLat] = metersToLngLatStep(lat, dx, dy);
      return [lng + dLng, lat + dLat];
    });
  }

  function pointInRing(ptLng, ptLat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect =
        yi > ptLat !== yj > ptLat &&
        ptLng < ((xj - xi) * (ptLat - yi)) / (yj - yi + 1e-12) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function approxDistMeters(lng1, lat1, lng2, lat2) {
    const dy = (lat2 - lat1) * 111320;
    const dx = (lng2 - lng1) * 111320 * Math.cos(((lat1 + lat2) * 0.5 * Math.PI) / 180);
    return Math.hypot(dx, dy);
  }

  function minVertexDistMeters(lng, lat, ring) {
    let minDist = Infinity;
    for (let i = 0; i < ring.length; i++) {
      const d = approxDistMeters(lng, lat, ring[i][0], ring[i][1]);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  function isOffshorePlatformSite(f) {
    if (f.facilityType === "Oil & Gas Drilling / Platform") return true;
    if (f.facilityType !== "Offshore, Marine & Energy") return false;
    const txt = `${f.name} ${f.city} ${f.address}`.toLowerCase();
    return (
      txt.includes("platform") ||
      txt.includes("fpso") ||
      txt.includes("fso") ||
      txt.includes("subsea") ||
      txt.includes("offshore") ||
      txt.includes("nordsjøen") ||
      txt.includes("norskehavet") ||
      txt.includes("barentshavet") ||
      txt.includes("north sea") ||
      txt.includes("basin") ||
      txt.includes("jack-up") ||
      txt.includes("drilling area") ||
      txt.includes("field")
    ) && !txt.includes("yard") && !txt.includes("base") && !txt.includes("refinery") && !txt.includes("headquarters") && !txt.includes("office") && !txt.includes("campus");
  }

  function isMarineSeaCageSite(f) {
    if (f.facilityType !== "Aquaculture & Fishery") return false;
    const txt = `${f.name} ${f.description}`.toLowerCase();
    return (
      (txt.includes("sea-cage") || txt.includes("locality") || txt.includes("sea farm") || txt.includes("ocean farm")) &&
      !txt.includes("processing plant") &&
      !txt.includes("feed")
    );
  }

  function generateMarineSeaCageFeatures(f, color) {
    const features = [];
    const cols = 6;
    const rows = 2;
    const spacingM = 58;
    const cageRadiusM = 20;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dx = (c - (cols - 1) / 2) * spacingM;
        const dy = (r - (rows - 1) / 2) * spacingM;
        const [dLng, dLat] = metersToLngLatStep(f.lat, dx, dy);
        features.push({
          type: "Feature",
          properties: {
            color,
            name: f.shortName || f.name,
            subtitle: f.parentName,
            entityType: "facility",
            entityId: f.id,
            height: 4
          },
          geometry: {
            type: "Polygon",
            coordinates: [createCircleRing(f.lng + dLng, f.lat + dLat, cageRadiusM, 18)]
          }
        });
      }
    }
    return features;
  }

  function generateOffshorePlatformFeatures(f, color) {
    return [
      {
        type: "Feature",
        properties: {
          color,
          name: f.shortName || f.name,
          subtitle: f.parentName,
          entityType: "facility",
          entityId: f.id,
          height: 42
        },
        geometry: {
          type: "Polygon",
          coordinates: [createRectRing(f.lng, f.lat, 110, 75)]
        }
      }
    ];
  }

  // --- Filtering & Sorting ---
  const NORDIC_COUNTRIES = new Set(["Norge", "Sverige", "Finland", "Danmark", "Island", "Færøyene"]);

  function getFilteredData() {
    const q = document.getElementById("searchInput").value.trim().toLowerCase();
    const regionVal = activeRegion;
    const typeVal = activeType;
    const sortVal = activeSort;

    const facByRank = {};
    facilities.forEach((f) => {
      if (!facByRank[f.parentRank]) facByRank[f.parentRank] = [];
      facByRank[f.parentRank].push(f);
    });

    const filteredCompanies = companies.filter((c) => {
      const cFacs = facByRank[c.rank] || [];
      if (regionVal === "GLOBAL") {
        const hasGlobal = !NORDIC_COUNTRIES.has(c.country) || cFacs.some((f) => !NORDIC_COUNTRIES.has(f.country));
        if (!hasGlobal) return false;
      } else if (regionVal !== "ALL") {
        if (c.country !== regionVal) return false;
      }

      if (typeVal !== "all" && typeVal !== "hqs_only") {
        const hasMatchingFac = cFacs.some((f) => matchesTypeFilter(f, typeVal));
        if (!hasMatchingFac) return false;
      }

      if (q) {
        const ticker = c.quote && c.quote.ticker ? c.quote.ticker.toLowerCase() : "";
        const matchC =
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          ticker.includes(q);
        const matchF = cFacs.some(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.city.toLowerCase().includes(q) ||
            f.country.toLowerCase().includes(q)
        );
        if (!matchC && !matchF) return false;
      }
      return true;
    });

    filteredCompanies.sort((a, b) => {
      if (sortVal === "mcap_desc") return (b.impliedMarketCap || 0) - (a.impliedMarketCap || 0);
      if (sortVal === "chg1m_desc") {
        const va = a.quote && typeof a.quote.change1m === "number" ? a.quote.change1m : -999;
        const vb = b.quote && typeof b.quote.change1m === "number" ? b.quote.change1m : -999;
        return vb - va;
      }
      if (sortVal === "sites_desc") {
        const diff = (facByRank[b.rank] || []).length - (facByRank[a.rank] || []).length;
        return diff !== 0 ? diff : b.marketValue - a.marketValue;
      }
      if (sortVal === "name_asc") return a.shortName.localeCompare(b.shortName, "nb");
      return b.marketValue - a.marketValue;
    });

    const visibleRanks = new Set(filteredCompanies.map((c) => c.rank));

    const filteredFacilities =
      typeVal === "hqs_only"
        ? []
        : facilities.filter((f) => {
            if (regionVal === "GLOBAL" && NORDIC_COUNTRIES.has(f.country)) return false;
            if (regionVal !== "ALL" && regionVal !== "GLOBAL" && f.country !== regionVal) {
              return false;
            }
            if (!matchesTypeFilter(f, typeVal)) return false;

            if (q) {
              const matchSelf =
                f.name.toLowerCase().includes(q) ||
                f.parentName.toLowerCase().includes(q) ||
                f.city.toLowerCase().includes(q) ||
                f.country.toLowerCase().includes(q);
              if (!matchSelf && !visibleRanks.has(f.parentRank)) return false;
            }
            return true;
          });

    if (sortVal === "name_asc") {
      filteredFacilities.sort((a, b) => (a.shortName || a.name).localeCompare(b.shortName || b.name, "nb"));
    }

    return { filteredCompanies, filteredFacilities, facByRank };
  }

  function matchesTypeFilter(f, typeVal) {
    if (typeVal === "all") return true;
    if (typeVal === "oilgas") {
      return f.facilityType === "Oil & Gas Drilling / Platform" || f.facilityType === "Offshore, Marine & Energy";
    }
    if (typeVal === "fish") return f.facilityType === "Aquaculture & Fishery";
    if (typeVal === "mills") return f.facilityType === "Mill, Smelter & Mine";
    if (typeVal === "factories") return f.facilityType === "Factory & Manufacturing";
    if (typeVal === "datacenters") return f.facilityType === "Data Center, Telecom & Cloud";
    if (typeVal === "distribution") return f.facilityType === "Filial, Logistics & Subsidiary HQ";
    if (typeVal === "pharma") return f.facilityType === "R&D, Biotech & Medtech Lab";
    return true;
  }

  // --- Declutter Base Map (Hide Shops, Trains, Restaurants, Shields) ---
  function declutterBaseStyleLayers() {
    if (!mapReady) return;
    const layers = map.getStyle().layers || [];

    layers.forEach((lyr) => {
      const id = (lyr.id || "").toLowerCase();
      const srcLayer = (lyr["source-layer"] || "").toLowerCase();

      if (
        srcLayer === "poi" ||
        srcLayer === "housenumber" ||
        srcLayer === "aerodrome_label" ||
        id.includes("poi") ||
        id.includes("transit") ||
        id.includes("shield") ||
        id.includes("aeroway") ||
        id.includes("housenumber") ||
        id.includes("ferry")
      ) {
        try {
          map.setLayoutProperty(lyr.id, "visibility", "none");
        } catch (e) {}
      }
    });
  }

  const LIGHT_DUPLICATE_LABELS = [
    "water_name_point_label",
    "water_name_line_label",
    "label_other",
    "label_state",
    "label_country_1",
    "label_country_2",
    "label_country_3"
  ];

  function applyBasemapMode() {
    if (!mapReady) return;

    if (map.getLayer("carto-light-layer")) {
      map.setLayoutProperty(
        "carto-light-layer",
        "visibility",
        currentBasemap === "light" ? "visible" : "none"
      );
    }

    if (map.getLayer("esri-satellite-layer")) {
      map.setLayoutProperty(
        "esri-satellite-layer",
        "visibility",
        currentBasemap === "satellite" ? "visible" : "none"
      );
    }

    // The light raster already carries country, region and sea names; hide the vector duplicates
    LIGHT_DUPLICATE_LABELS.forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", currentBasemap === "light" ? "none" : "visible");
      }
    });
  }

  // --- Setup Map Layers ---
  function setupCustomLayers() {
    if (!mapReady) return;

    declutterBaseStyleLayers();

    if (!map.getSource("carto-light")) {
      map.addSource("carto-light", {
        type: "raster",
        // CARTO's light_all tiles now require an API key (they render an "API KEY REQUIRED" watermark),
        // so the Light basemap uses Esri's keyless World Light Gray canvas instead
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        maxzoom: 16
      });
    }

    if (!map.getSource("esri-satellite")) {
      map.addSource("esri-satellite", {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        maxzoom: 19
      });
    }

    const layers = map.getStyle().layers || [];
    let firstSymbolId;
    for (const lyr of layers) {
      if (lyr.type === "symbol") {
        firstSymbolId = lyr.id;
        break;
      }
    }

    if (!map.getLayer("carto-light-layer")) {
      map.addLayer(
        {
          id: "carto-light-layer",
          type: "raster",
          source: "carto-light",
          layout: {
            visibility: currentBasemap === "light" ? "visible" : "none"
          }
        },
        firstSymbolId
      );
    }

    if (!map.getLayer("esri-satellite-layer")) {
      map.addLayer(
        {
          id: "esri-satellite-layer",
          type: "raster",
          source: "esri-satellite",
          layout: {
            visibility: currentBasemap === "satellite" ? "visible" : "none"
          }
        },
        firstSymbolId
      );
    }

    if (map.getSource("openmaptiles")) {
      if (!map.getLayer("all-buildings-2d")) {
        map.addLayer(
          {
            id: "all-buildings-2d",
            type: "fill",
            source: "openmaptiles",
            "source-layer": "building",
            minzoom: 13.5,
            paint: {
              "fill-color": "#e2e8f0",
              "fill-opacity": 0.45
            }
          },
          firstSymbolId
        );
      }

      if (!map.getLayer("all-buildings-3d")) {
        map.addLayer(
          {
            id: "all-buildings-3d",
            type: "fill-extrusion",
            source: "openmaptiles",
            "source-layer": "building",
            minzoom: 14,
            layout: {
              visibility: is3dEnabled ? "visible" : "none"
            },
            paint: {
              "fill-extrusion-color": "#e2e8f0",
              "fill-extrusion-height": ["coalesce", ["get", "render_height"], 10],
              "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
              "fill-extrusion-opacity": 0.65
            }
          },
          firstSymbolId
        );
      }
    }

    const emptyFC = { type: "FeatureCollection", features: [] };
    ["portfolio-buildings", "portfolio-links", "portfolio-facilities", "portfolio-hqs"].forEach((srcId) => {
      if (!map.getSource(srcId)) {
        map.addSource(srcId, { type: "geojson", data: emptyFC });
      }
    });

    if (!map.getLayer("portfolio-buildings-fill")) {
      map.addLayer(
        {
          id: "portfolio-buildings-fill",
          type: "fill",
          source: "portfolio-buildings",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": 0.85
          }
        },
        firstSymbolId
      );
    }

    if (!map.getLayer("portfolio-buildings-outline")) {
      map.addLayer(
        {
          id: "portfolio-buildings-outline",
          type: "line",
          source: "portfolio-buildings",
          paint: {
            "line-color": "#0f172a",
            "line-width": 1.8
          }
        },
        firstSymbolId
      );
    }

    if (!map.getLayer("portfolio-buildings-3d")) {
      map.addLayer(
        {
          id: "portfolio-buildings-3d",
          type: "fill-extrusion",
          source: "portfolio-buildings",
          layout: {
            visibility: is3dEnabled ? "visible" : "none"
          },
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["coalesce", ["get", "height"], 18],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.92
          }
        },
        firstSymbolId
      );
    }

    if (!map.getLayer("portfolio-links-line")) {
      map.addLayer({
        id: "portfolio-links-line",
        type: "line",
        source: "portfolio-links",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1.6,
          "line-opacity": 0.72,
          "line-dasharray": [2, 2]
        }
      });
    }

    if (!map.getLayer("portfolio-facilities-circle")) {
      map.addLayer({
        id: "portfolio-facilities-circle",
        type: "circle",
        source: "portfolio-facilities",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3,
            3.5,
            10,
            5.5,
            15,
            7.5
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": ["get", "strokeWidth"],
          "circle-opacity": 0.92
        }
      });
    }

    if (!map.getLayer("portfolio-hqs-circle")) {
      map.addLayer({
        id: "portfolio-hqs-circle",
        type: "circle",
        source: "portfolio-hqs",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            3,
            4.5,
            10,
            6.5,
            15,
            8.5
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": ["get", "strokeColor"],
          "circle-stroke-width": ["get", "strokeWidth"],
          "circle-opacity": 0.96
        }
      });
    }

    applyBasemapMode();
    renderAll();
  }

  // --- Single-Building Exact Matcher ---
  function matchVectorBuildingsToPortfolio() {
    if (!mapReady || !map.getSource("portfolio-buildings")) return;

    const { filteredCompanies, filteredFacilities } = getFilteredData();
    const matchedFeatures = [];
    const bounds = map.getBounds();
    const zoom = map.getZoom();

    if (zoom >= 11) {
      filteredFacilities.forEach((f) => {
        if (!bounds.contains([f.lng, f.lat])) return;
        const color = FACILITY_COLORS[f.facilityType] || "#0284c7";
        if (isMarineSeaCageSite(f)) {
          matchedFeatures.push(...generateMarineSeaCageFeatures(f, color));
        } else if (isOffshorePlatformSite(f)) {
          matchedFeatures.push(...generateOffshorePlatformFeatures(f, color));
        }
      });
    }

    if (zoom >= 13.5 && map.getLayer("all-buildings-2d")) {
      const visibleEntities = [];

      filteredCompanies.forEach((c) => {
        if (bounds.contains([c.lng, c.lat])) {
          visibleEntities.push({
            lng: c.lng,
            lat: c.lat,
            color: SECTOR_COLORS[c.sector] || "#2563eb",
            name: c.shortName,
            subtitle: c.city,
            entityType: "company",
            entityId: c.rank,
            maxDistM: 28
          });
        }
      });

      filteredFacilities.forEach((f) => {
        if (isMarineSeaCageSite(f) || isOffshorePlatformSite(f)) return;
        if (bounds.contains([f.lng, f.lat])) {
          visibleEntities.push({
            lng: f.lng,
            lat: f.lat,
            color: FACILITY_COLORS[f.facilityType] || "#059669",
            name: f.shortName || f.name,
            subtitle: f.parentName,
            entityType: "facility",
            entityId: f.id,
            maxDistM: 32
          });
        }
      });

      if (visibleEntities.length > 0 && visibleEntities.length <= 60) {
        const seenGeomKeys = new Set();

        visibleEntities.forEach((ent) => {
          const pt = map.project([ent.lng, ent.lat]);
          const bbox = [
            [pt.x - 24, pt.y - 24],
            [pt.x + 24, pt.y + 24]
          ];

          let rendered;
          try {
            rendered = map.queryRenderedFeatures(bbox, { layers: ["all-buildings-2d"] });
          } catch (e) {
            return;
          }
          if (!rendered || rendered.length === 0) return;

          let bestPoly = null;
          let bestHeight = 18;
          let bestDist = Infinity;

          rendered.forEach((feat) => {
            if (!feat.geometry) return;
            const polys =
              feat.geometry.type === "Polygon"
                ? [feat.geometry.coordinates]
                : feat.geometry.type === "MultiPolygon"
                ? feat.geometry.coordinates
                : [];

            polys.forEach((polyCoords) => {
              const outerRing = polyCoords[0];
              if (!outerRing || outerRing.length < 4) return;
              const inside = pointInRing(ent.lng, ent.lat, outerRing);
              const d = inside ? 0 : minVertexDistMeters(ent.lng, ent.lat, outerRing);
              if (d < bestDist) {
                bestDist = d;
                bestPoly = polyCoords;
                bestHeight = Number(feat.properties && feat.properties.render_height) || 18;
              }
            });
          });

          if (bestPoly && bestDist <= ent.maxDistM) {
            const gKey = JSON.stringify(bestPoly[0][0]);
            if (!seenGeomKeys.has(gKey)) {
              seenGeomKeys.add(gKey);
              matchedFeatures.push({
                type: "Feature",
                properties: {
                  color: ent.color,
                  name: ent.name,
                  subtitle: ent.subtitle,
                  entityType: ent.entityType,
                  entityId: ent.entityId,
                  height: bestHeight
                },
                geometry: {
                  type: "Polygon",
                  coordinates: bestPoly
                }
              });
            }
          }
        });
      }
    }

    map.getSource("portfolio-buildings").setData({
      type: "FeatureCollection",
      features: matchedFeatures
    });
  }

  function scheduleBuildingMatch() {
    if (buildingMatchTimer) clearTimeout(buildingMatchTimer);
    buildingMatchTimer = setTimeout(() => {
      matchVectorBuildingsToPortfolio();
      updateMapLogoMarkers();
    }, 80);
  }

  // --- Pooled Map Favicon Markers ---
  function getOrCreateLogoMarker(c) {
    let entry = logoMarkerPool.get(c.rank);
    if (entry) return entry;

    const el = document.createElement("div");
    el.className = "map-logo-marker";
    el.title = c.shortName;
    el.innerHTML = renderLogoHtml(c);
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      selectCompany(c.rank, false);
    });

    const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([c.lng, c.lat]);
    entry = { marker, el };
    logoMarkerPool.set(c.rank, entry);
    return entry;
  }

  function updateMapLogoMarkers() {
    if (!showLogos) {
      visibleLogoRanks.forEach((rank) => {
        const entry = logoMarkerPool.get(rank);
        if (entry) entry.marker.remove();
      });
      visibleLogoRanks.clear();
      return;
    }

    const { filteredCompanies } = getFilteredData();
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const maxLogos = zoom >= 10 ? 85 : zoom >= 6.5 ? 52 : 34;

    const inView = filteredCompanies.filter((c) => bounds.contains([c.lng, c.lat]));
    inView.sort((a, b) => {
      if (a.rank === selectedCompanyRank) return -1;
      if (b.rank === selectedCompanyRank) return 1;
      return b.marketValue - a.marketValue;
    });

    const nextRanks = new Set();
    inView.slice(0, maxLogos).forEach((c) => {
      nextRanks.add(c.rank);
      const entry = getOrCreateLogoMarker(c);
      entry.el.classList.toggle("active", c.rank === selectedCompanyRank);
      if (!visibleLogoRanks.has(c.rank)) {
        entry.marker.addTo(map);
      }
    });

    visibleLogoRanks.forEach((oldRank) => {
      if (!nextRanks.has(oldRank)) {
        const entry = logoMarkerPool.get(oldRank);
        if (entry) entry.marker.remove();
      }
    });

    visibleLogoRanks.clear();
    nextRanks.forEach((r) => visibleLogoRanks.add(r));
  }

  // --- Main Render ---
  function renderAll() {
    const { filteredCompanies, filteredFacilities, facByRank } = getFilteredData();
    const activeFacilities = showSites ? filteredFacilities : [];

    renderList(filteredCompanies, activeFacilities, facByRank);

    if (!mapReady || !map.getSource("portfolio-hqs")) return;

    const hqFeatures = filteredCompanies.map((c) => {
      const color = SECTOR_COLORS[c.sector] || "#2563eb";
      const isSelected = selectedCompanyRank === c.rank;
      return {
        type: "Feature",
        properties: {
          rank: c.rank,
          name: c.shortName,
          subtitle: c.city,
          color,
          strokeColor: isSelected ? "#0f172a" : "#ffffff",
          strokeWidth: isSelected ? 2.5 : 1.3
        },
        geometry: {
          type: "Point",
          coordinates: [c.lng, c.lat]
        }
      };
    });

    const facFeatures = activeFacilities.map((f) => {
      const color = FACILITY_COLORS[f.facilityType] || "#059669";
      const isSelected = selectedFacilityId === f.id || selectedCompanyRank === f.parentRank;
      return {
        type: "Feature",
        properties: {
          id: f.id,
          parentRank: f.parentRank,
          name: f.shortName || f.name,
          subtitle: f.city,
          color,
          strokeWidth: isSelected ? 2.2 : 1.1
        },
        geometry: {
          type: "Point",
          coordinates: [f.lng, f.lat]
        }
      };
    });

    // Connection lines ONLY for the currently selected company
    const linkFeatures = [];
    if (showSites && showLinks && selectedCompanyRank) {
      const parent = companyByRank[selectedCompanyRank];
      if (parent) {
        const color = SECTOR_COLORS[parent.sector] || "#2563eb";
        activeFacilities.forEach((f) => {
          if (f.parentRank !== selectedCompanyRank) return;
          linkFeatures.push({
            type: "Feature",
            properties: { color },
            geometry: {
              type: "LineString",
              coordinates: [
                [parent.lng, parent.lat],
                [f.lng, f.lat]
              ]
            }
          });
        });
      }
    }

    map.getSource("portfolio-hqs").setData({ type: "FeatureCollection", features: hqFeatures });
    map.getSource("portfolio-facilities").setData({ type: "FeatureCollection", features: facFeatures });
    map.getSource("portfolio-links").setData({ type: "FeatureCollection", features: linkFeatures });

    updateMapLogoMarkers();
    scheduleBuildingMatch();
  }

  function renderCompanyRightIcons(c, cFacs) {
    const uniqueTypes = [];
    const seen = new Set();
    for (const f of cFacs) {
      const normT =
        f.facilityType === "Oil & Gas Drilling / Platform"
          ? "Offshore, Marine & Energy"
          : f.facilityType;
      if (!seen.has(normT)) {
        seen.add(normT);
        uniqueTypes.push(f.facilityType);
        if (uniqueTypes.length === 2) break;
      }
    }

    const typeIconsHtml = uniqueTypes.map((t) => getMiniTypeIcon(t)).join("");
    const q = c.quote;
    const sparkHtml =
      q && q.closes
        ? renderSparklineSvg(q.closes, q.change1m >= 0, 32, 13)
        : "";
    const flag = COUNTRY_FLAGS[c.country] || "";

    return `${typeIconsHtml}${sparkHtml}<span class="mini-flag">${flag}</span>`;
  }

  function renderList(filteredCompanies, filteredFacilities, facByRank) {
    const listEl = document.getElementById("entityList");

    if (activeTab === "grid") {
      listEl.innerHTML = `<div class="logo-grid">${filteredCompanies
        .map((c) => {
          const cFacs = facByRank[c.rank] || [];
          const isSelected = selectedCompanyRank === c.rank && !selectedFacilityId;
          const dotColor = SECTOR_COLORS[c.sector] || "#2563eb";
          return `
            <div class="logo-tile ${isSelected ? "selected" : ""}" data-rank="${c.rank}" title="${c.shortName}">
              ${renderLogoHtml(c)}
              ${cFacs.length > 0 ? `<span class="tile-dot" style="background:${dotColor}"></span>` : ""}
            </div>
          `;
        })
        .join("")}</div>`;

      listEl.querySelectorAll(".logo-tile").forEach((tile) => {
        tile.addEventListener("click", () => {
          selectCompany(Number(tile.getAttribute("data-rank")), true);
        });
      });
    } else if (activeTab === "companies") {
      listEl.innerHTML = filteredCompanies
        .map((c) => {
          const cFacs = facByRank[c.rank] || [];
          const isSelected = selectedCompanyRank === c.rank && !selectedFacilityId;
          return `
            <div class="list-row ${isSelected ? "selected" : ""}" data-rank="${c.rank}">
              <div class="row-left">
                ${renderLogoHtml(c)}
                <div class="row-name">${c.shortName}</div>
              </div>
              <div class="row-icons">${renderCompanyRightIcons(c, cFacs)}</div>
            </div>
          `;
        })
        .join("");

      listEl.querySelectorAll(".list-row").forEach((row) => {
        row.addEventListener("click", () => {
          selectCompany(Number(row.getAttribute("data-rank")), true);
        });
      });
    } else {
      listEl.innerHTML = filteredFacilities
        .map((f) => {
          const parent = companyByRank[f.parentRank];
          const isSelected = selectedFacilityId === f.id;
          const flag = COUNTRY_FLAGS[f.country] || "🌍";
          return `
            <div class="list-row ${isSelected ? "selected" : ""}" data-fac-id="${f.id}">
              <div class="row-left">
                ${renderLogoHtml(parent)}
                <div class="row-name">${f.shortName || f.name}</div>
              </div>
              <div class="row-icons">
                ${getMiniTypeIcon(f.facilityType)}
                <span class="mini-flag">${flag}</span>
              </div>
            </div>
          `;
        })
        .join("");

      listEl.querySelectorAll(".list-row").forEach((row) => {
        row.addEventListener("click", () => {
          selectFacility(row.getAttribute("data-fac-id"), true);
        });
      });
    }
  }

  function scrollSelectedRowIntoView() {
    const sel = document.querySelector("#entityList .selected");
    if (sel) sel.scrollIntoView({ block: "nearest" });
  }

  // --- Selection ---
  function selectCompany(rank, panIfNeeded = false) {
    selectedCompanyRank = rank;
    selectedFacilityId = null;
    const c = companyByRank[rank];
    if (!c) return;

    const cFacs = facilities.filter((f) => f.parentRank === rank);
    renderAll();
    scrollSelectedRowIntoView();
    showCompanySheet(c, cFacs);

    if (panIfNeeded && !map.getBounds().contains([c.lng, c.lat])) {
      map.easeTo({
        center: [c.lng, c.lat],
        duration: 450
      });
    }
  }

  function selectFacility(facId, panIfNeeded = false) {
    const f = facilities.find((item) => item.id === facId);
    if (!f) return;
    selectedFacilityId = facId;
    selectedCompanyRank = f.parentRank;

    const parent = companyByRank[f.parentRank];
    const siblingFacs = facilities.filter((item) => item.parentRank === f.parentRank);
    renderAll();
    scrollSelectedRowIntoView();
    showFacilitySheet(f, parent, siblingFacs);

    if (panIfNeeded && !map.getBounds().contains([f.lng, f.lat])) {
      map.easeTo({
        center: [f.lng, f.lat],
        duration: 450
      });
    }
  }

  function renderQuoteStripHtml(c) {
    const q = c.quote;
    if (!q) {
      return `
        <div class="quote-strip">
          <div class="quote-price-line">
            <span>~${formatCompactValue(c.impliedMarketCap)} NOK</span>
          </div>
          <span style="color:#94a3b8">${c.ownershipPercent.toFixed(1)}%</span>
        </div>
      `;
    }

    const isPos = q.change1m >= 0;
    const sign1m = q.change1m > 0 ? "+" : "";
    const cls1m = isPos ? "chg-pos" : "chg-neg";

    return `
      <div class="quote-strip">
        <div class="quote-price-line">
          <span>${q.price} ${q.currency}</span>
          <span class="${cls1m}">${sign1m}${q.change1m.toFixed(1)}%</span>
        </div>
        <div class="quote-spark" title="${q.closes.join(" → ")} ${q.currency}">
          ${renderSparklineSvg(q.closes, isPos, 56, 16)}
        </div>
      </div>
    `;
  }

  const ICON_CROSSHAIR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>`;
  const ICON_NETWORK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`;
  const ICON_EXT_LINK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
  const ICON_BUILDING = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/></svg>`;

  function showCompanySheet(c, cFacs) {
    const sheet = document.getElementById("inspectorCard");
    const flag = COUNTRY_FLAGS[c.country] || "";

    sheet.innerHTML = `
      <div class="sheet-top">
        <div class="sheet-head-left">
          ${renderLogoHtml(c)}
          <div class="sheet-title">${c.shortName} ${flag}</div>
        </div>
        <button class="close-btn" id="closeSheetBtn">&times;</button>
      </div>

      ${renderQuoteStripHtml(c)}

      <div class="sheet-actions">
        <button class="action-btn" id="btnZoomHq" title="Zoom to building">${ICON_CROSSHAIR}</button>
        ${cFacs.length > 0 ? `<button class="action-btn" id="btnFitAll" title="Show all ${cFacs.length} sites">${ICON_NETWORK} <span>${cFacs.length}</span></button>` : ""}
        <a class="action-btn" href="${c.website}" target="_blank" rel="noopener" title="Website">${ICON_EXT_LINK}</a>
      </div>

      ${
        cFacs.length > 0
          ? `<div class="sub-list">
              ${cFacs
                .map(
                  (f) => `
                  <div class="sub-row" data-fac-id="${f.id}">
                    <span style="display:flex;align-items:center;gap:5px;min-width:0;">
                      ${getMiniTypeIcon(f.facilityType)}
                      <span style="color:#0f172a;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.shortName || f.name}</span>
                    </span>
                    <span class="mini-flag">${COUNTRY_FLAGS[f.country] || "🌍"}</span>
                  </div>`
                )
                .join("")}
            </div>`
          : ""
      }
    `;

    sheet.classList.add("visible");

    document.getElementById("closeSheetBtn").onclick = clearSelection;
    document.getElementById("btnZoomHq").onclick = () => {
      map.flyTo({ center: [c.lng, c.lat], zoom: 16.8, pitch: is3dEnabled ? 52 : 0, duration: 600 });
    };

    const btnFit = document.getElementById("btnFitAll");
    if (btnFit) {
      btnFit.onclick = () => {
        fitBoundsToPoints([[c.lng, c.lat], ...cFacs.map((f) => [f.lng, f.lat])]);
      };
    }

    sheet.querySelectorAll(".sub-row").forEach((el) => {
      el.addEventListener("click", () => selectFacility(el.getAttribute("data-fac-id"), true));
    });
  }

  function showFacilitySheet(f, parent, siblingFacs) {
    const sheet = document.getElementById("inspectorCard");
    const flag = COUNTRY_FLAGS[f.country] || "🌍";

    sheet.innerHTML = `
      <div class="sheet-top">
        <div class="sheet-head-left">
          ${renderLogoHtml(parent)}
          <div class="sheet-title">${f.shortName || f.name} ${flag}</div>
        </div>
        <button class="close-btn" id="closeSheetBtn">&times;</button>
      </div>

      <div class="sheet-actions">
        <button class="action-btn" id="btnZoomFac" title="Zoom to site">${ICON_CROSSHAIR}</button>
        ${parent ? `<button class="action-btn" id="btnJumpHq" title="Parent HQ">${ICON_BUILDING}</button>` : ""}
        ${parent ? `<button class="action-btn" id="btnFitFacNet" title="All company sites">${ICON_NETWORK} <span>${siblingFacs.length + 1}</span></button>` : ""}
      </div>
    `;

    sheet.classList.add("visible");

    document.getElementById("closeSheetBtn").onclick = clearSelection;
    document.getElementById("btnZoomFac").onclick = () => {
      map.flyTo({ center: [f.lng, f.lat], zoom: 16.5, pitch: is3dEnabled ? 52 : 0, duration: 600 });
    };

    const btnHq = document.getElementById("btnJumpHq");
    if (btnHq && parent) {
      btnHq.onclick = () => selectCompany(parent.rank, true);
    }

    const btnFit = document.getElementById("btnFitFacNet");
    if (btnFit && parent) {
      btnFit.onclick = () => {
        fitBoundsToPoints([[parent.lng, parent.lat], ...siblingFacs.map((s) => [s.lng, s.lat])]);
      };
    }
  }

  function clearSelection() {
    selectedCompanyRank = null;
    selectedFacilityId = null;
    document.getElementById("inspectorCard").classList.remove("visible");
    renderAll();
  }

  function resetAll() {
    document.getElementById("searchInput").value = "";
    document.getElementById("btnClearSearch").hidden = true;
    activeRegion = "ALL";
    activeType = "all";
    activeSort = "value_desc";

    document.querySelectorAll("#regionBar .filter-pill").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-region") === "ALL");
    });
    document.querySelectorAll("#typeBar .filter-pill").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-type") === "all");
    });
    document.querySelectorAll("#sortBar .sort-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-sort") === "value_desc");
    });

    selectedCompanyRank = null;
    selectedFacilityId = null;
    is3dEnabled = false;
    document.getElementById("btnToggle3d").classList.remove("active");
    document.getElementById("inspectorCard").classList.remove("visible");
    if (map.getLayer("all-buildings-3d")) map.setLayoutProperty("all-buildings-3d", "visibility", "none");
    if (map.getLayer("portfolio-buildings-3d")) map.setLayoutProperty("portfolio-buildings-3d", "visibility", "none");
    renderAll();
    map.flyTo({ center: [11.5, 61.5], zoom: 4.4, pitch: 0, bearing: 0, duration: 550 });
  }

  function fitBoundsToPoints(coordsLngLat) {
    if (!coordsLngLat || coordsLngLat.length === 0) return;
    if (coordsLngLat.length === 1) {
      map.easeTo({ center: coordsLngLat[0], duration: 450 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds(coordsLngLat[0], coordsLngLat[0]);
    coordsLngLat.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { padding: 60, maxZoom: 12.5, duration: 600 });
  }

  // --- Map & Control Events ---
  function bindMapInteractions() {
    const interactiveLayers = [
      "portfolio-hqs-circle",
      "portfolio-facilities-circle",
      "portfolio-buildings-fill",
      "portfolio-buildings-3d"
    ];

    interactiveLayers.forEach((layerId) => {
      map.on("mouseenter", layerId, (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feat = e.features && e.features[0];
        if (!feat) return;
        const p = feat.properties || {};
        const coords =
          feat.geometry.type === "Point"
            ? feat.geometry.coordinates.slice()
            : [e.lngLat.lng, e.lngLat.lat];

        hoverPopup
          .setLngLat(coords)
          .setHTML(`<strong>${p.name || ""}</strong>`)
          .addTo(map);
      });

      map.on("mouseleave", layerId, () => {
        map.getCanvas().style.cursor = "";
        hoverPopup.remove();
      });

      map.on("click", layerId, (e) => {
        const feat = e.features && e.features[0];
        if (!feat) return;
        const p = feat.properties || {};
        if (layerId === "portfolio-hqs-circle" || p.entityType === "company") {
          const rank = Number(p.rank || p.entityId);
          if (rank) selectCompany(rank, false);
        } else if (layerId === "portfolio-facilities-circle" || p.entityType === "facility") {
          const facId = p.id || p.entityId;
          if (facId) selectFacility(facId, false);
        }
      });
    });

    map.on("click", (e) => {
      const hit = map.queryRenderedFeatures(e.point, {
        layers: interactiveLayers.filter((id) => map.getLayer(id))
      });
      if (!hit || hit.length === 0) {
        if (selectedCompanyRank || selectedFacilityId) clearSelection();
      }
    });

    map.on("moveend", scheduleBuildingMatch);
  }

  function setModeTab(tab) {
    activeTab = tab;
    document.getElementById("tabCompanies").classList.toggle("active", tab === "companies");
    document.getElementById("tabGrid").classList.toggle("active", tab === "grid");
    document.getElementById("tabFacilities").classList.toggle("active", tab === "facilities");
    renderAll();
  }

  function initControls() {
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("btnClearSearch");

    searchInput.addEventListener("input", () => {
      clearBtn.hidden = !searchInput.value;
      renderAll();
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.hidden = true;
      renderAll();
    });

    // 1-Click Region Flag Pills
    document.querySelectorAll("#regionBar .filter-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const reg = btn.getAttribute("data-region");
        activeRegion = activeRegion === reg && reg !== "ALL" ? "ALL" : reg;
        document.querySelectorAll("#regionBar .filter-pill").forEach((b) => {
          b.classList.toggle("active", b.getAttribute("data-region") === activeRegion);
        });
        renderAll();
        const { filteredCompanies, filteredFacilities } = getFilteredData();
        const pts =
          activeRegion === "GLOBAL"
            ? filteredFacilities.map((f) => [f.lng, f.lat])
            : [
                ...filteredCompanies.map((c) => [c.lng, c.lat]),
                ...filteredFacilities.map((f) => [f.lng, f.lat])
              ];
        if (pts.length > 0) fitBoundsToPoints(pts);
      });
    });

    // 1-Click Asset Type Icon Pills
    document.querySelectorAll("#typeBar .filter-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.getAttribute("data-type");
        activeType = activeType === t && t !== "all" ? "all" : t;
        document.querySelectorAll("#typeBar .filter-pill").forEach((b) => {
          b.classList.toggle("active", b.getAttribute("data-type") === activeType);
        });
        renderAll();
      });
    });

    // 1-Click Sort Icon Buttons
    document.querySelectorAll("#sortBar .sort-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSort = btn.getAttribute("data-sort");
        document.querySelectorAll("#sortBar .sort-btn").forEach((b) => {
          b.classList.toggle("active", b === btn);
        });
        renderAll();
      });
    });

    document.getElementById("tabCompanies").addEventListener("click", () => setModeTab("companies"));
    document.getElementById("tabGrid").addEventListener("click", () => setModeTab("grid"));
    document.getElementById("tabFacilities").addEventListener("click", () => setModeTab("facilities"));

    document.getElementById("btnToggleLogos").addEventListener("click", (e) => {
      showLogos = !showLogos;
      e.currentTarget.classList.toggle("active", showLogos);
      updateMapLogoMarkers();
    });

    document.getElementById("btnToggleSites").addEventListener("click", (e) => {
      showSites = !showSites;
      e.currentTarget.classList.toggle("active", showSites);
      renderAll();
    });

    document.getElementById("btnToggleLinks").addEventListener("click", (e) => {
      showLinks = !showLinks;
      e.currentTarget.classList.toggle("active", showLinks);
      renderAll();
    });

    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-basemap]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentBasemap = btn.getAttribute("data-basemap");
        applyBasemapMode();
      });
    });

    document.getElementById("btnToggle3d").addEventListener("click", (e) => {
      is3dEnabled = !is3dEnabled;
      e.currentTarget.classList.toggle("active", is3dEnabled);
      if (map.getLayer("all-buildings-3d")) {
        map.setLayoutProperty("all-buildings-3d", "visibility", is3dEnabled ? "visible" : "none");
      }
      if (map.getLayer("portfolio-buildings-3d")) {
        map.setLayoutProperty("portfolio-buildings-3d", "visibility", is3dEnabled ? "visible" : "none");
      }
      map.easeTo({ pitch: is3dEnabled ? 50 : 0, duration: 400 });
    });

    document.getElementById("btnResetView").addEventListener("click", resetAll);
    document.getElementById("btnResetSidebar").addEventListener("click", resetAll);
  }

  // Stage 1: Render main HQs immediately
  initControls();
  renderAll();

  // Stage 2: Progressively ingest facility additions after initial HQ paint
  setTimeout(ingestFacilityAdditions, 30);
  document.addEventListener("DOMContentLoaded", ingestFacilityAdditions);
  window.addEventListener("load", ingestFacilityAdditions);

  // "style.load" fires as soon as the style JSON is parsed, long before every basemap tile has arrived
  // ("load"), so pins and site layers appear immediately; "load" is kept as a fallback.
  function onMapStyleReady() {
    if (mapReady) return;
    mapReady = true;
    setupCustomLayers();
    bindMapInteractions();
    ingestFacilityAdditions();
  }
  map.once("style.load", onMapStyleReady);
  map.once("load", onMapStyleReady);
})();
