#!/usr/bin/env python3
"""Build the learning guide from the engine sources.

Usage:
  python3 -I build.py --img <image dir> --out <standalone.html> [--artifact <artifact.html>]

- Embeds every image in --img as a base64 data URI, so the standalone HTML works offline.
- Writes g_shots.js (image sizes + screenshot placement) from g_shots_body.js.
- --out       : full HTML document (doctype, head, body) for download / repo.
- --artifact  : same page without the html/head/body skeleton, for the Artifact tool.
Requires Pillow (PIL) for image sizes.
"""
import argparse, base64, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
JS_ORDER = ['c_data.js', 'e_fields.js', 'g_shots.js', 'h_biz.js', 'j_protec_ri.js', 'i_track.js', 'f_lens.js', 'd_app.js']


def read(name):
    with open(os.path.join(HERE, name), encoding='utf-8') as f:
        return f.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--img', required=True, help='folder with imageN.png / imageN.jpeg')
    ap.add_argument('--out', required=True, help='standalone HTML output path')
    ap.add_argument('--artifact', help='optional artifact HTML output path (no skeleton)')
    a = ap.parse_args()

    from PIL import Image
    data, dims = {}, {}
    for f in sorted(os.listdir(a.img)):
        if not re.match(r'.+\.(png|jpe?g)$', f, re.I):
            continue
        p = os.path.join(a.img, f)
        mime = 'image/png' if f.lower().endswith('.png') else 'image/jpeg'
        with open(p, 'rb') as fh:
            data[f] = f'data:{mime};base64,' + base64.b64encode(fh.read()).decode()
        dims[f] = list(Image.open(p).size)

    with open(os.path.join(HERE, 'g_shots.js'), 'w', encoding='utf-8') as fh:
        fh.write('const IMG_DIMS=' + json.dumps(dims, separators=(',', ':')) + ';\n' + read('g_shots_body.js'))

    script = 'const IMG_DATA=' + json.dumps(data, separators=(',', ':')) + ';\n' + ''.join(read(x) for x in JS_ORDER)
    head = read('a_head.html')
    shell = re.sub(r'(src|data-src)="img/([^"]+)"',
                   lambda m: f'{m.group(1)}="{data.get(m.group(2), "img/" + m.group(2))}"', read('b_shell.html'))

    full = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            + head + '</head><body>' + shell + '<script>' + script + '</script></body></html>')
    with open(a.out, 'w', encoding='utf-8') as fh:
        fh.write(full)
    if a.artifact:
        with open(a.artifact, 'w', encoding='utf-8') as fh:
            fh.write(head + shell + '<script>' + script + '</script>')
    print(f'{len(data)} images embedded; {round(len(full) / 1e6, 2)} MB -> {a.out}')


if __name__ == '__main__':
    main()
