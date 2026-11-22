# Matriz de estrategias y criterios de aceptación · OAOA · páginas 29–33

**Estado:** primera fase de auditoría y controles de datos. Esta matriz se deriva de los `DATA`, los enunciados de los pasos 1–6 y la lógica de construcción de `pagina-29/index.html` a `pagina-33/index.html`. No representa una transcripción literal del PDF de origen ni garantiza identidad visual pixel a pixel.

**Contrato ejecutable:** `assets/oaoa-strategy-contract.js`. **Renderer:** `assets/oaoa-print-visuals.js`. **Imprimibles:** `editor-imprimibles/index.html`.

| Página | Estrategia central observada | Representación que debe mantenerse | Refuerzo | Ampliación | Condición matemática verificable |
|---|---|---|---|---|---|
| **29** | Cazar 9; hallar complementos y partes desconocidas | Regleta total 9; regleta conocida; hueco; igualdad `9 = a + ?` | Total y parte conocida visibles | Otra pareja y comprobación | Todas las parejas completan **9** |
| **30** | Construir/dibujar el 9 y pasar a diagramas | Regletas; **9 objetos**; diagrama parte-todo; suma | Modelo parcial y correspondencia guiada | Varias descomposiciones con cambio de representación | Una misma cantidad 9 en todos los modelos |
| **31** | Parejas del 7, 8 y 9; recuperación y organización | Regletas y parte faltante para cada uno de los tres totales | Una pareja de 7, otra de 8 y otra de 9 con apoyo | Variantes y patrones | La hoja representa **7, 8 y 9**, sin cantidades ajenas |
| **32** | El anterior como quitar una unidad | Regleta n; una unidad retirada; `n − 1`; descenso | Manipulación visible, un número por vez | Justificación del patrón −1 | **No** convertirlo en sumas o restas generales |
| **33** | Relacionar sumas con su resultado 7, 8 o 9 | Regletas de los sumandos, operación y grupo de resultado | Sumas-modelo apoyadas | Crear expresiones equivalentes y justificar | Todos los resultados pertenecen a {7,8,9}; presencia de los tres |

## Hallazgos y límites

1. **Error matemático corregido:** la biblioteca vectorial usaba `nums[1] || 1` y una segunda normalización `Math.max(1,...)`; ambos mecanismos convertían indebidamente cero en una unidad. El SVG ahora conserva cero como símbolo de ausencia de regleta.
2. **Desincronización texto–gráfico:** los bloques permiten editar texto; cambiar sus números no actualiza el SVG. El generador detecta diferencias numéricas respecto al modelo fuente y bloquea la impresión hasta restaurar/generar de nuevo, en lugar de producir una contradicción.
3. **Diferenciación insuficiente:** TEA y pictogramas comparten todavía los mismos ejercicios básicos que tarea; un rótulo o icono no acredita adaptación individualizada. **Pendiente de rediseño**.
4. **Matriz aún limitada:** las páginas 22–28 y anteriores precisan el mismo estudio de sus estrategias originales; no se debe extrapolar automáticamente la matriz 29–33.
5. **Fidelidad visual:** la biblioteca de SVG es una reinterpretación programática inspirada en el aspecto de las páginas. **No se ha verificado igualdad con las imágenes originales ni la impresión real**.

## Pruebas reproducibles y criterios de aceptación

- Validación de datos en 5 páginas × 5 modalidades × 3 versiones = **75 modelos**: todos pasan `OAOAStrategyContract.check`.
- Control negativo: la página 32 debe rechazar un ejercicio del tipo `sum` (mezcla de estrategias).
- Control del cero: representar `6 + 0` sin mostrar una regleta 1.
- Comprobación de sintaxis del JavaScript.
- **Pendientes de prueba en navegador:** no hay recortes en A4, tipografía Playwrite ES cargada, representación realmente visible en todas las modalidades, y que el control de cambios numéricos bloquea y desbloquea correctamente la impresión. La validación DOM/Canvas/impresión no puede sustituirse por pruebas de funciones aisladas.

## Próxima puerta de calidad

Antes de extender cambios de arquitectura a las 27 fichas, obtener PDF visual de cada página 29–33 en refuerzo y ampliación, revisar diez documentos contra las páginas de referencia y solucionar diferencias sustantivas en las representaciones. Después diseñar la diferenciación de tarea, TEA y pictogramas sobre necesidades reales de acceso y aprendizaje, no únicamente sobre número de preguntas.
