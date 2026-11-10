/* Evoluth UI · tipos compartidos entre la API (Node + PostgreSQL) y React. */

/** Estado visible de un registro: nodo + palabra. */
export type Tono = "ok" | "warn" | "bad" | "info";
export type Estado = [Tono, string];

/**
 * Respuesta de error que la API envía a la pantalla.
 * No existe `detalle_tecnico` en este tipo a propósito: se guarda en `ui.errores_log` y nunca sale del servidor.
 */
export interface ErrorRespuesta {
  codigo: string;
  campo?: string | null;
  titulo_usuario?: string | null;
  mensaje_usuario?: string | null;
  referencia?: string | null;
}

/** Orden y columnas ocultas de una tabla, guardados en JSONB. */
export interface PreferenciasTabla {
  ocultas?: string[];
  orden?: { columna: string; dir: "asc" | "desc" } | null;
  filtros?: string[];
}

/** Documento JSONB `ui.preferencias.datos`, uno por persona. */
export interface PreferenciasUI {
  version: 1;
  tema?: "light" | "dark";
  tablas?: Record<string, PreferenciasTabla>;
}

/**
 * Montos: PostgreSQL `numeric(14,2)` llega desde node-postgres como string ("12450.00")
 * para no perder precisión. Se formatea sin convertir a número.
 */
export type Monto = string;

/** Fechas: PostgreSQL `timestamptz` viaja como ISO 8601 con zona ("2026-10-29T19:35:00Z"). */
export type FechaISO = string;
