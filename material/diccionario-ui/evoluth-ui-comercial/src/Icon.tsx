import type { SVGProps } from "react";
import { CLASE, TRAZOS, VIEWBOX, type NombreIcono } from "./iconos-datos";
export { ICONOS, NOMBRES_ORIGINALES, type NombreIcono } from "./iconos-datos";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  /** Solo nombres de la lista cerrada: TypeScript rechaza cualquier otro. */
  name: NombreIcono;
  size?: 16 | 18 | 20 | 24;
  /** Obligatorio cuando el icono va sin texto. */
  label?: string;
}

/** Icono de la lista cerrada, dibujado con Lucide. */
export function Icon({ name, size = 20, label, className, ...rest }: IconProps) {
  return (
    <svg
      className={["ev-icon", CLASE, className].filter(Boolean).join(" ")}
      width={size} height={size} viewBox={VIEWBOX}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: TRAZOS[name] }}
      {...rest}
    />
  );
}
