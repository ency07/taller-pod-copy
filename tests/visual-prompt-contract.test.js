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

// Debe existir una capa de adaptación por producto y preparación técnica.
ok(/_PRODUCT_RULES\[MOTOR_STATE\.product\]/.test(motor), 'el prompt debe consultar reglas del producto seleccionado');
ok(/getPrintPrepRule\(MOTOR_STATE\.product, selectedPrintMethod\)/.test(motor), 'el prompt debe incorporar preparación técnica del producto/método');
ok(/getMockupRule\(MOTOR_STATE\.product\)/.test(motor), 'el prompt debe incorporar reglas de presentación específicas del producto');

// La variación desde imagen debe prohibir explícitamente el calco estructural.
ok(/VARIACIÓN VISUAL REAL: crea una nueva solución gráfica/i.test(motor), 'la variación debe exigir una solución gráfica nueva');
ok(/Cambia obligatoriamente composición, silueta global, encuadre, distribución de masas y jerarquía tipográfica/i.test(motor), 'la variación debe exigir cambios estructurales verificables');

if (failures.length) {
  console.error('FALLOS visual-prompt-contract:');
  failures.forEach(function (failure) { console.error(' - ' + failure); });
  console.error(checks + ' comprobaciones ejecutadas; ' + failures.length + ' fallos.');
  process.exitCode = 1;
} else {
  console.log('OK visual-prompt-contract: ' + checks + ' comprobaciones. Contrato del prompt verificado; las imágenes reales requieren revisión visual aparte.');
}
