// Nordic Portfolio Atlas — SPN + SFT Unified MapLibre GL + OpenFreeMap Vector Edition
(function () {
  const SECTOR_COLORS = {
    "Industri": "#d97706",
    "Finans": "#2563eb",
    "Helse": "#db2777",
    "Teknologi": "#7c3aed",
    "Konsumvarer": "#059669",
    "Varige konsumvarer": "#0d9488",
    "Materialer": "#ea580c",
    "Energi": "#ca8a04",
    "Eiendom": "#4f46e5",
    "Telekommunikasjon": "#0284c7",
    "Forsyning": "#65a30d"
  };

  const FACILITY_COLORS = {
    "Oil & Gas Drilling / Platform": "#b45309",
    "Aquaculture & Fishery": "#0284c7",
    "Factory & Manufacturing": "#d97706",
    "Mill, Smelter & Mine": "#e11d48",
    "Data Center, Telecom & Cloud": "#4f46e5",
    "Offshore, Marine & Energy": "#ca8a04",
    "R&D, Biotech & Medtech Lab": "#9333ea",
    "Filial, Logistics & Subsidiary HQ": "#059669"
  };

  function normName(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/\b(asa|ab|oyj|a\/s|plc|group|holding|holdings|konsern)\b/g, "")
      .replace(/[^a-z0-9æøåäö]/g, "")
      .trim();
  }

  // Build Unified SPN + SFT Company List (Deduplicating Dual-Held Companies by issuerId / Name)
  function buildUnifiedCompanies() {
    const sftRaw = [
      ...(window.HQ_COMPANIES_PART1 || []),
      ...(window.HQ_COMPANIES_PART2 || [])
    ];
    const spnRaw = [...(window.HQ_COMPANIES_SPN || [])];

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
    });
    return unified;
  }

  const companies = buildUnifiedCompanies();

  // Map lookup tables for linking all 410 facilities to their unified parent company
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
    "sparebank1srnorge": "sparebank1srnorge",
    "leroyseafood": "leroyseafood"
  };

  const rawFacilities = [
    ...(window.FACILITIES_EXPANSION || []),
    ...(window.FACILITIES_EXPANSION_PART2 || []),
    ...(window.FACILITIES_EXPANSION_PART3 || []),
    ...(window.FACILITIES_EXPANSION_PART4 || []),
    ...(window.FACILITIES_EXPANSION_PART5 || []),
    ...(window.FACILITIES_EXPANSION_PART6 || []),
    ...(window.FACILITIES_EXPANSION_PART7 || []),
    ...(window.FACILITIES_EXPANSION_PART8 || [])
  ];

  const facilities = rawFacilities.map((f) => {
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
    return {
      ...f,
      sftParentRank: f.parentRank || (parent ? parent.sftRank : null),
      parentRank: parent ? parent.rank : f.parentRank || 1,
      parentName: parent ? parent.name : f.parentName
    };
  });

  const intelBySftRank = (window.COMPANY_INTELLIGENCE && window.COMPANY_INTELLIGENCE.byRank) || {};

  // --- Logo Helper Functions ---
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
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return String(name || "HQ").slice(0, 2).toUpperCase();
  }

  function renderLogoHtml(company, boxClass = "logo-box") {
    if (!company) return "";
    const domain = getCompanyDomain(company.website);
    const color = SECTOR_COLORS[company.sector] || "#2563eb";
    const initials = getCompanyInitials(company.name);
    if (!domain) {
      return `<span class="${boxClass}"><span class="logo-fallback" style="background:${color}">${initials}</span></span>`;
    }
    const logoUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    return `<span class="${boxClass}"><img src="${logoUrl}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span class="logo-fallback" style="display:none;background:${color}">${initials}</span></span>`;
  }

  function renderFundBadge(c) {
    if (!c || !c.funds) return "";
    if (c.funds.length > 1) {
      return `<span class="fund-badge fund-both" title="Held in both SPN (${c.spnMarketValue}M) and SFT (${c.sftMarketValue}M)">SPN+SFT</span>`;
    }
    if (c.funds[0] === "SPN") {
      return `<span class="fund-badge fund-spn" title="Statens pensjonsfond Norge">SPN</span>`;
    }
    return `<span class="fund-badge fund-sft" title="Statens fond i Tromsø">SFT</span>`;
  }

  let activeTab = "companies";
  let activeSpotlight = "all";
  let selectedCompanyRank = null;
  let selectedFacilityId = null;
  let currentStyleKey = "positron";

  const exactFootprintCache = new Map();
  let overpassFeatures = [];
  let activeLogoMarkers = [];

  const STYLE_URLS = {
    positron: "https://tiles.openfreemap.org/styles/positron",
    liberty: "https://tiles.openfreemap.org/styles/liberty"
  };

  const map = new maplibregl.Map({
    container: "map",
    style: STYLE_URLS.positron,
    center: [12.5, 61.2],
    zoom: 4.5,
    pitch: 0,
    bearing: 0,
    attributionControl: true
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-left");

  const hoverPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 10
  });

  // --- Geometry Helpers for Exact Building Alignment & Offshore Structures ---
  function distanceMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function pointInRing(lng, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect =
        yi > lat !== yj > lat &&
        lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function ringCentroidAndMinDist(lng, lat, ring) {
    let sumLng = 0;
    let sumLat = 0;
    let minD = Infinity;
    const n = ring.length;
    for (let i = 0; i < n; i++) {
      const pLng = ring[i][0];
      const pLat = ring[i][1];
      sumLng += pLng;
      sumLat += pLat;
      const d = distanceMeters(lat, lng, pLat, pLng);
      if (d < minD) minD = d;
    }
    const cLng = sumLng / (n || 1);
    const cLat = sumLat / (n || 1);
    const cDist = distanceMeters(lat, lng, cLat, cLng);
    return { cLng, cLat, minDist: Math.min(minD, cDist) };
  }

  function createCircleRing(lng, lat, radiusMeters, steps = 24) {
    const latRad = (lat * Math.PI) / 180;
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos(latRad);
    const ring = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      ring.push([
        lng + (Math.cos(a) * radiusMeters) / mPerDegLng,
        lat + (Math.sin(a) * radiusMeters) / mPerDegLat
      ]);
    }
    return ring;
  }

  function createRectRing(lng, lat, widthM, heightM) {
    const latRad = (lat * Math.PI) / 180;
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos(latRad);
    const hw = widthM / 2 / mPerDegLng;
    const hh = heightM / 2 / mPerDegLat;
    return [
      [lng - hw, lat - hh],
      [lng + hw, lat - hh],
      [lng + hw, lat + hh],
      [lng - hw, lat + hh],
      [lng - hw, lat - hh]
    ];
  }

  function isMarineSeaCageSite(f) {
    if (f.facilityType !== "Aquaculture & Fishery") return false;
    const txt = (f.name + " " + f.description).toLowerCase();
    return (
      txt.includes("sea-cage") ||
      txt.includes("sea site") ||
      txt.includes("marine salmon") ||
      txt.includes("marine farm") ||
      txt.includes("locality no.") ||
      txt.includes("in-sea") ||
      txt.includes("ocean farm")
    );
  }

  function isOffshorePlatformSite(f) {
    return f.facilityType === "Oil & Gas Drilling / Platform";
  }

  function generateMarineSeaCageFeatures(f, color) {
    const latRad = (f.lat * Math.PI) / 180;
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos(latRad);
    const features = [];
    const cols = [-80, -40, 0, 40, 80];
    const rows = [-22, 22];
    rows.forEach((dy) => {
      cols.forEach((dx) => {
        const cLng = f.lng + dx / mPerDegLng;
        const cLat = f.lat + dy / mPerDegLat;
        features.push({
          type: "Feature",
          properties: {
            color,
            name: f.name,
            subtitle: `${f.parentName} · Marine Sea-Cage Ring`,
            entityType: "facility",
            entityId: f.id,
            height: 4
          },
          geometry: {
            type: "Polygon",
            coordinates: [createCircleRing(cLng, cLat, 14, 20)]
          }
        });
      });
    });
    return features;
  }

  // Generate realistic offshore oil/gas platform deck modules + helideck in the North Sea / Norwegian Sea / Barents Sea
  function generateOffshorePlatformFeatures(f, color) {
    const latRad = (f.lat * Math.PI) / 180;
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos(latRad);
    const dLng = (m) => m / mPerDegLng;
    const dLat = (m) => m / mPerDegLat;

    return [
      // Main Drilling & Riser Platform Module
      {
        type: "Feature",
        properties: {
          color,
          name: f.name,
          subtitle: `${f.parentName} · Offshore Drilling & Production Deck`,
          entityType: "facility",
          entityId: f.id,
          height: 48
        },
        geometry: {
          type: "Polygon",
          coordinates: [createRectRing(f.lng - dLng(38), f.lat, 58, 42)]
        }
      },
      // Living Quarters & Processing Platform Module
      {
        type: "Feature",
        properties: {
          color,
          name: f.name,
          subtitle: `${f.parentName} · Offshore Processing & Quarters Platform`,
          entityType: "facility",
          entityId: f.id,
          height: 38
        },
        geometry: {
          type: "Polygon",
          coordinates: [createRectRing(f.lng + dLng(42), f.lat, 52, 38)]
        }
      },
      // Gangway Bridge Link
      {
        type: "Feature",
        properties: {
          color: "#475569",
          name: f.name,
          subtitle: `${f.parentName} · Offshore Gangway Bridge`,
          entityType: "facility",
          entityId: f.id,
          height: 26
        },
        geometry: {
          type: "Polygon",
          coordinates: [createRectRing(f.lng + dLng(2), f.lat, 28, 8)]
        }
      },
      // Octagonal Helideck
      {
        type: "Feature",
        properties: {
          color: "#0ea5e9",
          name: f.name,
          subtitle: `${f.parentName} · Offshore Helideck`,
          entityType: "facility",
          entityId: f.id,
          height: 44
        },
        geometry: {
          type: "Polygon",
          coordinates: [createCircleRing(f.lng + dLng(62), f.lat + dLat(18), 15, 8)]
        }
      }
    ];
  }

  const NORDIC_COUNTRIES = new Set(["Norge", "Sverige", "Finland", "Danmark", "Island"]);

  function isGlobalCountry(country) {
    return !NORDIC_COUNTRIES.has(country);
  }

  function getFilteredData() {
    const q = (document.getElementById("searchInput").value || "").trim().toLowerCase();
    const fundFilter = document.getElementById("fundSelect").value;
    const countryFilter = document.getElementById("countrySelect").value;
    const sectorFilter = document.getElementById("sectorSelect").value;

    const facByRank = {};
    facilities.forEach((f) => {
      if (!facByRank[f.parentRank]) facByRank[f.parentRank] = [];
      facByRank[f.parentRank].push(f);
    });

    const filteredCompanies = companies.filter((c) => {
      if (fundFilter === "SPN" && !c.funds.includes("SPN")) return false;
      if (fundFilter === "SFT" && !c.funds.includes("SFT")) return false;
      if (fundFilter === "BOTH" && c.funds.length < 2) return false;
      if (sectorFilter !== "ALL" && c.sector !== sectorFilter) return false;

      const cFacs = facByRank[c.rank] || [];
      if (countryFilter === "GLOBAL") {
        const hasGlobalFac = cFacs.some((f) => isGlobalCountry(f.country));
        if (!isGlobalCountry(c.country) && !hasGlobalFac) return false;
      } else if (countryFilter !== "ALL") {
        const hasCountryFac = cFacs.some((f) => f.country === countryFilter);
        if (c.country !== countryFilter && !hasCountryFac) return false;
      }

      const cIntel = c.sftRank ? intelBySftRank[c.sftRank] : null;

      if (
        activeSpotlight === "oilgas" &&
        !cFacs.some(
          (f) =>
            f.facilityType === "Oil & Gas Drilling / Platform" ||
            f.facilityType === "Offshore, Marine & Energy"
        ) &&
        c.sector !== "Energi"
      ) {
        return false;
      }
      if (
        activeSpotlight === "fish" &&
        !cFacs.some((f) => f.facilityType === "Aquaculture & Fishery") &&
        !["mowi", "salmar", "bakkafrost", "leroyseafood", "austevollsf", "griegseafood", "salmonevolution", "biomargroup"].some((k) =>
          normName(c.name).includes(k)
        )
      ) {
        return false;
      }
      if (
        activeSpotlight === "mills" &&
        !cFacs.some((f) => f.facilityType === "Mill, Smelter & Mine") &&
        c.sector !== "Materialer"
      ) {
        return false;
      }
      if (
        activeSpotlight === "datacenters" &&
        !cFacs.some((f) => f.facilityType === "Data Center, Telecom & Cloud") &&
        c.sector !== "Telekommunikasjon"
      ) {
        return false;
      }
      if (
        activeSpotlight === "factories" &&
        !cFacs.some((f) => f.facilityType === "Factory & Manufacturing") &&
        c.sector !== "Industri"
      ) {
        return false;
      }
      if (
        activeSpotlight === "distribution" &&
        !cFacs.some((f) => f.facilityType === "Filial, Logistics & Subsidiary HQ")
      ) {
        return false;
      }
      if (
        activeSpotlight === "pharma" &&
        !cFacs.some((f) => f.facilityType === "R&D, Biotech & Medtech Lab") &&
        c.sector !== "Helse"
      ) {
        return false;
      }

      if (q) {
        const matchC =
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.hqDescription.toLowerCase().includes(q) ||
          (cIntel && cIntel.ticker && cIntel.ticker.toLowerCase().includes(q));
        const matchF = cFacs.some(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.city.toLowerCase().includes(q) ||
            f.country.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            f.facilityType.toLowerCase().includes(q)
        );
        if (!matchC && !matchF) return false;
      }
      return true;
    });

    const visibleRanks = new Set(filteredCompanies.map((c) => c.rank));

    const filteredFacilities = facilities.filter((f) => {
      const parent = companyByRank[f.parentRank];
      if (fundFilter === "SPN" && parent && !parent.funds.includes("SPN")) return false;
      if (fundFilter === "SFT" && parent && !parent.funds.includes("SFT")) return false;
      if (fundFilter === "BOTH" && parent && parent.funds.length < 2) return false;
      if (countryFilter === "GLOBAL" && !isGlobalCountry(f.country)) return false;
      if (countryFilter !== "ALL" && countryFilter !== "GLOBAL" && f.country !== countryFilter) return false;

      if (
        activeSpotlight === "oilgas" &&
        f.facilityType !== "Oil & Gas Drilling / Platform" &&
        f.facilityType !== "Offshore, Marine & Energy"
      ) {
        return false;
      }
      if (activeSpotlight === "fish" && f.facilityType !== "Aquaculture & Fishery") return false;
      if (activeSpotlight === "mills" && f.facilityType !== "Mill, Smelter & Mine") return false;
      if (activeSpotlight === "datacenters" && f.facilityType !== "Data Center, Telecom & Cloud") return false;
      if (activeSpotlight === "factories" && f.facilityType !== "Factory & Manufacturing") return false;
      if (activeSpotlight === "distribution" && f.facilityType !== "Filial, Logistics & Subsidiary HQ") return false;
      if (activeSpotlight === "pharma" && f.facilityType !== "R&D, Biotech & Medtech Lab") return false;

      if (q) {
        const matchSelf =
          f.name.toLowerCase().includes(q) ||
          f.parentName.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          f.country.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.facilityType.toLowerCase().includes(q);
        if (!matchSelf && !visibleRanks.has(f.parentRank)) return false;
      } else if (sectorFilter !== "ALL" && !visibleRanks.has(f.parentRank)) {
        return false;
      }
      return true;
    });

    return { filteredCompanies, filteredFacilities, facByRank };
  }

  // --- Setup Vector Map Sources & Layers ---
  function setupCustomLayers() {
    if (!map.isStyleLoaded()) return;

    if (!map.getSource("esri-satellite")) {
      map.addSource("esri-satellite", {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: "&copy; Esri"
      });
    }

    const layers = map.getStyle().layers || [];
    let firstSymbolId = undefined;
    for (const lyr of layers) {
      if (lyr.type === "symbol") {
        firstSymbolId = lyr.id;
        break;
      }
    }

    if (!map.getLayer("esri-satellite-layer")) {
      map.addLayer(
        {
          id: "esri-satellite-layer",
          type: "raster",
          source: "esri-satellite",
          layout: {
            visibility: currentStyleKey === "satellite" ? "visible" : "none"
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
            minzoom: 12,
            paint: {
              "fill-color": "#cbd5e1",
              "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12,
                0.35,
                15,
                0.55
              ]
            }
          },
          firstSymbolId
        );
      }

      if (!map.getLayer("all-buildings-outline")) {
        map.addLayer(
          {
            id: "all-buildings-outline",
            type: "line",
            source: "openmaptiles",
            "source-layer": "building",
            minzoom: 13,
            paint: {
              "line-color": "#64748b",
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                0.5,
                16,
                1.1
              ],
              "line-opacity": 0.65
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
            minzoom: 13,
            layout: {
              visibility: document.getElementById("toggle3d").checked ? "visible" : "none"
            },
            paint: {
              "fill-extrusion-color": "#cbd5e1",
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

    ["portfolio-zones", "portfolio-buildings", "portfolio-links", "portfolio-facilities", "portfolio-hqs"].forEach((srcId) => {
      if (!map.getSource(srcId)) {
        map.addSource(srcId, { type: "geojson", data: emptyFC });
      }
    });

    if (!map.getLayer("portfolio-zones-fill")) {
      map.addLayer(
        {
          id: "portfolio-zones-fill",
          type: "fill",
          source: "portfolio-zones",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": ["coalesce", ["get", "fillOpacity"], 0.14]
          }
        },
        firstSymbolId
      );
    }

    if (!map.getLayer("portfolio-zones-line")) {
      map.addLayer(
        {
          id: "portfolio-zones-line",
          type: "line",
          source: "portfolio-zones",
          paint: {
            "line-color": ["get", "color"],
            "line-width": 1.6,
            "line-dasharray": [3, 2],
            "line-opacity": 0.8
          }
        },
        firstSymbolId
      );
    }

    if (!map.getLayer("portfolio-buildings-fill")) {
      map.addLayer(
        {
          id: "portfolio-buildings-fill",
          type: "fill",
          source: "portfolio-buildings",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": 0.82
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
            "line-width": 2
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
            visibility: document.getElementById("toggle3d").checked ? "visible" : "none"
          },
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["coalesce", ["get", "height"], 18],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.9
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
          "line-width": ["get", "width"],
          "line-opacity": ["get", "opacity"],
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
            4,
            ["get", "baseRadius"],
            15,
            ["+", ["get", "baseRadius"], 3]
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": ["get", "strokeColor"],
          "circle-stroke-width": ["get", "strokeWidth"],
          "circle-opacity": 0.94
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
            4,
            ["get", "baseRadius"],
            15,
            ["+", ["get", "baseRadius"], 3]
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": ["get", "strokeColor"],
          "circle-stroke-width": ["get", "strokeWidth"],
          "circle-opacity": 0.96
        }
      });
    }

    updateAllBuildingVisibility();
    renderAll();
  }

  function updateAllBuildingVisibility() {
    const showAllBldgs = document.getElementById("toggleAllBuildings").checked;
    const show3d = document.getElementById("toggle3d").checked;

    if (map.getLayer("all-buildings-2d")) {
      map.setLayoutProperty("all-buildings-2d", "visibility", showAllBldgs ? "visible" : "none");
    }
    if (map.getLayer("all-buildings-outline")) {
      map.setLayoutProperty("all-buildings-outline", "visibility", showAllBldgs ? "visible" : "none");
    }
    if (map.getLayer("all-buildings-3d")) {
      map.setLayoutProperty("all-buildings-3d", "visibility", showAllBldgs && show3d ? "visible" : "none");
    }
    if (map.getLayer("portfolio-buildings-3d")) {
      map.setLayoutProperty("portfolio-buildings-3d", "visibility", show3d ? "visible" : "none");
    }
  }

  // --- Floating Map Logo Markers (Prioritized by Market Value & Viewport) ---
  function updateMapLogoMarkers() {
    activeLogoMarkers.forEach((m) => m.remove());
    activeLogoMarkers = [];

    const showLogos = document.getElementById("toggleLogos").checked;
    const showHqs = document.getElementById("toggleHqs").checked;
    if (!showLogos || !showHqs) return;

    const { filteredCompanies } = getFilteredData();
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const maxLogos = zoom >= 11 ? 85 : zoom >= 7 ? 52 : 34;

    const inView = filteredCompanies.filter((c) => bounds.contains([c.lng, c.lat]));
    // Always include selected company first
    inView.sort((a, b) => {
      if (a.rank === selectedCompanyRank) return -1;
      if (b.rank === selectedCompanyRank) return 1;
      return b.marketValue - a.marketValue;
    });

    inView.slice(0, maxLogos).forEach((c) => {
      const el = document.createElement("div");
      el.className = "map-logo-marker" + (c.rank === selectedCompanyRank ? " active" : "");
      el.title = `${c.name} (${c.marketValue} MNOK)`;
      el.innerHTML = renderLogoHtml(c, "logo-inner");
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        selectCompany(c.rank, true);
      });
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([c.lng, c.lat])
        .addTo(map);
      activeLogoMarkers.push(marker);
    });
  }

  // --- Match Rendered Vector Tile Buildings + Offshore Platforms + Marine Sea-Cages ---
  function matchVectorBuildingsToPortfolio() {
    if (!map.isStyleLoaded() || !map.getSource("portfolio-buildings")) return;

    const showHqs = document.getElementById("toggleHqs").checked;
    const showFacilities = document.getElementById("toggleFacilities").checked;
    const { filteredCompanies, filteredFacilities } = getFilteredData();

    const matchedFeatures = [...overpassFeatures];
    const seenGeomKeys = new Set(
      matchedFeatures.map((f) => JSON.stringify(f.geometry.coordinates[0]?.[0] || []))
    );

    if (showFacilities) {
      filteredFacilities.forEach((f) => {
        const color = FACILITY_COLORS[f.facilityType] || "#0284c7";
        if (isMarineSeaCageSite(f)) {
          generateMarineSeaCageFeatures(f, color).forEach((cageFeat) => {
            matchedFeatures.push(cageFeat);
          });
        } else if (isOffshorePlatformSite(f)) {
          generateOffshorePlatformFeatures(f, color).forEach((platFeat) => {
            matchedFeatures.push(platFeat);
          });
        }
      });
    }

    if (map.getZoom() >= 12.5 && map.getLayer("all-buildings-2d")) {
      const bounds = map.getBounds();

      const matchEntityToVectorBuildings = (
        lng,
        lat,
        color,
        name,
        subtitle,
        entityType,
        entityId,
        maxRadiusM,
        allowMultipleInCompound
      ) => {
        if (!bounds.contains([lng, lat])) return;
        const pt = map.project([lng, lat]);
        const searchPx = allowMultipleInCompound ? 75 : 42;
        const bbox = [
          [pt.x - searchPx, pt.y - searchPx],
          [pt.x + searchPx, pt.y + searchPx]
        ];

        let rendered = [];
        try {
          rendered = map.queryRenderedFeatures(bbox, { layers: ["all-buildings-2d"] });
        } catch (e) {
          return;
        }
        if (!rendered || rendered.length === 0) return;

        let bestFeature = null;
        let bestDist = Infinity;
        const compoundMatches = [];

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
            if (!outerRing || outerRing.length < 3) return;
            const inside = pointInRing(lng, lat, outerRing);
            const { minDist } = ringCentroidAndMinDist(lng, lat, outerRing);
            const d = inside ? 0 : minDist;

            if (d < bestDist) {
              bestDist = d;
              bestFeature = { polyCoords, props: feat.properties || {}, d };
            }
            if (allowMultipleInCompound && d <= maxRadiusM) {
              compoundMatches.push({ polyCoords, props: feat.properties || {}, d });
            }
          });
        });

        const toAdd =
          allowMultipleInCompound && compoundMatches.length > 0
            ? compoundMatches
            : bestFeature && bestDist <= maxRadiusM
            ? [bestFeature]
            : [];

        toAdd.forEach((item) => {
          const gKey = JSON.stringify(item.polyCoords[0]?.[0] || []);
          if (seenGeomKeys.has(gKey)) return;
          seenGeomKeys.add(gKey);
          matchedFeatures.push({
            type: "Feature",
            properties: {
              color,
              name,
              subtitle,
              entityType,
              entityId,
              height: Number(item.props.render_height) || 18
            },
            geometry: {
              type: "Polygon",
              coordinates: item.polyCoords
            }
          });
        });
      };

      if (showHqs) {
        filteredCompanies.forEach((c) => {
          const color = SECTOR_COLORS[c.sector] || "#2563eb";
          matchEntityToVectorBuildings(
            c.lng,
            c.lat,
            color,
            c.name,
            `#${c.rank} HQ · ${c.address}`,
            "company",
            c.rank,
            65,
            false
          );
        });
      }

      if (showFacilities) {
        filteredFacilities.forEach((f) => {
          if (isMarineSeaCageSite(f) || isOffshorePlatformSite(f)) return;
          const color = FACILITY_COLORS[f.facilityType] || "#059669";
          const radius = Math.min(130, Math.max(60, (f.footprintRadiusMeters || 120) * 0.45));
          matchEntityToVectorBuildings(
            f.lng,
            f.lat,
            color,
            f.name,
            `${f.parentName} · ${f.facilityType}`,
            "facility",
            f.id,
            radius,
            true
          );
        });
      }
    }

    map.getSource("portfolio-buildings").setData({
      type: "FeatureCollection",
      features: matchedFeatures
    });
  }

  function renderAll() {
    const showHqs = document.getElementById("toggleHqs").checked;
    const showFacilities = document.getElementById("toggleFacilities").checked;
    const showLines = document.getElementById("toggleLines").checked;

    const { filteredCompanies, filteredFacilities, facByRank } = getFilteredData();

    document.getElementById("headerSummary").textContent = `${filteredCompanies.length} HQs · ${filteredFacilities.length} Sites`;
    document.getElementById("tabCountCompanies").textContent = filteredCompanies.length;
    document.getElementById("tabCountFacilities").textContent = filteredFacilities.length;

    renderList(filteredCompanies, filteredFacilities, facByRank);

    if (!map.isStyleLoaded() || !map.getSource("portfolio-hqs")) return;

    const hqFeatures = [];
    const facFeatures = [];
    const linkFeatures = [];
    const zoneFeatures = [];

    if (showHqs) {
      filteredCompanies.forEach((c) => {
        const color = SECTOR_COLORS[c.sector] || "#2563eb";
        const isSelected = selectedCompanyRank === c.rank;
        const baseRadius = Math.max(4.5, Math.min(11, 3.8 + Math.log10(Math.max(10, c.marketValue)) * 1.65));

        hqFeatures.push({
          type: "Feature",
          properties: {
            rank: c.rank,
            name: c.name,
            subtitle: `#${c.rank} (${c.funds.join("+")}) · ${c.city} · ${c.marketValue.toLocaleString()} MNOK`,
            color,
            baseRadius: isSelected ? baseRadius + 2.5 : baseRadius,
            strokeColor: isSelected ? "#0f172a" : "#ffffff",
            strokeWidth: isSelected ? 2.5 : 1.5
          },
          geometry: {
            type: "Point",
            coordinates: [c.lng, c.lat]
          }
        });
      });
    }

    if (showFacilities) {
      filteredFacilities.forEach((f) => {
        const color = FACILITY_COLORS[f.facilityType] || "#059669";
        const isSelected = selectedFacilityId === f.id || selectedCompanyRank === f.parentRank;
        const parent = companyByRank[f.parentRank];

        facFeatures.push({
          type: "Feature",
          properties: {
            id: f.id,
            parentRank: f.parentRank,
            name: f.name,
            subtitle: `${f.parentName} · ${f.facilityType} (${f.city})`,
            color,
            baseRadius: isSelected ? 6.8 : f.facilityType === "Oil & Gas Drilling / Platform" ? 5.6 : 4.5,
            strokeColor: isSelected ? "#0f172a" : "#ffffff",
            strokeWidth: isSelected ? 2.2 : 1.3
          },
          geometry: {
            type: "Point",
            coordinates: [f.lng, f.lat]
          }
        });

        const zoneRadius = f.footprintRadiusMeters || 150;
        zoneFeatures.push({
          type: "Feature",
          properties: {
            id: f.id,
            name: f.name,
            subtitle: `${f.parentName} · ${f.facilityType}`,
            color,
            fillOpacity:
              isMarineSeaCageSite(f) || isOffshorePlatformSite(f) ? 0.2 : 0.11
          },
          geometry: {
            type: "Polygon",
            coordinates: [createCircleRing(f.lng, f.lat, zoneRadius, 28)]
          }
        });

        if (showLines && parent && (isSelected || activeSpotlight !== "all")) {
          linkFeatures.push({
            type: "Feature",
            properties: {
              color,
              width: isSelected ? 1.8 : 1.1,
              opacity: isSelected ? 0.78 : 0.35
            },
            geometry: {
              type: "LineString",
              coordinates: [
                [parent.lng, parent.lat],
                [f.lng, f.lat]
              ]
            }
          });
        }
      });
    }

    map.getSource("portfolio-hqs").setData({ type: "FeatureCollection", features: hqFeatures });
    map.getSource("portfolio-facilities").setData({ type: "FeatureCollection", features: facFeatures });
    map.getSource("portfolio-links").setData({ type: "FeatureCollection", features: linkFeatures });
    map.getSource("portfolio-zones").setData({ type: "FeatureCollection", features: zoneFeatures });

    matchVectorBuildingsToPortfolio();
    updateMapLogoMarkers();
  }

  function renderList(filteredCompanies, filteredFacilities, facByRank) {
    const container = document.getElementById("entityList");
    container.innerHTML = "";

    if (activeTab === "companies") {
      filteredCompanies.forEach((c) => {
        const cFacs = facByRank[c.rank] || [];
        const row = document.createElement("div");
        row.className = "list-row" + (selectedCompanyRank === c.rank ? " selected" : "");
        row.innerHTML = `
          <div class="row-primary">
            <div class="row-name-wrap">
              ${renderLogoHtml(c, "logo-box")}
              <span class="row-rank">#${c.rank}</span>
              <span class="row-name">${c.name}</span>
            </div>
            <div class="row-right">
              ${renderFundBadge(c)}
              <span class="row-value">${c.marketValue.toLocaleString()}M</span>
            </div>
          </div>
          <div class="row-secondary">
            <span>${c.city}, ${c.country} · ${c.sector}</span>
            ${cFacs.length > 0 ? `<span class="site-tag">${cFacs.length} sites</span>` : ""}
          </div>
        `;
        row.addEventListener("click", () => selectCompany(c.rank, true));
        container.appendChild(row);
      });
    } else {
      filteredFacilities.forEach((f) => {
        const parent = companyByRank[f.parentRank];
        const color = FACILITY_COLORS[f.facilityType] || "#059669";
        const row = document.createElement("div");
        row.className = "list-row" + (selectedFacilityId === f.id ? " selected" : "");
        row.innerHTML = `
          <div class="row-primary">
            <div class="row-name-wrap">
              ${parent ? renderLogoHtml(parent, "logo-box") : `<span class="dot" style="background:${color}"></span>`}
              <span class="row-name">${f.name}</span>
            </div>
            <span class="site-tag" style="color:${color}">${f.facilityType.split(",")[0]}</span>
          </div>
          <div class="row-secondary">
            <span>${f.parentName} · ${f.city}, ${f.country}</span>
            ${parent ? renderFundBadge(parent) : ""}
          </div>
        `;
        row.addEventListener("click", () => selectFacility(f.id, true));
        container.appendChild(row);
      });
    }
  }

  function selectCompany(rank, flyTo = true) {
    selectedCompanyRank = rank;
    selectedFacilityId = null;
    const c = companyByRank[rank];
    if (!c) return;

    const cFacs = facilities.filter((f) => f.parentRank === rank);
    renderAll();
    showCompanySheet(c, cFacs);

    if (flyTo) {
      map.flyTo({
        center: [c.lng, c.lat],
        zoom: 16.5,
        pitch: document.getElementById("toggle3d").checked ? 52 : 0,
        duration: 950
      });
    }

    const color = SECTOR_COLORS[c.sector] || "#2563eb";
    fetchExactOsmFootprints(c.lat, c.lng, 90, color, c.name, `#${c.rank} HQ · ${c.address}`, false);
  }

  function selectFacility(facId, flyTo = true) {
    const f = facilities.find((item) => item.id === facId);
    if (!f) return;
    selectedFacilityId = facId;
    selectedCompanyRank = f.parentRank;

    const parent = companyByRank[f.parentRank];
    const siblingFacs = facilities.filter((item) => item.parentRank === f.parentRank);
    renderAll();
    showFacilitySheet(f, parent, siblingFacs);

    if (flyTo) {
      map.flyTo({
        center: [f.lng, f.lat],
        zoom: isOffshorePlatformSite(f) ? 15.2 : 15.8,
        pitch: document.getElementById("toggle3d").checked ? 52 : 0,
        duration: 950
      });
    }

    if (!isOffshorePlatformSite(f) && !isMarineSeaCageSite(f)) {
      const color = FACILITY_COLORS[f.facilityType] || "#059669";
      fetchExactOsmFootprints(
        f.lat,
        f.lng,
        Math.max(160, f.footprintRadiusMeters || 180),
        color,
        f.name,
        `${f.parentName} · ${f.facilityType}`,
        true
      );
    }
  }

  // --- Overpass Exact Building & Industrial Landuse Matcher ---
  async function fetchExactOsmFootprints(lat, lng, radiusMeters, color, name, subtitle, isFacility) {
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)},${isFacility ? "F" : "H"}`;
    if (exactFootprintCache.has(cacheKey)) {
      overpassFeatures = exactFootprintCache.get(cacheKey);
      matchVectorBuildingsToPortfolio();
      return;
    }

    const query = `[out:json][timeout:8];(way["building"](around:${radiusMeters},${lat},${lng});way["landuse"="industrial"](around:${radiusMeters},${lat},${lng});way["landuse"="quarry"](around:${radiusMeters},${lat},${lng});way["landuse"="aquaculture"](around:${radiusMeters},${lat},${lng});way["man_made"="works"](around:${radiusMeters},${lat},${lng});way["man_made"="storage_tank"](around:${radiusMeters},${lat},${lng}););out body;>;out skel qt;`;
    const endpoints = [
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass-api.de/api/interpreter"
    ];

    for (const url of endpoints) {
      try {
        const resp = await fetch(url, {
          method: "POST",
          body: "data=" + encodeURIComponent(query),
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        if (!resp.ok) continue;
        const data = await resp.json();
        const extracted = extractTargetPolygonsFromOverpass(data, lat, lng, color, name, subtitle, isFacility);
        exactFootprintCache.set(cacheKey, extracted);
        overpassFeatures = extracted;
        matchVectorBuildingsToPortfolio();
        return;
      } catch (e) {
        // Fallback silently
      }
    }
  }

  function extractTargetPolygonsFromOverpass(data, lat, lng, color, name, subtitle, isFacility) {
    const nodes = {};
    (data.elements || []).forEach((el) => {
      if (el.type === "node") nodes[el.id] = [el.lon, el.lat];
    });

    const buildingCandidates = [];
    const landusePolys = [];
    const nameTokens = name
      .toLowerCase()
      .split(/[\s/\-(),]+/)
      .filter((t) => t.length >= 4);

    (data.elements || []).forEach((el) => {
      if (el.type === "way" && el.nodes && el.nodes.length >= 4) {
        const ring = el.nodes.map((nid) => nodes[nid]).filter(Boolean);
        if (ring.length < 4) return;
        if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) {
          ring.push([ring[0][0], ring[0][1]]);
        }

        const tags = el.tags || {};
        const osmName = ((tags.name || "") + " " + (tags.operator || "")).toLowerCase();
        const nameMatch = nameTokens.some((tok) => osmName.includes(tok));
        const inside = pointInRing(lng, lat, ring);
        const { minDist } = ringCentroidAndMinDist(lng, lat, ring);
        const dist = inside ? 0 : minDist;

        if (tags.building || tags.man_made === "storage_tank" || tags.man_made === "works") {
          buildingCandidates.push({ ring, dist, inside, nameMatch, tags });
        } else if (tags.landuse === "industrial" || tags.landuse === "quarry" || tags.landuse === "aquaculture") {
          if (inside || dist <= 120) {
            landusePolys.push({ ring, dist, inside, tags });
          }
        }
      }
    });

    buildingCandidates.sort((a, b) => {
      if (a.nameMatch !== b.nameMatch) return a.nameMatch ? -1 : 1;
      return a.dist - b.dist;
    });

    const selected = [];
    if (!isFacility) {
      buildingCandidates.forEach((b, idx) => {
        if (b.inside || b.nameMatch || (idx === 0 && b.dist <= 55)) {
          selected.push({
            type: "Feature",
            properties: {
              color,
              name,
              subtitle,
              height: (Number(b.tags["building:levels"]) || 5) * 3.8
            },
            geometry: {
              type: "Polygon",
              coordinates: [b.ring]
            }
          });
        }
      });
    } else {
      const primaryLanduse = landusePolys[0];
      buildingCandidates.forEach((b, idx) => {
        const inIndustrial =
          primaryLanduse && pointInRing(b.ring[0][0], b.ring[0][1], primaryLanduse.ring);
        if (b.inside || b.nameMatch || inIndustrial || b.dist <= 120 || (idx === 0 && b.dist <= 160)) {
          selected.push({
            type: "Feature",
            properties: {
              color,
              name,
              subtitle,
              height: (Number(b.tags["building:levels"]) || 4) * 4.0
            },
            geometry: {
              type: "Polygon",
              coordinates: [b.ring]
            }
          });
        }
      });
    }

    return selected;
  }

  function fitBoundsToPoints(coordsLngLat) {
    if (!coordsLngLat || coordsLngLat.length === 0) return;
    if (coordsLngLat.length === 1) {
      map.flyTo({ center: coordsLngLat[0], zoom: 15 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds(coordsLngLat[0], coordsLngLat[0]);
    coordsLngLat.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { padding: 65, maxZoom: 13.5, duration: 900 });
  }

  function showCompanySheet(c, cFacs) {
    const sheet = document.getElementById("inspectorCard");
    const cIntel = c.sftRank ? intelBySftRank[c.sftRank] : null;
    const fundBreakdown =
      c.funds.length > 1
        ? `SPN: ${c.spnMarketValue.toLocaleString()}M · SFT: ${c.sftMarketValue.toLocaleString()}M`
        : `${c.funds[0]} Holding`;

    sheet.innerHTML = `
      <div class="sheet-top">
        <div class="sheet-head-left">
          ${renderLogoHtml(c, "sheet-logo")}
          <div>
            <div class="sheet-kicker">
              <span>#${c.rank} · ${c.sector} · ${c.country}${cIntel && cIntel.ticker ? ` · ${cIntel.ticker}` : ""}</span>
              ${renderFundBadge(c)}
            </div>
            <div class="sheet-title">${c.name}</div>
            <div class="sheet-sub">${c.address}</div>
          </div>
        </div>
        <button class="close-btn" id="closeSheetBtn">&times;</button>
      </div>

      <div class="metrics-strip">
        <div class="metric-item">
          <div class="m-lbl">Market Value</div>
          <div class="m-val">${c.marketValue.toLocaleString()} MNOK</div>
        </div>
        <div class="metric-item">
          <div class="m-lbl">Ownership</div>
          <div class="m-val">${(Number(c.ownershipPercent) || 0).toFixed(2)}%</div>
        </div>
        <div class="metric-item">
          <div class="m-lbl">Fund Allocation</div>
          <div class="m-val" style="font-size:11px;">${fundBreakdown}</div>
        </div>
      </div>

      <div class="sheet-body">
        ${c.hqDescription}
        ${cIntel && cIntel.productionProfile ? `<div style="margin-top:6px;color:#0f172a;">${cIntel.productionProfile}</div>` : ""}
      </div>

      <div class="sheet-actions">
        <button class="action-btn" id="btnZoomHq">Zoom to Building</button>
        ${cFacs.length > 0 ? `<button class="action-btn" id="btnFitAll">Show Network (${cFacs.length + 1})</button>` : ""}
        <a class="action-btn" href="${c.website}" target="_blank" rel="noopener">Website ↗</a>
      </div>

      ${
        cFacs.length > 0
          ? `
        <div class="sub-list-title">Platforms, Farms, Mines, Smelters &amp; Offices (${cFacs.length})</div>
        <div class="sub-list">
          ${cFacs
            .map(
              (f) => `
            <div class="sub-row" data-fac-id="${f.id}">
              <span style="font-weight:500;color:#0f172a;">${f.name}</span>
              <span style="color:#94a3b8;font-size:10.5px;flex-shrink:0;">${f.city}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
    `;

    sheet.classList.add("visible");

    document.getElementById("closeSheetBtn").onclick = () => {
      sheet.classList.remove("visible");
      selectedCompanyRank = null;
      selectedFacilityId = null;
      overpassFeatures = [];
      renderAll();
    };

    document.getElementById("btnZoomHq").onclick = () => {
      map.flyTo({
        center: [c.lng, c.lat],
        zoom: 17.4,
        pitch: document.getElementById("toggle3d").checked ? 55 : 0,
        duration: 800
      });
    };

    const btnFit = document.getElementById("btnFitAll");
    if (btnFit) {
      btnFit.onclick = () => {
        const pts = [[c.lng, c.lat], ...cFacs.map((f) => [f.lng, f.lat])];
        fitBoundsToPoints(pts);
      };
    }

    sheet.querySelectorAll(".sub-row").forEach((el) => {
      el.addEventListener("click", () => selectFacility(el.getAttribute("data-fac-id"), true));
    });
  }

  function showFacilitySheet(f, parent, siblingFacs) {
    const sheet = document.getElementById("inspectorCard");
    sheet.innerHTML = `
      <div class="sheet-top">
        <div class="sheet-head-left">
          ${parent ? renderLogoHtml(parent, "sheet-logo") : ""}
          <div>
            <div class="sheet-kicker">
              <span>${f.facilityType}</span>
              ${parent ? renderFundBadge(parent) : ""}
            </div>
            <div class="sheet-title">${f.name}</div>
            <div class="sheet-sub">${f.address} (${f.city}, ${f.country})</div>
          </div>
        </div>
        <button class="close-btn" id="closeSheetBtn">&times;</button>
      </div>

      <div class="metrics-strip" style="grid-template-columns: 1fr 1fr;">
        <div class="metric-item" style="cursor:pointer;" id="jumpParentBtn">
          <div class="m-lbl">Parent Company</div>
          <div class="m-val" style="color:#2563eb;">#${f.parentRank} ${f.parentName} →</div>
        </div>
        <div class="metric-item">
          <div class="m-lbl">Network Size</div>
          <div class="m-val">${siblingFacs.length + 1} Mapped Sites</div>
        </div>
      </div>

      <div class="sheet-body">${f.description}</div>

      <div class="sheet-actions">
        <button class="action-btn" id="btnZoomFac">Zoom to Site</button>
        ${parent ? `<button class="action-btn" id="btnFitFacNet">Show Full Network</button>` : ""}
        ${parent && parent.website ? `<a class="action-btn" href="${parent.website}" target="_blank" rel="noopener">Website ↗</a>` : ""}
      </div>
    `;

    sheet.classList.add("visible");

    document.getElementById("closeSheetBtn").onclick = () => {
      sheet.classList.remove("visible");
      selectedCompanyRank = null;
      selectedFacilityId = null;
      overpassFeatures = [];
      renderAll();
    };

    document.getElementById("jumpParentBtn").onclick = () => selectCompany(f.parentRank, true);
    document.getElementById("btnZoomFac").onclick = () =>
      map.flyTo({
        center: [f.lng, f.lat],
        zoom: isOffshorePlatformSite(f) ? 16.2 : 17.0,
        pitch: document.getElementById("toggle3d").checked ? 55 : 0,
        duration: 800
      });

    const btnFit = document.getElementById("btnFitFacNet");
    if (btnFit && parent) {
      btnFit.onclick = () => {
        const pts = [[parent.lng, parent.lat], ...siblingFacs.map((s) => [s.lng, s.lat])];
        fitBoundsToPoints(pts);
      };
    }
  }

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
          .setHTML(
            `<div style="font-weight:600">${p.name || ""}</div><div style="opacity:0.8;font-size:10px">${p.subtitle || ""}</div>`
          )
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
          if (rank) selectCompany(rank, true);
        } else if (layerId === "portfolio-facilities-circle" || p.entityType === "facility") {
          const facId = p.id || p.entityId;
          if (facId) selectFacility(facId, true);
        }
      });
    });

    map.on("moveend", () => {
      matchVectorBuildingsToPortfolio();
      updateMapLogoMarkers();
    });

    map.on("idle", () => {
      matchVectorBuildingsToPortfolio();
    });
  }

  function initControls() {
    const sectorSelect = document.getElementById("sectorSelect");
    Object.keys(SECTOR_COLORS).forEach((sec) => {
      const opt = document.createElement("option");
      opt.value = sec;
      opt.textContent = sec;
      sectorSelect.appendChild(opt);
    });

    document.getElementById("searchInput").addEventListener("input", renderAll);
    document.getElementById("fundSelect").addEventListener("change", renderAll);
    document.getElementById("countrySelect").addEventListener("change", (e) => {
      if (e.target.value === "GLOBAL") {
        activeTab = "facilities";
        document.getElementById("tabFacilities").classList.add("active");
        document.getElementById("tabCompanies").classList.remove("active");
      }
      renderAll();
      const { filteredCompanies, filteredFacilities } = getFilteredData();
      const pts =
        e.target.value === "GLOBAL"
          ? filteredFacilities.map((f) => [f.lng, f.lat])
          : [
              ...filteredCompanies.map((c) => [c.lng, c.lat]),
              ...filteredFacilities.map((f) => [f.lng, f.lat])
            ];
      if (pts.length > 0) {
        fitBoundsToPoints(pts);
      }
    });
    document.getElementById("sectorSelect").addEventListener("change", renderAll);

    ["toggleHqs", "toggleFacilities", "toggleLogos", "toggleLines"].forEach((id) => {
      document.getElementById(id).addEventListener("change", renderAll);
    });

    document.getElementById("toggleAllBuildings").addEventListener("change", updateAllBuildingVisibility);

    document.getElementById("toggle3d").addEventListener("change", (e) => {
      updateAllBuildingVisibility();
      map.easeTo({
        pitch: e.target.checked ? 52 : 0,
        duration: 500
      });
    });

    document.getElementById("tabCompanies").addEventListener("click", () => {
      activeTab = "companies";
      document.getElementById("tabCompanies").classList.add("active");
      document.getElementById("tabFacilities").classList.remove("active");
      renderAll();
    });

    document.getElementById("tabFacilities").addEventListener("click", () => {
      activeTab = "facilities";
      document.getElementById("tabFacilities").classList.add("active");
      document.getElementById("tabCompanies").classList.remove("active");
      renderAll();
    });

    document.querySelectorAll(".pill[data-spotlight]").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".pill[data-spotlight]").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeSpotlight = pill.getAttribute("data-spotlight");
        if (activeSpotlight !== "all") {
          document.getElementById("toggleLines").checked = true;
        }
        renderAll();

        const { filteredCompanies, filteredFacilities } = getFilteredData();
        const pts = [
          ...filteredCompanies.map((c) => [c.lng, c.lat]),
          ...filteredFacilities.map((f) => [f.lng, f.lat])
        ];
        if (pts.length > 0) {
          fitBoundsToPoints(pts);
        }
      });
    });

    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-basemap]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const key = btn.getAttribute("data-basemap");
        currentStyleKey = key;

        if (key === "satellite") {
          if (map.getLayer("esri-satellite-layer")) {
            map.setLayoutProperty("esri-satellite-layer", "visibility", "visible");
          }
        } else {
          const targetUrl = STYLE_URLS[key] || STYLE_URLS.positron;
          map.setStyle(targetUrl);
          map.once("styledata", () => {
            setupCustomLayers();
          });
        }
      });
    });

    document.getElementById("btnResetView").addEventListener("click", () => {
      selectedCompanyRank = null;
      selectedFacilityId = null;
      overpassFeatures = [];
      document.getElementById("inspectorCard").classList.remove("visible");
      map.flyTo({ center: [12.5, 61.2], zoom: 4.5, pitch: 0, bearing: 0, duration: 800 });
      renderAll();
    });
  }

  initControls();
  renderAll();

  map.on("load", () => {
    setupCustomLayers();
    bindMapInteractions();
  });
})();
