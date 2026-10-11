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

if (failures.length) {
  console.error('FALLOS visual-prompt-contract:');
  failures.forEach(function (failure) { console.error(' - ' + failure); });
  console.error(checks + ' comprobaciones ejecutadas; ' + failures.length + ' fallos.');
  process.exitCode = 1;
} else {
  console.log('OK visual-prompt-contract: ' + checks + ' comprobaciones. Contrato del prompt verificado; las imágenes reales requieren revisión visual aparte.');
}
