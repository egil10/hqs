"""Emit data/facilities_grok_batch4.js from research/grok/research_G*.json.

Only rows with coordsExact true are written. Nominatim is intentionally not called
(Claude is using it). Un-exact rows stay in the JSON for a later geocode pass.

Dedup: same parent (normalized) within 0.6 km of any existing facilities*.js pin,
excluding this output file.
"""
import glob, hashlib, json, math, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
OUT = "data/facilities_grok_batch4.js"
TYPES = {
    "Factory & Manufacturing",
    "Mill, Smelter & Mine",
    "Offshore, Marine & Energy",
    "Aquaculture & Fishery",
    "Data Center, Telecom & Cloud",
    "R&D, Biotech & Medtech Lab",
    "Filial, Logistics & Subsidiary HQ",
}


def norm(s):
    s = (s or "").lower()
    for a, b in (("æ", "ae"), ("ø", "o"), ("å", "a"), ("ä", "a"), ("ö", "o"), ("ü", "u"), ("é", "e")):
        s = s.replace(a, b)
    s = re.sub(r"\b(asa|as|ab|oyj|oy|a/s|plc|se|sa|hf|group|holding|holdings|corp|inc)\b", "", s)
    return re.sub(r"[^a-z0-9]", "", s)


def hav(a, b, c, d):
    p = math.radians
    x = math.sin(p(c - a) / 2) ** 2 + math.cos(p(a)) * math.cos(p(c)) * math.sin(p(d - b) / 2) ** 2
    return 12742 * math.asin(math.sqrt(min(1.0, x)))


EX = []
for f in glob.glob("data/facilities*.js"):
    if f == OUT:
        continue
    text = open(f, encoding="utf-8").read()
    for m in re.finditer(
        r'parentName:\s*"([^"]+)"[\s\S]{0,400}?lat:\s*(-?[\d.]+)[\s\S]{0,80}?lng:\s*(-?[\d.]+)',
        text,
    ):
        EX.append((norm(m.group(1)), float(m.group(2)), float(m.group(3)), m.group(1)))


def is_dup(parent, lat, lng):
    k = norm(parent)
    if not k:
        return False
    for p, b, c, _ in EX:
        # Exact company key only. Prefix matching collapses Kone into Konecranes.
        if p == k and hav(lat, lng, b, c) < 0.6:
            return True
    return False


rows = []
seen = set()
# Only the coordinator's reviewed file is published. Agent JSON can mark
# coordsExact on a guess; those stay in research until checked.
sources = ["research/grok/accepted.json"] if os.path.exists("research/grok/accepted.json") else []
for f in sources:
    try:
        items = json.load(open(f, encoding="utf-8"))
    except (ValueError, OSError) as e:
        print(f"SKIP {f}: {e}")
        continue
    if not isinstance(items, list):
        print(f"SKIP {f}: not a list")
        continue
    for it in items:
        if it.get("facilityType") not in TYPES:
            print(f"INVALID type {it.get('parentName')} | {it.get('name')}")
            continue
        if not it.get("coordsExact"):
            print(f"NOEXACT {it.get('parentName')} | {it.get('name')}")
            continue
        try:
            lat = float(it["approxLat"])
            lng = float(it["approxLng"])
        except (KeyError, TypeError, ValueError):
            print(f"NOCOORD {it.get('parentName')} | {it.get('name')}")
            continue
        if not (-90 <= lat <= 90 and -180 <= lng <= 180):
            continue
        key = (norm(it["parentName"]), norm(it["name"]))
        if key in seen:
            continue
        if is_dup(it["parentName"], lat, lng):
            print(f"DUP     {it['parentName']} | {it['name']}")
            continue
        seen.add(key)
        EX.append((norm(it["parentName"]), lat, lng, it["parentName"]))
        rad = int(min(350, max(160, it.get("footprintRadiusMeters") or 220)))
        digest = hashlib.sha1(f"{it['parentName']}|{it['name']}".encode()).hexdigest()[:8]
        rows.append(
            {
                "id": f"fac-grok-b4-{digest}",
                "parentName": it["parentName"],
                "name": it["name"],
                "facilityType": it["facilityType"],
                "city": it.get("city") or "",
                "country": it.get("country") or "",
                "lat": round(lat, 5),
                "lng": round(lng, 5),
                "address": it.get("address") or "",
                "footprintRadiusMeters": rad,
                "description": it.get("description") or "",
            }
        )

order = [
    "id",
    "parentName",
    "name",
    "facilityType",
    "city",
    "country",
    "lat",
    "lng",
    "address",
    "footprintRadiusMeters",
    "description",
]
lines = [
    "// Grok batch 4 — additional operating sites for thin portfolio names.",
    "// Coordinates are source-stated (Wikipedia / company / authority), not Nominatim.",
    "window.EXTRA_FACILITIES = (window.EXTRA_FACILITIES || []).concat([",
]
for r in rows:
    body = ",\n".join(f"    {k}: {json.dumps(r[k], ensure_ascii=False)}" for k in order)
    lines.append("  {\n" + body + "\n  },")
if rows:
    lines[-1] = lines[-1].rstrip(",")
lines.append("]);\n")
open(OUT, "w", encoding="utf-8").write("\n".join(lines))
print(f"wrote {len(rows)} sites -> {OUT}")
