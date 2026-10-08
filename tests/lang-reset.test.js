/* Test de regla de idioma: al cambiar de mercado, TODOS los selectores
   dependientes saltan al idioma/coherencia del mercado nuevo, aunque se
   hubieran fijado a mano. Lo manual solo vale dentro del mercado actual.
   Dentro del mismo mercado, lo manual válido se preserva.

   Ejecutar:  node tests/lang-reset.test.js
   Sale con código 1 si falla cualquier aserción. */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const JS = path.join(ROOT, 'js');
let checks = 0;
const failures = [];
function ok(cond, msg) { checks++; if (!cond) failures.push(msg); }

const analisisSrc = fs.readFileSync(path.join(JS, 'ia-analisis.js'), 'utf8');

/* ---------- 1. Estático: mecanismo de reset ---------- */
ok(/var _marketResetPending = false/.test(analisisSrc), 'falta flag _marketResetPending');
ok(/function onMarketChange\(\)/.test(analisisSrc), 'falta onMarketChange');
ok(/on\('market', 'change', onMarketChange\)/.test(analisisSrc), 'market no usa onMarketChange');
ok(/window\.onMarketChange = onMarketChange/.test(analisisSrc), 'onMarketChange no expuesto');
['updateRegionSelect', 'updateSubnicheSelect', 'updateAudienceSelect',
 'updateLanguageSelect', 'updatePbDomSelect', 'updateDominioSelect',
 'updateDomImagenSelect'].forEach(function (fn) {
  const i = analisisSrc.indexOf('\n  function ' + fn + '(');
  const j = analisisSrc.indexOf('\n  function ', i + 10);
  const body = i === -1 ? '' : analisisSrc.slice(i, j === -1 ? undefined : j);
  ok(body.indexOf('_marketResetPending') !== -1, fn + ' ignora el flag de reset');
});

/* ---------- 2. Runtime con DOM falso ---------- */
function fakeSelect(value) {
  const el = {
    value: value, options: [], _html: '', style: {}, open: false,
    addEventListener: function () {}
  };
  Object.defineProperty(el, 'innerHTML', {
    get: function () { return this._html; },
    set: function (h) {
      this._html = String(h);
      const m = this._html.match(/<option value="([^"]*)"/g) || [];
      this.options = m.map(function (s) { return { value: s.slice(15, -1) }; });
      if (this.options.length) this.value = this.options[0].value;
    }
  });
  return el;
}
const els = {};
function $(id) { return els[id] || null; }
['market', 'region', 'subniche', 'audienceSet', 'language', 'dominio',
 'domImagen', 'pbDom', 'concept', 'message', 'dominioHelp',
 'tplActiveHint', 'product'].forEach(function (id) { els[id] = fakeSelect(''); });
els.concept.value = '';
els.message.value = '';

global.window = global;
global.document = {
  getElementById: function (id) { return els[id] || null; },
  querySelectorAll: function () { return []; },
  readyState: 'complete',
  createElement: function () { return { style: {}, getContext: function () { return null; } }; },
  addEventListener: function () {},
  body: { appendChild: function () {} }
};

['data-mercados.js', 'data-audiencias.js', 'data-bancos.js', 'dominios.js',
 'memoria-local.js', 'motor-nucleo.js'].forEach(function (f) {
  vm.runInThisContext(fs.readFileSync(path.join(JS, f), 'utf8'), { filename: f });
});
vm.runInThisContext(analisisSrc, { filename: 'ia-analisis.js' });

ok(typeof global.onMarketChange === 'function', 'onMarketChange no accesible');

function setAll(o) { Object.keys(o).forEach(function (k) { els[k].value = o[k]; }); }
function snap() {
  return {
    market: els.market.value, region: els.region.value, subniche: els.subniche.value,
    audience: els.audienceSet.value, lang: els.language.value, dom: els.dominio.value,
    domImg: els.domImagen.value, pb: els.pbDom.value
  };
}

/* ---------- 3. Reset total colombia → global EN ----------
   (primero cascade sin reset para normalizar; lo manual se simula DESPUÉS,
   igual que un usuario que elige tras el auto-switch) */
setAll({ market: 'colombia', region: '', subniche: '', audienceSet: '',
  language: '', dominio: '', domImagen: '', pbDom: '' });
els.market.value = 'colombia';
global.cascadeUpdate();
setAll({ region: 'costa_caribe', subniche: 'humor_costeno',
  audienceSet: 'coste_joven_m', language: 'es', dominio: 'CALLE',
  domImagen: 'CALLE', pbDom: 'humor_costeno' });
global.cascadeUpdate();
let s = snap();
ok(s.subniche === 'humor_costeno', 'setup colombia perdió subnicho manual válido (' + s.subniche + ')');

els.market.value = 'global_en';
global.onMarketChange();
s = snap();
const expRegion = POD_MARKET_REGIONS.global_en[0].id;
const expLang = getMarket('global_en').language;
ok(s.region === expRegion, 'región no saltó a ' + expRegion + ' (' + s.region + ')');
ok(s.subniche === 'auto', 'subnicho manual sobrevivió al cambio de mercado (' + s.subniche + ')');
ok(s.audience === 'Auto', 'audiencia manual sobrevivió (' + s.audience + ')');
ok(s.lang === expLang, 'idioma no saltó a ' + expLang + ' (' + s.lang + ')');
ok(s.dom === 'auto', 'dominio manual sobrevivió (' + s.dom + ')');
ok(s.domImg === 'Auto', 'domImagen manual sobrevivió (' + s.domImg + ')');
ok(s.pb === 'comun', 'banco personal no volvió a común (' + s.pb + ')');

/* ---------- 4. Dentro del mismo mercado se preserva ---------- */
els.market.value = 'colombia';
global.onMarketChange();
const reg = els.region.value;
const validSubs = getSubnicheIdsForMarket('colombia', 'evergreen', reg);
const pickSub = validSubs.filter(function (id) { return id !== 'auto'; })[0];
const poolAud = getAudiencesForMarketRegion('colombia', reg);
ok(pickSub && poolAud.length, 'sin datos para preservación en ' + reg);
// 4a. subnicho manual válido
els.subniche.value = pickSub;
global.cascadeUpdate();
ok(els.subniche.value === pickSub, 'subnicho manual válido no se preservó (' + els.subniche.value + ')');
// 4b. audiencia manual válida (subnicho en auto para no filtrar)
els.subniche.value = 'auto';
els.audienceSet.value = poolAud[0];
global.cascadeUpdate();
ok(els.audienceSet.value === poolAud[0], 'audiencia manual válida no se preservó');
// 4c. idioma no-default manual (relativo al mercado actual: colombia=es)
const colDefault = getMarket('colombia').language;
const nonDefault = colDefault === 'es' ? 'en' : 'es';
els.language.value = nonDefault;
global.cascadeUpdate();
ok(els.language.value === nonDefault, 'idioma manual no-default no se preservó');
// 4d. dominio manual válido
if (getListaDominios('colombia').some(function (d) { return d.id === 'CALLE'; })) {
  els.dominio.value = 'CALLE';
  els.domImagen.value = 'CALLE';
  els.pbDom.value = pickSub;
  global.cascadeUpdate();
  ok(els.dominio.value === 'CALLE', 'dominio manual válido no se preservó');
  ok(els.domImagen.value === 'CALLE', 'domImagen manual no se preservó');
  ok(els.pbDom.value === pickSub, 'banco personal válido no se preservó');
}

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  lang-reset  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  X ' + f); });
process.exit(passed ? 0 : 1);
