# Builds the Design System docs artifact's tokens.json from figma/variables.raw.json (resolved per theme).
import json, sys, re
root = '/home/claude/dxds'
V = json.load(open(f'{root}/figma/variables.raw.json'))
S = json.load(open(f'{root}/figma/styles-components.raw.json'))
col = {c['n']: c for c in V}
idx = {}
for c in V:
    for n, t, vals in c['v']:
        idx[n] = (c['n'], vals)
THEMES = [('light','Light',0,0),('dark','Dark',0,1),('light-hc','Light · high contrast',0,2),('dark-hc','Dark · high contrast',0,3),('violet','Violet brand',1,0),('amber','Amber brand',2,0)]
def resolve(name, b, m, depth=0):
    cname, vals = idx[name]
    i = {'Brand': b, 'Color': m}.get(cname, 0)
    v = vals[min(i, len(vals)-1)]
    if isinstance(v, str) and v.startswith('@'): return resolve(v[1:], b, m, depth+1)
    return v
def tw(n):
    m = re.match(r'color/(bg|text|border|icon|dataviz|category|shadow)/(.+)', n)
    k, rest = m.group(1), m.group(2).replace('/', '-')
    pre = {'bg':'bg-'+rest, 'text':'text-fg-'+rest, 'border':'border-line-'+rest, 'icon':'text-icon-'+rest, 'dataviz':'fill-viz-'+rest, 'category':'bg-cat-'+rest, 'shadow':'(used by shadows)'}[k]
    return pre
ROLE = {'bg':'Background','text':'Text','border':'Border','icon':'Icon','dataviz':'Chart colour','category':'Category colour','shadow':'Shadow colour'}
NOTES = {'color/bg/canvas':'The page behind everything.','color/bg/surface':'Cards, fields, panels.','color/bg/surface-raised':'Menus, popovers, the selected segment.','color/bg/brand':'Primary buttons and selected controls. Text on it: text-on-brand.','color/text/primary':'Body text and headings. 4.5:1 on every surface.','color/text/secondary':'Helper text, captions, unselected tabs.','color/border/focus':'Focus ring (with Focus/Ring shadow).','color/bg/control-off':'Toggle off, slider rail — 3:1 against the surface.','color/dataviz/series-1':'First chart series. Use series in order; 1–4 stay apart for colour-blind readers.'}
tokens = []
for n, t, vals in col['Color']['v']:
    short = n.replace('color/', '').replace('/', '-')
    val = {tid: resolve(n, b, m) for tid, _, b, m in THEMES}
    k = n.split('/')[1]
    usage = (NOTES.get(n, ROLE[k] + ': ' + n.split('/', 2)[2].replace('/', ' ') + '.') + f' Tailwind `{tw(n)}` · CSS `--ds-{n.replace("/", "-")}` · Figma `{n}`.')
    tokens.append({'name': short, 'value': val, 'usage': usage})
for n, t, vals in col['Brand']['v']:
    if n.startswith('brand/primary/') or n.startswith('brand/accent/'):
        short = n.replace('/', '-')
        tokens.append({'name': short, 'value': {tid: resolve(n, b, m) for tid, _, b, m in THEMES}, 'usage': f'Brand ramp step (changes per brand). Prefer the semantic colours above in UI. CSS `--ds-{short}`.'})
fw = {'Regular':400,'Medium':500,'Semi Bold':600,'SemiBold':600,'Bold':700}
groups = {}
order = ['Display','Heading','Body','Label','Caption','Code']
for s in S['textStyles']:
    g, nm = s['n'].split('/')
    slug = (g + '-' + nm).lower().replace(' ', '-')
    st = {'name': slug, 'fontSize': f"{s['s']}px", 'lineHeight': f"{s['lh']}px" if isinstance(s['lh'], (int,float)) else 1.4, 'fontWeight': fw.get(s['w'], 400), 'usage': f"Figma `{s['n']}` · Tailwind `text-{slug}` · CSS `.ds-{slug}`. Responsive: sizes step down on tablet and mobile."}
    if s.get('ls') and s.get('lsu') == 'PIXELS' and abs(s['ls']) > 0.001: st['letterSpacing'] = f"{round(s['ls'],2)}px"
    groups.setdefault(g, []).append(st)
type_ = {'families': {'sans': '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', 'mono': '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace'},
         'groups': [{'name': g, 'family': 'mono' if g == 'Code' else 'sans', 'styles': sorted(groups[g], key=lambda x: -float(x['fontSize'][:-2]))} for g in order if g in groups]}
dim = {n: vals[0] for n, t, vals in col['Dimension']['v']}
comp = {n: vals[1] for n, t, vals in col['Dimension']['v']}
spacing = [{'name': n.replace('/', '-'), 'value': f'{v}px', 'usage': f'Tailwind `p-{n.split("/")[1].replace("-", ".")}` / `gap-…` (same 4px scale). CSS `--ds-{n.replace("/", "-")}`.'} for n, v in dim.items() if n.startswith('spacing/')]
spacing += [{'name': n.replace('/', '-'), 'value': f'{v}px', 'usage': f'Density-aware: {v}px comfortable, {comp[n]}px compact. CSS `--ds-{n.replace("/", "-")}`.'} for n, v in dim.items() if n.startswith(('padding/', 'gap/'))]
radius = [{'name': n.replace('/', '-'), 'value': ('9999px' if v == 9999 else f'{v}px'), 'usage': f'Tailwind `rounded-{n.split("/")[1]}`. CSS `--ds-{n.replace("/", "-")}`.'} for n, v in dim.items() if n.startswith('radius/')]
radius += [{'name': 'radius-control', 'value': '8px', 'usage': 'Buttons, fields, segmented controls (per brand: amber uses full). Tailwind `rounded-control`.'}, {'name': 'radius-container', 'value': '12px', 'usage': 'Cards, menus, dialogs (amber: 16px). Tailwind `rounded-container`.'}]
size = [{'name': n.replace('/', '-'), 'value': f'{v}px', 'usage': f'{v}px comfortable · {comp[n]}px compact. CSS `--ds-{n.replace("/", "-")}`' + (f'; Tailwind `h-{n.split("/")[1]}`' if 'control' in n else '') + '.'} for n, v in dim.items() if n.startswith(('size/', 'border-width/'))]
def shadow(e, b, m):
    return ', '.join(f"{s['x'] or 0}px {s['y'] or 0}px {s['r'] or 0}px {s['sp'] or 0}px {resolve(s['c'], b, m)}" for s in reversed(e['e']))
shadows = [{'name': e['n'].lower().replace('/', '-'), 'value': {tid: shadow(e, b, m) for tid, _, b, m in THEMES}, 'usage': f"Figma effect `{e['n']}` · Tailwind `{'focus-ring' if 'Focus' in e['n'] else 'shadow-' + e['n'].lower().replace('/', '-')}` · CSS `--ds-shadow-{e['n'].lower().replace('/', '-')}`."} for e in S['effectStyles']]
eff = {n: vals[0] for n, t, vals in col['Effects']['v']}
def ev(n):
    v = eff[n]
    return eff[v[1:]] if isinstance(v, str) else v
opacity = [{'name': n.replace('/', '-'), 'value': str(ev(n) / 100), 'usage': f'CSS `--ds-{n.replace("/", "-")}`.'} for n in eff if n.startswith('opacity/')]
z = [{'name': n.replace('/', '-'), 'value': str(eff[n]), 'usage': f'Stacking layer. CSS `--ds-{n.replace("/", "-")}`.'} for n in eff if n.startswith('z/')]
out = {'name': 'DX Design System', 'version': 1,
       'meta': {'source': 'figma+code', 'figma': 'https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System', 'version': '3.2.0', 'synced': '2026-11-11'},
       'color': {'themes': [{'id': i, 'name': nm} for i, nm, _, _ in THEMES], 'tokens': tokens},
       'type': type_, 'spacing': {'tokens': spacing}, 'radius': {'tokens': radius},
       'shadow': {'tokens': shadows}, 'size': {'note': 'Control, icon and avatar sizes. Change with density.', 'tokens': size},
       'opacity': {'tokens': opacity}, 'zIndex': {'tokens': z}}
json.dump(out, open(sys.argv[1], 'w'), indent=1, ensure_ascii=False)
print(len(tokens), 'colors;', sum(len(g['styles']) for g in type_['groups']), 'styles;', len(spacing), len(radius), len(shadows), len(size), len(opacity), len(z))
