# DateText

Formato único de fechas: día, mes abreviado en minúscula y año ("29 oct 2026"), con reloj de 24 h. En pantalla no se usan fechas solo numéricas.

Recibe un `Date` o un texto ISO 8601 y uno de estos estilos: `fecha`, `fecha-hora`, `relativa`, `vencimiento` o `iso` (este último solo para exportaciones). Los rangos se escriben con `formatRange(a, b)`.

La opción A, recomendada, es "29 oct 2026": se entiende igual en cualquier país, ocupa poco y queda bien en columna. La opción B es "29/10/2026", más corta, pero "03/04/2026" puede leerse como 3 de abril o como 4 de marzo según el país; conviene solo si todas las empresas del clúster operan en Ecuador.

- La fecha relativa ("hace 3 h") se usa hasta 7 días; después se muestra la fecha completa. Al pasar el puntero aparece la fecha exacta (`title`).
- Los vencimientos se escriben como "Vence en 5 días", con estado `warning` cuando faltan 15 días o menos y `danger` cuando ya vencieron.
- Meses: ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov y dic. La semana empieza el lunes.
- El campo acepta que se escriba 15/10/2026 y lo muestra como "15 oct 2026". En el calendario, hoy lleva un punto y la fecha elegida se rellena con `brand-fill`.
- La base y la API guardan ISO 8601 con zona horaria, y la pantalla convierte a la hora de Ecuador (UTC−5).
