import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Icon, type NombreIcono } from "./Icon";

export interface Modulo { id: string; icon: NombreIcono; label: string; count?: string }
export interface GrupoModulos { label: string; icon: NombreIcono; items: Modulo[] }
export interface Usuario { initials: string; name: string; email: string }
export type AccionUsuario = "perfil" | "configuracion" | "empresa" | "idioma" | "tema" | "ayuda" | "salir" | `info:${number}`;
export interface MenuUsuario {
  /** Pendientes de la configuración de la empresa (círculo rojo). */
  orgBadge?: number;
  idioma?: string;
  tema?: "light" | "dark";
  /** Enlaces del submenú "Más información". */
  info?: { label: string }[];
  onAction?: (accion: AccionUsuario) => void;
}

export interface AppShellProps {
  groups: GrupoModulos[];
  active: string;
  onNavigate: (id: string) => void;
  tenant: { initials: string; name: string; detail: string; onChange?: () => void };
  user: Usuario;
  userMenu?: MenuUsuario;
  onLogout?: () => void;
  logo?: string;
  children: ReactNode;
}

type Abierto = { tipo: "todo" } | { tipo: "grupo"; i: number } | { tipo: "usuario" } | null;
const claveDe = (a: Abierto) => (!a ? "" : a.tipo === "grupo" ? "g" + a.i : a.tipo);
const calma = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Marco de la aplicación. Barra de iconos: botón del menú completo, un icono por grupo y las iniciales de la persona.
 * El icono de un grupo abre un popup azul solo con sus módulos; el primer botón abre todos; las iniciales abren el menú de usuario.
 */
export function AppShell({ groups, active, onNavigate, tenant, user, userMenu, onLogout, logo, children }: AppShellProps) {
  const [abierto, setAbierto] = useState<Abierto>(null);
  const [closing, setClosing] = useState(false);
  const rail = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const current = groups.flatMap((g) => g.items).find((m) => m.id === active);
  const grupoActivo = groups.findIndex((g) => g.items.some((m) => m.id === active));
  const boton = (k: string) => rail.current?.querySelector<HTMLElement>(`[data-k="${k}"]`) ?? null;

  /** Cierra con animación (150 ms) y luego ejecuta `then`. */
  const close = useCallback((restore = false, then?: () => void) => {
    if (!abierto || closing) { if (!abierto) then?.(); return; }
    const k = claveDe(abierto);
    const done = () => { setAbierto(null); setClosing(false); if (restore) boton(k)?.focus(); then?.(); };
    if (calma()) return done();
    setClosing(true);
    window.setTimeout(done, 150);
  }, [abierto, closing]);

  const toggle = (a: NonNullable<Abierto>) => {
    if (abierto && claveDe(abierto) === claveDe(a)) return close(true);
    if (abierto) close(false, () => setAbierto(a)); else setAbierto(a);
  };

  useEffect(() => {
    if (!abierto || closing) return;
    const fuera = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!shell.current?.querySelector(".ev-nav-pop, .ev-user-pop")?.contains(t) && !rail.current?.contains(t)) close();
    };
    const id = window.setTimeout(() => document.addEventListener("mousedown", fuera, true));
    return () => { window.clearTimeout(id); document.removeEventListener("mousedown", fuera, true); };
  }, [abierto, closing, close]);

  const navegar = (id: string) => {
    onNavigate(id);
    const g = groups.findIndex((x) => x.items.some((m) => m.id === id));
    window.setTimeout(() => boton("g" + g)?.focus());
  };
  const k = claveDe(abierto);
  const tip = (t: string) => <span className="ev-tip" role="tooltip">{t}</span>;

  return (
    <div className="ev ev-shell" ref={shell}>
      <nav className="ev-rail" aria-label="Módulos" ref={rail}
        onKeyDown={(e) => {
          const b = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(".ev-rail-btn")), i = b.indexOf(document.activeElement as HTMLElement);
          if (i < 0) return;
          if (e.key === "ArrowDown") { (b[i + 1] ?? b[0]).focus(); e.preventDefault(); }
          if (e.key === "ArrowUp") { (b[i - 1] ?? b[b.length - 1]).focus(); e.preventDefault(); }
        }}>
        <button type="button" data-k="todo" className="ev-rail-btn ev-rail-open" aria-haspopup="true" aria-expanded={k === "todo" && !closing}
          aria-label="Abrir el menú completo" onClick={() => toggle({ tipo: "todo" })}>
          <Icon name="expandir" />{tip("Todos los módulos")}
        </button>
        <span className="ev-rail-sep" aria-hidden />
        {groups.map((g, i) => (
          <button key={g.label} type="button" data-k={"g" + i} className="ev-rail-btn ev-rail-group" aria-haspopup="true" aria-expanded={k === "g" + i && !closing}
            aria-label={g.label} aria-current={i === grupoActivo ? "true" : undefined} onClick={() => toggle({ tipo: "grupo", i })}>
            <Icon name={g.icon} />{tip(`${g.label} · ${g.items.length} módulos`)}
          </button>
        ))}
        <button type="button" data-k="usuario" className="ev-rail-btn ev-rail-user" aria-haspopup="menu" aria-expanded={k === "usuario" && !closing}
          aria-label={"Menú de " + user.name} onClick={() => toggle({ tipo: "usuario" })}>
          <span className="ev-avatar">{user.initials}</span>{tip(user.name)}
        </button>
      </nav>
      <header className="ev-appbar">
        <h1 className="ev-appbar-title">{current?.label ?? "Módulos"}</h1>
        <span className="ev-appbar-end">{logo && <img className="ev-appbar-logo" src={logo} alt="Evoluth" />}<span className="ev-appbar-tenant">{tenant.name}</span></span>
      </header>
      <main className="ev-shell-main">{children}</main>
      {abierto && abierto.tipo !== "usuario" && (
        <MenuModulos groups={groups} grupo={abierto.tipo === "grupo" ? abierto.i : null} active={active} tenant={tenant} closing={closing}
          anchor={abierto.tipo === "grupo" ? boton("g" + abierto.i) : null} shell={shell}
          onClose={(r) => close(r)} onPick={(id) => close(false, () => navegar(id))} />
      )}
      {abierto?.tipo === "usuario" && (
        <MenuUsuarioPopup user={user} menu={userMenu} closing={closing} onClose={(r) => close(r)}
          onAction={(a) => close(false, () => { userMenu?.onAction?.(a); if (a === "salir") onLogout?.(); })} />
      )}
    </div>
  );
}

function teclas(e: React.KeyboardEvent<HTMLElement>, sel: string, onClose: (restore: boolean) => void) {
  const scope = (e.target as HTMLElement).closest(".ev-user-sub") ?? e.currentTarget;
  const items = Array.from(scope.querySelectorAll<HTMLElement>(sel)).filter((x) => (x.closest(".ev-user-sub") ?? e.currentTarget) === scope);
  const i = items.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown") { (items[i + 1] ?? items[0])?.focus(); e.preventDefault(); }
  if (e.key === "ArrowUp") { (items[i - 1] ?? items[items.length - 1])?.focus(); e.preventDefault(); }
  if (e.key === "Escape" && scope === e.currentTarget) onClose(true);
  if (e.key === "Tab") onClose(false);
}

interface MenuModulosProps {
  groups: GrupoModulos[];
  grupo: number | null;
  active: string;
  tenant: AppShellProps["tenant"];
  closing: boolean;
  anchor: HTMLElement | null;
  shell: RefObject<HTMLDivElement>;
  onClose: (restore: boolean) => void;
  onPick: (id: string) => void;
}

/** Popup azul: completo (empresa y todos los grupos) o de un grupo, a la altura de su icono. */
function MenuModulos({ groups, grupo, active, tenant, closing, anchor, shell, onClose, onPick }: MenuModulosProps) {
  const ref = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const current = picked ?? active;
  const lista = grupo == null ? groups : [groups[grupo]];

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && anchor && shell.current) el.style.top = Math.max(8, Math.min(anchor.offsetTop - 8, shell.current.clientHeight - el.offsetHeight - 8)) + "px";
    el?.querySelector<HTMLElement>('[aria-current="page"]')?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elegir = (id: string) => {
    if (calma()) return onPick(id);
    setPicked(id);
    window.setTimeout(() => onPick(id), 200);
  };
  let n = 0;
  const orden = (): CSSProperties => ({ ["--i" as string]: n++ });

  return (
    <nav ref={ref} className={"ev-nav ev-nav-pop" + (grupo == null ? "" : " is-group") + (closing ? " is-closing" : "")}
      aria-label={grupo == null ? "Todos los módulos" : groups[grupo].label} onKeyDown={(e) => teclas(e, ".ev-nav-item, .ev-nav-tenant", onClose)}>
      {grupo == null ? (
        <button className="ev-nav-tenant" type="button" style={orden()} onClick={tenant.onChange}>
          <span className="ev-nav-tenant-mark">{tenant.initials}</span>
          <span className="ev-nav-tenant-text">{tenant.name}<small>{tenant.detail}</small></span><Icon name="chevron-abajo" />
        </button>
      ) : (
        <div className="ev-nav-pop-head" style={orden()}><Icon name={groups[grupo].icon} /><span>{groups[grupo].label}</span><small>{groups[grupo].items.length} módulos</small></div>
      )}
      {lista.map((g) => (
        <div key={g.label} className="ev-nav-group">
          {grupo == null && <div className="ev-nav-group-label" style={orden()}>{g.label}</div>}
          <ul>{g.items.map((m) => (
            <li key={m.id}>
              <button type="button" className={"ev-nav-item" + (picked === m.id ? " is-picked" : "")} style={orden()}
                aria-current={m.id === current ? "page" : undefined} onClick={() => elegir(m.id)}>
                <Icon name={m.icon} /><span className="ev-nav-label">{m.label}</span>{m.count && <span className="ev-nav-count">{m.count}</span>}
              </button>
            </li>
          ))}</ul>
        </div>
      ))}
    </nav>
  );
}

/** Menú de usuario: tarjeta clara que sube desde las iniciales. */
function MenuUsuarioPopup({ user, menu, closing, onClose, onAction }: { user: Usuario; menu?: MenuUsuario; closing: boolean; onClose: (restore: boolean) => void; onAction: (a: AccionUsuario) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLButtonElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const [sub, setSub] = useState(false);
  const [tema, setTema] = useState<"light" | "dark">(menu?.tema ?? (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"));
  const links = menu?.info ?? [{ label: "Novedades" }, { label: "Términos de uso" }, { label: "Privacidad" }];

  useEffect(() => { ref.current?.querySelector<HTMLElement>(".ev-user-item")?.focus({ preventScroll: true }); }, []);
  useLayoutEffect(() => {
    if (!sub || !subRef.current || !ref.current || !infoRef.current) return;
    subRef.current.style.top = Math.max(0, Math.min(infoRef.current.offsetTop - 6, ref.current.offsetHeight - subRef.current.offsetHeight)) + "px";
    subRef.current.querySelector<HTMLElement>(".ev-user-item")?.focus();
  }, [sub]);

  let n = 1;
  const item = (id: AccionUsuario, ic: NombreIcono, label: string, extra?: ReactNode) => (
    <button type="button" role="menuitem" className="ev-user-item" style={{ ["--i" as string]: n++ } as CSSProperties}
      onMouseEnter={() => setSub(false)} onClick={() => {
        if (id === "tema") {
          const t = tema === "dark" ? "light" : "dark";
          setTema(t); document.documentElement.setAttribute("data-theme", t); menu?.onAction?.("tema"); return;
        }
        onAction(id);
      }}>
      <Icon name={ic} /><span className="ev-user-label">{label}</span>{extra}
    </button>
  );
  const meta = (t: string) => <span className="ev-user-meta">{t}</span>;

  return (
    <div ref={ref} className={"ev-user-pop" + (closing ? " is-closing" : "")} role="menu" aria-label={"Menú de " + user.name}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" && document.activeElement === infoRef.current) { setSub(true); e.preventDefault(); return; }
        if ((e.key === "ArrowLeft" || e.key === "Escape") && (e.target as HTMLElement).closest(".ev-user-sub")) { setSub(false); infoRef.current?.focus(); e.preventDefault(); e.stopPropagation(); return; }
        teclas(e, ".ev-user-item", onClose);
      }}>
      <div className="ev-user-head" style={{ ["--i" as string]: 0 } as CSSProperties}>
        <span className="ev-avatar ev-avatar-lg" aria-hidden>{user.initials}</span>
        <span><strong>{user.name}</strong><small>{user.email}</small></span>
      </div>
      {item("perfil", "perfil", "Mi perfil")}
      {item("configuracion", "configuracion", "Configuración", <kbd className="ev-user-meta">Ctrl+Shift+,</kbd>)}
      {item("empresa", "empresas", "Configuración de la empresa", menu?.orgBadge ? <span className="ev-user-badge" aria-label={`${menu.orgBadge} pendiente`}>{menu.orgBadge}</span> : undefined)}
      {item("idioma", "idioma", "Idioma", meta(menu?.idioma ?? "Español"))}
      {item("tema", "tema", "Tema", meta(tema === "dark" ? "Oscuro" : "Claro"))}
      {item("ayuda", "ayuda", "Obtener ayuda")}
      <hr className="ev-user-sep" />
      <button ref={infoRef} type="button" role="menuitem" className="ev-user-item" style={{ ["--i" as string]: n++ } as CSSProperties}
        aria-haspopup="true" aria-expanded={sub} onMouseEnter={() => setSub(true)} onClick={() => setSub((s) => !s)}>
        <Icon name="info" /><span className="ev-user-label">Más información</span><Icon name="chevron-derecha" />
      </button>
      <hr className="ev-user-sep" />
      {item("salir", "salir", "Cerrar sesión")}
      {sub && (
        <div ref={subRef} className="ev-user-sub" role="menu" aria-label="Más información">
          {links.map((l, i) => (
            <button key={l.label} type="button" role="menuitem" className="ev-user-item" onClick={() => onAction(`info:${i}`)}>
              <span className="ev-user-label">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
