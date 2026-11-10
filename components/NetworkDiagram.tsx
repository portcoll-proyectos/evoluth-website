"use client";

import { services } from "@/lib/content";

const positions = [
  { x: 210, y: 66 },
  { x: 342, y: 158 },
  { x: 291, y: 336 },
  { x: 129, y: 336 },
  { x: 78, y: 158 },
];

const center = { x: 210, y: 210 };

export default function NetworkDiagram({ active }: { active: number }) {
  return (
    <div className="network-diagram" aria-hidden="true">
      <svg viewBox="0 0 420 420" role="presentation">
        <defs>
          <radialGradient id="diagram-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#12405e" />
            <stop offset="100%" stopColor="#0b2c43" />
          </radialGradient>
          <linearGradient id="diagram-link" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3ba7a0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3ba7a0" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <g className="diagram-rings">
          <circle cx={center.x} cy={center.y} r="92" />
          <circle cx={center.x} cy={center.y} r="150" />
          <circle cx={center.x} cy={center.y} r="192" className="dashed" />
        </g>

        <g className="diagram-cross" aria-hidden="true">
          <line x1="210" y1="20" x2="210" y2="400" />
          <line x1="20" y1="210" x2="400" y2="210" />
        </g>

        {positions.map((position, index) => {
          const isActive = active === index;
          return (
            <g key={services[index].slug}>
              <line
                className={`diagram-link${isActive ? " is-active" : ""}`}
                x1={center.x}
                y1={center.y}
                x2={position.x}
                y2={position.y}
              />
              {isActive ? (
                <line
                  className="diagram-link-pulse"
                  x1={center.x}
                  y1={center.y}
                  x2={position.x}
                  y2={position.y}
                />
              ) : null}
            </g>
          );
        })}

        <g className="diagram-center">
          <circle cx={center.x} cy={center.y} r="47" className="center-halo" />
          <circle
            cx={center.x}
            cy={center.y}
            r="36"
            fill="url(#diagram-center)"
          />
          <circle cx={center.x} cy={center.y} r="36" className="center-edge" />
          <text x={center.x} y={center.y + 4} textAnchor="middle">
            Decisión
          </text>
        </g>

        {positions.map((position, index) => {
          const isActive = active === index;
          return (
            <g
              key={services[index].slug}
              className={`diagram-node${isActive ? " is-active" : ""}`}
              transform={`translate(${position.x} ${position.y})`}
            >
              {isActive ? <circle r="36" className="node-halo" /> : null}
              <circle r="24" className="node-core" />
              <text y="4" textAnchor="middle" className="node-number">
                {services[index].number}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="diagram-caption">
        <span className="diagram-caption-title">
          {active >= 0 ? services[active].title : "Cinco dominios"}
        </span>
        <span className="diagram-caption-meta">Red Evoluth</span>
      </div>
    </div>
  );
}
