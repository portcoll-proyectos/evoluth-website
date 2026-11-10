# SidePanel

Panel lateral derecho de 440 px para ver o editar el detalle de un registro sin salir de la tabla o la lista.

Recibe `code`, `title`, `meta` (el estado), `tabs` opcionales, un `body` organizado en secciones con lista de definiciones (`ev-dl`), `footer` y `headActions`.

- El panel sirve para consultar y hacer correcciones rápidas. Para crear un registro o hacer una tarea cerrada se usa la ventana, y para un flujo largo, una página.
- La cabecera muestra el código en `code`, el nombre en `title` y el estado debajo, separados del cuerpo por la línea Cian Menta.
- Admite tres pestañas como máximo. El pie queda fijo y el cuerpo se desplaza.
- La tabla de fondo sigue visible y, al cerrar el panel, la fila consultada recupera el foco.
