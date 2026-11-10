# InteractionStates

Cómo responde la interfaz al puntero, al foco del teclado y a los cambios de datos en el modelo Comercial. Todo usa colores de la paleta.

## Hover (150 ms)

| Elemento | Qué cambia |
|---|---|
| Botón primario | El azul pasa a `brand-fill-hover`, una línea Cian Menta de 2 px crece desde el centro y el botón sube 1 px |
| Botón secundario | Borde y texto pasan a `brand-ink` sobre `surface-hover` |
| Botón discreto | Fondo `surface-hover` y texto `accent-strong` |
| Botón destructivo | Rojo más oscuro (`danger-fill-hover`) |
| Campos y filtros rápidos | Borde a `brand-ink` |
| Filas de lista y tabla | Fondo `surface-hover`; en listas aparece un nodo cian tenue a la izquierda y la flecha avanza 2 px |
| Módulos en el popup del menú | Fondo más claro; el nodo hueco se vuelve Cian Menta y crece un poco |
| Enlaces de texto (`ev-link`) | Subrayado Cian Menta que crece de izquierda a derecha |
| Barra de iconos | Fondo más claro y el icono avanza 1 px |

Al pulsar, los botones bajan 1 px. Un botón deshabilitado no reacciona.

## Foco con acento · Opción B · anillo con halo Cian Menta

El anillo sólido de 2 px en `focus` aparece con un halo Cian Menta (`focus-halo`) que se expande una vez en 320 ms. Se aplica a todos los controles de este modelo. El anillo sólido sigue siendo el que da el contraste de 3:1.

## Resaltado de cambios

- `ev-highlight`: lo que acaba de cambiar (una fila guardada, un valor recalculado) destella con `highlight` y vuelve a su color en 1,6 s. En las vistas previas, `Evoluth.highlight(el)`; en React, `useHighlight()`.
- `ev-highlight-ring`: para llevar la vista a un elemento (resultado de "Ir al activo"), un anillo Cian Menta late dos veces.
- El destello acompaña a un aviso o a un texto que dice qué cambió; no lo reemplaza.

## Movimiento reducido

Con `prefers-reduced-motion` se quitan las transiciones y los desplazamientos, el halo del foco no aparece y el resaltado queda como fondo fijo hasta el siguiente cambio.
