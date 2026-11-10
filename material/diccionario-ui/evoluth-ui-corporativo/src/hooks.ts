import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { PreferenciasTabla, PreferenciasUI } from "./tipos";

const FOCUSABLE = 'button:not([disabled]),input:not([disabled]),select,textarea,a[href],[tabindex="0"]';

/** Atrapa el foco dentro de una ventana o panel, cierra con Esc y devuelve el foco al cerrar. */
export function useFocusTrap(ref: RefObject<HTMLElement>, onEscape?: () => void, initial?: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const prev = document.activeElement as HTMLElement | null;
    const first = (initial && root.querySelector<HTMLElement>(initial)) || root.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && onEscape) { e.stopPropagation(); onEscape(); }
      if (e.key !== "Tab" || !root) return;
      const n = root.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!n.length) return;
      const a = n[0], z = n[n.length - 1];
      if (e.shiftKey && document.activeElement === a) { z.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === z) { a.focus(); e.preventDefault(); }
    }
    root.addEventListener("keydown", onKey);
    return () => { root.removeEventListener("keydown", onKey); prev?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Preferencias de pantalla de la persona, guardadas en PostgreSQL (`ui.preferencias.datos`, JSONB).
 * GET /api/ui/preferencias devuelve el documento; PATCH envía solo la parte que cambió y la base la fusiona.
 */
export function usePreferenciasUI(endpoint = "/api/ui/preferencias") {
  const [prefs, setPrefs] = useState<PreferenciasUI>({ version: 1 });
  const timer = useRef<number>();
  useEffect(() => {
    let vivo = true;
    fetch(endpoint, { credentials: "include" }).then((r) => (r.ok ? r.json() : { version: 1 })).then((p) => { if (vivo) setPrefs(p); }).catch(() => {});
    return () => { vivo = false; };
  }, [endpoint]);
  const guardar = useCallback((parcial: Partial<PreferenciasUI>) => {
    setPrefs((p) => ({ ...p, ...parcial, tablas: { ...p.tablas, ...parcial.tablas } }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      fetch(endpoint, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parcial) }).catch(() => {});
    }, 600);
  }, [endpoint]);
  const tabla = useCallback((id: string) => ({
    valor: prefs.tablas?.[id] ?? {},
    cambiar: (t: PreferenciasTabla) => guardar({ tablas: { [id]: t } }),
  }), [prefs, guardar]);
  return { prefs, guardar, tabla };
}

/**
 * Hace destellar un elemento que acaba de cambiar (fila guardada, campo completado).
 * const resaltar = useHighlight(); … resaltar(filaRef.current) o resaltar(el, true) para el anillo que late.
 */
export function useHighlight() {
  return useCallback((el: HTMLElement | null | undefined, anillo = false) => {
    if (!el) return;
    const cls = anillo ? "ev-highlight-ring" : "ev-highlight";
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    const fin = (e: AnimationEvent) => { if (e.target === el) { el.classList.remove(cls); el.removeEventListener("animationend", fin); } };
    el.addEventListener("animationend", fin);
  }, []);
}
