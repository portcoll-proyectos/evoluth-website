# DangerConfirm

Confirmación para borrar un activo o una empresa. El botón de eliminar se habilita cuando la persona escribe el código exacto del registro.

Recibe `kind` (`activo` o `empresa`), `name`, `code` (el código del activo o de la empresa), `subtitle` (la empresa o el RUC), `impact` (lo que también se borra, con números reales) y `onConfirm`.

- Se usa solo para acciones que no se pueden deshacer. Si el registro se puede archivar, es mejor archivar y ofrecer "Deshacer" (Aviso, opción B).
- La ventana dice qué se borra y cuánto, por ejemplo "158 activos y su historial" o "14 usuarios pierden el acceso".
- La comparación ignora mayúsculas y espacios al principio y al final. Mientras el texto no coincide, un mensaje lo indica.
- El clic en el velo no cierra esta ventana; Esc y "Cancelar" sí. El foco empieza en el campo del código.
- El botón repite el verbo del título ("Eliminar empresa") y el aviso posterior lo pone en participio ("Empresa eliminada").
- Para una empresa se pide su código (EMP-0031) y no el RUC, porque es más corto y no se confunde con otros números.
