import { useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { normalizar } from "./formato";
import type { PreferenciasTabla } from "./tipos";

export interface Column<T> {
  key: string;
  label: string;
  num?: boolean;
  /** No se puede ocultar (normalmente el código). */
  locked?: boolean;
  sortable?: boolean;
  width?: string;
  className?: string;
  render?: (row: T) => ReactNode;
  /** Texto usado por el buscador. */
  text?: (row: T) => string;
  sortValue?: (row: T) => string | number;
}

export interface DataTableProps<T> {
  caption: string;
  noun: [string, string];
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  quickFilters?: { id: string; label: string; test: (row: T) => boolean }[];
  /** Orden, columnas ocultas y filtros guardados en JSONB (ver usePreferenciasUI). */
  prefs?: PreferenciasTabla;
  onPrefsChange?: (p: PreferenciasTabla) => void;
  height?: number;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ caption, noun, columns, rows, rowKey, quickFilters = [], prefs, onPrefsChange, height = 520, onRowClick }: DataTableProps<T>) {
  const [local, setLocal] = useState<PreferenciasTabla>(prefs ?? {});
  const p = prefs ?? local;
  const set = (n: PreferenciasTabla) => { setLocal(n); onPrefsChange?.(n); };
  const [q, setQ] = useState("");
  const [colsOpen, setColsOpen] = useState(false);
  const colsBtn = useRef<HTMLDivElement>(null);
  const hidden = new Set(p.ocultas ?? []);
  const active = new Set(p.filtros ?? []);
  const visible = columns.filter((c) => !hidden.has(c.key));
  const val = (c: Column<T>, r: T) => (c.text ? c.text(r) : String((r as Record<string, unknown>)[c.key] ?? ""));

  const shown = useMemo(() => {
    const nq = normalizar(q);
    let out = rows.filter((r) => (!nq || columns.some((c) => normalizar(val(c, r)).includes(nq))) && quickFilters.every((f) => !active.has(f.id) || f.test(r)));
    if (p.orden) {
      const c = columns.find((x) => x.key === p.orden!.columna);
      if (c) {
        const k = p.orden.dir === "asc" ? 1 : -1;
        const sv = (r: T) => (c.sortValue ? c.sortValue(r) : val(c, r));
        out = [...out].sort((a, b) => (sv(a) > sv(b) ? 1 : sv(a) < sv(b) ? -1 : 0) * k);
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, q, p.orden, p.filtros, columns]);

  function sortBy(key: string) {
    const dir = p.orden?.columna === key && p.orden.dir === "asc" ? "desc" : "asc";
    set({ ...p, orden: { columna: key, dir } });
  }
  const nHidden = columns.length - visible.length;

  return (
    <div className="ev-table-wrap" style={{ position: "relative", height }}>
      <div className="ev-table-tools">
        <label className="ev-input"><Icon name="filtrar" /><input type="search" placeholder={"Filtrar " + noun[1]} aria-label={"Filtrar " + noun[1]} value={q} onChange={(e) => setQ(e.target.value)} /></label>
        {quickFilters.map((f) => (
          <button key={f.id} type="button" className="ev-chip" aria-pressed={active.has(f.id)}
            onClick={() => { const s = new Set(active); s.has(f.id) ? s.delete(f.id) : s.add(f.id); set({ ...p, filtros: [...s] }); }}>
            {active.has(f.id) && <Icon name="check" size={16} />}{f.label}
          </button>
        ))}
        <span className="ev-spacer" />
        <div ref={colsBtn}>
          <Button size="sm" icon="columnas" label="Columnas" aria-haspopup="true" aria-expanded={colsOpen} onClick={() => setColsOpen((o) => !o)} />
        </div>
      </div>
      {colsOpen && (
        <div className="ev-popover" role="group" aria-label="Columnas visibles" style={{ right: 12, top: 56 }} onKeyDown={(e) => { if (e.key === "Escape") setColsOpen(false); }}>
          <h4>Columnas visibles</h4>
          {columns.map((c) => (
            <label key={c.key} className={"ev-check" + (c.locked ? " is-locked" : "")}>
              <input type="checkbox" checked={!hidden.has(c.key)} disabled={c.locked}
                onChange={(e) => { const s = new Set(hidden); e.target.checked ? s.delete(c.key) : s.add(c.key); set({ ...p, ocultas: [...s] }); }} />
              {c.label}{c.locked && " (siempre visible)"}
            </label>
          ))}
        </div>
      )}
      <div className="ev-table-scroll" tabIndex={0} aria-label={caption}>
        <table className="ev-table">
          <caption className="ev-sr">{caption}</caption>
          <thead><tr>
            {visible.map((c) => {
              const s = p.orden?.columna === c.key ? (p.orden.dir === "asc" ? "ascending" : "descending") : "none";
              return (
                <th key={c.key} scope="col" aria-sort={s} className={c.num ? "is-num" : undefined} style={c.width ? { width: c.width } : undefined}>
                  {c.sortable === false ? <span>{c.label}</span> : (
                    <button type="button" onClick={() => sortBy(c.key)}>{c.label}<Icon name={s === "ascending" ? "ordenar-asc" : s === "descending" ? "ordenar-desc" : "ordenar"} size={16} /></button>
                  )}
                </th>
              );
            })}
          </tr></thead>
          <tbody>
            {shown.length ? shown.map((r) => (
              <tr key={rowKey(r)} onClick={onRowClick ? () => onRowClick(r) : undefined} style={onRowClick ? { cursor: "pointer" } : undefined}>
                {visible.map((c) => <td key={c.key} className={[c.num && "is-num", c.className].filter(Boolean).join(" ") || undefined}>{c.render ? c.render(r) : val(c, r)}</td>)}
              </tr>
            )) : (
              <tr><td colSpan={visible.length} style={{ height: "auto", padding: "24px 12px", whiteSpace: "normal" }}>
                <strong>Ningún {noun[0]} cumple los filtros.</strong> <span className="ev-muted">Quita un filtro o cambia la búsqueda.</span>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="ev-table-foot">
        <span aria-live="polite">Mostrando {shown.length} de {rows.length} {noun[1]}{nHidden ? ` · ${nHidden} ${nHidden === 1 ? "columna oculta" : "columnas ocultas"}` : ""}</span>
        <span>La cabecera queda fija al desplazarte.</span>
      </div>
    </div>
  );
}
