# Icon

Lista cerrada de 47 iconos dibujados con Material Symbols 0.23.0 (Apache 2.0, relleno, peso 400, 24 px), la única librería de este modelo.

Se obtienen con `Evoluth.icon(nombre)` en las vistas previas y con `<Icon name="activos" />` en React. Recibe el nombre exacto, tomado de `Evoluth.ICONOS`, y un `label` accesible cuando el icono aparece sin texto. `Evoluth.ICON_NOMBRES` da el nombre original de cada icono en Material Symbols.

## Uso

- Pedir un nombre que no está en la lista produce un error en desarrollo. Para sumar un icono, se propone en este sistema y se agrega a la lista con su equivalente en Material Symbols.
- Cada significado tiene un solo icono: `eliminar` es siempre la papelera y `cerrar` siempre la equis. `cerrar` no sirve para cancelar un proceso.
- Un icono sin texto necesita `label`, y su botón, `title`.
- El color se hereda del texto. Los iconos de estado usan `success`, `warning`, `danger` o `info` y van acompañados de una palabra.
- Tamaños permitidos: 16, 18, 20 y 24 px.
- No se mezclan iconos de otras librerías ni emoji.
- `perfil`, `idioma`, `tema` y `ayuda` se sumaron para el menú de usuario.

## Formatos

`@material-symbols/svg-400` (SVG); fuente variable `material-symbols` y Google Fonts. `@mui/icons-material` es Material Icons, la versión anterior. Los 47 dibujos ya vienen en `bundle.js`, así que no hace falta instalar el paquete para las vistas previas.

## Licencia

Material Symbols 0.23.0 se distribuye con licencia Apache 2.0, que permite usarlo en software que se vende. El texto de la licencia va en el archivo de avisos de terceros del producto.

## Equivalencias

| Nombre Evoluth | Material Symbols |
|---|---|
| `panel` | `dashboard` |
| `activos` | `inventory_2` |
| `empresas` | `apartment` |
| `usuarios` | `group` |
| `contratos` | `description` |
| `mantenimiento` | `build` |
| `reportes` | `bar_chart` |
| `configuracion` | `tune` |
| `buscar` | `search` |
| `agregar` | `add` |
| `editar` | `edit` |
| `eliminar` | `delete` |
| `descargar` | `download` |
| `subir` | `upload` |
| `filtrar` | `filter_alt` |
| `columnas` | `view_column` |
| `ordenar` | `swap_vert` |
| `ordenar-asc` | `arrow_upward` |
| `ordenar-desc` | `arrow_downward` |
| `cerrar` | `close` |
| `mas` | `more_horiz` |
| `copiar` | `content_copy` |
| `refrescar` | `refresh` |
| `chevron-abajo` | `keyboard_arrow_down` |
| `chevron-derecha` | `chevron_right` |
| `chevron-izquierda` | `chevron_left` |
| `contraer` | `left_panel_close` |
| `expandir` | `left_panel_open` |
| `check` | `check` |
| `info` | `info` |
| `alerta` | `warning` |
| `error` | `cancel` |
| `bloqueo` | `lock` |
| `calendario` | `calendar_today` |
| `reloj` | `schedule` |
| `notificaciones` | `notifications` |
| `ver` | `visibility` |
| `salir` | `logout` |
| `acercar` | `zoom_in` |
| `alejar` | `zoom_out` |
| `documento` | `draft` |
| `hoja-calculo` | `table_view` |
| `pantalla-completa` | `fullscreen` |
| `perfil` | `account_circle` |
| `idioma` | `language` |
| `tema` | `dark_mode` |
| `ayuda` | `help` |
