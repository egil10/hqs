// Nordic Portfolio Atlas — Minimal Light Edition
(function () {
  const companies = [
    ...(window.HQ_COMPANIES_PART1 || []),
    ...(window.HQ_COMPANIES_PART2 || [])
  ].sort((a, b) => a.rank - b.rank);

  const facilities = [
    ...(window.FACILITIES_EXPANSION || []),
    ...(window.FACILITIES_EXPANSION_PART2 || []),
    ...(window.FACILITIES_EXPANSION_PART3 || []),
    ...(window.FACILITIES_EXPANSION_PART4 || [])
  ];

  const intel = (window.COMPANY_INTELLIGENCE && window.COMPANY_INTELLIGENCE.byRank) || {};

  // Refined Scandinavian Palette for Light Map
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
    "Aquaculture & Fishery": "#0284c7",
    "Factory & Manufacturing": "#d97706",
    "Mill, Smelter & Mine": "#e11d48",
    "Offshore, Marine & Energy": "#ca8a04",
    "R&D, Biotech & Medtech Lab": "#9333ea",
    "Filial, Logistics & Subsidiary HQ": "#059669"
  };

  // Initialize Map (Unblocked CARTO Positron Light OpenStreetMap tiles by default)
  const map = L.map("map", {
    center: [61.0, 13.5],
    zoom: 5,
    zoomControl: false,
    preferCanvas: true
  });

  L.control.zoom({ position: "bottomleft" }).addTo(map);

  // 100% file:// compatible OpenStreetMap tile providers (never blocked by Referer policy)
  const tileLayers = {
    light: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap &copy; CARTO"
    }),
    street: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap &copy; CARTO"
    }),
    satellite: L.layerGroup([
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "&copy; Esri"
      }),
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
        opacity: 0.85
      })
    ])
  };

  let currentBaseLayer = tileLayers.light;
  currentBaseLayer.addTo(map);

  const hqPolygonLayer = L.layerGroup().addTo(map);
  const hqMarkerLayer = L.layerGroup().addTo(map);
  const facilityPolygonLayer = L.layerGroup().addTo(map);
  const facilityMarkerLayer = L.layerGroup().addTo(map);
  const connectionLineLayer = L.layerGroup().addTo(map);
  const liveOsmBuildingLayer = L.layerGroup().addTo(map);

  let activeTab = "companies";
  let activeSpotlight = "all";
  let selectedCompanyRank = null;
  let selectedFacilityId = null;
  const overpassCache = new Map();

  const FISH_COMPANY_RANKS = new Set([90, 192, 173, 157, 151, 63, 153, 106]);

  // Architectural Complex Footprint Generator
  function createComplexPolygons(lat, lng, radiusMeters, seed, complexType) {
    const latRad = (lat * Math.PI) / 180;
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos(latRad);
    const dLat = (m) => m / mPerDegLat;
    const dLng = (m) => m / mPerDegLng;

    const angle = ((seed * 37) % 180) * (Math.PI / 180);
    const rot = (x, y) => {
      const rx = x * Math.cos(angle) - y * Math.sin(angle);
      const ry = x * Math.sin(angle) + y * Math.cos(angle);
      return [lat + dLat(ry), lng + dLng(rx)];
    };

    const circlePoly = (cx, cy, r, pts = 12) => {
      const arr = [];
      for (let i = 0; i < pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        arr.push(rot(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
      }
      return arr;
    };

    const r = radiusMeters || 65;

    if (complexType === "Aquaculture & Fishery") {
      const mainHall = [
        rot(-r * 0.9, -r * 0.6),
        rot(r * 0.1, -r * 0.6),
        rot(r * 0.1, r * 0.6),
        rot(-r * 0.9, r * 0.6)
      ];
      return [
        mainHall,
        circlePoly(r * 0.45, -r * 0.42, r * 0.19),
        circlePoly(r * 0.88, -r * 0.42, r * 0.19),
        circlePoly(r * 0.45, 0, r * 0.19),
        circlePoly(r * 0.88, 0, r * 0.19),
        circlePoly(r * 0.45, r * 0.42, r * 0.19),
        circlePoly(r * 0.88, r * 0.42, r * 0.19)
      ];
    } else if (complexType === "Mill, Smelter & Mine") {
      return [
        [rot(-r, -r * 0.65), rot(r * 0.35, -r * 0.65), rot(r * 0.35, -r * 0.08), rot(-r, -r * 0.08)],
        [rot(-r, r * 0.08), rot(r * 0.55, r * 0.08), rot(r * 0.55, r * 0.65), rot(-r, r * 0.65)],
        circlePoly(r * 0.72, -r * 0.36, r * 0.24),
        circlePoly(r * 0.85, r * 0.36, r * 0.2)
      ];
    } else if (complexType === "U" || complexType === "Factory & Manufacturing") {
      return [[
        rot(-r, -r * 0.75), rot(r, -r * 0.75), rot(r, r * 0.75), rot(r * 0.45, r * 0.75),
        rot(r * 0.45, -r * 0.2), rot(-r * 0.45, -r * 0.2), rot(-r * 0.45, r * 0.75), rot(-r, r * 0.75)
      ]];
    } else if (complexType === "L") {
      return [[
        rot(-r, -r * 0.7), rot(r, -r * 0.7), rot(r, -r * 0.1),
        rot(-r * 0.2, -r * 0.1), rot(-r * 0.2, r * 0.8), rot(-r, r * 0.8)
      ]];
    }
    return [[rot(-r, -r * 0.65), rot(r, -r * 0.65), rot(r, r * 0.65), rot(-r, r * 0.65)]];
  }

  function getFilteredData() {
    const q = (document.getElementById("searchInput").value || "").trim().toLowerCase();
    const countryFilter = document.getElementById("countrySelect").value;
    const sectorFilter = document.getElementById("sectorSelect").value;

    const facByRank = {};
    facilities.forEach((f) => {
      if (!facByRank[f.parentRank]) facByRank[f.parentRank] = [];
      facByRank[f.parentRank].push(f);
    });

    const filteredCompanies = companies.filter((c) => {
      if (countryFilter !== "ALL" && c.country !== countryFilter) return false;
      if (sectorFilter !== "ALL" && c.sector !== sectorFilter) return false;

      const cFacs = facByRank[c.rank] || [];
      const cIntel = intel[c.rank];

      if (activeSpotlight === "fish" && !FISH_COMPANY_RANKS.has(c.rank)) return false;
      if (activeSpotlight === "factories" && !cFacs.some((f) => f.facilityType === "Factory & Manufacturing") && c.sector !== "Industri") return false;
      if (activeSpotlight === "mills" && !cFacs.some((f) => f.facilityType === "Mill, Smelter & Mine") && c.sector !== "Materialer") return false;
      if (activeSpotlight === "offshore" && !cFacs.some((f) => f.facilityType === "Offshore, Marine & Energy") && c.sector !== "Energi" && c.sector !== "Forsyning") return false;
      if (activeSpotlight === "pharma" && !cFacs.some((f) => f.facilityType === "R&D, Biotech & Medtech Lab") && c.sector !== "Helse") return false;

      if (q) {
        const matchC =
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.hqDescription.toLowerCase().includes(q) ||
          (cIntel && cIntel.ticker && cIntel.ticker.toLowerCase().includes(q));
        const matchF = cFacs.some(
          (f) => f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
        );
        if (!matchC && !matchF) return false;
      }
      return true;
    });

    const visibleRanks = new Set(filteredCompanies.map((c) => c.rank));

    const filteredFacilities = facilities.filter((f) => {
      if (countryFilter !== "ALL" && f.country !== countryFilter) return false;
      if (activeSpotlight === "fish" && f.facilityType !== "Aquaculture & Fishery" && !FISH_COMPANY_RANKS.has(f.parentRank)) return false;
      if (activeSpotlight === "factories" && f.facilityType !== "Factory & Manufacturing") return false;
      if (activeSpotlight === "mills" && f.facilityType !== "Mill, Smelter & Mine") return false;
      if (activeSpotlight === "offshore" && f.facilityType !== "Offshore, Marine & Energy") return false;
      if (activeSpotlight === "pharma" && f.facilityType !== "R&D, Biotech & Medtech Lab") return false;

      if (q) {
        const matchSelf =
          f.name.toLowerCase().includes(q) ||
          f.parentName.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q);
        if (!matchSelf && !visibleRanks.has(f.parentRank)) return false;
      } else if (sectorFilter !== "ALL" && !visibleRanks.has(f.parentRank)) {
        return false;
      }
      return true;
    });

    return { filteredCompanies, filteredFacilities, facByRank };
  }

  function renderAll() {
    const showHqs = document.getElementById("toggleHqs").checked;
    const showFacilities = document.getElementById("toggleFacilities").checked;
    const showPolygons = document.getElementById("togglePolygons").checked;
    const showLines = document.getElementById("toggleLines").checked;

    const { filteredCompanies, filteredFacilities, facByRank } = getFilteredData();

    hqPolygonLayer.clearLayers();
    hqMarkerLayer.clearLayers();
    facilityPolygonLayer.clearLayers();
    facilityMarkerLayer.clearLayers();
    connectionLineLayer.clearLayers();

    document.getElementById("headerSummary").textContent = `${filteredCompanies.length} HQs · ${filteredFacilities.length} Sites`;
    document.getElementById("tabCountCompanies").textContent = filteredCompanies.length;
    document.getElementById("tabCountFacilities").textContent = filteredFacilities.length;

    const companyByRank = {};
    companies.forEach((c) => (companyByRank[c.rank] = c));

    if (showHqs) {
      filteredCompanies.forEach((c) => {
        const color = SECTOR_COLORS[c.sector] || "#2563eb";
        const isSelected = selectedCompanyRank === c.rank;
        const radiusMeters = Math.max(45, Math.min(130, 40 + Math.sqrt(c.marketValue) * 3.5));

        if (showPolygons) {
          const shape = c.rank % 3 === 0 ? "L" : c.rank % 3 === 1 ? "U" : "R";
          const multiRings = createComplexPolygons(c.lat, c.lng, radiusMeters, c.rank, shape);
          multiRings.forEach((ring) => {
            const poly = L.polygon(ring, {
              color: isSelected ? "#0f172a" : color,
              weight: isSelected ? 2.5 : 1.5,
              fillColor: color,
              fillOpacity: isSelected ? 0.65 : 0.35
            });
            poly.on("click", () => selectCompany(c.rank, true));
            poly.addTo(hqPolygonLayer);
          });
        }

        const r = Math.max(5, Math.min(12, 4.5 + Math.sqrt(c.marketValue) * 0.35));
        const marker = L.circleMarker([c.lat, c.lng], {
          radius: isSelected ? r + 3 : r,
          color: "#ffffff",
          weight: isSelected ? 2.5 : 1.5,
          fillColor: color,
          fillOpacity: 0.95
        });

        marker.bindTooltip(`${c.name} · ${c.city} (${c.marketValue}M)`, { direction: "top", offset: [0, -6] });
        marker.on("click", () => selectCompany(c.rank, true));
        marker.addTo(hqMarkerLayer);
      });
    }

    if (showFacilities) {
      filteredFacilities.forEach((f, idx) => {
        const color = FACILITY_COLORS[f.facilityType] || "#059669";
        const isSelected = selectedFacilityId === f.id || selectedCompanyRank === f.parentRank;
        const fpRadius = f.footprintRadiusMeters || 140;

        if (showPolygons) {
          const multiRings = createComplexPolygons(f.lat, f.lng, fpRadius, idx + 100, f.facilityType);
          multiRings.forEach((ring) => {
            const poly = L.polygon(ring, {
              color: isSelected ? "#0f172a" : color,
              weight: isSelected ? 2 : 1.2,
              fillColor: color,
              fillOpacity: isSelected ? 0.6 : 0.35
            });
            poly.on("click", () => selectFacility(f.id, true));
            poly.addTo(facilityPolygonLayer);
          });
        }

        const facMarker = L.circleMarker([f.lat, f.lng], {
          radius: isSelected ? 7 : 5,
          color: "#0f172a",
          weight: isSelected ? 2 : 1,
          fillColor: "#ffffff",
          fillOpacity: 1
        });

        facMarker.bindTooltip(`${f.name} (${f.parentName})`, { direction: "top", offset: [0, -6] });
        facMarker.on("click", () => selectFacility(f.id, true));
        facMarker.addTo(facilityMarkerLayer);

        const parent = companyByRank[f.parentRank];
        if (parent && (showLines || selectedCompanyRank === f.parentRank || selectedFacilityId === f.id)) {
          const active = selectedCompanyRank === f.parentRank || selectedFacilityId === f.id;
          L.polyline(
            [
              [parent.lat, parent.lng],
              [f.lat, f.lng]
            ],
            {
              color: active ? "#0f172a" : "#94a3b8",
              weight: active ? 1.8 : 1,
              opacity: active ? 0.8 : 0.4,
              dashArray: "4, 4"
            }
          ).addTo(connectionLineLayer);
        }
      });
    }

    renderSidebarList(filteredCompanies, filteredFacilities, facByRank);
  }

  function renderSidebarList(filteredCompanies, filteredFacilities, facByRank) {
    const container = document.getElementById("entityList");
    container.innerHTML = "";

    if (activeTab === "companies") {
      filteredCompanies.forEach((c) => {
        const color = SECTOR_COLORS[c.sector] || "#2563eb";
        const cFacs = facByRank[c.rank] || [];
        const row = document.createElement("div");
        row.className = `list-row ${selectedCompanyRank === c.rank ? "selected" : ""}`;
        row.innerHTML = `
          <div class="row-primary">
            <div class="row-name-wrap">
              <span class="dot" style="background:${color}"></span>
              <span class="row-rank">${c.rank}.</span>
              <span class="row-name">${c.name}</span>
            </div>
            <span class="row-value">${c.marketValue}M</span>
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
        const color = FACILITY_COLORS[f.facilityType] || "#059669";
        const row = document.createElement("div");
        row.className = `list-row ${selectedFacilityId === f.id ? "selected" : ""}`;
        row.innerHTML = `
          <div class="row-primary">
            <div class="row-name-wrap">
              <span class="dot" style="background:${color}"></span>
              <span class="row-name">${f.name}</span>
            </div>
          </div>
          <div class="row-secondary">
            <span>${f.parentName} · ${f.city}, ${f.country}</span>
            <span class="site-tag">${f.facilityType.split(" ")[0]}</span>
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
    const c = companies.find((item) => item.rank === rank);
    if (!c) return;

    const cFacs = facilities.filter((f) => f.parentRank === rank);
    renderAll();
    showCompanySheet(c, cFacs);

    if (flyTo) {
      map.flyTo([c.lat, c.lng], 16, { duration: 0.9 });
    }
    fetchRealOsmBuildingsAround(c.lat, c.lng, 220, SECTOR_COLORS[c.sector] || "#2563eb", c.name);
  }

  function selectFacility(facId, flyTo = true) {
    const f = facilities.find((item) => item.id === facId);
    if (!f) return;
    selectedFacilityId = facId;
    selectedCompanyRank = f.parentRank;

    const parent = companies.find((c) => c.rank === f.parentRank);
    const siblingFacs = facilities.filter((item) => item.parentRank === f.parentRank);
    renderAll();
    showFacilitySheet(f, parent, siblingFacs);

    if (flyTo) {
      map.flyTo([f.lat, f.lng], 16, { duration: 0.9 });
    }
    const color = FACILITY_COLORS[f.facilityType] || "#059669";
    fetchRealOsmBuildingsAround(f.lat, f.lng, Math.max(250, f.footprintRadiusMeters * 1.3), color, f.name);
  }

  function showCompanySheet(c, cFacs) {
    const sheet = document.getElementById("inspectorCard");
    const cIntel = intel[c.rank];

    sheet.innerHTML = `
      <div class="sheet-top">
        <div>
          <div class="sheet-kicker">#${c.rank} · ${c.sector} · ${c.country}${cIntel && cIntel.ticker ? ` · ${cIntel.ticker}` : ""}</div>
          <div class="sheet-title">${c.name}</div>
          <div class="sheet-sub">${c.address}</div>
        </div>
        <button class="close-btn" id="closeSheetBtn">&times;</button>
      </div>

      <div class="metrics-strip">
        <div class="metric-item">
          <div class="m-lbl">Market Value</div>
          <div class="m-val">${c.marketValue} MNOK</div>
        </div>
        <div class="metric-item">
          <div class="m-lbl">Ownership</div>
          <div class="m-val">${(Number(c.ownershipPercent) || 0).toFixed(2)}%</div>
        </div>
        <div class="metric-item">
          <div class="m-lbl">Portfolio Weight</div>
          <div class="m-val">${(Number(c.percentOfFund) || 0).toFixed(2)}%</div>
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
        <div class="sub-list-title">Filials &amp; Production Facilities (${cFacs.length})</div>
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
      renderAll();
    };

    document.getElementById("btnZoomHq").onclick = () => {
      map.flyTo([c.lat, c.lng], 17, { duration: 0.8 });
    };

    const btnFit = document.getElementById("btnFitAll");
    if (btnFit) {
      btnFit.onclick = () => {
        const pts = [[c.lat, c.lng], ...cFacs.map((f) => [f.lat, f.lng])];
        map.fitBounds(pts, { padding: [50, 50] });
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
        <div>
          <div class="sheet-kicker">${f.facilityType}</div>
          <div class="sheet-title">${f.name}</div>
          <div class="sheet-sub">${f.address} (${f.city}, ${f.country})</div>
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
        <button class="action-btn" id="btnZoomFac">Zoom to Facility</button>
        ${parent ? `<button class="action-btn" id="btnFitFacNet">Show Full Network</button>` : ""}
      </div>
    `;

    sheet.classList.add("visible");

    document.getElementById("closeSheetBtn").onclick = () => {
      sheet.classList.remove("visible");
      selectedCompanyRank = null;
      selectedFacilityId = null;
      renderAll();
    };

    document.getElementById("jumpParentBtn").onclick = () => selectCompany(f.parentRank, true);
    document.getElementById("btnZoomFac").onclick = () => map.flyTo([f.lat, f.lng], 17, { duration: 0.8 });

    const btnFit = document.getElementById("btnFitFacNet");
    if (btnFit && parent) {
      btnFit.onclick = () => {
        const pts = [[parent.lat, parent.lng], ...siblingFacs.map((s) => [s.lat, s.lng])];
        map.fitBounds(pts, { padding: [50, 50] });
      };
    }
  }

  // Resilient Multi-Mirror Overpass Building Footprint Loader (with in-memory cache)
  async function fetchRealOsmBuildingsAround(lat, lng, radiusMeters, highlightColor, labelName) {
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    if (overpassCache.has(cacheKey)) {
      renderOsmPolygons(overpassCache.get(cacheKey), highlightColor, labelName);
      return;
    }

    const query = `[out:json][timeout:8];(way["building"](around:${radiusMeters},${lat},${lng});way["industrial"](around:${radiusMeters},${lat},${lng});way["man_made"="works"](around:${radiusMeters},${lat},${lng}););out body;>;out skel qt;`;
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
        overpassCache.set(cacheKey, data);
        renderOsmPolygons(data, highlightColor, labelName);
        return;
      } catch (e) {
        // Fallback to next mirror silently
      }
    }
  }

  function renderOsmPolygons(data, highlightColor, labelName) {
    const nodes = {};
    (data.elements || []).forEach((el) => {
      if (el.type === "node") nodes[el.id] = [el.lat, el.lon];
    });

    (data.elements || []).forEach((el) => {
      if (el.type === "way" && el.nodes && el.nodes.length >= 3) {
        const coords = el.nodes.map((nid) => nodes[nid]).filter(Boolean);
        if (coords.length >= 3) {
          L.polygon(coords, {
            color: "#0f172a",
            weight: 1.5,
            fillColor: highlightColor,
            fillOpacity: 0.65
          })
            .bindTooltip(labelName)
            .addTo(liveOsmBuildingLayer);
        }
      }
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
    document.getElementById("countrySelect").addEventListener("change", renderAll);
    document.getElementById("sectorSelect").addEventListener("change", renderAll);

    ["toggleHqs", "toggleFacilities", "togglePolygons", "toggleLines"].forEach((id) => {
      document.getElementById(id).addEventListener("change", renderAll);
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
          ...filteredCompanies.map((c) => [c.lat, c.lng]),
          ...filteredFacilities.map((f) => [f.lat, f.lng])
        ];
        if (pts.length > 0) {
          map.fitBounds(pts, { padding: [40, 40], maxZoom: 12 });
        }
      });
    });

    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-basemap]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const key = btn.getAttribute("data-basemap");
        if (tileLayers[key]) {
          map.removeLayer(currentBaseLayer);
          currentBaseLayer = tileLayers[key];
          currentBaseLayer.addTo(map);
        }
      });
    });

    document.getElementById("btnResetView").addEventListener("click", () => {
      selectedCompanyRank = null;
      selectedFacilityId = null;
      liveOsmBuildingLayer.clearLayers();
      document.getElementById("inspectorCard").classList.remove("visible");
      map.flyTo([61.0, 13.5], 5, { duration: 0.8 });
      renderAll();
    });
  }

  initControls();
  renderAll();
})();
