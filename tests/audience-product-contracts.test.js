/* Contratos de audiencia y producto. Ejecutar con Node; sin DOM ni proveedores. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
global.window = global;
vm.runInThisContext(fs.readFileSync(path.join(root, 'js/data-audiencias.js'), 'utf8'), { filename: 'data-audiencias.js' });
let checks = 0;
const failures = [];
function ok(condition, message) { checks++; if (!condition) failures.push(message); }

const expectedGospel = ['gospel_hombre','gospel_mujer','gospel_infantil','gospel_familia','gospel_pareja','gospel_comunidad'];
['gospel_es','gospel_en'].forEach(function (market) {
  const ids = getAudiencesForMarketRegion(market, 'global');
  ok(JSON.stringify(ids) === JSON.stringify(expectedGospel), market + ' debe exponer el catálogo Gospel canónico compacto');
  ids.forEach(function (id) {
    ok(!!AUD_PROFILES[id], market + ': perfil existente para ' + id);
    ok(!!AUD_STYLE_PREF[id] && AUD_STYLE_PREF[id].length > 0, market + ': preferencias de estilo funcionales para ' + id);
    ok(!!AUD_HIERARCHY_PREF[id] && AUD_HIERARCHY_PREF[id].length > 0, market + ': preferencias de jerarquía funcionales para ' + id);
    ok(!!AUD_DENSITY_PREF[id] && AUD_DENSITY_PREF[id].length > 0, market + ': preferencias de densidad funcionales para ' + id);
    ok(!!AUD_LAYOUT_PREF[id] && AUD_LAYOUT_PREF[id].length > 0, market + ': preferencias de composición funcionales para ' + id);
  });
});
ok(getAudiencesForMarketRegion('global_en', 'global').every(function (id) { return id.indexOf('gospel_') !== 0; }), 'Global English no debe mostrar audiencias Gospel');
ok(getAudiencesForMarketRegion('global_es', 'global').every(function (id) { return id.indexOf('gospel_') !== 0; }), 'Global Español no debe mostrar audiencias Gospel');
ok(getAudiencesForMarketRegion('colombia', 'todas').every(function (id) { return id.indexOf('gospel_') !== 0 && id.indexOf('global_') !== 0; }), 'Colombia no debe mezclar audiencias Gospel/Global en región todas');

// IDs legacy siguen existiendo para no romper memorias, locks ni datos guardados.
['gospel_joven_fe','gospel_adulto_fe','gospel_familia_fe','gospel_youth_faith','gospel_adult_faith','gospel_family_faith'].forEach(function (id) {
  ok(!!AUD_PROFILES[id], 'mantener perfil legacy ' + id);
});

// Contratos nuevos: catálogo por mercado, compatibilidad por subnicho y selector dinámico.
ok(typeof getAudiencesForSubniche === 'function', 'resolver por subnicho debe estar exportado');
ok(typeof getAudienceSelectOptions === 'function', 'helper de opciones de audiencia debe estar exportado');
ok(getAudiencesForSubniche('skate_culture', 'global', 'global_en').every(function (id) {
  return ['global_young_en','global_adult_en','global_family_en'].includes(id);
}), 'subnicho global en inglés debe conservar el pool del mercado y no importar audiencias colombianas');
ok(getAudiencesForSubniche('fe_popular_col', 'todas', 'colombia').every(function (id) {
  return id.indexOf('global_') !== 0 && id.indexOf('gospel_') !== 0;
}), 'fe_popular_col en Colombia no debe cruzar perfiles globales ni Gospel');
ok(getAudiencesForSubniche('gospel_es', 'global', 'gospel_es').every(function (id) {
  return id.indexOf('gospel_') === 0;
}), 'subnicho Gospel debe limitarse al catálogo Gospel');
ok(getAudienceSelectOptions('global', 'global_es', 'auto').includes('global_joven_es'), 'selector debe usar mercado global español');
ok(!getAudienceSelectOptions('global', 'global_es', 'auto').includes('coste_joven_m'), 'selector global español no debe incluir audiencia costeña');

// Regresión transversal: todos los mercados deben devolver IDs reales y aislados.
const marketRegions = {
  colombia: 'todas',
  global_en: 'global',
  global_es: 'global_es',
  gospel_es: 'global',
  gospel_en: 'global',
  anglo: 'global',
  latam: 'global',
  spain: 'global',
  diaspora_col: 'global',
  custom: 'global'
};
Object.keys(marketRegions).forEach(function (market) {
  const ids = getAudiencesForMarketRegion(market, marketRegions[market]);
  ok(ids.length > 0, market + ': catálogo de audiencias no vacío');
  ok(ids.every(function (id) { return !!AUD_PROFILES[id]; }), market + ': todos los IDs tienen perfil');
  const options = getAudienceSelectOptions(marketRegions[market], market, 'auto');
  ok(options.indexOf('value="Auto"') !== -1, market + ': selector conserva Auto');
  ids.forEach(function (id) {
    ok(options.indexOf('value="' + id + '"') !== -1, market + ': selector incluye ' + id);
  });
});
ok(getAudiencesForMarketRegion('custom', 'global').some(function (id) { return id.indexOf('global_joven_es') === 0; }), 'custom debe permitir audiencias en español');
ok(getAudiencesForMarketRegion('custom', 'global').some(function (id) { return id.indexOf('global_young_en') === 0; }), 'custom debe permitir audiencias en inglés');

const globalSubniches = [
  'pets','professions','hobbies','sarcasm_introvert','fitness_mental','family_milestones',
  'music_fandom','food_drink','outdoors_nature','retro_nostalgia','travel_adventure',
  'inspirational_clean','streetwear','tattoo_lifestyle','motorcycle_biker','vanlife_nomad',
  'plant_parent','booktok_reader','gaming_setup','coffee_culture','skate_culture',
  'surf_culture','crypto_web3','ai_tech','valentines','st_patricks','easter','mothers_day',
  'fathers_day','pride','back_to_school','halloween','thanksgiving','christmas','new_year','black_friday'
];
Object.keys(marketRegions).forEach(function (market) {
  globalSubniches.forEach(function (subniche) {
    const base = getAudiencesForMarketRegion(market, marketRegions[market]);
    const result = getAudiencesForSubniche(subniche, marketRegions[market], market);
    ok(Array.isArray(result), market + '/' + subniche + ': devuelve una lista');
    ok(result.length > 0, market + '/' + subniche + ': mantiene opciones válidas');
    ok(result.every(function (id) { return base.indexOf(id) !== -1; }), market + '/' + subniche + ': no filtra audiencias de otro mercado');
  });
});

// Los cambios de mercado/región/subnicho deben refrescar el selector en el motor.
const motor = fs.readFileSync(path.join(root, 'js/motor-nucleo.js'), 'utf8');
ok(/function refreshAudienceSelector\(\)/.test(motor), 'motor define actualización del selector de audiencia');
ok(/\['market', 'region', 'subniche'\][\s\S]{0,220}refreshAudienceSelector/.test(motor), 'mercado, región y subnicho actualizan la audiencia');
ok(/select\.value = allowed \? previous : 'Auto'/.test(motor), 'cambio de contexto reinicia a Auto una audiencia incompatible');
ok(/getAudiencesForSubniche\(subniche, region, market\)/.test(motor), 'motor consulta compatibilidad por mercado y subnicho');

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const products = ['CAMISETA SOFT','CAMISETA APPAREL','HOODIE','GORRA','MUG','MOCHILA','TOTE BAG','FUNDA MÓVIL','ILUSTRACION PREMIUM APPAREL','DISPLATE'];
products.forEach(function (product) { ok(index.includes('<option>' + product + '</option>') || index.includes('<option selected>' + product + '</option>'), 'selector UI debe conservar el producto ' + product); });
const productSource = fs.readFileSync(path.join(root, 'js/data-productos.js'), 'utf8');
products.forEach(function (product) {
  ok(productSource.includes('"' + product + '"'), 'datos de producto deben contemplar ' + product);
});
ok(/DISPLATE[\s\S]{0,700}NO usar lógica de camiseta/i.test(productSource), 'Displate debe prohibir la lógica de camiseta');
ok(/GORRA[\s\S]{0,700}cero escenas completas/i.test(productSource), 'gorra debe priorizar arte compacto y legible');
ok(/CAMISETA SOFT[\s\S]{0,700}cero microtexto/i.test(productSource), 'camiseta soft debe exigir legibilidad textil y evitar microtexto');
ok(/ILUSTRACION PREMIUM APPAREL[\s\S]{0,700}no es póster de pared/i.test(productSource), 'ilustración premium apparel debe seguir siendo textil, no póster');
if (failures.length) {
  console.error('FAIL (' + failures.length + '/' + checks + ')\n- ' + failures.join('\n- '));
  process.exitCode = 1;
} else {
  console.log('PASS (' + checks + ' checks): audience/product contracts');
}
