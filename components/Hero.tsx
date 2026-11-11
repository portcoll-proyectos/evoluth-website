"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { heroDomains } from "@/lib/content";
import AstralShell from "./AstralShell";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const context = gsap.context(() => {
      gsap.to(copyRef.current, {
        yPercent: -5,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(footRef.current, {
        opacity: 0,
        y: 14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "58% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section className="hero" id="inicio" ref={sectionRef}>
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-astral" aria-hidden="true">
        <AstralShell
          colors={["#4FB8B2", "#C8F8F4"]}
          backgroundColor="transparent"
          nodes={2200}
          connections={4}
          reach={0.21}
          clustering={0.88}
          chords={0.35}
          radius={0.42}
          originX={0.7}
          originY={0.52}
          lineOpacity={0.6}
          nodeSize={0.8}
          depthFade={0.9}
          spin={0.6}
          tilt={16}
          hoverRadius={0.1}
          hoverBoost={0.75}
          pulseSpeed={1.2}
          seed={9}
          dpr={1.8}
        />
      </div>

      <div className="container hero-inner">
        <div className="hero-layout">
          <div className="hero-copy" ref={copyRef}>
            <p className="hero-kicker">
              Consultoría en convergencia digital
            </p>

            <h1 className="hero-title">
              <span className="hero-line">
                <span>La confianza</span>
              </span>
              <span className="hero-line">
                <span>no se improvisa.</span>
              </span>
              <span className="hero-line hero-line-accent">
                <span>Se diseña.</span>
              </span>
            </h1>

            <p className="hero-sub">
              Conectamos madurez digital, procesos, tecnología, datos e
              industria en un solo sistema de decisiones.
            </p>

            <div className="hero-actions">
              <Link href="#contacto" className="btn btn-primary btn-lg">
                Agenda un diagnóstico
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </Link>
              <Link href="#servicios" className="btn btn-ghost btn-lg">
                Ver servicios
                <ArrowDown size={17} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>

            <p className="hero-note">
              Diagnóstico inicial de 45 minutos · Sin costo
            </p>
          </div>
        </div>
      </div>

      <div className="hero-foot" ref={footRef}>
        <div className="container hero-foot-inner">
          <span className="hero-foot-label">Ejes de trabajo</span>
          <nav className="hero-domains" aria-label="Ejes de trabajo">
            {heroDomains.map((domain) => (
              <Link
                key={domain.slug}
                href={`#servicio-${domain.slug}`}
                className="hero-domain"
                title={domain.full}
              >
                <span className="hero-domain-index">{domain.number}</span>
                <span className="hero-domain-label">{domain.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
