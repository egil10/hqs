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

  const COUNTRY_NAMES = {
    "Norge": "Norway",
    "Sverige": "Sweden",
    "Danmark": "Denmark",
    "Island": "Iceland",
    "Færøyene": "Faroe Islands",
    "Tyskland": "Germany",
    "Storbritannia": "UK",
    "United Kingdom": "UK",
    "United States": "USA",
    "Brasil": "Brazil",
    "Ekvatorial-Guinea": "Equatorial Guinea",
    "Polen": "Poland",
    "Belgia": "Belgium",
    "Nederland": "Netherlands",
    "Frankrike": "France",
    " Sveits": "Switzerland",
    "Sveits": "Switzerland",
    "Spania": "Spain",
    "Italia": "Italy",
    "Kina": "China"
  };

  const SECTOR_LABELS = {
    "Industri": "Industrials",
    "Finans": "Financials",
    "Teknologi": "Technology",
    "Information Technology": "Technology",
    "Helse": "Health care",
    "Health Care": "Health care",
    "Varige konsumvarer": "Consumer discretionary",
    "Consumer Discretionary": "Consumer discretionary",
    "Konsumvarer": "Consumer staples",
    "Consumer Staples": "Consumer staples",
    "Materialer": "Materials",
    "Basic Materials": "Materials",
    "Eiendom": "Real estate",
    "Real Estate": "Real estate",
    "Telekommunikasjon": "Telecom",
    "Communication Services": "Telecom",
    "Telecommunications": "Telecom",
    "Energi": "Energy",
    "Forsyning": "Utilities"
  };

  const FACILITY_LABELS = {
    "Factory & Manufacturing": "Factory",
    "Mill, Smelter & Mine": "Mining",
    "R&D, Biotech & Medtech Lab": "Lab",
    "Offshore, Marine & Energy": "Energy",
    "Oil & Gas Drilling / Platform": "Energy",
    "Aquaculture & Fishery": "Seafood",
    "Data Center, Telecom & Cloud": "Data center",
    "Filial, Logistics & Subsidiary HQ": "Office"
  };

  function countryName(c) {
    return COUNTRY_NAMES[c] || String(c || "").trim();
  }

  function facilityLabel(t) {
    return FACILITY_LABELS[t] || "Site";
  }

  function facilityColor(t) {
    return FACILITY_COLORS[t] || "#64748b";
  }

  function typeDot(t) {
    return `<span class="dot" style="background:${facilityColor(t)}"></span>`;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
  let facilitiesByRank = {};

  function indexFacilities() {
    facilitiesByRank = {};
    facilities.forEach((f) => {
      (facilitiesByRank[f.parentRank] || (facilitiesByRank[f.parentRank] = [])).push(f);
    });
  }

  function sitesOf(rank) {
    return facilitiesByRank[rank] || [];
  }

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
      indexFacilities();
    }

    renderAll();
    if (selectedCompanyRank && !selectedFacilityId) {
      const c = companyByRank[selectedCompanyRank];
      if (c) showCompanySheet(c);
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
  let soloRank = null; // when set, the map only shows this company's HQ and sites
  let current = { filteredCompanies: [], filteredFacilities: [] }; // last filter result (sidebar)
  let mapData = { companies: [], facilities: [] }; // what the map draws (filters or solo)
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
  let logoFrame = null;
  let baseLayerIds = [];
  let baseBackgroundColor = null;
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
    minZoom: 2,
    pitch: 0,
    bearing: 0,
    maxPitch: 65,
    dragRotate: false,
    attributionControl: false
  });
  // Rotation is only useful in 3D; keeping it off in 2D avoids accidental tilts/rotations while panning
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  map.touchPitch.disable();

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-left");

  const hoverPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 14
  });

  function showHover(lngLat, title, sub) {
    hoverPopup
      .setLngLat(lngLat)
      .setHTML(`<strong>${escapeHtml(title)}</strong>${sub ? `<span class="pop-sub">${escapeHtml(sub)}</span>` : ""}`)
      .addTo(map);
  }

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

    const facByRank = facilitiesByRank;

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
          ticker.includes(q) ||
          (c.shortName || "").toLowerCase().includes(q);
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

  // The map shows the filtered set, or only one company (HQ + every site) when soloed
  function computeMapData() {
    if (soloRank && companyByRank[soloRank]) {
      return {
        companies: [companyByRank[soloRank]],
        facilities: showSites ? sitesOf(soloRank) : []
      };
    }
    return {
      companies: current.filteredCompanies,
      facilities: showSites ? current.filteredFacilities : []
    };
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
        id.includes("ferry") ||
        id === "building-3d" // the style's own 3D buildings; ours are toggled by the 3D button
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

  const BASEMAP_BACKGROUND = { light: "#e9e9e7", satellite: "#0b1220" };

  function applyBasemapMode() {
    if (!mapReady) return;

    // The raster basemaps sit on top of the vector style. While their tiles load (zooming out, panning)
    // the vector fills and the colourful Natural Earth relief underneath used to bleed through, so hide
    // every non-label vector layer and paint a matching neutral background instead.
    const vectorBase = currentBasemap === "liberty";
    baseLayerIds.forEach((id) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vectorBase ? "visible" : "none");
    });
    if (map.getLayer("background")) {
      map.setPaintProperty(
        "background",
        "background-color",
        vectorBase ? baseBackgroundColor || "#f8f4f0" : BASEMAP_BACKGROUND[currentBasemap]
      );
    }
    document.getElementById("map").style.background = vectorBase ? "" : BASEMAP_BACKGROUND[currentBasemap];

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

    baseLayerIds = (map.getStyle().layers || [])
      .filter(
        (l) =>
          l.type !== "symbol" &&
          l.type !== "background" &&
          l.id !== "building-3d" &&
          map.getLayoutProperty(l.id, "visibility") !== "none"
      )
      .map((l) => l.id);
    if (map.getLayer("background")) {
      baseBackgroundColor = map.getPaintProperty("background", "background-color");
    }

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

    const filteredCompanies = mapData.companies;
    const filteredFacilities = mapData.facilities;
    const matchedFeatures = [];
    const bounds = map.getBounds();
    const zoom = map.getZoom();

    if (zoom >= 11) {
      filteredFacilities.forEach((f) => {
        if (!bounds.contains([f.lng, f.lat])) return;
        const color = facilityColor(f.facilityType);
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
            color: facilityColor(f.facilityType),
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

  function scheduleLogoUpdate() {
    if (logoFrame) return;
    logoFrame = requestAnimationFrame(() => {
      logoFrame = null;
      updateMapLogoMarkers();
    });
  }

  function plural(n, word) {
    return `${n} ${word}${n === 1 ? "" : "s"}`;
  }

  function companyMeta(c) {
    const n = sitesOf(c.rank).length;
    return [c.city, n ? plural(n, "site") : ""].filter(Boolean).join(" · ");
  }

  // --- Pooled Map Logo Markers ---
  function getOrCreateLogoMarker(c) {
    let entry = logoMarkerPool.get(c.rank);
    if (entry) return entry;

    const el = document.createElement("div");
    el.className = "map-logo-marker";
    el.innerHTML = renderLogoHtml(c);
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      selectCompany(c.rank);
    });
    el.addEventListener("dblclick", (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      setSolo(c.rank);
    });
    el.addEventListener("mouseenter", () => showHover([c.lng, c.lat], c.shortName, companyMeta(c)));
    el.addEventListener("mouseleave", () => hoverPopup.remove());

    const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([c.lng, c.lat]);
    entry = { marker, el };
    logoMarkerPool.set(c.rank, entry);
    return entry;
  }

  // Every HQ in view gets its logo, decluttered in screen space: where logos would overlap the larger
  // holding (or the selected company) wins and the others fall back to their small dot until you zoom in.
  function updateMapLogoMarkers() {
    const nextRanks = new Set();

    if (showLogos && mapReady) {
      const canvas = map.getCanvas();
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const minGap = map.getZoom() >= 12 ? 22 : 28;
      const placed = [];
      const ordered = mapData.companies.slice().sort((a, b) => {
        if (a.rank === selectedCompanyRank) return -1;
        if (b.rank === selectedCompanyRank) return 1;
        return b.marketValue - a.marketValue;
      });

      for (const c of ordered) {
        if (placed.length >= 260) break;
        const pt = map.project([c.lng, c.lat]);
        if (pt.x < -20 || pt.y < -20 || pt.x > w + 20 || pt.y > h + 20) continue;
        if (placed.some((p) => Math.abs(p.x - pt.x) < minGap && Math.abs(p.y - pt.y) < minGap)) continue;
        placed.push(pt);
        nextRanks.add(c.rank);
      }
    }

    nextRanks.forEach((rank) => {
      const entry = getOrCreateLogoMarker(companyByRank[rank]);
      entry.el.classList.toggle("active", rank === selectedCompanyRank);
      if (!visibleLogoRanks.has(rank)) entry.marker.addTo(map);
    });
    visibleLogoRanks.forEach((rank) => {
      if (!nextRanks.has(rank)) {
        const entry = logoMarkerPool.get(rank);
        if (entry) entry.marker.remove();
      }
    });
    visibleLogoRanks.clear();
    nextRanks.forEach((r) => visibleLogoRanks.add(r));
  }

  // --- Main Render ---
  function renderAll() {
    current = getFilteredData();
    mapData = computeMapData();

    renderList();
    renderSoloChip();

    if (!mapReady || !map.getSource("portfolio-hqs")) return;

    const hqFeatures = mapData.companies.map((c) => {
      const isSelected = selectedCompanyRank === c.rank;
      return {
        type: "Feature",
        properties: {
          rank: c.rank,
          name: c.shortName,
          subtitle: companyMeta(c),
          color: SECTOR_COLORS[c.sector] || "#2563eb",
          strokeColor: isSelected ? "#0f172a" : "#ffffff",
          strokeWidth: isSelected ? 2.5 : 1.3
        },
        geometry: { type: "Point", coordinates: [c.lng, c.lat] }
      };
    });

    const facFeatures = mapData.facilities.map((f) => {
      const isSelected = selectedFacilityId === f.id || selectedCompanyRank === f.parentRank;
      const parent = companyByRank[f.parentRank];
      return {
        type: "Feature",
        properties: {
          id: f.id,
          parentRank: f.parentRank,
          name: f.shortName || f.name,
          subtitle: [parent ? parent.shortName : f.parentName, facilityLabel(f.facilityType)].join(" · "),
          color: facilityColor(f.facilityType),
          strokeWidth: selectedFacilityId === f.id ? 3 : isSelected ? 2.2 : 1.1
        },
        geometry: { type: "Point", coordinates: [f.lng, f.lat] }
      };
    });

    // Lines from HQ to sites, only for the selected (or soloed) company
    const linkFeatures = [];
    const linkRank = showLinks ? selectedCompanyRank || soloRank : null;
    const linkParent = linkRank && companyByRank[linkRank];
    if (linkParent) {
      const color = SECTOR_COLORS[linkParent.sector] || "#2563eb";
      mapData.facilities.forEach((f) => {
        if (f.parentRank !== linkRank) return;
        linkFeatures.push({
          type: "Feature",
          properties: { color },
          geometry: {
            type: "LineString",
            coordinates: [
              [linkParent.lng, linkParent.lat],
              [f.lng, f.lat]
            ]
          }
        });
      });
    }

    map.getSource("portfolio-hqs").setData({ type: "FeatureCollection", features: hqFeatures });
    map.getSource("portfolio-facilities").setData({ type: "FeatureCollection", features: facFeatures });
    map.getSource("portfolio-links").setData({ type: "FeatureCollection", features: linkFeatures });

    updateMapLogoMarkers();
    scheduleBuildingMatch();
  }

  function formatChange(v) {
    if (typeof v !== "number" || !isFinite(v)) return "";
    const cls = v >= 0 ? "chg-pos" : "chg-neg";
    return `<span class="${cls}">${v > 0 ? "+" : ""}${v.toFixed(1)}%</span>`;
  }

  function renderList() {
    const { filteredCompanies, filteredFacilities } = current;
    const listEl = document.getElementById("entityList");
    const metaEl = document.getElementById("listMeta");

    metaEl.textContent =
      activeTab === "facilities"
        ? plural(filteredFacilities.length, "site")
        : `${plural(filteredCompanies.length, "company").replace("companys", "companies")} · ${plural(
            filteredFacilities.length,
            "site"
          )}`;

    const empty = `<div class="empty-state">No matches</div>`;

    if (activeTab === "grid") {
      listEl.innerHTML = filteredCompanies.length
        ? `<div class="logo-grid">${filteredCompanies
            .map((c) => {
              const isSelected = selectedCompanyRank === c.rank && !selectedFacilityId;
              return `<div class="logo-tile ${isSelected ? "selected" : ""}" data-rank="${c.rank}" title="${escapeHtml(c.shortName)}">${renderLogoHtml(c)}</div>`;
            })
            .join("")}</div>`
        : empty;
    } else if (activeTab === "companies") {
      listEl.innerHTML = filteredCompanies.length
        ? filteredCompanies
            .map((c) => {
              const isSelected = selectedCompanyRank === c.rank && !selectedFacilityId;
              const value =
                activeSort === "mcap_desc"
                  ? `~${formatCompactValue(c.impliedMarketCap)}`
                  : formatCompactValue(c.marketValue);
              const chg = c.quote ? formatChange(c.quote.change1m) : "";
              return `
            <div class="list-row ${isSelected ? "selected" : ""}" data-rank="${c.rank}">
              ${renderLogoHtml(c)}
              <div class="row-text">
                <div class="row-name">${escapeHtml(c.shortName)}</div>
                <div class="row-meta">${escapeHtml(companyMeta(c))}</div>
              </div>
              <div class="row-right">
                <div class="row-value">${value}</div>
                ${chg ? `<div class="row-chg">${chg}</div>` : ""}
              </div>
            </div>`;
            })
            .join("")
        : empty;
    } else {
      listEl.innerHTML = filteredFacilities.length
        ? filteredFacilities
            .map((f) => {
              const parent = companyByRank[f.parentRank];
              const isSelected = selectedFacilityId === f.id;
              return `
            <div class="list-row ${isSelected ? "selected" : ""}" data-fac-id="${escapeHtml(f.id)}">
              ${renderLogoHtml(parent)}
              <div class="row-text">
                <div class="row-name">${escapeHtml(f.shortName || f.name)}</div>
                <div class="row-meta">${escapeHtml(
                  [parent ? parent.shortName : f.parentName, f.city].filter(Boolean).join(" · ")
                )}</div>
              </div>
              <div class="row-right">
                <div class="row-chg" style="display:flex;align-items:center;gap:5px;color:var(--text-muted)">${typeDot(
                  f.facilityType
                )}${facilityLabel(f.facilityType)}</div>
              </div>
            </div>`;
            })
            .join("")
        : empty;
    }
  }

  function scrollSelectedRowIntoView() {
    const sel = document.querySelector("#entityList .selected");
    if (sel) sel.scrollIntoView({ block: "nearest" });
  }

  // --- Camera helpers ---
  function sheetPadding() {
    const wide = window.innerWidth > 768;
    return { top: 70, bottom: 50, left: 50, right: wide ? 340 : 50 };
  }

  function flyToPoint(lng, lat, minZoom) {
    map.flyTo({
      center: [lng, lat],
      zoom: Math.max(map.getZoom(), minZoom),
      speed: 1.8,
      essential: true
    });
  }

  function fitBoundsToPoints(coordsLngLat, maxZoom = 12.5) {
    if (!coordsLngLat || coordsLngLat.length === 0) return;
    if (coordsLngLat.length === 1) {
      map.flyTo({ center: coordsLngLat[0], zoom: Math.max(map.getZoom(), 11), speed: 1.8 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds(coordsLngLat[0], coordsLngLat[0]);
    coordsLngLat.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { padding: sheetPadding(), maxZoom, duration: 700 });
  }

  function fitCompany(c) {
    fitBoundsToPoints([[c.lng, c.lat], ...sitesOf(c.rank).map((f) => [f.lng, f.lat])]);
  }

  // --- Selection & Solo ---
  function selectCompany(rank, opts = {}) {
    const c = companyByRank[rank];
    if (!c) return;
    selectedCompanyRank = rank;
    selectedFacilityId = null;
    const soloMoved = soloRank && soloRank !== rank;
    if (soloMoved) soloRank = rank; // while soloing, picking another company moves the solo to it

    renderAll();
    scrollSelectedRowIntoView();
    showCompanySheet(c);

    if (soloMoved) fitCompany(c);
    else if (opts.fly) flyToPoint(c.lng, c.lat, 9);
  }

  function selectFacility(facId, opts = {}) {
    const f = facilities.find((item) => item.id === facId);
    if (!f) return;
    selectedFacilityId = facId;
    selectedCompanyRank = f.parentRank;
    if (soloRank && soloRank !== f.parentRank) soloRank = f.parentRank;

    renderAll();
    scrollSelectedRowIntoView();
    showFacilitySheet(f);

    if (opts.fly) flyToPoint(f.lng, f.lat, 10);
  }

  function setSolo(rank) {
    const c = companyByRank[rank];
    if (!c) return;
    soloRank = rank;
    if (selectedCompanyRank !== rank) {
      selectedCompanyRank = rank;
      selectedFacilityId = null;
    }
    renderAll();
    scrollSelectedRowIntoView();
    refreshSheet();
    fitCompany(c);
  }

  function exitSolo() {
    if (!soloRank) return;
    soloRank = null;
    renderAll();
    refreshSheet();
  }

  function toggleSolo() {
    if (soloRank) exitSolo();
    else if (selectedCompanyRank) setSolo(selectedCompanyRank);
  }

  function renderSoloChip() {
    const chip = document.getElementById("soloChip");
    const c = soloRank && companyByRank[soloRank];
    if (!c) {
      chip.hidden = true;
      return;
    }
    chip.hidden = false;
    chip.innerHTML = `<span class="solo-label">Solo</span><strong>${escapeHtml(c.shortName)}</strong><span class="solo-label">${plural(
      sitesOf(c.rank).length,
      "site"
    )}</span><button data-action="exit-solo" title="Show all companies (Esc)">Show all</button>`;
  }

  function refreshSheet() {
    if (selectedFacilityId) {
      const f = facilities.find((item) => item.id === selectedFacilityId);
      if (f) return showFacilitySheet(f);
    }
    if (selectedCompanyRank && companyByRank[selectedCompanyRank]) {
      return showCompanySheet(companyByRank[selectedCompanyRank]);
    }
    document.getElementById("inspectorCard").classList.remove("visible");
  }

  // --- Detail sheet ---
  function stat(label, value) {
    return `<div class="stat"><span class="stat-label">${label}</span><span class="stat-value">${value}</span></div>`;
  }

  function formatPrice(p) {
    const n = Number(p);
    if (!isFinite(n)) return String(p);
    return n.toLocaleString("en-US", { maximumFractionDigits: n >= 100 ? 1 : 2 });
  }

  function renderSitesList(sites, title) {
    if (!sites.length) return "";
    return `
      <div class="sub-head"><span>${escapeHtml(title)}</span><span>${sites.length}</span></div>
      <div class="sub-list">
        ${sites
          .map(
            (f) => `
          <div class="sub-row ${selectedFacilityId === f.id ? "selected" : ""}" data-fac-id="${escapeHtml(f.id)}">
            ${typeDot(f.facilityType)}
            <span class="sub-name">${escapeHtml(f.shortName || f.name)}</span>
            <span class="sub-type">${escapeHtml(facilityLabel(f.facilityType))}</span>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function soloButton(rank) {
    const on = soloRank === rank;
    return `<button class="action-btn ${on ? "primary" : ""}" data-action="solo" title="Show only this company on the map (S)">${
      on ? "Soloed" : "Solo"
    }</button>`;
  }

  function showCompanySheet(c) {
    const sheet = document.getElementById("inspectorCard");
    const sites = sitesOf(c.rank);
    const q = c.quote;
    const sub = [c.city, countryName(c.country), SECTOR_LABELS[c.sector] || c.sector].filter(Boolean).join(" · ");

    const stats = [
      stat("Price", q ? `${formatPrice(q.price)} ${escapeHtml(q.currency)}` : "–"),
      stat(
        "1M",
        q ? `${formatChange(q.change1m)}${q.closes ? renderSparklineSvg(q.closes, q.change1m >= 0, 34, 14) : ""}` : "–"
      ),
      stat("Mkt cap", `~${formatCompactValue(c.impliedMarketCap)}`),
      stat("Holding", `${formatCompactValue(c.marketValue)} NOK`),
      stat("Owned", `${c.ownershipPercent.toFixed(2)}%`),
      stat("Fund", escapeHtml((c.funds || []).join(" + ")))
    ].join("");

    sheet.innerHTML = `
      <div class="sheet-top">
        ${renderLogoHtml(c)}
        <div class="sheet-head">
          <div class="sheet-title">${escapeHtml(c.name)}</div>
          <div class="sheet-sub">${escapeHtml(sub)}</div>
        </div>
        <button class="close-btn" data-action="close" title="Close (Esc)">&times;</button>
      </div>
      <div class="stats">${stats}</div>
      ${c.hqDescription ? `<div class="sheet-desc" title="Click to expand">${escapeHtml(c.hqDescription)}</div>` : ""}
      <div class="sheet-actions">
        <button class="action-btn" data-action="zoom-hq" title="Zoom to the HQ building">Zoom</button>
        ${sites.length ? `<button class="action-btn" data-action="fit" title="Fit HQ and all sites in view">All sites</button>` : ""}
        ${soloButton(c.rank)}
        ${c.website ? `<a class="action-btn" href="${escapeHtml(c.website)}" target="_blank" rel="noopener">Website ↗</a>` : ""}
      </div>
      ${renderSitesList(sites, "Sites")}
    `;
    sheet.classList.add("visible");
  }

  function showFacilitySheet(f) {
    const sheet = document.getElementById("inspectorCard");
    const parent = companyByRank[f.parentRank];
    const siblings = sitesOf(f.parentRank);
    const sub = [facilityLabel(f.facilityType), f.city, countryName(f.country)].filter(Boolean).join(" · ");

    sheet.innerHTML = `
      <div class="sheet-top">
        ${renderLogoHtml(parent)}
        <div class="sheet-head">
          <div class="sheet-title">${escapeHtml(f.shortName || f.name)}</div>
          <div class="sheet-sub">${escapeHtml(parent ? parent.shortName : f.parentName)} · ${escapeHtml(sub)}</div>
        </div>
        <button class="close-btn" data-action="close" title="Close (Esc)">&times;</button>
      </div>
      ${f.description ? `<div class="sheet-desc" title="Click to expand">${escapeHtml(f.description)}</div>` : ""}
      ${f.address ? `<div class="sheet-sub">${escapeHtml(f.address)}</div>` : ""}
      <div class="sheet-actions">
        <button class="action-btn" data-action="zoom-site" title="Zoom to this site">Zoom</button>
        ${parent ? `<button class="action-btn" data-action="company" title="Go to the company (Esc)">Company</button>` : ""}
        ${parent ? soloButton(parent.rank) : ""}
      </div>
      ${renderSitesList(siblings, parent ? `${parent.shortName} sites` : "Sites")}
    `;
    sheet.classList.add("visible");
  }

  function onSheetClick(e) {
    const t = e.target;
    const desc = t.closest(".sheet-desc");
    if (desc) return desc.classList.toggle("expanded");

    const row = t.closest(".sub-row[data-fac-id]");
    if (row) return selectFacility(row.getAttribute("data-fac-id"), { fly: true });

    const btn = t.closest("[data-action]");
    if (!btn) return;
    const c = selectedCompanyRank && companyByRank[selectedCompanyRank];
    const f = selectedFacilityId && facilities.find((item) => item.id === selectedFacilityId);
    const pitch = is3dEnabled ? 52 : 0;

    switch (btn.getAttribute("data-action")) {
      case "close":
        clearSelection();
        break;
      case "zoom-hq":
        if (c) map.flyTo({ center: [c.lng, c.lat], zoom: 16.5, pitch, speed: 1.8 });
        break;
      case "zoom-site":
        if (f) map.flyTo({ center: [f.lng, f.lat], zoom: 16, pitch, speed: 1.8 });
        break;
      case "fit":
        if (c) fitCompany(c);
        break;
      case "company":
        if (c) selectCompany(c.rank, { fly: true });
        break;
      case "solo":
        toggleSolo();
        break;
    }
  }

  function clearSelection() {
    selectedCompanyRank = null;
    selectedFacilityId = null;
    document.getElementById("inspectorCard").classList.remove("visible");
    renderAll();
  }

  // Esc walks one step back: site -> company -> leave solo -> nothing selected
  function stepBack() {
    if (selectedFacilityId && selectedCompanyRank) return selectCompany(selectedCompanyRank);
    if (soloRank) return exitSolo();
    if (selectedCompanyRank) return clearSelection();
  }

  function setThreeD(on) {
    is3dEnabled = on;
    document.getElementById("btnToggle3d").classList.toggle("active", on);
    ["all-buildings-3d", "portfolio-buildings-3d"].forEach((id) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    });
    if (on) {
      map.dragRotate.enable();
      map.touchZoomRotate.enableRotation();
      map.touchPitch.enable();
      map.keyboard.enableRotation();
      map.easeTo({ pitch: 50, duration: 400 });
    } else {
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.touchPitch.disable();
      map.keyboard.disableRotation();
      map.easeTo({ pitch: 0, bearing: 0, duration: 400 });
    }
  }

  function setActiveIn(containerSel, attr, value) {
    document.querySelectorAll(`${containerSel} [${attr}]`).forEach((b) => {
      b.classList.toggle("active", b.getAttribute(attr) === value);
    });
  }

  function resetAll() {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    syncSearchUi();
    activeRegion = "ALL";
    activeType = "all";
    activeSort = "value_desc";
    document.getElementById("sortSelect").value = activeSort;
    setActiveIn("#regionBar", "data-region", activeRegion);
    setActiveIn("#typeBar", "data-type", activeType);

    soloRank = null;
    selectedCompanyRank = null;
    selectedFacilityId = null;
    document.getElementById("inspectorCard").classList.remove("visible");
    if (is3dEnabled) setThreeD(false);
    renderAll();
    map.flyTo({ center: [11.5, 61.5], zoom: 4.4, pitch: 0, bearing: 0, duration: 700 });
  }

  function fitToCurrentFilter() {
    const pts =
      activeRegion === "GLOBAL"
        ? current.filteredFacilities.map((f) => [f.lng, f.lat])
        : [
            ...current.filteredCompanies.map((c) => [c.lng, c.lat]),
            ...current.filteredFacilities.map((f) => [f.lng, f.lat])
          ];
    if (pts.length > 0) fitBoundsToPoints(pts, 9);
  }

  // Ordered ids of what the sidebar list currently shows, for arrow-key browsing
  function listOrder() {
    if (activeTab === "facilities") return current.filteredFacilities.map((f) => ({ fac: f.id }));
    return current.filteredCompanies.map((c) => ({ rank: c.rank }));
  }

  function moveSelection(delta) {
    const items = listOrder();
    if (!items.length) return;
    let idx =
      activeTab === "facilities"
        ? items.findIndex((it) => it.fac === selectedFacilityId)
        : items.findIndex((it) => it.rank === selectedCompanyRank && !selectedFacilityId);
    idx = idx === -1 ? (delta > 0 ? 0 : items.length - 1) : Math.min(items.length - 1, Math.max(0, idx + delta));
    const it = items[idx];
    if (it.fac) selectFacility(it.fac, { fly: true });
    else selectCompany(it.rank, { fly: true });
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
          feat.geometry.type === "Point" ? feat.geometry.coordinates.slice() : [e.lngLat.lng, e.lngLat.lat];
        showHover(coords, p.name || "", p.subtitle || "");
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
          if (rank) selectCompany(rank);
        } else if (layerId === "portfolio-facilities-circle" || p.entityType === "facility") {
          const facId = p.id || p.entityId;
          if (facId) selectFacility(facId);
        }
      });
    });

    map.on("dblclick", "portfolio-hqs-circle", (e) => {
      const feat = e.features && e.features[0];
      if (!feat) return;
      e.preventDefault();
      setSolo(Number(feat.properties.rank));
    });

    map.on("click", (e) => {
      const hit = map.queryRenderedFeatures(e.point, {
        layers: interactiveLayers.filter((id) => map.getLayer(id))
      });
      if (!hit || hit.length === 0) {
        if (selectedCompanyRank || selectedFacilityId) clearSelection();
      }
    });

    map.on("zoom", scheduleLogoUpdate);
    map.on("moveend", scheduleBuildingMatch);
  }

  function syncSearchUi() {
    const searchInput = document.getElementById("searchInput");
    document.getElementById("btnClearSearch").hidden = !searchInput.value;
    document.getElementById("searchKbd").classList.toggle("hidden", !!searchInput.value);
  }

  function isTyping(e) {
    const t = e.target;
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
  }

  function initControls() {
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("btnClearSearch");
    const listEl = document.getElementById("entityList");

    searchInput.addEventListener("input", () => {
      syncSearchUi();
      renderAll();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const first = listOrder()[0];
        if (first) first.fac ? selectFacility(first.fac, { fly: true }) : selectCompany(first.rank, { fly: true });
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        moveSelection(e.key === "ArrowDown" ? 1 : -1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (searchInput.value) {
          searchInput.value = "";
          syncSearchUi();
          renderAll();
        } else {
          searchInput.blur();
        }
      }
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      syncSearchUi();
      renderAll();
      searchInput.focus();
    });

    // Sidebar list: click selects and flies there, double-click solos
    listEl.addEventListener("click", (e) => {
      const row = e.target.closest("[data-rank], [data-fac-id]");
      if (!row) return;
      if (row.hasAttribute("data-fac-id")) selectFacility(row.getAttribute("data-fac-id"), { fly: true });
      else selectCompany(Number(row.getAttribute("data-rank")), { fly: true });
    });
    listEl.addEventListener("dblclick", (e) => {
      const row = e.target.closest("[data-rank], [data-fac-id]");
      if (!row) return;
      if (row.hasAttribute("data-fac-id")) {
        const f = facilities.find((item) => item.id === row.getAttribute("data-fac-id"));
        if (f) setSolo(f.parentRank);
      } else {
        setSolo(Number(row.getAttribute("data-rank")));
      }
    });

    document.getElementById("inspectorCard").addEventListener("click", onSheetClick);
    document.getElementById("soloChip").addEventListener("click", (e) => {
      if (e.target.closest('[data-action="exit-solo"]')) exitSolo();
    });

    // Changing region or type leaves solo, so the map always reflects the filter you just picked
    document.querySelectorAll("#regionBar [data-region]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const reg = btn.getAttribute("data-region");
        activeRegion = activeRegion === reg && reg !== "ALL" ? "ALL" : reg;
        setActiveIn("#regionBar", "data-region", activeRegion);
        soloRank = null;
        renderAll();
        refreshSheet();
        fitToCurrentFilter();
      });
    });

    document.querySelectorAll("#typeBar [data-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.getAttribute("data-type");
        activeType = activeType === t && t !== "all" ? "all" : t;
        setActiveIn("#typeBar", "data-type", activeType);
        soloRank = null;
        renderAll();
        refreshSheet();
      });
    });

    document.getElementById("sortSelect").addEventListener("change", (e) => {
      activeSort = e.target.value;
      renderAll();
    });

    document.querySelectorAll("#viewBar [data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.getAttribute("data-view");
        setActiveIn("#viewBar", "data-view", activeTab);
        renderAll();
        scrollSelectedRowIntoView();
      });
    });

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
        currentBasemap = btn.getAttribute("data-basemap");
        setActiveIn("#basemapBar", "data-basemap", currentBasemap);
        applyBasemapMode();
      });
    });

    document.getElementById("btnToggle3d").addEventListener("click", () => setThreeD(!is3dEnabled));
    document.getElementById("btnReset").addEventListener("click", resetAll);

    document.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return;
      if (e.key === "/") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key === "Escape") {
        stepBack();
      } else if (e.key === "s" || e.key === "S") {
        toggleSolo();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        moveSelection(e.key === "ArrowDown" ? 1 : -1);
      }
    });
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
