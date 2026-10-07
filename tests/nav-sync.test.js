/* Test de navegación cruzada y sincronización entre las 4 vistas.
   Verifica: links relativos (Vercel-safe) en las 4 páginas, una sola
   página activa por vista, scripts de sync cargados en orden, y
   round-trip del contexto compartido POD2|ui|context.

   Ejecutar:  node tests/nav-sync.test.js
   Sale con código 1 si falla cualquier aserción. */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PAGES = ['index.html', 'editor-bancos.html', 'motor-lenguajes-visuales.html', 'sistema_matriz.html'];

let checks = 0;
const failures = [];
function ok(cond, msg) { checks++; if (!cond) failures.push(msg); }

const html = {};
PAGES.forEach(function (p) {
  const f = path.join(ROOT, p);
  ok(fs.existsSync(f), 'falta la página ' + p);
  html[p] = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
});

/* 1) cada página enlaza a las otras 3 con href relativo (sin / inicial ni http) */
PAGES.forEach(function (p) {
  PAGES.forEach(function (q) {
    if (p === q) return;
    const rel = 'href="' + q + '"';
    ok(html[p].indexOf(rel) !== -1, p + ' no enlaza a ' + q + ' con href relativo');
  });
  const absLinks = (html[p].match(/href="\/(?!\/)[^"]*\.html"/g) || [])
    .concat(html[p].match(/href="https?:\/\/[^"]*\.html"/g) || []);
  ok(absLinks.length === 0, p + ' tiene links absolutos a páginas: ' + JSON.stringify(absLinks));
});

/* 2) exactamente un aria-current="page" por página */
PAGES.forEach(function (p) {
  const n = (html[p].match(/<a[^>]*aria-current="page"/g) || []).length;
  ok(n === 1, p + ' debe tener 1 aria-current, tiene ' + n);
});

/* 3) editor: memoria-local.js ANTES del script inline (si no, POD_LS es stub no-op) */
(function () {
  const e = html['editor-bancos.html'];
  const iMem = e.indexOf('js/memoria-local.js');
  const iLS = e.indexOf('var LS = window.POD_LS');
  ok(iMem !== -1, 'editor no carga js/memoria-local.js (el banco personal no persistiría)');
  ok(iMem !== -1 && iLS !== -1 && iMem < iLS, 'editor debe cargar memoria-local.js antes de usar POD_LS');
  ok(e.indexOf('js/pod-nav.js') !== -1, 'editor no carga js/pod-nav.js');
})();

/* 4) index y motor cargan pod-nav.js */
ok(html['index.html'].indexOf('js/pod-nav.js') !== -1, 'index no carga js/pod-nav.js');
ok(html['motor-lenguajes-visuales.html'].indexOf('js/pod-nav.js') !== -1, 'motor no carga js/pod-nav.js');
ok(fs.existsSync(path.join(ROOT, 'js', 'pod-nav.js')), 'falta js/pod-nav.js');

/* 5) funcional: round-trip save/load + prefill solo-vacíos + capture */
(function () {
  const store = {};
  const listeners = {};
  const els = {
    concept: { tagName: 'INPUT', value: '', options: [] },
    market: { tagName: 'SELECT', value: 'colombia', options: [{ value: 'colombia' }, { value: 'global_en' }] }
  };
  global.window = global;
  global.localStorage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem: function (k, v) { store[k] = String(v); },
    removeItem: function (k) { delete store[k]; }
  };
  global.document = {
    readyState: 'complete',
    getElementById: function (id) { return els[id] || null; },
    addEventListener: function () {}
  };
  global.addEventListener = function (t, fn) { listeners[t] = fn; };
  vm.runInThisContext(fs.readFileSync(path.join(ROOT, 'js', 'pod-nav.js'), 'utf8'), { filename: 'pod-nav.js' });

  const PODNav = global.PODNav;
  ok(PODNav && typeof PODNav.saveContext === 'function' && typeof PODNav.loadContext === 'function',
    'PODNav no expone save/load');
  ok(PODNav.CTX_KEY === 'POD2|ui|context', 'clave de contexto inesperada: ' + PODNav.CTX_KEY);

  PODNav.saveContext({ market: 'global_en', concepto: 'Gracia' });
  const ctx = PODNav.loadContext();
  ok(ctx.market === 'global_en' && ctx.concepto === 'Gracia', 'round-trip de contexto roto: ' + JSON.stringify(ctx));

  /* prefill rellena el input vacío pero NO pisa el select con valor */
  PODNav.prefill();
  ok(els.concept.value === 'Gracia', 'prefill no rellenó campo vacío');
  ok(els.market.value === 'colombia', 'prefill pisó un campo con valor (debe respetar trabajo existente)');

  /* valor inválido para select se ignora */
  els.market.value = '';
  PODNav.saveContext({ market: 'mercado_inexistente' });
  PODNav.prefill();
  ok(els.market.value === '', 'prefill aceptó opción inexistente en select');

  /* capture() guarda lo visible */
  els.concept.value = 'Fe';
  els.market.value = 'global_en';
  const cap = PODNav.capture();
  ok(cap.concepto === 'Fe' && cap.market === 'global_en', 'capture no guardó lo visible');

  ok(typeof listeners.pagehide === 'function', 'pagehide no enganchado (no se guardaría al navegar)');
  delete global.PODNav;
})();

/* ---------- resultado ---------- */
const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  nav-sync  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  ✗ ' + f); });
process.exit(passed ? 0 : 1);
