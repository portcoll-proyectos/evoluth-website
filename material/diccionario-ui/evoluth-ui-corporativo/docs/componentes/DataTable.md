# DataTable

Tabla de datos que permite ordenar por columna, filtrar y ocultar columnas, con la cabecera fija al desplazarse.

Recibe `columns` (`key`, `label`, `num`, `locked`, `render`, `text` para la búsqueda y `sortValue`), `rows`, `rowKey`, `caption`, `noun`, `quickFilters` opcionales (`id`, `label`, `test`), `height` y, para recordar la vista de cada persona, `prefs` y `onPrefsChange`.

El orden, las columnas ocultas y los filtros rápidos se guardan en `ui.preferencias.datos` (JSONB) por persona y por tabla: se conectan con `usePreferenciasUI().tabla("activos")`. Los montos llegan de PostgreSQL como texto (`numeric`) y se muestran con `formatMoney`; para ordenarlos, `sortValue` los convierte a número.

- Un clic en la cabecera ordena de forma ascendente y el siguiente, descendente. La flecha y `aria-sort` indican el orden, y se ordena por una sola columna a la vez.
- El buscador revisa todas las columnas, también las ocultas. Los filtros rápidos son botones que muestran un check cuando están activos.
- El menú "Columnas" oculta o muestra columnas. La columna de código es `locked` y no se puede ocultar, y el pie indica cuántas columnas están ocultas.
- La cabecera usa `position: sticky` sobre `surface-sunken`, con borde `line-control`.
- Los números se alinean a la derecha con cifras tabulares y la moneda se escribe "$ 12.450,00". Las fechas siguen el componente Fecha y los estados llevan nodo y palabra.
- Si nada cumple los filtros, la tabla dice "Ningún activo cumple los filtros." y cómo quitarlos.
- Cada fila mide 40 px. Con más de 200 filas, se pagina o se carga desde el servidor.
