# Toast

Aviso emergente que confirma el resultado de una acción sin interrumpir el trabajo. Los avisos de error se quedan en pantalla hasta que la persona los cierra.

Recibe `tone` (`ok`, `info`, `warn` o `error`), un `title` en participio con el verbo del botón ("Activo guardado"), un `message` opcional con el dato concreto y una `action` opcional.

La opción A es una tarjeta en la esquina inferior derecha, para resultados con detalle; se pueden apilar hasta tres. La opción B es una barra compacta en Azul Corporativo, centrada abajo, para avisos de una línea que ofrecen "Deshacer".

- Los avisos de éxito e información duran 6 s y los de advertencia 9 s. Con el puntero encima o el foco dentro del aviso, el tiempo se detiene.
- Cada aviso lleva icono y título, además del color.
- Los errores de un formulario van junto al campo (ver Mensaje de error), no en un aviso.
- Los avisos de éxito usan `role="status"` y los de error `role="alert"`.
