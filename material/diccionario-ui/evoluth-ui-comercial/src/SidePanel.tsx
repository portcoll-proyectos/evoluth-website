import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { useFocusTrap } from "./hooks";

export interface SidePanelProps {
  code?: string;
  title: string;
  meta?: ReactNode;
  tabs?: string[];
  /** Recibe la pestaña activa. */
  children: (tab: number) => ReactNode;
  footer?: ReactNode;
  headActions?: ReactNode;
  onClose: () => void;
  container?: Element;
}

export function SidePanel({ code, title, meta, tabs, children, footer, headActions, onClose, container }: SidePanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  useFocusTrap(ref, onClose, ".ev-panel-head .ev-btn:last-child");
  return createPortal(
    <div className="ev" ref={ref}>
      <div className="ev-panel-overlay" onClick={onClose} />
      <aside className="ev-panel" role="dialog" aria-modal aria-labelledby="evp-t">
        <header className="ev-panel-head">
          <span className="ev-code">{code}</span>
          <h2 id="evp-t">{title}</h2>
          {meta && <span className="ev-help">{meta}</span>}
          <div className="ev-panel-actions">{headActions}<Button variant="quiet" iconOnly icon="cerrar" label="Cerrar panel" onClick={onClose} /></div>
        </header>
        {tabs && (
          <div className="ev-panel-tabs" role="tablist">
            {tabs.map((t, i) => <button key={t} role="tab" aria-selected={i === tab} onClick={() => setTab(i)}>{t}</button>)}
          </div>
        )}
        <div className="ev-panel-body">{children(tab)}</div>
        {footer && <footer className="ev-panel-foot">{footer}</footer>}
      </aside>
    </div>,
    container ?? document.body,
  );
}
