# InteractionStates

Cómo responde la interfaz al puntero, al foco del teclado y a los cambios de datos en el modelo Corporativo. Todo usa colores de la paleta.

## Hover (150 ms)

| Elemento | Qué cambia |
|---|---|
| Botón primario | El azul pasa a `brand-fill-hover`; sin línea ni desplazamiento |
| Botón secundario | Borde y texto pasan a `brand-ink` sobre `surface-hover` |
| Botón discreto | Fondo `surface-hover` y texto `accent-strong` |
| Botón destructivo | Rojo más oscuro (`danger-fill-hover`) |
| Campos y filtros rápidos | Borde a `brand-ink` |
| Filas de lista y tabla | Fondo `surface-hover` |
| Módulos en el popup del menú | Fondo más claro; el nodo hueco se vuelve Cian Menta |
| Enlaces de texto (`ev-link`) | Subrayado Cian Menta que crece de izquierda a derecha |
| Barra de iconos | Fondo más claro |

Al pulsar, los botones bajan 1 px. Un botón deshabilitado no reacciona.

## Foco con acento · Opción A · anillo sólido

El foco es un anillo sólido de 2 px en `focus`, separado 2 px del control, sin animación. Es el más sobrio y el que mejor funciona en formularios y tablas, donde el foco se mueve mucho.

## Resaltado de cambios

- `ev-highlight`: lo que acaba de cambiar (una fila guardada, un valor recalculado) destella con `highlight` y vuelve a su color en 1,6 s. En las vistas previas, `Evoluth.highlight(el)`; en React, `useHighlight()`.
- `ev-highlight-ring`: para llevar la vista a un elemento (resultado de "Ir al activo"), un anillo Cian Menta late dos veces.
- El destello acompaña a un aviso o a un texto que dice qué cambió; no lo reemplaza.

## Movimiento reducido

Con `prefers-reduced-motion` se quitan las transiciones y los desplazamientos y el resaltado queda como fondo fijo hasta el siguiente cambio.
