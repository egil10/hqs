#!/bin/zsh
# usage: research/claude/publish.sh "<commit message>"   (run from repo root)
# Commits only Claude's files (research/claude/*, data/facilities_claude_*.js) plus the script tags
# for them in index.html — never another agent's uncommitted index.html edits.
set -e
cd "$(git rev-parse --show-toplevel)"
git fetch -q origin
git stash list >/dev/null
# rebase onto origin without disturbing others' working-tree edits
git -c rebase.autoStash=true pull -q --rebase origin main
tags=""
for f in data/facilities_claude_*.js; do
  grep -q "$f" <(git show HEAD:index.html) || tags+="  <script src=\"$f\" defer></script>\n"
done
if [[ -n "$tags" ]]; then
  tmp=$(mktemp)
  git show HEAD:index.html | awk -v t="$tags" '/<script src="app.js"><\/script>/{printf "%s", t}1' > "$tmp"
  git update-index --cacheinfo 100644,$(git hash-object -w "$tmp"),index.html
  # mirror into working copy
  for f in data/facilities_claude_*.js; do
    grep -q "$f" index.html || python3 - "$f" <<'EOF'
import sys
f=sys.argv[1];s=open('index.html').read()
s=s.replace('  <script src="app.js"></script>',f'  <script src="{f}" defer></script>\n  <script src="app.js"></script>',1)
open('index.html','w').write(s)
EOF
  done
fi
git add research/claude data/facilities_claude_*.js
git diff --cached --quiet && { echo "nothing to commit"; exit 0; }
git commit -q -m "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q origin main || { git -c rebase.autoStash=true pull -q --rebase origin main && git push -q origin main; }
git log --oneline -1
