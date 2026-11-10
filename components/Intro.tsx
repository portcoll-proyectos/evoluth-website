"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import SectionHead from "./SectionHead";

gsap.registerPlugin(ScrollTrigger);

const statement =
  "La mayoría de las crisis no empieza con un gran fallo: empieza con puntos que nunca se conectaron.";

const principles = [
  {
    number: "01",
    title: "Contexto antes que plantilla",
    body: "Partimos de tu operación, no de un formato.",
  },
  {
    number: "02",
    title: "Diseño para ejecutar",
    body: "Cada control tiene dueño, ritmo y evidencia.",
  },
  {
    number: "03",
    title: "Capacidad, no dependencia",
    body: "Transferimos criterio y herramientas a tu equipo.",
  },
];

export default function Intro() {
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const element = statementRef.current;
    if (!element) return;
    const words = element.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
    }, element);

    return () => context.revert();
  }, []);

  return (
    <section className="intro" id="enfoque">
      <div className="container">
        <SectionHead index="01" label="El punto de partida" />

        <div className="intro-top">
          <h2 className="intro-title" data-reveal>
            El riesgo no vive en un formato.
            <span> Vive en la operación.</span>
          </h2>
          <div className="intro-side" data-reveal>
            <p>
              Traducimos marcos, regulación y tecnología a decisiones que tu
              equipo puede explicar y sostener.
            </p>
            <Link className="text-link" href="#metodo">
              Conoce nuestro método
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <p
          className="intro-statement"
          ref={statementRef}
          aria-label={statement}
        >
          {statement.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} data-word aria-hidden="true">
              {word}
              {index < statement.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </p>

        <div className="intro-principles" data-reveal-group>
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="intro-principle"
              data-reveal-item
            >
              <span className="intro-principle-number">
                {principle.number}
              </span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
