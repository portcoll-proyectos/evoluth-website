import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  GitBranch,
  Siren,
} from "lucide-react";
import { scenarios } from "@/lib/content";
import SectionHead from "./SectionHead";

const scenarioIcons = {
  calendar: CalendarClock,
  siren: Siren,
  branch: GitBranch,
};

export default function Scenarios() {
  return (
    <section className="scenarios" id="escenarios">
      <div className="container">
        <SectionHead index="05" label="Escenarios" />

        <div className="scenarios-heading">
          <h2 data-reveal>
            Si reconoces alguna de estas señales,
            <span> ya hay trabajo por hacer.</span>
          </h2>
          <p data-reveal>
            Intervenimos en el punto donde la red se está rompiendo.
          </p>
        </div>

        <div className="scenario-grid" data-reveal-group>
          {scenarios.map((scenario) => {
            const Icon = scenarioIcons[scenario.icon];
            return (
              <article
                key={scenario.number}
                className="scenario-card"
                data-reveal-item
              >
                <div className="scenario-card-top">
                  <span className="scenario-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <span className="scenario-number">{scenario.number}</span>
                </div>
                <h3>{scenario.title}</h3>
                <p className="scenario-body">{scenario.body}</p>
                <div className="scenario-outcome">
                  <span>Qué cambia</span>
                  <p>{scenario.outcome}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="scenario-quote" data-reveal>
          <span className="scenario-quote-mark" aria-hidden="true">
            “
          </span>
          <div className="scenario-quote-copy">
            <blockquote>
              Un control que no se puede explicar en una frase no se va a
              ejecutar.
            </blockquote>
            <p>Equipo Evoluth</p>
          </div>
          <Link href="#contacto" className="btn btn-secondary">
            Cuéntanos qué está pasando
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
