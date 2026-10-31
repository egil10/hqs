#!/bin/zsh
# Every 15 min: geocode whatever research has been saved so far and push it.
cd "$(git rev-parse --show-toplevel)"
for round in $(seq 1 16); do
  sleep 900
  for f in research/claude/research_*.json; do
    [[ -e "$f" ]] || continue
    g=${${f:t}#research_}; g=${g%.json}
    python3 -c "import json;json.load(open('$f'))" 2>/dev/null && python3 research/claude/pipeline.py "$g" | head -1
  done
  research/claude/publish.sh "Claude deep-dive autosave: researched + geocoded sites for smaller holdings (round $round)" 2>&1 | tail -1
  pgrep -f "autosave-stop" >/dev/null && break
done
