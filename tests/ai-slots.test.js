/* Test de consistencia del almacén de claves IA.
   El panel (ia-revisor.js) guarda en SLOTS_KEY y el análisis de imagen
   (ia-analisis.js) debe leer la MISMA llave. Regresión del bug donde la
   visión buscaba 'pod_u_ai_slots', llave que ningún código escribe.

   Ejecutar:  node tests/ai-slots.test.js
   Sale con código 1 si falla cualquier aserción. */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let checks = 0;
const failures = [];
function ok(cond, msg) { checks++; if (!cond) failures.push(msg); }

const revisor = fs.readFileSync(path.join(ROOT, 'js', 'ia-revisor.js'), 'utf8');
const analisis = fs.readFileSync(path.join(ROOT, 'js', 'ia-analisis.js'), 'utf8');

const m = revisor.match(/var SLOTS_KEY = '([^']+)'/);
ok(m && m[1] === 'pod2_ai_slots', 'SLOTS_KEY inesperada en ia-revisor.js');
ok(analisis.indexOf("getItem('pod2_ai_slots')") !== -1,
  'ia-analisis.js no lee pod2_ai_slots (la visión no vería las claves del panel)');

function codeWithoutComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
}
const revisorCode = codeWithoutComments(revisor);
const analisisCode = codeWithoutComments(analisis);
ok(revisorCode.indexOf('pod_u_ai_slots') === -1 && analisisCode.indexOf('pod_u_ai_slots') === -1,
  'queda referencia en CÓDIGO a pod_u_ai_slots (llave huérfana)');

ok(/provider === 'Gemini'/.test(analisis), 'getGeminiSlot no filtra por proveedor Gemini');
ok(/\.key && .*\.model|\.model && .*\.key/.test(analisis), 'getGeminiSlot no exige clave+modelo');

/* Modelos muertos (verificado oct-2026): gemini-2.0-flash apagado 2026-06-01 (404),
   llama-3.3-70b-versatile fuera del catálogo Groq, gemini-2.0-flash-exp fuera de OpenRouter.
   Formato de API intacto: el endpoint :generateContent + responseMimeType JSON siguen vivos. */
const DEAD = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'llama-3.3-70b-versatile'];
DEAD.forEach(function (m) {
  const inDefSlot = new RegExp("model: '" + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "'").test(revisor);
  ok(!inDefSlot, 'modelo muerto como default: ' + m);
});
ok(revisor.indexOf("model: 'gemini-2.5-flash'") !== -1, 'falta default vivo gemini-2.5-flash');
ok(revisor.indexOf("model: 'google/gemini-2.5-flash'") !== -1, 'falta default vivo google/gemini-2.5-flash');
ok(revisor.indexOf("model: 'openai/gpt-oss-20b'") !== -1, 'falta default vivo openai/gpt-oss-20b');
ok(/function migrateSlots/.test(revisor), 'falta migrateSlots (slots guardados con modelos muertos quedarían rotos)');
ok(/DEAD_MODELS\[s\.model\]/.test(revisor), 'migrateSlots no mapea modelos muertos');

/* Puente motor->revisor (regresión: runAudit leía window.V pero el motor nunca
   lo exponía, así que "Revisar con IA" siempre pedía crear los 3 diseños). */
const motor = fs.readFileSync(path.join(ROOT, 'js', 'motor-nucleo.js'), 'utf8');
const vExposes = (motor.match(/window\.V\s*=/g) || []).length;
ok(vExposes >= 2, 'motor debe exponer window.V al generar y al re-rollear (tiene ' + vExposes + ')');
ok(/window\.V\s*=\s*best/.test(motor), 'window.V debe ser el set de fichas A/B/C');
ok(/window\.V\s*=\s*LAST_RESULT\.set/.test(motor), 're-roll debe refrescar window.V');
ok(/typeof window\.V/.test(revisor), 'runAudit no lee window.V');

const passed = failures.length === 0;
console.log((passed ? 'PASS' : 'FAIL') + '  ai-slots  (' + checks + ' aserciones, ' + failures.length + ' fallos)');
failures.forEach(function (f) { console.log('  ✗ ' + f); });
process.exit(passed ? 0 : 1);
