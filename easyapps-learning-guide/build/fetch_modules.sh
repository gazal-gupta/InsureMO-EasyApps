#!/usr/bin/env bash
# Copy the four built module guides into the combined guide's working folder.
# Run from the repository root: bash easyapps-learning-guide/build/fetch_modules.sh [out_dir]
set -euo pipefail
OUT=${1:-easyapps-learning-guide/modules}
mkdir -p "$OUT"
cp -f easypa-learning-guide/index.html "$OUT/pa.html"
cp -f bcp-learning-guide/index.html "$OUT/bcp.html"
cp -f claims-learning-guide/InsureMO-Claims-Learning-Guide.html "$OUT/clm.html"
cp -f reinsurance-learning-guide/index.html "$OUT/ri.html"
ls -l "$OUT"/*.html
