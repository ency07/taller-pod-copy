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
ok(new Set(Object.values(explorationAudiences)).size === 3, 'explorar 3 audiencias debe asignar perfiles distintos a A/B/C cuando no hay locks manuales');
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
// Las diferencias se comprueban entre tarjetas, no solo contra el perfil individual.
const distinctProfileAxes = { layout: [], tipografia: [], formaSimbolo: [], integracionTexto: [], densidad: [], negativeSpace: [], jerarquia: [] };
const distinctProfileCards = ['HEAVY', 'SOFT', 'MODERN'].map(function (profileKey) {
  const card = _applyStructuralProfile({}, profileKey, {}, {}, distinctProfileAxes);
  Object.keys(distinctProfileAxes).forEach(function (axis) { distinctProfileAxes[axis].push(card[axis === 'tipografia' ? 'tipografia' : axis]); });
  return card;
});
['layout', 'tipografia', 'formaSimbolo', 'integracionTexto', 'densidad', 'negativeSpace', 'jerarquia'].forEach(function (axis) {
  const values = distinctProfileCards.map(function (card) { return card[axis]; });
  ok(new Set(values).size === values.length, 'HEAVY/SOFT/MODERN deben evitar repetir ' + axis + ' cuando hay opciones compatibles');
});

const productConstrainedProfile = _applyStructuralProfile({}, 'HEAVY', { layout: ['Axial centrado'], density: ['Heavy'] });
ok(productConstrainedProfile.layout.indexOf('Axial centrado') === 0, 'si producto y perfil comparten un layout permitido, debe respetarse');
ok(productConstrainedProfile.densidad === 'Heavy', 'si producto y perfil comparten densidad permitida, debe respetarse');
const audienceConstrainedProfile = _applyStructuralProfile({}, 'SOFT', {}, {
  layoutPref: ['Editorial asimétrica'],
  tipoPref: ['Sans humanista limpia'],
  densityPref: ['Minimal'],
  formaPref: ['contorno lineal calibrado']
});
ok(audienceConstrainedProfile.layout.indexOf('Editorial asimétrica') === 0, 'el perfil estructural debe conservar el layout preferido por la audiencia cuando es compatible');
ok(audienceConstrainedProfile.tipografia.indexOf('Sans humanista limpia') === 0, 'el perfil estructural debe conservar la tipografía preferida por la audiencia cuando es compatible');
ok(audienceConstrainedProfile.densidad === 'Minimal', 'el perfil estructural debe conservar la densidad preferida por la audiencia cuando es compatible');
ok(audienceConstrainedProfile.formaSimbolo === 'contorno lineal calibrado', 'el perfil estructural debe conservar la forma simbólica preferida por la audiencia cuando es compatible');
const motorSourceForAudience = fs.readFileSync(path.join(JS, 'motor-nucleo.js'), 'utf8');
ok(/_applyStructuralProfile\(v, _CONTACT_TREATMENT_ORDER\[k\], productBias, audProfile, priorProfileAxes\)/.test(motorSourceForAudience), 'la generación debe pasar las preferencias de audiencia y los ejes previos al perfil estructural');

// Regresiones de matriz y de audiencia automática.
ok(/HEAVY:\s*\{[\s\S]*?type: \[[^\]]*'Rounded amable'/.test(motorSourceForAudience), 'HEAVY debe permitir una tipografía redondeada cuando la audiencia la prefiere, sin perder la dirección estructural');

ok(motorSourceForAudience.includes("const visibleStyle = String(v.estilo || '').trim().toLowerCase()"), 'la puntuación de audiencia debe comparar la etiqueta visible del estilo además de la clave interna');
ok(motorSourceForAudience.includes("MOTOR_STATE.workflowMode !== 'explore'"), 'la puntuación no debe penalizar la preferencia de tratamiento cuando HEAVY/SOFT/MODERN son obligatorios en exploración');
ok(motorSourceForAudience.includes('const matchesPreference = function (actual, preferences)'), 'la puntuación debe admitir descripciones extendidas que contengan una preferencia de tipografía o forma');


ok(motorSourceForAudience.includes('function renderMatrix(result)'), 'debe existir una función para mostrar la matriz comparativa');
ok(motorSourceForAudience.includes('renderMatrix(result)'), 'la generación debe dibujar la matriz comparativa');
ok(motorSourceForAudience.includes('renderMatrix(LAST_RESULT)'), 'la regeneración individual debe refrescar la matriz');
ok(motorSourceForAudience.includes('const stableContext = ['), 'la audiencia Auto en exploración debe derivarse del contexto');
ok(motorSourceForAudience.includes('const stableContext = ['), 'la audiencia Auto debe resolverse de forma estable a partir del contexto');

// Diversidad combinatoria de arquitectura textual: no pertenece a un tratamiento fijo.
ok(Array.isArray(_TEXT_COMPOSITION_BANK) && _TEXT_COMPOSITION_BANK.length >= 20, 'debe existir un banco amplio de al menos 20 arquitecturas textuales');
ok(new Set(_TEXT_COMPOSITION_BANK).size === _TEXT_COMPOSITION_BANK.length, 'el banco de arquitecturas textuales no debe contener duplicados');
for (let sample = 0; sample < 12; sample++) {
  const textLayouts = _assignTextCompositions();
  ok(new Set([textLayouts.A, textLayouts.B, textLayouts.C]).size === 3, 'cada conjunto debe asignar arquitecturas textuales distintas a A/B/C');
  ok([textLayouts.A, textLayouts.B, textLayouts.C].every(function (x) { return _TEXT_COMPOSITION_BANK.indexOf(x) !== -1; }), 'las asignaciones deben proceder del banco registrado');
}
const motorSourceForTextDiversity = fs.readFileSync(path.join(JS, 'motor-nucleo.js'), 'utf8');
ok(motorSourceForTextDiversity.includes('const textCompositionByKey = _assignTextCompositions();'), 'la asignación textual se debe crear por conjunto, no por tratamiento');
ok(motorSourceForTextDiversity.includes("'integracionTexto', 'distribucionTexto', 'familiaColor'"), 'la distribución textual debe participar en la puntuación de diversidad');
ok(motorSourceForTextDiversity.includes('return cand[k].distribucionTexto; })).size === 3'), 'la aceptación del conjunto debe exigir tres arquitecturas textuales distintas');

// Contratos de originalidad del prompt CONTACTSHEET.
// Son pruebas estáticas de instrucciones; no prueban similitud de imágenes generadas.
const motorSource = fs.readFileSync(path.join(JS, 'motor-nucleo.js'), 'utf8');
ok(motorSource.includes("ORDEN FIJO DE TRATAMIENTOS: 01A HEAVY · 01B SOFT · 01C MODERN"), 'CONTACTSHEET debe fijar el orden A/B/C de los tratamientos');
ok(motorSource.includes('DIFERENCIA DURA: layout, tipografía, tratamiento, forma del símbolo, fondo y ARQUITECTURA TEXTUAL NUNCA se repiten entre A/B/C.'), 'el prompt debe exigir diferencias estructurales explícitas entre A/B/C');
ok(motorSource.includes('ARQUITECTURA TEXTUAL OBLIGATORIA Y EXCLUSIVA:'), 'el prompt debe comunicar una arquitectura textual exclusiva y prioritaria');
ok(_TEXT_COMPOSITION_BANK.every(function (x) { return /ubicación|columna|franja|arco|diagonal|bloques|esquina|contorno|pila|capa/i.test(x); }), 'las arquitecturas deben proponer ubicaciones compositivas concretas');
ok(_TEXT_COMPOSITION_BANK.every(function (x) { return /escala|proporción|dirección|densidad|distancia|símbolo/i.test(x); }), 'las arquitecturas deben controlar escala, proporción, dirección, densidad, distancia y relación con el símbolo');
ok(motorSource.includes('No trasladar el texto automáticamente a la parte inferior.'), 'el prompt debe prohibir la convergencia automática del texto a la zona inferior');
ok(!motorSource.includes("o += 'TEXTO/IMAGEN: ' + v.distribucionTexto + '; ' + v.integracionTexto + '; ' + v.relacion"), 'las instrucciones secundarias no deben contradecir la arquitectura textual exclusiva');
ok(motorSource.includes('No hagas una versión recoloreada, un simple cambio de técnica ni una réplica con texto reemplazado.'), 'variación guiada debe prohibir recoloreado o cambios superficiales como única variación');
ok(motorSource.includes('toma decisiones visuales independientes y diferentes entre A/B/C.'), 'variación guiada debe pedir decisiones visuales independientes');
ok(motorSource.includes('Cada tratamiento gobierna composición, jerarquía, tipografía, contraste, densidad y formas; el estilo artístico lo ejecuta sin contradecirlo.'), 'el tratamiento debe afectar estructura y no solo color/textura');
ok(motorSource.includes('HEAVY: masas/contraste; SOFT: aire/formas abiertas; MODERN: geometría/síntesis.'), 'exploración debe definir diferencias funcionales en una instrucción compacta');
ok(motorSource.includes("prevalece el concepto del usuario"), 'una familia detectada automáticamente no debe imponerse sobre un concepto explícito del usuario');
ok(motorSource.includes("Si es orientativa, no la conviertas en tema; manda el concepto."), 'el prompt debe marcar la familia automática como orientativa cuando hay concepto explícito');
ok(motorSource.includes('A/B/C deben cambiar de verdad encuadre, silueta global, distribución de masas, estructura tipográfica y relación texto-imagen; no basta recolorear ni cambiar técnica.'), 'exploración debe prohibir diferencias cosméticas como única variación');
ok(motorSource.includes('CONTRATO CREATIVO: conserva concepto, familia, función y mensaje; no inventes objetos, datos ni texto.'), 'el prompt debe usar un contrato creativo compacto y concreto');
ok(motorSource.includes('el estilo artístico define el lenguaje visual; HEAVY/SOFT/MODERN modifican composición y jerarquía sin borrar ese estilo.'), 'el tratamiento debe subordinarse al estilo artístico sin reemplazarlo');
ok(motorSource.includes("var chosenStyle = locksNow.estilo && locksNow.estilo[keyLetter] && locksNow.estilo[keyLetter] !== 'Auto'"), 'el dado individual debe respetar el estilo fijado explícitamente en esa tarjeta');
ok(/if \(contactIdentity \|\| MOTOR_STATE\.workflowMode === 'explore' \|\| MOTOR_STATE\.workflowMode === 'variation'\) \{[\s\S]*?_applyStructuralProfile\(v, _CONTACT_TREATMENT_ORDER\[k\], productBias, audProfile, priorProfileAxes\);/.test(motorSource), 'CONTACTSHEET, exploración y variación deben aplicar perfiles fijos y evitar repetir ejes compatibles');
ok(motorSource.includes('VARIACIÓN: usa la referencia solo para concepto y datos visibles; no copies su composición, silueta, encuadre ni jerarquía.'), 'variación guiada debe separar identidad semántica de la composición de referencia');
ok(motorSource.includes('Si dos diseños parecen la misma imagen recoloreada, replantea su estructura.'), 'variación guiada debe rechazar imágenes que solo cambian de color');
ok(motorSource.includes('No añadas paneles explicativos, objetos decorativos, logotipos, firmas ni texto no solicitado.'), 'el prompt debe limitar añadidos no solicitados para reducir alucinaciones visuales');
const rerollStart = motorSource.indexOf('function rerollSingle(keyLetter) {');
const rerollEnd = motorSource.indexOf('/* --- Renderizado de gates --- */', rerollStart);
const rerollSource = motorSource.slice(rerollStart, rerollEnd);
ok(rerollStart >= 0 && rerollEnd > rerollStart, 'rerollSingle debe existir como función delimitada');
ok(rerollSource.includes('var score = Math.random() * 2;'), 'el dado individual debe puntuar alternativas en vez de rechazar todos los conflictos');
ok(rerollSource.includes('LAST_RESULT.set[keyLetter] = best;'), 'el dado individual debe reemplazar solo la tarjeta solicitada');
ok(rerollSource.includes("MOTOR_STATE.market === 'global_en' && keyLetter === 'A'"), 'la variación adicional de semilla debe limitarse a 01A en Global EN');
ok(rerollSource.includes('finally { MOTOR_STATE._rerollNonce = nonceBeforeAttempt; }'), 'el dado de 01A debe restaurar el nonce para no afectar generaciones posteriores');
ok(rerollSource.includes('Las otras dos tarjetas se conservaron.'), 'el estado debe confirmar que las otras dos tarjetas no se regeneraron');



// Compatibilidad entre técnica artística y perfil estructural: reglas visibles y sin contradicción.
const heavyWatercolor = _styleTreatmentDirective('Acuarela Suelta', 'HEAVY');
const softGrunge = _styleTreatmentDirective('Dark Tattoo / Grunge', 'SOFT');
const modernNeon = _styleTreatmentDirective('Neon Glitch', 'MODERN');
ok(heavyWatercolor.includes('masas visuales claras') && heavyWatercolor.includes('efectos de color'), 'HEAVY debe contener la técnica acuarelada sin perder masas y bordes');
ok(softGrunge.includes('aire, formas abiertas') && softGrunge.includes('textura y la trama son selectivas'), 'SOFT debe limitar textura grunge/tattoo y preservar espacio negativo');
ok(modernNeon.includes('geometría legible') && modernNeon.includes('efectos de color o atmósfera quedan contenidos'), 'MODERN debe contener efectos neon dentro de una estructura geométrica legible');
ok(_styleTreatmentDirective('Kids Storybook', 'HEAVY').includes('no lo convierte en otro género visual'), 'HEAVY debe respetar la identidad de un estilo infantil/artesanal');
ok(motorSource.includes('COMPATIBILIDAD ESTILO × TRATAMIENTO:'), 'cada tarjeta debe incluir la directriz de compatibilidad estilo-tratamiento');

// Contratos de idioma del arte final y adaptabilidad de la vista previa móvil.
ok(getLanguageDirective('global_en', 'en').includes('natural, native English'), 'el selector English debe producir directiva de texto nativo en inglés');
ok(getLanguageDirective('gospel_es', 'es').includes('español natural'), 'Gospel ES debe producir directiva de texto natural en español');
ok(getLanguageDirective('diaspora_col', 'spanglish').includes('bilingual Spanish/English diaspora'), 'Spanglish debe respetar el contexto bilingüe de diáspora');
const cssSource = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
ok(/@media \(max-width: 900px\)[\s\S]*?\.main-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(cssSource), 'en móvil la vista previa debe pasar a una sola columna');
ok(/@media \(max-width: 900px\)[\s\S]*?\.card-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(cssSource), 'en móvil las tarjetas A/B/C deben apilarse sin columnas estrechas');
ok(/@media \(max-width: 1100px\)[\s\S]*?\.card-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/.test(cssSource), 'en tablet la vista previa debe reducirse a dos columnas');

console.log((failures.length ? 'FAIL' : 'PASS') + ' semantic-identity (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (msg) { console.error(' - ' + msg); });
process.exit(failures.length ? 1 : 0);
