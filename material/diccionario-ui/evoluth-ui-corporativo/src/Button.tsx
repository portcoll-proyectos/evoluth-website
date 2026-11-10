import type { ButtonHTMLAttributes } from "react";
import { Icon, type NombreIcono } from "./Icon";
import { Loader } from "./Loader";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  /** Verbo + objeto: "Guardar cambios", "Eliminar activo". */
  label: string;
  icon?: NombreIcono;
  iconOnly?: boolean;
  size?: "sm";
  /** Muestra la rueda y deshabilita el botón mientras la acción se completa. */
  loading?: boolean;
  /** Texto durante la carga: "Guardando…". */
  loadingLabel?: string;
}

export function Button({ variant = "secondary", label, icon, iconOnly, size, className, type = "button", loading, loadingLabel, disabled, ...rest }: ButtonProps) {
  const cls = ["ev-btn", "ev-btn-" + variant, size === "sm" && "ev-btn-sm", iconOnly && "ev-btn-icon", className].filter(Boolean).join(" ");
  return (
    <button type={type} className={cls} aria-label={iconOnly ? label : undefined} title={iconOnly ? label : undefined} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span aria-hidden style={{ display: "contents" }}><Loader kind="nodos" size={16} hideLabel label={loadingLabel ?? label} /></span> : icon && <Icon name={icon} />}
      {!iconOnly && (loading ? loadingLabel ?? label : label)}
    </button>
  );
}
