# Reporte de verificación — Corrección de identidad semántica

- Proyecto: `ency07/taller-pod-copy`
- Rama: `fix/redteam-semantic-identity`
- Fecha: 2026-10-09
- Alcance: primer bloque del plan correctivo.
- Estado: implementación propuesta en rama aislada; pendiente de ejecución local y revisión.

## Cambios incluidos
- `js/motor-nucleo.js`: el resolver deja de elegir un símbolo aleatorio como fallback cuando no identifica el objeto principal.
- `js/motor-nucleo.js`: la generación CONTACTSHEET se detiene con un mensaje claro si la identidad queda ambigua.
- `js/motor-nucleo.js`: el concepto es la fuente de identidad; el mensaje no sustituye silenciosamente el concepto.
- `tests/semantic-identity.test.js`: añade casos deterministas de concepto largo, símbolo explícito y ambigüedad.

## Verificación
| Gate | Estado | Evidencia |
|---|---|---|
| Cambios aislados en rama | PASS | Rama `fix/redteam-semantic-identity` creada desde `main` |
| Sin cambios en `main` | PASS | Los archivos se escribieron únicamente en la rama de trabajo |
| Sin ejecutar tests en este entorno | PENDIENTE | La integración GitHub permite editar/leer; no se dispone aquí de ejecución Node sobre el checkout |
| Sintaxis JavaScript | PENDIENTE | Ejecutar `node --check js/motor-nucleo.js` |
| Test nuevo | PENDIENTE | Ejecutar `node tests/semantic-identity.test.js` |
| Suite existente | PENDIENTE | Ejecutar cada `tests/*.test.js` con Node |
| Prueba visual con imágenes reales | PENDIENTE | Requiere generar y comparar outputs A/B/C |
| Seguridad XSS / sincronización | PENDIENTE | Fuera del alcance de este primer bloque |

## Deuda técnica pendiente
- DEBT-001: la heurística de resolución semántica debe evaluarse con un corpus representativo y casos de conceptos en español e inglés.
- DEBT-002: el score de diversidad evalúa atributos textuales, no la similitud de imágenes finales.
- DEBT-003: formalizar perfiles estructurales HEAVY/SOFT/MODERN y validar incompatibilidades entre layout, jerarquía, densidad, tipografía y producto.
- DEBT-004: añadir evaluación visual posterior a la generación con evidencia reproducible.
- DEBT-005: auditar todas las interpolaciones `innerHTML` y ejecutar pruebas adversariales de XSS.
- DEBT-006: comprobar RLS/grants de Supabase desplegado y probar conflictos concurrentes, eliminaciones y sincronización entre usuarios.
- DEBT-007: decidir la política de almacenamiento de claves IA en `localStorage` y asegurar que no aparezcan en logs.
- DEBT-008: documentar la ejecución oficial de la suite y establecer CI para sintaxis y tests.
- DEBT-009: documentar la función de cada carpeta `.backup-*` y reducir ambigüedad de versiones sin borrar respaldos durante esta tarea.
- DEBT-010: verificar manualmente los flujos de UI, análisis de imagen, templates y copy en móvil/navegadores reales.

## Estado de cierre
No cerrar esta tarea hasta ejecutar las pruebas, revisar el diff de la rama y comprobar la generación con conceptos representativos. No se ha hecho merge a `main`.
