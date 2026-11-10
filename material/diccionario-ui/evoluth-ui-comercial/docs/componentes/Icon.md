# Icon

Lista cerrada de 47 iconos dibujados con Lucide 0.383.0 (ISC, contorno de 24 px, trazo 2), la única librería de este modelo.

Se obtienen con `Evoluth.icon(nombre)` en las vistas previas y con `<Icon name="activos" />` en React. Recibe el nombre exacto, tomado de `Evoluth.ICONOS`, y un `label` accesible cuando el icono aparece sin texto. `Evoluth.ICON_NOMBRES` da el nombre original de cada icono en Lucide.

## Uso

- Pedir un nombre que no está en la lista produce un error en desarrollo. Para sumar un icono, se propone en este sistema y se agrega a la lista con su equivalente en Lucide.
- Cada significado tiene un solo icono: `eliminar` es siempre la papelera y `cerrar` siempre la equis. `cerrar` no sirve para cancelar un proceso.
- Un icono sin texto necesita `label`, y su botón, `title`.
- El color se hereda del texto. Los iconos de estado usan `success`, `warning`, `danger` o `info` y van acompañados de una palabra.
- Tamaños permitidos: 16, 18, 20 y 24 px.
- No se mezclan iconos de otras librerías ni emoji.
- `perfil`, `idioma`, `tema` y `ayuda` se sumaron para el menú de usuario.

## Formatos

`lucide-react` en React; `lucide` (JavaScript sin framework), `lucide-static` (SVG, sprite y fuente), `lucide-vue-next` y `lucide-angular`. Los 47 dibujos ya vienen en `bundle.js`, así que no hace falta instalar el paquete para las vistas previas.

## Licencia

Lucide 0.383.0 se distribuye con licencia ISC, que permite usarlo en software que se vende. El texto de la licencia va en el archivo de avisos de terceros del producto.

## Equivalencias

| Nombre Evoluth | Lucide |
|---|---|
| `panel` | `layout-dashboard` |
| `activos` | `box` |
| `empresas` | `building-2` |
| `usuarios` | `users` |
| `contratos` | `file-text` |
| `mantenimiento` | `wrench` |
| `reportes` | `bar-chart-3` |
| `configuracion` | `sliders-horizontal` |
| `buscar` | `search` |
| `agregar` | `plus` |
| `editar` | `pencil` |
| `eliminar` | `trash-2` |
| `descargar` | `download` |
| `subir` | `upload` |
| `filtrar` | `filter` |
| `columnas` | `columns-3` |
| `ordenar` | `arrow-up-down` |
| `ordenar-asc` | `arrow-up` |
| `ordenar-desc` | `arrow-down` |
| `cerrar` | `x` |
| `mas` | `ellipsis` |
| `copiar` | `copy` |
| `refrescar` | `refresh-cw` |
| `chevron-abajo` | `chevron-down` |
| `chevron-derecha` | `chevron-right` |
| `chevron-izquierda` | `chevron-left` |
| `contraer` | `panel-left-close` |
| `expandir` | `panel-left-open` |
| `check` | `check` |
| `info` | `info` |
| `alerta` | `triangle-alert` |
| `error` | `circle-x` |
| `bloqueo` | `lock` |
| `calendario` | `calendar` |
| `reloj` | `clock` |
| `notificaciones` | `bell` |
| `ver` | `eye` |
| `salir` | `log-out` |
| `acercar` | `zoom-in` |
| `alejar` | `zoom-out` |
| `documento` | `file` |
| `hoja-calculo` | `file-spreadsheet` |
| `pantalla-completa` | `maximize-2` |
| `perfil` | `circle-user` |
| `idioma` | `globe` |
| `tema` | `moon` |
| `ayuda` | `circle-help` |
