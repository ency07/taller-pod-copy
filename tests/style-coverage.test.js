/* Test de cobertura de estilos: los 49 estilos deben ser alcanzables en Auto.
   Regresión del bug donde AUD_STYLE_PREF (3 estilos/audiencia) actuaba como
   candado duro y solo 8 estilos salían en la práctica (20 inalcanzables).

   Ejecutar:  node tests/style-coverage.test.js
   Sale con código 1 si falla cualquier aserción. */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let checks = 0;
const failures = [];
function ok(cond, msg) { checks++; if (!cond) failures.push(msg); }

global.window = global;
global.document = { getElementById: function () { return null; }, querySelectorAll: function () { return []; } };

const JS = path.join(ROOT, 'js');
const ORDER = [
  'data-mercados.js',
  'data-audiencias.js',
  'data-bancos.js',
  'data-estilos.js',
  'dominios.js',
  'data-productos.js',
  'memoria-local.js',
  'motor-nucleo.js'
];
ORDER.forEach(function (f) {
  vm.runInThisContext(fs.readFileSync(path.join(JS, f), 'utf8'), { filename: f });
});

/* ---------- 1. Datos completos: 49 estilos en las 5 estructuras ---------- */
ok(typeof ESTILOS_LIST !== 'undefined', 'ESTILOS_LIST no cargado');
ok(ESTILOS_LIST.length === 49, 'ESTILOS_LIST debe tener 49 (37 + 12 DTF), tiene ' + (ESTILOS_LIST && ESTILOS_LIST.length));

const DTF = [
  'Indexed Palette / Paleta indizada',
  'Vector Flat / Plano vectorial',
  'Spot Color Simulated / Tintas planas simuladas',
  'Halftone Controlled / Tramado controlado',
  'Knockout / Reserva blanca',
  'Choke/Spread Trapping',
  'Distress Production / Desgaste de producción',
  'White Ink Optimized / Tinta blanca optimizada',
  'CMYK Safe Gamut / Gamut CMYK seguro',
  'Metallic Foil Ready / Listo para foil',
  'Glitter Zone / Zona glitter',
  'Glow Zone / Zona fosforescente'
];
DTF.forEach(function (s) {
  ok(ESTILOS_LIST.indexOf(s) !== -1, 'falta estilo DTF en ESTILO_INFO: ' + s);
  ok(STYLE_POOLS[s] && STYLE_POOLS[s].arquitectura && STYLE_POOLS[s].arquitectura.length >= 4, 'STYLE_POOLS incompleto: ' + s);
  ok(Array.isArray(SATURACION[s]) && SATURACION[s].length >= 2, 'SATURACION incompleta: ' + s);
  ok(Array.isArray(STYLE_COLOR_PREF[s]) && STYLE_COLOR_PREF[s].length >= 2, 'STYLE_COLOR_PREF incompleto: ' + s);
  ok(Array.isArray(STYLE_TIPO_PREF[s]) && STYLE_TIPO_PREF[s].length >= 2, 'STYLE_TIPO_PREF incompleto: ' + s);
});
ESTILOS_LIST.forEach(function (s) {
  ok(STYLE_POOLS[s], 'STYLE_POOLS sin entrada: ' + s);
  ok(SATURACION[s], 'SATURACION sin entrada: ' + s);
  ok(STYLE_COLOR_PREF[s], 'STYLE_COLOR_PREF sin entrada: ' + s);
  ok(STYLE_TIPO_PREF[s], 'STYLE_TIPO_PREF sin entrada: ' + s);
});

/* ---------- 2. AUD_STYLE_PREF ampliado (no solo 3/audiencia) ---------- */
const audIds = Object.keys(AUD_STYLE_PREF);
ok(audIds.length >= 20, 'AUD_STYLE_PREF debe tener 20+ audiencias, tiene ' + audIds.length);
const thin = audIds.filter(function (a) { return (AUD_STYLE_PREF[a] || []).length < 6; });
ok(thin.length === 0, 'audiencias con menos de 6 prefs (candado residual): ' + thin.join(', '));
const union = {};
audIds.forEach(function (a) { (AUD_STYLE_PREF[a] || []).forEach(function (s) { union[s] = true; }); });
const missing = ESTILOS_LIST.filter(function (s) { return !union[s]; });
ok(missing.length === 0, 'estilos en 0 prefs (inalcanzables por bias): ' + missing.join(' | '));

/* ---------- 3. Simulación dinámica con PRNG determinista ---------- */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
Math.random = mulberry32(20261008);

// Configurar estado del motor sin DOM
const marketsForStyleCoverage = ['colombia','global_en','global_es','gospel_es','gospel_en','anglo','latam','spain','diaspora_col','custom'];
const gospelAllowed = ["Folk Popular", "Vitral / Mosaico", "Barroco Ornamental", "Grabado / Linóleo", "Hand-Drawn", "Acuarela Suelta", "Sumi-e / Tinta Lavada", "Minimal Modern", "Bordado / Puntada", "Ukiyo-e / Woodblock", "Retro 70s", "Kids Storybook", "Collage Cut-Paper", "Papercraft 3D", "Airbrush Smooth", "Foil Stamp / Metallic", "Vintage Desgastado", "Bohemian"];
marketsForStyleCoverage.forEach(function (market) {
  MOTOR_STATE.market = market;
  const pool = _styleCandidatesForContext();
  if (market === 'gospel_es' || market === 'gospel_en') {
    ok(pool.length === 18 && pool.every(function (s) { return gospelAllowed.indexOf(s) !== -1; }), market + ': debe usar solo los 18 estilos aprobados');
  } else {
    ok(pool.length === ESTILOS_LIST.length && ESTILOS_LIST.every(function (s) { return pool.indexOf(s) !== -1; }), market + ': debe permitir los 49 estilos registrados');
  }
});
MOTOR_STATE.market = 'global_es';
MOTOR_STATE.region = 'global';
MOTOR_STATE.subniche = 'auto';
MOTOR_STATE.product = 'CAMISETA SOFT';
MOTOR_STATE.groupMode = 'distintos';
MOTOR_STATE.audienceMulti = 'no';

const testAuds = ['unisex_nacional', 'global_joven_es', 'global_adulto_es', 'global_familia_es',
  'coste_joven_m', 'andino_adulto_m', 'llanos_identidad', 'infantil_col'];

const seen = {};
let noRepeatViolations = 0;
let quotaViolations = 0;
const GENS = 300;
for (let g = 0; g < GENS; g++) {
  MOTOR_STATE.concept = 'style-coverage-generation-' + g;
  const aud = testAuds[g % testAuds.length];
  const audsPerKey = { A: aud, B: aud, C: aud };
  const out = resolveEstilos(audsPerKey);
  const vals = [out.A, out.B, out.C];
  vals.forEach(function (s) { seen[s] = (seen[s] || 0) + 1; });
  // Sin repetidos intra-set en modo distintos
  if (new Set(vals).size !== 3) noRepeatViolations++;
  // Cuota: al menos 1 fuera del top-3 de la audiencia
  const top3 = (AUD_STYLE_PREF[aud] || []).slice(0, 3);
  const outside = vals.filter(function (s) { return top3.indexOf(s) === -1; });
  if (outside.length < 1) quotaViolations++;
}
const seenList = Object.keys(seen);
ok(noRepeatViolations === 0, 'repetidos intra-set en ' + noRepeatViolations + '/' + GENS + ' generaciones (modo distintos)');
ok(quotaViolations === 0, 'cuota de exploración falló en ' + quotaViolations + '/' + GENS + ' generaciones');
ok(seenList.length >= 42, 'cobertura pobre: solo ' + seenList.length + '/49 estilos en ' + GENS + ' gens (mín 42). Vistos: ' + seenList.join(' | '));

// Todos los 49 alcanzables: barrido exhaustivo por audiencia × semilla
const reachSeen = {};
testAuds.forEach(function (aud, ai) {
  Math.random = mulberry32(9000 + ai);
  for (let g = 0; g < 60; g++) {
    MOTOR_STATE.concept = 'style-reachability-' + ai + '-' + g;
    const out = resolveEstilos({ A: aud, B: aud, C: aud });
    [out.A, out.B, out.C].forEach(function (s) { reachSeen[s] = true; });
  }
});
const unreachable = ESTILOS_LIST.filter(function (s) { return !reachSeen[s]; });
ok(unreachable.length === 0, 'estilos inalcanzables en Auto: ' + unreachable.join(' | '));

// STYLE_CANDIDATES y AUD_STYLE_PREF no deben excluir estilos en mercados no Gospel.
MOTOR_STATE.market = 'global_en';
MOTOR_STATE.subniche = 'skate_culture';
const candidatesWithSubniche = _styleCandidatesForContext();
ok(candidatesWithSubniche.length === ESTILOS_LIST.length, 'STYLE_CANDIDATES no debe filtrar estilos en mercados no Gospel');
ok(ESTILOS_LIST.every(function (s) { return candidatesWithSubniche.indexOf(s) !== -1; }), 'todos los estilos deben seguir disponibles');
MOTOR_STATE.market = 'global_es';
MOTOR_STATE.subniche = 'auto';

// Cobertura de uso: al menos 20 estilos distintos en 10 generaciones por mercado.
['global_en', 'colombia'].forEach(function (market) {
  MOTOR_STATE.market = market;
  MOTOR_STATE.region = market === 'colombia' ? 'colombia' : 'global';
  MOTOR_STATE.groupMode = 'distintos';
  MOTOR_STATE.subniche = 'auto';
  const seenInTenSets = {};
  for (let g = 0; g < 10; g++) {
    MOTOR_STATE.concept = 'ten-set-style-coverage-' + market + '-' + g;
    const out = resolveEstilos({ A: 'unisex_nacional', B: 'unisex_nacional', C: 'unisex_nacional' });
    [out.A, out.B, out.C].forEach(function (style) { seenInTenSets[style] = true; });
  }
  ok(Object.keys(seenInTenSets).length >= 20, market + ': en 10 generaciones deben aparecer al menos 20 estilos distintos; aparecieron ' + Object.keys(seenInTenSets).length);
});
MOTOR_STATE.market = 'global_es';
MOTOR_STATE.region = 'global';

/* ---------- 4. groupMode mismo: 1 solo estilo ---------- */
Math.random = mulberry32(777);
MOTOR_STATE.groupMode = 'mismo';
const mismoOut = resolveEstilos({ A: 'unisex_nacional', B: 'unisex_nacional', C: 'unisex_nacional' });
ok(mismoOut.A === mismoOut.B && mismoOut.B === mismoOut.C, 'groupMode mismo debe dar 1 estilo en A/B/C');
ok(ESTILOS_LIST.indexOf(mismoOut.A) !== -1, 'estilo de groupMode mismo fuera de lista: ' + mismoOut.A);
MOTOR_STATE.groupMode = 'distintos';

/* ---------- 5. Funciones de contador expuestas ---------- */
ok(typeof getStyleUsageCounter === 'function', 'falta getStyleUsageCounter en memoria-local.js');
ok(typeof recordStyleUse === 'function', 'falta recordStyleUse en memoria-local.js');
recordStyleUse('global_es', 'CAMISETA SOFT', 'Vector Flat / Plano vectorial');
const counter = getStyleUsageCounter('global_es', 'CAMISETA SOFT');
ok(counter['Vector Flat / Plano vectorial'] > 0, 'recordStyleUse no registra uso');

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  style-coverage  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  X ' + f); });
process.exit(passed ? 0 : 1);
