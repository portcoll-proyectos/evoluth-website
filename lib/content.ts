export type ServiceIcon =
  | "radar"
  | "workflow"
  | "shield"
  | "fingerprint"
  | "scale";

export type ScenarioIcon = "calendar" | "siren" | "branch";

export type Service = {
  slug: string;
  number: string;
  title: string;
  icon: ServiceIcon;
  summary: string;
  deliverables: string[];
  outcome: string;
};

export type MethodStep = {
  number: string;
  title: string;
  lead: string;
  duration: string;
  outputs: string[];
};

export type Scenario = {
  number: string;
  icon: ScenarioIcon;
  title: string;
  body: string;
  outcome: string;
};

export type Note = {
  slug: string;
  category: string;
  date: string;
  reading: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
};

export const site = {
  name: "Evoluth",
  claim: "Riesgo, procesos y confianza.",
  description:
    "Consultoría en gestión de riesgos, procesos, seguridad de la información, protección de datos y cumplimiento. Conectamos decisiones para que tu organización crezca con control.",
  location: "Quito, Ecuador",
  hours: "Lunes a viernes · 08:30 a 18:00 (GMT-5)",
  coverage: "Ecuador y la región.",
};

export const nav = [
  { label: "Servicios", href: "#servicios" },
  { label: "Método", href: "#metodo" },
  { label: "Evidencia", href: "#evidencia" },
  { label: "Escenarios", href: "#escenarios" },
  { label: "Notas", href: "#notas" },
];

export const heroDomains = [
  { number: "01", label: "Riesgo", full: "Gestión de riesgos", slug: "riesgos" },
  {
    number: "02",
    label: "Procesos",
    full: "Procesos y operación",
    slug: "procesos",
  },
  {
    number: "03",
    label: "Seguridad",
    full: "Seguridad de la información",
    slug: "seguridad",
  },
  { number: "04", label: "Datos", full: "Protección de datos", slug: "datos" },
  {
    number: "05",
    label: "Cumplimiento",
    full: "Cumplimiento y continuidad",
    slug: "cumplimiento",
  },
];

export const frameworks = [
  "ISO 31000",
  "ISO 27001",
  "ISO 27701",
  "ISO 22301",
  "ISO 9001",
  "ISO 37301",
  "NIST CSF 2.0",
  "COBIT",
  "ITIL 4",
  "LOPDP",
];

export const services: Service[] = [
  {
    slug: "riesgos",
    number: "01",
    title: "Gestión de riesgos",
    icon: "radar",
    summary:
      "Identificamos lo que puede detener tu operación y priorizamos lo que importa.",
    deliverables: [
      "Perfil de apetito de riesgo",
      "Matriz de riesgos y controles",
      "Indicadores tempranos",
      "Planes de tratamiento",
    ],
    outcome: "Decisiones defendibles, no listas infinitas.",
  },
  {
    slug: "procesos",
    number: "02",
    title: "Procesos y operación",
    icon: "workflow",
    summary:
      "Diseñamos procesos que la gente usa y mejora sin depender de heroísmos.",
    deliverables: [
      "Mapa de procesos y responsables",
      "Fichas y procedimientos",
      "Indicadores operativos",
      "Automatización selectiva",
    ],
    outcome: "Menos excepciones, más previsibilidad.",
  },
  {
    slug: "seguridad",
    number: "03",
    title: "Seguridad de la información",
    icon: "shield",
    summary:
      "Protegemos la información con controles proporcionales al riesgo real.",
    deliverables: [
      "Diagnóstico ISO 27001",
      "SGSI, políticas y roles",
      "Gestión de accesos",
      "Respuesta a incidentes",
    ],
    outcome: "Menos exposición y una respuesta que no se improvisa.",
  },
  {
    slug: "datos",
    number: "04",
    title: "Protección de datos",
    icon: "fingerprint",
    summary:
      "Tratamos los datos personales como una decisión de negocio, no como un trámite.",
    deliverables: [
      "Inventario de tratamientos",
      "Base legal y avisos de privacidad",
      "Evaluaciones de impacto",
      "Derechos e incidentes",
    ],
    outcome: "Cumplimiento trazable y confianza de las personas.",
  },
  {
    slug: "cumplimiento",
    number: "05",
    title: "Cumplimiento y continuidad",
    icon: "scale",
    summary:
      "Preparamos a la organización para auditorías, regulación y lo inesperado.",
    deliverables: [
      "Matriz de obligaciones",
      "Auditoría interna",
      "Plan de continuidad ISO 22301",
      "Simulacros y comités",
    ],
    outcome: "Menos sorpresas, más capacidad de respuesta.",
  },
];

export const method: MethodStep[] = [
  {
    number: "01",
    title: "Diagnóstico",
    lead: "Entrevistamos, revisamos evidencia y priorizamos por impacto.",
    duration: "2 a 4 semanas",
    outputs: ["Mapa de hallazgos", "Ruta priorizada", "Criterios de éxito"],
  },
  {
    number: "02",
    title: "Diseño",
    lead: "Definimos controles, roles y decisiones con dueño y evidencia.",
    duration: "3 a 6 semanas",
    outputs: ["Modelo de control", "Matriz de responsabilidades", "Plan de implementación"],
  },
  {
    number: "03",
    title: "Implementación",
    lead: "Acompañamos la puesta en marcha y preparamos la evidencia.",
    duration: "6 a 16 semanas",
    outputs: ["Controles operando", "Políticas y procedimientos", "Tablero de seguimiento"],
  },
  {
    number: "04",
    title: "Sostenimiento",
    lead: "Instalamos ciclos de revisión y transferimos criterio al equipo.",
    duration: "Continuo",
    outputs: ["Comité de riesgo", "Ciclo de auditoría", "Plan de mejora"],
  },
];

export const dashboardDomains = [
  { name: "Riesgos", status: "En control", tone: "ok" },
  { name: "Procesos", status: "En control", tone: "ok" },
  { name: "Seguridad", status: "En revisión", tone: "warn" },
  { name: "Datos", status: "En control", tone: "ok" },
  { name: "Cumplimiento", status: "En revisión", tone: "warn" },
] as const;

export const scenarios: Scenario[] = [
  {
    number: "01",
    icon: "calendar",
    title: "La auditoría ya tiene fecha",
    body: "Los controles existen, pero la evidencia está dispersa y nadie sabe quién hace qué.",
    outcome: "Un solo expediente y responsables claros.",
  },
  {
    number: "02",
    icon: "siren",
    title: "El incidente ya ocurrió",
    body: "Un acceso indebido puso en duda la información y la respuesta se improvisó.",
    outcome: "Respuesta ensayada y aprendizaje documentado.",
  },
  {
    number: "03",
    icon: "branch",
    title: "El proceso creció sin diseño",
    body: "Más áreas, más sistemas y más excepciones. El proceso funciona por heroísmo.",
    outcome: "Un flujo medible que no depende de personas.",
  },
];

export const notes: Note[] = [
  {
    slug: "riesgo-con-criterio",
    category: "Riesgo",
    date: "Octubre 2026",
    reading: "2 min",
    title: "El riesgo no se elimina: se elige con criterio",
    excerpt:
      "Toda organización acepta algún riesgo. El problema empieza cuando ese límite no está escrito.",
    paragraphs: [
      "Toda organización convive con riesgo. La pregunta no es cómo eliminarlo, sino cuánto está dispuesta a aceptar para avanzar.",
      "Un apetito útil no es una frase en un manual. Es una escala con ejemplos: qué riesgo aceptamos sin escalar, cuál exige comité y cuál detiene una iniciativa.",
    ],
  },
  {
    slug: "proceso-que-nadie-usa",
    category: "Procesos",
    date: "Septiembre 2026",
    reading: "2 min",
    title: "Un proceso que nadie usa es un riesgo operativo",
    excerpt:
      "Documentar un proceso es fácil. Conseguir que se ejecute bajo presión es otro trabajo.",
    paragraphs: [
      "Documentar un proceso es fácil. Conseguir que se ejecute cuando hay presión es otro trabajo. La diferencia está en el diseño.",
      "La adopción no se decreta. Se gana cuando el proceso le ahorra tiempo a quien lo ejecuta.",
    ],
  },
  {
    slug: "menos-formularios",
    category: "Datos",
    date: "Agosto 2026",
    reading: "2 min",
    title: "Protección de datos: menos formularios, más decisiones",
    excerpt:
      "Cumplir no empieza en un documento. Empieza en cada campo que decides pedir.",
    paragraphs: [
      "Muchas organizaciones empiezan revisando documentos. El problema suele estar antes: se recogen datos que no se necesitan y nadie sabe quién puede verlos.",
      "Cumplir no es llenar un registro. Es poder explicar, en una frase, por qué tratas un dato y hasta cuándo lo conservas.",
    ],
  },
];

export const serviceOptions = [
  "Aún no lo tengo claro",
  ...services.map((service) => service.title),
];
