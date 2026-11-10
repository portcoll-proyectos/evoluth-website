# ModuleMenu

Navegación de la aplicación: una barra de iconos a la izquierda con un icono por grupo de módulos, popups azules con los nombres y, abajo, las iniciales de la persona que abren su menú de usuario.

En React es `<AppShell>`. Recibe `groups` (cada grupo con `label`, `icon` y sus `items`: `id`, `icon`, `label` y `count` opcional), `active`, `onNavigate(id)`, `tenant` (la empresa activa), `user` (`initials`, `name`, `email`), `userMenu` (`orgBadge`, `idioma`, `tema`, `info` y `onAction(id)`), `onLogout`, `logo` opcional y la pantalla como `children`.

## Barra de iconos

La barra mide 60 px (`nav-rail`) y queda siempre visible. De arriba abajo:

- El botón del menú completo.
- Un icono por grupo (Operación, Administración). Al pasar el puntero aparece el nombre del grupo y cuántos módulos tiene. El grupo que contiene el módulo activo lleva fondo y el nodo Cian Menta.
- Al final, las iniciales de la persona en un círculo Cian Menta.

## Popup de un grupo

Un clic en el icono de un grupo abre un popup azul de 296 px (`nav-w`) a la altura de ese icono, con el icono y el nombre del grupo arriba y solo sus módulos, sobre el riel de nodos. Si se hace clic en otro grupo, el popup abierto se cierra y se abre el del nuevo grupo.

## Popup completo

El primer botón de la barra abre el popup con todo: el selector de empresa arriba y todos los grupos con sus módulos. El módulo activo lleva el nodo Cian Menta enlazado, fondo más claro y peso 700; los contadores van a la derecha.

## Menú de usuario

Las iniciales abren una tarjeta clara de 320 px que sube desde la esquina inferior. Arriba muestra las iniciales, el nombre y el correo; después, en este orden:

| Opción | Icono | A la derecha |
|---|---|---|
| Mi perfil | `perfil` | |
| Configuración | `configuracion` | Atajo Ctrl+Shift+, |
| Configuración de la empresa | `empresas` | Pendientes en un círculo rojo (`orgBadge`) |
| Idioma | `idioma` | Idioma actual |
| Tema | `tema` | Claro u Oscuro; un clic cambia el tema |
| Obtener ayuda | `ayuda` | |
| Más información | `info` | Flecha; abre un submenú (novedades, términos, privacidad) |
| Cerrar sesión | `salir` | |

Las líneas separan la cuenta y la configuración, la información y el cierre de sesión. Cerrar sesión ya no está en la barra ni en el popup de módulos: solo en este menú.

## Animaciones

- Apertura: El popup entra desde la barra con un deslizamiento corto de 160 ms, sin cascada ni rebote del nodo. El menú de usuario sube desde las iniciales en 140 ms.
- Hover: en los popups azules, el nodo hueco del módulo se vuelve Cian Menta; en el menú de usuario, la fila se ilumina y el icono pasa a `accent-strong`.
- Elegir un módulo: el nodo encendido pasa al módulo elegido en 200 ms y el popup se cierra.
- Cierre: los popups azules se deslizan hacia la barra en 150 ms; el menú de usuario baja y desaparece en 120 ms.
- El icono del botón del menú completo gira 180° mientras está abierto.
- Con `prefers-reduced-motion`, todo aparece y desaparece sin animación.

## Reglas

- Solo hay un popup abierto a la vez. Se cierra con Esc, con un clic fuera, con Tab o al elegir; el foco vuelve a la barra.
- Las flechas arriba y abajo recorren la barra, los módulos y las opciones del menú de usuario. En "Más información", la flecha derecha abre el submenú y la izquierda lo cierra.
- Cada grupo tiene su propio icono, distinto de los de sus módulos cuando sea posible. Admite hasta cuatro grupos y diez módulos en total.
- El selector de empresa va solo en el popup completo, porque cambiarla cambia todos los datos de la pantalla.
- El menú de usuario toma los colores del tema (`surface-raised`, `ink`), para distinguirse de la navegación azul.
- `nav-bg` es Azul Corporativo en tema claro y casi negro en oscuro. Los nombres tienen un contraste de 10.9:1 o más; las iniciales, negro sobre Cian Menta, 6.83:1.
- El logotipo de la barra superior se oculta en tema oscuro hasta que exista la versión negativa.
