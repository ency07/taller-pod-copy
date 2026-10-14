/* Contrato de prompt visual A/B/C.
   Ejecutar: node tests/visual-prompt-contract.test.js
   Este test valida instrucciones generadas en código; NO certifica imágenes reales. */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const motor = fs.readFileSync(path.join(root, 'js/motor-nucleo.js'), 'utf8');
const estilos = fs.readFileSync(path.join(root, 'js/data-estilos.js'), 'utf8');
let checks = 0;
const failures = [];
function ok(condition, message) {
  checks++;
  if (!condition) failures.push(message);
}

// SOLO_TEXTO debe traducir la arquitectura asignada a composición tipográfica pura.
const soloHelper = motor.slice(motor.indexOf('function _soloTextCompositionDirective('), motor.indexOf('function _compatibleCompositionDirective('));
ok(soloHelper.includes('ARQUITECTURA TIPOGRÁFICA SOLO_TEXTO') && soloHelper.includes('interpreta la dirección espacial'), 'SOLO_TEXTO debe traducir la arquitectura espacial a reglas tipográficas');
ok(soloHelper.includes('copy en la zona superior') && soloHelper.includes('copy en columna tipográfica lateral') && soloHelper.includes('copy en diagonal ascendente'), 'SOLO_TEXTO debe contemplar arquitecturas espaciales distintas');
ok(soloHelper.includes('No representar el motivo mencionado por la arquitectura como objeto') && soloHelper.includes('no dibujes el motivo mencionado'), 'SOLO_TEXTO no debe convertir referencias de layout en objetos o ilustraciones');
const soloBranch = motor.slice(motor.indexOf("if (v.jerarquiaVisual === 'SOLO_TEXTO') {", motor.indexOf('function formatPrompt(')), motor.indexOf("} else {", motor.indexOf("if (v.jerarquiaVisual === 'SOLO_TEXTO') {", motor.indexOf('function formatPrompt('))));
ok(soloBranch.includes('_soloTextCompositionDirective(v.distribucionTexto)'), 'SOLO_TEXTO debe recibir la arquitectura asignada a la tarjeta');
ok(/function _assignTextCompositions\(\)[\s\S]{0,260}const shuffled = _TEXT_COMPOSITION_BANK\.slice\(\)/.test(motor) && /return \{ A: shuffled\[0\], B: shuffled\[1\], C: shuffled\[2\] \}/.test(motor), 'la asignación de arquitecturas debe seguir siendo aleatoria e independiente de la jerarquía');
ok((motor.match(/const _TEXT_COMPOSITION_BANK = \[/g) || []).length === 1 && (motor.slice(motor.indexOf('const _TEXT_COMPOSITION_BANK = ['), motor.indexOf('function _soloTextCompositionDirective')).match(/^  '/gm) || []).length === 20, 'el banco conserva las 20 arquitecturas sin fijarlas a una tarjeta');

// Los tres tratamientos deben existir como decisiones visuales distintas.
ok(/HEAVY:[^\n]{0,260}masas sólidas dominantes/i.test(estilos), 'HEAVY debe definir masas y contraste, no solo un nombre');
ok(/SOFT:[^\n]{0,260}formas abiertas/i.test(estilos), 'SOFT debe definir aire y formas abiertas');
ok(/MODERN:[^\n]{0,260}geometría limpia/i.test(estilos), 'MODERN debe definir geometría y bordes nítidos');

// El prompt debe exigir diversidad estructural, conservando la identidad conceptual.
ok(/misma identidad semántica, soluciones distintas en composición, silueta, tipografía y relación texto-imagen/i.test(motor), 'CONTACTSHEET debe exigir diversidad estructural entre A/B/C');
ok(/no basta recolorear o cambiar textura/i.test(motor), 'el prompt debe rechazar diferencias limitadas a color o textura');
ok(/conserva concepto, familia, función y mensaje/i.test(motor), 'la diversidad no debe romper el ADN conceptual');
ok(/HEAVY\/SOFT\/MODERN modifican composición y jerarquía sin borrar ese estilo/i.test(motor), 'los tratamientos no deben sustituir el estilo artístico');
ok(/function formatPrompt\(result\)/.test(motor), 'debe existir el punto central que construye el prompt final');

// El prompt debe limitar elementos inventados, exigir diversidad estructural y hacer visible la audiencia.
ok(/Elementos autorizados: solo los nombrados en el concepto/.test(motor), 'exploración limita los elementos a los autorizados por el concepto');
ok(/no añadas sol, flores, aves, montañas, marcos ornamentales ni motivos secundarios/.test(motor), 'el prompt prohíbe adornos frecuentes no solicitados');
ok(/A\/B\/C deben cambiar de verdad encuadre, silueta global, distribución de masas, estructura tipográfica/.test(motor), 'exploración exige diferencias estructurales comprobables');
ok(/cada perfil debe modificar al menos dos decisiones visibles/.test(motor), 'la audiencia debe gobernar decisiones visibles en cada ficha');
ok(/CONTROL DE ELEMENTOS: no añadir elementos narrativos o decorativos fuera de este objeto\/concepto/.test(motor), 'cada tarjeta reitera el límite de elementos del concepto');

// Debe existir una capa de adaptación por producto y preparación técnica.
ok(/_PRODUCT_RULES\[MOTOR_STATE\.product\]/.test(motor), 'el prompt debe consultar reglas del producto seleccionado');
ok(/getPrintPrepRule\(MOTOR_STATE\.product, selectedPrintMethod\)/.test(motor), 'el prompt debe incorporar preparación técnica del producto/método');
ok(/getMockupRule\(MOTOR_STATE\.product\)/.test(motor), 'el prompt debe incorporar reglas de presentación específicas del producto');
ok(fs.readFileSync(path.join(root, 'js/data-productos.js'), 'utf8').includes('POR CADA DISEÑO A/B/C, generar cuatro mockups separados (12 vistas en total)'), 'CAMISETA SOFT exige cuatro vistas separadas por diseño');

// La variación desde imagen debe prohibir explícitamente el calco estructural.
ok(/VARIACIÓN VISUAL REAL: crea una nueva solución gráfica/i.test(motor), 'la variación debe exigir una solución gráfica nueva');
ok(/Cambia obligatoriamente composición, silueta global, encuadre, distribución de masas y jerarquía tipográfica/i.test(motor), 'la variación debe exigir cambios estructurales verificables');

/* Regresiones de pruebas manuales 1 y 2: no certifican imágenes generadas. */
ok(/function _stableHash\(value\)/.test(motor) && /function _pickWeightedStable\(pool, weights, seed\)/.test(motor), 'la resolución automática de estilos debe ser determinista por contexto');
ok(/stableBase.*bias-pick/.test(motor) && /stableBase.*explore-pick/.test(motor), 'las fichas Auto deben conservar sus estilos al regenerar el mismo contexto');
ok(/const copyLanguage = \(MOTOR_STATE\.market === 'gospel_es'/.test(motor), 'la variación debe resolver el idioma desde el mercado, sin forzar inglés');
ok(/no añadir mensajes secundarios, citas, versículos, datos ni afirmaciones no proporcionadas/.test(motor), 'la variación debe bloquear copy secundario inventado');
ok(fs.readFileSync(path.join(root, 'js/data-productos.js'), 'utf8').includes('POR CADA DISEÑO A/B/C, generar cuatro mockups separados (12 vistas en total)'), 'CAMISETA SOFT exige 4 vistas separadas por diseño, 12 en total');

ok(/QA visual pendiente/.test(motor) && /no inspeccionan el archivo de imagen generado/.test(motor), 'la interfaz no debe presentar el score del prompt como aprobación visual');

// Los selectores muestran el bloqueo guardado, no confunden la ficha generada
// con una elección manual que luego impediría volver a Auto.
ok(/_loadLocks\(memLocksMarket\(\), MOTOR_STATE\.product\)\.audiencia\[k\] === a/.test(motor), 'la audiencia seleccionada debe reflejar el lock manual');
ok(/_loadLocks\(memLocksMarket\(\), MOTOR_STATE\.product\)\.jerarquia\[k\] === m/.test(motor), 'la jerarquía seleccionada debe reflejar el lock manual');
ok(/_loadLocks\(memLocksMarket\(\), MOTOR_STATE\.product\)\.jerarquia\[k\] === 'Auto'/.test(motor), 'Auto debe quedar seleccionado si no existe jerarquía fijada');
 
// La jerarquía seleccionada manda sobre escala/peso; la arquitectura decide ubicación.
ok(/si existe mensaje proporcionado, conservarlo literalmente y usarlo como único copy principal; no exigir tres niveles/i.test(motor), 'el prompt general no debe exigir tres niveles que contradigan un mensaje único');
ok(motor.includes('JERARQUÍA: aplica exactamente la jerarquía indicada en cada ficha') && motor.includes('TEXTO_DOMINANTE: el COPY TIPOGRÁFICO ocupa 70–80% del área total imprimible') && motor.includes('OBJETO_DOMINANTE: el símbolo autorizado ocupa 70–80%'), 'el contrato debe cuantificar la jerarquía y mantenerla prioritaria');
ok(/SOLO_TEXTO: solo copy literal; 100% tipografía/.test(motor) && /ÚNICOS elementos permitidos: letras del copy literal/.test(motor), 'SOLO_TEXTO debe prohibir imágenes desde el contrato y la ficha');
ok(/La jerarquía fija tamaño, área y peso; el layout solo ubicación/.test(motor), 'la jerarquía debe prevalecer sobre el layout');
ok(/diseño tipográfico puro en /.test(motor) && /No añadas objetos, ilustraciones, iconos, marcos ni adornos independientes/.test(motor), 'SOLO_TEXTO conserva una dirección tipográfica expresiva sin permitir ilustraciones ni ornamentos independientes');
ok(/SOLO_TEXTO NO SIGNIFICA SIMPLE/.test(motor), 'SOLO_TEXTO debe ser tipográficamente impactante, no simplificado');
ok(/las letras como forma visual principal mediante escala, ritmo, composición/.test(motor), 'el arte tipográfico debe usar recursos compositivos expresivos sin añadir ilustraciones');
// Esto evita que una composición textual aleatoria contradiga TEXTO_DOMINANTE,
// OBJETO_DOMINANTE, BALANCEADO o SOLO_TEXTO.
ok(/const hierarchyDirective = \{/.test(motor) && /o \+= 'JERARQUÍA: ' \+ hierarchyDirective/.test(motor), 'cada ficha debe emitir su bloque compacto de jerarquía');
ok(!/JERARQUÍA OBLIGATORIA:/.test(motor) && !/ORDEN VISUAL: texto primero/.test(motor) && !/ORDEN VISUAL: árbol y persona primero/.test(motor), 'no deben sobrevivir bloques de jerarquía duplicados');
ok(motor.includes('el COPY TIPOGRÁFICO ocupa 70–80% del área total imprimible, debe ser la primera lectura y dominar a primera vista'), 'TEXTO_DOMINANTE debe fijar el texto en 70–80% del área total');
ok(motor.includes('Texto y símbolo forman una sola composición integrada, no dos bloques separados') && motor.includes('El símbolo aporta como máximo 20–30% del peso visual'), 'TEXTO_DOMINANTE debe mantener toda la escena subordinada al texto');
ok(motor.includes('La jerarquía fija área y escala; la arquitectura solo cambia la ubicación.'), 'la arquitectura solo puede cambiar ubicación, no proporción');
ok(motor.includes('Si la arquitectura propone zonas separadas, conserva su dirección solo mediante solapamiento dentro de la forma unificada.'), 'una arquitectura inferior o lateral no puede hacer que una escena grande supere el copy en TEXTO_DOMINANTE');
ok(/símbolo autorizado ocupa 70–80% del arte/.test(motor), 'OBJETO_DOMINANTE debe priorizar el símbolo autorizado');
ok(/si es Pixel \/ 8-bit, usa formas pixeladas y bloques discretos/.test(motor), 'el estilo Pixel / 8-bit debe conservar su lenguaje visual');
ok(motor.includes("if (v.jerarquiaVisual === 'SOLO_TEXTO')") && !/SOLO_TEXTO[\s\S]{0,180}_compatibleCompositionDirective/.test(motor), 'SOLO_TEXTO no debe heredar instrucciones de ubicación para símbolos o motivos');
ok(!/ARQUITECTURA TIPOGRÁFICA: '\\s*' \+ v\.distribucionTexto/.test(motor), 'SOLO_TEXTO no debe insertar una distribución que contradiga la prohibición de objetos');
ok(!/COMPOSICIÓN TEXTUAL/.test(motor), 'la dirección artística no debe referirse a una composición textual inexistente');
ok(!/Arquitectura tipográfica de referencia:/.test(motor), 'TEXTO_DOMINANTE no debe volver a introducir un motivo debajo del texto');
ok(!/Arquitectura de referencia:/.test(motor), 'OBJETO_DOMINANTE no debe reintroducir layouts ornamentales en el prompt final');
ok(/Ejecuta el estilo dentro de la jerarquía indicada/.test(motor), 'la dirección artística debe subordinarse a la jerarquía');
ok(motor.includes("TEXTO_DOMINANTE: 'TEXTO_DOMINANTE:") && motor.includes("OBJETO_DOMINANTE: 'OBJETO_DOMINANTE:"), 'el bloque directivo debe conservar una definición compacta por jerarquía');

ok(!/ORDEN VISUAL:/.test(motor), 'no deben existir bloques secundarios redundantes de orden visual');
ok(!/JERARQUÍA OBLIGATORIA:/.test(motor), 'no debe sobrevivir el bloque duplicado de jerarquía obligatoria');
ok(/if \(v\.jerarquiaVisual === 'BALANCEADO'\) \{[\s\S]{0,180}COMPOSICIÓN:/.test(motor), 'los layouts originales solo deben imprimirse para BALANCEADO');
ok(/if \(v\.jerarquiaVisual === 'BALANCEADO'\) \{[\s\S]{0,180}COMPOSICIÓN:/.test(motor), 'el layout seleccionado solo se añade si no contradice jerarquía estricta');
const promptBuilder = motor.slice(motor.indexOf('function formatPrompt('), motor.indexOf('/* --- Renderizado de fichas en el DOM --- */'));
ok(/if \(v\.jerarquiaVisual === 'TEXTO_DOMINANTE'\) \{[\s\S]{0,500}INTEGRACIÓN TEXTO-SÍMBOLO: integra el objeto descrito en el concepto/.test(promptBuilder), 'TEXTO_DOMINANTE debe construir integración a partir del objeto real del concepto');
ok(promptBuilder.includes("' + v.objeto + '") && promptBuilder.includes('usando su forma física y acción reales') && promptBuilder.includes('sin imponer metáforas genéricas ni partes que el objeto no posee'), 'TEXTO_DOMINANTE no debe imponer metáforas de integración incompatibles con el objeto');
ok(promptBuilder.includes('El texto exacto ocupa 70–80% del área y es la primera lectura') && promptBuilder.includes('el símbolo ocupa como máximo 20–30%') && promptBuilder.includes('nunca aparece como ilustración separada'), 'la integración debe conservar la proporción y subordinación del símbolo');
ok(!/\\\\n/.test(promptBuilder), 'formatPrompt no debe emitir secuencias literales \\n en el prompt');
ok(!/DIRECCIÓN ARTÍSTICA:[^\n]*COMPOSICIÓN TEXTUAL/.test(motor), 'no debe quedar una referencia a una sección inexistente');
ok(/DIFERENCIA DURA: layout, tipografía, tratamiento/.test(motor), 'se conserva el contrato de diversidad A/B/C');
ok(motor.includes('ARQUITECTURA TEXTUAL NUNCA se repiten entre A/B/C.'), 'el contrato debe impedir repetir la arquitectura entre tarjetas');
ok(/DIRECCIÓN ARTÍSTICA: '\s*\+ v\.formaSimbolo \+ '; ' \+ v\.tecnica \+ '; ' \+ v\.tratamiento/.test(motor), 'la dirección artística no debe volver a imponer layout/composición sobre la arquitectura textual');
ok(!/o \+= 'DIRECCIÓN: ' \+ v\.arquitectura \+ '; ' \+ v\.composicion \+ '; ' \+ v\.layout/.test(motor), 'no debe quedar la antigua instrucción de dirección que contradecía la composición textual');
ok(!/espacio negativo ' \+ v\.negativeSpace \+ ' · jerarquía interna ' \+ v\.jerarquia/.test(motor), 'la jerarquía interna aleatoria no debe contradecir el selector de jerarquía visible');
ok(!/RELACIÓN TEXTO-IMAGEN: aplica la arquitectura textual obligatoria anterior/.test(motor), 'no debe quedar una instrucción secundaria redundante que vuelva a describir la arquitectura');
const compositionBankStart = motor.indexOf('const _TEXT_COMPOSITION_BANK = [');
const compositionBankEnd = motor.indexOf('function _assignTextCompositions()', compositionBankStart);
const compositionBankSource = compositionBankStart >= 0 && compositionBankEnd > compositionBankStart ? motor.slice(compositionBankStart, compositionBankEnd) : '';
ok(compositionBankSource.includes('TEXTO ARRIBA') && compositionBankSource.includes('ESQUINA SUPERIOR lateral'), 'el banco debe conservar arquitecturas compositivas desde el inicio hasta el final del catálogo');

/* La arquitectura debe llegar a las jerarquías estrictas como ubicación adaptada,
   nunca como una orden que cambie proporciones o añada objetos. */
ok(motor.includes('function _compatibleCompositionDirective(hierarchy, architecture)'), 'debe existir un adaptador de arquitectura compositiva');
ok(motor.includes("return 'DISTRIBUCIÓN ADAPTADA: ' + placement + '; convierte ubicación y módulos en una sola silueta tipográfica-simbólica integrada"), 'TEXTO_DOMINANTE debe conservar la proporción al adaptar la ubicación');
ok(motor.includes("return 'DISTRIBUCIÓN ADAPTADA: ' + placement + '; el símbolo autorizado conserva 70–80% del área"), 'OBJETO_DOMINANTE debe conservar la proporción al adaptar la ubicación');
ok(motor.includes('sin añadir cinta ni objeto físico') && motor.includes('No añadas cintas, marcos, bandas, emblemas ni objetos'), 'la arquitectura debe traducirse a ubicación y no exigir objetos decorativos');
ok(motor.includes("else if (v.jerarquiaVisual === 'TEXTO_DOMINANTE' || v.jerarquiaVisual === 'OBJETO_DOMINANTE')") && motor.includes('_compatibleCompositionDirective(v.jerarquiaVisual, v.distribucionTexto)'), 'solo TEXTO_DOMINANTE y OBJETO_DOMINANTE deben recibir la arquitectura adaptada');
ok(motor.includes("if (v.jerarquiaVisual === 'BALANCEADO')") && motor.includes("'COMPOSICIÓN: ' + v.layout + ' · ' + v.distribucionTexto"), 'BALANCEADO debe conservar su composición original');
ok(motor.includes("if (v.jerarquiaVisual === 'SOLO_TEXTO')") && motor.includes('CONTROL ABSOLUTO: no dibujar personas'), 'SOLO_TEXTO debe seguir excluyendo objetos y escenas');

if (failures.length) {
  console.error('FALLOS visual-prompt-contract:');
  failures.forEach(function (failure) { console.error(' - ' + failure); });
  console.error(checks + ' comprobaciones ejecutadas; ' + failures.length + ' fallos.');
  process.exitCode = 1;
} else {
  console.log('OK visual-prompt-contract: ' + checks + ' comprobaciones. Contrato del prompt verificado; las imágenes reales requieren revisión visual aparte.');
}
