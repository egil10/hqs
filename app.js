(function () {
  "use strict";

  const SECTOR_COLORS = {
    "Industrials": "#2563eb",
    "Financials": "#0284c7",
    "Information Technology": "#4f46e5",
    "Technology": "#4f46e5",
    "Health Care": "#059669",
    "Consumer Discretionary": "#d97706",
    "Consumer Staples": "#16a34a",
    "Materials": "#b45309",
    "Basic Materials": "#b45309",
    "Real Estate": "#7c3aed",
    "Communication Services": "#db2777",
    "Telecommunications": "#db2777",
    "Energy": "#dc2626",
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

  const SHORT_TYPE_LABEL = {
    "Factory & Manufacturing": "Factory",
    "Mill, Smelter & Mine": "Mine / Mill",
    "R&D, Biotech & Medtech Lab": "R&D / Lab",
    "Offshore, Marine & Energy": "Offshore",
    "Oil & Gas Drilling / Platform": "Oil Rig",
    "Aquaculture & Fishery": "Fish Farm",
    "Data Center, Telecom & Cloud": "Data Center",
    "Filial, Logistics & Subsidiary HQ": "Office / Hub"
  };

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

  // --- Merge SFT (200) + SPN (151) into Unified Companies ---
  const sftRaw = window.HQ_COMPANIES || [];
  const spnRaw = window.SPN_COMPANIES || [];

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

  // Auto-discover all FACILITIES_EXPANSION* arrays + window.EXTRA_FACILITIES
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
      parentRank: parent ? parent.rank : f.parentRank || 1,
      parentName: parent ? parent.name : f.parentName
    };
  });

  // --- Helpers ---
  function formatCompactValue(mnok) {
    const v = Number(mnok) || 0;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}B`;
    return `${Math.round(v)}M`;
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
  let activeTab = "companies";
  let selectedCompanyRank = null;
  let selectedFacilityId = null;
  let is3dEnabled = false;
  let currentBasemap = "liberty";
  let buildingMatchTimer = null;

  // --- Map Initialization ---
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
    offset: 8
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
            name: f.name,
            subtitle: `${f.parentName} · Marine Sea-Cage`,
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
          name: f.name,
          subtitle: `${f.parentName} · Offshore Platform / FPSO`,
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

  // --- Filtering ---
  const NORDIC_COUNTRIES = new Set(["Norge", "Sverige", "Finland", "Danmark", "Island", "Færøyene"]);

  function getFilteredData() {
    const q = document.getElementById("searchInput").value.trim().toLowerCase();
    const regionVal = document.getElementById("countrySelect").value;
    const typeVal = document.getElementById("typeSelect").value;

    const facByRank = {};
    facilities.forEach((f) => {
      if (!facByRank[f.parentRank]) facByRank[f.parentRank] = [];
      facByRank[f.parentRank].push(f);
    });

    const filteredCompanies = companies.filter((c) => {
      if (regionVal === "FUND_SPN" && !c.funds.includes("SPN")) return false;
      if (regionVal === "FUND_SFT" && !c.funds.includes("SFT")) return false;

      const cFacs = facByRank[c.rank] || [];
      if (regionVal === "GLOBAL") {
        const hasGlobal = !NORDIC_COUNTRIES.has(c.country) || cFacs.some((f) => !NORDIC_COUNTRIES.has(f.country));
        if (!hasGlobal) return false;
      } else if (regionVal !== "ALL" && regionVal !== "FUND_SPN" && regionVal !== "FUND_SFT") {
        if (c.country !== regionVal) return false;
      }

      if (typeVal !== "all" && typeVal !== "hqs_only") {
        const hasMatchingFac = cFacs.some((f) => matchesTypeFilter(f, typeVal));
        if (!hasMatchingFac) return false;
      }

      if (q) {
        const matchC =
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q);
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

    const visibleRanks = new Set(filteredCompanies.map((c) => c.rank));

    const filteredFacilities =
      typeVal === "hqs_only"
        ? []
        : facilities.filter((f) => {
            const parent = companyByRank[f.parentRank];
            if (regionVal === "FUND_SPN" && parent && !parent.funds.includes("SPN")) return false;
            if (regionVal === "FUND_SFT" && parent && !parent.funds.includes("SFT")) return false;
            if (regionVal === "GLOBAL" && NORDIC_COUNTRIES.has(f.country)) return false;
            if (
              regionVal !== "ALL" &&
              regionVal !== "GLOBAL" &&
              regionVal !== "FUND_SPN" &&
              regionVal !== "FUND_SFT" &&
              f.country !== regionVal
            ) {
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

  // --- Setup Map Layers ---
  function setupCustomLayers() {
    if (!map.isStyleLoaded()) return;

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
            minzoom: 13,
            paint: {
              "fill-color": "#cbd5e1",
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
          "line-opacity": 0.65,
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

    renderAll();
  }

  // --- Single-Building Exact Matcher (Fast, 1 Building Per Pin, Zero Lag) ---
  function matchVectorBuildingsToPortfolio() {
    if (!map.isStyleLoaded() || !map.getSource("portfolio-buildings")) return;

    const { filteredCompanies, filteredFacilities } = getFilteredData();
    const matchedFeatures = [];
    const bounds = map.getBounds();
    const zoom = map.getZoom();

    // Render offshore platform decks and marine sea-cages when zoomed in (>= 11)
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

    // Match onshore pins strictly to 1 exact building when zoomed in (>= 13.5)
    if (zoom >= 13.5 && map.getLayer("all-buildings-2d")) {
      const visibleEntities = [];

      filteredCompanies.forEach((c) => {
        if (bounds.contains([c.lng, c.lat])) {
          visibleEntities.push({
            lng: c.lng,
            lat: c.lat,
            color: SECTOR_COLORS[c.sector] || "#2563eb",
            name: c.name,
            subtitle: `HQ · ${c.city}`,
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
            name: f.name,
            subtitle: `${f.parentName} · ${SHORT_TYPE_LABEL[f.facilityType] || f.facilityType}`,
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

          // Pick strictly the SINGLE closest/containing building polygon
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
    buildingMatchTimer = setTimeout(matchVectorBuildingsToPortfolio, 90);
  }

  // --- Main Render ---
  function renderAll() {
    const { filteredCompanies, filteredFacilities, facByRank } = getFilteredData();

    document.getElementById("headerSummary").textContent = `${filteredCompanies.length} Companies · ${filteredFacilities.length} Sites`;
    document.getElementById("tabCountCompanies").textContent = filteredCompanies.length;
    document.getElementById("tabCountFacilities").textContent = filteredFacilities.length;

    renderList(filteredCompanies, filteredFacilities, facByRank);

    if (!map.isStyleLoaded() || !map.getSource("portfolio-hqs")) return;

    const hqFeatures = filteredCompanies.map((c) => {
      const color = SECTOR_COLORS[c.sector] || "#2563eb";
      const isSelected = selectedCompanyRank === c.rank;
      return {
        type: "Feature",
        properties: {
          rank: c.rank,
          name: c.name,
          subtitle: `${c.city} · ${formatCompactValue(c.marketValue)} NOK`,
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

    const facFeatures = filteredFacilities.map((f) => {
      const color = FACILITY_COLORS[f.facilityType] || "#059669";
      const isSelected = selectedFacilityId === f.id || selectedCompanyRank === f.parentRank;
      return {
        type: "Feature",
        properties: {
          id: f.id,
          parentRank: f.parentRank,
          name: f.name,
          subtitle: `${f.parentName} · ${f.city}`,
          color,
          strokeWidth: isSelected ? 2.2 : 1.1
        },
        geometry: {
          type: "Point",
          coordinates: [f.lng, f.lat]
        }
      };
    });

    // Only draw connection lines for the currently selected company so the map stays super clean
    const linkFeatures = [];
    if (selectedCompanyRank) {
      const parent = companyByRank[selectedCompanyRank];
      if (parent) {
        const color = SECTOR_COLORS[parent.sector] || "#2563eb";
        filteredFacilities
          .filter((f) => f.parentRank === selectedCompanyRank)
          .forEach((f) => {
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

    scheduleBuildingMatch();
  }

  function renderList(filteredCompanies, filteredFacilities, facByRank) {
    const listEl = document.getElementById("entityList");

    if (activeTab === "companies") {
      listEl.innerHTML = filteredCompanies
        .map((c) => {
          const siteCount = (facByRank[c.rank] || []).length;
          const isSelected = selectedCompanyRank === c.rank && !selectedFacilityId;
          return `
            <div class="list-row ${isSelected ? "selected" : ""}" data-rank="${c.rank}">
              <div class="row-left">
                ${renderLogoHtml(c)}
                <div class="row-text">
                  <div class="row-name">${c.name}</div>
                  <div class="row-sub">${c.city}${siteCount > 0 ? ` · ${siteCount} sites` : ""}</div>
                </div>
              </div>
              <div class="row-meta">${formatCompactValue(c.marketValue)}</div>
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
          const shortType = SHORT_TYPE_LABEL[f.facilityType] || "Site";
          return `
            <div class="list-row ${isSelected ? "selected" : ""}" data-fac-id="${f.id}">
              <div class="row-left">
                ${renderLogoHtml(parent)}
                <div class="row-text">
                  <div class="row-name">${f.name}</div>
                  <div class="row-sub">${f.parentName} · ${f.city}</div>
                </div>
              </div>
              <div class="row-meta">${shortType}</div>
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

  // --- Selection & Minimal Inspector Card ---
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
        zoom: 16,
        pitch: is3dEnabled ? 50 : 0,
        duration: 700
      });
    }
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
        zoom: isOffshorePlatformSite(f) ? 14.5 : 15.8,
        pitch: is3dEnabled ? 50 : 0,
        duration: 700
      });
    }
  }

  function showCompanySheet(c, cFacs) {
    const sheet = document.getElementById("inspectorCard");
    const fundsText = c.funds.join("+");

    sheet.innerHTML = `
      <div class="sheet-top">
        <div class="sheet-head-left">
          ${renderLogoHtml(c)}
          <div>
            <div class="sheet-title">${c.name}</div>
            <div class="sheet-sub">${c.city}, ${c.country} · ${fundsText} · ${c.marketValue.toLocaleString()} MNOK</div>
          </div>
        </div>
        <button class="close-btn" id="closeSheetBtn">&times;</button>
      </div>

      <div class="sheet-body">${c.hqDescription}</div>

      <div class="sheet-actions">
        <button class="action-btn" id="btnZoomHq">Building</button>
        ${cFacs.length > 0 ? `<button class="action-btn" id="btnFitAll">All Sites (${cFacs.length + 1})</button>` : ""}
        <a class="action-btn" href="${c.website}" target="_blank" rel="noopener">Website ↗</a>
      </div>

      ${
        cFacs.length > 0
          ? `<div class="sub-list">
              ${cFacs
                .map(
                  (f) => `
                  <div class="sub-row" data-fac-id="${f.id}">
                    <span style="color:#0f172a;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.name}</span>
                    <span style="color:#94a3b8;flex-shrink:0;">${f.city}</span>
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
      map.flyTo({ center: [c.lng, c.lat], zoom: 17, pitch: is3dEnabled ? 52 : 0, duration: 600 });
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
    sheet.innerHTML = `
      <div class="sheet-top">
        <div class="sheet-head-left">
          ${renderLogoHtml(parent)}
          <div>
            <div class="sheet-title">${f.name}</div>
            <div class="sheet-sub">${f.parentName} · ${f.city}, ${f.country}</div>
          </div>
        </div>
        <button class="close-btn" id="closeSheetBtn">&times;</button>
      </div>

      <div class="sheet-body">${f.description}</div>

      <div class="sheet-actions">
        <button class="action-btn" id="btnZoomFac">Zoom In</button>
        ${parent ? `<button class="action-btn" id="btnJumpHq">HQ (${parent.city})</button>` : ""}
        ${parent ? `<button class="action-btn" id="btnFitFacNet">Network (${siblingFacs.length + 1})</button>` : ""}
      </div>
    `;

    sheet.classList.add("visible");

    document.getElementById("closeSheetBtn").onclick = clearSelection;
    document.getElementById("btnZoomFac").onclick = () => {
      map.flyTo({ center: [f.lng, f.lat], zoom: 16.8, pitch: is3dEnabled ? 52 : 0, duration: 600 });
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
    document.getElementById("countrySelect").value = "ALL";
    document.getElementById("typeSelect").value = "all";
    selectedCompanyRank = null;
    selectedFacilityId = null;
    is3dEnabled = false;
    document.getElementById("btnToggle3d").classList.remove("active");
    document.getElementById("inspectorCard").classList.remove("visible");
    if (map.getLayer("all-buildings-3d")) map.setLayoutProperty("all-buildings-3d", "visibility", "none");
    if (map.getLayer("portfolio-buildings-3d")) map.setLayoutProperty("portfolio-buildings-3d", "visibility", "none");
    renderAll();
    map.flyTo({ center: [11.5, 61.5], zoom: 4.4, pitch: 0, bearing: 0, duration: 650 });
  }

  function fitBoundsToPoints(coordsLngLat) {
    if (!coordsLngLat || coordsLngLat.length === 0) return;
    if (coordsLngLat.length === 1) {
      map.flyTo({ center: coordsLngLat[0], zoom: 15, duration: 650 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds(coordsLngLat[0], coordsLngLat[0]);
    coordsLngLat.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { padding: 60, maxZoom: 13.5, duration: 700 });
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
          .setHTML(`<strong>${p.name || ""}</strong><div style="opacity:0.8">${p.subtitle || ""}</div>`)
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

    map.on("moveend", scheduleBuildingMatch);
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
      if (pts.length > 0) fitBoundsToPoints(pts);
    });

    document.getElementById("typeSelect").addEventListener("change", (e) => {
      const val = e.target.value;
      if (val !== "all" && val !== "hqs_only") {
        activeTab = "facilities";
        document.getElementById("tabFacilities").classList.add("active");
        document.getElementById("tabCompanies").classList.remove("active");
      } else if (val === "hqs_only") {
        activeTab = "companies";
        document.getElementById("tabCompanies").classList.add("active");
        document.getElementById("tabFacilities").classList.remove("active");
      }
      renderAll();
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

    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-basemap]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentBasemap = btn.getAttribute("data-basemap");
        if (map.getLayer("esri-satellite-layer")) {
          map.setLayoutProperty(
            "esri-satellite-layer",
            "visibility",
            currentBasemap === "satellite" ? "visible" : "none"
          );
        }
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

  initControls();
  renderAll();

  map.on("load", () => {
    setupCustomLayers();
    bindMapInteractions();
  });
})();
