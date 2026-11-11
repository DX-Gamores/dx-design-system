# Writes components/<Comp>/README.md (+ preview.html for coded ones) and index.d.ts for the docs artifact.
import json, os, re
root='/home/claude/dxds'; out='/home/claude/dxds-artifact/project/components'
comps=json.load(open(f'{root}/docs/components.json'))
by={c['n']:c for c in comps}
CODED = {  # React name: (Figma name, group, height, usage snippet, preview body JS)
 'Button':('Button','Actions',150,'<Button variant="primary" tone="default" size="md" leadingIcon="plus">New project</Button>',
   "row(e(Button,null,'Primary'),e(Button,{variant:'secondary'},'Secondary'),e(Button,{variant:'ghost'},'Ghost'),e(Button,{tone:'danger',leadingIcon:'trash'},'Delete'),e(Button,{disabled:true},'Disabled')),row(e(Button,{size:'lg',leadingIcon:'plus'},'Large'),e(Button,{size:'sm'},'Small'),e(Button,{loading:true},'Saving…'))"),
 'IconButton':('Icon Button','Actions',80,'<IconButton icon="more" label="More actions for Jane Cooper" variant="ghost" />',
   "row(e(IconButton,{icon:'edit',label:'Edit',variant:'primary'}),e(IconButton,{icon:'edit',label:'Edit',variant:'secondary'}),e(IconButton,{icon:'more',label:'More actions'}),e(IconButton,{icon:'trash',label:'Delete',tone:'danger',variant:'secondary'}),e(IconButton,{icon:'close',label:'Close',size:'sm'}))"),
 'TextField':('Text Field','Inputs',220,'<TextField label="Email" placeholder="name@company.com" helperText="…" error={error} />',
   "grid(e(TextField,{label:'Email',placeholder:'name@company.com',helperText:\"We'll never share it.\"}),e(TextField,{label:'Search',leadingIcon:'search',placeholder:'Search projects…'}),e(TextField,{label:'Company',defaultValue:'DXFORM',error:'Company name is already taken — try another.'}),e(TextField,{label:'Workspace ID',defaultValue:'dx-2026',disabled:true,helperText:'Set by your admin.'}))"),
 'Textarea':('Textarea','Inputs',190,'<Textarea label="Bio" maxLength={160} helperText="Up to 160 characters." />',
   "e('div',{style:{maxWidth:420}},e(Textarea,{label:'Bio',placeholder:'A short introduction',helperText:'Up to 160 characters.',maxLength:160}))"),
 'Select':('Select','Inputs',120,'<Select label="Time zone" placeholder="Select an option" options={[{ value, label }]} />',
   "e('div',{style:{maxWidth:320}},e(Select,{label:'Time zone',placeholder:'Select an option',options:[{value:'mnl',label:'Asia/Manila'},{value:'sgp',label:'Asia/Singapore'}]}))"),
 'Checkbox':('Checkbox','Inputs',110,'<Checkbox label="Email me product updates" defaultChecked />',
   "col(e(Checkbox,{label:'Email me product updates',defaultChecked:true}),e(Checkbox,{label:'I agree to the Terms and Privacy Policy, including how DXFORM processes my data.'}),e(Checkbox,{label:'Disabled option',disabled:true}))"),
 'Toggle':('Toggle','Inputs',90,'<Toggle label="Email notifications" checked={on} onChange={setOn} />',
   "e(function(){const [a,sa]=React.useState(true),[b,sb]=React.useState(false);return col(e(Toggle,{label:'Email notifications',checked:a,onChange:sa}),e(Toggle,{label:'Weekly digest',checked:b,onChange:sb}))})"),
 'SegmentedControl':('Segmented Control','Navigation',120,'<SegmentedControl label="Period" value={v} onChange={setV} options={[{ value: "day", label: "Day" }, …]} />',
   "e(function(){const [v,s]=React.useState('week');const [w,sw]=React.useState('list');return col(e(SegmentedControl,{label:'Period',value:v,onChange:s,options:[{value:'day',label:'Day'},{value:'week',label:'Week'},{value:'month',label:'Month'}]}),e(SegmentedControl,{label:'View',size:'sm',value:w,onChange:sw,options:[{value:'list',label:'List',icon:'list-view',iconOnly:true},{value:'grid',label:'Grid',icon:'grid-view',iconOnly:true}]}))})"),
 'Tabs':('Tabs','Navigation',130,'<Tabs label="Member views" value={id} onChange={setId} tabs={[{ id, label, count, panel }]} />',
   "e(function(){const [v,s]=React.useState('members');return e(Tabs,{label:'Member views',value:v,onChange:s,tabs:[{id:'members',label:'Members',count:12,panel:e('p',{className:'text-fg-secondary'},'Members panel')},{id:'invites',label:'Invites',count:2,panel:e('p',{className:'text-fg-secondary'},'Invites panel')},{id:'roles',label:'Roles',panel:e('p',{className:'text-fg-secondary'},'Roles panel')}]})})"),
 'Stepper':('Stepper','Navigation',120,'<Stepper steps={[{ label: "Account", status: "complete" }, …]} onStepClick={goTo} />',
   "e(Stepper,{onStepClick:function(){},steps:[{label:'Account',description:'Email and password',status:'complete'},{label:'Company',description:'Fix 2 fields',status:'error'},{label:'Team',description:'Invite people',status:'upcoming'},{label:'Billing',status:'upcoming'}]})"),
 'Badge':('Badge','Feedback',70,'<Badge tone="success">Active</Badge>',
   "row(e(Badge,null,'Neutral'),e(Badge,{tone:'brand'},'Brand'),e(Badge,{tone:'success'},'Active'),e(Badge,{tone:'warning'},'Pending'),e(Badge,{tone:'danger'},'Overdue'),e(Badge,{tone:'info'},'New'))"),
 'Alert':('Alert','Feedback',330,'<Alert tone="danger" title="Couldn’t save" onDismiss={close} live>…</Alert>',
   "col(e(Alert,{tone:'info',title:'Heads up'},'Short explanation of what happened and what to do next.'),e(Alert,{tone:'success',title:'Changes saved'},'You can undo for 10 seconds.'),e(Alert,{tone:'warning',title:'Plan limit almost reached',onDismiss:function(){}},'48 of 50 seats used.'),e(Alert,{tone:'danger',title:'Couldn’t load members'},'Check your connection and try again.'))"),
 'Spinner':('Spinner','Feedback',70,'<Spinner size="md" label="Loading members" />',"row(e(Spinner,{size:'sm'}),e(Spinner,null),e(Spinner,{size:'lg'}))"),
 'Skeleton':('Skeleton','Feedback',110,'<Skeleton shape="text" className="w-2/3" />',"e('div',{style:{display:'flex',gap:12,alignItems:'center',maxWidth:360}},e(Skeleton,{shape:'circle'}),e('div',{style:{flex:1,display:'flex',flexDirection:'column',gap:8}},e(Skeleton,null),e(Skeleton,{className:'w-2/3'})))"),
 'Progress':('Progress Bar','Feedback',80,'<Progress label="Uploading files" value={60} tone="brand" />',"e('div',{style:{maxWidth:360}},e(Progress,{label:'Uploading files',value:60}))"),
 'EmptyState':('Empty State','Feedback',260,'<EmptyState icon="search" title="No results for “wade”" description="…" actions={<Button>…</Button>} />',
   "e(EmptyState,{icon:'search',title:'No results for “wade”',description:'Check the spelling or clear the filters.',actions:e(Button,{variant:'secondary'},'Clear filters')})"),
 'Card':('Card','Display',220,'<Card title="…" elevation="flat" actions={<>…</>}>Body</Card>',
   "grid(e(Card,{title:'Flat card',actions:[e(Button,{size:'sm',key:1},'Primary'),e(Button,{size:'sm',variant:'secondary',key:2},'Secondary')]},'Supporting text about one subject.'),e(Card,{title:'Raised card',elevation:'raised'},'Use on the canvas or when it needs emphasis.'))"),
 'Avatar':('Avatar','Display',70,'<Avatar name="Maria Santos" size="md" />',"row(e(Avatar,{name:'Maria Santos',size:'sm'}),e(Avatar,{name:'Maria Santos'}),e(Avatar,{name:'Maria Santos',size:'lg'}))"),
 'StatCard':('Stat Card','Display',150,'<StatCard label="Active members" value="1,284" trend={{ direction: "positive", value: "+12%" }} context="vs. last 30 days" />',
   "grid(e(StatCard,{label:'Active members',value:'1,284',trend:{direction:'positive',value:'+12%'},context:'vs. last 30 days'}),e(StatCard,{label:'Open issues',value:'23',trend:{direction:'negative',value:'+4'},context:'since Monday'}))"),
 'AILabel':('AI Label','AI patterns',70,'<AILabel type="generated" />',"row(e(AILabel,null),e(AILabel,{type:'edited'}))"),
 'Citation':('Citation','AI patterns',70,'<Citation n={1} title="Leave policy 2026" href="…" />',"row(e(Citation,{n:1,title:'Leave policy 2026',href:'#'}),e(Citation,{n:2,title:'HR portal · your balance',href:'#'}))"),
 'Icon':(None,'Foundations',120,'<Icon name="calendar" size={20} label="Due date" />',
   "e('div',{style:{display:'flex',flexWrap:'wrap',gap:14}},DXDS.iconNames.slice(0,36).map(function(n){return e(Icon,{key:n,name:n,size:24,className:'text-icon-primary'})}))"),
}
def strip_spec(md):
    lines=md.split('\n'); body='\n'.join(lines[1:])
    body=re.sub(r'\n---\n_Generated.*$','',body,flags=re.S)
    return body.strip()
written=[]
os.makedirs(out,exist_ok=True)
for name,(fig,group,h,usage,body) in CODED.items():
    d=f'{out}/{name}'; os.makedirs(d,exist_ok=True)
    if fig:
        c=by[fig]; spec=open(f"{root}/docs/components/{c['slug']}.md").read()
        summ=spec.split('\n')[2].lstrip('> ').strip()
        rest=strip_spec(spec); rest='\n'.join(rest.split('\n')[1:]).strip()
        md=f"# {name}\n\n{summ}\n\n## In code\n\n```tsx\nimport {{ {name} }} from \"@/components/ui\";\n\n{usage}\n```\n\nSource: `src/components/ui` in the repository. Figma name: **{fig}**.\n\n{rest}\n"
    else:
        md=f"# Icon\n\n69 icons on a 24 px grid with a 2 px round stroke, drawn in `currentColor` so they take their text colour.\n\n## In code\n\n```tsx\n{usage}\n```\n\nSizes 16, 20 (default) and 24 match `size-icon-sm|md|lg`. Without `label` the icon is decorative (`aria-hidden`); add a label only when the icon alone carries meaning. Direction icons flip in RTL; objects (clock, check) don't. Names: see the Icons asset group, or `iconNames` in code.\n"
    open(f'{d}/README.md','w').write(md)
    pv=f"""<!-- @dsCard group="{group}" height={h} -->
<div id="root" style="padding:16px"></div>
<script>
var e=React.createElement, DX=window.DXDS, {name}=DX.{name}, Button=DX.Button;
function row(){{return e('div',{{style:{{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}}},Array.prototype.slice.call(arguments))}}
function col(){{return e('div',{{style:{{display:'flex',flexDirection:'column',gap:12}}}},Array.prototype.slice.call(arguments))}}
function grid(){{return e('div',{{style:{{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}}},Array.prototype.slice.call(arguments))}}
function withKeys(x){{return x}}
ReactDOM.createRoot(document.getElementById('root')).render(e(function(){{return e(React.Fragment,null,{body})}}));
</script>
"""
    open(f'{d}/preview.html','w').write(pv); written.append(name)
coded_fig={v[0] for v in CODED.values() if v[0]}
ident=lambda n: re.sub(r'[^A-Za-z0-9]','',n.replace('·',''))
spec_only=[]
for c in comps:
    if c['n'] in coded_fig: continue
    nm=ident(c['n'])
    if nm[0].isdigit(): nm='C'+nm
    d=f'{out}/{nm}'; os.makedirs(d,exist_ok=True)
    spec=open(f"{root}/docs/components/{c['slug']}.md").read()
    summ=spec.split('\n')[2].lstrip('> ').strip()
    rest='\n'.join(strip_spec(spec).split('\n')[1:]).strip()
    open(f'{d}/README.md','w').write(f"# {nm}\n\n{summ}\n\n> **Spec only — not in the React kit yet.** Build it from this spec and the tokens; the Figma page shows every state. Figma name: **{c['n']}**.\n\n{rest}\n")
    spec_only.append(nm)
print(len(written),'coded;',len(spec_only),'spec-only')
