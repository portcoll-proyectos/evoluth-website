import { useState } from "react";
import { Button } from "./Button";
import { Icon, type NombreIcono } from "./Icon";
import type { ErrorRespuesta } from "./tipos";

export const MENSAJE_POR_DEFECTO = "No pudimos completar la acción. Intenta de nuevo en unos minutos.";

export interface ErrorMessageProps {
  error: ErrorRespuesta;
  variant?: "banner" | "campo" | "pagina";
  id?: string;
  actionLabel?: string;
  actionIcon?: NombreIcono;
  onAction?: () => void;
}

/** Muestra solo el texto escrito para personas (mensaje_usuario). El detalle técnico nunca llega aquí. */
export function ErrorMessage({ error, variant = "banner", id, actionLabel = "Reintentar", actionIcon = "refrescar", onAction }: ErrorMessageProps) {
  const msg = error.mensaje_usuario || MENSAJE_POR_DEFECTO;
  if (variant === "campo") return <span className="ev-field-error" id={id}><Icon name="error" />{msg}</span>;
  const ref = error.referencia ? <Referencia valor={error.referencia} /> : null;
  if (variant === "pagina") return (
    <div className="ev-error-page" role="alert">
      <Icon name="error" />
      <h3>{error.titulo_usuario || "No se pudo cargar la información"}</h3>
      <p>{msg}</p>
      {ref}
      {onAction && <div style={{ marginTop: 8 }}><Button variant="secondary" icon={actionIcon} label={actionLabel} onClick={onAction} /></div>}
    </div>
  );
  return (
    <div className="ev-error" role="alert">
      <Icon name="error" />
      <div>{error.titulo_usuario && <strong>{error.titulo_usuario} </strong>}<p>{msg}</p></div>
      {ref}
    </div>
  );
}

function Referencia({ valor }: { valor: string }) {
  const [ok, setOk] = useState(false);
  return (
    <span className="ev-error-ref">
      Referencia para soporte: <span className="ev-code">{valor}</span>
      <Button variant="quiet" size="sm" icon={ok ? "check" : "copiar"} label={ok ? "Copiada" : "Copiar"}
        onClick={() => { navigator.clipboard?.writeText(valor); setOk(true); setTimeout(() => setOk(false), 1600); }} />
    </span>
  );
}
