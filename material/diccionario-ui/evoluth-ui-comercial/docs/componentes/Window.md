# Window

Ventana modal para crear o editar un registro sin dejar la pantalla de fondo. La cabecera lleva la línea Cian Menta del manual.

Recibe un `title` con verbo y objeto, un `subtitle` opcional, `body` con los campos, `footer` con los botones, `size` (`sm` de 420 px, 560 px por defecto o `lg` de 760 px) y una `note` opcional a la izquierda del pie.

- Sirve para tareas de hasta unos ocho campos. Si hay más campos o varios pasos, la tarea necesita una página propia.
- En el pie, el botón secundario va a la izquierda del primario y ambos quedan a la derecha. "Cancelar" nunca guarda.
- Esc y la equis cierran la ventana. El clic en el velo la cierra solo si no hay cambios sin guardar.
- Al abrir, el foco va al primer campo y no sale de la ventana; al cerrar, vuelve al botón que la abrió.
- Los campos de solo lectura muestran el icono `bloqueo` y una ayuda que dice quién los asigna.
