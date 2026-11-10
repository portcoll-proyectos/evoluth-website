# Evoluth UI · Corporativo · Libro de marca

Evoluth UI · Corporativo es la versión del sistema de Evoluth para finanzas, auditoría, reportes y tablas largas. Su forma es sobria y densa: más datos por pantalla, menos adorno. Usa los colores, la tipografía y el tono de la marca, Heroicons 2.1.5 como única librería de iconos y, como navegación, una barra con un icono por grupo que abre popups azules con los módulos, y las iniciales de la persona que abren su menú de usuario.

## Contenido y tono

- Español de Ecuador, con tuteo y voz activa. Títulos, botones y etiquetas en tipo oración, nunca en mayúsculas sostenidas.
- Botones con verbo y objeto: "Agregar activo", "Guardar cambios", "Eliminar empresa". No usar "Aceptar", "Enviar" ni "OK".
- Avisos en participio con el mismo verbo del botón: "Activo guardado", "Empresa eliminada".
- Los errores dicen qué pasó y qué hacer, con el texto de la base (`mensaje_usuario`). No se disculpan, no muestran códigos técnicos y no culpan a la persona.
- Un estado vacío dice qué falta y cómo seguir: "Ningún activo coincide con «xyz». Busca por nombre, código o empresa."
- Toda carga dice qué se carga: "Cargando activos…", "Abriendo Andina Energía…".
- Sin emoji ni signos de exclamación.
- Los códigos (ACT-00428, EMP-0031, ERR-7F3A-21C9) van en `code`; todo lo demás, en Montserrat.

## Color

- Colores de marca, sin alterar: `azul-corporativo` #12405E, `cian-menta` #3BA7A0, `negro-marca` #050A0F y `blanco-puro` #FFFFFF.
- Tema claro (positivo): lienzo `surface-sunken`, contenido en `surface`, texto `ink` (14.97:1) y `ink-muted` (6.55:1), títulos en `brand-ink`.
- Tema oscuro (negativo): fondo `negro-marca` y texto en blanco puro, como pide el manual. El Cian Menta se mantiene como acento.
- En tema claro, el Cian Menta no se usa para texto, porque sobre blanco llega a 2.91:1. Enlaces, iconos activos y estados de éxito usan `accent-strong` (#1E7A74, 5.13:1). Cuando el cian es relleno, el texto encima es `negro-marca` (6.83:1).
- El botón primario usa `brand-fill` con `on-brand`, y al pasar el puntero `brand-fill-hover` (8.35:1 en claro). El destructivo usa `danger-fill` y `danger-fill-hover`.
- Estados: `success` es un cian oscuro, para que no dependa de distinguir rojo y verde; `warning` es ámbar, `danger` rojo e `info` azul. Cada uno tiene su fondo `-soft`.
- Las animaciones de carga toman los tonos del icono 3D: `loader-light` #9BEAEA, `loader-mid` #5BBFC6, `loader-deep` y `loader-halo`; la barra de progreso es sólida, en `loader`.
- Los bordes de controles usan `line-control` (3:1 o más); los divisores, `line`.

## Tipografía

- Una sola familia, Montserrat, la del manual. `display` 28/34 700 para el título de página, `title` 20/28 600 para ventanas y paneles, `heading` 16/24 600 para secciones, `body` 14/22 400 para el texto, y `small` y `label` a 12 px. En las tablas, el texto baja a 13 px.
- `code` (IBM Plex Mono 13/20) se reserva para códigos que se leen o escriben carácter por carácter.
- Los números usan `font-variant-numeric: tabular-nums`. La moneda se escribe "$ 12.450,00" y se alinea a la derecha.

## Espacio, forma y profundidad

- Escala de 4 px, de `space-1` (4) a `space-7` (48). Las celdas usan `space-3`, las ventanas `space-5` y la separación entre secciones `space-6`.
- Densidad compacta: controles de 32 px (`control-h`) y filas de 34 px (`row-h`).
- Forma con radios rectos: `radius-sm` 3 px en controles y `radius-md` 6 px en ventanas, avisos y contenedores. `radius-node` se reserva para nodos.
- `shadow-float` va únicamente en ventanas, paneles laterales, avisos, los popups de módulos, el menú de usuario y los menús desplegables. Tarjetas y tablas no llevan sombra.
- La navegación es una barra de `nav-rail` (60 px) a la izquierda con un icono por grupo; cada uno abre un popup azul de `nav-w` (296 px) con sus módulos, y el primer botón abre todos. Abajo, las iniciales abren el menú de usuario (320 px), donde están la configuración y el cierre de sesión. La barra superior mide `appbar-h` (56 px).
- Ventanas y paneles llevan bajo la cabecera una línea Cian Menta de 2 px, tomada del manual. En la versión destructiva esa línea es `danger`.

## Foco y movimiento

- El foco es un anillo sólido de 2 px en `focus`, separado 2 px del control, sin animación (opción A), con contraste de 3:1 o más en todas las superficies. Dentro de la barra de iconos el anillo es Cian Menta.
- El hover solo cambia colores de la paleta en 150 ms: ningún elemento se desplaza y el botón primario no lleva línea.
- Lo que acaba de cambiar destella en `highlight` y vuelve a su color en 1,6 s; para llevar la vista a un elemento, un anillo late dos veces.
- El panel entra en 200 ms, el aviso sube en 180 ms y el popup de módulos entra desde la barra en 160 ms.
- Carga: rueda de nodos para acciones cortas, red Evoluth en 3D para listas, paneles, el inicio y el cambio de empresa, barra de progreso para procesos con porcentaje, barra superior para procesos largos sobre una tabla o ventana, y esqueleto para la primera carga. Siempre con texto.
- Todo respeta `prefers-reduced-motion`: sin transiciones ni desplazamientos, redes quietas y resaltado como fondo fijo.
