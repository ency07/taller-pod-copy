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

## Actualización — selectores de variación (2026-10-09)

Se corrigieron en esta rama dos fallos observados en un prompt real:

- **Símbolo:** el valor predeterminado de la interfaz ahora es “Redibujar el mismo símbolo en A/B/C”. El motor usa la descripción del análisis para anclar la identidad visual y exige cambiar tratamiento/composición, no sustituir el objeto. La sustitución queda como acción explícita y ahora exige alternativas conceptualmente relacionadas, no objetos arbitrarios.
- **Textos — mismo mensaje:** el prompt ahora ordena una reescritura real por dirección, distinta entre A/B/C, en inglés nativo y con el mismo significado; ya no se limita a una instrucción genérica de “reformular”.
- **Textos — conservar palabras:** se exige conservar el texto visible detectado y no inventar palabras si el análisis no es fiable.
- **Textos — nuevo texto:** se exige copy original coherente con concepto/mensaje y distinto entre direcciones.
- **UI:** se actualizaron las etiquetas para describir mejor el comportamiento solicitado.

### Verificación de esta actualización

- [x] Cambios escritos en la rama fix/redteam-semantic-identity.
- [x] Se recuperaron de nuevo los archivos modificados para confirmar que existen en la rama.
- [ ] Suite Node ejecutada: pendiente; el conector disponible permite editar/leer GitHub, pero no ejecutar el proyecto.
- [ ] Prueba manual en Preview de Vercel: pendiente.
- [ ] Validar que la IA de imagen realmente dibuja texto legible: pendiente; depende del modelo de imagen y no queda garantizado por el prompt.
- [ ] Revisar todas las fichas de estilos para detectar contradicciones entre estilo artístico y tratamiento HEAVY/SOFT/MODERN: sigue como deuda independiente.

No integrar en main hasta ejecutar los tests y comprobar el Preview.

## Actualización — originalidad visual, contratos de selectores y revisión inicial de DOM (2026-10-09)

### Cambios en esta iteración
- `js/motor-nucleo.js`: la opción de redibujar ahora indica conservar el ADN conceptual sin calcar el rostro, pose, ángulo, encuadre, silueta, marco o distribución de la referencia.
- `js/motor-nucleo.js`: la opción de sustituir pide reinterpretaciones relacionadas con concepto, función simbólica y nicho; prohíbe elegir objetos arbitrarios del banco.
- `js/motor-nucleo.js`: se añadió una regla general de originalidad visual que prohíbe el mero recoloreado, el cambio superficial de técnica y la réplica con texto sustituido, y exige decisiones independientes de representación, encuadre, composición e integración tipográfica.
- `js/motor-nucleo.js`: se reforzó la instrucción de texto para exigir frases concretas distintas por dirección, sin placeholders ni simples instrucciones de reformulación.
- `js/motor-nucleo.js`: el render de muestras valida el color como hexadecimal antes de insertarlo en CSS; el error de regeneración pasa a `textContent`; `escHtml` escapa también apóstrofos.

### Verificación disponible
- [x] Cambios aislados en `fix/redteam-semantic-identity`.
- [x] Relectura de `js/motor-nucleo.js` e `index.html` en la rama.
- [x] Análisis sintáctico del texto completo de `motor-nucleo.js` con compilación JS sin ejecución: PASS. Esto no sustituye `node --check` en el entorno real.
- [x] Confirmado que PR #1 sigue abierto, en borrador y sin fusionar.
- [ ] No hay workflow de GitHub Actions asociado al último commit y el repo no tiene `package.json` en raíz; suite Node todavía no ejecutada.
- [ ] No se generaron imágenes ni se hizo evaluación visual automatizada.

### Seguridad — resultado preliminar, no auditoría completa
- En `js/motor-nucleo.js`, la mayoría de los valores dinámicos visibles en las tarjetas pasan por `escHtml`; el color de muestras ahora tiene una allowlist hexadecimal y el error de regeneración utiliza `textContent`.
- Esto no confirma ausencia de XSS en el repositorio completo: quedan por inspeccionar otros archivos JS y las rutas de datos que alimentan el DOM.
- No se pudo confirmar el almacenamiento de claves IA ni las políticas Supabase con la búsqueda disponible del conector; siguen siendo riesgos no verificados, no vulnerabilidades confirmadas.

### Siguiente gate
Revisar el diff completo y el flujo de `buildCandidate`/`formatPrompt`, localizar los módulos de credenciales y Supabase, ejecutar los tests desde un checkout con Node y después probar el Preview de Vercel. No fusionar hasta pasar esos gates.

## Actualización — eliminar bloqueo para conceptos descriptivos (2026-10-09)

- `js/motor-nucleo.js`: si no existe una coincidencia inequívoca en el banco, el concepto completo pasa a ser el ancla semántica. Así se aceptan escenas, lugares, relaciones y conceptos con varios elementos sin seleccionar un objeto arbitrario.
- El bloqueo queda reservado para el caso en que el campo de concepto está vacío.
- `tests/semantic-identity.test.js`: actualizados los casos para cubrir conceptos descriptivos, relaciones entre símbolos y concepto ausente.
- Verificación disponible: compilación sintáctica del contenido de los dos archivos revisados, pendiente ejecutar el test con Node real y probar el Preview.

## Actualización — DEBT-003: perfiles estructurales (2026-10-09)

### Implementación
- Se formalizaron perfiles estructurales universales HEAVY, SOFT y MODERN en `js/motor-nucleo.js`.
- Cada perfil define candidatos válidos de layout, tipografía, densidad, espacio negativo, jerarquía interna, forma del símbolo e integración texto/imagen.
- En CONTACTSHEET y Exploración, A/B/C aplica los perfiles estructurales HEAVY/SOFT/MODERN respectivamente.
- La selección se limita a opciones registradas en los pools; si el producto impone una restricción compatible disponible, esta prevalece.
- Los perfiles no reemplazan concepto, familia, mercado, audiencia ni jerarquía principal elegida. Variación y patrón no reciben este bloqueo.
- El prompt expone el perfil, densidad, espacio negativo y jerarquía interna para que la decisión sea auditable.
- Se añadieron pruebas deterministas de pertenencia a pools, densidad, layout, tipografía y restricciones de producto.

### Gates
- [x] Implementación aislada en `fix/redteam-semantic-identity`.
- [ ] CI de sintaxis y suite completa tras este commit.
- [ ] Validación visual real en varios estilos, productos y mercados.

## Actualización — DEBT-004/005: endurecimiento inicial del DOM y claves (2026-10-10)

### Cambios implementados en la rama
- El estado informativo en `js/ia-analisis.js` inserta mensajes como texto (`textContent`) en vez de interpretar HTML arbitrario desde `tell()`.
- Se elimina la clave ficticia fija de la URL de preflight Gemini; la comprobación de conectividad ya no transmite una cadena con forma de clave API.
- Las llamadas Gemini Vision y su prueba de conexión pasan la clave en la cabecera `x-goog-api-key` en lugar de añadirla a la query string, reduciendo su exposición en URLs y logs.
- `js/ia-revisor.js`: los estados del revisor usan texto plano en lugar de concatenar mensajes de error como HTML.

### Límites y verificación
- Es un endurecimiento inicial, no una certificación de seguridad completa. Una clave enviada desde el navegador sigue siendo visible para quien controla ese navegador. Para un despliegue multiusuario o público, se recomienda proxy/backend con secretos del lado servidor.
- No se afirma evaluación de similitud de imágenes: requiere artefactos generados y un evaluador/métrica explícitos.
- Supabase/RLS, conflictos de sincronización, UX móvil y Vercel Preview siguen pendientes de validar.
- El CI verde del head anterior (`c26ad53af3f01bc96acbb8dd59f19b86211f3e60`) no valida estos cambios; quedan a la espera de su propio run.

### Actualización de seguridad — claves IA y estados DOM (2026-10-10)
- Las claves para proveedores IA se guardan únicamente en `sessionStorage` durante la pestaña actual. En `localStorage` se mantiene la configuración de proveedor/modelo, con `key: ""`.
- Al leer la configuración se limpian claves heredadas que hayan quedado previamente en la configuración persistente.
- La UI identifica explícitamente el campo de clave como «solo esta pestaña».
- Los mensajes de estado heredados se convierten a texto plano y solo se conserva una clase visual de una allowlist; no se renderiza HTML dinámico.
- Las claves Gemini Vision se envían por la cabecera `x-goog-api-key`; el preflight no usa una clave ficticia ni se adjunta la clave a la URL.
- Se añadió `tests/security-regression.test.js` con contratos estáticos para estas protecciones. Son regresiones de fuente, no sustituyen pruebas en navegador, un análisis completo de todas las inserciones DOM ni una revisión del backend.

## Actualización — estado de CI y auditoría incremental de selectores (2026-10-10)

- [x] GitHub Actions confirmó **PASS** para la suite de regresión en el commit `f1c29b2a97d8c1fd55e01a1727992c73a9023f39` (push y pull request).
- [x] La revisión de los HTML dinámicos encontró que las opciones de subnicho se insertaban sin escape explícito en `js/ia-analisis.js`. Ahora se escapan tanto el valor como la etiqueta mediante `_escapeOptionText`.
- [x] Se añadió una aserción de regresión para ese contrato.
- [ ] La corrección del selector y la nueva aserción necesitan el resultado de CI del nuevo HEAD antes de considerarse verificadas.
- [ ] La revisión sigue siendo estática y parcial: aún requiere auditoría manual de todos los sinks dinámicos y sus fuentes, prueba real del flujo de login/sincronización con Supabase y revisión en navegador.
- [ ] No se ha verificado el proyecto Supabase desplegado ni se ha ejecutado una evaluación visual con imágenes generadas.
- [ ] Preview Vercel, móvil/navegadores reales y prueba de originalidad visual A/B/C siguen pendientes.

**Límite de cierre:** los tests estáticos y CI verde son necesarios, pero no equivalen a certificar ausencia total de XSS, seguridad de RLS desplegado o calidad visual final. Mantener PR #1 en borrador y no fusionar hasta completar los gates manuales.

## Actualización — segunda pasada de seguridad estática (2026-10-10)

- [x] CI verde para el commit `6c7a3d6b1b4389e8de45e9c0d7a23dec4692b5ec`: push y pull request. [Push](https://github.com/ency07/taller-pod-copy/actions/runs/38019900866) · [PR](https://github.com/ency07/taller-pod-copy/actions/runs/38019904939).
- [x] `editor-bancos.html`: escapado de valor/etiqueta al construir el selector de mercados y de valor/etiqueta para subnichos de temporada. Se añadieron contratos estáticos.
- [x] Revisión de los sinks `innerHTML` encontrados en `js/motor-nucleo.js`, `js/ia-analisis.js`, `js/ia-revisor.js`, `js/sync-supabase.js`, `editor-bancos.html` y `motor-lenguajes-visuales.html`. Los sinks de estado revisados usan mensajes constantes; las tarjetas de motor escapan los campos dinámicos y los colores pasan por validación. Los paneles IA/sync revisados escapan los valores que interpolan en atributos.
- [x] Búsqueda adicional en módulos de datos y navegación sin encontrar asignaciones directas a `innerHTML`/`outerHTML` en los archivos examinados.
- [ ] La revisión sigue siendo estática; no equivale a prueba adversarial XSS en navegador. El flujo alternativo de opciones de subnicho que delega en `getSubnicheOptionsHTML` debe mantenerse cubierto si cambia su implementación.
- [ ] Supabase desplegado/RLS y pruebas de sincronización multiusuario siguen sin verificarse.
- [ ] Preview de Vercel, pruebas móvil/navegadores y evaluación visual real de A/B/C siguen pendientes.

La suite de CI pasa en el HEAD indicado. No se declara la auditoría completa ni se fusiona el PR.

## Actualización — controles estáticos de sincronización (2026-10-10)

- Se añadieron pruebas para exigir sesión autenticada antes de sincronizar, filtrar lecturas por `user.id`, propagar errores de lectura/escritura y usar `mergeMemoryObjects` cuando esté disponible.
- CI para el nuevo commit: pendiente en este momento; no marcar esta actualización como verificada hasta que el workflow termine.
- Revisión de implementación: la fusión lee `updated_at`, pero no usa una condición atómica para evitar que dos dispositivos escriban simultáneamente. Existe riesgo de última escritura gana durante carreras concurrentes; se debe resolver con control de versión/función RPC atómica antes de certificar sincronización multi-dispositivo.
- RLS revisado en el SQL versionado: tabla con RLS, lectura/inserción/actualización limitadas por `auth.uid() = user_id`, y privilegios revocados a `anon`. Esto solo valida el archivo del repositorio, no el estado real del proyecto Supabase desplegado.

## Actualización — concurrencia de sincronización (2026-10-10)

- [x] La sincronización ya no usa `upsert` para reemplazar silenciosamente una fila remota que otro dispositivo haya modificado después de la lectura.
- [x] Para filas existentes, la escritura exige que `updated_at` siga coincidiendo con la versión leída; si cambió, aborta y pide volver a sincronizar.
- [x] Para la primera sincronización, usa `insert`; si otro dispositivo crea la fila antes, el conflicto de unicidad se comunica en vez de sobrescribirla.
- [x] Se añadieron contratos estáticos para ambos casos.
- [ ] CI del nuevo HEAD debe pasar antes de considerar esta corrección verificada.
- [ ] Esto reduce las sobrescrituras concurrentes, pero no es una transacción de fusión en servidor: aún hace falta prueba con dos sesiones reales y revisar que el tipo/precisión de `updated_at` se conserva en el cliente Supabase desplegado.
- [ ] No se ha validado el estado RLS del proyecto remoto; el SQL del repositorio no demuestra por sí solo lo que está desplegado.

## Actualización — auditoría estática incremental de sinks DOM (2026-10-10)

- [x] CI de regresión en el HEAD previo al cambio documental: **PASS** en commit `f31c27ddf75e0d814664d634e8fc012d9c0ab78d` (workflow `Node regression tests`, run `38021821568`).
- [x] Se revisaron los usos activos de `innerHTML` en `editor-bancos.html`, `motor-lenguajes-visuales.html`, `js/ia-analisis.js`, `js/ia-revisor.js`, `js/motor-nucleo.js` y `js/sync-supabase.js`, además de los módulos activos de datos/navegación.
- [x] En los sinks revisados, los valores de usuario/importación mostrados en texto o atributos se escapan o se insertan mediante `textContent`; los colores interpolados usan una validación hexadecimal. Los sinks restantes observados construyen etiquetas de listas/selectores con catálogos fijos o mensajes constantes.
- [ ] No se ejecutó un ataque XSS real en navegador ni se validaron todas las combinaciones de datos importados; esta pasada no certifica ausencia total de XSS.
- [ ] Sigue pendiente probar el flujo visual y de importación en un navegador real, y validar Preview Vercel y ES/EN.
- [ ] La validación desplegada de Supabase y sus pruebas con dos sesiones se mantiene intencionalmente para el último bloque.

**Resultado de esta pasada:** no apareció una nueva interpolación HTML sin escape que justificara otro cambio de código dentro del alcance inspeccionado. Se registra el resultado y se continúa con el siguiente bloque; PR #1 sigue en borrador y `main` permanece intacto.
