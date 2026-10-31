"""Geocode a research_<G>.json file and emit data/facilities_claude_deepdive_<G>.js.

usage: python3 research/claude/pipeline.py <G>   (run from repo root)
Geocoding: Nominatim (1 req / 1.2 s, backs off on 429); results cached in research/claude/geocache.json.
Coordinates are only accepted when the OSM hit is named after the company/site (or is an exact
address/house match) and lies within 25 km of the researcher's approximate position.
"""
import json, sys, time, math, subprocess, urllib.parse, re, os, glob

G = sys.argv[1]
D = "research/claude"
items = json.load(open(f"{D}/research_{G}.json"))
# agents shared a scratch helper for a while and some rows landed in the wrong group's file;
# keep only companies that belong to this group (the owning group's file has its own copy)
if os.path.exists(f"{D}/group_{G}.txt"):
    allowed = {re.sub(r"\s*\([^()]*existing sites\)$", "", l.strip()) for l in open(f"{D}/group_{G}.txt") if l.strip()}
    allowed |= {re.sub(r"\s*\(.*$", "", a) for a in allowed}
    items = [it for it in items if it.get("parentName") in allowed]
CACHE_F = f"{D}/geocache.json"
cache = json.load(open(CACHE_F)) if os.path.exists(CACHE_F) else {}

TYPES = {"Factory & Manufacturing", "Mill, Smelter & Mine", "Offshore, Marine & Energy", "Aquaculture & Fishery",
         "Data Center, Telecom & Cloud", "R&D, Biotech & Medtech Lab", "Filial, Logistics & Subsidiary HQ"}
RANK = {"landuse": 0, "man_made": 0, "power": 0, "industrial": 0, "building": 1, "office": 1, "craft": 1,
        "amenity": 2, "healthcare": 2, "aeroway": 2, "shop": 3, "tourism": 3}
BAD_TYPES = {"parking", "bus_stop", "defibrillator", "fast_food", "cafe", "pharmacy", "kiosk", "disc_golf_course"}


def hav(a, b, c, d):
    p = math.radians
    x = math.sin(p(c - a) / 2) ** 2 + math.cos(p(a)) * math.cos(p(c)) * math.sin(p(d - b) / 2) ** 2
    return 12742 * math.asin(math.sqrt(x))


def norm(s):
    s = s.lower()
    for a, b in (("ä", "a"), ("ö", "o"), ("å", "a"), ("ø", "o"), ("æ", "ae"), ("ü", "u"), ("é", "e")):
        s = s.replace(a, b)
    return re.sub(r"[^a-z0-9]", "", s)


def search(q):
    if q in cache:
        return cache[q]
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode({"q": q, "format": "json", "limit": 6})
    d = []
    for _ in range(4):
        r = subprocess.run(["curl", "-s", "-m", "30", "-w", "\n%{http_code}", url, "-H",
                            "User-Agent: HQsMapper/1.0 (github.com/egil10/hqs)"], capture_output=True, text=True).stdout
        body, _, code = r.rpartition("\n")
        if code == "200":
            try:
                d = json.loads(body)
            except ValueError:
                d = []
            break
        time.sleep(60 if code == "429" else 5)
    time.sleep(1.2)
    cache[q] = [{k: x.get(k) for k in ("lat", "lon", "class", "type", "name", "display_name")} for x in d]
    json.dump(cache, open(CACHE_F, "w"), ensure_ascii=False)
    return cache[q]


STOP = {"plant", "factory", "site", "center", "centre", "office", "group", "holding", "campus", "the", "and"}


def geocode(it):
    if it.get("coordsExact") and it.get("approxLat") is not None:
        return it["approxLat"], it["approxLng"], "source-exact"
    if it.get("approxLat") is None:
        return None
    words = lambda txt, n: [norm(t) for t in re.split(r"[\s/()&,.-]+", txt) if len(norm(t)) >= n and norm(t) not in STOP]
    ptoks = words(it["parentName"], 3)[:4]
    btoks = words(it["name"], 4)[:1]  # leading brand word of the site name, e.g. "Racal", "Hemtex"
    best = None
    for q in (it.get("geoQueries") or [])[:4]:
        isaddr = bool(re.search(r"\d", q))
        for r in search(q):
            cls, typ = r["class"], r["type"]
            if typ in BAD_TYPES or cls in ("highway", "railway", "boundary", "emergency", "leisure"):
                continue
            if cls == "place" and not (isaddr and typ == "house"):
                continue
            rank = RANK.get(cls, 3 if cls != "place" else 2)
            lat, lng = float(r["lat"]), float(r["lon"])
            dist = hav(it["approxLat"], it["approxLng"], lat, lng)
            if dist > 25:
                continue
            if cls in ("shop", "tourism"):
                continue
            if cls == "amenity" and typ not in ("hospital", "clinic", "university", "college", "research_institute"):
                continue
            dn = norm((r.get("name") or "") + " " + r["display_name"].split(",")[0])
            named = any(t in dn for t in ptoks) or (
                cls in ("landuse", "man_made", "power", "industrial", "building", "office") and any(t in dn for t in btoks))
            if cls == "amenity" and not any(t in dn for t in ptoks):
                continue
            exact_addr = isaddr and (typ == "house" or cls == "building")
            if not named and not exact_addr:
                continue
            score = (rank if named else rank + 1, dist)
            if best is None or score < best[0]:
                best = (score, lat, lng, f"{q} -> {cls}/{typ} {r['display_name'][:70]}")
        if best and best[0][0] <= 1:
            break
    return (best[1], best[2], best[3]) if best else None


# existing sites (other agents + earlier batches) for de-duplication
EX = []
for f in glob.glob("data/facilities*.js"):
    if f.endswith(f"deepdive_{G.lower()}.js"):
        continue
    for m in re.finditer(r'"?parentName"?:\s*"([^"]+)".*?"?lat"?:\s*(-?[\d.]+),?\s*"?lng"?:\s*(-?[\d.]+)', open(f).read(), re.S):
        EX.append((m[1], float(m[2]), float(m[3])))


def is_dup(parent, lat, lng):
    k = norm(parent)[:5]
    return any(norm(p)[:5] == k and hav(lat, lng, b, c) < 0.6 for p, b, c in EX)


out, log = [], []
for it in items:
    if it.get("facilityType") not in TYPES or not it.get("parentName") or not it.get("name"):
        log.append(f"INVALID {it.get('name')}")
        continue
    g = geocode(it)
    if not g:
        log.append(f"NOGEO   {it['parentName']} | {it['name']}")
        continue
    lat, lng, how = g
    if is_dup(it["parentName"], lat, lng):
        log.append(f"DUP     {it['parentName']} | {it['name']}")
        continue
    EX.append((it["parentName"], lat, lng))
    rad = int(min(350, max(160, it.get("footprintRadiusMeters") or 220)))
    out.append(dict(parentName=it["parentName"], name=it["name"], facilityType=it["facilityType"], city=it.get("city", ""),
                    country=it.get("country", ""), lat=round(lat, 5), lng=round(lng, 5), address=it.get("address", ""),
                    footprintRadiusMeters=rad, description=it.get("description", "")))
    log.append(f"OK      {it['parentName']} | {it['name']} | {how}")

order = ["id", "parentName", "name", "facilityType", "city", "country", "lat", "lng", "address", "footprintRadiusMeters", "description"]
lines = [f"// Claude deep-dive batch {G}: researched sites for smaller SPN/SFT holdings, OSM/Nominatim-geocoded",
         "window.EXTRA_FACILITIES = (window.EXTRA_FACILITIES || []).concat(["]
for i, r in enumerate(out, 1):
    r["id"] = f"fac-claude-dd{G.lower()}-{i:03d}"
    lines.append("  {\n" + ",\n".join(f"    {k}: {json.dumps(r[k], ensure_ascii=False)}" for k in order) + "\n  },")
if out:
    lines[-1] = lines[-1].rstrip(",")
lines.append("]);\n")
open(f"data/facilities_claude_deepdive_{G.lower()}.js", "w").write("\n".join(lines))
open(f"{D}/geolog_{G}.txt", "w").write("\n".join(log) + "\n")
print(f"{G}: {len(out)} written / {len(items)} researched")
print("\n".join(l for l in log if not l.startswith("OK")))
