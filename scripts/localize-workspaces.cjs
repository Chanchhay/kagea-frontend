// One-time, syntax-aware migration of workspace UI copy. Never rewrites API values.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const roots = ['src/app/(job-seeker)', 'src/app/(recruiter)', 'src/components/job-seeker', 'src/components/recruiter', 'src/components/messages', 'src/components/notifications', 'src/components/workspace'];
const shared = ['WorkspaceShell', 'PageHeader'].map(x => `src/components/layout/${x}.tsx`).concat(['ApiCards','ErrorState','EmptyState','FileDropzone','FormFields','SearchInput','FilterBar'].map(x => `src/components/shared/${x}.tsx`));
function walk(p) { return fs.readdirSync(p, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(p,e.name)) : [path.join(p,e.name)]); }
const files = [...roots.flatMap(walk), ...shared, 'src/components/public/SaveJobButton.tsx', 'src/components/shared/RichTextEditor.tsx'].filter(p => p.endsWith('.tsx') && (process.argv.includes('--remaining') ? !fs.readFileSync(p,'utf8').includes('useWorkspaceTranslation') : !/templates|Document\.tsx/.test(p)));
const copy = new Set();
const attrs = new Set(['title','description','label','placeholder','aria-label','alt','message','submitLabel','emptyMessage','emptyTitle','emptyDescription','tooltip']);
const rendered = /^(label|description|placeholder|submitLabel|emptyMessage|emptyTitle|emptyDescription|pageTitle|pageDescription)$/;
function human(s) { return /[A-Za-z]/.test(s) && !/^https?:|^\/|^@|^[\w.-]+@/.test(s); }
function add(s) { if(human(s)) copy.add(s); }
for (const file of files) {
 const source = fs.readFileSync(file,'utf8');
 const sf = ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const edits=[]; const owners=new Set();
 function owner(n) { for(let p=n.parent;p;p=p.parent) { if(ts.isFunctionDeclaration(p) && p.name && /^[A-Z]|^use[A-Z]/.test(p.name.text) && p.body) return p; if(ts.isArrowFunction(p) && ts.isVariableDeclaration(p.parent) && /^[A-Z]|^use[A-Z]/.test(p.parent.name.getText(sf)) && ts.isBlock(p.body)) return p; } }
 function edit(n,value,fn) { edits.push({start:n.getStart(sf),end:n.end,value}); owners.add(fn); }
 function literals(n) { if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)) { add(n.text); return; } if(ts.isConditionalExpression(n)) {literals(n.whenTrue);literals(n.whenFalse);} else if(ts.isBinaryExpression(n) && [ts.SyntaxKind.BarBarToken,ts.SyntaxKind.QuestionQuestionToken,ts.SyntaxKind.AmpersandAmpersandToken].includes(n.operatorToken.kind)) literals(n.right); }
 function expr(n) {
   if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)) {add(n.text); return human(n.text)?`tx(${n.getText(sf)})`:n.getText(sf);}
   if(ts.isConditionalExpression(n)) return `${n.condition.getText(sf)} ? ${expr(n.whenTrue)} : ${expr(n.whenFalse)}`;
   if(ts.isBinaryExpression(n) && [ts.SyntaxKind.BarBarToken,ts.SyntaxKind.QuestionQuestionToken,ts.SyntaxKind.AmpersandAmpersandToken].includes(n.operatorToken.kind)) return `${n.left.getText(sf)} ${n.operatorToken.getText(sf)} ${expr(n.right)}`;
   if((ts.isIdentifier(n)&&rendered.test(n.text)) || (ts.isPropertyAccessExpression(n)&& /^(label|description)$/.test(n.name.text) && !/job|hire|profile|company|resume|portfolio|notification|message|thread|candidate/i.test(n.expression.getText(sf))) || (ts.isCallExpression(n)&&/^(formatEnum|humanize|formatStatus)$/.test(n.expression.getText(sf)))) return `tx(${n.getText(sf)})`;
   return n.getText(sf);
 }
 function visit(n) {
   // Collect static option/config labels, defaults, and user-facing feedback too.
   if(ts.isStringLiteral(n)&&human(n.text) && (/^[A-Z][a-z]/.test(n.text)|| (ts.isPropertyAssignment(n.parent)&&attrs.has(n.parent.name.getText(sf))))) add(n.text);
   const fn=owner(n);
   if(fn && ts.isJsxText(n)) {
     const lines=n.text.replace(/\r/g,'').split('\n');
     const cleaned=lines.map((line,i)=>{let s=line.replace(/\t/g,' ');if(i>0)s=s.trimStart();if(i<lines.length-1)s=s.trimEnd();return s;}).filter(Boolean).join(' ');
     if(human(cleaned.trim())) {add(cleaned.trim()); edit(n,`{tx(${JSON.stringify(cleaned)})}`,fn);} return;
   }
   if(fn && ts.isJsxAttribute(n) && attrs.has(n.name.getText(sf)) && n.initializer) {
     const v=n.initializer;
     if(ts.isStringLiteral(v)&&human(v.text)) {add(v.text);edit(v,`{tx(${JSON.stringify(v.text)})}`,fn);return;}
     if(ts.isJsxExpression(v)&&v.expression) {literals(v.expression); edit(v,`{tx(${v.expression.getText(sf)})}`,fn);return;}
   }
   if(fn && ts.isJsxExpression(n) && n.expression && !ts.isJsxAttribute(n.parent)) {
     const result=expr(n.expression);
     if(result!==n.expression.getText(sf)) {edit(n.expression,result,fn);return;}
   }
   // Feedback literals, excluding backend messages and anything stored in forms.
   if(fn && ts.isCallExpression(n) && /^(toast\.(success|error|info)|setError|window\.confirm|confirm)$/.test(n.expression.getText(sf))) {
     const a=n.arguments[0]; if(a && (ts.isStringLiteral(a)||ts.isConditionalExpression(a))) {const result=expr(a);if(result!==a.getText(sf)) edit(a,result,fn);}
   }
   ts.forEachChild(n,visit);
 }
 visit(sf);
 if(edits.length && process.argv.includes('--write')) {
   for(const fn of owners) edits.push({start:fn.body.getStart(sf)+1,end:fn.body.getStart(sf)+1,value:'\n  const tx = useWorkspaceTranslation();'});
   const directive=sf.statements.find(n=>ts.isExpressionStatement(n)&&ts.isStringLiteral(n.expression)&&n.expression.text==='use client');
   const offset=directive?directive.end:0;
   edits.push({start:offset,end:offset,value:`${directive?'\n':'"use client";\n'}import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";\n`});
   let output=source;for(const e of edits.sort((a,b)=>b.start-a.start)) output=output.slice(0,e.start)+e.value+output.slice(e.end);
   fs.writeFileSync(file,output);
 }
}
fs.writeFileSync('scripts/workspace-copy.json',JSON.stringify([...copy].sort(),null,2)+'\n');
console.log(`${files.length} files; ${copy.size} copy strings`);
