/* Evoluth UI · lado servidor (Node + node-postgres).
   Convierte cualquier error en ErrorRespuesta: la pantalla recibe solo el texto para personas;
   el detalle técnico se guarda en ui.errores_log (JSONB) con una referencia. */
import { randomBytes } from "node:crypto";
import type { Pool } from "pg";
import type { ErrorRespuesta } from "../tipos";

interface ErrorPg extends Error { code?: string; detail?: string; constraint?: string; table?: string; column?: string; schema?: string }
interface FilaMensaje { codigo: string; campo: string | null; titulo_usuario: string | null; mensaje_usuario: string; http_estado: number }

export function nuevaReferencia(): string {
  const h = randomBytes(4).toString("hex").toUpperCase();
  return `ERR-${h.slice(0, 4)}-${h.slice(4)}`;
}

/** "Key (codigo)=(ACT-00428) already exists." → "ACT-00428" */
function valorDelDetalle(detalle?: string): string | null {
  const m = detalle?.match(/\)=\((.*?)\)/);
  return m ? m[1] : null;
}

function plantilla(texto: string, datos: Record<string, unknown>): string {
  return texto.replace(/\{(\w+)\}/g, (_, k) => (datos[k] == null ? "" : String(datos[k])));
}

export async function aErrorRespuesta(pool: Pool, err: unknown, usuarioId?: string | null): Promise<{ status: number; cuerpo: ErrorRespuesta }> {
  const e = (err ?? {}) as ErrorPg;
  const referencia = nuevaReferencia();
  let fila: FilaMensaje | undefined;
  let datos: Record<string, unknown> = {};
  try {
    if (e.code === "P0001") {
      // Errores de negocio lanzados con: RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'CODIGO', DETAIL = '{"campo":"valor"}';
      try { datos = e.detail ? JSON.parse(e.detail) : {}; } catch { datos = {}; }
      fila = (await pool.query<FilaMensaje>("select codigo, campo, titulo_usuario, mensaje_usuario, http_estado from ui.mensajes_error where codigo = $1", [e.message])).rows[0];
    } else if (e.constraint) {
      datos = { valor: valorDelDetalle(e.detail) };
      fila = (await pool.query<FilaMensaje>("select codigo, campo, titulo_usuario, mensaje_usuario, http_estado from ui.mensajes_error where restriccion = $1", [e.constraint])).rows[0];
    }
  } catch { /* si el catálogo no responde, se usa el mensaje por defecto */ }

  const detalle = { sqlstate: e.code ?? null, mensaje: e.message ?? String(err), detalle: e.detail ?? null, restriccion: e.constraint ?? null, tabla: e.table ?? null, columna: e.column ?? null, pila: e.stack?.split("\n").slice(0, 8) ?? null };
  pool.query("insert into ui.errores_log (referencia, usuario_id, codigo, detalle_tecnico) values ($1, $2, $3, $4)", [referencia, usuarioId ?? null, fila?.codigo ?? "INESPERADO", detalle]).catch(() => {});

  if (!fila) return { status: 500, cuerpo: { codigo: "INESPERADO", referencia } };
  return {
    status: fila.http_estado,
    cuerpo: { codigo: fila.codigo, campo: fila.campo, titulo_usuario: fila.titulo_usuario, mensaje_usuario: plantilla(fila.mensaje_usuario, datos), referencia },
  };
}
