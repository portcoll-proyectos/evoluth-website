import { useState } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Window } from "./Window";

export interface DangerConfirmProps {
  kind: "activo" | "empresa";
  name: string;
  /** Código que la persona debe escribir: ACT-00428, EMP-0031. */
  code: string;
  subtitle?: string;
  /** Lo que también se borra, con cifras reales que entrega la API. */
  impact?: string[];
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DangerConfirm({ kind, name, code, subtitle, impact, busy, onConfirm, onClose }: DangerConfirmProps) {
  const [v, setV] = useState("");
  const ok = v.trim().toUpperCase() === code.toUpperCase();
  const accion = "Eliminar " + kind;
  return (
    <Window title={accion} subtitle={subtitle} size="sm" danger icon="alerta" initialFocus="#ev-dc" onClose={onClose}
      footer={<>
        <Button variant="secondary" label="Cancelar" onClick={onClose} />
        <Button variant="danger" icon="eliminar" label={busy ? "Eliminando…" : accion} disabled={!ok || busy} onClick={onConfirm} />
      </>}>
      <p>Vas a eliminar <strong>{name}</strong> (<span className="ev-code">{code}</span>). Esta acción no se puede deshacer.</p>
      {impact && impact.length > 0 && (
        <div className="ev-impact"><strong>También se eliminará:</strong><ul>{impact.map((x) => <li key={x}>{x}</li>)}</ul></div>
      )}
      <div className="ev-field">
        <label htmlFor="ev-dc">Para confirmar, escribe el código <span className="ev-typed-code ev-code">{code}</span></label>
        <span className="ev-input"><input id="ev-dc" className="ev-code" autoComplete="off" spellCheck={false} value={v} aria-describedby="ev-dc-m"
          onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && ok && !busy) onConfirm(); }} /></span>
        <span className={"ev-match" + (ok ? " is-ok" : "")} id="ev-dc-m" aria-live="polite">
          {ok ? <><Icon name="check" size={16} />El código coincide.</> : v ? `Aún no coincide con ${code}.` : "Escribe el código tal como aparece."}
        </span>
      </div>
    </Window>
  );
}
