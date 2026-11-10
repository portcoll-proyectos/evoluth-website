import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./sections.css";
import "./pages.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollAnimations from "@/components/ScrollAnimations";

const montserrat = localFont({
  src: [
    {
      path: "./fonts/Montserrat-Variable.woff2",
      weight: "300 800",
      style: "normal",
    },
    {
      path: "./fonts/Montserrat-Italic-Variable.woff2",
      weight: "400 600",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  fallback: ["Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://evoluth.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Evoluth · Riesgo, procesos y confianza",
    template: "%s · Evoluth",
  },
  description:
    "Consultoría en gestión de riesgos, procesos, seguridad de la información, protección de datos y cumplimiento. Conectamos decisiones para que tu organización crezca con control.",
  keywords: [
    "consultoría de riesgos Ecuador",
    "gestión de riesgos",
    "seguridad de la información",
    "ISO 27001",
    "protección de datos",
    "LOPDP",
    "continuidad del negocio",
    "cumplimiento",
    "procesos",
  ],
  applicationName: "Evoluth",
  authors: [{ name: "Evoluth" }],
  creator: "Evoluth",
  publisher: "Evoluth",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "/",
    siteName: "Evoluth",
    title: "Evoluth · La confianza no se improvisa. Se diseña.",
    description:
      "Riesgo, procesos, seguridad de la información, protección de datos y cumplimiento en un solo sistema de decisiones.",
    images: [
      {
        url: "/og/evoluth-og.png",
        width: 1200,
        height: 630,
        alt: "Evoluth · La confianza no se improvisa. Se diseña.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evoluth · La confianza no se improvisa. Se diseña.",
    description:
      "Riesgo, procesos, seguridad de la información, protección de datos y cumplimiento en un solo sistema de decisiones.",
    images: ["/og/evoluth-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#050a0f",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-EC" className={montserrat.variable}>
      <body>
        <SmoothScroll />
        <ScrollAnimations />
        {children}
      </body>
    </html>
  );
}
