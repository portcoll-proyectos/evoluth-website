import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { services, site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Evoluth, inicio">
            <Image
              src="/brand/evoluth-wordmark-negative.png"
              alt="Evoluth"
              width={512}
              height={102}
              sizes="200px"
            />
          </Link>
          <p className="footer-claim">
            Riesgo, procesos y confianza para crecer con control.
          </p>
          <Link href="/#contacto" className="footer-cta">
            Agenda un diagnóstico
            <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <nav className="footer-col" aria-label="Servicios">
          <h3>Servicios</h3>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/#servicio-${service.slug}`}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Compañía">
          <h3>Compañía</h3>
          <ul>
            <li>
              <Link href="/#metodo">Método</Link>
            </li>
            <li>
              <Link href="/#evidencia">Evidencia</Link>
            </li>
            <li>
              <Link href="/#escenarios">Escenarios</Link>
            </li>
            <li>
              <Link href="/#notas">Notas</Link>
            </li>
            <li>
              <Link href="/#contacto">Contacto</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-col footer-col-contact">
          <h3>Contacto</h3>
          <p>{site.location}</p>
          <p>{site.hours}</p>
          <p>{site.coverage}</p>
          <Link href="/#contacto" className="footer-contact-link">
            Escríbenos
            <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 Evoluth. Todos los derechos reservados.</p>
        <div className="footer-bottom-links">
          <Link href="/privacidad">Política de privacidad</Link>
          <Link href="/#top">
            Volver arriba
            <ArrowUp size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
