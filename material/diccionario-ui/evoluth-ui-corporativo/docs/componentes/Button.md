# Button

Botones de acción en cuatro variantes. Se agregó al sistema porque todos los demás componentes lo usan.

Recibe `variant` (`primary`, `secondary`, `quiet` o `danger`), un `label` con verbo y objeto, y un `icon` opcional de la lista cerrada.

- Cada vista o ventana tiene un solo `primary`, a la derecha del pie.
- El texto dice lo que pasa al pulsarlo, como "Guardar cambios" o "Eliminar activo". "Aceptar" y "Enviar" no dicen nada.
- El aviso posterior repite el verbo: "Eliminar activo" produce "Activo eliminado".
- `danger` se reserva para acciones que destruyen datos, y siempre pasa por una confirmación.
- Si el botón está deshabilitado, el texto de al lado explica por qué (ver Confirmar acción peligrosa).
- Mientras la acción se completa, `loading` muestra la rueda de nodos y cambia el texto por `loadingLabel` ("Guardando…"); el botón no se puede pulsar dos veces.
- El hover de cada variante está en Hover, foco y resaltado.
- En este modelo el hover del primario solo cambia el color: sin línea Cian Menta ni desplazamiento.
