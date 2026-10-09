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

MOTOR_STATE.concept = 'astronauta en el espacio profundo sosteniendo una roca';
MOTOR_STATE.message = 'A los que aman a Dios, todas las cosas les ayudan a bien';
const clearMatch = _resolveContactIdentity(['astronauta con casco espacial','roca lunar agrietada']);
ok(clearMatch.ok, 'debe identificar un objeto distintivo incluido en un concepto largo');
ok(/astronauta/i.test(clearMatch.symbol), 'debe conservar el símbolo identificado y no cambiarlo por otro');

MOTOR_STATE.concept = 'Cruz';
const explicit = _resolveContactIdentity([]);
ok(explicit.ok && explicit.symbol === 'Cruz', 'debe aceptar un símbolo breve y explícito aunque no esté en el banco');

MOTOR_STATE.concept = 'un concepto largo sin objeto visual identificable que debe aclararse';
const ambiguous = _resolveContactIdentity(['león sobre escudo','cruz sobre escudo']);
ok(!ambiguous.ok, 'debe rechazar conceptos ambiguos sin identidad principal inequívoca');
ok(!!ambiguous.reason, 'debe explicar por qué se detiene la generación');

MOTOR_STATE.concept = 'un león que protege una cruz';
const relation = _resolveContactIdentity(['león en escudo','cruz sobre escudo']);
ok(!relation.ok, 'no debe resolver por selección arbitraria una relación ambigua entre símbolos');

console.log((failures.length ? 'FAIL' : 'PASS') + ' semantic-identity (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (msg) { console.error(' - ' + msg); });
process.exit(failures.length ? 1 : 0);
