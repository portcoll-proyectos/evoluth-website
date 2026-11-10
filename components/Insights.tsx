"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { notes, type Note } from "@/lib/content";
import { getLenis } from "@/lib/lenis";
import SectionHead from "./SectionHead";

export default function Insights() {
  const [note, setNote] = useState<Note | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!note || !dialog) return;

    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.classList.add("modal-open");

    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-dialog-close]")?.focus();

    const onCancel = (event: Event) => {
      event.preventDefault();
      setNote(null);
    };
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) setNote(null);
    };

    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onClick);

    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onClick);
      if (dialog.open) dialog.close();
      document.documentElement.classList.remove("modal-open");
      lenis?.start();
      window.requestAnimationFrame(() => {
        lastTriggerRef.current?.focus({ preventScroll: true });
      });
    };
  }, [note]);

  const openNote = (next: Note, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setNote(next);
  };

  const goToContact = () => {
    setNote(null);
    window.setTimeout(() => {
      const target = document.querySelector("#contacto");
      if (!target) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.start();
        lenis.scrollTo(target, { offset: -84, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      window.history.pushState(null, "", "#contacto");
    }, 80);
  };

  return (
    <section className="insights" id="notas">
      <div className="container">
        <SectionHead index="06" label="Notas" />

        <div className="insights-heading">
          <h2 data-reveal>
            Ideas para decidir mejor.
          </h2>
          <div data-reveal>
            <p>
              Escribimos sobre decisiones, controles y la distancia entre el
              diseño y la práctica.
            </p>
            <Link className="text-link" href="#contacto">
              Conversemos sobre estos temas
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="insights-grid" data-reveal-group>
          {notes.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              className={`note-card${
                index === 0 ? " note-card-featured" : ""
              }`}
              onClick={(event) => openNote(item, event.currentTarget)}
              aria-haspopup="dialog"
              data-reveal-item
            >
              <span className="note-meta">
                <span className="note-category">{item.category}</span>
                <span>
                  {item.date} · {item.reading}
                </span>
              </span>
              <span className="note-title">{item.title}</span>
              <span className="note-excerpt">{item.excerpt}</span>
              <span className="note-cta">
                Leer nota
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="note-dialog"
        aria-labelledby="note-dialog-title"
      >
        {note ? (
          <div className="note-dialog-inner" data-lenis-prevent>
            <div className="note-dialog-top">
              <p className="note-dialog-meta">
                {note.category} · {note.date}
              </p>
              <button
                type="button"
                className="note-dialog-close"
                data-dialog-close
                aria-label="Cerrar nota"
                onClick={() => setNote(null)}
              >
                <X size={20} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>

            <h2 id="note-dialog-title">{note.title}</h2>
            <p className="note-dialog-reading">{note.reading} de lectura</p>

            <div className="note-dialog-body">
              {note.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="note-dialog-foot">
              <p>¿Quieres discutir esta idea con nosotros?</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={goToContact}
              >
                Hablemos
                <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
