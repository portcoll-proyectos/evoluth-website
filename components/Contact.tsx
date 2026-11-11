"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe2,
  LoaderCircle,
  MapPin,
  Send,
} from "lucide-react";
import { serviceOptions, site } from "@/lib/content";
import SectionHead from "./SectionHead";

type FormValues = {
  nombre: string;
  empresa: string;
  correo: string;
  servicio: string;
  mensaje: string;
  privacidad: boolean;
  sitio_web: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  nombre: "",
  empresa: "",
  correo: "",
  servicio: serviceOptions[0],
  mensaje: "",
  privacidad: false,
  sitio_web: "",
};

const fieldIds: Partial<Record<keyof FormValues, string>> = {
  nombre: "nombre",
  correo: "correo",
  servicio: "servicio",
  mensaje: "mensaje",
  privacidad: "privacidad",
};

const steps = [
  {
    number: "01",
    title: "Escribes el contexto",
    body: "Qué pasa, qué se acerca y qué ya intentaste.",
  },
  {
    number: "02",
    title: "Agendamos 45 minutos",
    body: "Conversamos con quien decide.",
  },
  {
    number: "03",
    title: "Recibes prioridades",
    body: "Tres ejes y una ruta inicial.",
  },
];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.nombre.trim().length < 2) {
    errors.nombre = "Escribe tu nombre para saber con quién hablamos.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(values.correo.trim())) {
    errors.correo = "Revisa el correo. Lo usaremos para responderte.";
  }
  if (values.mensaje.trim().length < 12) {
    errors.mensaje =
      "Cuéntanos un poco más. Con dos o tres líneas es suficiente.";
  }
  if (!values.privacidad) {
    errors.privacidad = "Necesitamos tu consentimiento para responder.";
  }
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  const update =
    (key: keyof FormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = event.target;
      const value =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setValues((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
      if (status === "error") setStatus("idle");
    };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0] as keyof FormValues;
      const id = fieldIds[firstKey];
      if (id) {
        window.requestAnimationFrame(() => {
          document.getElementById(id)?.focus();
        });
      }
      return;
    }

    setStatus("sending");
    setServerError("");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        errors?: FormErrors;
        message?: string;
      };

      if (response.ok) {
        setStatus("success");
        setValues(initialValues);
        return;
      }

      if (response.status === 422 && payload.errors) {
        setErrors(payload.errors);
        setStatus("idle");
        return;
      }

      setServerError(
        payload.message ??
          "No pudimos enviar el mensaje. Revisa tu conexión e inténtalo otra vez."
      );
      setStatus("error");
    } catch {
      setServerError(
        "No pudimos enviar el mensaje. Revisa tu conexión e inténtalo otra vez."
      );
      setStatus("error");
    }
  };

  return (
    <section className="contact" id="contacto">
      <div className="container">
        <SectionHead index="07" label="Contacto" />

        <div className="contact-heading">
          <h2 data-reveal>Cuéntanos qué está en juego.</h2>
          <p data-reveal>
            Un diagnóstico inicial de 45 minutos para ordenar el problema y
            decidir el siguiente paso. Sin costo.
          </p>
        </div>

        <div className="contact-card" data-reveal>
          <div className="contact-form-panel">
            {status === "success" ? (
              <div
                className="contact-success"
                ref={successRef}
                tabIndex={-1}
                role="status"
              >
                <span className="contact-success-icon" aria-hidden="true">
                  <CheckCircle2 size={28} strokeWidth={1.5} />
                </span>
                <h3>Mensaje recibido.</h3>
                <p>
                  Revisaremos tu contexto y te responderemos en un día laborable.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStatus("idle")}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <>
                <div className="contact-form-head">
                  <p className="contact-form-eyebrow">Escríbenos</p>
                  <h3>Empecemos por lo esencial.</h3>
                  <p>Cuéntanos el contexto.</p>
                </div>

                <form className="contact-form" onSubmit={onSubmit} noValidate>
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="nombre">Nombre y apellido</label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        autoComplete="name"
                        placeholder="Tu nombre"
                        value={values.nombre}
                        onChange={update("nombre")}
                        aria-invalid={Boolean(errors.nombre)}
                        aria-describedby={
                          errors.nombre ? "nombre-error" : undefined
                        }
                        required
                      />
                      {errors.nombre ? (
                        <p className="field-error" id="nombre-error">
                          {errors.nombre}
                        </p>
                      ) : null}
                    </div>

                    <div className="field">
                      <label htmlFor="empresa">
                        Empresa <span className="field-optional">Opcional</span>
                      </label>
                      <input
                        id="empresa"
                        name="empresa"
                        type="text"
                        autoComplete="organization"
                        placeholder="Nombre de la organización"
                        value={values.empresa}
                        onChange={update("empresa")}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="correo">Correo corporativo</label>
                      <input
                        id="correo"
                        name="correo"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="nombre@empresa.com"
                        value={values.correo}
                        onChange={update("correo")}
                        aria-invalid={Boolean(errors.correo)}
                        aria-describedby={
                          errors.correo ? "correo-error" : undefined
                        }
                        required
                      />
                      {errors.correo ? (
                        <p className="field-error" id="correo-error">
                          {errors.correo}
                        </p>
                      ) : null}
                    </div>

                    <div className="field">
                      <label htmlFor="servicio">Servicio de interés</label>
                      <div className="select-wrap">
                        <select
                          id="servicio"
                          name="servicio"
                          value={values.servicio}
                          onChange={update("servicio")}
                        >
                          {serviceOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <div className="field-label-row">
                      <label htmlFor="mensaje">Qué está pasando</label>
                      <span className="field-counter">
                        {values.mensaje.length} / 1200
                      </span>
                    </div>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={5}
                      maxLength={1200}
                      placeholder="El contexto, la urgencia y qué has intentado hasta ahora."
                      value={values.mensaje}
                      onChange={update("mensaje")}
                      aria-invalid={Boolean(errors.mensaje)}
                      aria-describedby={
                        errors.mensaje ? "mensaje-error" : undefined
                      }
                      required
                    />
                    {errors.mensaje ? (
                      <p className="field-error" id="mensaje-error">
                        {errors.mensaje}
                      </p>
                    ) : null}
                  </div>

                  <div className="hp-field" aria-hidden="true">
                    <label htmlFor="sitio_web">Sitio web</label>
                    <input
                      id="sitio_web"
                      name="sitio_web"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.sitio_web}
                      onChange={update("sitio_web")}
                    />
                  </div>

                  <div className="form-consent">
                    <label className="checkbox">
                      <input
                        id="privacidad"
                        name="privacidad"
                        type="checkbox"
                        checked={values.privacidad}
                        onChange={update("privacidad")}
                        aria-invalid={Boolean(errors.privacidad)}
                        aria-describedby={
                          errors.privacidad ? "privacidad-error" : undefined
                        }
                        required
                      />
                      <span className="checkbox-box" aria-hidden="true" />
                      <span>
                        Acepto la{" "}
                        <Link
                          href="/privacidad"
                          target="_blank"
                          rel="noreferrer"
                        >
                          política de privacidad
                        </Link>{" "}
                        y el uso de mis datos para responder esta consulta.
                      </span>
                    </label>
                    {errors.privacidad ? (
                      <p className="field-error" id="privacidad-error">
                        {errors.privacidad}
                      </p>
                    ) : null}
                  </div>

                  {status === "error" && serverError ? (
                    <div className="form-alert" role="alert">
                      <AlertCircle
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      <p>{serverError}</p>
                    </div>
                  ) : null}

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="spin"
                            aria-hidden="true"
                          />
                          Enviando mensaje…
                        </>
                      ) : (
                        <>
                          Enviar mensaje
                          <Send size={16} strokeWidth={2} aria-hidden="true" />
                        </>
                      )}
                    </button>
                    <p>
                      Tu información se usa solo para responder esta consulta.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>

          <aside className="contact-side">
            <div className="contact-side-head">
              <span className="contact-side-chip">Diagnóstico inicial</span>
              <p className="contact-side-eyebrow">Cómo funciona</p>
            </div>

            <ol className="contact-steps">
              {steps.map((step) => (
                <li key={step.number}>
                  <span className="contact-step-number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="contact-details">
              <span>
                <MapPin size={17} strokeWidth={1.7} aria-hidden="true" />
                {site.location}
              </span>
              <span>
                <Clock3 size={17} strokeWidth={1.7} aria-hidden="true" />
                {site.hours}
              </span>
              <span>
                <Globe2 size={17} strokeWidth={1.7} aria-hidden="true" />
                {site.coverage}
              </span>
            </div>

            <p className="contact-side-note">
              Confidencialidad desde la primera conversación.
            </p>

            <span className="contact-side-mark" aria-hidden="true" />
          </aside>
        </div>
      </div>
    </section>
  );
}
