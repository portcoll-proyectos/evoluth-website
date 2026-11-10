/* Evoluth UI · formato de fechas y montos (es-EC, America/Guayaquil). */
import type { FechaISO, Monto } from "./tipos";

const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MES_L = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const ZONA = "America/Guayaquil";

export type EstiloFecha = "fecha" | "fecha-hora" | "relativa" | "vencimiento" | "iso" | "larga";

/** Partes de la fecha en la zona de Ecuador, sin depender de la zona del navegador. */
function partes(d: Date) {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month - 1, d: +p.day, h: p.hour, min: p.minute };
}
const pad = (n: number) => String(n).padStart(2, "0");

export function aFecha(v: Date | FechaISO): Date { return v instanceof Date ? v : new Date(v); }

export function formatDate(valor: Date | FechaISO, estilo: EstiloFecha = "fecha", ahora: Date = new Date()): string {
  const d = aFecha(valor), p = partes(d);
  const fecha = `${p.d} ${MES[p.m]} ${p.y}`;
  switch (estilo) {
    case "fecha-hora": return `${fecha}, ${p.h}:${p.min}`;
    case "iso": return `${p.y}-${pad(p.m + 1)}-${pad(p.d)}`;
    case "larga": return `${p.d} de ${MES_L[p.m]} de ${p.y}, ${p.h}:${p.min}`;
    case "relativa": {
      const min = Math.round((ahora.getTime() - d.getTime()) / 60000);
      if (min < 1) return "hace un momento";
      if (min < 60) return `hace ${min} min`;
      const h = Math.round(min / 60);
      if (h < 24) return `hace ${h} h`;
      const dias = Math.round(h / 24);
      if (dias === 1) return `ayer, ${p.h}:${p.min}`;
      if (dias < 7) return `hace ${dias} días`;
      return fecha;
    }
    case "vencimiento": {
      const dd = Math.ceil((d.getTime() - ahora.getTime()) / 86400000);
      if (dd < 0) return `Venció hace ${-dd} ${dd === -1 ? "día" : "días"}`;
      if (dd === 0) return "Vence hoy";
      return `Vence en ${dd} ${dd === 1 ? "día" : "días"}`;
    }
    default: return fecha;
  }
}

export function formatRange(a: Date | FechaISO, b: Date | FechaISO): string {
  const x = partes(aFecha(a)), y = partes(aFecha(b));
  if (x.y === y.y && x.m === y.m) return `${x.d}–${y.d} ${MES[x.m]} ${x.y}`;
  if (x.y === y.y) return `${x.d} ${MES[x.m]} – ${y.d} ${MES[y.m]} ${y.y}`;
  return `${formatDate(a)} – ${formatDate(b)}`;
}

/** "12450.5" → "$ 12.450,50". Trabaja sobre el texto para no perder precisión de numeric. */
export function formatMoney(monto: Monto | number): string {
  const s = typeof monto === "number" ? monto.toFixed(2) : monto;
  const neg = s.startsWith("-");
  const [ent, dec = ""] = s.replace("-", "").split(".");
  const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${neg ? "-" : ""}$ ${miles},${(dec + "00").slice(0, 2)}`;
}

/** Quita tildes y pasa a minúsculas para buscar. */
export function normalizar(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
