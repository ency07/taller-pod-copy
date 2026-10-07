/* Test de sandbox de bancos: ningún mercado puede recibir objetos de otro
   idioma, ni objetos gospel en mercados seculares (ni viceversa), ni subnichos
   de un mercado en otro. Determinista, sin DOM, sin navegador.

   Ejecutar:  node tests/bank-sandbox.test.js
   Sale con código 1 si falla cualquier aserción. */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

global.window = global;
global.document = { getElementById: function () { return null; }, querySelectorAll: function () { return []; } };

const JS = path.join(__dirname, '..', 'js');
const ORDER = [
  'data-mercados.js',
  'data-audiencias.js',
  'data-bancos.js',
  'banco-gospel-es.js',
  'banco-gospel-en.js',
  'banco-global.js',
  'dominios.js',
  'data-estilos.js'
];

ORDER.forEach(function (f) {
  vm.runInThisContext(fs.readFileSync(path.join(JS, f), 'utf8'), { filename: f });
});

/* ---------- expectativas por mercado (independientes de la implementación) ---------- */
const EXPECT_LANG = {
  colombia: 'es',
  diaspora_col: 'es',
  latam: 'es',
  spain: 'es',
  global_es: 'es',
  gospel_es: 'es',
  global_en: 'en',
  anglo: 'en',
  gospel_en: 'en',
  custom: 'en'
};
const GOSPEL_MARKETS = ['gospel_es', 'gospel_en'];
const MARKETS = Object.keys(EXPECT_LANG);

/* ---------- universo de objetos por idioma (derivado de los datos) ---------- */
const EN_KEYS = global.POD_BANK_KEYS_EN || [];
const ES_KEYS = global.POD_BANK_KEYS_ES || [];

const enOnly = new Set(); // solo bajo claves EN
const esOnly = new Set(); // solo bajo claves ES
const gospelObjs = new Set();
const secularCommon = new Set();

Object.keys(POD_SUBNICHES).forEach(function (id) {
  const s = POD_SUBNICHES[id];
  if (!s || !s.bank) return;
  const en = new Set(), es = new Set();
  Object.keys(s.bank).forEach(function (k) {
    const arr = s.bank[k];
    if (!Array.isArray(arr)) return;
    const target = EN_KEYS.indexOf(k) !== -1 ? en : (ES_KEYS.indexOf(k) !== -1 ? es : null);
    if (!target) return;
    arr.forEach(function (o) { if (typeof o === 'string') target.add(o.trim()); });
  });
  en.forEach(function (o) { if (!es.has(o)) enOnly.add(o); });
  es.forEach(function (o) { if (!en.has(o)) esOnly.add(o); });
});

GOSPEL_MARKETS.forEach(function (m) {
  const id = m === 'gospel_es' ? 'gospel_es' : 'gospel_en';
  const s = POD_SUBNICHES[id];
  if (!s || !s.bank) return;
  Object.keys(s.bank).forEach(function (k) {
    (s.bank[k] || []).forEach(function (o) { if (typeof o === 'string') gospelObjs.add(o.trim()); });
  });
});

(Array.isArray(global.OBJECT_BANK_COMMON) ? global.OBJECT_BANK_COMMON : []).forEach(function (o) {
  secularCommon.add(String(o).trim());
});

/* ---------- aserciones ---------- */
let checks = 0;
const failures = [];

function fail(msg) { failures.push(msg); }
function ok(cond, msg) { checks++; if (!cond) fail(msg); }

MARKETS.forEach(function (market) {
  const lang = EXPECT_LANG[market];
  const isGospel = GOSPEL_MARKETS.indexOf(market) !== -1;
  const regions = (POD_MARKET_REGIONS[market] || []).map(function (r) { return r.id; });
  ok(regions.length > 0, market + ': sin regiones');

  ['evergreen', 'temporada'].forEach(function (group) {
    regions.forEach(function (region) {
      let ids = [];
      try { ids = getSubnicheIdsForMarket(market, group, region) || []; } catch (e) { ids = []; }
      ids = ids.filter(function (v, i, a) { return a.indexOf(v) === i; });

      ids.forEach(function (id) {
        const pool = getBankForSubniche(id, region, market);

        ok(pool.length > 0, market + '/' + region + '/' + id + ': pool VACÍO');

        // 1) idioma: cero objetos del otro idioma
        const leaked = pool.filter(function (o) {
          return lang === 'en' ? esOnly.has(o) : enOnly.has(o);
        });
        ok(leaked.length === 0,
          market + '/' + region + '/' + id + ': ' + leaked.length + ' objetos de otro idioma (ej: "' + String(leaked[0]).slice(0, 60) + '")');

        // 2) gospel: nada secular; seculares: nada gospel
        if (isGospel) {
          const bad = pool.filter(function (o) { return !gospelObjs.has(o); });
          ok(bad.length === 0,
            market + '/' + region + '/' + id + ': ' + bad.length + ' objetos no-gospel (ej: "' + String(bad[0]).slice(0, 60) + '")');
          const secular = pool.filter(function (o) { return secularCommon.has(o); });
          ok(secular.length === 0, market + '/' + id + ': contiene el banco común secular');
        } else {
          const bad = pool.filter(function (o) { return gospelObjs.has(o); });
          ok(bad.length === 0, market + '/' + region + '/' + id + ': contiene objetos gospel');
        }
      });
    });
  });

  // 3) ids cruzados: los subnichos colombianos/gospel no aparecen en otros mercados
  if (['colombia', 'diaspora_col', 'gospel_es', 'gospel_en'].indexOf(market) === -1) {
    let all = [];
    regions.forEach(function (region) {
      ['evergreen', 'temporada'].forEach(function (g) {
        try { all = all.concat(getSubnicheIdsForMarket(market, g, region) || []); } catch (e) {}
      });
    });
    all = all.filter(function (v, i, a) { return a.indexOf(v) === i; });
    const colIds = all.filter(function (id) { return /_col$/.test(id); });
    ok(colIds.length === 0, market + ': expone subnichos colombianos ' + JSON.stringify(colIds.slice(0, 3)));
    const gospIds = all.filter(function (id) { return id === 'gospel_es' || id === 'gospel_en'; });
    ok(gospIds.length === 0, market + ': expone subnichos gospel ' + JSON.stringify(gospIds));
  }
});

/* 4) prueba dirigida: región desconocida + banco global nunca mezcla idiomas.
   Es la ruta que antes caía a "concatena TODAS las claves". */
['global_en', 'anglo', 'global_es', 'latam', 'spain', 'diaspora_col', 'custom'].forEach(function (market) {
  const lang = EXPECT_LANG[market];
  ['pets', 'food_drink', 'christmas'].forEach(function (id) {
    const pool = getBankForSubniche(id, 'region_que_no_existe', market);
    const leaked = pool.filter(function (o) { return lang === 'en' ? esOnly.has(o) : enOnly.has(o); });
    ok(pool.length > 0, market + '/region_que_no_existe/' + id + ': pool VACÍO');
    ok(leaked.length === 0,
      market + '/region_que_no_existe/' + id + ': ' + leaked.length + ' objetos de otro idioma (ej: "' + String(leaked[0]).slice(0, 60) + '")');
  });
});

/* 5) el banco común por idioma tampoco se cruza */
const commonES = Array.isArray(global.OBJECT_BANK_COMMON) ? global.OBJECT_BANK_COMMON : [];
const commonEN = Array.isArray(global.OBJECT_BANK_COMMON_EN) ? global.OBJECT_BANK_COMMON_EN : [];
ok(commonES.length === 20, 'OBJECT_BANK_COMMON debería tener 20, tiene ' + commonES.length);
ok(commonEN.length === 20, 'OBJECT_BANK_COMMON_EN debería tener 20, tiene ' + commonEN.length);
const commonLeak = commonEN.filter(function (o) { return esOnly.has(o); });
ok(commonLeak.length === 0, 'El banco común EN contiene objetos ES: ' + JSON.stringify(commonLeak.slice(0, 2)));

/* ---------- resultado ---------- */
const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  bank-sandbox  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  ✗ ' + f); });
process.exit(passed ? 0 : 1);
