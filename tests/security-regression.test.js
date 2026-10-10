/* Security regressions for DOM status handling and browser API-key persistence.
   Static contract tests; they do not replace an end-to-end browser/XSS audit. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let checks = 0;
const failures = [];
function ok(cond, msg) { checks++; if (!cond) failures.push(msg); }

const analysis = fs.readFileSync(path.join(ROOT, 'js/ia-analisis.js'), 'utf8');
const reviewer = fs.readFileSync(path.join(ROOT, 'js/ia-revisor.js'), 'utf8');

ok(/function tell\(msg\)[\s\S]*?statusEl\.textContent/.test(analysis), 'analysis status must render plain text');
ok(!/function tell\(msg\)[\s\S]*?statusEl\.innerHTML\s*=\s*msg/.test(analysis), 'analysis tell must not insert arbitrary message as HTML');
ok(!analysis.includes('AIzaSyTESTCONNECTIVITY'), 'preflight must not contain a fake API key');
ok(!/generativelanguage\.googleapis\.com\/v1beta\/models\/[^'\n]*\?key=/.test(analysis), 'Gemini requests should not append API key to URL');
ok((analysis.match(/x-goog-api-key/g) || []).length >= 2, 'Gemini vision and connection test must send key via header');
ok(/function tellStatus\(msg\)[\s\S]*?st\.textContent\s*=\s*String\(msg/.test(reviewer), 'reviewer status must render plain text');
ok(!/function tellStatus\(msg\)[\s\S]*?st\.innerHTML\s*=/.test(reviewer), 'reviewer status must not use message as HTML');
ok(/SESSION_KEYS_KEY\s*=/.test(reviewer) && /window\.sessionStorage\.setItem\(SESSION_KEYS_KEY/.test(reviewer), 'API keys must be saved to sessionStorage');
ok(/LS\.setItem\(SLOTS_KEY, JSON\.stringify\(arr\.map\(function \(s\) \{ return Object\.assign\(\{\}, s, \{ key: '' \}\); \}\)\)\)/.test(reviewer), 'persistent provider settings must blank the key field');
ok(/hasPersistedKeys/.test(reviewer) && /key: ''/.test(reviewer), 'legacy persisted keys must be scrubbed on read');
ok(/Clave API \(solo esta pestaña\)/.test(reviewer), 'UI must disclose session-only key lifetime');

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + ' security-regression (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.error(' - ' + f); });
process.exit(passed ? 0 : 1);
