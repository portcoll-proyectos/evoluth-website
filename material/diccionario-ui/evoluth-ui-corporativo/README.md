# @evoluth/ui-corporativo

Kit de Evoluth UI · Corporativo para React 18 + TypeScript, con la conexión a PostgreSQL y JSONB. Es la versión del sistema para finanzas, auditoría, reportes y tablas largas, y corresponde al sistema de diseño "Evoluth UI · Corporativo".

| | |
|---|---|
| Iconos | Heroicons 2.1.5 (MIT), 47 iconos de una lista cerrada, ya incluidos |
| Densidad | compacta: controles de 32 px y filas de 34 px |
| Forma | radios de 3 y 6 px |
| Menú | Barra con un icono por grupo: cada uno abre un popup azul con sus módulos y el primer botón abre todos. Abajo, las iniciales de la persona abren el menú de usuario (perfil, configuración, empresa, idioma, tema, ayuda, más información y cerrar sesión) |
| Foco | anillo sólido (opción A) |
| Barra de progreso | sólida |
| Cargas | Rueda de nodos pequeña, red Evoluth 3D con impulso que enciende nodo a nodo (inicio, y lista o panel más lenta), barra de progreso, barra superior y esqueleto |

## Contenido

```
src/                 componentes, tipos, formato de fechas y montos, hooks
src/servidor/        errores de PostgreSQL y preferencias en JSONB (Node + pg)
styles/              tokens.css, evoluth.css y tokens.json (fuente de los tokens)
db/                  migración del esquema ui para PostgreSQL 14 o superior
docs/                libro de marca y guía de cada componente
assets/              logotipo, icono 3D animado y manual de identidad
licencias/           licencia de Heroicons
```

## Cómo agregarlo a un proyecto

1. Copia esta carpeta al repositorio, por ejemplo en `packages/ui-corporativo`, y agrégala como dependencia: `"@evoluth/ui-corporativo": "workspace:*"` (o `"file:../packages/ui-corporativo"`).
2. Instala lo que pide `package.json`: React 18.3.1 ya debería estar; `pdfjs-dist`, `mammoth` y `exceljs` solo se cargan al abrir un archivo en la vista previa.
3. Ejecuta `db/001_evoluth_ui.sql` en PostgreSQL. Crea el esquema `ui` con el catálogo de mensajes de error, el registro técnico, las preferencias de pantalla (JSONB) y los adjuntos. Si ya lo ejecutaste con otro modelo, no hace falta repetirlo: el esquema es el mismo.
4. En la entrada de React, una sola vez:

```tsx
import "@evoluth/ui-corporativo/tokens.css";
import "@evoluth/ui-corporativo/evoluth.css";
import { AppShell, ToastProvider } from "@evoluth/ui-corporativo";

<html data-theme="light">  // o "dark"
```

5. Envuelve la aplicación:

```tsx
<ToastProvider>
  <AppShell
    active={modulo} onNavigate={setModulo}
    tenant={{ initials: "AE", name: "Andina Energía S.A.", detail: "Cambiar de empresa" }}
    user={{ initials: "RD", name: "Ricardo Durán", email: "rduran@portcoll.com.ec" }}
    userMenu={{ orgBadge: 1, idioma: "Español", onAction: (accion) => abrir(accion) }}
    onLogout={cerrarSesion}
    logo="/assets/evoluth-logo-positivo.png"
    groups={[
      { label: "Operación", icon: "panel", items: [{ id: "activos", icon: "activos", label: "Activos", count: "1 284" }] },
      { label: "Administración", icon: "usuarios", items: [{ id: "empresas", icon: "empresas", label: "Empresas" }] },
    ]}>
    <PantallaActivos />
  </AppShell>
</ToastProvider>
```

6. En la API (Node + pg):

```ts
import { aErrorRespuesta } from "@evoluth/ui-corporativo/servidor/errores-pg";
import { obtenerPreferencias, fusionarPreferencias } from "@evoluth/ui-corporativo/servidor/preferencias";

const { status, cuerpo } = await aErrorRespuesta(pool, err, usuario?.id);   // manejador de errores
res.status(status).json(cuerpo);
res.json(await obtenerPreferencias(pool, usuario.id));                        // GET /api/ui/preferencias
res.json(await fusionarPreferencias(pool, usuario.id, req.body));             // PATCH /api/ui/preferencias
```

## Cargas

```tsx
<Button variant="primary" label="Guardar activo" loading={guardando} loadingLabel="Guardando…" />   // rueda de nodos
<Loader kind="red-lista" label="Cargando activos…" />                                                // lista o panel (misma red, más lenta)
<Loader kind="red-inicio" label="Abriendo Andina Energía…" size={200} />                             // inicio y cambio de empresa
<Loader kind="progreso" label="Exportando inventario" value={64} detail="822 de 1 284 activos" />    // porcentaje conocido
<div style={{ position: "relative" }}><Loader kind="barra-superior" label="Importando" value={42} /> …tabla… </div>
<Loader kind="esqueleto" label="Cargando activos" rows={6} />                                       // primera carga
```

La red Evoluth gira en 3D con `requestAnimationFrame`: primero dibuja sus enlaces y después un impulso viaja de nodo en nodo encendiéndolos. La de lista o panel es la misma red, un 30 % más lenta. Se detiene al desmontarse y, con movimiento reducido, queda quieta.

## Para tener en cuenta

- `Icon` solo acepta los 47 nombres de la lista; TypeScript rechaza cualquier otro. `NOMBRES_ORIGINALES` da el nombre de cada icono en Heroicons.
- Las fuentes Montserrat e IBM Plex Mono se cargan desde Google Fonts en la primera línea de `evoluth.css`. En producción, sírvelas desde Evoluth y quita esa línea.
- `assets/icono-3d/icono-evoluth-3d.svg` es el original animado (404 KB). Úsalo en material de marca o en el inicio de sesión; dentro de la aplicación, `<Loader kind="red-inicio">` reproduce ese movimiento con pocos KB.
- Falta la versión negativa del logotipo para el tema oscuro; hasta tenerla, `AppShell` oculta el logotipo en oscuro.
- `npm run typecheck` compila todo con `strict`.
