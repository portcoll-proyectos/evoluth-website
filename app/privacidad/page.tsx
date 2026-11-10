import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata Evoluth los datos personales que recibes a través del formulario de contacto y cuáles son tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link href="/" aria-label="Evoluth, inicio">
            <Image
              src="/brand/evoluth-wordmark-positive.png"
              alt="Evoluth"
              width={512}
              height={102}
              sizes="160px"
              priority
              className="legal-logo"
            />
          </Link>
          <Link href="/" className="legal-back">
            <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="legal" id="contenido">
        <div className="container legal-container">
          <p className="legal-eyebrow">Información legal</p>
          <h1>Política de privacidad</h1>
          <p className="legal-updated">
            Última actualización: 10 de noviembre de 2026
          </p>

          <div className="legal-body">
            <p>
              Esta política explica qué datos personales recibe Evoluth a
              través de este sitio, para qué los usa y cómo puedes ejercer tus
              derechos. Se aplica a la información que envías mediante el
              formulario de contacto y a los registros técnicos necesarios para
              operar el sitio.
            </p>

            <h2>1. Quién trata tus datos</h2>
            <p>
              Evoluth, con domicilio en Quito, Ecuador, actúa como responsable
              del tratamiento de los datos que se recogen en este sitio. Puedes
              contactarnos mediante el formulario de la página de inicio.
            </p>

            <h2>2. Qué datos recogemos</h2>
            <ul>
              <li>
                Datos que escribes en el formulario: nombre, empresa, correo
                corporativo, servicio de interés y mensaje.
              </li>
              <li>
                Datos técnicos de seguridad: dirección IP, fecha y hora del
                envío, necesarios para prevenir abuso y mantener la
                disponibilidad del sitio.
              </li>
              <li>
                Registros del proveedor de alojamiento, conforme a sus propias
                políticas de seguridad.
              </li>
            </ul>

            <h2>3. Para qué los usamos</h2>
            <ul>
              <li>Responder tu consulta y coordinar una conversación.</li>
              <li>
                Entender el contexto de tu organización para preparar una
                propuesta o un diagnóstico inicial.
              </li>
              <li>
                Proteger el sitio frente a envíos automatizados, fraude o uso
                indebido del formulario.
              </li>
            </ul>
            <p>
              No usamos tus datos para publicidad, perfilamiento comercial ni
              decisiones automatizadas. No vendemos ni cedemos datos personales
              a terceros con fines comerciales.
            </p>

            <h2>4. Base legal</h2>
            <p>
              Tratamos los datos del formulario con tu consentimiento, que
              otorgas al marcar la casilla correspondiente antes de enviar el
              mensaje. Puedes retirarlo en cualquier momento. El tratamiento de
              los registros técnicos se basa en el interés legítimo de mantener
              la seguridad del sitio.
            </p>

            <h2>5. Cuánto tiempo los conservamos</h2>
            <p>
              Conservamos los mensajes de contacto durante un máximo de doce
              meses desde la última interacción, salvo que exista una obligación
              legal o una relación contractual que exija un plazo distinto. Los
              registros técnicos se conservan según el plazo configurado por el
              proveedor de alojamiento.
            </p>

            <h2>6. Quién puede acceder</h2>
            <p>
              Solo el equipo de Evoluth que necesita atender tu consulta. Para
              operar el sitio usamos proveedores de alojamiento y de envío de
              correo que pueden procesar los datos por cuenta nuestra. Estos
              proveedores están sujetos a obligaciones de confidencialidad y
              seguridad.
            </p>

            <h2>7. Tus derechos</h2>
            <p>
              De acuerdo con la Ley Orgánica de Protección de Datos Personales
              del Ecuador, puedes solicitar el acceso, la rectificación, la
              actualización, la eliminación, la oposición al tratamiento, la
              portabilidad y la suspensión de tus datos. También puedes revocar
              tu consentimiento.
            </p>
            <p>
              Para ejercer estos derechos, usa el formulario de contacto,
              selecciona «Protección de datos» como servicio de interés e indica
              con claridad qué solicitud deseas realizar. Responderemos en el
              plazo que establece la normativa aplicable.
            </p>

            <h2>8. Cookies</h2>
            <p>
              Este sitio no utiliza cookies de analítica, publicidad o
              seguimiento. Solo puede emplear almacenamiento técnico necesario
              para el funcionamiento del alojamiento y la seguridad del sitio.
            </p>

            <h2>9. Seguridad</h2>
            <p>
              Aplicamos medidas técnicas y organizativas razonables para
              proteger la información: cifrado en tránsito, control de acceso,
              registro de envíos y revisión periódica de los proveedores. Si
              ocurre un incidente que afecte tus datos, lo comunicaremos
              conforme a la ley.
            </p>

            <h2>10. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política para reflejar cambios en nuestras
              prácticas o en la normativa. Publicaremos la versión vigente en
              esta página con su fecha de actualización.
            </p>

            <div className="legal-contact">
              <p>¿Tienes una duda sobre tus datos?</p>
              <Link href="/#contacto" className="btn btn-primary">
                Escríbenos
              </Link>
            </div>
          </div>

          <Link href="/" className="legal-return">
            <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
            Volver a la página de inicio
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
