import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon, type NombreIcono } from "./Icon";
import { useFocusTrap } from "./hooks";

export interface WindowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  note?: ReactNode;
  size?: "sm" | "lg";
  danger?: boolean;
  icon?: NombreIcono;
  /** En confirmaciones destructivas el clic en el velo no cierra. */
  closeOnScrim?: boolean;
  initialFocus?: string;
  onClose: () => void;
  container?: Element;
}

export function Window({ title, subtitle, children, footer, note, size, danger, icon, closeOnScrim = !danger, initialFocus, onClose, container }: WindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, onClose, initialFocus ?? ".ev-window-body input, .ev-window-foot .ev-btn-secondary, .ev-window-foot .ev-btn");
  return createPortal(
    <div className="ev ev-overlay" ref={ref} onMouseDown={(e) => { if (closeOnScrim && e.target === e.currentTarget) onClose(); }}>
      <div className={["ev-window", size && "ev-" + size, danger && "is-danger"].filter(Boolean).join(" ")} role={danger ? "alertdialog" : "dialog"} aria-modal aria-labelledby="evw-t">
        <header className="ev-window-head">
          {icon && <Icon name={icon} size={24} />}
          <div><h2 id="evw-t">{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <Button variant="quiet" iconOnly icon="cerrar" label="Cerrar" onClick={onClose} />
        </header>
        <div className="ev-window-body">{children}</div>
        {(footer || note) && <footer className="ev-window-foot">{note && <span className="ev-foot-note">{note}</span>}{footer}</footer>}
      </div>
    </div>,
    container ?? document.body,
  );
}
