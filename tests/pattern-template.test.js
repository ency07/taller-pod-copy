/* Test de productos nuevos (MOCHILA / TOTE BAG / FUNDA MÓVIL) y banco de
   templates para patrón repetido. Verifica: mapas completos, helpers, UI
   (taller + editor), bloque TEMPLATE en el prompt y CRUD del banco.

   Ejecutar:  node tests/pattern-template.test.js
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

/* ---------- 1. Productos nuevos en los 4 mapas ---------- */
const NEW_PRODUCTS = ['MOCHILA', 'TOTE BAG', 'FUNDA MÓVIL'];
NEW_PRODUCTS.forEach(function (p) {
  ok(PRODUCT_BIAS[p], 'PRODUCT_BIAS sin ' + p);
  ok(PRODUCT_BIAS[p] && Array.isArray(PRODUCT_BIAS[p].layout) && PRODUCT_BIAS[p].layout.length >= 3, 'PRODUCT_BIAS[' + p + '] sin layouts');
  ok(PRODUCT_BIAS[p] && PRODUCT_BIAS[p].scale && PRODUCT_BIAS[p].mockup && PRODUCT_BIAS[p].safeMargin, 'PRODUCT_BIAS[' + p + '] incompleto (scale/mockup/safeMargin)');
  ok(PLACEMENT[p], 'PLACEMENT sin ' + p);
  ok(PRODUCT_RULES[p], 'PRODUCT_RULES sin ' + p);
  ok(PRODUCT_MOCKUP_RULES[p], 'PRODUCT_MOCKUP_RULES sin ' + p);
});
ok(typeof isCase === 'function' && isCase('FUNDA MÓVIL') && !isCase('MUG'), 'isCase roto');
ok(typeof isBag === 'function' && isBag('MOCHILA') && isBag('TOTE BAG') && !isBag('GORRA'), 'isBag roto');
ok(isTextile('MOCHILA') && isTextile('TOTE BAG') && !isTextile('FUNDA MÓVIL'), 'isTextile debe excluir funda (carcasa rígida)');

/* ---------- 2. UI: taller + editor ---------- */
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
NEW_PRODUCTS.forEach(function (p) {
  ok(indexHtml.indexOf('<option>' + p + '</option>') !== -1, 'index.html sin opción ' + p);
});
ok(indexHtml.indexOf('id="tplActiveHint"') !== -1, 'index.html sin hint de template activo');
const analisis = fs.readFileSync(path.join(JS, 'ia-analisis.js'), 'utf8');
ok(/function updateTemplateHint/.test(analisis), 'ia-analisis.js sin updateTemplateHint');
ok(/on\('product', 'change', updateTemplateHint\)/.test(analisis), 'ia-analisis.js sin wiring product->hint');
const editor = fs.readFileSync(path.join(ROOT, 'editor-bancos.html'), 'utf8');
['tplProduct', 'tplName', 'tplFile', 'tplPreview', 'tplZones', 'tplNotes', 'btnSaveTpl', 'tplList'].forEach(function (id) {
  ok(editor.indexOf('id="' + id + '"') !== -1, 'editor-bancos.html sin #' + id);
});
ok(/function renderTplList/.test(editor) && /function saveTpl/.test(editor), 'editor-bancos.html sin lógica de templates');
const motor = fs.readFileSync(path.join(JS, 'motor-nucleo.js'), 'utf8');
ok(/TEMPLATE: /.test(motor) && /getActiveTemplate/.test(motor), 'motor-nucleo.js sin bloque TEMPLATE');

/* ---------- 3. Banco de templates: CRUD en vivo ---------- */
ok(typeof listTemplates === 'function', 'falta listTemplates');
ok(typeof saveTemplate === 'function', 'falta saveTemplate');
ok(typeof getActiveTemplate === 'function', 'falta getActiveTemplate');
ok(typeof setActiveTemplate === 'function', 'falta setActiveTemplate');
ok(Array.isArray(TEMPLATE_PRODUCTS) && TEMPLATE_PRODUCTS.length === 3, 'TEMPLATE_PRODUCTS debe tener 3 productos');
['MOCHILA', 'TOTE BAG', 'FUNDA MÓVIL'].forEach(function (p) {
  const z = defaultTemplateZones(p);
  ok(Array.isArray(z) && z.length >= 3, 'zonas por defecto insuficientes: ' + p);
  ok(z.some(function (x) { return x.uso === 'excluir'; }), 'zonas de ' + p + ' sin exclusión');
});

// Guardar válido
const tinyImg = 'data:image/jpeg;base64,' + 'A'.repeat(1000);
const r1 = saveTemplate({ nombre: 'Mochila frente test', producto: 'MOCHILA', imagen: tinyImg, notas: 'solo frente' });
ok(r1.ok && r1.id, 'saveTemplate válido falló: ' + (r1.error || ''));
const got = getTemplate(r1.id);
ok(got && got.nombre === 'Mochila frente test' && got.zonas.length >= 3, 'getTemplate no devuelve lo guardado');

// Producto no admitido
const rBad = saveTemplate({ nombre: 'X', producto: 'GORRA', imagen: tinyImg });
ok(!rBad.ok, 'saveTemplate aceptó producto fuera del banco (GORRA)');

// Imagen pesada
const rBig = saveTemplate({ nombre: 'Pesada', producto: 'MOCHILA', imagen: 'x'.repeat(800 * 1024) });
ok(!rBig.ok, 'saveTemplate aceptó imagen >700KB');

// Activar / desmarcar
ok(setActiveTemplate('MOCHILA', r1.id).ok, 'setActiveTemplate falló');
const active = getActiveTemplate('MOCHILA');
ok(active && active.id === r1.id, 'getActiveTemplate no devuelve el activo');
ok(getActiveTemplate('TOTE BAG') === null, 'TOTE BAG no debería tener activo');
ok(setActiveTemplate('MOCHILA', null).ok && getActiveTemplate('MOCHILA') === null, 'desactivar falló');

// Renombrar y borrar
ok(renameTemplate(r1.id, 'Mochila v2').ok, 'renameTemplate falló');
ok(getTemplate(r1.id).nombre === 'Mochila v2', 'rename no aplicado');
setActiveTemplate('MOCHILA', r1.id);
ok(deleteTemplate(r1.id).ok, 'deleteTemplate falló');
ok(getTemplate(r1.id) === null && getActiveTemplate('MOCHILA') === null, 'borrar no limpió activo');

/* ---------- 4. Bloque TEMPLATE en el prompt ---------- */
MOTOR_STATE.market = 'global_es';
MOTOR_STATE.region = 'global';
MOTOR_STATE.product = 'MOCHILA';
MOTOR_STATE.subniche = 'auto';
MOTOR_STATE.concept = 'prueba';
MOTOR_STATE.message = '';
const rr = saveTemplate({ nombre: 'Mochila urbana test', producto: 'MOCHILA', imagen: tinyImg, notas: 'solo panel frontal' });
setActiveTemplate('MOCHILA', rr.id);
function ficha(estilo) {
  return {
    estilo: estilo, audiencia: 'unisex_nacional', jerarquiaVisual: 'BALANCEADO',
    objeto: 'mochila de viaje', arquitectura: 'a', composicion: 'b', layout: 'Axial centrado',
    placement: 'panel frontal', escalaProducto: 'media', formaSimbolo: 'c', tecnica: 'd',
    tratamiento: 'e', textoPrincipal: 'T', textoApoyo: 'A', textoTerciario: 'S',
    tipografia: 'Sans humanista limpia', paleta: 'pal (modo: X)', familiaColor: 'f',
    fitAudiencia: 80, fitProducto: 80
  };
}
const out = formatPrompt({ set: { A: ficha('Minimal Modern'), B: ficha('Brutalist'), C: ficha('Retro 70s') } });
ok(out.indexOf('TEMPLATE: Mochila urbana test (MOCHILA)') !== -1, 'prompt sin bloque TEMPLATE');
ok(out.indexOf('ZONAS:') !== -1 && out.indexOf('[excluir]') !== -1, 'prompt sin zonas del template');
ok(out.indexOf('MOCHILA:') !== -1, 'prompt sin PRODUCTO MOCHILA');
setActiveTemplate('MOCHILA', null);
deleteTemplate(rr.id);
const out2 = formatPrompt({ set: { A: ficha('Minimal Modern'), B: ficha('Brutalist'), C: ficha('Retro 70s') } });
ok(out2.indexOf('TEMPLATE:') === -1, 'prompt cita template sin activo');

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  pattern-template  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  X ' + f); });
process.exit(passed ? 0 : 1);
