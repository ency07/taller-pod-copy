/* Test de bancos personales con nombre (Fase 2): crear con nombre propio,
   guardar en ellos, clonar/renombrar/eliminar, activar por subnicho y
   alimentación al motor vía getPersonalObjects/getPersonalPhrases.
   El banco legacy por subnicho sigue intacto.

   Ejecutar:  node tests/bank-named.test.js
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

global.window = global;
global.document = { getElementById: function () { return null; }, querySelectorAll: function () { return []; } };

const memSrc = fs.readFileSync(path.join(JS, 'memoria-local.js'), 'utf8');
const analisisSrc = fs.readFileSync(path.join(JS, 'ia-analisis.js'), 'utf8');
const editorHtml = fs.readFileSync(path.join(ROOT, 'editor-bancos.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* ---------- 1. Estático ---------- */
['createPersonalBank', 'listPersonalBanks', 'getPersonalBank',
 'renamePersonalBank', 'deletePersonalBank', 'clonePersonalBank',
 'saveToPersonalBank', 'getActivePersonalBank', 'setActivePersonalBank'
].forEach(function (fn) {
  ok(memSrc.indexOf('function ' + fn + '(') !== -1, 'memoria-local.js sin ' + fn);
  ok(memSrc.indexOf('window.' + fn + ' = ' + fn) !== -1, 'memoria-local.js no expone ' + fn);
});
['nbName', 'nbSubniche', 'nbTarget', 'nbList', 'btnCreateBank'].forEach(function (id) {
  ok(editorHtml.indexOf('id="' + id + '"') !== -1, 'editor-bancos.html sin #' + id);
});
ok(indexHtml.indexOf('id="pbBank"') !== -1, 'index.html sin #pbBank');
ok(indexHtml.indexOf('id="pbBankName"') !== -1, 'index.html sin #pbBankName');
ok(/function updatePbBankSelect/.test(analisisSrc), 'ia-analisis.js sin updatePbBankSelect');
ok(/pbBankName/.test(analisisSrc) && /createPersonalBank/.test(analisisSrc), 'savePersonalBankFromUI no crea bancos con nombre');

/* ---------- 2. Runtime ---------- */
vm.runInThisContext(memSrc, { filename: 'memoria-local.js' });

// Crear
let r = createPersonalBank('global_es', 'Frases mamá 2026', 'dia_madre_padre');
ok(r.ok && r.id, 'create falló: ' + (r.error || ''));
ok(createPersonalBank('global_es', 'x', 'comun').ok === false, 'create aceptó nombre corto');
ok(createPersonalBank('global_es', 'Frases mamá 2026', 'comun').ok === false, 'create aceptó duplicado');
// Listar
let list = listPersonalBanks('global_es');
ok(list.length === 1 && list[0].name === 'Frases mamá 2026' && list[0].subniche === 'dia_madre_padre', 'list incorrecto');
ok(listPersonalBanks('global_en').length === 0, 'fuga entre mercados');
// Guardar con dedup
let s = saveToPersonalBank('global_es', r.id, { objects: ['Rosa roja en mano arrugada', 'rosa roja en mano ARRUGADA', 'ab'] });
ok(s.ok && s.added === 1 && s.duplicates >= 1, 'dedup falló: ' + JSON.stringify(s));
s = saveToPersonalBank('global_es', r.id, { phrases: ['Te amo mamá', 'te amo mama'] });
ok(s.added === 1, 'frases no guardadas');
// Renombrar
ok(renamePersonalBank('global_es', r.id, 'Mamá v2').ok, 'rename falló');
ok(getPersonalBank('global_es', r.id).name === 'Mamá v2', 'rename no aplicado');
ok(renamePersonalBank('global_es', r.id, 'x').ok === false, 'rename aceptó corto');
// Clonar
const rc = clonePersonalBank('global_es', r.id, 'Mamá copia');
ok(rc.ok && rc.id !== r.id, 'clone falló');
const cp = getPersonalBank('global_es', rc.id);
ok(cp.objects.length === 1 && cp.phrases.length === 1, 'clone no copió contenido');
// Activar y alimentar al motor
ok(setActivePersonalBank('global_es', 'dia_madre_padre', r.id).ok, 'activate falló');
const act = getActivePersonalBank('global_es', 'dia_madre_padre');
ok(act && act.id === r.id, 'getActive no devuelve el banco');
const objs = getPersonalObjects('global_es', 'dia_madre_padre');
ok(objs.indexOf('Rosa roja en mano arrugada') !== -1, 'banco activo no alimenta getPersonalObjects');
const phrs = getPersonalPhrases('global_es', 'dia_madre_padre');
ok(phrs.indexOf('Te amo mamá') !== -1, 'banco activo no alimenta getPersonalPhrases');
// Otro subnicho no ve el banco
ok(getPersonalObjects('global_es', 'navidad_colombia').indexOf('Rosa roja en mano arrugada') === -1, 'fuga entre subnichos');
// Desactivar y borrar
ok(setActivePersonalBank('global_es', 'dia_madre_padre', null).ok, 'deactivate falló');
ok(getActivePersonalBank('global_es', 'dia_madre_padre') === null, 'sigue activo tras quitar');
setActivePersonalBank('global_es', 'dia_madre_padre', rc.id);
ok(deletePersonalBank('global_es', rc.id).ok, 'delete falló');
ok(getPersonalBank('global_es', rc.id) === null, 'borrado no aplicado');
ok(getActivePersonalBank('global_es', 'dia_madre_padre') === null, 'borrar no limpió activo');
// Legacy intacto
const lr = addPersonalObjects('global_es', 'dia_madre_padre', ['Objeto legacy de prueba']);
ok(lr.added === 1, 'banco legacy roto');
ok(getPersonalObjects('global_es', 'dia_madre_padre').indexOf('Objeto legacy de prueba') !== -1, 'legacy no legible');

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  bank-named  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  X ' + f); });
process.exit(passed ? 0 : 1);
