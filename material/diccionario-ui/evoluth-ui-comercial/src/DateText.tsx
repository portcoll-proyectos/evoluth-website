import { formatDate, type EstiloFecha } from "./formato";
import type { FechaISO } from "./tipos";

export interface DateTextProps { value: Date | FechaISO; style?: EstiloFecha; now?: Date }

/** Fecha en el formato único de Evoluth. Relativa y vencimiento muestran la fecha exacta al pasar el puntero. */
export function DateText({ value, style = "fecha", now }: DateTextProps) {
  const d = value instanceof Date ? value : new Date(value);
  const conTitulo = style === "relativa" || style === "vencimiento";
  return <time className="ev-date" dateTime={d.toISOString()} title={conTitulo ? formatDate(d, "larga") : undefined}>{formatDate(d, style, now)}</time>;
}
