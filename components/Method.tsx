"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { method } from "@/lib/content";
import SectionHead from "./SectionHead";

gsap.registerPlugin(ScrollTrigger);

export default function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return;

    const media = gsap.matchMedia();
    let previousStep = 0;

    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const wrap = track.parentElement;
        if (!wrap) return;

        const getDistance = () =>
          Math.max(0, track.scrollWidth - wrap.clientWidth);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.round(getDistance() + window.innerHeight * 0.45)}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          animation: tween,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const step = Math.min(
              4,
              Math.max(1, Math.floor(self.progress * 4) + 1)
            );
            if (step !== previousStep && stepRef.current) {
              previousStep = step;
              stepRef.current.textContent = String(step).padStart(2, "0");
            }
          },
        });

        return () => {
          trigger.kill();
          tween.kill();
        };
      }
    );

    return () => media.revert();
  }, []);

  return (
    <section className="method" id="metodo" ref={sectionRef}>
      <div className="method-grid-bg" aria-hidden="true" />
      <div className="method-glow" aria-hidden="true" />

      <div className="method-stage" ref={stageRef}>
        <div className="container method-grid">
          <div className="method-intro">
            <SectionHead index="03" label="Método" inverse />

            <h2>
              De una foto inicial a una capacidad que se queda.
            </h2>
            <p className="method-lead">
              Cuatro fases, sin cajas negras. Sabes qué hacemos, qué entregamos
              y cómo se mide.
            </p>

            <div className="method-progress">
              <div className="method-progress-meta" aria-hidden="true">
                <span ref={stepRef}>01</span>
                <span className="method-progress-total">/ 04</span>
              </div>
              <div className="method-progress-track" aria-hidden="true">
                <span ref={progressRef} />
              </div>
            </div>

            <p className="method-hint">Desliza para recorrer el método</p>

            <Link href="#contacto" className="btn btn-primary method-cta">
              Solicita un diagnóstico
              <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <div className="method-cards-wrap">
            <div className="method-track" ref={trackRef}>
              {method.map((step) => (
                <article key={step.number} className="method-card">
                  <div className="method-card-top">
                    <span className="method-card-number">{step.number}</span>
                    <span className="method-card-duration">{step.duration}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p className="method-card-lead">{step.lead}</p>
                  <div className="method-card-outputs">
                    <span className="method-card-label">Salidas</span>
                    <ul>
                      {step.outputs.map((output) => (
                        <li key={output}>
                          <span aria-hidden="true" />
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="method-card-node" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container method-foot">
        <p>Los plazos se ajustan al tamaño y la madurez de la organización.</p>
        <Link className="method-foot-link" href="#evidencia">
          Ver cómo medimos
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
