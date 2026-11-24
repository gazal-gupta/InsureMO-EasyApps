"""Extract the product memo workbook embedded in a retail health BSD (.docx) into
a sanitised data.json: insurer, person and partner names are removed and brand-like
cover names are made generic. Usage:
  python3 -I extract.py <bsd.docx> <out/data.json>
"""
import sys, re, json, zipfile, io
import openpyxl

SUBS = [
    [
    "pending by protec",
    "pending with insurer"
    ],
    [
    "\\bprotec\\b",
    "the insurer"
    ],
    [
    "\\b20001\\b",
    "XXXX"
    ],
    [
    "Smart Steps",
    "Wellness Steps"
    ],
    [
    "SmartSteps",
    "WellnessSteps"
    ],
    [
    "Smart No-Limit",
    "No-Limit Claim"
    ],
    [
    "Smart_No_limit",
    "No_limit"
    ],
    [
    "Travel SmartHold",
    "Travel Pause"
    ],
    [
    "TravelSmart_Hold",
    "Travel_Pause"
    ],
    [
    "Travel Smart \\(Domestic\\)",
    "Domestic Travel Cover"
    ],
    [
    "TravelSmartDomestic",
    "DomesticTravel"
    ],
    [
    "TravelSmart",
    "DomesticTravel"
    ],
    [
    "Travel Smart",
    "Domestic Travel Cover"
    ],
    [
    "Smart Family Benefit",
    "Family Starter Benefit"
    ],
    [
    "Smart_Family_benefit",
    "Family_starter"
    ],
    [
    "Smart Lifetime Bonus",
    "Lifetime Loyalty Bonus"
    ],
    [
    "Smart Network Cover",
    "Network Choice Cover"
    ],
    [
    "\\s*\\((?:confirmation in |method pending, )?QA No\\.\\s*[\\d, No.]+\\)",
    ""
    ],
    [
    "\\s*\\(QA No\\.[^)]*\\)",
    ""
    ],
    [
    ";?\\s*confirmation in QA No\\.\\d+",
    ""
    ],
    [
    "QA No\\.\\s*\\d+[, ]*(No\\.\\d+)?",
    "open point"
    ],
    [
    "\\s*\\(Word[^)]*\\)",
    ""
    ],
    [
    "Word FRS",
    "original specification"
    ],
    [
    "Word note",
    "specification note"
    ],
    [
    "\\bWord(:|;)?\\s*",
    ""
    ],
    [
    "the Excel open-claim block is not applied",
    "an open-claim block is not applied"
    ],
    [
    "\\s*\\(RHE-[A-Z]{2}-\\d{3}(, RHE-[A-Z]{2}-\\d{3})*\\)",
    ""
    ],
    [
    "RHE-[A-Z]{2}-\\d{3}\\s*",
    ""
    ],
    [
    "Unlike the previous version of this sheet,[^.]*\\.\\s*",
    ""
    ],
    [
    "see QA list",
    "open point"
    ],
    [
    "pending clarification from QA and will need to be updated once QA provides clarification",
    "an open point to be confirmed"
    ],
    [
    "^QA$",
    ""
    ],
    [
    "\\bsheets?\\b",
    "section"
    ],
    [
    "\\s*\\(Phase \\d\\)",
    ""
    ]
    ]
# Client-specific names (insurer, people, partners, product codes) are kept out of git
# in tools/names.local.json: {"names": [[pattern, replacement], ...], "forbidden": [pattern, ...]}
import pathlib as _pl
_LOCAL = _pl.Path(__file__).with_name('names.local.json')
_NAMES = json.loads(_LOCAL.read_text()) if _LOCAL.exists() else {'names': [], 'forbidden': []}
SUBS = [tuple(x) for x in _NAMES['names']] + SUBS
CJK = re.compile(r'[　-〿㐀-鿿＀-￯]+')

def clean(v):
    if v is None:
        return ''
    s = ' '.join(str(v).split())
    s = s.replace('（', '(').replace('）', ')')
    s = CJK.sub('', s).strip()
    for a, b in SUBS:
        s = re.sub(a, b, s)
    s = s.strip()
    if re.fullmatch(r'\d+\.\d{7,}', s):  # long floats from the rate tables
        s = repr(float(s))
    return s

def rows(ws, start, cols):
    out = []
    for r in ws.iter_rows(min_row=start, values_only=True):
        cells = [clean(r[c]) if c < len(r) else '' for c in cols]
        if any(cells):
            out.append(cells)
    return out

def blocks(ws, start=1):
    """Split a sheet into titled tables: a row with one filled cell starts a block."""
    res, cur = [], None
    for r in ws.iter_rows(min_row=start, values_only=True):
        cells = [clean(c) for c in r]
        while cells and not cells[-1]:
            cells.pop()
        if not any(cells):
            continue
        filled = [c for c in cells if c]
        if len(filled) == 1 and cells[0]:
            cur = {'title': cells[0], 'rows': []}
            res.append(cur)
        else:
            if cur is None:
                cur = {'title': '', 'rows': []}
                res.append(cur)
            cur['rows'].append(cells)
    return res

def main(docx, out):
    z = zipfile.ZipFile(docx)
    name = [n for n in z.namelist() if n.startswith('word/embeddings/') and n.endswith('.xlsx')][0]
    wb = openpyxl.load_workbook(io.BytesIO(z.read(name)), data_only=True)
    d = {}
    cl = wb['Coverage List']
    d['coverages'] = [r for r in rows(cl, 4, range(0, 11)) if re.fullmatch(r'[A-Z0-9]{5,6}', r[1] or '')]
    d['benefits'] = [r for r in rows(cl, 4, range(12, 23)) if re.fullmatch(r'[A-Z0-9]{5,6}', r[3] or '')]
    pc = wb['Plan Cover Relation']
    pm = [r for r in rows(pc, 1, range(0, 6)) if r[1]]
    hi = next(i for i, r in enumerate(pm) if r[1] == 'Coverage Code')
    d['planNames'] = pm[hi][2:6]
    d['planMatrix'] = pm[hi + 1:]
    d['fields'] = [r for r in rows(wb['Fields List'], 4, range(0, 11)) if r[3]]
    d['rules'] = [r for r in rows(wb['Rules'], 5, range(0, 14)) if r[0].startswith('BR-')]
    d['atr'] = [r for r in rows(wb['CoverageBenefit Rule'], 4, range(0, 10)) if r[1].startswith('ATR')]
    d['claimRules'] = [r for r in rows(wb['Claim Rule'], 5, range(0, 10)) if r[1].startswith('CLM')]
    d['clauses'] = [r for r in rows(wb['ClauseList'], 4, range(0, 6)) if r[0].startswith('CL-')]
    d['dataTables'] = blocks(wb['Data Tables'], 2)
    d['questTables'] = blocks(wb['Medical_Quest_Tables'], 2)
    d['questionnaire'] = rows(wb['Medical_Questionnaire'], 3, range(0, 10))
    d['rateTables'] = blocks(wb['Rate Tables'], 2)
    d['premiumCalc'] = blocks(wb['Premium Calculation'], 2)
    d['endorsement'] = blocks(wb['Endorsement'], 2)
    for b in d['endorsement']:  # drop source-document reference columns
        if b['rows'] and b['rows'][0][:5] and b['rows'][0][3:5] == ['Word FRS Ref'.replace('Word FRS', 'original specification'), 'Excel Ref (Type / Sub-type) / CBR']:
            b['rows'] = [r[:3] + r[5:] for r in b['rows']]
    text = json.dumps(d, ensure_ascii=False)
    for bad in [r'\bWord\b', r'QA No', r'\bFRS\b', r'Excel', r'RHE-', r'\bQA\b', 'Smart'] + _NAMES['forbidden']:
        m = re.search(bad, text)
        assert not m, (bad, text[max(0, m.start() - 80):m.end() + 40])
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=0)
    print({k: len(v) for k, v in d.items()})

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
