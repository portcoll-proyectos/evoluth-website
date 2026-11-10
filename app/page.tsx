import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Frameworks from "@/components/Frameworks";
import Intro from "@/components/Intro";
import Services from "@/components/Services";
import Method from "@/components/Method";
import Evidence from "@/components/Evidence";
import Scenarios from "@/components/Scenarios";
import Insights from "@/components/Insights";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Frameworks />
        <Intro />
        <Services />
        <Method />
        <Evidence />
        <Scenarios />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
