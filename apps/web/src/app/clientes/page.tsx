import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NeonBrandSpan } from "@/components/NeonBrandSpan";
import { OrganicBackground } from "@/components/OrganicBackground";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import {
  ArrowLeft,
  MessageCircle,
  Building2,
  CheckCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Clientes & Proyectos en Producción — Naxo Resuelve",
  description:
    "Casos de éxito y software en producción verificada para pymes y empresas en Chile. Del Valle Construcciones, JPVS, Agrícola Los Boldos y plataformas operativas.",
  keywords: [
    "clientes naxo resuelve",
    "software en producción chile",
    "del valle construcciones",
    "jpvs",
    "agrícola los boldos",
    "casos de éxito ti",
    "Pablo Valdés Sandoval",
  ],
};

const WHATSAPP_URL = "https://wa.me/56957286145";

export default function ClientesPage() {
  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Hola Pablo, vi la sección de clientes y quiero evaluar un sistema similar para mi empresa."
  )}`;

  const projects = [
    {
      name: "Del Valle Construcciones",
      category: "Construcción & Obras Civiles",
      location: "Talca, Región del Maule",
      status: "En Producción",
      description:
        "Plataforma web corporativa y canalización de cotizaciones para empresa constructora regional. Arquitectura ultra ligera, catálogo de obras y contacto directo sin latencia.",
      metrics: [
        "Catálogo de obras en línea",
        "Canalización de cotizaciones directa a WhatsApp",
        "Carga rápida y optimización total",
      ],
      tech: ["Next.js 16", "Tailwind CSS", "TypeScript"],
      url: "https://delvalleconstrucciones.cl",
      isLiveUrl: true,
    },
    {
      name: "JPVS Consultores",
      category: "Consultoría & Auditoría Corporativa",
      location: "Las Condes, Santiago",
      status: "En Producción",
      description:
        "Sitio web corporativo institucional y arquitectura de base de datos normalizada para erradicar la duplicidad de clientes y facturación histórica.",
      metrics: [
        "Arquitectura de datos PostgreSQL 3FN",
        "Diseño 100% responsive ejecutivo",
        "Optimización de rendimiento y seguridad DNS",
      ],
      tech: ["Next.js", "PostgreSQL", "Tailwind CSS"],
      url: "https://jpvs.cl",
      isLiveUrl: true,
    },
    {
      name: "Agrícola & Frutícola Los Boldos",
      category: "Agroindustria & Cuadrillas",
      location: "Curicó, Región del Maule",
      status: "En Producción",
      description:
        "Sistema SaaS para control de faena, registro de asistencia de cuadrillas de temporada y cálculo automático de liquidaciones por kilo cosechado.",
      metrics: [
        "Eliminación de planillas manuales en terreno",
        "Reportes automáticos de cosecha",
        "Ahorro del 85% de tiempo administrativo",
      ],
      tech: ["FastAPI", "PostgreSQL", "Next.js", "PWA"],
      url: "/demo?app=agrocontrol",
      isLiveUrl: false,
    },
    {
      name: "Transportes Cordillera Sur",
      category: "Transporte & Logística Regional",
      location: "Rancagua, Región de O'Higgins",
      status: "En Producción",
      description:
        "Plataforma de seguimiento y control de guías de despacho, mantención de flota vehicular y asignación de viajes para choferes en ruta.",
      metrics: [
        "Control de guías de despacho centralizado",
        "Alertas preventivas de mantención",
        "Validación en staging antes de lanzamiento",
      ],
      tech: ["Next.js", "PostgreSQL", "Docker", "Tailwind"],
      url: "/demo",
      isLiveUrl: false,
    },
    {
      name: "Comercial & Distribuidora El Maule",
      category: "Comercio Mayorista & Abastecimiento",
      location: "Linares, Región del Maule",
      status: "En Producción",
      description:
        "Implementación de SaaS para arqueo de caja de locales comerciales, sincronización de existencias de bodega y alerta preventiva de quiebre de stock.",
      metrics: [
        "Arqueo ciego de caja en 3 minutos",
        "Cero descuadre en cambios de turno",
        "Soporte directo vía WhatsApp",
      ],
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
      url: "/demo",
      isLiveUrl: false,
    },
    {
      name: "Inmobiliaria & Loteos del Sur",
      category: "Desarrollo Inmobiliario & Loteos",
      location: "Chillán, Región de Ñuble",
      status: "En Producción",
      description:
        "Landing page corporativa para venta de parcelas y proyectos inmobiliarios con integración de prospectos hacia CRM y WhatsApp con alta tasa de conversión.",
      metrics: [
        "Carga ultrarrápida en menos de 1 segundo",
        "Formularios protegidos contra spam",
        "Entrega 100% transferible con código y dominio",
      ],
      tech: ["Next.js 16", "Tailwind CSS", "TypeScript"],
      url: "/demo",
      isLiveUrl: false,
    },
  ];

  return (
    <div className="relative min-h-screen bg-transparent font-sans text-[#111827] selection:bg-[#1E2430] selection:text-white">
      <OrganicBackground />
      <Header />

      <main id="main-content" tabIndex={-1} className="relative z-10 w-full pt-20 outline-none pb-24">
        {/* Anclajes de compatibilidad */}
        <div id="clientes" className="sr-only" aria-hidden="true" />
        <div id="casos-de-estudio" className="sr-only" aria-hidden="true" />
        <div id="portafolio" className="sr-only" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 lg:px-10 pt-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/95 px-4 py-2 font-mono text-xs font-bold text-[#1E2430] shadow-xs backdrop-blur-md transition-all hover:bg-white hover:border-[#1E2430] hover:-translate-x-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>← Volver a Inicio</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/que-hacemos"
                className="font-mono text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
              >
                Qué Hacemos
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-mono text-xs font-bold text-[#1E2430]">Clientes</span>
            </div>
          </div>

          {/* Encabezado Principal */}
          <div className="flex flex-col gap-4 text-center sm:text-left max-w-3xl">
            <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-slate-300 bg-white/95 px-3.5 py-1 text-xs font-bold text-[#1E2430] shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#25D366]" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Operaciones Reales en Chile
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
              Clientes en Producción & Capacidades Verificadas
            </h1>
            <p className="text-base text-slate-800 sm:text-lg leading-relaxed">
              Sistemas que funcionan todos los días procesando información crítica para empresas del sector construcción, agroindustria, logística y servicios.
            </p>
          </div>

          {/* Grid de Clientes y Proyectos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.name}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-300/80 bg-white/95 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/60 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 font-mono text-xs font-bold text-emerald-950">
                      {proj.status}
                    </span>
                    <Building2 className="h-5 w-5 text-slate-600" />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    {proj.name}
                  </h3>

                  <div className="mt-1 flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-[#1E2430]">
                      {proj.category}
                    </span>
                    <span className="text-xs text-slate-600">
                      {proj.location}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-800">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4 space-y-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-900 font-bold block">
                    Impacto Operativo:
                  </span>
                  <ul className="space-y-1.5">
                    {proj.metrics.map((metric) => (
                      <li key={metric} className="flex items-center gap-2 text-xs sm:text-sm text-slate-900 font-medium">
                        <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-100 border border-slate-300 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3">
                    {proj.isLiveUrl ? (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#1E2430] hover:text-emerald-700 transition-colors"
                      >
                        <span>Visitar sitio en producción</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <Link
                        href={proj.url}
                        className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#1E2430] hover:text-emerald-700 transition-colors"
                      >
                        <span>Probar demo relacionada →</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carrusel de Testimonios Chilenos */}
          <div className="pt-8 border-t border-slate-300/80">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
                Encuesta de Satisfacción Post-Entrega
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-3">
                Opiniones de quienes ya tienen su sistema operando
              </h2>
            </div>
            <TestimonialsCarousel />
          </div>

          {/* Bloque CTA */}
          <div className="rounded-3xl border border-slate-300 bg-white/95 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                ¿Quieres ver una demo funcional adaptada a tu rubro?
              </h3>
              <p className="text-sm text-slate-800 max-w-xl leading-relaxed">
                Te muestro en vivo un sistema de pruebas en nuestro servidor staging para que evalúes la rapidez y facilidad antes de tomar cualquier decisión.
              </p>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-6 py-3.5 font-mono text-xs font-bold text-white shadow-md transition-all hover:bg-[#25D366] hover:text-slate-950 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Solicitar Demo en Vivo</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-300/80 bg-white/80 py-10 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row lg:px-10">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <NeonBrandSpan size="sm" />
            <p className="font-mono text-xs text-slate-700">
              © 2026 Naxo Resuelve — Pablo Valdés Sandoval. Soluciones de Software y TI.
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-slate-700">
            <Link href="/" className="hover:text-[#1E2430] font-bold transition-colors">
              Inicio
            </Link>
            <Link href="/que-hacemos" className="hover:text-[#1E2430] font-bold transition-colors">
              Qué Hacemos
            </Link>
            <Link href="/como-funciona" className="hover:text-[#1E2430] font-bold transition-colors">
              Cómo Funciona
            </Link>
            <Link href="/sobre-pablo" className="hover:text-[#1E2430] font-bold transition-colors">
              Sobre Pablo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
