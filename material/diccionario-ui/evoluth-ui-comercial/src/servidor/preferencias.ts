/* Preferencias de pantalla por persona en ui.preferencias (JSONB). */
import type { Pool } from "pg";
import type { PreferenciasUI } from "../tipos";

const CLAVES: (keyof PreferenciasUI)[] = ["tema", "tablas"];

export async function obtenerPreferencias(pool: Pool, usuarioId: string): Promise<PreferenciasUI> {
  const r = await pool.query<{ datos: PreferenciasUI }>("select datos from ui.preferencias where usuario_id = $1", [usuarioId]);
  return r.rows[0]?.datos ?? { version: 1 };
}

/** Recibe solo lo que cambió y lo fusiona en la base; ignora claves desconocidas. */
export async function fusionarPreferencias(pool: Pool, usuarioId: string, parcial: Partial<PreferenciasUI>): Promise<PreferenciasUI> {
  const limpio = Object.fromEntries(Object.entries(parcial).filter(([k]) => CLAVES.includes(k as keyof PreferenciasUI)));
  const r = await pool.query<{ datos: PreferenciasUI }>("select ui.fusionar_preferencias($1, $2::jsonb) as datos", [usuarioId, JSON.stringify(limpio)]);
  return r.rows[0].datos;
}
