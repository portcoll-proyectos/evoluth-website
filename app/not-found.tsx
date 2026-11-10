import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-grid" aria-hidden="true" />
      <div className="container not-found-inner">
        <Link href="/" aria-label="Evoluth, inicio" className="not-found-logo">
          <Image
            src="/brand/evoluth-wordmark-negative.png"
            alt="Evoluth"
            width={512}
            height={102}
            sizes="180px"
            priority
          />
        </Link>

        <p className="not-found-code">404</p>
        <h1>Esta página no está conectada.</h1>
        <p>
          Puede que el enlace haya cambiado o que la dirección no exista. La red
          sigue funcionando desde el inicio.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary btn-lg">
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Volver al inicio
          </Link>
          <Link href="/#contacto" className="btn btn-ghost btn-lg">
            Hablar con Evoluth
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
