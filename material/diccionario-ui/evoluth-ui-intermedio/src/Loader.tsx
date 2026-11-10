/* Evoluth UI · animaciones de carga inspiradas en el icono 3D de Evoluth:
   nodos hexagonales y esféricos con volumen, enlaces que se dibujan y una red que gira en 3D.
   Colores: tokens --loader-light, --loader-mid, --loader-deep, --loader-halo, --loader y --loader-track. */
import { useEffect, useId, useRef } from "react";

export type TipoCarga = "nodos" | "red-lista" | "red-inicio" | "progreso" | "barra-superior" | "esqueleto";

export interface LoaderProps {
  kind: TipoCarga;
  /** Texto que se lee: "Guardando…", "Cargando activos…". La rueda de nodos es solo pequeña: 16 a 24 px. */
  label: string;
  /** 0 a 100. Vuelve determinadas las barras. */
  value?: number;
  /** Línea bajo la barra de progreso: "822 de 1 284 activos". */
  detail?: string;
  size?: number;
  hideLabel?: boolean;
  /** Filas del esqueleto. */
  rows?: number;
}

const HEX = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 180) * (60 * i - 30); return `${Math.cos(a).toFixed(3)},${Math.sin(a).toFixed(3)}`; }).join(" ");

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id + "g"} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: "var(--loader-light)" }} /><stop offset=".55" style={{ stopColor: "var(--loader-mid)" }} /><stop offset="1" style={{ stopColor: "var(--loader-deep)" }} />
      </linearGradient>
      <radialGradient id={id + "s"} cx=".35" cy=".3" r=".8">
        <stop offset="0" style={{ stopColor: "var(--loader-light)" }} /><stop offset=".55" style={{ stopColor: "var(--loader-mid)" }} /><stop offset="1" style={{ stopColor: "var(--loader-deep)" }} />
      </radialGradient>
      <radialGradient id={id + "h"}>
        <stop offset="0" style={{ stopColor: "var(--loader-halo)", stopOpacity: 0.6 }} /><stop offset="1" style={{ stopColor: "var(--loader-halo)", stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}

/* Red Evoluth: 12 nodos [x, y, z, tamaño, forma] (forma 0 = hexágono, 1 = esfera), los enlaces en el orden
   en que se dibujan y el recorrido del impulso, que vuelve al punto de partida. */
type Punto = [number, number, number, number, number];
const RED = {
  pts: [[0, -1, 0.2, 3.6, 0], [-0.55, -0.75, -0.3, 2.8, 1], [0.6, -0.72, 0.1, 4.4, 0], [-0.05, -0.42, 0.5, 3, 1], [0.25, -0.05, -0.4, 5, 0], [-0.35, 0.05, 0.3, 3.4, 0], [0.55, 0.15, 0.35, 3.2, 1], [0.05, 0.35, 0, 4.6, 0], [-0.45, 0.62, -0.2, 3, 1], [0.35, 0.7, 0.45, 3.8, 0], [-0.7, 0.92, 0.1, 2.8, 1], [0.6, 0.95, -0.3, 3.4, 0]] as Punto[],
  links: [[10, 8], [8, 7], [7, 4], [4, 2], [2, 0], [0, 1], [1, 3], [3, 5], [5, 7], [7, 9], [9, 11], [11, 6], [6, 4], [6, 9], [3, 0], [5, 8], [2, 6], [1, 5]] as [number, number][],
  walk: [10, 8, 7, 4, 2, 0, 1, 3, 5, 7, 9, 11, 6, 4, 2, 6, 9, 7, 5, 8],
  box: 120, R: 46,
};
/** Velocidad: la red de lista o panel es la misma del inicio, un 30 % más lenta. */
const VEL = { inicio: 1, lista: 0.7 };

const reducir = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Red Evoluth en 3D: primero se dibujan los enlaces; después un impulso enciende los nodos uno a uno. */
function RedEvoluth({ tipo, size, id }: { tipo: "lista" | "inicio"; size: number; id: string }) {
  const lks = useRef<SVGGElement>(null);
  const trs = useRef<SVGGElement>(null);
  const nds = useRef<SVGGElement>(null);
  useEffect(() => {
    const gl = lks.current, gt = trs.current, gn = nds.current;
    if (!gl || !gt || !gn) return;
    const v = VEL[tipo], c = RED.box / 2, L = RED.walk.length;
    const lines = Array.from(gl.children) as SVGLineElement[];
    const trails = Array.from(gt.querySelectorAll<SVGLineElement>(".trail"));
    const head = gt.querySelector<SVGCircleElement>(".head")!;
    const nodes = Array.from(gn.children) as SVGGElement[];
    const halos = nodes.map((g) => g.querySelector(".halo") as SVGCircleElement);
    const STEP = 95 / v, DRAW = 380 / v, POP = 260 / v, HOP = 340 / v, GLOW = 750 / v, TRAIL = 480 / v;
    const reveal = RED.pts.map(() => Infinity);
    reveal[RED.links[0][0]] = 0;
    RED.links.forEach((l, k) => { reveal[l[1]] = Math.min(reveal[l[1]], k * STEP + DRAW); reveal[l[0]] = Math.min(reveal[l[0]], k * STEP); });
    const BUILD = (RED.links.length - 1) * STEP + DRAW + POP;
    const proj = (p: Punto, a: number, tilt: number) => {
      const x = p[0] * Math.cos(a) + p[2] * Math.sin(a), z = -p[0] * Math.sin(a) + p[2] * Math.cos(a), y = p[1];
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt), s = 3 / (3 + z2);
      return { x: c + x * RED.R * s, y: c + y2 * RED.R * s, s, d: (1 - z2) / 2 };
    };
    type Q = { x: number; y: number };
    const pos = (A: Q, B: Q, f: number): Q => ({ x: A.x + (B.x - A.x) * f, y: A.y + (B.y - A.y) * f });
    const seg = (e: SVGLineElement, A: Q, B: Q) => { e.setAttribute("x1", A.x.toFixed(2)); e.setAttribute("y1", A.y.toFixed(2)); e.setAttribute("x2", B.x.toFixed(2)); e.setAttribute("y2", B.y.toFixed(2)); };
    let t0: number | null = null;
    const draw = (t: number) => {
      if (t0 === null) t0 = t;
      const T = t - t0, a = t * 0.00045 * v, tilt = 0.18 + 0.12 * Math.sin(t * 0.0004 * v);
      const q = RED.pts.map((p) => proj(p, a, tilt));
      const built = T >= BUILD, tt = T - BUILD, n = built ? Math.floor(tt / HOP) : -1;
      let f = built ? (tt % HOP) / HOP : 0;
      f = f * f * (3 - 2 * f);
      RED.links.forEach((l, k) => {
        const A = q[l[0]], B = q[l[1]], pr = Math.max(0, Math.min(1, (T - k * STEP) / DRAW));
        seg(lines[k], A, pos(A, B, pr));
        lines[k].style.opacity = pr > 0 ? (0.25 + (0.55 * (A.d + B.d)) / 2).toFixed(3) : "0";
      });
      const lit: Record<number, number> = {};
      trails.forEach((e, j) => {
        const m = n - j;
        if (!built || m < 0) { e.style.opacity = "0"; return; }
        const A = q[RED.walk[m % L]], B = q[RED.walk[(m + 1) % L]];
        if (j === 0) { seg(e, A, pos(A, B, f)); e.style.opacity = "1"; }
        else { seg(e, A, B); e.style.opacity = Math.exp(-(tt - (m + 1) * HOP) / TRAIL).toFixed(3); }
      });
      if (built) {
        const H = pos(q[RED.walk[n % L]], q[RED.walk[(n + 1) % L]], f);
        head.setAttribute("cx", H.x.toFixed(2)); head.setAttribute("cy", H.y.toFixed(2)); head.style.opacity = "1";
        for (let j = 0; j < L && n - j >= 0; j++) { const nd = RED.walk[(n - j) % L]; if (!(nd in lit)) lit[nd] = BUILD + (n - j) * HOP; }
      } else head.style.opacity = "0";
      RED.pts.forEach((p, i) => {
        const Qp = q[i], pop = Math.max(0, Math.min(1, (T - reveal[i]) / POP));
        let size = p[3] * Qp.s;
        if (pop < 1) size *= 0.4 + 0.6 * pop + 0.25 * Math.sin(pop * Math.PI);
        const e = i in lit ? Math.exp(-(T - lit[i]) / GLOW) : 0;
        size *= 1 + 0.4 * e;
        halos[i].style.opacity = built ? e.toFixed(3) : pop > 0 && pop < 1 ? "0.6" : "0";
        nodes[i].setAttribute("class", "nd" + (e > 0.55 ? " on" : ""));
        nodes[i].setAttribute("transform", `translate(${Qp.x.toFixed(2)} ${Qp.y.toFixed(2)}) scale(${size.toFixed(2)})`);
        nodes[i].style.opacity = ((0.45 + 0.55 * Qp.d) * pop * (0.75 + 0.25 * e)).toFixed(3);
      });
    };
    if (reducir()) { t0 = 0; draw(BUILD + HOP * 6.5); return; }
    let raf = 0;
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tipo]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${RED.box} ${RED.box}`} aria-hidden>
      <Defs id={id} />
      <g className="lks" ref={lks}>{RED.links.map((_, k) => <line key={k} className="lk" />)}</g>
      <g className="trs" ref={trs}>{[0, 1, 2, 3].map((k) => <line key={k} className="trail" />)}<circle className="head" r="2.2" /></g>
      <g className="nds" ref={nds}>
        {RED.pts.map((p, i) => (
          <g key={i} className="nd">
            <circle className="halo" r="3.4" fill={`url(#${id}h)`} />
            {p[4] ? <circle className="body" r="1" fill={`url(#${id}s)`} /> : <polygon className="body" points={HEX} fill={`url(#${id}g)`} />}
            <ellipse className="spec" cx="-.32" cy="-.38" rx=".34" ry=".2" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Loader({ kind, label, value, detail, size, hideLabel, rows = 4 }: LoaderProps) {
  const id = "evl" + useId().replace(/:/g, "");
  const det = typeof value === "number";
  const v = det ? Math.max(0, Math.min(100, value!)) : 0;
  const a11y = det
    ? { role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(v), "aria-label": label }
    : { role: "status" };
  const txt = hideLabel ? <span className="ev-sr">{label}</span> : <span className="ev-ld-label">{label}</span>;

  if (kind === "nodos") {
    const s = Math.min(size ?? 20, 24);
    const pts = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return [12 + 8.6 * Math.cos(a), 12 + 8.6 * Math.sin(a)]; });
    return (
      <span className="ev-loader ev-ld-nodos" {...a11y}>
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <Defs id={id} />
          <g className="rot">
            <polygon className="ring" points={pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")} />
            {pts.map(([x, y], i) => (
              <g key={i} className="nd" style={{ animationDelay: `${(-(7 - i) / 8).toFixed(3)}s` }} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
                <polygon points={HEX} transform={`scale(${i % 2 ? 2 : 2.5})`} fill={`url(#${id}g)`} />
              </g>
            ))}
          </g>
        </svg>{txt}
      </span>
    );
  }
  if (kind === "red-lista" || kind === "red-inicio") {
    const tipo = kind === "red-lista" ? "lista" : "inicio";
    return (
      <span className={`ev-loader ev-ld-red ev-ld-red-${tipo}`} {...a11y}>
        <RedEvoluth tipo={tipo} size={size ?? (tipo === "lista" ? 96 : 160)} id={id} />{txt}
      </span>
    );
  }
  if (kind === "progreso") return (
    <div className={"ev-loader ev-ld-prog" + (det ? "" : " is-indet")} {...a11y}>
      <div className="txt"><span className="ev-ld-label">{label}</span>{det && <span className="ev-num pct">{Math.round(v)} %</span>}</div>
      <div className="trk">
        <div className="fill" style={{ width: `${det ? v : 40}%` }}>
          <span className="sheen" />
          <svg className="tip" viewBox="-1.2 -1.2 2.4 2.4" aria-hidden><Defs id={id} /><polygon points={HEX} fill={`url(#${id}g)`} /><ellipse className="spec" cx="-.32" cy="-.38" rx=".34" ry=".2" /></svg>
        </div>
      </div>
      {detail && <div className="sub">{detail}</div>}
    </div>
  );
  if (kind === "barra-superior") return (
    <div className={"ev-ld-top" + (det ? "" : " is-indet")} {...a11y} aria-label={label}><i style={{ width: `${det ? v : 30}%` }} /></div>
  );
  return (
    <div className="ev-ld-skel" role="status" aria-busy>
      <span className="ev-sr">{label}</span>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="ev-skel-row">
          <span className="ev-skel hex" />
          <span className="ev-skel-col"><span className="ev-skel" style={{ height: 12, width: `${55 + ((r * 13) % 35)}%` }} /><span className="ev-skel" style={{ height: 10, width: `${30 + ((r * 7) % 20)}%` }} /></span>
          <span className="ev-skel" style={{ height: 12 }} />
        </div>
      ))}
    </div>
  );
}
