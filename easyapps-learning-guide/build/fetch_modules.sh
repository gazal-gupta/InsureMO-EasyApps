#!/usr/bin/env bash
# Copy the four module guides (standalone builds) out of their git branches.
# Usage: bash easyapps-learning-guide/build/fetch_modules.sh [out_dir]
set -euo pipefail
OUT=${1:-easyapps-learning-guide/modules}
mkdir -p "$OUT"
git fetch -q origin claude/adoring-cerf-5m89jr claude/eager-thompson-37yl3k claude/festive-heisenberg-ia4e0n
git show origin/claude/eager-thompson-37yl3k:easypa-learning-guide/index.html > "$OUT/pa.html"
git show origin/claude/adoring-cerf-5m89jr:bcp-learning-guide/index.html > "$OUT/bcp.html"
git show origin/claude/festive-heisenberg-ia4e0n:claims-learning-guide/InsureMO-Claims-Learning-Guide.html > "$OUT/clm.html"
git show origin/claude/adoring-cerf-5m89jr:reinsurance-learning-guide/index.html > "$OUT/ri.html"
ls -l "$OUT"
