# Reporte de Verificación — Sandbox de bancos (no cruce EN/ES/gospel)

## Contexto
- Proyecto: Taller POD (front-end vanilla, sin bundler ni framework de tests).
- Tarea / REQ: Ningún mercado puede recibir objetos de otro idioma (EN/ES) ni mezclar bancos gospel/seculares/colombianos.
- Fecha: 2026-10-06
- Entorno: Windows, PowerShell, Node 24, Playwright (Chromium), servidor `python -m http.server 8765`.

## Cambios
- `js/banco-global.js`: exporta `POD_BANK_KEYS_EN/ES` para filtrar claves por idioma.
- `js/data-bancos.js`: `getBankForSubniche(id, region, marketId)` filtra claves por idioma del mercado en TODAS las ramas (antes el catch-all concatenaba EN+ES); `bankLangFor()` declara el idioma por mercado y normaliza región desconocida a la región principal del mercado.
- `js/motor-nucleo.js`: los 3 call sites pasan `MOTOR_STATE.market`.
- `js/banco-gospel-es.js`: reemplaza 3 objetos copiados del banco común secular (`camino estrecho…`, `faro que sigue…`, `farol que ilumina…`) por objetos doctrinales propios.
- `js/banco-gospel-en.js`: reemplaza `lantern lighting just the next step` por `lamp that is not hidden under the bed`.
- `index.html`: favicon inline `data:,` para eliminar el 404 de consola.
- `tests/bank-sandbox.test.js`: test determinista (Node + `vm`, sin DOM) con 2366 aserciones.

## Pruebas ejecutadas
| Perspectiva | Resultado | Comando / evidencia |
|---|---|---|
| Sintaxis todos los `js` | PASS | `Get-ChildItem js\*.js \| % { node --check }` → sin FAIL |
| Suite bank-sandbox (Node) | PASS | `node tests\bank-sandbox.test.js` → `PASS bank-sandbox (2366 aserciones, 0 fallos)` |
| Camino feliz navegador (10 mercados) | PASS | `page.evaluate` 765 combinaciones mercado×región×subnicho: 0 pools vacíos, 0 fugas de idioma, 0 cruces gospel |
| Región desconocida | PASS | `region_que_no_existe` en 7 mercados → pool no vacío y sin mezcla de idiomas |
| Generación UI real | PASS | Click "Crear los 3 diseños" → "Listo: los tres pasan el control de diferencia", gate 100/100, `out` 3250 chars sin `undefined/NaN/null` |
| XSS adversarial | PASS | Payload `"><img src=x onerror=alert(1)>` en concepto → 0 `<img>` inyectados (solo `#imagePreview` legítimo), 0 `onerror` |
| Consola | PASS | 0 errores / 0 warnings (tras fix favicon) |
| Secretos | PASS | `grep service_role/apikey` solo menciones de texto en `sync-supabase.js` |

## Hallazgos
| ID | Severidad | Descripción | Acción | Estado |
|---|---|---|---|---|
| H-01 | Alta | `getBankForSubniche` mezclaba claves EN+ES en ramas catch-all | Filtro por idioma en todas las ramas | Cerrado |
| H-02 | Alta | Gospel ES reutilizaba 3 objetos del banco común secular; gospel EN 1 | Reemplazo por objetos doctrinales propios | Cerrado |
| H-03 | Media | Mercado `custom` (language auto) infería ES ante región desconocida | Normaliza a región principal del mercado | Cerrado |
| H-04 | Baja | 404 favicon.ico en consola | `link rel=icon data:,` | Cerrado |

## Deuda registrada
- Sin framework de tests: el test es un script Node (`node tests/bank-sandbox.test.js`), sin runner ni CI. Si se adopta un runner, migrarlo.
- Sin SRI en CDN Supabase; `getBankForSubniche` ignora el mercado cuando se llama sin `marketId` (solo ocurre en código legacy; los 3 call sites del motor ya lo pasan).

## Declaración final
Los gates aplicables fueron verificados. No quedan hallazgos críticos ni altos abiertos.
