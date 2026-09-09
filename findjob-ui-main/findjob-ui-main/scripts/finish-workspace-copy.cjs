const fs = require('fs');
const path = require('path');
const ts = require('typescript');
function walk(p) {return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
const files=walk('src').filter(p=>p.endsWith('.tsx')&&fs.readFileSync(p,'utf8').includes('useWorkspaceTranslation'));
const patterns=new Set();
const decode=s=>s.replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&nbsp;/g,'\u00a0');
for(const file of files) {
 const source=fs.readFileSync(file,'utf8'); const sf=ts.createSourceFile(file,source,99,true,ts.ScriptKind.TSX);const edits=[];const owners=new Set();
 function owner(n){for(let p=n.parent;p;p=p.parent)if(ts.isFunctionDeclaration(p)&&p.name&&/^[A-Z]|^use[A-Z]/.test(p.name.text)&&p.body)return p;}
 function edit(n,text){edits.push({start:n.getStart(sf),end:n.end,text});const fn=owner(n);if(fn)owners.add(fn);}
 function visit(n){
  const fn=owner(n);
  if(fn&&ts.isCallExpression(n)&&n.expression.getText(sf)==='tx'&&n.arguments[0]){
   const a=n.arguments[0];
   if(ts.isStringLiteral(a)&&decode(a.text)!==a.text){edit(a,JSON.stringify(decode(a.text)));return;}
   if(ts.isTemplateExpression(a)){
    let key=a.head.text;const params=[];
    a.templateSpans.forEach((s,i)=>{key+=`{${i}}`+s.literal.text;params.push(`${JSON.stringify(i)}: ${s.expression.getText(sf)}`);});
    patterns.add(key);edit(n,`tx(${JSON.stringify(key)}, { ${params.join(', ')} })`);return;
   }
  }
  if(fn&&ts.isCallExpression(n)&&n.expression.getText(sf)==='getApiErrorMessage'){
    const arg=n.arguments[1];if(arg&&ts.isStringLiteral(arg))edit(arg,`tx(${arg.getText(sf)})`);
  }
  if(fn&&ts.isJsxExpression(n)&&n.expression&&!ts.isJsxAttribute(n.parent)){
   const e=n.expression;const text=e.getText(sf);
   if(ts.isTemplateExpression(e)&&/[a-zA-Z]{2}/.test(e.head.text+e.templateSpans.map(s=>s.literal.text).join(''))){
    let key=e.head.text;const params=[];e.templateSpans.forEach((s,i)=>{key+=`{${i}}`+s.literal.text;params.push(`${JSON.stringify(i)}: ${s.expression.getText(sf)}`);});
    patterns.add(key);edit(e,`tx(${JSON.stringify(key)}, { ${params.join(', ')} })`);return;
   }
   if((text==='children'&&/^(Chip|GhostChip|StatusPill|SectionLabel)$/.test(fn.name.text))|| /^(statusLabel|stageLabel|emptyText|hint|subtitle|caption|badge)$/.test(text)||/^\w+\.(status|visibility)$/.test(text)||/^statusLabel\(/.test(text)) {edit(e,`tx(${text})`);return;}
  }
  ts.forEachChild(n,visit);
 }
 visit(sf);
 for(const fn of owners) if(!/const tx = useWorkspaceTranslation\(\)/.test(fn.body.getText(sf))) edits.push({start:fn.body.getStart(sf)+1,end:fn.body.getStart(sf)+1,text:'\n  const tx = useWorkspaceTranslation();'});
 let output=source;for(const e of edits.sort((a,b)=>b.start-a.start))output=output.slice(0,e.start)+e.text+output.slice(e.end);fs.writeFileSync(file,output);
}
const dict=JSON.parse(fs.readFileSync('src/i18n/workspace-km.json','utf8'));
for(const [k,v] of Object.entries(dict))if(decode(k)!==k){dict[decode(k)]=v;delete dict[k];}
fs.writeFileSync('src/i18n/workspace-km.json',JSON.stringify(dict,null,2)+'\n');
fs.writeFileSync('scripts/workspace-patterns.json',JSON.stringify([...patterns],null,2));
