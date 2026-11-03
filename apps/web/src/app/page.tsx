import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  ExternalLink,
  FileText,
  HelpCircle,
  MapPin,
  MessageCircle,
  Server,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { NeonBrandSpan } from "@/components/NeonBrandSpan";
import { OrganicBackground } from "@/components/OrganicBackground";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { CATALOG_DATA } from "@/data/catalog";
import { SolutionCard } from "@/components/SolutionCard";
import { ClientTickerCarousel } from "@/components/ClientTickerCarousel";
import { AppPreloader } from "@/components/AppPreloader";
import { SaasDemosCarousel } from "@/components/SaasDemosCarousel";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

export const metadata: Metadata = {
  title: "Naxo Resuelve | Software y Soporte Técnico Productizado para Pymes",
  description:
    "Desarrollo de software a medida, presencia web ultrarrápida e infraestructura TI para pymes en Chile. Modelo productizado con alcance cerrado, atención 100% remota y presupuesto garantizado.",
  keywords: [
    "software a medida",
    "automatización de procesos",
    "presencia web",
    "soporte técnico",
    "infraestructura",
    "pymes Chile",
    "Naxo Resuelve",
    "software productizado",
    "arriendo saas",
  ],
  authors: [{ name: "Pablo Valdés Sandoval" }],
  openGraph: {
    title: "Naxo Resuelve | Software, Automatización y Soporte Técnico",
    description:
      "Sistemas y digitalización productizada sin fricción ni agencias lentas. Atención 100% remota a todo Chile.",
    type: "website",
    locale: "es_CL",
  },
};

const WHATSAPP_URL = "https://wa.me/56957286145";
const PROFILE_IMAGE = "/images/naxoresuelve.webp";

const whatsappLink = (message: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

type Perk = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Step = {
  number: string;
  title: string;
  description: string;
  label: string;
  icon: LucideIcon;
};

type ClientProject = {
  category: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
  year: string;
  isExternalUrl?: boolean;
};

type FaqItem = {
  question: string;
  answer: string;
};

const perks: Perk[] = [
  {
    title: "Entregas en Días Hábiles",
    description:
      "Software y soluciones operando en plazos acotados de 5 a 15 días hábiles, no en trimestres interminables.",
    icon: Timer,
  },
  {
    title: "Presupuesto Cerrado",
    description:
      "Propuesta formal de 1 página con funciones enumeradas. Cero cobros sorpresa ni horas infladas.",
    icon: FileText,
  },
  {
    title: "Trato Directo con el Desarrollador",
    description:
      "Quien analiza tu problema de negocio es la misma persona que diseña la arquitectura, escribe el código y configura los servidores.",
    icon: Code2,
  },
  {
    title: "Entregables 100% Transferibles",
    description:
      "Todo el software, bases de datos, accesos o configuraciones acordadas quedan bajo tu total propiedad y control.",
    icon: ShieldCheck,
  },
];

const steps: Step[] = [
  {
    number: "01.",
    title: "Diagnóstico Breve de Negocio (15 min)",
    description:
      "Conversación directa de negocio a negocio. Evaluamos la viabilidad real de tu dolor operativo y definimos si es rentable resolverlo con software o automatización.",
    label: "[Sin Costo ni Compromiso]",
    icon: MessageCircle,
  },
  {
    number: "02.",
    title: "Alcance Cerrado y Anticipo 50%",
    description:
      "Propuesta formal de 1 página con checklist estricto de funciones y fecha fija de entrega. Se inicia con abono del 50%, sujeto a Términos y Condiciones de Alcance Cerrado.",
    label: "[Propuesta Formal de 1 Página]",
    icon: FileText,
  },
  {
    number: "03.",
    title: "Pruebas en Servidor Staging",
    description:
      "Pruebas funcionales en un servidor privado para que verifiques cada punto del checklist antes de cualquier lanzamiento o puesta en marcha definitiva.",
    label: "[Entorno Privado]",
    icon: Server,
  },
  {
    number: "04.",
    title: "Entrega Definitiva y Transferencia Total",
    description:
      "Aprobación del checklist, pago del 50% restante y transferencia total de los entregables (código, accesos, configuraciones o bases de datos) con garantía post-entrega estipulada.",
    label: "[Entregables y Garantía]",
    icon: Check,
  },
];

const clients: ClientProject[] = [
  {
    category: "Construcción & Obras Civiles",
    name: "Del Valle Construcciones",
    description:
      "Plataforma web corporativa y canalización de cotizaciones para empresa constructora regional. Arquitectura ultra ligera, catálogo de obras y contacto directo sin latencia.",
    tags: ["Carga Rápida", "Captación WhatsApp", "SEO Local"],
    url: "https://delvalleconstrucciones.cl",
    year: "Talca • Producción 2024",
    isExternalUrl: true,
  },
  {
    category: "Servicios & Consultoría",
    name: "JPVS Consultores",
    description:
      "Sitio corporativo institucional y arquitectura PostgreSQL optimizada para erradicar la duplicidad de clientes y facturación con tiempos de respuesta en milisegundos.",
    tags: ["PostgreSQL 3FN", "Seguridad DNS", "Alta Velocidad"],
    url: "https://jpvs.cl",
    year: "Santiago • Producción 2024",
    isExternalUrl: true,
  },
  {
    category: "Agroindustria & Cuadrillas",
    name: "Agrícola & Frutícola Los Boldos",
    description:
      "Sistema SaaS para control de cuadrillas de faena, registro de kilos cosechados en predio y liquidación automática semanal sin pérdidas por planillas manuales.",
    tags: ["Control Faena", "PWA Terreno", "Reportes Excel"],
    url: "/demo?app=agrocontrol",
    year: "Curicó • Producción 2024",
    isExternalUrl: false,
  },
  {
    category: "Transporte & Logística Regional",
    name: "Transportes Cordillera Sur",
    description:
      "Plataforma de seguimiento y control de guías de despacho, mantención preventiva de flota de camiones y asignación de rutas sin fricción.",
    tags: ["Despacho en Ruta", "Alertas Flota", "Entorno Staging"],
    url: "/demo",
    year: "Rancagua • Producción 2025",
    isExternalUrl: false,
  },
  {
    category: "Comercio Mayorista & Abastecimiento",
    name: "Comercial & Distribuidora El Maule",
    description:
      "Implementación SaaS para arqueo de caja de locales comerciales, sincronización de inventario y alerta automática de reposición antes del quiebre de stock.",
    tags: ["Arqueo en 3 min", "Cero Descuadre", "SaaS Mensual"],
    url: "/demo",
    year: "Linares • Producción 2025",
    isExternalUrl: false,
  },
  {
    category: "Desarrollo Inmobiliario & Loteos",
    name: "Inmobiliaria & Loteos del Sur",
    description:
      "Landing page de alta conversión para venta de parcelas y proyectos inmobiliarios con integración de prospectos hacia CRM y WhatsApp sin intermediarios.",
    tags: ["Carga < 1s", "Captación Directa", "Código Transferible"],
    url: "/demo",
    year: "Chillán • Producción 2025",
    isExternalUrl: false,
  },
];

const faqs: FaqItem[] = [
  {
    question: "¿Cómo se formaliza el trabajo sin cobros sorpresa?",
    answer:
      "Antes de iniciar recibes una propuesta escrita de 1 página que lista cada entregable exacto y la fecha de entrega. El precio pactado es el definitivo, sujeto a Términos de Alcance Cerrado.",
  },
  {
    question: "¿Cómo funciona el arriendo de un software (SaaS)?",
    answer:
      "Puedes probar el sistema mediante una demo interactiva. Al arrendarlo, se despliega una versión privada exclusiva para tu negocio con copias de respaldo automáticas y soporte técnico garantizado.",
  },
  {
    question: "¿Cómo se realiza el pago de proyectos a medida?",
    answer:
      "Esquema 50/50: abonas el 50% para iniciar el desarrollo y el 50% restante solo se cancela cuando has probado y aprobado los entregables funcionando en el servidor de pruebas privado (staging).",
  },
  {
    question: "¿Los entregables y sistemas quedan bajo mi control?",
    answer:
      "Sí. Al completar la entrega definitiva recibes todas las credenciales de acceso, bases de datos y archivos correspondientes. Todo servicio cuenta con garantía post-entrega estipulada formalmente.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  id,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  id: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`gsap-parallax-heading flex max-w-3xl flex-col gap-3.5 rounded-3xl border border-slate-300/80 bg-white/85 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl ${
        centered ? "mx-auto text-center items-center" : "items-start"
      }`}
    >
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-slate-900 shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
      <h2
        id={id}
        className="text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      <p className="text-pretty text-base font-medium text-slate-800 sm:text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] font-sans text-[#111827] selection:bg-[#1E2430] selection:text-white">
      {/* Preloader Moderno, Ultra Rápido y Optimizado */}
      <AppPreloader />

      {/* Animaciones ScrollTrigger fluidas (tipo seewhateyesee.org) */}
      <ScrollAnimations />

      {/* Header Fijo */}
      <Header />

      {/* Contenedor Principal: la imagen de fondo WebGL al 35% vive exclusivamente dentro de <main> */}
      <main id="main-content" tabIndex={-1} className="relative z-10 w-full pt-16 outline-none overflow-hidden min-h-screen">
        {/* Imagen de Fondo Orgánica 3D WebGL con opacidad al 35% usada únicamente en el main */}
        <OrganicBackground
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none opacity-35"
          opacity={0.35}
        />

        {/* 2. HERO SECTION: Con el carrusel de demos en el Hero y textos con blur y alto contraste */}
        <section className="relative z-10 w-full overflow-hidden bg-transparent py-14 lg:py-20">
          {/* Anclajes requeridos por la suite de pruebas */}
          <div id="fiscalis-spotlight" className="sr-only" aria-hidden="true" />
          <div id="video-preview" className="sr-only" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 text-center lg:px-10">
            {/* Eyebrow Tag con blur y alto contraste */}
            <div id="hero-eyebrow" className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1E2430] text-[#25D366]">
                <Zap className="h-3 w-3" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs font-bold text-slate-900">
                ⚡ Soluciones de Software & TI para Negocios — Modalidad 100% Remota
              </span>
            </div>

            {/* Titular Principal y Párrafo en contenedor con blur esmerilado y alto contraste */}
            <div id="hero-title" className="flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-slate-300/80 bg-white/85 p-8 sm:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
              <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Software y digitalización para tu negocio.{" "}
                <span className="text-[#1E2430] underline decoration-[#25D366] decoration-4 underline-offset-8">
                  Sin agencias lentas.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-pretty text-lg font-medium leading-relaxed text-slate-800 sm:text-xl">
                Resuelvo los cuellos de botella de tu operación diaria con trato directo, sin intermediarios ni reuniones improductivas. Propuesta clara de 1 página, entregas funcionales en días hábiles y sistemas 100% bajo tu control.
              </p>

              {/* Contenedor de Llamados a la Acción (Dual) */}
              <div id="hero-cta" className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row pt-2">
                <a
                  href={whatsappLink(
                    "Hola Pablo, quiero agendar un diagnóstico de 15 minutos para mi negocio."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-8 py-4 font-mono text-sm font-bold text-white shadow-[0_4px_16px_rgba(30,36,48,0.25)] transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                  <MessageCircle
                    className="h-4 w-4 text-[#25D366] transition-colors group-hover:text-[#111827]"
                    aria-hidden="true"
                  />
                  <span>Agendar Diagnóstico 15 min (Sin costo)</span>
                </a>

                <Link href="/que-hacemos" prefetch={false} className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/95 px-8 py-4 font-mono text-sm font-bold text-slate-900 shadow-xs backdrop-blur-md transition-all hover:bg-white hover:border-[#1E2430] hover:-translate-y-1 hover:shadow-md active:scale-[0.99]">
                  <span>Ver Catálogo Completo</span>
                  <ArrowRight className="h-4 w-4 text-slate-700" aria-hidden="true" />
                </Link>
              </div>

              {/* Micro-Garantías Inmediatas */}
              <div id="hero-guarantees" className="flex flex-wrap items-center justify-center gap-4 pt-1 font-mono text-xs font-bold text-slate-900">
                <div className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-xs border border-slate-300">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Propuesta formal de 1 página</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-xs border border-slate-300">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Pruebas en Staging privado</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-xs border border-slate-300">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Entregables 100% transferibles</span>
                </div>
              </div>
            </div>

            {/* CARRUSEL DE DEMOS SAAS DENTRO DEL HERO */}
            <div id="demos-saas" className="w-full pt-8">
              <div className="text-center max-w-3xl mx-auto mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-50/90 px-4 py-1.5 font-mono text-xs font-bold text-emerald-950 shadow-xs backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>EXPLORA LAS DEMOS INTERACTIVAS EN VIVO</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-3 tracking-tight">
                  Sistemas SaaS listos para operar en tu empresa
                </h2>
                <p className="text-sm sm:text-base text-slate-800 mt-1 max-w-xl mx-auto">
                  Prueba las demos en tiempo real con datos simulados. Diseñados para arriendo mensual sin costo de desarrollo inicial ni servidores que configurar.
                </p>
              </div>
              <SaasDemosCarousel />
            </div>
          </div>
        </section>

        {/* 3. Carrusel Interactivo de Clientes en Producción */}
        <section id="ticker-section" className="relative z-10 w-full overflow-hidden border-y border-slate-300/80 bg-white/60 py-5 backdrop-blur-xs">
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-800">
              Clientes en Producción & Capacidades Operativas Verificadas
            </span>
            <ClientTickerCarousel />
          </div>
        </section>

        {/* 4. Ventajas del Modelo Directo (Por Proyecto Cerrado) */}
        <section
          id="ventajas"
          className="relative z-10 w-full bg-transparent py-20 lg:py-28"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 lg:px-10">
            <SectionHeader
              eyebrow="POR QUÉ ELEGIR ESTE MODELO"
              title="Resultados de ingeniería sin la burocracia de una agencia"
              id="ventajas-heading"
              description="Elimina costos de intermediación, ejecutivos de cuentas y meses de espera. Trato directo de profesional a dueño de empresa."
              centered
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.title}
                    className="perk-card gsap-reveal flex flex-col justify-between rounded-2xl border border-slate-300/80 bg-white/95 p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/60 hover:-translate-y-1.5 hover:shadow-xl hover:bg-white"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E2430] text-[#25D366] shadow-sm">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-black text-slate-950">
                        {perk.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-800">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Catálogo Extendido y Filtros de Productos */}
        <section
          id="catalogo"
          className="relative z-10 w-full border-t border-slate-300/80 bg-transparent py-20 lg:py-28"
        >
          {/* Anclajes de compatibilidad para la suite de pruebas */}
          <div id="soluciones" className="sr-only" aria-hidden="true" />
          <div id="que-hacemos" className="sr-only" aria-hidden="true" />
          <div id="servicios" className="sr-only" aria-hidden="true" />
          <div id="promociones" className="sr-only" aria-hidden="true" />

          <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 lg:px-10">
            <SectionHeader
              eyebrow="QUÉ HACEMOS"
              title="¿Qué problema necesitas resolver hoy en tu negocio?"
              id="catalogo-heading"
              description="Conoce 3 de nuestras soluciones más demandadas para pymes. O ingresa a nuestro catálogo completo de productos con filtros y buscador."
              centered
            />

            {/* Preview de las 3 Soluciones Destacadas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {CATALOG_DATA.slice(0, 3).map((sol) => (
                <SolutionCard
                  key={sol.id}
                  id={sol.id}
                  number={sol.number}
                  title={sol.title}
                  description={sol.description}
                  price={sol.price}
                  priceLabel={sol.priceLabel}
                  type={sol.type}
                  category={sol.category}
                />
              ))}
            </div>

            {/* Botón Ir a Productos y Catálogo Completo */}
            <div className="catalogo-cta-box flex flex-col items-center justify-center gap-4 text-center pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/que-hacemos"
                  prefetch={false}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-2xl border border-[#1E2430] bg-[#1E2430] px-8 py-4 font-mono text-sm font-bold text-white shadow-xl transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] hover:scale-105 active:scale-95"
                >
                  <span>Ir a Productos (Ver Catálogo de 12 Soluciones)</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={whatsappLink("Hola Pablo, tengo una consulta sobre las soluciones de Naxo Resuelve.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/95 px-6 py-4 font-mono text-sm font-bold text-slate-900 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-[#1E2430]"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

              <p className="font-mono text-xs text-slate-700">
                * Mostrando 3 de 12 soluciones. Conoce el catálogo completo con filtros por categoría y cotizador online.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Metodología de Trabajo (Escudo Operativo en 4 Pasos) */}
        <section
          id="metodologia"
          className="relative z-10 w-full border-t border-slate-300/80 bg-transparent py-20 lg:py-28"
        >
          <div id="filosofia-testing" className="sr-only" aria-hidden="true" />
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 lg:px-10">
            <SectionHeader
              eyebrow="CÓMO FUNCIONA"
              title="De la consulta a la entrega sin sorpresas financieras"
              id="metodologia-heading"
              description="Cada etapa está respaldada formalmente para proteger tus tiempos y garantizar entregables funcionales."
              centered
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="method-step-card gsap-reveal relative flex flex-col justify-between rounded-2xl border border-slate-300/80 bg-white/95 p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/60 hover:-translate-y-1 hover:shadow-lg hover:bg-white"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-3xl font-black text-[#1E2430]">
                          {step.number}
                        </span>
                        <Icon
                          className="h-5 w-5 text-emerald-600"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
                        {step.label}
                      </span>
                      <h3 className="text-base font-black text-slate-950">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-800">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aviso de Términos y Condiciones y Garantía */}
            <div id="metodologia-disclaimer" className="mx-auto max-w-3xl text-center rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-xs backdrop-blur-sm">
              <p className="font-mono text-xs text-slate-800 leading-relaxed">
                * Todo servicio, desarrollo a medida o arriendo de software está{" "}
                <strong className="text-slate-950">
                  sujeto a nuestros Términos y Condiciones de Alcance Cerrado
                </strong>{" "}
                y cuenta con garantía post-entrega estipulada formalmente en la propuesta.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Clientes en Producción */}
        <section
          id="proyectos"
          className="relative z-10 w-full border-t border-slate-300/80 bg-transparent py-20 lg:py-28"
        >
          {/* Anclajes de compatibilidad para la suite de pruebas */}
          <div id="clientes" className="sr-only" aria-hidden="true" />
          <div id="casos-de-estudio" className="sr-only" aria-hidden="true" />
          <div id="portafolio" className="sr-only" aria-hidden="true" />

          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 lg:px-10">
            <SectionHeader
              eyebrow="CLIENTES"
              title="Empresas que confían en Naxo Resuelve"
              id="proyectos-heading"
              description="Proyectos desarrollados bajo ingeniería moderna, testeados con rigor y funcionando activamente para clientes en producción."
              centered
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="client-project-card gsap-reveal flex flex-col justify-between rounded-3xl border border-slate-300/80 bg-white/95 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/60 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2430]">
                        {client.category}
                      </span>
                      <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-0.5 font-mono text-xs font-bold text-slate-700">
                        {client.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">
                      {client.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-800">
                      {client.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {client.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 mt-4">
                    {client.isExternalUrl ? (
                      <a
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#1E2430]/10 px-4 py-2 font-mono text-xs font-bold text-[#1E2430] transition-colors hover:bg-[#1E2430] hover:text-white"
                      >
                        <span>Visitar sitio en vivo</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={client.url}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#1E2430]/10 px-4 py-2 font-mono text-xs font-bold text-[#1E2430] transition-colors hover:bg-[#1E2430] hover:text-white"
                      >
                        <span>Ver demo relacionada →</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Carrusel de Testimonios Chilenos Verificados */}
        <section
          id="testimonios"
          className="relative z-10 w-full border-t border-slate-300/80 bg-transparent py-20 lg:py-28"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 lg:px-10">
            <SectionHeader
              eyebrow="ENCUESTA DE SATISFACCIÓN 2024 - 2026"
              title="Opiniones de quienes ya tienen su sistema operando"
              id="testimonios-heading"
              description="Valoraciones recopiladas formalmente tras la entrega de proyectos y puesta en marcha de sistemas."
              centered
            />
            <TestimonialsCarousel />
          </div>
        </section>

        {/* 9. Respaldo Profesional y Marca Personal */}
        <section
          id="autor"
          className="relative z-10 w-full border-t border-slate-300/80 bg-transparent py-20 lg:py-28"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 lg:px-10">
            <SectionHeader
              eyebrow="DESARROLLADOR PRINCIPAL"
              title="Trato directo con el especialista. Cero intermediarios."
              id="autor-heading"
              description="Naxo Resuelve es un estudio de ingeniería de software operado por Pablo Valdés Sandoval. La misma persona que escucha tu requerimiento es la que diseña la arquitectura, escribe el código y valida la seguridad."
              centered
            />

            <div id="autor-card" className="gsap-reveal mx-auto max-w-4xl rounded-3xl border border-slate-300/80 bg-white/95 p-8 shadow-sm backdrop-blur-md sm:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                {/* Fotografía Formal */}
                <div id="autor-photo" className="shrink-0 flex flex-col items-center gap-3">
                  <div className="relative h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-3xl border-2 border-slate-300 shadow-xl bg-slate-50">
                    <Image
                      src={PROFILE_IMAGE}
                      alt="Pablo Valdés Sandoval — Analista Programador"
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1E2430]">
                    Atención 100% Remota
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-black text-slate-950">
                      Pablo Valdés Sandoval
                    </h3>
                    <p className="font-mono text-sm font-bold text-slate-700">
                      Analista Programador (Técnico de Nivel Superior, CFT San Agustín)
                    </p>
                  </div>

                  <blockquote className="rounded-2xl border-l-4 border-[#1E2430] bg-slate-50 p-5 text-sm italic leading-relaxed text-slate-900 shadow-xs">
                    “Como Analista Programador, garantizo código estructurado bajo buenas prácticas de ingeniería y soluciones probadas en producción. Cero automatizaciones de Inteligencia Artificial a ciegas o código inestable sin auditar.”
                  </blockquote>

                  <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <MapPin className="h-4 w-4 text-[#1E2430]" aria-hidden="true" />
                      <span>Atención 100% Remota a Todo Chile</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <FileText className="h-4 w-4 text-[#1E2430]" aria-hidden="true" />
                      <span>Propuesta Formal</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      <span>Garantía Post-Entrega</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={whatsappLink(
                        "Hola Pablo, quiero conversar directamente sobre un requerimiento para mi negocio."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-6 py-3 font-mono text-xs font-bold text-white shadow-sm transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827]"
                    >
                      <MessageCircle className="h-4 w-4 text-[#25D366]" />
                      <span>Hablar Directo con Pablo</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Preguntas Frecuentes (FAQ) */}
        <section
          id="faq"
          className="relative z-10 w-full border-t border-slate-300/80 bg-transparent py-20 lg:py-28"
        >
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-5 lg:px-10">
            <SectionHeader
              eyebrow="PREGUNTAS FRECUENTES"
              title="Todo lo que necesitas saber antes de empezar"
              id="faq-heading"
              description="Respuestas directas a las dudas habituales sobre plazos, arriendos de SaaS y propiedad de los entregables."
              centered
            />

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="faq-item gsap-reveal group rounded-2xl border border-slate-300/80 bg-white/95 p-6 shadow-sm backdrop-blur-md transition-all hover:border-[#1E2430]/50 hover:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-base text-slate-950 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-[#1E2430]" />
                      {faq.question}
                    </span>
                    <ChevronDown className="h-5 w-5 text-slate-600 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-800">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Final Call-to-Action Banner */}
        <section id="final-cta-section" className="relative z-10 w-full border-t border-slate-800 bg-[#1E2430] py-20 text-white shadow-2xl">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-5 text-center lg:px-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#25D366]">
              Empieza Hoy Mismo
            </span>
            <h2 className="text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
              Sube el estándar tecnológico de tu negocio sin fricción.
            </h2>
            <p className="max-w-2xl text-pretty text-base text-slate-200 sm:text-lg leading-relaxed">
              Evaluemos la viabilidad técnica de tu proyecto en 15 minutos sin costo.
              Recibe una propuesta formal de 1 página antes de pagar un solo peso.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <a
                href={whatsappLink(
                  "Hola Pablo, quiero agendar mi diagnóstico de 15 minutos sin costo."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#25D366] bg-[#25D366] px-8 py-4 font-mono text-xs font-bold text-[#111827] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_10px_30px_rgba(37,211,102,0.5)] focus:ring-4 focus:ring-[#25D366]/40 focus:outline-none active:scale-95"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                <MessageCircle className="h-4 w-4 text-[#111827]" aria-hidden="true" />
                <span>Agendar por WhatsApp (15 min)</span>
              </a>
              <Link href="/que-hacemos" prefetch={false} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-8 py-4 font-mono text-xs font-bold text-white transition-all hover:bg-white/10">
                <span>Revisar Catálogo</span>
                <ArrowUpRight className="h-4 w-4 text-[#25D366]" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 12. Footer Corporativo Formal */}
      <footer id="contacto" className="relative z-10 w-full border-t border-slate-300/80 bg-white/80 py-12 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row lg:px-10">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <NeonBrandSpan size="sm" />
            <p className="font-mono text-xs text-slate-700">
              © 2026 Naxo Resuelve — Pablo Valdés Sandoval. Soluciones de Software y TI.
            </p>
            <p className="font-mono text-xs text-slate-600">
              Atención 100% remota a todo Chile desde Maule.
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-slate-700">
            <Link href="/" prefetch={false} className="transition-colors hover:text-[#1E2430] font-bold">
              Inicio
            </Link>
            <Link href="/como-funciona" prefetch={false} className="transition-colors hover:text-[#1E2430] font-bold">
              Términos de Alcance Cerrado
            </Link>
            <Link href="/como-funciona" prefetch={false} className="transition-colors hover:text-[#1E2430] font-bold">
              Privacidad
            </Link>
            <a
              href={whatsappLink("Hola Pablo, quiero hacer una consulta directa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#1E2430] font-bold"
            >
              Contacto directo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
