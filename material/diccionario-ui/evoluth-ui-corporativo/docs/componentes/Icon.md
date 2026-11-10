# Icon

Lista cerrada de 47 iconos dibujados con Heroicons 2.1.5 (MIT, contorno de 24 px, trazo 1.5), la única librería de este modelo.

Se obtienen con `Evoluth.icon(nombre)` en las vistas previas y con `<Icon name="activos" />` en React. Recibe el nombre exacto, tomado de `Evoluth.ICONOS`, y un `label` accesible cuando el icono aparece sin texto. `Evoluth.ICON_NOMBRES` da el nombre original de cada icono en Heroicons.

## Uso

- Pedir un nombre que no está en la lista produce un error en desarrollo. Para sumar un icono, se propone en este sistema y se agrega a la lista con su equivalente en Heroicons.
- Cada significado tiene un solo icono: `eliminar` es siempre la papelera y `cerrar` siempre la equis. `cerrar` no sirve para cancelar un proceso.
- Un icono sin texto necesita `label`, y su botón, `title`.
- El color se hereda del texto. Los iconos de estado usan `success`, `warning`, `danger` o `info` y van acompañados de una palabra.
- Tamaños permitidos: 16, 18, 20 y 24 px.
- No se mezclan iconos de otras librerías ni emoji.
- `perfil`, `idioma`, `tema` y `ayuda` se sumaron para el menú de usuario.

## Formatos

`@heroicons/react` (`/24/outline`) en React; `@heroicons/vue` y `heroicons` (SVG sueltos). Los 47 dibujos ya vienen en `bundle.js`, así que no hace falta instalar el paquete para las vistas previas.

## Licencia

Heroicons 2.1.5 se distribuye con licencia MIT, que permite usarlo en software que se vende. El texto de la licencia va en el archivo de avisos de terceros del producto.

## Equivalencias

| Nombre Evoluth | Heroicons |
|---|---|
| `panel` | `squares-2x2` |
| `activos` | `cube` |
| `empresas` | `building-office-2` |
| `usuarios` | `users` |
| `contratos` | `document-text` |
| `mantenimiento` | `wrench` |
| `reportes` | `chart-bar` |
| `configuracion` | `adjustments-horizontal` |
| `buscar` | `magnifying-glass` |
| `agregar` | `plus` |
| `editar` | `pencil` |
| `eliminar` | `trash` |
| `descargar` | `arrow-down-tray` |
| `subir` | `arrow-up-tray` |
| `filtrar` | `funnel` |
| `columnas` | `view-columns` |
| `ordenar` | `arrows-up-down` |
| `ordenar-asc` | `arrow-up` |
| `ordenar-desc` | `arrow-down` |
| `cerrar` | `x-mark` |
| `mas` | `ellipsis-horizontal` |
| `copiar` | `document-duplicate` |
| `refrescar` | `arrow-path` |
| `chevron-abajo` | `chevron-down` |
| `chevron-derecha` | `chevron-right` |
| `chevron-izquierda` | `chevron-left` |
| `contraer` | `chevron-double-left` |
| `expandir` | `chevron-double-right` |
| `check` | `check` |
| `info` | `information-circle` |
| `alerta` | `exclamation-triangle` |
| `error` | `x-circle` |
| `bloqueo` | `lock-closed` |
| `calendario` | `calendar` |
| `reloj` | `clock` |
| `notificaciones` | `bell` |
| `ver` | `eye` |
| `salir` | `arrow-right-start-on-rectangle` |
| `acercar` | `magnifying-glass-plus` |
| `alejar` | `magnifying-glass-minus` |
| `documento` | `document` |
| `hoja-calculo` | `table-cells` |
| `pantalla-completa` | `arrows-pointing-out` |
| `perfil` | `user-circle` |
| `idioma` | `globe-alt` |
| `tema` | `moon` |
| `ayuda` | `question-mark-circle` |
