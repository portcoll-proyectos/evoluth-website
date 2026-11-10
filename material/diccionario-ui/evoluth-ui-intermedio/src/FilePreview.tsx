import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import { Icon } from "./Icon";
import { Loader } from "./Loader";
import { useFocusTrap } from "./hooks";
import { normalizar } from "./formato";
import type { ErrorRespuesta } from "./tipos";

/* Librerías (se cargan con import() solo cuando se abre ese tipo de archivo):
   pdfjs-dist 4.4.168 (Apache 2.0) · mammoth 1.8.0 (BSD-2) · exceljs 4.4.0 (MIT) */

export const LIMITES = { mb: 25, paginas: 30, filas: 1000, columnas: 60 };
export type TipoArchivo = "pdf" | "docx" | "xlsx";

export type FuenteArchivo =
  | { kind: "file"; file: File }
  /** Adjunto guardado: la API lo entrega con la sesión de la persona (GET /api/adjuntos/:id/contenido). */
  | { kind: "url"; url: string; name: string; size?: number };

export interface FilePreviewProps {
  source: FuenteArchivo;
  meta?: string;
  onDownload?: () => void;
  onClose: () => void;
}

interface Celda { t: string; n: boolean; f: string | null }
interface Hoja { name: string; rows: Celda[][]; totalRows: number; totalCols: number }
type Contenido =
  | { tipo: "pdf"; doc: import("pdfjs-dist").PDFDocumentProxy; total: number }
  | { tipo: "docx"; html: string; avisos: number }
  | { tipo: "xlsx"; hojas: Hoja[] };

export function tipoDe(nombre: string): TipoArchivo | null {
  const ext = nombre.toLowerCase().split(".").pop() ?? "";
  return ({ pdf: "pdf", docx: "docx", xlsx: "xlsx", xlsm: "xlsx" } as Record<string, TipoArchivo>)[ext] ?? null;
}
const BADGE: Record<TipoArchivo, ["PDF" | "DOCX" | "XLSX", "documento" | "hoja-calculo"]> = { pdf: ["PDF", "documento"], docx: ["DOCX", "documento"], xlsx: ["XLSX", "hoja-calculo"] };
const fmtSize = (b: number) => (b < 1048576 ? Math.max(1, Math.round(b / 1024)) + " KB" : (b / 1048576).toFixed(1).replace(".", ",") + " MB");
const colName = (i: number) => { let s = ""; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };

/** Limpia el HTML que produce mammoth: sin scripts, sin atributos on*, sin enlaces javascript:. */
function limpiar(html: string): string {
  const t = document.createElement("template");
  t.innerHTML = html;
  t.content.querySelectorAll("script,iframe,object,embed,style,link").forEach((n) => n.remove());
  t.content.querySelectorAll("*").forEach((n) => {
    for (const a of Array.from(n.attributes)) {
      if (a.name.startsWith("on")) n.removeAttribute(a.name);
      if ((a.name === "href" || a.name === "src") && /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
    }
    if (n.tagName === "A") { n.setAttribute("target", "_blank"); n.setAttribute("rel", "noopener noreferrer"); }
  });
  return t.innerHTML;
}

async function leer(tipo: TipoArchivo, buf: ArrayBuffer): Promise<Contenido> {
  if (tipo === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
    return { tipo, doc, total: doc.numPages };
  }
  if (tipo === "docx") {
    const mammoth = await import("mammoth");
    const r = await mammoth.convertToHtml({ arrayBuffer: buf });
    return { tipo, html: limpiar(r.value), avisos: r.messages.length };
  }
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  return {
    tipo, hojas: wb.worksheets.map((ws) => {
      const nr = Math.min(ws.rowCount, LIMITES.filas), nc = Math.min(ws.columnCount, LIMITES.columnas), rows: Celda[][] = [];
      for (let r = 1; r <= nr; r++) {
        const R = ws.getRow(r), row: Celda[] = [];
        for (let c = 1; c <= nc; c++) {
          const cell = R.getCell(c), v = cell.value as unknown;
          const formula = v && typeof v === "object" && "formula" in v ? "=" + String((v as { formula: string }).formula) : null;
          const num = typeof v === "number" || (!!v && typeof v === "object" && "result" in v && typeof (v as { result: unknown }).result === "number");
          row.push({ t: cell.text ?? "", n: num, f: formula });
        }
        rows.push(row);
      }
      return { name: ws.name, rows, totalRows: ws.rowCount, totalCols: ws.columnCount };
    }),
  };
}

/** Ventana de solo lectura para Excel (.xlsx), PDF y Word (.docx). */
export function FilePreview({ source, meta, onDownload, onClose }: FilePreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, onClose, ".ev-viewer-actions .ev-btn:last-child");
  const name = source.kind === "file" ? source.file.name : source.name;
  const size = source.kind === "file" ? source.file.size : source.size;
  const tipo = tipoDe(name);
  const [full, setFull] = useState(false);
  const [confirmado, setConfirmado] = useState(!size || size <= LIMITES.mb * 1048576);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");
  const [error, setError] = useState<ErrorRespuesta | null>(null);
  const [contenido, setContenido] = useState<Contenido | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!tipo || !confirmado) return;
    let vivo = true;
    setEstado("cargando");
    (async () => {
      const buf = source.kind === "file" ? await source.file.arrayBuffer() : await fetch(source.url, { credentials: "include" }).then((r) => { if (!r.ok) throw new Error("http " + r.status); return r.arrayBuffer(); });
      return leer(tipo, buf);
    })().then((c) => { if (vivo) { setContenido(c); setEstado("listo"); } }).catch(() => {
      if (!vivo) return;
      setError({ codigo: "VISTA_PREVIA", titulo_usuario: "No se pudo abrir " + name, mensaje_usuario: "El archivo está dañado, protegido con contraseña o no se pudo descargar. Descárgalo para abrirlo en tu equipo.", referencia: "VP-" + Date.now().toString(36).toUpperCase().slice(-6) });
      setEstado("error");
    });
    return () => { vivo = false; };
  }, [source, tipo, confirmado, name]);

  const b = tipo ? BADGE[tipo] : (["?", "documento"] as const);
  const descargar = () => {
    if (onDownload) return onDownload();
    if (source.kind === "file") { const a = document.createElement("a"); a.href = URL.createObjectURL(source.file); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
    else window.open(source.url, "_blank", "noopener");
  };

  let cuerpo: React.ReactNode;
  if (!tipo) cuerpo = <Estado><ErrorMessage variant="pagina" error={{ codigo: "TIPO_NO_ADMITIDO", titulo_usuario: "Este tipo de archivo no tiene vista previa", mensaje_usuario: "La vista previa abre archivos .xlsx, .docx y .pdf. Los formatos antiguos .xls y .doc se abren descargando el archivo." }} actionLabel="Descargar el archivo" actionIcon="descargar" onAction={descargar} /></Estado>;
  else if (!confirmado) cuerpo = <Estado><div className="ev-error-page" role="status"><Icon name="alerta" style={{ color: "var(--warning)" }} /><h3>Este archivo pesa {fmtSize(size!)}</h3><p>La vista previa de archivos de más de {LIMITES.mb} MB puede tardar y hacer lento el navegador.</p><div style={{ display: "flex", gap: 8, marginTop: 8 }}><Button label="Abrir de todos modos" onClick={() => setConfirmado(true)} /><Button variant="quiet" icon="descargar" label="Descargar" onClick={descargar} /></div></div></Estado>;
  else if (estado === "cargando") cuerpo = <Estado><Loader kind="red-lista" size={96} label={`Abriendo ${name}…`} /></Estado>;
  else if (estado === "error" && error) cuerpo = <Estado><ErrorMessage variant="pagina" error={error} actionLabel="Descargar el archivo" actionIcon="descargar" onAction={descargar} /></Estado>;
  else if (contenido?.tipo === "xlsx") cuerpo = <VistaHoja hojas={contenido.hojas} onStatus={setStatus} />;
  else if (contenido) cuerpo = <VistaPaginas c={contenido} onStatus={setStatus} />;

  return createPortal(
    <div className="ev ev-overlay" ref={ref}>
      <div className={"ev-window ev-viewer" + (full ? " is-full" : "")} role="dialog" aria-modal aria-labelledby="evv-t">
        <header className="ev-viewer-head">
          <span className="ev-filebadge"><Icon name={b[1]} size={16} />{b[0]}</span>
          <div className="ev-viewer-name"><h2 id="evv-t" title={name}>{name}</h2><p>{meta ?? (size ? fmtSize(size) : "")}</p></div>
          <div className="ev-viewer-actions">
            <Button variant="quiet" iconOnly icon="descargar" label="Descargar archivo original" onClick={descargar} />
            <Button variant="quiet" iconOnly icon="pantalla-completa" label={full ? "Salir de pantalla completa" : "Pantalla completa"} onClick={() => setFull((f) => !f)} />
            <Button variant="quiet" iconOnly icon="cerrar" label="Cerrar vista previa" onClick={onClose} />
          </div>
        </header>
        {cuerpo}
        <footer className="ev-viewer-foot">
          <span><Icon name="bloqueo" size={16} />Solo lectura. {source.kind === "file" ? "El archivo se lee en tu navegador y no se sube a ningún servidor." : "Para cambiarlo, descarga el original."}</span>
          <span aria-live="polite">{status}</span>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function Estado({ children }: { children: React.ReactNode }) {
  return <div className="ev-viewer-body"><div className="ev-viewer-state">{children}</div></div>;
}

const ZOOMS = [0.5, 0.75, 0.9, 1, 1.25, 1.5, 2];

function VistaPaginas({ c, onStatus }: { c: Exclude<Contenido, { tipo: "xlsx" }>; onStatus: (s: string) => void }) {
  const [z, setZ] = useState(1);
  const [page, setPage] = useState(1);
  const body = useRef<HTMLDivElement>(null);
  const total = c.tipo === "pdf" ? c.total : 1;
  const shown = Math.min(total, LIMITES.paginas);

  useEffect(() => {
    if (c.tipo !== "pdf") return;
    let vigente = true;
    (async () => {
      for (let i = 1; i <= shown && vigente; i++) {
        const pg = await c.doc.getPage(i);
        const base = pg.getViewport({ scale: 1 }), dpr = window.devicePixelRatio || 1;
        const vp = pg.getViewport({ scale: (794 * z / base.width) * dpr });
        const cv = body.current?.querySelector<HTMLCanvasElement>(`[data-page="${i}"] canvas`);
        if (!cv) continue;
        cv.width = vp.width; cv.height = vp.height; cv.style.aspectRatio = `${base.width} / ${base.height}`;
        await pg.render({ canvasContext: cv.getContext("2d")!, viewport: vp }).promise;
      }
    })();
    return () => { vigente = false; };
  }, [c, z, shown]);

  useEffect(() => {
    if (c.tipo === "pdf") onStatus(`Página ${page} de ${total}`);
    else onStatus(c.avisos ? "Algunos elementos, como formas o comentarios, no se muestran en la vista previa." : `${(body.current?.textContent?.match(/\S+/g) ?? []).length.toLocaleString("es-EC")} palabras`);
  }, [c, page, total, onStatus]);

  const goPage = (n: number) => {
    n = Math.max(1, Math.min(shown, n));
    const el = body.current?.querySelector<HTMLElement>(`[data-page="${n}"]`);
    if (el && body.current) body.current.scrollTop = el.offsetTop - 24;
    setPage(n);
  };
  const paso = (d: number) => { const i = ZOOMS.indexOf(z); setZ(ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, (i < 0 ? 3 : i) + d))]); };

  return (
    <>
      <div className="ev-viewer-tools" role="toolbar" aria-label="Herramientas de la vista previa">
        {c.tipo === "pdf" && <>
          <Button variant="quiet" size="sm" iconOnly icon="chevron-izquierda" label="Página anterior" onClick={() => goPage(page - 1)} />
          <label className="ev-pageno"><input type="text" inputMode="numeric" aria-label="Página actual" value={page} onChange={(e) => goPage(parseInt(e.target.value, 10) || 1)} /> de {total}</label>
          <Button variant="quiet" size="sm" iconOnly icon="chevron-derecha" label="Página siguiente" onClick={() => goPage(page + 1)} />
          <span className="ev-tool-sep" />
        </>}
        <Button variant="quiet" size="sm" iconOnly icon="alejar" label="Alejar" onClick={() => paso(-1)} />
        <span className="ev-zoom-val" aria-live="polite">{Math.round(z * 100)} %</span>
        <Button variant="quiet" size="sm" iconOnly icon="acercar" label="Acercar" onClick={() => paso(1)} />
        <Button variant="quiet" size="sm" label="Ajustar al ancho" onClick={() => body.current && setZ(Math.max(0.5, Math.min(2, (body.current.clientWidth - 48) / 794)))} />
      </div>
      <div ref={body} className="ev-viewer-body is-pages" tabIndex={0} style={{ ["--z" as string]: z }}
        onScroll={(e) => {
          if (c.tipo !== "pdf") return;
          const top = e.currentTarget.scrollTop + 40; let n = 1;
          e.currentTarget.querySelectorAll<HTMLElement>("[data-page]").forEach((p) => { if (p.offsetTop <= top) n = Number(p.dataset.page); });
          if (n !== page) setPage(n);
        }}
        onKeyDown={(e) => {
          if (c.tipo === "pdf" && (e.key === "PageDown" || e.key === "ArrowRight")) { goPage(page + 1); e.preventDefault(); }
          if (c.tipo === "pdf" && (e.key === "PageUp" || e.key === "ArrowLeft")) { goPage(page - 1); e.preventDefault(); }
          if (e.key === "+") paso(1);
          if (e.key === "-") paso(-1);
        }}>
        {c.tipo === "docx"
          ? <article className="ev-page ev-page-doc" dangerouslySetInnerHTML={{ __html: c.html }} />
          : Array.from({ length: shown }, (_, i) => <article key={i} className="ev-page ev-page-canvas" data-page={i + 1} aria-label={`Página ${i + 1}`}><canvas /></article>)}
        {c.tipo === "pdf" && total > shown && <p className="ev-viewer-more">Se muestran las primeras {shown} páginas de {total}. Descarga el archivo para ver el resto.</p>}
      </div>
    </>
  );
}

function VistaHoja({ hojas, onStatus }: { hojas: Hoja[]; onStatus: (s: string) => void }) {
  const [si, setSi] = useState(0);
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const [q, setQ] = useState("");
  const h = hojas[si];
  const nc = useMemo(() => h.rows.reduce((m, r) => Math.max(m, r.length), 0), [h]);
  const nq = normalizar(q.trim());
  const hits = useMemo(() => (nq ? h.rows.flat().filter((c) => c.t && normalizar(c.t).includes(nq)).length : 0), [h, nq]);
  const celda = h.rows[sel[0]]?.[sel[1]];

  useEffect(() => {
    const mas = h.totalRows > h.rows.length || h.totalCols > nc;
    onStatus((nq ? `${hits} ${hits === 1 ? "coincidencia" : "coincidencias"} · ` : "") + `${h.totalRows.toLocaleString("es-EC")} filas · ${h.totalCols} columnas` + (mas ? ` · se muestran las primeras ${h.rows.length} filas y ${nc} columnas` : ""));
  }, [h, nc, nq, hits, onStatus]);

  return (
    <>
      <div className="ev-viewer-tools" role="toolbar" aria-label="Herramientas de la hoja">
        <span className="ev-cellref" aria-label="Celda seleccionada">{colName(sel[1])}{sel[0] + 1}</span>
        <span className="ev-cellval" aria-label="Contenido de la celda">{celda?.f ?? celda?.t ?? ""}</span>
        <label className="ev-input ev-sheet-search"><Icon name="buscar" /><input type="search" placeholder="Buscar en la hoja" aria-label="Buscar en la hoja" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      </div>
      <div className="ev-viewer-body is-sheet" tabIndex={0}
        onKeyDown={(e) => {
          const mv = ({ ArrowDown: [1, 0], ArrowUp: [-1, 0], ArrowRight: [0, 1], ArrowLeft: [0, -1] } as Record<string, [number, number]>)[e.key];
          if (!mv || (e.target as HTMLElement).closest(".ev-sheet-tabs")) return;
          e.preventDefault();
          setSel(([r, c]) => [Math.max(0, Math.min(h.rows.length - 1, r + mv[0])), Math.max(0, Math.min(nc - 1, c + mv[1]))]);
        }}>
        <div className="ev-sheet-wrap">
          <table className="ev-sheet" role="grid" aria-label={"Hoja " + h.name}>
            <thead><tr><th className="ev-corner" scope="col" />{Array.from({ length: nc }, (_, c) => <th key={c} scope="col">{colName(c)}</th>)}</tr></thead>
            <tbody>{h.rows.map((r, ri) => (
              <tr key={ri}><th scope="row" className="ev-rowh">{ri + 1}</th>
                {Array.from({ length: nc }, (_, c) => {
                  const cell = r[c] ?? { t: "", n: false, f: null };
                  const cls = [cell.n && "is-num", nq && cell.t && normalizar(cell.t).includes(nq) && "is-hit", sel[0] === ri && sel[1] === c && "is-sel"].filter(Boolean).join(" ");
                  return <td key={c} className={cls || undefined} title={cell.t} onClick={() => setSel([ri, c])}>{cell.t}</td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="ev-sheet-tabs" role="tablist" aria-label="Hojas">
          {hojas.map((x, i) => <button key={x.name} type="button" role="tab" aria-selected={i === si} onClick={() => { setSi(i); setSel([0, 0]); }}>{x.name}</button>)}
        </div>
      </div>
    </>
  );
}
