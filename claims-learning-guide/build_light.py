"""Build the light shared page for the Claims guide: the page HTML with screenshots
loaded from published files img/sN.png (the screenshots are published once, next to the page).
Usage: python3 -I build_light.py <claims guide dir> <out_page.html>
Publish <out_page.html> to https://claude.ai/artifact/CM4Zi8GHUscx1H6NuPd2KM. Pass the
img/sN.png files only when a screenshot changed; files left out stay published."""
import os, re, sys
d, out = sys.argv[1], sys.argv[2]
BCP_URL = 'https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR'
s = open(os.path.join(d, 'index.html'), encoding='utf-8').read()
assert "const BCPG='../bcp-learning-guide/index.html#';" in s
s = s.replace("const BCPG='../bcp-learning-guide/index.html#';", "const BCPG='" + BCP_URL + "#';")
s = s.replace('<a href="../bcp-learning-guide/index.html">', '<a href="' + BCP_URL + '" target="_blank" rel="noopener">')
# the publisher adds its own doctype/html/head/body skeleton
s = re.sub(r'^<!doctype html>\s*', '', s, flags=re.I)
s = re.sub(r'<html[^>]*>\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', '', s, count=1)
s = s.replace('</head><body>', '', 1)
s = s.replace('</body></html>', '')
assert '<title>' in s[:8000] and '<html' not in s and '<body>' not in s
open(out, 'w', encoding='utf-8').write(s)
print('light page', len(s), 'bytes ->', out)
