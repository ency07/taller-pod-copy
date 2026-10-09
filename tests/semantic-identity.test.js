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

const spanishFaith = _chooseConceptCompatibleObject(['candelabro decorativo','cruz de madera con ramas','gato con gafas'], 'cruz de madera con ramas');
ok(/cruz de madera/i.test(spanishFaith), 'debe respetar el concepto en español y elegir el objeto relacionado');
const unrelatedConcept = _chooseConceptCompatibleObject(['luna creciente','rosa con espinas','tabla de surf'], 'camión de bomberos vintage');
ok(/camión de bomberos/i.test(unrelatedConcept), 'debe conservar el concepto aunque el banco de esa familia no tenga coincidencias');

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

MOTOR_STATE.market = 'global_en';
MOTOR_STATE.region = 'global';
MOTOR_STATE.product = 'HOODIE';
MOTOR_STATE.workflowMode = 'explore';
MOTOR_STATE.subniche = 'tattoo_lifestyle';
MOTOR_STATE.dominio = 'auto';
MOTOR_STATE.dominioDetectado = 'auto';
MOTOR_STATE.concept = '';
MOTOR_STATE.message = '';
MOTOR_STATE.support = '';
MOTOR_STATE.audienceSet = 'Auto';
MOTOR_STATE.audienceMulti = 'si';
MOTOR_STATE.explorationBrief = _resolveExplorationBrief();
const tattooBrief = MOTOR_STATE.explorationBrief;
ok(tattooBrief.familyId === 'tattoo_lifestyle', 'la exploración debe preservar una familia manual aunque no exista un banco comercial registrado');
ok(!tattooBrief.bankFound, 'si la familia no tiene banco compatible, debe reconocerlo y no fingir que lo encontró');
const tattooPool = getObjectPool();
ok(!tattooPool.some(function (item) { return _OBJECT_BANK_COMMON_EN.indexOf(item) !== -1; }), 'una familia manual sin banco no debe caer en el banco común de mercado (evita mascotas por defecto)');
const explorationAudiences = resolveAudiences();
ok(explorationAudiences.A === explorationAudiences.B && explorationAudiences.B === explorationAudiences.C, 'exploración debe mantener la misma audiencia en A/B/C aunque la opción multi esté activa');
MOTOR_STATE.subniche = 'auto';
MOTOR_STATE.workflowMode = 'explore';
MOTOR_STATE.concept = '';
MOTOR_STATE.message = '';
const autoBrief = _resolveExplorationBrief();
ok(!autoBrief.familyId || _marketSubnicheIds().indexOf(autoBrief.familyId) !== -1, 'Auto debe resolver solo una familia registrada en el mercado activo');
MOTOR_STATE.workflowMode = 'new';

console.log((failures.length ? 'FAIL' : 'PASS') + ' semantic-identity (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (msg) { console.error(' - ' + msg); });
process.exit(failures.length ? 1 : 0);
