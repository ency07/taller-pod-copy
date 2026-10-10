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
- [x] Rama aislada; `main` sigue sin cambios.
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
