"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { getLenis } from "@/lib/lenis";
import { nav, site } from "@/lib/content";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      setScrolled(window.scrollY > 32);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = true;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.classList.add("menu-open");

    const panel = panelRef.current;
    const focusables = [
      toggleRef.current,
      ...(panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : []),
    ].filter((element): element is HTMLElement => {
      if (!element) return false;
      return element.offsetParent !== null;
    });

    const firstLink = focusables[1] ?? focusables[0];
    window.setTimeout(() => firstLink?.focus(), 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) return;
      const activeIndex = focusables.indexOf(
        document.activeElement as HTMLElement
      );
      if (activeIndex === -1) return;

      if (event.shiftKey && activeIndex === 0) {
        event.preventDefault();
        focusables[focusables.length - 1].focus();
      } else if (!event.shiftKey && activeIndex === focusables.length - 1) {
        event.preventDefault();
        focusables[0].focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (restoreFocusRef.current) {
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const closeFromLink = () => {
    restoreFocusRef.current = false;
    setOpen(false);
  };

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${
          open ? " is-open" : ""
        }`}
      >
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="Evoluth, inicio">
            <Image
              src="/brand/evoluth-wordmark-positive.png"
              alt=""
              width={512}
              height={102}
              priority
              sizes="180px"
              className="brand-logo brand-logo-positive"
            />
            <Image
              src="/brand/evoluth-wordmark-negative.png"
              alt=""
              width={512}
              height={102}
              priority
              sizes="180px"
              className="brand-logo brand-logo-negative"
            />
          </Link>

          <nav className="header-nav" aria-label="Navegación principal">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="header-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="#contacto" className="btn btn-primary header-cta">
              Agenda un diagnóstico
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => {
                restoreFocusRef.current = true;
                setOpen((value) => !value);
              }}
            >
              {open ? (
                <X size={22} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <Menu size={22} strokeWidth={1.8} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <span className="header-progress" aria-hidden="true" />
      </header>

      {open ? (
        <div
          id="menu-movil"
          className="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="mobile-menu-inner">
            <p className="mobile-menu-eyebrow">Explora el sitio</p>
            <nav className="mobile-nav" aria-label="Navegación móvil">
              {nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mobile-nav-link"
                  style={{ "--i": index } as React.CSSProperties}
                  onClick={closeFromLink}
                >
                  <span className="mobile-nav-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                  <ArrowUpRight
                    size={22}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            <div className="mobile-menu-foot">
              <Link
                href="#contacto"
                className="btn btn-primary mobile-menu-cta"
                onClick={closeFromLink}
              >
                Agenda un diagnóstico
                <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
              </Link>
              <div className="mobile-menu-meta">
                <span>{site.location}</span>
                <span>{site.hours}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
