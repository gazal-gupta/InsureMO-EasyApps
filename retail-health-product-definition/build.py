"""Build index.html from template.html + data.json (extracted memo) + authored.json (review).
Usage: python3 -I build.py   (run from this folder)"""
import json, pathlib
here = pathlib.Path(__file__).parent
t = (here / 'template.html').read_text(encoding='utf-8')
data = json.loads((here / 'data.json').read_text(encoding='utf-8'))
a = json.loads((here / 'authored.json').read_text(encoding='utf-8'))
dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
t = t.replace('/*__DATA__*/null', dump(data))
for k in ('ISSUES', 'NEWRULES', 'INTEG', 'IDENT'):
    t = t.replace('/*__%s__*/[]' % k, dump(a[k]))
assert '/*__' not in t
(here / 'index.html').write_text(t, encoding='utf-8')
print('index.html', len(t.encode()) // 1024, 'KB')
