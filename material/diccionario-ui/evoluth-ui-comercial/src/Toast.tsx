import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon, type NombreIcono } from "./Icon";

export type TonoAviso = "ok" | "info" | "warn" | "error";
export interface ToastProps { tone?: TonoAviso; title: string; message?: string; action?: string; onAction?: () => void; duration?: number }
interface Aviso extends ToastProps { id: number }

const TONO: Record<TonoAviso, [string, NombreIcono, number]> = { ok: ["t-ok", "check", 6000], info: ["t-info", "info", 6000], warn: ["t-warn", "alerta", 9000], error: ["t-error", "error", 0] };
const Ctx = createContext<(t: ToastProps) => void>(() => {});

/** const toast = useToast(); toast({ tone: "ok", title: "Activo guardado" }) */
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Aviso[]>([]);
  const seq = useRef(0);
  const push = useCallback((t: ToastProps) => setList((l) => [...l.slice(-2), { ...t, id: ++seq.current }]), []);
  const quitar = (id: number) => setList((l) => l.filter((x) => x.id !== id));
  return (
    <Ctx.Provider value={push}>
      {children}
      {createPortal(
        <div className="ev ev-toasts" role="region" aria-label="Avisos">
          {list.map((t) => <ToastItem key={t.id} t={t} onClose={() => quitar(t.id)} />)}
        </div>,
        document.body,
      )}
    </Ctx.Provider>
  );
}

function ToastItem({ t, onClose }: { t: Aviso; onClose: () => void }) {
  const [cls, ic, def] = TONO[t.tone ?? "ok"];
  const ms = t.duration ?? def;
  const [pausa, setPausa] = useState(false);
  useEffect(() => {
    if (!ms || pausa) return;
    const h = window.setTimeout(onClose, ms);
    return () => window.clearTimeout(h);
  }, [ms, pausa, onClose]);
  return (
    <div className={"ev-toast " + cls} role={t.tone === "error" ? "alert" : "status"}
      onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)} onFocus={() => setPausa(true)} onBlur={() => setPausa(false)}>
      <Icon name={ic} />
      <div><strong>{t.title}</strong>{t.message && <p>{t.message}</p>}</div>
      <div className="ev-toast-actions">
        {t.action && <Button variant="quiet" size="sm" label={t.action} onClick={() => { t.onAction?.(); onClose(); }} />}
        <Button variant="quiet" size="sm" iconOnly icon="cerrar" label="Cerrar aviso" onClick={onClose} />
      </div>
      {ms > 0 && <div className="ev-toast-time"><i style={{ animationDuration: ms + "ms", animationPlayState: pausa ? "paused" : "running" }} /></div>}
    </div>
  );
}
