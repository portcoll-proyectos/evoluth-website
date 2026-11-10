# Evoluth · sitio comercial

Home pública de Evoluth: riesgo, procesos, seguridad de la información, protección de datos y cumplimiento. El sitio presenta los cinco frentes como una sola red de control y combina una dirección visual oscura en el hero con contenido claro en el resto del recorrido.

## Stack

| Pieza | Versión | Uso |
| --- | --- | --- |
| Next.js | 16.4.6 | App Router, metadata, rutas y API |
| React | 19.3.1 | Componentes de interfaz |
| TypeScript | 5.9.3 | Tipado estricto |
| GSAP + ScrollTrigger | 3.15.1 | Animaciones de scroll y método horizontal |
| Lenis | 1.3.27 | Scroll suave |
| Motion | 14.12.0 | Transiciones de interfaz |
| Canvas 2D | nativo | Globo Astral Shell del hero |
| Lucide | 1.71.0 | Iconografía |
| Montserrat | local | Tipografía de marca |

El sitio vive separado del kit Evoluth UI porque es una web pública con su propio shell y corre sobre React 19. Se reutilizan tokens, tipografía, color y assets, no el `AppShell`.

## Requisitos

- Node.js 20.9 o superior.
- npm.
- Python 3 con Pillow y numpy solo si se regeneran la imagen Open Graph o los assets de marca.

## Puesta en marcha

```bash
npm install
npm run dev
```

El sitio queda en `http://localhost:3000`.

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # compilación de producción
npm run start      # sirve el build
npm run typecheck  # verificación de TypeScript
```

Utilidades reproducibles:

```bash
python scripts/prepare-brand-assets.py   # deriva logos y marca desde material/
python scripts/extract-mark.py           # extrae la silueta de la red
python scripts/create-og.py              # genera public/og/evoluth-og.png
```

Los scripts escriben en `public/brand/` y `public/og/`. La carpeta `material/` es la fuente original y no debe modificarse.

## Variables de entorno

Crea `.env.local` a partir de este ejemplo:

```bash
NEXT_PUBLIC_SITE_URL=https://evoluth.com

RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

- `NEXT_PUBLIC_SITE_URL`: dominio canónico usado por metadata, sitemap y Open Graph.
- `RESEND_API_KEY`: clave de Resend para enviar el formulario por correo.
- `CONTACT_TO_EMAIL`: buzón que recibe los mensajes.
- `CONTACT_FROM_EMAIL`: remitente verificado en Resend.

Si las tres variables de Resend están presentes, el formulario envía el correo. Si falta alguna, el mensaje se guarda en `.data/contacto.jsonl` como respaldo local. Ese archivo sirve para desarrollo; en un host serverless el sistema de archivos puede ser de solo lectura o efímero, así que en producción conviene configurar Resend.

## Estructura

```
app/
  page.tsx                 composición de la home
  layout.tsx               metadata, fuente local y hojas globales
  globals.css              tokens, base, header, menú y hero
  sections.css             secciones de la home
  pages.css                footer, privacidad y 404
  api/contacto/route.ts    validación, rate limit, honeypot y envío
  privacidad/page.tsx      política de privacidad
  not-found.tsx            404
  sitemap.ts / robots.ts   SEO técnico
components/
  Hero.tsx                 estructura y animaciones del hero
  AstralShell.tsx          globo interactivo del hero
  Method.tsx               pista horizontal con pin en escritorio
  Contact.tsx              formulario y estados de envío
  ...                      secciones y utilidades de scroll
lib/
  content.ts               contenido editorial y de servicios
  astral-globe.ts          geometría de la red del globo
  astral-scene.ts          motor de canvas, interacción y dibujo
  lenis.ts                 instancia compartida de scroll suave
public/brand/              logos y marca de red
public/og/                 imagen Open Graph
scripts/                   generación reproducible de assets
```

## Comportamiento y accesibilidad

- El globo del hero se dibuja en canvas 2D: gira lentamente, responde al puntero, se puede arrastrar y emite pulsos al hacer clic. Si el contexto no está disponible, el panel conserva su retícula y sus leyendas.
- El método se convierte en carrusel táctil por debajo de 1024 px y no fija la sección.
- `prefers-reduced-motion` detiene Lenis, las animaciones de scroll, el pin del método, el marquee y la rotación del globo.
- El menú móvil gestiona foco, `Escape` y bloqueo de scroll. El diálogo de notas usa `<dialog>` nativo.
- El formulario valida en cliente y servidor, incluye honeypot y limita a cinco envíos cada diez minutos por IP.
- La navegación por teclado conserva foco visible, enlaces de salto y etiquetas accesibles.

## Marca

Los colores base son `#12405E`, `#3BA7A0`, `#050A0F` y `#FFFFFF`. El cian `#3BA7A0` no se usa como texto sobre blanco: para texto se emplea `#1E7A74`.

El logo y la marca de red son **provisionales**: se derivaron de los raster disponibles en `material/` porque todavía no existe el SVG oficial. Cuando llegue el vector definitivo, reemplaza los archivos de `public/brand/` y vuelve a generar la imagen Open Graph.

## Despliegue

1. Configura las variables de entorno en el proveedor.
2. Ejecuta `npm run build`.
3. Publica el resultado de Next.js.
4. Verifica el envío real del formulario y el dominio canónico en `NEXT_PUBLIC_SITE_URL`.
