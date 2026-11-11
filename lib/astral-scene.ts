"use client";

import { buildGlobe, clamp, type AstralGlobe } from "./astral-globe";

export type AstralSceneOptions = {
  colors?: string[];
  backgroundColor?: string;
  nodes?: number;
  connections?: number;
  reach?: number;
  clustering?: number;
  chords?: number;
  radius?: number;
  originX?: number;
  originY?: number;
  lineOpacity?: number;
  nodeSize?: number;
  depthFade?: number;
  spin?: number;
  tilt?: number;
  interactive?: boolean;
  draggable?: boolean;
  hoverRadius?: number;
  hoverBoost?: number;
  clickPulse?: boolean;
  pulseSpeed?: number;
  seed?: number;
  paused?: boolean;
  dpr?: number;
};

type ResolvedOptions = Omit<Required<AstralSceneOptions>, "colors"> & {
  colors: [string, string];
};

export type AstralScene = {
  destroy: () => void;
  update: (next: AstralSceneOptions) => void;
};

type Pulse = {
  star: number;
  start: number;
};

const DEFAULTS: Required<AstralSceneOptions> = {
  colors: ["#7C6BFF", "#FFE6FA"],
  backgroundColor: "#0a0a0a",
  nodes: 2400,
  connections: 4,
  reach: 0.2,
  clustering: 0.85,
  chords: 0.35,
  radius: 0.4,
  originX: 0.5,
  originY: 0.5,
  lineOpacity: 0.7,
  nodeSize: 0.8,
  depthFade: 0.7,
  spin: 1,
  tilt: 18,
  interactive: true,
  draggable: true,
  hoverRadius: 0.22,
  hoverBoost: 1,
  clickPulse: true,
  pulseSpeed: 1.2,
  seed: 0,
  paused: false,
  dpr: 2,
};

function resolveOptions(input: AstralSceneOptions): ResolvedOptions {
  const colors = input.colors ?? DEFAULTS.colors;
  return {
    colors: [
      colors[0] ?? DEFAULTS.colors[0],
      colors[1] ?? DEFAULTS.colors[1],
    ],
    backgroundColor: input.backgroundColor ?? DEFAULTS.backgroundColor,
    nodes: Math.round(clamp(input.nodes ?? DEFAULTS.nodes, 100, 2500)),
    connections: Math.round(
      clamp(input.connections ?? DEFAULTS.connections, 1, 8)
    ),
    reach: clamp(input.reach ?? DEFAULTS.reach, 0.02, 1),
    clustering: clamp(input.clustering ?? DEFAULTS.clustering, 0, 1),
    chords: clamp(input.chords ?? DEFAULTS.chords, 0, 1),
    radius: clamp(input.radius ?? DEFAULTS.radius, 0.08, 0.95),
    originX: clamp(input.originX ?? DEFAULTS.originX, -0.5, 1.5),
    originY: clamp(input.originY ?? DEFAULTS.originY, -0.5, 1.5),
    lineOpacity: clamp(input.lineOpacity ?? DEFAULTS.lineOpacity, 0, 1),
    nodeSize: clamp(input.nodeSize ?? DEFAULTS.nodeSize, 0.1, 4),
    depthFade: clamp(input.depthFade ?? DEFAULTS.depthFade, 0, 1),
    spin: clamp(input.spin ?? DEFAULTS.spin, -8, 8),
    tilt: clamp(input.tilt ?? DEFAULTS.tilt, -90, 90),
    interactive: input.interactive ?? DEFAULTS.interactive,
    draggable: input.draggable ?? DEFAULTS.draggable,
    hoverRadius: clamp(input.hoverRadius ?? DEFAULTS.hoverRadius, 0.02, 1),
    hoverBoost: clamp(input.hoverBoost ?? DEFAULTS.hoverBoost, 0, 3),
    clickPulse: input.clickPulse ?? DEFAULTS.clickPulse,
    pulseSpeed: clamp(input.pulseSpeed ?? DEFAULTS.pulseSpeed, 0.1, 6),
    seed: input.seed ?? DEFAULTS.seed,
    paused: input.paused ?? DEFAULTS.paused,
    dpr: clamp(input.dpr ?? DEFAULTS.dpr, 1, 3),
  };
}

function rgba(color: string, alpha: number): string {
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const expanded =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    if (expanded.length >= 6) {
      const number = Number.parseInt(expanded.slice(0, 6), 16);
      if (!Number.isNaN(number)) {
        const r = (number >> 16) & 255;
        const g = (number >> 8) & 255;
        const b = number & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
  }
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (match) {
    const parts = match[1].split(",").map((part) => part.trim());
    if (parts.length >= 3) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
    }
  }
  return alpha >= 0.999 ? color : value;
}

function luminance(color: string): number | null {
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const expanded =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    if (expanded.length < 6) return null;
    const number = Number.parseInt(expanded.slice(0, 6), 16);
    if (Number.isNaN(number)) return null;
    const r = ((number >> 16) & 255) / 255;
    const g = ((number >> 8) & 255) / 255;
    const b = (number & 255) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (match) {
    const parts = match[1].split(",").map((part) => Number.parseFloat(part));
    if (parts.length >= 3 && parts.every((part) => !Number.isNaN(part))) {
      return (
        (0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]) / 255
      );
    }
  }
  return null;
}

export function createAstralScene(
  canvas: HTMLCanvasElement,
  input: AstralSceneOptions
): AstralScene {
  const context = canvas.getContext("2d");
  if (!context) {
    return { destroy: () => {}, update: () => {} };
  }
  const ctx = context;

  let options = resolveOptions(input);
  let globe: AstralGlobe = { stars: [], edges: [], chords: [] };

  const starCount = () => globe.stars.length;
  let projectX = new Float32Array(starCount());
  let projectY = new Float32Array(starCount());
  let projectZ = new Float32Array(starCount());
  let projectScale = new Float32Array(starCount());

  let width = 1;
  let height = 1;
  let dpr = 1;
  let centerX = 0;
  let centerY = 0;
  let globeRadius = 1;

  let yaw = 0;
  let dragYaw = 0;
  let dragPitch = 0;
  let velocityYaw = 0;
  let velocityPitch = 0;
  let leanYaw = 0;
  let leanPitch = 0;
  let clock = 0;
  let lastFrame = 0;
  let frame = 0;
  let running = false;
  let inView = true;

  let pointerX = 0;
  let pointerY = 0;
  let pointerInside = false;
  let dragging = false;
  let dragTravel = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerId: number | null = null;

  let pulses: Pulse[] = [];

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = motionQuery.matches;

  let edgeA = new Int32Array(0);
  let edgeB = new Int32Array(0);
  let edgeStrength = new Float32Array(0);
  let chordA = new Int32Array(0);
  let chordB = new Int32Array(0);
  let chordStrength = new Float32Array(0);
  const edgeBuckets: number[][] = Array.from({ length: 20 }, () => []);
  const starBuckets: number[][] = Array.from({ length: 12 }, () => []);
  let boosted: number[] = [];

  function rebuild() {
    globe = buildGlobe(options);
    const total = globe.stars.length;
    projectX = new Float32Array(total);
    projectY = new Float32Array(total);
    projectZ = new Float32Array(total);
    projectScale = new Float32Array(total);
    edgeA = new Int32Array(globe.edges.length);
    edgeB = new Int32Array(globe.edges.length);
    edgeStrength = new Float32Array(globe.edges.length);
    globe.edges.forEach((edge, index) => {
      edgeA[index] = edge.a;
      edgeB[index] = edge.b;
      edgeStrength[index] = edge.strength;
    });
    chordA = new Int32Array(globe.chords.length);
    chordB = new Int32Array(globe.chords.length);
    chordStrength = new Float32Array(globe.chords.length);
    globe.chords.forEach((edge, index) => {
      chordA[index] = edge.a;
      chordB[index] = edge.b;
      chordStrength[index] = edge.strength;
    });
    pulses = [];
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(
      Math.max(1, window.devicePixelRatio || 1),
      options.dpr
    );
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    centerX = width * options.originX;
    centerY = height * (1 - options.originY);
    globeRadius = height * options.radius;
  }

  function pointerPosition(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function addPulse(x: number, y: number) {
    if (!options.interactive || !options.clickPulse || reduced) return;
    let best = -1;
    let bestDistance = globeRadius * 0.75;
    for (let index = 0; index < globe.stars.length; index += 1) {
      const dx = projectX[index] - x;
      const dy = projectY[index] - y;
      const distance = Math.hypot(dx, dy);
      if (distance < bestDistance && projectZ[index] > -0.45) {
        bestDistance = distance;
        best = index;
      }
    }
    if (best < 0) return;
    pulses.push({ star: best, start: performance.now() / 1000 });
    if (pulses.length > 4) pulses.shift();
  }

  function onPointerDown(event: PointerEvent) {
    if (!options.interactive || !options.draggable) return;
    const point = pointerPosition(event);
    pointerInside = true;
    pointerX = point.x;
    pointerY = point.y;
    dragging = true;
    dragTravel = 0;
    lastPointerX = point.x;
    lastPointerY = point.y;
    velocityYaw = 0;
    velocityPitch = 0;
    pointerId = event.pointerId;
    canvas.style.cursor = "grabbing";
    canvas.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    const point = pointerPosition(event);
    pointerX = point.x;
    pointerY = point.y;
    pointerInside =
      point.x >= 0 &&
      point.x <= width &&
      point.y >= 0 &&
      point.y <= height;
    if (!dragging) return;
    const dx = point.x - lastPointerX;
    const dy = point.y - lastPointerY;
    lastPointerX = point.x;
    lastPointerY = point.y;
    dragTravel += Math.abs(dx) + Math.abs(dy);
    dragYaw += dx * 0.006;
    dragPitch = clamp(dragPitch + dy * 0.0045, -0.75, 0.75);
    velocityYaw = dx * 0.006;
    velocityPitch = dy * 0.0045;
  }

  function onPointerUp(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    if (pointerId !== null) {
      canvas.releasePointerCapture?.(pointerId);
      pointerId = null;
    }
    if (dragTravel < 7) {
      const point = pointerPosition(event);
      addPulse(point.x, point.y);
    }
    canvas.style.cursor =
      options.interactive && options.draggable ? "grab" : "default";
    const friction = 0.72;
    velocityYaw *= friction;
    velocityPitch *= friction;
  }

  function onPointerCancel() {
    if (!dragging) return;
    dragging = false;
    if (pointerId !== null) {
      canvas.releasePointerCapture?.(pointerId);
      pointerId = null;
    }
    canvas.style.cursor =
      options.interactive && options.draggable ? "grab" : "default";
  }

  function onMotionChange(event: MediaQueryListEvent) {
    reduced = event.matches;
  }

  function onDocumentLeave() {
    pointerInside = false;
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  document.addEventListener("pointerleave", onDocumentLeave);
  motionQuery.addEventListener("change", onMotionChange);

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!running) draw(performance.now() / 1000);
  });
  resizeObserver.observe(canvas);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      if (inView && !document.hidden) start();
      else stop();
    },
    { threshold: 0 }
  );
  intersectionObserver.observe(canvas);

  function onVisibility() {
    if (document.hidden) stop();
    else if (inView) start();
  }
  document.addEventListener("visibilitychange", onVisibility);

  rebuild();
  resize();
  draw(performance.now() / 1000);

  /* El bucle y el dibujo se definen más abajo. */
  function start() {
    if (running) return;
    running = true;
    lastFrame = performance.now();
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  function loop(now: number) {
    if (!running) return;
    const delta = Math.min(0.05, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    clock += delta;
    draw(now / 1000, delta);
    frame = requestAnimationFrame(loop);
  }

  function depthFactor(z: number) {
    return (
      0.1 +
      0.9 * Math.pow((z + 1) / 2, 0.65 + options.depthFade * 1.15)
    );
  }

  function draw(now: number, delta = 0) {
    const background = options.backgroundColor;
    const backgroundLuminance =
      background === "transparent" ? null : luminance(background);
    const lightBackground =
      backgroundLuminance !== null && backgroundLuminance > 0.62;
    const lineColor =
      lightBackground && options.colors[0] === DEFAULTS.colors[0]
        ? "#16242c"
        : options.colors[0];
    const highlightColor = options.colors[1];

    if (background === "transparent") {
      ctx.clearRect(0, 0, width, height);
    } else {
      ctx.globalAlpha = 1;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
    }

    const live = !options.paused && !reduced;
    if (live && delta > 0) {
      yaw += options.spin * delta * 0.32;
    }

    if (!dragging) {
      dragYaw += velocityYaw;
      dragPitch = clamp(dragPitch + velocityPitch, -0.75, 0.75);
      velocityYaw *= 0.93;
      velocityPitch *= 0.93;
      if (Math.abs(velocityYaw) < 0.00002) velocityYaw = 0;
      if (Math.abs(velocityPitch) < 0.00002) velocityPitch = 0;
    }

    const wantsLean =
      options.interactive && pointerInside && !dragging && !reduced;
    const leanTargetYaw = wantsLean
      ? (pointerX / width - 0.5) * 0.2
      : 0;
    const leanTargetPitch = wantsLean
      ? (pointerY / height - 0.5) * 0.14
      : 0;
    const leanEase = 1 - Math.pow(0.0015, delta || 0.016);
    leanYaw += (leanTargetYaw - leanYaw) * leanEase;
    leanPitch += (leanTargetPitch - leanPitch) * leanEase;

    const rotationY = yaw + dragYaw + leanYaw;
    const rotationX =
      (options.tilt * Math.PI) / 180 + dragPitch + leanPitch;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const camera = 4.6;
    const radius = globeRadius;

    for (let index = 0; index < globe.stars.length; index += 1) {
      const star = globe.stars[index];
      const x1 = star.x * cosY + star.z * sinY;
      const z1 = -star.x * sinY + star.z * cosY;
      const y1 = star.y * cosX - z1 * sinX;
      const z2 = star.y * sinX + z1 * cosX;
      const scale = camera / (camera - z2 * 0.96);
      projectX[index] = centerX + x1 * radius * scale;
      projectY[index] = centerY - y1 * radius * scale;
      projectZ[index] = z2;
      projectScale[index] = scale;
    }

    const ambient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.15,
      centerX,
      centerY,
      radius * 1.55
    );
    ambient.addColorStop(0, rgba(lineColor, 0.11));
    ambient.addColorStop(0.55, rgba(lineColor, 0.045));
    ambient.addColorStop(1, rgba(lineColor, 0));
    ctx.globalAlpha = 1;
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, width, height);

    pulses = pulses.filter((pulse) => {
      const wave = (now - pulse.start) * options.pulseSpeed * 1.9;
      return wave < 3.7;
    });
    const pulseX: number[] = [];
    const pulseY: number[] = [];
    const pulseZ: number[] = [];
    const pulseWave: number[] = [];
    const pulseFade: number[] = [];
    for (const pulse of pulses) {
      const star = globe.stars[pulse.star];
      const wave = (now - pulse.start) * options.pulseSpeed * 1.9;
      pulseX.push(star.x);
      pulseY.push(star.y);
      pulseZ.push(star.z);
      pulseWave.push(wave);
      pulseFade.push(clamp(1 - wave / 3.7, 0, 1));
    }

    const hoverPixels = options.hoverRadius * height;
    const hoverSquared = hoverPixels * hoverPixels;
    const hoverActive =
      options.interactive &&
      options.hoverBoost > 0 &&
      pointerInside &&
      !reduced;
    const hoverX = pointerX;
    const hoverY = pointerY;

    for (const bucket of edgeBuckets) bucket.length = 0;
    for (let index = 0; index < edgeA.length; index += 1) {
      const a = edgeA[index];
      const b = edgeB[index];
      const depth = (projectZ[a] + projectZ[b]) * 0.5;
      const alpha = clamp(edgeStrength[index] * depthFactor(depth), 0, 1);
      const alphaLevel = Math.min(4, Math.floor(alpha * 5));
      const depthLevel = Math.min(
        3,
        Math.max(0, Math.floor(((depth + 1) / 2) * 4))
      );
      edgeBuckets[depthLevel * 5 + alphaLevel].push(index);
    }

    ctx.lineCap = "round";
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = lineColor;
    for (let index = 0; index < chordA.length; index += 1) {
      const depth =
        (projectZ[chordA[index]] + projectZ[chordB[index]]) * 0.5;
      ctx.globalAlpha =
        options.lineOpacity * 0.5 * depthFactor(depth) * chordStrength[index];
      ctx.beginPath();
      ctx.moveTo(projectX[chordA[index]], projectY[chordA[index]]);
      ctx.lineTo(projectX[chordB[index]], projectY[chordB[index]]);
      ctx.stroke();
    }

    ctx.lineWidth = 0.7;
    for (let depthLevel = 0; depthLevel < 4; depthLevel += 1) {
      for (let alphaLevel = 0; alphaLevel < 5; alphaLevel += 1) {
        const bucket = edgeBuckets[depthLevel * 5 + alphaLevel];
        if (bucket.length === 0) continue;
        ctx.globalAlpha =
          options.lineOpacity * ((alphaLevel + 0.8) / 5);
        ctx.beginPath();
        for (const index of bucket) {
          ctx.moveTo(projectX[edgeA[index]], projectY[edgeA[index]]);
          ctx.lineTo(projectX[edgeB[index]], projectY[edgeB[index]]);
        }
        ctx.stroke();
      }
    }

    for (const bucket of starBuckets) bucket.length = 0;
    boosted.length = 0;
    const boostLevel: number[] = [];

    for (let index = 0; index < globe.stars.length; index += 1) {
      const star = globe.stars[index];
      const depth = projectZ[index];
      const fade = depthFactor(depth);
      const twinkle = live
        ? 0.72 + 0.28 * Math.sin(clock * 1.15 + star.phase)
        : 1;
      let boost = 0;

      if (hoverActive) {
        const dx = projectX[index] - hoverX;
        const dy = projectY[index] - hoverY;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < hoverSquared) {
          boost =
            (1 - Math.sqrt(distanceSquared) / hoverPixels) *
            options.hoverBoost;
        }
      }

      for (let pulse = 0; pulse < pulseWave.length; pulse += 1) {
        const dot =
          star.x * pulseX[pulse] +
          star.y * pulseY[pulse] +
          star.z * pulseZ[pulse];
        const angle = Math.acos(clamp(dot, -1, 1));
        const deltaAngle = angle - pulseWave[pulse];
        if (deltaAngle > -0.65 && deltaAngle < 1.15) {
          const factor =
            Math.exp(-(deltaAngle * deltaAngle) / 0.05) *
            pulseFade[pulse] *
            1.15;
          if (factor > boost) boost = factor;
        }
      }

      if (boost > 0.08 && depth > -0.45) {
        boosted.push(index);
        boostLevel.push(clamp(boost, 0, 1.4));
        continue;
      }

      const depthLevel = Math.min(
        3,
        Math.max(0, Math.floor(clamp(fade, 0, 0.999) * 4))
      );
      const twinkleLevel = twinkle < 0.82 ? 0 : twinkle < 0.94 ? 1 : 2;
      starBuckets[depthLevel * 3 + twinkleLevel].push(index);
    }

    for (let depthLevel = 0; depthLevel < 4; depthLevel += 1) {
      for (let twinkleLevel = 0; twinkleLevel < 3; twinkleLevel += 1) {
        const bucket = starBuckets[depthLevel * 3 + twinkleLevel];
        if (bucket.length === 0) continue;
        const pixel = Math.max(
          0.55,
          options.nodeSize *
            (1.1 + depthLevel * 0.17) *
            (0.88 + twinkleLevel * 0.08)
        );
        ctx.globalAlpha =
          (0.22 + 0.78 * (depthLevel / 3)) *
          (0.6 + twinkleLevel * 0.2);
        ctx.fillStyle = lineColor;
        ctx.beginPath();
        for (const index of bucket) {
          ctx.rect(
            projectX[index] - pixel * 0.5,
            projectY[index] - pixel * 0.5,
            pixel,
            pixel
          );
        }
        ctx.fill();
      }
    }

    for (let index = 0; index < globe.stars.length; index += 1) {
      const star = globe.stars[index];
      if (!star.hub) continue;
      const depth = projectZ[index];
      const fade = depthFactor(depth);
      const twinkle = live
        ? 0.85 + 0.15 * Math.sin(clock * 1.05 + star.phase)
        : 1;
      const x = projectX[index];
      const y = projectY[index];
      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) {
        continue;
      }
      const core = clamp(
        options.nodeSize * star.size * projectScale[index] * 1.5,
        1.1,
        3.8
      );
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.1 * fade * twinkle;
      ctx.beginPath();
      ctx.arc(x, y, core * 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = (0.4 + 0.5 * fade) * twinkle;
      ctx.beginPath();
      ctx.arc(x, y, core, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let index = 0; index < boosted.length; index += 1) {
      const starIndex = boosted[index];
      const amount = boostLevel[index];
      const x = projectX[starIndex];
      const y = projectY[starIndex];
      const core = clamp(
        options.nodeSize *
          1.7 *
          projectScale[starIndex] *
          (1 + amount * 0.7),
        1,
        4.4
      );
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.1 * amount;
      ctx.beginPath();
      ctx.arc(x, y, core * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.5 + amount * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, core, 0, Math.PI * 2);
      ctx.fill();
    }

    if (hoverActive) {
      const glowRadius = Math.max(28, hoverPixels);
      const pointerGlow = ctx.createRadialGradient(
        hoverX,
        hoverY,
        0,
        hoverX,
        hoverY,
        glowRadius
      );
      pointerGlow.addColorStop(
        0,
        rgba(highlightColor, 0.14 * Math.min(1, options.hoverBoost))
      );
      pointerGlow.addColorStop(
        0.55,
        rgba(highlightColor, 0.05 * Math.min(1, options.hoverBoost))
      );
      pointerGlow.addColorStop(1, rgba(highlightColor, 0));
      ctx.globalAlpha = 1;
      ctx.fillStyle = pointerGlow;
      ctx.fillRect(
        hoverX - glowRadius,
        hoverY - glowRadius,
        glowRadius * 2,
        glowRadius * 2
      );
    }

    ctx.globalAlpha = 1;
  }

  return {
    destroy() {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onDocumentLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
    },
    update(next) {
      const merged = resolveOptions({ ...options, ...next });
      const needsRebuild =
        merged.nodes !== options.nodes ||
        merged.connections !== options.connections ||
        merged.reach !== options.reach ||
        merged.clustering !== options.clustering ||
        merged.chords !== options.chords ||
        merged.seed !== options.seed;
      options = merged;
      if (needsRebuild) rebuild();
      resize();
      if (!running) draw(performance.now() / 1000);
    },
  };
}
