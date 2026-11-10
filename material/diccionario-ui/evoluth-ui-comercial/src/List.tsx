import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon, type NombreIcono } from "./Icon";
import { normalizar } from "./formato";
import type { Estado } from "./tipos";

export interface ListItem { id: string; title: string; code: string; meta: string; icon?: NombreIcono; status?: Estado }

function Resaltado({ texto, q }: { texto: string; q: string }): ReactNode {
  if (!q) return texto;
  const i = normalizar(texto).indexOf(normalizar(q));
  if (i < 0) return texto;
  return <>{texto.slice(0, i)}<mark>{texto.slice(i, i + q.length)}</mark>{texto.slice(i + q.length)}</>;
}

function Fila({ it, selected, active, q, onPick }: { it: ListItem; selected: boolean; active?: boolean; q?: string; onPick: (id: string) => void }) {
  return (
    <li id={"ev-li-" + it.id} role="option" aria-selected={selected} className={"ev-list-item" + (active ? " is-active" : "")} onClick={() => onPick(it.id)}>
      <span className="ev-list-lead"><Icon name={it.icon ?? "activos"} /></span>
      <span>
        <span className="ev-list-title"><Resaltado texto={it.title} q={q ?? ""} /></span>
        <span className="ev-list-meta"><span className="ev-code" style={{ fontSize: 12 }}>{it.code}</span> · {it.meta}</span>
      </span>
      {it.status ? <span className={"ev-status ev-status-" + it.status[0]}>{it.status[1]}</span> : <span />}
      <Icon name="chevron-derecha" />
    </li>
  );
}

export interface ListProps { items: ListItem[]; label: string; selectedId?: string | null; onSelect: (id: string) => void }

export function List({ items, label, selectedId, onSelect }: ListProps) {
  return (
    <ul className="ev-list" role="listbox" aria-label={label}>
      {items.map((it) => <Fila key={it.id} it={it} selected={it.id === selectedId} onPick={onSelect} />)}
    </ul>
  );
}

export interface SearchListProps extends ListProps { placeholder: string; noun: [string, string] }

export function SearchList({ items, label, selectedId, onSelect, placeholder, noun }: SearchListProps) {
  const [q, setQ] = useState("");
  const [cur, setCur] = useState(0);
  const shown = useMemo(() => items.filter((x) => !q || normalizar(`${x.title} ${x.code} ${x.meta}`).includes(normalizar(q))), [items, q]);
  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") { setCur((c) => Math.min(c + 1, shown.length - 1)); e.preventDefault(); }
    if (e.key === "ArrowUp") { setCur((c) => Math.max(c - 1, 0)); e.preventDefault(); }
    if (e.key === "Enter" && shown[cur]) onSelect(shown[cur].id);
    if (e.key === "Escape") { setQ(""); setCur(0); }
  }
  return (
    <div className="ev-search-list">
      <label className="ev-input">
        <Icon name="buscar" />
        <input type="search" role="combobox" aria-expanded aria-autocomplete="list" aria-label={placeholder} placeholder={placeholder}
          value={q} onChange={(e) => { setQ(e.target.value); setCur(0); }} onKeyDown={onKey}
          aria-activedescendant={shown[cur] ? "ev-li-" + shown[cur].id : undefined} />
      </label>
      <div className="ev-search-count" aria-live="polite">{q ? `${shown.length} de ${items.length} ${noun[1]}` : `${items.length} ${noun[1]}`}</div>
      <ul className="ev-list" role="listbox" aria-label={label}>
        {shown.length ? shown.map((it, i) => <Fila key={it.id} it={it} q={q} active={i === cur} selected={it.id === selectedId} onPick={onSelect} />) : (
          <li className="ev-empty"><strong>Ningún {noun[0]} coincide con «{q}».</strong><span className="ev-muted">Busca por nombre, código o empresa. Para ver todo, borra la búsqueda.</span></li>
        )}
      </ul>
    </div>
  );
}
