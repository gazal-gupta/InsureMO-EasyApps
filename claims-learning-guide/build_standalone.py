"""Build a single-file Claims guide with every screenshot embedded.
Usage: python3 build_standalone.py <guide_dir> <out_standalone.html> <out_artifact.html>
"""
import base64, re, sys, os
d, out_sa, out_art = sys.argv[1], sys.argv[2], sys.argv[3]
src = open(os.path.join(d, 'index.html')).read()
BCP_URL = 'https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR'
imgs = {}
for f in os.listdir(os.path.join(d, 'img')):
    m = re.fullmatch(r's(\d+)\.png', f)
    if m:
        imgs[int(m.group(1))] = 'data:image/png;base64,' + base64.b64encode(open(os.path.join(d, 'img', f), 'rb').read()).decode()
s = src
s = re.sub(r'src="img/s(\d+)\.png"', lambda m: 'src="' + imgs[int(m.group(1))] + '"', s)
assert "const BCPG='../bcp-learning-guide/index.html#';" in s
s = s.replace("const BCPG='../bcp-learning-guide/index.html#';", "const BCPG='" + BCP_URL + "#';")
s = s.replace('<a href="../bcp-learning-guide/index.html">', '<a href="' + BCP_URL + '" target="_blank" rel="noopener">')
data_js = '<script>window.IMGDATA={' + ','.join(f'{k}:"{v}"' for k, v in sorted(imgs.items())) + '};</script>\n'
i = s.index('<script>')
s = s[:i] + data_js + s[i:]
assert 'img/s' not in re.sub(r"'img/s'\+n\+'\.png'", '', s), 'stray image path'
open(out_sa, 'w').write(s)
# artifact: the publisher adds its own doctype/html/head/body skeleton
a = s
a = re.sub(r'^<!doctype html>\s*', '', a, flags=re.I)
a = re.sub(r'<html[^>]*>\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', '', a, count=1)
a = a.replace('</head><body>', '', 1)
a = a.replace('</body></html>', '')
assert '<title>' in a[:8000] and '<html' not in a and '<body>' not in a
open(out_art, 'w').write(a)
print('standalone', len(s), 'artifact', len(a), 'images', len(imgs))
