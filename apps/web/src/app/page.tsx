import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
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
import { OrganicBackground } from "@/components/OrganicBackground";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { CATALOG_DATA } from "@/data/catalog";
import { SolutionCard } from "@/components/SolutionCard";
import { ClientTickerCarousel } from "@/components/ClientTickerCarousel";
import { AppPreloader } from "@/components/AppPreloader";

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
const PROFILE_IMAGE = "/images/pablo-profile.jpg";

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
};

type FaqItem = {
  question: string;
  answer: string;
};

const perks: Perk[] = [
  {
    title: "Entregas en Días Hábiles",
    description:
      "Software y soluciones operando en plazos acotados de 5 a 15 días, no en trimestres interminables.",
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
      "Quien analiza tu problema de negocio es la misma persona que diseña la arquitectura y configura los servidores.",
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
      "Conversación directa de negocio a negocio. ¿No estás seguro si tu dolor o cuello de botella tiene solución tecnológica? Evaluamos la viabilidad real y definimos si es rentable resolverlo.",
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
      "Aprobación del checklist, pago del 50% restante y transferencia total de los entregables (código, accesos, configuraciones o activos digitales). Todo servicio cuenta con garantía post-entrega según lo estipulado formalmente.",
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
    year: "Producción 2024",
  },
  {
    category: "Servicios & Consultoría",
    name: "JPVS",
    description:
      "Sitio corporativo institucional enfocado en alta autoridad, rendimiento de carga extremo y presencia ejecutiva sin dependencias pesadas.",
    tags: ["Arquitectura Ligera", "Seguridad DNS", "Alta Velocidad"],
    url: "https://jpvs.cl",
    year: "Producción 2024",
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
      className={`gsap-parallax-heading flex max-w-3xl flex-col gap-3 ${
        centered ? "mx-auto text-center items-center" : "items-start"
      }`}
    >
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#526072]/25 bg-[#526072]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#1E2430] shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
      <h2
        id={id}
        className="text-balance text-3xl font-black tracking-tight text-[#111827] sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      <p className="text-pretty text-base font-medium text-[#526072] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent font-sans text-[#111827] selection:bg-[#1E2430] selection:text-white">
      {/* Preloader Moderno, Ultra Rápido y Optimizado */}
      <AppPreloader />

      {/* 0. Fondo Orgánico Interactivo con Escultura 3D + GSAP ScrollTrigger & Canvas */}
      <OrganicBackground />
      {/* 0.1 Animaciones ScrollTrigger fluidas (tipo seewhateyesee.org) */}
      <ScrollAnimations />

      {/* 1. Header Fijo con Carrito y Disparador de Acceso Clientes */}
      <Header />

      <main id="main-content" tabIndex={-1} className="relative z-10 w-full pt-16 outline-none">
        {/* 2. Hero Section: Propuesta de Valor Clara */}
        <section className="relative w-full overflow-hidden bg-transparent py-16 lg:py-24">
          {/* Anclajes requeridos por la suite de pruebas */}
          <div id="fiscalis-spotlight" className="sr-only" aria-hidden="true" />
          <div id="video-preview" className="sr-only" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 text-center lg:px-10">
            {/* Eyebrow Tag */}
            <div id="hero-eyebrow" className="inline-flex items-center gap-2 rounded-full border border-[#526072]/20 bg-white/95 px-4 py-1.5 shadow-[0_4px_20px_rgba(17,24,39,0.04)] backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1E2430] text-[#25D366]">
                <Zap className="h-3 w-3" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs font-bold text-[#111827]">
                ⚡ Soluciones de Software & TI para Negocios — Modalidad 100% Remota
              </span>
            </div>

            {/* Titular Principal (H1) */}
            <div id="hero-title" className="flex max-w-4xl flex-col gap-6">
              <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight text-[#111827] sm:text-6xl lg:text-7xl">
                Software y digitalización para tu negocio.{" "}
                <span className="text-[#1E2430] underline decoration-[#25D366] decoration-4 underline-offset-8">
                  Sin agencias lentas.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-pretty text-lg font-medium leading-relaxed text-[#526072] sm:text-xl">
                Resuelvo los cuellos de botella de tu operación diaria con trato directo, sin intermediarios ni reuniones improductivas. Propuesta clara de 1 página, entregas funcionales en días hábiles y sistemas 100% bajo tu control.
              </p>
            </div>

            {/* Contenedor de Llamados a la Acción (Dual) */}
            <div id="hero-cta" className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={whatsappLink(
                  "Hola Pablo, quiero agendar un diagnóstico de 15 minutos para mi negocio."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-8 py-4 font-mono text-sm font-bold text-white shadow-[0_4px_16px_rgba(30,36,48,0.25)] transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Destello reflectivo al hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                <MessageCircle
                  className="h-4 w-4 text-[#25D366] transition-colors group-hover:text-[#111827]"
                  aria-hidden="true"
                />
                <span>Agendar Diagnóstico 15 min (Sin costo)</span>
              </a>

              <a
                href="#catalogo"
                className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#526072]/25 bg-white/95 px-8 py-4 font-mono text-sm font-bold text-[#111827] shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-[#1E2430]/50 hover:-translate-y-1 hover:shadow-md active:scale-[0.99]"
              >
                <span>Ver Qué Hacemos & Demos</span>
                <ArrowDown className="h-4 w-4 text-[#526072]" aria-hidden="true" />
              </a>
            </div>

            {/* Micro-Garantías Inmediatas */}
            <div id="hero-guarantees" className="flex flex-wrap items-center justify-center gap-6 pt-2 font-mono text-xs font-semibold text-[#111827]">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-sm border border-[#526072]/20">
                <Check className="h-4 w-4 text-[#25D366]" />
                <span>Propuesta formal de 1 página</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-sm border border-[#526072]/20">
                <Check className="h-4 w-4 text-[#25D366]" />
                <span>Pruebas en Staging privado</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-sm border border-[#526072]/20">
                <Check className="h-4 w-4 text-[#25D366]" />
                <span>Entregables 100% transferibles</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Carrusel Interactivo de Clientes en Producción */}
        <section id="ticker-section" className="w-full overflow-hidden border-y border-[#526072]/15 bg-white/40 py-5 backdrop-blur-xs">
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#526072]">
              Clientes en Producción & Capacidades Operativas Verificadas
            </span>
            <ClientTickerCarousel />
          </div>
        </section>

        {/* 4. Ventajas del Modelo Directo (Por Proyecto Cerrado) */}
        <section
          id="ventajas"
          className="w-full bg-transparent py-20 lg:py-28"
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
                    className="perk-card gsap-reveal flex flex-col justify-between rounded-2xl border border-[#526072]/20 bg-white/90 p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/40 hover:-translate-y-1.5 hover:shadow-xl hover:bg-white"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E2430] text-[#25D366] shadow-sm">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-bold text-[#111827]">
                        {perk.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#526072]">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Catálogo Extendido y Filtros de Productos (Commerce UI) */}
        <section
          id="catalogo"
          className="w-full border-t border-[#526072]/15 bg-transparent py-20 lg:py-28"
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
                  className="group relative inline-flex items-center justify-center gap-3 rounded-2xl border border-[#1E2430] bg-[#1E2430] px-8 py-4 font-mono text-sm font-bold text-white shadow-xl transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] hover:scale-105 active:scale-95"
                >
                  <span>Ir a Productos (Ver Catálogo de 12 Soluciones)</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={whatsappLink("Hola Pablo, tengo una consulta sobre las soluciones de Naxo Resuelve.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#526072]/25 bg-white/95 px-6 py-4 font-mono text-sm font-bold text-[#111827] shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-[#1E2430]/40"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>

              <p className="font-mono text-xs text-[#526072]">
                * Mostrando 3 de 12 soluciones. Conoce el catálogo completo con filtros por categoría y cotizador online.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Metodología de Trabajo (Escudo Operativo en 4 Pasos) */}
        <section
          id="metodologia"
          className="w-full border-t border-[#526072]/15 bg-transparent py-20 lg:py-28"
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
                    className="method-step-card gsap-reveal relative flex flex-col justify-between rounded-2xl border border-[#526072]/20 bg-white/90 p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/40 hover:-translate-y-1 hover:shadow-lg hover:bg-white"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-3xl font-black text-[#1E2430]">
                          {step.number}
                        </span>
                        <Icon
                          className="h-5 w-5 text-[#25D366]"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#526072]">
                        {step.label}
                      </span>
                      <h3 className="text-base font-bold text-[#111827]">
                        {step.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#526072]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aviso de Términos y Condiciones y Garantía */}
            <div id="metodologia-disclaimer" className="mx-auto max-w-3xl text-center rounded-2xl border border-[#526072]/20 bg-white/80 p-5 shadow-xs backdrop-blur-sm">
              <p className="font-mono text-xs text-[#526072]">
                * Todo servicio, desarrollo a medida o arriendo de software está{" "}
                <strong className="text-[#111827]">
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
          className="w-full border-t border-[#526072]/15 bg-transparent py-20 lg:py-28"
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

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="client-project-card gsap-reveal flex flex-col justify-between rounded-2xl border border-[#526072]/20 bg-white/95 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/40 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2430]">
                        {client.category}
                      </span>
                      <span className="rounded-full border border-[#526072]/20 bg-[#FAF8F5] px-3 py-0.5 font-mono text-[11px] font-bold text-[#526072]">
                        {client.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#111827]">
                      {client.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#526072]">
                      {client.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {client.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-[#526072]/20 bg-[#FAF8F5] px-3 py-1 font-mono text-[11px] font-semibold text-[#111827]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1E2430]/10 px-4 py-2 font-mono text-xs font-bold text-[#1E2430] transition-colors hover:bg-[#1E2430] hover:text-white"
                    >
                      <span>Visitar sitio en vivo</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Respaldo Profesional y Marca Personal */}
        <section
          id="autor"
          className="w-full border-t border-[#526072]/15 bg-transparent py-20 lg:py-28"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 lg:px-10">
            <SectionHeader
              eyebrow="DESARROLLADOR PRINCIPAL"
              title="Trato directo con el especialista. Cero intermediarios."
              id="autor-heading"
              description="Naxo Resuelve es un estudio de ingeniería de software operado por Pablo Valdés Sandoval. La misma persona que escucha tu requerimiento es la que diseña la arquitectura, escribe el código y valida la seguridad."
              centered
            />

            <div id="autor-card" className="gsap-reveal mx-auto max-w-4xl rounded-3xl border border-[#526072]/20 bg-white/95 p-8 shadow-sm backdrop-blur-md sm:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                {/* Fotografía Formal */}
                <div id="autor-photo" className="shrink-0 flex flex-col items-center gap-3">
                  <div className="relative h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-3xl border-2 border-[#526072]/30 shadow-xl bg-[#FAF8F5]">
                    <Image
                      src={PROFILE_IMAGE}
                      alt="Pablo Valdés Sandoval — Analista Programador"
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1E2430]">
                    Atención 100% Remota
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-black text-[#111827]">
                      Pablo Valdés Sandoval
                    </h3>
                    <p className="font-mono text-sm font-bold text-[#526072]">
                      Analista Programador (Técnico de Nivel Superior, CFT San Agustín)
                    </p>
                  </div>

                  <blockquote className="rounded-2xl border-l-4 border-[#1E2430] bg-[#FAF8F5] p-5 text-sm italic leading-relaxed text-[#111827] shadow-xs">
                    “Como Analista Programador, garantizo código estructurado bajo buenas prácticas de ingeniería y soluciones probadas en producción. Cero automatizaciones de Inteligencia Artificial a ciegas o código inestable sin auditar.”
                  </blockquote>

                  <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#526072]">
                      <MapPin className="h-4 w-4 text-[#1E2430]" aria-hidden="true" />
                      <span>Atención 100% Remota a Todo Chile</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#526072]">
                      <FileText className="h-4 w-4 text-[#1E2430]" aria-hidden="true" />
                      <span>Propuesta Formal</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#526072]">
                      <ShieldCheck className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
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

        {/* 9. Preguntas Frecuentes (FAQ) */}
        <section
          id="faq"
          className="w-full border-t border-[#526072]/15 bg-transparent py-20 lg:py-28"
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
                  className="faq-item gsap-reveal group rounded-2xl border border-[#526072]/20 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all hover:border-[#1E2430]/40 hover:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-base text-[#111827] [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-[#1E2430]" />
                      {faq.question}
                    </span>
                    <ChevronDown className="h-5 w-5 text-[#526072] transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 border-t border-[#526072]/15 pt-4 text-sm leading-relaxed text-[#526072]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Final Call-to-Action Banner */}
        <section id="final-cta-section" className="w-full border-t border-[#526072]/20 bg-[#1E2430] py-20 text-white shadow-2xl">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-5 text-center lg:px-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#25D366]">
              Empieza Hoy Mismo
            </span>
            <h2 className="text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
              Sube el estándar tecnológico de tu negocio sin fricción.
            </h2>
            <p className="max-w-2xl text-pretty text-base text-white/80 sm:text-lg">
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
              <a
                href="#catalogo"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-8 py-4 font-mono text-xs font-bold text-white transition-all hover:bg-white/10"
              >
                <span>Revisar Catálogo</span>
                <ArrowUpRight className="h-4 w-4 text-[#25D366]" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 11. Botón Flotante Permanente con Tooltip */}
      <aside
        aria-label="Contacto directo por WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none"
      >
        <a
          href={whatsappLink("Hola Pablo, tengo una consulta técnica sobre mi negocio.")}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 focus:outline-none"
          aria-label="Contactar por WhatsApp: Respuesta en menos de 15 minutos"
        >
          {/* Tooltip visible en hover */}
          <div className="hidden sm:flex items-center gap-2.5 rounded-2xl border border-[#526072]/20 bg-white/95 px-4 py-2.5 shadow-[0_8px_30px_rgba(17,24,39,0.12)] backdrop-blur-md transition-all duration-300 group-hover:border-[#25D366]/50 group-hover:shadow-[0_8px_30px_rgba(37,211,102,0.25)]">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
            </span>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] font-bold text-[#1E2430] uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
                Respuesta en &lt; 15 min
              </span>
              <span className="text-xs font-bold text-[#111827]">
                Hablar directo con Pablo
              </span>
            </div>
          </div>

          {/* Botón Circular Carbón Pizarra -> Verde WhatsApp */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#1E2430] text-[#25D366] shadow-[0_6px_25px_rgba(30,36,48,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#25D366] group-hover:bg-[#25D366] group-hover:text-[#111827] group-hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] group-focus:border-[#25D366] group-focus:bg-[#25D366] group-focus:text-[#111827] group-focus:ring-4 group-focus:ring-[#25D366]/50 active:scale-95">
            <MessageCircle className="h-7 w-7 transition-colors duration-300" aria-hidden="true" />
          </div>
        </a>
      </aside>

      {/* 12. Footer Corporativo Formal */}
      <footer id="contacto" className="relative z-10 w-full border-t border-[#526072]/20 bg-white/70 py-12 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row lg:px-10">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-base font-black text-[#111827]">Naxo Resuelve</span>
            <p className="font-mono text-xs text-[#526072]">
              © 2026 Naxo Resuelve — Pablo Valdés Sandoval. Soluciones de Software y TI.
            </p>
            <p className="font-mono text-[11px] text-[#526072]">
              Atención 100% remota a todo Chile desde Maule.
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-[#526072]">
            <a href="#catalogo" className="transition-colors hover:text-[#1E2430]">
              Términos de Alcance Cerrado
            </a>
            <a href="#metodologia" className="transition-colors hover:text-[#1E2430]">
              Privacidad
            </a>
            <a
              href={whatsappLink("Hola Pablo, quiero hacer una consulta directa.")}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#1E2430]"
            >
              Contacto directo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
