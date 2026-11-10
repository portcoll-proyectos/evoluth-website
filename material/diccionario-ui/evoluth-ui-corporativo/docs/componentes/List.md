# List

Lista de selección para elegir un registro (empresa, activo o usuario) cuando cada uno tiene pocos datos que comparar.

Recibe `items` con `id`, `title`, `code`, `meta` y un `status` opcional (`['ok'|'warn'|'bad'|'info', 'Palabra']`), un `label` para lectores de pantalla y `onSelect(id)`.

- Sirve hasta unos 30 elementos con dos o tres datos por fila. Si hay más datos o hace falta ordenar, usa Tabla.
- El elemento elegido lleva el nodo cian, fondo `surface-hover` y el título en `brand-ink`, de modo que la selección se ve aunque no se distinga el color.
- Cada fila mide 56 px: título en `body-strong`, código en `code` y metadatos en `small` con `ink-muted`.
- El estado se muestra con nodo y palabra.
