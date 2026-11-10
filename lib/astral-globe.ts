/* Geometría del globo Astral Shell.
   Genera estrellas sobre una esfera, sus constelaciones y las líneas que las unen.
   Es código puro: no toca DOM ni React. */

export type AstralStar = {
  x: number;
  y: number;
  z: number;
  hub: boolean;
  phase: number;
  size: number;
};

export type AstralEdge = {
  a: number;
  b: number;
  strength: number;
};

export type AstralGlobe = {
  stars: AstralStar[];
  edges: AstralEdge[];
  chords: AstralEdge[];
};

export type GlobeOptions = {
  nodes: number;
  connections: number;
  reach: number;
  clustering: number;
  chords: number;
  seed: number;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function mulberry32(seed: number) {
  let value = seed | 0;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalize(x: number, y: number, z: number) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length] as const;
}

/* Distribución de Fibonacci: puntos parejos sobre la esfera. */
function spherePoint(index: number, total: number) {
  const offset = 2 / total;
  const increment = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - index * offset;
  const ring = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = index * increment;
  return [Math.cos(phi) * ring, y, Math.sin(phi) * ring] as const;
}

function constellationCenters(count: number, random: () => number) {
  const rotation = random() * Math.PI * 2;
  const centers: Array<readonly [number, number, number]> = [];
  for (let index = 0; index < count; index += 1) {
    const point = spherePoint(index, count);
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    centers.push(
      normalize(
        point[0] * cos + point[2] * sin,
        point[1],
        -point[0] * sin + point[2] * cos
      )
    );
  }
  return centers;
}

export function buildGlobe(options: GlobeOptions): AstralGlobe {
  const nodes = Math.round(clamp(options.nodes, 100, 2500));
  const connections = Math.round(clamp(options.connections, 1, 8));
  const reach = clamp(options.reach, 0.02, 1);
  const clustering = clamp(options.clustering, 0, 1);
  const chords = clamp(options.chords, 0, 1);
  const random = mulberry32(options.seed);

  const centerCount = Math.max(6, Math.round(8 + clustering * 20));
  const centers = constellationCenters(centerCount, random);
  const stars: AstralStar[] = [];

  for (let index = 0; index < nodes; index += 1) {
    const base = spherePoint(index, nodes);
    let x = base[0];
    let y = base[1];
    let z = base[2];

    if (clustering > 0 && random() < 0.35 + clustering * 0.6) {
      const center = centers[Math.floor(random() * centers.length)];
      const pull = clustering * (0.4 + random() * 0.52);
      x += (center[0] - x) * pull;
      y += (center[1] - y) * pull;
      z += (center[2] - z) * pull;
      const point = normalize(x, y, z);
      x = point[0];
      y = point[1];
      z = point[2];
    }

    stars.push({
      x,
      y,
      z,
      hub: false,
      phase: random() * Math.PI * 2,
      size: 0.75 + random() * 0.5,
    });
  }

  /* Los hubs son las estrellas que sostienen la lectura de la red. */
  const hubCount = Math.max(9, Math.round(nodes * (0.032 + clustering * 0.028)));
  const hubPool = stars.map((_, index) => index);
  for (let index = hubPool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [hubPool[index], hubPool[swap]] = [hubPool[swap], hubPool[index]];
  }
  for (let index = 0; index < Math.min(hubCount, hubPool.length); index += 1) {
    const star = stars[hubPool[index]];
    star.hub = true;
    star.size += 0.85 + random() * 0.6;
  }

  /* Vecinos más cercanos dentro del alcance. */
  const edges: AstralEdge[] = [];
  const seen = new Set<number>();
  const neighborIndex: number[] = [];
  const neighborDistance: number[] = [];
  const reachSquared = reach * reach;

  for (let index = 0; index < nodes; index += 1) {
    neighborIndex.length = 0;
    neighborDistance.length = 0;
    const star = stars[index];

    for (let other = 0; other < nodes; other += 1) {
      if (other === index) continue;
      const target = stars[other];
      const dx = star.x - target.x;
      const dy = star.y - target.y;
      const dz = star.z - target.z;
      const distance = dx * dx + dy * dy + dz * dz;
      if (distance > reachSquared || distance === 0) continue;

      if (neighborIndex.length < connections) {
        let slot = neighborIndex.length;
        while (slot > 0 && neighborDistance[slot - 1] > distance) {
          neighborDistance[slot] = neighborDistance[slot - 1];
          neighborIndex[slot] = neighborIndex[slot - 1];
          slot -= 1;
        }
        neighborDistance[slot] = distance;
        neighborIndex[slot] = other;
      } else if (distance < neighborDistance[connections - 1]) {
        let slot = connections - 1;
        while (slot > 0 && neighborDistance[slot - 1] > distance) {
          neighborDistance[slot] = neighborDistance[slot - 1];
          neighborIndex[slot] = neighborIndex[slot - 1];
          slot -= 1;
        }
        neighborDistance[slot] = distance;
        neighborIndex[slot] = other;
      }
    }

    for (let slot = 0; slot < neighborIndex.length; slot += 1) {
      const other = neighborIndex[slot];
      const low = Math.min(index, other);
      const high = Math.max(index, other);
      const key = low * nodes + high;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({
        a: low,
        b: high,
        strength: 1 - Math.sqrt(neighborDistance[slot]) / reach,
      });
    }
  }

  /* Cuerdas largas que atraviesan el globo. */
  const chordEdges: AstralEdge[] = [];
  const chordCount = Math.max(
    0,
    Math.round(nodes * chords * 0.05)
  );
  let attempts = 0;
  while (chordEdges.length < chordCount && attempts < chordCount * 24) {
    attempts += 1;
    const a = Math.floor(random() * nodes);
    const b = Math.floor(random() * nodes);
    if (a === b) continue;
    const starA = stars[a];
    const starB = stars[b];
    const distance = Math.hypot(
      starA.x - starB.x,
      starA.y - starB.y,
      starA.z - starB.z
    );
    if (distance < 0.9) continue;
    chordEdges.push({ a, b, strength: 0.35 + random() * 0.3 });
  }

  return { stars, edges, chords: chordEdges };
}
