# SearchList

Lista con buscador que filtra mientras se escribe, por nombre, código o empresa, sin distinguir tildes ni mayúsculas.

Recibe los mismos `items` que Lista, un `placeholder` que diga por qué campos se puede buscar, `noun` (`['activo','activos']`) y `onSelect(id)`.

- Con el teclado, las flechas arriba y abajo recorren la lista, Enter elige y Esc borra la búsqueda.
- El contador muestra, por ejemplo, "2 de 8 activos" y se anuncia con `aria-live`.
- El texto que coincide se marca con fondo `success-soft` y un subrayado cian.
- Si nada coincide, el mensaje repite lo que se buscó y dice cómo seguir: "Busca por nombre, código o empresa. Para ver todo, borra la búsqueda." Un "No hay datos" deja a la persona sin saber qué hacer.
- Con más de 500 elementos, el filtrado se hace en el servidor y el diseño se mantiene.
