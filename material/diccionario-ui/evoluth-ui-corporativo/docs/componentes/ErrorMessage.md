# ErrorMessage

Mensaje de error que muestra el texto que la base de datos escribió para las personas (`mensaje_usuario`) en lugar del error técnico.

Recibe la respuesta del servicio tal como llega. El componente lee `titulo_usuario`, `mensaje_usuario`, `campo` y `referencia`, e ignora siempre `detalle_tecnico`, los códigos SQL, las rutas y las trazas.

```json
{ "codigo": "ACT_DUPLICADO", "campo": "codigo",
  "mensaje_usuario": "El código ACT-00428 ya pertenece a otro activo. Usa otro código o edita el activo existente.",
  "detalle_tecnico": "(nunca se muestra)", "referencia": "ERR-7F3A-21C9" }
```

## De PostgreSQL a la pantalla

1. La base lanza el error: una restricción con nombre fijo (`activos_codigo_key`) o una regla de negocio con `raise exception using errcode = 'P0001', message = 'EMPRESA_CON_ACTIVOS', detail = json_build_object('activos', 158)::text`.
2. La API llama a `aErrorRespuesta(pool, err, usuarioId)`: busca el texto en `ui.mensajes_error`, rellena `{valor}` o `{activos}`, guarda el detalle técnico en `ui.errores_log` (JSONB) y devuelve `ErrorRespuesta` con la referencia.
3. React muestra `<ErrorMessage error={respuesta} />`. El tipo `ErrorRespuesta` no tiene `detalle_tecnico`, así que no hay forma de mostrarlo por error.

## Dónde aparece

- Con `campo`, debajo del campo afectado, con `aria-invalid` y `aria-describedby`.
- Por defecto, como banner dentro de una ventana o formulario, cuando el error no corresponde a un campo.
- Con `pagina`, cuando no se pudo cargar una vista; incluye el botón "Reintentar".

Si la base no envía `mensaje_usuario`, el componente muestra "No pudimos completar la acción. Intenta de nuevo en unos minutos." junto con la referencia, en lugar del error del servidor (por ejemplo, "ETIMEDOUT").

- La referencia se puede copiar. Con ella, soporte encuentra el detalle técnico en los registros.
- El texto de la base dice qué pasó y qué hacer, sin disculparse ni culpar a la persona.
