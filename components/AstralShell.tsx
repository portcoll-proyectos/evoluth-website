"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  createAstralScene,
  type AstralSceneOptions,
} from "@/lib/astral-scene";

export type AstralShellProps = AstralSceneOptions & {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export default function AstralShell({
  className,
  style,
  children,
  ...options
}: AstralShellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const signature = JSON.stringify({
    ...options,
    colors: options.colors ?? null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = createAstralScene(canvas, optionsRef.current);
    return () => scene.destroy();
  }, [signature]);

  return (
    <div
      className={className ? `astral-shell ${className}` : "astral-shell"}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          touchAction: "pan-y",
          cursor:
            options.interactive && options.draggable ? "grab" : "default",
        }}
      />
      {children ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
