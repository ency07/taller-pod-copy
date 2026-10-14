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
ok(/JERARQUÍA: aplica exactamente la jerarquía indicada en cada ficha/i.test(motor) && /TEXTO_DOMINANTE: el bloque tipográfico ocupa 70–80%/.test(motor) && /OBJETO_DOMINANTE: símbolo autorizado ocupa 70–80%/.test(motor), 'el contrato compacto debe cuantificar jerarquía sin duplicarla globalmente');
ok(/SOLO_TEXTO = solo letras, cero imagen/i.test(motor) && /ÚNICOS elementos permitidos: letras del copy literal/i.test(motor), 'SOLO_TEXTO debe prohibir imágenes desde el contrato global y la ficha');
ok(/La jerarquía fija tamaño, área y peso; el layout solo ubicación/.test(motor), 'la jerarquía debe prevalecer sobre el layout');
ok(/diseño tipográfico puro en /.test(motor) && /No añadas objetos, ilustraciones, iconos, marcos ni adornos independientes/.test(motor), 'SOLO_TEXTO conserva una dirección tipográfica expresiva sin permitir ilustraciones ni ornamentos independientes');
ok(/SOLO_TEXTO NO SIGNIFICA SIMPLE/.test(motor), 'SOLO_TEXTO debe ser tipográficamente impactante, no simplificado');
ok(/las letras como forma visual principal mediante escala, ritmo, composición/.test(motor), 'el arte tipográfico debe usar recursos compositivos expresivos sin añadir ilustraciones');
// Esto evita que una composición textual aleatoria contradiga TEXTO_DOMINANTE,
// OBJETO_DOMINANTE, BALANCEADO o SOLO_TEXTO.
ok(/const hierarchyDirective = \{[\s\S]{0,1000}JERARQUÍA:/.test(motor), 'cada ficha debe emitir un único bloque compacto de jerarquía');
ok(!/JERARQUÍA OBLIGATORIA:/.test(motor) && !/ORDEN VISUAL: texto primero/.test(motor) && !/ORDEN VISUAL: árbol y persona primero/.test(motor), 'no deben sobrevivir bloques de jerarquía duplicados');
ok(/COMPOSICIÓN PRIORITARIA TEXTO: el bloque tipográfico es la silueta global/.test(motor), 'TEXTO_DOMINANTE debe usar una rama de composición que impida al layout desplazar la jerarquía');
ok(/TEXTO_DOMINANTE: el bloque tipográfico ocupa 70–80%[\s\S]*reduce el símbolo, nunca el texto/.test(motor), 'TEXTO_DOMINANTE debe ordenar reducir el símbolo en vez de encoger el mensaje');
ok(/COMPOSICIÓN PRIORITARIA OBJETO: árbol de almendro y persona descansando forman la silueta global/.test(motor), 'OBJETO_DOMINANTE debe priorizar explícitamente los únicos objetos autorizados');
ok(/OBJETO_DOMINANTE: símbolo autorizado ocupa 70–80%[\s\S]*Solo elementos imprescindibles del concepto; sin adornos/.test(motor), 'OBJETO_DOMINANTE debe restringir elementos al concepto autorizado');
ok(/SOLO LETRAS: usa únicamente el copy literal/.test(motor), 'SOLO_TEXTO no debe heredar layouts que pidan símbolos o motivos');
ok(!/ARQUITECTURA TIPOGRÁFICA: '\s*\+ v\.distribucionTexto/.test(motor), 'SOLO_TEXTO no debe insertar una distribución que contradiga la prohibición de objetos');
ok(/No aplicar instrucciones de layout ni de distribución que contradigan esta jerarquía/.test(motor), 'TEXTO_DOMINANTE debe excluir referencias de composición incompatibles');
ok(!/Arquitectura tipográfica de referencia: '\s*\+ v\.distribucionTexto/.test(motor), 'TEXTO_DOMINANTE no debe volver a introducir un motivo debajo del texto');
ok(!/Arquitectura de referencia: '\s*\+ v\.layout/.test(motor), 'OBJETO_DOMINANTE no debe reintroducir layouts ornamentales en el prompt final');
ok(/Coloca el texto de forma sencilla fuera de la silueta principal/.test(motor), 'OBJETO_DOMINANTE debe separar el texto sin inventar marcos ni adornos');
ok(/TEXTO_DOMINANTE: texto 70–80% del peso visual/.test(motor), 'TEXTO_DOMINANTE debe impedir que una ilustración grande se imponga al titular');
ok(/OBJETO_DOMINANTE: árbol y persona 70–80%; mensaje 20–30%/.test(motor), 'OBJETO_DOMINANTE debe priorizar el objeto y limitar adornos no autorizados');
ok(/PROHIBIDO añadir marcos geométricos, esquinas dibujadas, círculos, halos, manchas de tinta, salpicaduras/.test(motor), 'OBJETO_DOMINANTE debe bloquear adornos que no pertenezcan al concepto');
ok(/RESTRICCIÓN DE COMPOSICIÓN: el bloque tipográfico completo es la silueta principal/.test(motor), 'TEXTO_DOMINANTE debe exigir que el bloque tipográfico sea la silueta principal');
ok(/PROHIBIDO dibujar el árbol\/persona como ilustración grande/.test(motor), 'TEXTO_DOMINANTE debe prohibir una escena grande encima o debajo del texto');
ok(/LISTA CERRADA DE ELEMENTOS: el árbol de almendro y la persona descansando son los únicos elementos ilustrados autorizados/.test(motor), 'OBJETO_DOMINANTE debe definir una lista cerrada de objetos permitidos');
ok(/salpicaduras, líneas de velocidad, subrayados ornamentales/.test(motor), 'OBJETO_DOMINANTE debe prohibir explícitamente los adornos abstractos observados en la prueba visual');
ok(/Si un elemento se puede retirar sin perder la acción de descansar bajo el árbol, retíralo/.test(motor), 'OBJETO_DOMINANTE debe aplicar una prueba de necesidad a cada elemento ilustrado');
ok(/Si el mensaje no domina en una vista pequeña, rediseña la composición hasta que lo haga/.test(motor), 'el contrato debe exigir una comprobación de dominancia textual a escala reducida');
ok(/no reutilizar la arquitectura de otra tarjeta/.test(motor), 'el contrato debe impedir repetir la arquitectura entre tarjetas');
ok(/DIRECCIÓN ARTÍSTICA: '\s*\+ v\.formaSimbolo \+ '; ' \+ v\.tecnica \+ '; ' \+ v\.tratamiento/.test(motor), 'la dirección artística no debe volver a imponer layout/composición sobre la arquitectura textual');
ok(!/o \+= 'DIRECCIÓN: ' \+ v\.arquitectura \+ '; ' \+ v\.composicion \+ '; ' \+ v\.layout/.test(motor), 'no debe quedar la antigua instrucción de dirección que contradecía la composición textual');
ok(!/espacio negativo ' \+ v\.negativeSpace \+ ' · jerarquía interna ' \+ v\.jerarquia/.test(motor), 'la jerarquía interna aleatoria no debe contradecir el selector de jerarquía visible');
ok(!/RELACIÓN TEXTO-IMAGEN: aplica la arquitectura textual obligatoria anterior/.test(motor), 'no debe quedar una instrucción secundaria redundante que vuelva a describir la arquitectura');
const compositionBankStart = motor.indexOf('const _TEXT_COMPOSITION_BANK = [');
const compositionBankEnd = motor.indexOf('function _assignTextCompositions()', compositionBankStart);
const compositionBankSource = compositionBankStart >= 0 && compositionBankEnd > compositionBankStart ? motor.slice(compositionBankStart, compositionBankEnd) : '';
ok(compositionBankSource.includes('TEXTO ARRIBA') && compositionBankSource.includes('ESQUINA SUPERIOR lateral'), 'el banco debe conservar arquitecturas compositivas desde el inicio hasta el final del catálogo');


if (failures.length) {
  console.error('FALLOS visual-prompt-contract:');
  failures.forEach(function (failure) { console.error(' - ' + failure); });
  console.error(checks + ' comprobaciones ejecutadas; ' + failures.length + ' fallos.');
  process.exitCode = 1;
} else {
  console.log('OK visual-prompt-contract: ' + checks + ' comprobaciones. Contrato del prompt verificado; las imágenes reales requieren revisión visual aparte.');
}
