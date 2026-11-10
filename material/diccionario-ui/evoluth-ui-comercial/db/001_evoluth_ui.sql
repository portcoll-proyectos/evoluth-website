-- Evoluth UI · objetos de PostgreSQL (14 o superior) que usa la interfaz.
-- Mensajes de error para personas, registro técnico de errores y preferencias de pantalla en JSONB.

create schema if not exists ui;

-- 1. Catálogo de mensajes. La pantalla solo muestra mensaje_usuario.
create table if not exists ui.mensajes_error (
  codigo          text primary key,
  restriccion     text unique,                 -- nombre de la restricción de PostgreSQL que lo produce, si aplica
  campo           text,                        -- campo del formulario donde se muestra
  titulo_usuario  text,
  mensaje_usuario text not null check (length(mensaje_usuario) between 10 and 300),
  http_estado     smallint not null default 422,
  actualizado_en  timestamptz not null default now()
);

insert into ui.mensajes_error (codigo, restriccion, campo, titulo_usuario, mensaje_usuario, http_estado) values
  ('ACT_DUPLICADO', 'activos_codigo_key', 'codigo', null, 'El código {valor} ya pertenece a otro activo. Usa otro código o edita el activo existente.', 409),
  ('EMPRESA_CON_ACTIVOS', null, null, 'La empresa todavía tiene activos', 'Tiene {activos} activos registrados. Muévelos a otra empresa o elimínalos antes de eliminarla.', 409),
  ('SIN_PERMISO', null, null, 'No tienes permiso para esta acción', 'Pide el permiso a la persona que administra el clúster.', 403)
on conflict (codigo) do nothing;

-- 2. Registro técnico. Nunca se envía a la pantalla; soporte lo busca por referencia.
create table if not exists ui.errores_log (
  referencia      text primary key,            -- ERR-7F3A-21C9
  creado_en       timestamptz not null default now(),
  usuario_id      uuid,
  codigo          text,
  detalle_tecnico jsonb not null               -- sqlstate, mensaje, restricción, tabla, pila
);
create index if not exists errores_log_creado_en on ui.errores_log (creado_en desc);

-- 3. Preferencias de pantalla: tema y, por tabla, orden, columnas ocultas y filtros.
create table if not exists ui.preferencias (
  usuario_id     uuid primary key,
  datos          jsonb not null default '{"version": 1}'
                 check (jsonb_typeof(datos) = 'object' and datos ? 'version'),
  actualizado_en timestamptz not null default now()
);

-- Fusiona solo lo que cambió. Las tablas se fusionan una por una para no borrar las demás.
create or replace function ui.fusionar_preferencias(p_usuario uuid, p_parcial jsonb)
returns jsonb language sql as $$
  insert into ui.preferencias as p (usuario_id, datos)
  values (p_usuario, jsonb_build_object('version', 1) || p_parcial)
  on conflict (usuario_id) do update
    set datos = p.datos || (p_parcial - 'tablas')
              || jsonb_build_object('tablas', coalesce(p.datos -> 'tablas', '{}'::jsonb) || coalesce(p_parcial -> 'tablas', '{}'::jsonb)),
        actualizado_en = now()
  returning datos;
$$;

-- 4. Ejemplo de error de negocio que la API convierte en mensaje para personas.
--    raise exception using errcode = 'P0001', message = 'EMPRESA_CON_ACTIVOS',
--                          detail = json_build_object('activos', v_total)::text;

-- 5. Adjuntos que abre la vista previa de archivos (el archivo vive en el almacenamiento de objetos).
create table if not exists ui.adjuntos (
  id            uuid primary key default gen_random_uuid(),
  entidad       text not null,                 -- 'activo', 'empresa', 'contrato'
  entidad_id    uuid not null,
  nombre        text not null,
  tipo_mime     text not null,
  tamano_bytes  bigint not null check (tamano_bytes > 0),
  metadatos     jsonb not null default '{}',   -- {"paginas": 3} o {"hojas": ["Activos", "Resumen"]}
  subido_por    uuid not null,
  subido_en     timestamptz not null default now()
);
create index if not exists adjuntos_entidad on ui.adjuntos (entidad, entidad_id);
