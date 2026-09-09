const fs=require('fs'),path=require('path'),ts=require('typescript');
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
for(const file of walk('src').filter(p=>p.endsWith('.tsx'))){
 const source=fs.readFileSync(file,'utf8');if(!source.includes('useWorkspaceTranslation'))continue;
 const sf=ts.createSourceFile(file,source,99,true,ts.ScriptKind.TSX),edits=[];
 function authored(n){return ts.isPropertyAccessExpression(n)&&/^(title|summary|description|name|fullName|companyName|jobTitle)$/.test(n.name.text)&&/job|resume|portfolio|company|profile|interview|session|candidate|user|data|section/i.test(n.expression.getText(sf));}
 function visit(n){if(ts.isCallExpression(n)&&n.expression.getText(sf)==='tx'&&n.arguments.length===1){const a=n.arguments[0];let text;if(authored(a))text=a.getText(sf);else if(ts.isBinaryExpression(a)&&authored(a.left)&&[ts.SyntaxKind.BarBarToken,ts.SyntaxKind.QuestionQuestionToken].includes(a.operatorToken.kind))text=`${a.left.getText(sf)} ${a.operatorToken.getText(sf)} tx(${a.right.getText(sf)})`;if(text){edits.push({start:n.getStart(sf),end:n.end,text});return;}}ts.forEachChild(n,visit);}
 visit(sf);let out=source;for(const e of edits.sort((a,b)=>b.start-a.start))out=out.slice(0,e.start)+e.text+out.slice(e.end);if(out!==source)fs.writeFileSync(file,out);
}
