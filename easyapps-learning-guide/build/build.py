"""Build the InsureMO Easy Apps learning guide: one offline HTML file that holds
the four module guides (Easy PA, BCP, Easy Claim, XRI) plus a hub with the
capability map, cross-module view, combined gaps, glossary and search.

Usage:
  python3 -I build.py --modules <dir with pa/bcp/clm/ri.html and harvest.json>
                      --out <guide.html> [--artifact <page.html>] [--quality 80]
"""
import argparse, base64, hashlib, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'src')
ORDER = ['pa', 'bcp', 'clm', 'ri']
ART_IDS = {'FWXe2xvipxCwKW1SiVvujR': 'bcp', '6knf7mwoDjGiwThXqNok9q': 'pa',
           'Q3LqqcJvLVLntmFCZATymY': 'ri', 'CM4Zi8GHUscx1H6NuPd2KM': 'clm'}


def read(p):
    with open(p, encoding='utf-8') as fh:
        return fh.read()


# ---------- images: recompress to WebP when smaller ----------
def recompress(html, quality, cache_dir, stats):
    from PIL import Image
    os.makedirs(cache_dir, exist_ok=True)

    def sub(m):
        kind, b64 = m.group(1), m.group(2)
        raw_len = len(b64) * 3 // 4
        stats['before'] += raw_len
        if kind not in ('png', 'jpeg', 'jpg'):
            stats['after'] += raw_len
            return m.group(0)
        key = hashlib.sha1((b64 + str(quality)).encode()).hexdigest()
        cp = os.path.join(cache_dir, key + '.txt')
        if os.path.exists(cp):
            out = read(cp)
        else:
            data = base64.b64decode(b64)
            im = Image.open(io.BytesIO(data))
            im = im.convert('RGBA') if im.mode in ('P', 'LA', 'RGBA') else im.convert('RGB')
            buf = io.BytesIO()
            im.save(buf, 'WEBP', quality=quality, method=6)
            w = buf.getvalue()
            out = ('data:image/webp;base64,' + base64.b64encode(w).decode()) if len(w) < len(data) else m.group(0)
            with open(cp, 'w') as fh:
                fh.write(out)
        stats['after'] += len(out.split(',', 1)[1]) * 3 // 4
        return out

    return re.sub(r'data:image/([a-z+]+);base64,([A-Za-z0-9+/=]+)', sub, html)


# ---------- bridge: lets each guide talk to the hub ----------
BRIDGE = r"""<script>(function(){var M="%MOD%";
var st=document.createElement('style');st.textContent='.top{display:none!important}.rail{top:16px!important;max-height:calc(100vh - 32px)!important}';document.head.appendChild(st);
function post(o){o.ea=1;o.mod=M;try{parent.postMessage(o,'*')}catch(e){}}
window.addEventListener('error',function(e){post({t:'err',m:String(e.message||e)})});
function cur(){var v=document.querySelector('section.view:not([hidden])');var h='';try{h=decodeURIComponent(location.hash.slice(1))}catch(e){}return {t:'nav',h:h,view:v?v.id.slice(2):'',title:v?(v.getAttribute('data-title')||''):''}}
window.addEventListener('hashchange',function(){post(cur())});
window.addEventListener('message',function(e){var d=e.data;if(!d||d.ea!==1)return;
 if(d.t==='go'){var h=d.h||'start';var c='';try{c=decodeURIComponent(location.hash.slice(1))}catch(_){}
   if(c===h){try{route()}catch(_){};post(cur())}else{location.hash=h}
   try{window.scrollTo(0,0)}catch(_){}}
 if(d.t==='role'&&typeof setRole==='function'){try{setRole(d.r)}catch(_){}}
 if(d.t==='theme'){if(d.v)document.documentElement.setAttribute('data-theme',d.v);else document.documentElement.removeAttribute('data-theme')}
});
var ART=%ART%;var REL={'bcp-learning-guide':'bcp','easypa-learning-guide':'pa','reinsurance-learning-guide':'ri','claims-learning-guide':'clm'};
document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;var href=a.getAttribute('href')||'';
 if(href==='#'){e.preventDefault();return}
 if(href.charAt(0)==='#'&&!a.target&&!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey){e.preventDefault();var h=href.slice(1);if(decodeURIComponent(location.hash.slice(1))===h){try{route()}catch(_){}}else{location.hash=h}return}
 var m=href.match(/artifact\/([A-Za-z0-9]+)\/?(?:#(.*))?$/);var t=m&&ART[m[1]];
 if(!t){m=href.match(/([a-z]+-learning-guide)\/index\.html(?:#(.*))?$/);t=m&&REL[m[1]]}
 if(t){e.preventDefault();e.stopPropagation();post({t:'open',to:t,h:m[2]||''})}},true);
post({t:'ready'});
})();</script>"""


def inject_bridge(html, mod):
    b = BRIDGE.replace('%MOD%', mod).replace('%ART%', json.dumps(ART_IDS))
    i = html.rfind('</body>')
    return html[:i] + b + html[i:] if i >= 0 else html + b


def script_json(obj):
    """JSON that is safe inside <script type="application/json">."""
    s = json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    return re.sub(r'<(?=[/!sS])', r'\\u003c', s)


# ---------- hub data ----------
def build_data(H, meta):
    M = meta['mods']
    data = {'order': ORDER, 'mods': {}, 'tree': {}, 'menu': {}, 'edges': [], 'pairs': meta['pairs'],
            'chain': meta['chain'], 'ext': meta['ext'], 'journeys': [], 'gaps': [], 'gloss': [],
            'index': [], 'path': meta['path']}
    valid = {}
    for k in ORDER:
        h = H[k]
        views = {v for v, _ in h['_views']}
        scen = h.get('SCEN') or h.get('FLOWS')
        sp = 'fl-' if k == 'clm' else 'sc-'
        ok = set(views) | {sp + s['id'] for s in scen} | {'scr-' + s['id'] for s in h['SCREENS']}
        ok |= {'ip-' + x['id'] for x in h.get('IFLOWS') or []}
        valid[k] = ok
        scr = {s['id']: s for s in h['SCREENS']}
        # screens used by each scenario
        use = {}
        if k == 'clm':
            for f in scen:
                use[f['id']] = [x for x in (f.get('scr') or []) if x in scr]
        else:
            for s in h['SCREENS']:
                for sid in s.get('sc') or []:
                    use.setdefault(sid, []).append(s['id'])
        linked = {x for v in use.values() for x in v}
        groups = []
        for gk, gl in meta['mods'][k]['groups'].items():
            caps = []
            for s in scen:
                if s['grp'] != gk:
                    continue
                caps.append({'id': s['id'], 'n': s['name'], 'd': s.get('desc', ''), 'mods': s.get('mods', []),
                             'h': sp + s['id'],
                             'f': [{'id': x, 'n': scr[x]['n'], 'g': scr[x]['g'], 'h': 'scr-' + x} for x in use.get(s['id'], [])]})
            groups.append({'id': gk, 'n': gl, 'caps': caps})
        missing = [g for g in {s['grp'] for s in scen} if g not in meta['mods'][k]['groups']]
        assert not missing, (k, 'scenario groups without a label', missing)
        # screens no scenario uses: enquiry, set-up and administration
        rest = {}
        for s in h['SCREENS']:
            if s['id'] not in linked:
                rest.setdefault(s['g'], []).append({'id': s['id'], 'n': s['n'], 'g': s['g'], 'h': 'scr-' + s['id']})
        if rest:
            groups.append({'id': 'adm', 'n': 'Enquiry, set-up and administration',
                           'caps': [{'id': '', 'n': g, 'd': 'Screens in the ' + g + ' menu group that no business scenario in the source walks through.',
                                     'mods': [], 'h': 'scr-' + v[0]['id'], 'f': v} for g, v in rest.items()]})
        data['tree'][k] = groups
        # system menu view
        mg = {}
        for s in h['SCREENS']:
            mg.setdefault(s['g'], []).append({'id': s['id'], 'n': s['n'], 'p': s.get('p', ''),
                                             'sc': s.get('sc') or s.get('fl') or [], 'h': 'scr-' + s['id'],
                                             'nf': len(s.get('fields') or []), 'nr': len(s.get('rules') or [])})
        data['menu'][k] = {'groups': [{'n': g, 's': v} for g, v in mg.items()],
                           'menu': [m[:3] for m in h.get('MENU', [])]}
        # module card
        gaps = h.get('GAPS', [])
        data['mods'][k] = dict(M[k], head=h['_head'], title=h['_title'],
                               levels=[[l['id'], l['n'], l['name']] for l in h['LEVELS']],
                               paths=h.get('PATHS', {}),
                               n={'groups': len(meta['mods'][k]['groups']), 'caps': len(scen), 'screens': len(h['SCREENS']),
                                  'states': len(h.get('STATES', {})), 'journeys': len(h.get('JOURNEYS', [])),
                                  'gloss': len(h.get('ALLGLOSS') or h.get('GLOSS') or []),
                                  'gaps': len(gaps), 'high': sum(1 for g in gaps if g[0] == 'High'),
                                  'final': len(h.get('FINAL') or []), 'iflows': len(h.get('IFLOWS') or [])},
                               views=h['_views'], sp=sp)
        # integration edges, normalised to from -> to
        self_sends = k in ('pa', 'clm')  # in these guides "sends" means this module sends
        for ok_, m in h['MODS'].items():
            o = meta['extAlias'].get(ok_, ok_)
            for x in m.get('sends', []):
                a, b = (k, o) if self_sends else (o, k)
                data['edges'].append({'a': a, 'b': b, 't': x, 'src': k, 'basis': m.get('basis') or ''})
            for x in m.get('gets', []):
                a, b = (o, k) if self_sends else (k, o)
                data['edges'].append({'a': a, 'b': b, 't': x, 'src': k, 'basis': m.get('basis') or ''})
        # journeys
        lanes = h['LANES']
        lm = meta['mods'][k]['lanes']
        for j in h.get('JOURNEYS', []):
            data['journeys'].append({'mod': k, 'id': j['id'], 'n': j['n'], 'd': j.get('d', ''), 'note': j.get('note', ''),
                                     'kind': 'journey', 'h': 'integration',
                                     'paths': [{'n': '', 'steps': j['steps']}]})
        for f in h.get('IFLOWS') or []:
            data['journeys'].append({'mod': k, 'id': f['id'], 'n': f['name'], 'd': f.get('desc', ''), 'note': '',
                                     'kind': 'industry', 'h': 'ip-' + f['id'], 'mods': f.get('mods', []),
                                     'paths': [{'n': p.get('n', ''), 'steps': p['steps']} for p in f.get('paths', [])]})
        data['mods'][k]['lanes'] = lanes
        data['mods'][k]['laneMod'] = lm
        # gaps
        for g in gaps:
            data['gaps'].append([k] + list(g[:4]))
        # search index
        for it in h.get('INDEX', []):
            if it['h'].startswith('gl:'):
                continue  # Claims glossary entries; the hub glossary covers them
            data['index'].append({'m': k, 'k': it['k'], 't': it['t'], 'x': it['x'][:600], 'h': it['h']})
    # glossary merge
    G = {}
    for k in ORDER:
        h = H[k]
        if k == 'clm':
            rows = [{'t': g[0], 'c': g[2] if len(g) > 2 else '', 'm': g[1], 'e': '', 'w': ''} for g in h.get('ALLGLOSS', [])]
            have = {r['t'].lower() for r in rows}
            rows += [{'t': g[0], 'c': 'Easy Claim', 'm': g[1], 'e': '', 'w': ''} for g in h.get('GLOSS', []) if g[0].lower() not in have]
        else:
            rows = [{'t': g[0], 'c': g[1], 'm': g[2], 'e': g[3] if len(g) > 3 else '', 'w': g[4] if len(g) > 4 else ''} for g in h.get('GLOSS', [])]
        for r in rows:
            key = re.sub(r'\s+', ' ', r['t'].strip().lower())
            G.setdefault(key, {'t': r['t'], 'e': []})['e'].append(dict(r, mod=k))
    data['gloss'] = sorted(G.values(), key=lambda x: x['t'].lower())
    # link checks
    bad = []
    for k in ORDER:
        for g in data['tree'][k]:
            for c in g['caps']:
                for x in [c['h']] + [f['h'] for f in c['f']]:
                    if x not in valid[k]:
                        bad.append((k, x))
        for v in data['menu'][k]['groups']:
            for s in v['s']:
                if s['h'] not in valid[k]:
                    bad.append((k, s['h']))
    for it in data['index']:
        if it['h'] not in valid[it['m']]:
            bad.append((it['m'], it['h']))
    for j in data['journeys']:
        if j['h'] not in valid[j['mod']]:
            bad.append((j['mod'], j['h']))
    for c in meta['chain']:
        m, h = c['go'].split('--', 1)
        if h not in valid[m]:
            bad.append((m, h))
    for p in meta['path']:
        for lv in p['lv']:
            mods = ORDER if p['mod'] == 'all' else ([] if p['mod'] == 'hub' else [p['mod']])
            for m in mods:
                if lv not in valid[m] and not (lv == 'assessment' and 'assess' in valid[m]):
                    bad.append((m, lv))
    assert not bad, ('broken links', bad[:20])
    data['valid'] = {k: sorted(v) for k, v in valid.items()}
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--modules', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--artifact')
    ap.add_argument('--artifact-dir', help='light shared page: index.html plus m/<module>.html files loaded on demand')
    ap.add_argument('--quality', type=int, default=80)
    a = ap.parse_args()
    meta = json.loads(read(os.path.join(SRC, 'meta.json')))
    H = json.loads(read(os.path.join(a.modules, 'harvest.json')))
    data = build_data(H, meta)
    stats = {'before': 0, 'after': 0}
    payload = ''
    mod_html = {}
    for k in ORDER:
        html = read(os.path.join(a.modules, k + '.html'))
        assert 'image/png' not in re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+', '', html), k + ': code refers to image/png'
        html = recompress(html, a.quality, os.path.join(a.modules, '.imgcache'), stats)
        html = inject_bridge(html, k)
        mod_html[k] = html
        payload += f'<script type="application/json" id="mod-{k}">{script_json(html)}</script>\n'
    page = read(os.path.join(SRC, 'hub.html'))
    shell = page
    page = page.replace('<!--EA_DATA-->', f'<script type="application/json" id="ea-data">{script_json(data)}</script>')
    page = page.replace('<!--EA_MODULES-->', payload)
    page = page.replace('/*EA_APP*/', read(os.path.join(SRC, 'hub.js')))
    assert '<!--EA_' not in page and '/*EA_APP*/' not in page
    standalone = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
                  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
                  + page.replace('<!--BODY-->', '</head><body>', 1) + '\n</body></html>\n')
    with open(a.out, 'w', encoding='utf-8') as fh:
        fh.write(standalone)
    if a.artifact:
        with open(a.artifact, 'w', encoding='utf-8') as fh:
            fh.write(page.replace('<!--BODY-->', '', 1))
    if a.artifact_dir:
        os.makedirs(os.path.join(a.artifact_dir, 'm'), exist_ok=True)
        light = shell.replace('<!--EA_DATA-->', f'<script type="application/json" id="ea-data">{script_json(data)}</script>')
        light = light.replace('<!--EA_MODULES-->', '').replace('/*EA_APP*/', read(os.path.join(SRC, 'hub.js'))).replace('<!--BODY-->', '', 1)
        with open(os.path.join(a.artifact_dir, 'index.html'), 'w', encoding='utf-8') as fh:
            fh.write(light)
        for k, html in mod_html.items():
            with open(os.path.join(a.artifact_dir, 'm', k + '.html'), 'w', encoding='utf-8') as fh:
                fh.write(html)
        print(f'light page {len(light.encode())/1e6:.2f} MB + modules ' + ', '.join(f'{k} {len(v.encode())/1e6:.1f} MB' for k, v in mod_html.items()) + f' -> {a.artifact_dir}')
    mb = len(standalone.encode()) / 1e6
    print(f'images {stats["before"]/1e6:.2f} MB -> {stats["after"]/1e6:.2f} MB; page {mb:.2f} MB -> {a.out}')
    if mb >= 15.5:
        print(f'note: the offline file is {mb:.1f} MB; publish the light page (--artifact-dir), not this file')
    if a.artifact_dir:
        for f in [os.path.join(a.artifact_dir, 'index.html')] + [os.path.join(a.artifact_dir, 'm', k + '.html') for k in ORDER]:
            assert os.path.getsize(f) < 15.5e6, f + ' is too large for an artifact file (16 MB limit)'


if __name__ == '__main__':
    main()
