const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const readJson = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
function flatten(value, prefix = '', result = {}) {
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof child === 'string') result[fullKey] = child;
    else if (child && typeof child === 'object') flatten(child, fullKey, result);
  }
  return result;
}
const en = flatten(readJson('src/i18n/en.json'));
const km = flatten(readJson('src/i18n/km.json'));
const workspace = readJson('src/i18n/workspace-km.json');
const context = {
  exports: {},
  require(id) {
    if (id === './config') return { flatDictionaries: { en, km } };
    if (id === './workspace-km.json') return workspace;
    throw new Error(`Unexpected import: ${id}`);
  },
};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, 'src/i18n/workspace-translations.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, context);
const tx = context.exports.translateWorkspaceText;
assert.equal(tx('Save draft', 'en'), 'Save draft');
assert.equal(tx('Save draft', 'km'), workspace['Save draft']);
assert.equal(tx('  Save draft ', 'km'), `  ${workspace['Save draft']} `);
assert.equal(tx('AI_INTERVIEW_REQUIRED', 'km'), workspace['AI interview required']);
assert.equal(tx('Candidate-provided content 123', 'km'), 'Candidate-provided content 123');
assert.equal(tx('Edit {0}', 'en', { 0: 'My resume' }), 'Edit My resume');
assert.equal(tx('Edit {0}', 'km', { 0: 'My resume' }), 'កែសម្រួល My resume');
assert.equal(tx('Edit {0}', 'km', { 0: '{1}' }), 'កែសម្រួល {1}');
for (const [key, value] of Object.entries(workspace)) {
  assert.ok(value.trim(), `Empty translation: ${key}`);
  assert.deepEqual([...key.matchAll(/\{\w+\}/g)].map(m => m[0]).sort(), [...value.matchAll(/\{\w+\}/g)].map(m => m[0]).sort(), `Placeholders: ${key}`);
}
function walk(p) { return fs.readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)]); }
const known = new Set([...Object.values(en), ...Object.keys(workspace)].map(s => s.trim().toLowerCase()));
const missing = new Set();
let calls = 0;
for (const file of walk(path.join(root, 'src')).filter(p => p.endsWith('.tsx'))) {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('useWorkspaceTranslation')) continue;
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(sf) === 'tx' && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      calls++;
      const text = node.arguments[0].text.trim();
      if (/[A-Za-z]/.test(text) && !known.has(text.toLowerCase())) missing.add(text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}
const examples = new Set(['Acme Inc.', 'BSc Computer Science', 'Frontend Developer', 'Frontend developer · Phnom Penh', 'ISTAD Store', 'Jan 2024', 'Mar 2026', 'Job board redesign', 'Led the redesign of the checkout flow\nCut page load time by 40%', 'Next.js, TypeScript, PostgreSQL', 'Phnom Penh', 'Remote / Phnom Penh, Cambodia', 'Royal University of Phnom Penh', 'URL', 'github.com/you/project', 'linkedin.com/in/you']);
const untranslated = [...missing].filter(s => !examples.has(s));
assert.deepEqual(untranslated, [], 'Untranslated workspace UI copy');
console.log(`Translation checks passed: ${Object.keys(workspace).length} Khmer entries, ${calls} static UI references.`);
