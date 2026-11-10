import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type ContactPayload = {
  nombre?: unknown;
  empresa?: unknown;
  correo?: unknown;
  servicio?: unknown;
  mensaje?: unknown;
  privacidad?: unknown;
  sitio_web?: unknown;
};

type FieldErrors = Partial<
  Record<
    "nombre" | "correo" | "servicio" | "mensaje" | "privacidad",
    string
  >
>;

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_MAX = 5;

function limitReached(key: string) {
  const now = Date.now();
  const entry = rateLimit.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (limitReached(ip)) {
    return NextResponse.json(
      {
        message:
          "Recibimos varios mensajes desde esta conexión. Espera unos minutos o inténtalo más tarde.",
      },
      { status: 429 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "No pudimos leer el formulario. Recarga la página e inténtalo otra vez." },
      { status: 400 }
    );
  }

  // Honeypot: real people never fill this hidden field.
  if (typeof payload.sitio_web === "string" && payload.sitio_web.trim()) {
    return NextResponse.json({ ok: true });
  }

  const nombre = text(payload.nombre, 120);
  const empresa = text(payload.empresa, 160);
  const correo = text(payload.correo, 160);
  const servicio = text(payload.servicio, 120);
  const mensaje = text(payload.mensaje, 1200);

  const errors: FieldErrors = {};
  if (nombre.length < 2) {
    errors.nombre = "Escribe tu nombre para saber con quién hablamos.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(correo)) {
    errors.correo = "Revisa el correo. Lo usaremos para responderte.";
  }
  if (mensaje.length < 12) {
    errors.mensaje =
      "Cuéntanos un poco más. Con dos o tres líneas es suficiente.";
  }
  if (payload.privacidad !== true) {
    errors.privacidad = "Necesitamos tu consentimiento para responder.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const subject = `Nuevo contacto: ${nombre}${
    empresa ? ` · ${empresa}` : ""
  }`.replace(/[\r\n]+/g, " ");

  const plain = [
    `Nombre: ${nombre}`,
    `Empresa: ${empresa || "No indicada"}`,
    `Correo: ${correo}`,
    `Servicio: ${servicio || "No indicado"}`,
    "",
    "Mensaje:",
    mensaje,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#10293b;line-height:1.6">
      <h2 style="color:#12405e;margin:0 0 16px">Nuevo mensaje desde evoluth.com</h2>
      <p style="margin:0 0 4px"><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
      <p style="margin:0 0 4px"><strong>Empresa:</strong> ${escapeHtml(
        empresa || "No indicada"
      )}</p>
      <p style="margin:0 0 4px"><strong>Correo:</strong> ${escapeHtml(correo)}</p>
      <p style="margin:0 0 16px"><strong>Servicio:</strong> ${escapeHtml(
        servicio || "No indicado"
      )}</p>
      <div style="padding:16px;border-left:3px solid #3ba7a0;background:#f3f6f8">
        ${escapeHtml(mensaje).replaceAll("\n", "<br />")}
      </div>
    </div>
  `;

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (resendKey && to && from) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: correo,
          subject,
          text: plain,
          html,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("Resend delivery failed:", response.status, detail);
        return NextResponse.json(
          {
            message:
              "No pudimos entregar el mensaje. Inténtalo otra vez en unos minutos.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({ ok: true, delivered: true });
    } catch (error) {
      console.error("Resend request failed:", error);
      return NextResponse.json(
        {
          message:
            "No pudimos entregar el mensaje. Inténtalo otra vez en unos minutos.",
        },
        { status: 502 }
      );
    }
  }

  // Local fallback: useful while the email provider is not configured. On a
  // serverless host the filesystem may be read-only, so this is best effort.
  try {
    const directory = path.join(process.cwd(), ".data");
    await mkdir(directory, { recursive: true });
    await appendFile(
      path.join(directory, "contacto.jsonl"),
      `${JSON.stringify({
        fecha: new Date().toISOString(),
        nombre,
        empresa,
        correo,
        servicio,
        mensaje,
        ip,
      })}\n`,
      "utf8"
    );
    return NextResponse.json({ ok: true, stored: true });
  } catch (error) {
    console.error("Contact fallback storage failed:", error);
    return NextResponse.json(
      {
        message:
          "El canal de contacto no está disponible en este momento. Inténtalo más tarde.",
      },
      { status: 503 }
    );
  }
}
