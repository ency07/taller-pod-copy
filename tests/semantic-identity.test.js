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

const structuralPools = {
  HEAVY: { layout: _STRUCTURAL_PROFILES.HEAVY.layout, type: _STRUCTURAL_PROFILES.HEAVY.type, density: ['Heavy'], form: _STRUCTURAL_PROFILES.HEAVY.form },
  SOFT: { layout: _STRUCTURAL_PROFILES.SOFT.layout, type: _STRUCTURAL_PROFILES.SOFT.type, density: ['Minimal', 'Balanced'], form: _STRUCTURAL_PROFILES.SOFT.form },
  MODERN: { layout: _STRUCTURAL_PROFILES.MODERN.layout, type: _STRUCTURAL_PROFILES.MODERN.type, density: ['Minimal', 'Balanced'], form: _STRUCTURAL_PROFILES.MODERN.form }
};
['HEAVY', 'SOFT', 'MODERN'].forEach(function (profileKey) {
  const profileCard = _applyStructuralProfile({}, profileKey, {});
  const spec = structuralPools[profileKey];
  ok(profileCard.perfilEstructural === profileKey, profileKey + ' debe declararse como perfil estructural explícito');
  ok(spec.layout.some(function (hint) { return profileCard.layout.indexOf(hint) === 0; }), profileKey + ' debe seleccionar un layout permitido por el perfil');
  ok(spec.type.some(function (hint) { return profileCard.tipografia.indexOf(hint) === 0; }), profileKey + ' debe seleccionar tipografía permitida por el perfil');
  ok(spec.density.indexOf(profileCard.densidad) !== -1, profileKey + ' debe seleccionar densidad coherente');
  ok(spec.form.some(function (hint) { return profileCard.formaSimbolo === hint; }), profileKey + ' debe seleccionar una forma compatible');
  ok(_POOLS.negativeSpace.indexOf(profileCard.negativeSpace) !== -1, profileKey + ' debe usar espacio negativo del pool registrado');
  ok(_POOLS.jerarquia.indexOf(profileCard.jerarquia) !== -1, profileKey + ' debe usar jerarquía interna registrada');
  ok(_INTEGRACION.indexOf(profileCard.integracionTexto) !== -1, profileKey + ' debe usar integración tipográfica registrada');
});
const productConstrainedProfile = _applyStructuralProfile({}, 'HEAVY', { layout: ['Axial centrado'], density: ['Heavy'] });
ok(productConstrainedProfile.layout.indexOf('Axial centrado') === 0, 'si producto y perfil comparten un layout permitido, debe respetarse');
ok(productConstrainedProfile.densidad === 'Heavy', 'si producto y perfil comparten densidad permitida, debe respetarse');

// Contratos de originalidad del prompt CONTACTSHEET.
// Son pruebas estáticas de instrucciones; no prueban similitud de imágenes generadas.
const motorSource = fs.readFileSync(path.join(JS, 'motor-nucleo.js'), 'utf8');
ok(motorSource.includes("ORDEN FIJO DE TRATAMIENTOS: 01A HEAVY · 01B SOFT · 01C MODERN"), 'CONTACTSHEET debe fijar el orden A/B/C de los tratamientos');
ok(motorSource.includes('DIFERENCIA DURA: layout, tipografía, tratamiento, forma del símbolo y fondo NUNCA se repiten entre A/B/C.'), 'el prompt debe exigir diferencias estructurales explícitas entre A/B/C');
ok(motorSource.includes('No hagas una versión recoloreada, un simple cambio de técnica ni una réplica con texto reemplazado.'), 'variación guiada debe prohibir recoloreado o cambios superficiales como única variación');
ok(motorSource.includes('toma decisiones visuales independientes y diferentes entre A/B/C.'), 'variación guiada debe pedir decisiones visuales independientes');
ok(motorSource.includes('Cada tratamiento gobierna composición, jerarquía, tipografía, contraste, densidad y formas; el estilo artístico lo ejecuta sin contradecirlo.'), 'el tratamiento debe afectar estructura y no solo color/textura');
ok(motorSource.includes('DIRECCIONES: 01A HEAVY = impacto, masas y contraste; 01B SOFT = aire, formas abiertas y lectura amable; 01C MODERN = geometría, síntesis y lenguaje contemporáneo.'), 'exploración debe definir diferencias funcionales para HEAVY/SOFT/MODERN');
ok(motorSource.includes('Diferencia composición, silueta, jerarquía y relación texto-imagen, no solo color o textura.'), 'exploración debe prohibir diferencias cosméticas como única variación');
ok(motorSource.includes('CONTRATO CREATIVO: conserva concepto, familia, función y mensaje; no inventes objetos, datos ni texto.'), 'el prompt debe usar un contrato creativo compacto y concreto');
ok(motorSource.includes('el estilo artístico define el lenguaje visual; HEAVY/SOFT/MODERN modifican composición y jerarquía sin borrar ese estilo.'), 'el tratamiento debe subordinarse al estilo artístico sin reemplazarlo');
ok(motorSource.includes("var chosenStyle = locksNow.estilo && locksNow.estilo[keyLetter] && locksNow.estilo[keyLetter] !== 'Auto'"), 'el dado individual debe respetar el estilo fijado explícitamente en esa tarjeta');
ok(motorSource.includes("MOTOR_STATE.workflowMode === 'variation') {\n      _applyStructuralProfile(v, _CONTACT_TREATMENT_ORDER[k], productBias);"), 'la variación guiada debe aplicar perfiles estructurales fijos HEAVY/SOFT/MODERN');
ok(motorSource.includes('VARIACIÓN: usa la referencia solo para concepto y datos visibles; no copies su composición, silueta, encuadre ni jerarquía.'), 'variación guiada debe separar identidad semántica de la composición de referencia');
ok(motorSource.includes('Si dos diseños parecen la misma imagen recoloreada, replantea su estructura.'), 'variación guiada debe rechazar imágenes que solo cambian de color');
ok(motorSource.includes('No añadas paneles explicativos, objetos decorativos, logotipos, firmas ni texto no solicitado.'), 'el prompt debe limitar añadidos no solicitados para reducir alucinaciones visuales');
const rerollStart = motorSource.indexOf('function rerollSingle(keyLetter) {');
const rerollEnd = motorSource.indexOf('/* --- Renderizado de gates --- */', rerollStart);
const rerollSource = motorSource.slice(rerollStart, rerollEnd);
ok(rerollStart >= 0 && rerollEnd > rerollStart, 'rerollSingle debe existir como función delimitada');
ok(rerollSource.includes('var score = Math.random() * 2;'), 'el dado individual debe puntuar alternativas en vez de rechazar todos los conflictos');
ok(rerollSource.includes('LAST_RESULT.set[keyLetter] = best;'), 'el dado individual debe reemplazar solo la tarjeta solicitada');
ok(rerollSource.includes('Las otras dos tarjetas se conservaron.'), 'el estado debe confirmar que las otras dos tarjetas no se regeneraron');



console.log((failures.length ? 'FAIL' : 'PASS') + ' semantic-identity (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (msg) { console.error(' - ' + msg); });
process.exit(failures.length ? 1 : 0);
