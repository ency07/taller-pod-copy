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


const editor = fs.readFileSync(path.join(ROOT, 'editor-bancos.html'), 'utf8');
const sync = fs.readFileSync(path.join(ROOT, 'js/sync-supabase.js'), 'utf8');
const sql = fs.readFileSync(path.join(ROOT, 'supabase-sync.sql'), 'utf8');
ok(/function escHtml\(value\)[\s\S]*?replace\(\/&\/g, '&amp;'\)[\s\S]*?replace\(\/>\/g, '&gt;'\)/.test(editor), 'editor must fully escape bank labels and names');
ok(/function safeTemplateImage\(value\)[\s\S]*?data:image/.test(editor), 'template image sources must be restricted to supported image data URLs');
ok(editor.includes('escHtml(t.nombre)') && editor.includes('escHtml(b.name)'), 'template and bank names must be escaped before HTML rendering');
ok(/markets\[id\]\.label/.test(editor) && /escHtml\(markets\[id\]\.label\)/.test(editor) && /escHtml\(id\).*escHtml\(label\)/s.test(editor), 'market and seasonal subniche options must escape values and labels');
ok(/changeLink\.textContent = 'Cambiar'/.test(analysis) && /option\.textContent = String\(b\.name/.test(analysis), 'analysis UI must render template and bank names as text');
ok(/const sessionKeys = JSON\.parse\(sessionRaw \|\| 'null'\)/.test(analysis), 'vision fallback should use only session-scoped API keys');
ok(!/fetch\(ep\(s\.provider, s\.model\) \+ '\?key=/.test(reviewer), 'reviewer Gemini requests must not put API keys in URLs');
ok(/using \(\(select auth\.uid\(\)\) = user_id\)/.test(sql), 'Supabase read policy must restrict rows to authenticated owner');
ok(/with check \(\(select auth\.uid\(\)\) = user_id\)/.test(sql), 'Supabase insert/update policy must enforce authenticated owner');
ok(/enable row level security/.test(sql) && /revoke all on table public\.pod_project_sync from anon/.test(sql), 'Supabase sync table must enable RLS and revoke anon privileges');
ok(!/service_role/i.test(sync.match(/var DEFAULT_CFG = \{[\s\S]*?\n  \};/)?.[0] || ''), 'Supabase client defaults must not contain service_role credentials');
ok(/if \(!user\) throw new Error\('Inicia sesión antes de sincronizar\.'\)/.test(sync), 'sync must require an authenticated user');
ok(/\.eq\('user_id', user\.id\)/.test(sync), 'sync reads must be scoped to the authenticated user id');
ok(/if \(q\.error\) throw q\.error/.test(sync) && /if \(up\.error\) throw up\.error/.test(sync), 'sync must stop on database read/write errors');
ok(/mergeMemoryObjects\(localPayload, remotePayload\)/.test(sync), 'sync must use the explicit memory merge routine when available');


ok(/function getGeminiSlot\(\)[\s\S]*?window\.sessionStorage[\s\S]*?sessionKeys\[index\]/.test(analysis), 'legacy Gemini helper must use session-scoped keys');
ok(!/return slots\.find\(function \(s\) \{[\s\S]*?s\.key/.test(analysis), 'legacy Gemini helper must not return persisted keys');
ok(/_escapeOptionText\(r\.id\)/.test(analysis) && /_escapeOptionText\(r\.label\)/.test(analysis), 'region option values and labels must be escaped');
ok(/function _subnicheOptions\(ids\)[\s\S]*?_escapeOptionText\(id\)[\s\S]*?_escapeOptionText\(label\)/.test(analysis), 'subniche option values and labels must be escaped');
ok(/_escapeOptionText\(a\)/.test(analysis) && /_escapeOptionText\(label\)/.test(analysis), 'audience option values and labels must be escaped');
ok(/_escapeOptionText\(id\)[\s\S]*?_escapeOptionText\(langs\[id\]\)/.test(analysis), 'language selector values and labels must be escaped');
ok(!/el\.innerHTML\s*=\s*['"]Template activo:/.test(analysis), 'template hint must not interpolate persistent template data into HTML');
ok(/\.replace\(/.test(reviewer.match(/function escA\(s\)[\s\S]*?\n  }/)?.[0] || '') && /replace\(\/</.test(reviewer), 'reviewer HTML attribute escaping must include angle brackets');

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + ' security-regression (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.error(' - ' + f); });
process.exit(passed ? 0 : 1);
