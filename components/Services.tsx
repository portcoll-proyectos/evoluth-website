"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Fingerprint,
  Plus,
  Radar,
  Scale,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { services } from "@/lib/content";
import NetworkDiagram from "./NetworkDiagram";
import SectionHead from "./SectionHead";

const serviceIcons = {
  radar: Radar,
  workflow: Workflow,
  shield: ShieldCheck,
  fingerprint: Fingerprint,
  scale: Scale,
};

export default function Services() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "servicios") {
        setActive(0);
        return;
      }
      if (!hash.startsWith("servicio-")) return;
      const slug = hash.replace("servicio-", "");
      const index = services.findIndex((service) => service.slug === slug);
      if (index >= 0) setActive(index);
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const toggle = (index: number) => {
    setActive((current) => (current === index ? -1 : index));
  };

  return (
    <section className="services" id="servicios">
      <div className="container">
        <SectionHead index="02" label="Servicios" />

        <div className="services-heading">
          <h2 data-reveal>
            Cinco frentes.
            <span> Una sola red de control.</span>
          </h2>
          <p data-reveal>
            Trabajamos los cinco dominios como un sistema, no como proyectos
            aislados.
          </p>
        </div>

        <div className="services-grid">
          <aside className="services-aside">
            <NetworkDiagram active={active} />
            <div className="services-note">
              <p>Cada servicio puede empezar con un diagnóstico acotado.</p>
              <Link className="text-link" href="#contacto">
                Conversemos sobre tu alcance
                <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </aside>

          <div className="service-list">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.icon];
              const isOpen = active === index;
              return (
                <article
                  key={service.slug}
                  id={`servicio-${service.slug}`}
                  className={`service-item${isOpen ? " is-open" : ""}`}
                >
                  <h3>
                    <button
                      type="button"
                      className="service-trigger"
                      aria-expanded={isOpen}
                      aria-controls={`panel-${service.slug}`}
                      id={`trigger-${service.slug}`}
                      onClick={() => toggle(index)}
                    >
                      <span className="service-number">{service.number}</span>
                      <span className="service-icon">
                        <Icon
                          size={22}
                          strokeWidth={1.6}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="service-title">{service.title}</span>
                      <span className="service-toggle" aria-hidden="true">
                        <Plus size={18} strokeWidth={1.8} />
                      </span>
                    </button>
                  </h3>

                  <div
                    className="service-panel"
                    id={`panel-${service.slug}`}
                    role="region"
                    aria-labelledby={`trigger-${service.slug}`}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                  >
                    <div className="service-panel-inner">
                      <div className="service-panel-main">
                        <p className="service-summary">{service.summary}</p>
                        <div className="service-outcome">
                          <span className="service-panel-label">
                            Qué cambia
                          </span>
                          <p>{service.outcome}</p>
                        </div>
                        <Link className="text-link" href="#contacto">
                          Hablemos de este frente
                          <ArrowUpRight
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </Link>
                      </div>

                      <div className="service-deliverables">
                        <span className="service-panel-label">Entregables</span>
                        <ul>
                          {service.deliverables.map((deliverable) => (
                            <li key={deliverable}>
                              <span aria-hidden="true" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
