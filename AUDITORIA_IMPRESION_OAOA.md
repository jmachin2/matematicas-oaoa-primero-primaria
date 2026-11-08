# Auditoría y criterios comunes de impresión · Matemáticas OAOA 1.º Primaria
Fecha: 8 de noviembre de 2026. Fuente: archivos `index.html` de las fichas enlazadas en `fichas/index.html`, `examenes/index.html` y `editor-imprimibles/index.html` obtenidos de GitHub.

## Principio de conservación
**No modificar el formato gráfico ni la secuencia didáctica de las fichas ya aprobadas.** La presentación de las fichas 22–24 es la referencia de aspecto. Cualquier editor debe ser opcional, no sustituir la plantilla original.

## Inventario auditable
| Grupo | Páginas | Motor de impresión identificado | Hallazgos |
|---|---|---|---|
| Iniciales | Números hasta el 4, Número 5, Complementarios | Generador `worksheet` con regeneración y descarga | Motor distinto al de las páginas 16–24; requiere pruebas de sus 5 modalidades y descarga real |
| Primera etapa | 10 y 14 | PDF generado a partir de imágenes/bytes y vista previa | Implementación propia y diferente de las páginas 16–24; se detectó limpieza prematura de URL |
| Etapa central | 16–21 | Canvas A4 -> JPEG -> PDF, modalidades y botón Otra versión | Diseño de referencia similar a 22–24, pero sin editor opcional; regeneración no necesariamente altera todos los ejercicios |
| Etapa central final | 22–24 | Canvas A4 -> JPEG -> PDF original; editor independiente opcional | Formato a conservar; algunas modalidades son estáticas aunque aumente el indicador de versión |
| Nuevas | 25–28 | Editor HTML A4 separado, impresión del navegador | Tiene controles de edición y versiones, pero **no** conserva la apariencia de los imprimibles Canvas clásicos |
| Exámenes | Generador de exámenes | Constructor PDF propio con previsualización y enlace de respaldo | Subsistema independiente; falta prueba real de descarga en navegadores y coherencia A4 |
| Pendiente de lectura | Cuatro o cinco; 9; 11; 13 | No determinado | El conector devolvió contenido vacío para el archivo; **no se concluye** que el archivo publicado esté vacío |

## Correcciones técnicas realizadas en esta auditoría
- Páginas 10 y 14: ampliar la retención de la URL temporal PDF de 900 ms a 60 000 ms para reducir el riesgo de interrupción de la descarga.
- Páginas 16–24: ampliar la retención de la URL temporal PDF de 700–800 ms a 60 000 ms sin alterar HTML, secuencia ni formato del documento.
- No se han rediseñado las fichas ni los ejercicios para realizar estos cambios.

## Criterios obligatorios para futuras fichas
1. **Identidad visual:** conservar la retícula, jerarquía, colores, recuadros, espacios para respuestas y composición de las fichas clásicas; no reemplazar el diseño por un cuestionario de líneas.
2. **Formato:** A4 vertical (210 × 297 mm); reservar como mínimo 10 mm de margen y evitar texto/dibujos fuera del área útil. No separar título del ejercicio al paginar.
3. **Sin superposiciones:** textos adaptados al ancho, dibujo dentro del rectángulo reservado, medición del ancho real del texto, verificación de límites de página y separación entre bloques. La etiqueta "versión" no cuenta como contenido alternativo.
4. **Cinco modalidades:** ampliación, refuerzo, tarea, TEA y pictogramas. Deben ser distintas y pedagógicamente adecuadas, no solo renombradas.
5. **Otra versión:** pulsar debe modificar datos relevantes del ejercicio **o** explicar con claridad que no hay más variantes. No basta con cambiar un número de versión.
6. **Editor:** opcional; no sustituye al generador visual aprobado. Guardar por página/modalidad/versión sin alterar accidentalmente otras modalidades.
7. **Descargas:** nombre `paginaNN_modalidad_vX.pdf`, PDF válido y visible, control de errores y enlace alternativo cuando el navegador bloquee la descarga. No revocar URL temporal inmediatamente.
8. **Regletas:** respetar colores establecidos (1 blanca, 2 roja, 3 verde claro, 4 rosa, 5 amarilla, 6 verde oscuro, 7 negra, 8 marrón, 9 azul, 10 naranja).
9. **Accesibilidad:** textos legibles, alto contraste, instrucciones breves, suficiente espacio para escribir, y símbolos/pictogramas sin cortar.
10. **Validación:** probar cinco modalidades y dos versiones por ficha, comparar la vista con el PDF generado y examinar la página impresa. Comprobar Chromium y otro navegador cuando sea posible.

## Incidencias todavía abiertas
- **P1 — Versiones poco variables:** páginas 16–24; especialmente las modalidades del generador Canvas basadas en grupos fijos. Hace falta inventario específico de tareas antes de cambiar los ejercicios.
- **P1 — Desajuste visual:** páginas 25–28 usan HTML A4; es necesario adaptar su generador al aspecto original sin perder controles del editor.
- **P1 — Superposiciones:** el código Canvas usa coordenadas fijas. Los controles de límites HTML no inspeccionan ese Canvas. Se requiere validación visual de cada salida y/o instrumentación de detección de colisión.
- **P2 — Cobertura incompleta:** comprobar los cuatro archivos cuyo contenido no pudo recuperarse en esta auditoría.
- **P2 — Fallback PDF:** descarga potencialmente bloqueada en otros navegadores; el cambio de retención de URLs no sustituye pruebas de descarga ni capturas.
- **P2 — Exámenes:** sistema propio separado; verificar descargas PDF y la composición de las pruebas.

## Estado de verificación
Esta auditoría es **estática, sobre código del repositorio**. El control de sintaxis y la confirmación de los cambios escritos no prueban que GitHub Pages haya actualizado sus archivos ni que todos los PDF se visualicen sin cortes. No declarar "sin superposiciones" hasta efectuar una revisión visual por ficha y modalidad.
