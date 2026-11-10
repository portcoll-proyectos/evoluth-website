import { frameworks } from "@/lib/content";

export default function Frameworks() {
  return (
    <section className="frameworks" aria-labelledby="frameworks-title">
      <div className="container frameworks-head">
        <p className="frameworks-kicker">Marcos de referencia</p>
        <p className="frameworks-title" id="frameworks-title">
          Trabajamos con estándares que resisten auditoría.
        </p>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          <ul className="marquee-group" aria-label="Marcos y estándares">
            {frameworks.map((framework) => (
              <li key={framework} className="marquee-item">
                <span className="marquee-node" aria-hidden="true" />
                {framework}
              </li>
            ))}
          </ul>
          <ul className="marquee-group" aria-hidden="true">
            {frameworks.map((framework) => (
              <li key={`duplicate-${framework}`} className="marquee-item">
                <span className="marquee-node" aria-hidden="true" />
                {framework}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
