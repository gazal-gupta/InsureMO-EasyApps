#!/usr/bin/env python3
"""Build claims-learning-guide/index.html as one self-contained file.

Inputs (all in src/):
  template.html  page shell and styles
  views.html     page content for each module
  data1-6.js     guide content (modules, tasks, scenarios, glossary, quizzes)
  engine.js      rendering, diagrams, tracker, quizzes, search
  engine2.js     simulators and calculators (routing, refund, metrics, reinsurance, reserve close)
  img/           source screenshots (WebP) and icons (PNG), listed in img/manifest.json

Screenshots are embedded as data URIs so the single HTML file works offline.
Run:  python3 build.py
"""
import base64
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"


def main():
    tpl = (SRC / "template.html").read_text(encoding="utf-8")
    views = (SRC / "views.html").read_text(encoding="utf-8")
    data = "\n".join((SRC / f"data{i}.js").read_text(encoding="utf-8") for i in range(1, 7))
    engine = (SRC / "engine.js").read_text(encoding="utf-8") + "\n" + (SRC / "engine2.js").read_text(encoding="utf-8")

    manifest = json.loads((SRC / "img" / "manifest.json").read_text(encoding="utf-8"))
    imgs = {}
    for key, (fname, _w, _h) in manifest.items():
        raw = (SRC / "img" / fname).read_bytes()
        mime = "image/webp" if fname.endswith(".webp") else "image/png"
        imgs[key] = f"data:{mime};base64," + base64.b64encode(raw).decode("ascii")
    images_js = "const IMGS=" + json.dumps(imgs, separators=(",", ":")) + ";"

    out = (tpl.replace("<!--VIEWS-->", views)
              .replace("/*__DATA__*/", data)
              .replace("/*__IMAGES__*/", images_js)
              .replace("/*__ENGINE__*/", engine))
    (ROOT / "index.html").write_text(out, encoding="utf-8")
    print(f"index.html written: {len(out)/1024/1024:.2f} MB, {len(imgs)} images")


if __name__ == "__main__":
    main()
