"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check } from "lucide-react";
import { dashboardDomains } from "@/lib/content";
import SectionHead from "./SectionHead";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    label: "Riesgo residual",
    value: 18,
    suffix: "%",
    detail: "Objetivo ≤ 20 %",
    progress: 18,
    tone: "ok",
  },
  {
    label: "Controles operando",
    value: 86,
    suffix: "%",
    detail: "12 en revisión",
    progress: 86,
    tone: "ok",
  },
  {
    label: "Hallazgos vencidos",
    value: 3,
    suffix: "",
    detail: "de 148 abiertos",
    progress: 8,
    tone: "warn",
  },
  {
    label: "Cobertura de datos",
    value: 94,
    suffix: "%",
    detail: "142 tratamientos",
    progress: 94,
    tone: "ok",
  },
];

const points = [
  "Un responsable por control.",
  "Trazabilidad de cada decisión.",
  "Indicadores que anticipan.",
  "Ciclos que sobreviven a las personas.",
];

export default function Evidence() {
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const root = dashboardRef.current;
    if (!root) return;

    if (reduced) {
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((element) => {
        element.textContent = element.dataset.count ?? "0";
      });
      return;
    }

    const context = gsap.context(() => {
      root
        .querySelectorAll<HTMLElement>("[data-count]")
        .forEach((element) => {
          const final = Number(element.dataset.count ?? 0);
          const counter = { value: 0 };
          element.textContent = "0";
          gsap.to(counter, {
            value: final,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 70%",
              once: true,
            },
            onUpdate: () => {
              element.textContent = Math.round(counter.value).toString();
            },
          });
        });

      gsap.from(root.querySelectorAll(".dashboard-bar-fill"), {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          once: true,
        },
      });

      const path = root.querySelector<SVGPathElement>(".dashboard-spark-path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            once: true,
          },
        });
      }
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="evidence" id="evidencia">
      <div className="container">
        <SectionHead index="04" label="Evidencia" />

        <div className="evidence-grid">
          <div className="evidence-copy">
            <h2 data-reveal>
              La evidencia no es un anexo.
              <span> Es cómo opera el control.</span>
            </h2>
            <p data-reveal>
              Un sistema maduro se reconoce por la velocidad con la que
              encuentras una decisión, su dueño y su respaldo.
            </p>

            <ul className="evidence-points" data-reveal-group>
              {points.map((point) => (
                <li key={point} data-reveal-item>
                  <span className="evidence-check" aria-hidden="true">
                    <Check size={13} strokeWidth={2.4} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <Link className="text-link" href="#metodo">
              Así se construye
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <div className="dashboard" ref={dashboardRef}>
            <div className="dashboard-top">
              <div>
                <p className="dashboard-eyebrow">Panel de control</p>
                <p className="dashboard-sub">Vista ilustrativa</p>
              </div>
              <span className="dashboard-status">
                <span aria-hidden="true" />
                Sistema operando
              </span>
            </div>

            <div className="dashboard-metrics">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={`dashboard-metric is-${metric.tone}`}
                >
                  <span className="dashboard-metric-label">
                    {metric.label}
                  </span>
                  <div className="dashboard-metric-value">
                    <strong
                      data-count={metric.value}
                      aria-hidden="true"
                    >
                      {metric.value}
                    </strong>
                    <span aria-hidden="true">{metric.suffix}</span>
                    <span className="sr-only">
                      {metric.value}
                      {metric.suffix}
                    </span>
                  </div>
                  <div className="dashboard-bar">
                    <span
                      className="dashboard-bar-fill"
                      style={
                        {
                          "--value": `${metric.progress}%`,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                  <span className="dashboard-metric-detail">
                    {metric.detail}
                  </span>
                </div>
              ))}
            </div>

            <div className="dashboard-chart">
              <div className="dashboard-chart-head">
                <span>Tendencia del riesgo residual</span>
                <span>12 meses</span>
              </div>
              <svg viewBox="0 0 320 96" role="img" aria-label="Tendencia descendente del riesgo residual en los últimos doce meses">
                <g className="dashboard-chart-grid" aria-hidden="true">
                  <line x1="0" y1="24" x2="320" y2="24" />
                  <line x1="0" y1="48" x2="320" y2="48" />
                  <line x1="0" y1="72" x2="320" y2="72" />
                </g>
                <path
                  className="dashboard-spark-path"
                  d="M0 18 C18 22 28 20 46 30 S76 34 94 40 S126 36 146 50 S176 48 196 58 S228 56 248 66 S286 64 320 78"
                  fill="none"
                  stroke="#78e6e6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="320" cy="78" r="3.5" fill="#78e6e6" />
              </svg>
            </div>

            <div className="dashboard-domains">
              {dashboardDomains.map((domain) => (
                <span
                  key={domain.name}
                  className={`dashboard-domain is-${domain.tone}`}
                >
                  <span className="dashboard-domain-dot" aria-hidden="true" />
                  {domain.name}
                  <small>{domain.status}</small>
                </span>
              ))}
            </div>

            <p className="dashboard-foot">
              Datos de ejemplo. Cada organización define sus umbrales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
