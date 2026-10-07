/* Test de config Supabase por defecto: URL + anon key van en código
   (públicas por diseño) para que cada dispositivo solo pida correo+clave.
   El panel puede sobrescribirlas; si se vacían, se vuelve al default.

   Ejecutar:  node tests/supabase-cfg.test.js */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let checks = 0;
const failures = [];
function ok(cond, msg) { checks++; if (!cond) failures.push(msg); }

const src = fs.readFileSync(path.join(ROOT, 'js', 'sync-supabase.js'), 'utf8');

ok(/var DEFAULT_CFG = \{/.test(src), 'falta DEFAULT_CFG en sync-supabase.js');
ok(/url: 'https:\/\/[a-z0-9-]+\.supabase\.co'/.test(src), 'DEFAULT_CFG.url no es URL Supabase válida');
const jm = src.match(/anonKey: '(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)'/);
ok(!!jm, 'DEFAULT_CFG.anonKey no es JWT');
if (jm) {
  try {
    const payload = JSON.parse(Buffer.from(jm[1].split('.')[1], 'base64').toString('utf8'));
    ok(payload.role === 'anon', 'el JWT por defecto no es rol anon (rol=' + payload.role + ')');
    ok(payload.ref && src.indexOf(payload.ref) !== -1, 'el JWT no corresponde a la URL del proyecto');
  } catch (e) {
    ok(false, 'JWT por defecto no decodificable');
  }
}
ok(/saved\.url \|\| DEFAULT_CFG\.url/.test(src), 'getCfg no usa la URL por defecto como respaldo');
ok(/saved\.anonKey \|\| DEFAULT_CFG\.anonKey/.test(src), 'getCfg no usa la anon key por defecto como respaldo');
const allowedWarnings = ['NO usa service_role', 'Nunca uses service_role', 'No uses service_role'];
const others = src.split('\n').filter(function (ln, i) {
  if (ln.toLowerCase().indexOf('service_role') === -1) return false;
  return !allowedWarnings.some(function (w) { return ln.indexOf(w) !== -1; });
});
ok(others.length === 0, 'service_role fuera de avisos conocidos: ' + JSON.stringify(others.slice(0, 2)));

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  supabase-cfg  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  ✗ ' + f); });
process.exit(passed ? 0 : 1);
