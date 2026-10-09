/* Regresión de identidad semántica del CONTACTSHEET.
   Ejecutar: node tests/semantic-identity.test.js
   No requiere DOM real ni llamadas a proveedores. */
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
['data-mercados.js','data-audiencias.js','data-bancos.js','data-estilos.js','dominios.js','data-productos.js','memoria-local.js','motor-nucleo.js']
  .forEach(function (file) { vm.runInThisContext(fs.readFileSync(path.join(JS, file), 'utf8'), { filename: file }); });

// La selección de objetos no debe confundir pertenecer al nicho con ser semánticamente pertinente.
const bearAnchor = _chooseConceptCompatibleObject(['pelota de lana desenrollada','cama elevada para gato','oso aventurero con gafas de sol'], 'oso aventurero con gafas de sol');
ok(/oso aventurero/i.test(bearAnchor), 'debe seleccionar el candidato compatible con el concepto del oso');
const noMatch = _chooseConceptCompatibleObject(['pelota de lana desenrollada','gato junto a una ventana'], 'oso aventurero con gafas de sol');
ok(/oso aventurero/i.test(noMatch), 'si ningún objeto del banco encaja, debe conservar el concepto en vez de elegir al azar');
const catMatch = _chooseConceptCompatibleObject(['pelota de lana desenrollada','gato aventurero con mochila'], 'gato aventurero con mochila');
ok(/gato aventurero/i.test(catMatch), 'debe preferir una coincidencia semántica clara del banco');

MOTOR_STATE.concept = 'astronauta en el espacio profundo sosteniendo una roca';
MOTOR_STATE.message = 'A los que aman a Dios, todas las cosas les ayudan a bien';
const clearMatch = _resolveContactIdentity(['astronauta con casco espacial','roca lunar agrietada']);
ok(clearMatch.ok, 'debe identificar un objeto distintivo incluido en un concepto largo');
ok(/astronauta/i.test(clearMatch.symbol), 'debe conservar el símbolo identificado y no cambiarlo por otro');

MOTOR_STATE.concept = 'Cruz';
const explicit = _resolveContactIdentity([]);
ok(explicit.ok && explicit.symbol === 'Cruz', 'debe aceptar un símbolo breve y explícito aunque no esté en el banco');

MOTOR_STATE.concept = 'lugares turísticos de Barranquilla';
const descriptive = _resolveContactIdentity(['león sobre escudo','cruz sobre escudo']);
ok(descriptive.ok, 'debe aceptar conceptos descriptivos aunque no nombren un único objeto');
ok(descriptive.symbol === MOTOR_STATE.concept, 'si el banco no ofrece una coincidencia inequívoca, debe conservar el concepto completo como ancla');
ok(descriptive.identityMode === 'concept', 'debe distinguir el ancla conceptual de un símbolo del banco');

MOTOR_STATE.concept = 'un león que protege una cruz';
const relation = _resolveContactIdentity(['león en escudo','cruz sobre escudo']);
ok(relation.ok, 'debe aceptar relaciones entre varios símbolos sin bloquear la generación');
ok(relation.symbol === MOTOR_STATE.concept, 'no debe elegir al azar uno de los símbolos relacionados');

MOTOR_STATE.concept = '';
const missing = _resolveContactIdentity(['león sobre escudo']);
ok(!missing.ok, 'solo debe bloquear cuando falta el concepto principal');
ok(!!missing.reason, 'debe explicar qué dato mínimo falta');

console.log((failures.length ? 'FAIL' : 'PASS') + ' semantic-identity (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (msg) { console.error(' - ' + msg); });
process.exit(failures.length ? 1 : 0);
