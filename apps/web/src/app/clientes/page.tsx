import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NeonBrandSpan } from "@/components/NeonBrandSpan";
import { OrganicBackground } from "@/components/OrganicBackground";
import {
  ArrowLeft,
  MessageCircle,
  Building2,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Clientes & Proyectos en Producción — Naxo Resuelve",
  description:
    "Casos de éxito y software en producción verificada para pymes y empresas en Chile. Del Valle Construcciones, JPVS y plataformas web operativas.",
  keywords: [
    "clientes naxo resuelve",
    "software en producción chile",
    "del valle construcciones",
    "jpvs",
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
      status: "En Producción",
      description:
        "Sistema integral de presupuestos dinámicos, cotizaciones PDF con firma digital y control de avance de obras por partida. Reducción de 6 horas semanales en papeleo administrativo.",
      metrics: [
        "100% presupuestos digitalizados",
        "Generación automática de PDF",
        "Disponibilidad 99.9%",
      ],
      tech: ["Next.js", "FastAPI", "PostgreSQL", "Tailwind CSS"],
    },
    {
      name: "JPVS Constructora & Logística",
      category: "Transporte y Maquinaria",
      status: "En Producción",
      description:
        "Portal de gestión de flota de camiones, control de mantenimientos preventivos y monitoreo de horas máquina con alertas tempranas y panel administrativo seguro.",
      metrics: [
        "Control en tiempo real de flota",
        "Alertas preventivas de mantención",
        "Reportes ejecutivos automáticos",
      ],
      tech: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    },
    {
      name: "Plataformas Web a Medida",
      category: "Comercio & Servicios",
      status: "Demos Interactivas",
      description:
        "Soluciones productizadas de gestión de cobros, facturación con pasarelas de pago y soporte técnico remoto con SLA garantizado.",
      metrics: [
        "SLA < 15 min respuesta",
        "Cifrado de datos en reposo",
        "Soporte continuo",
      ],
      tech: ["Next.js", "Docker", "Nginx", "Linux"],
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

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 lg:px-10 pt-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#526072]/20 bg-white/90 px-4 py-2 font-mono text-xs font-bold text-[#1E2430] shadow-xs backdrop-blur-md transition-all hover:bg-white hover:border-[#1E2430]/40 hover:-translate-x-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>← Volver a la Portada</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/que-hacemos"
                className="font-mono text-xs font-bold text-[#526072] hover:text-[#1E2430] transition-colors"
              >
                Qué Hacemos
              </Link>
              <span className="text-[#526072]/30">/</span>
              <span className="font-mono text-xs font-bold text-[#1E2430]">Clientes</span>
            </div>
          </div>

          {/* Encabezado Principal */}
          <div className="flex flex-col gap-4 text-center sm:text-left max-w-3xl">
            <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-[#526072]/25 bg-white/95 px-3.5 py-1 text-xs font-bold text-[#1E2430] shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#25D366]" />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                Operaciones Reales en Chile
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
              Clientes en Producción & Capacidades Verificadas
            </h1>
            <p className="text-base text-[#526072] sm:text-lg leading-relaxed">
              Sistemas que funcionan todos los días procesando información crítica para empresas del sector construcción, logística y servicios.
            </p>
          </div>

          {/* Grid de Clientes y Proyectos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.name}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#526072]/20 bg-white/90 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/40 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1 font-mono text-[10px] font-bold text-emerald-900">
                      {proj.status}
                    </span>
                    <Building2 className="h-5 w-5 text-[#526072]" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#111827]">
                    {proj.name}
                  </h3>
                  <span className="font-mono text-xs text-[#526072] block mt-1">
                    {proj.category}
                  </span>
                  <p className="mt-4 text-xs leading-relaxed text-[#526072]">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#526072]/15 pt-4 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#1E2430] font-bold block">
                    Impacto Operativo:
                  </span>
                  <ul className="space-y-1.5">
                    {proj.metrics.map((metric) => (
                      <li key={metric} className="flex items-center gap-2 text-xs text-[#111827] font-medium">
                        <CheckCircle className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 flex flex-wrap gap-1.5">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[#FAF8F5] border border-[#526072]/20 px-2 py-0.5 font-mono text-[10px] text-[#526072]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bloque CTA */}
          <div className="rounded-3xl border border-[#526072]/20 bg-[#FAF8F5] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-black text-[#111827]">
                ¿Quieres ver una demo funcional adaptada a tu rubro?
              </h3>
              <p className="text-xs text-[#526072] max-w-xl">
                Te muestro en vivo un sistema de pruebas en nuestro servidor staging para que evalúes la rapidez y facilidad antes de tomar cualquier decisión.
              </p>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-6 py-3.5 font-mono text-xs font-bold text-white shadow-md transition-all hover:bg-[#25D366] hover:text-[#111827] active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Solicitar Demo en Vivo</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-[#526072]/20 bg-white/70 py-10 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row lg:px-10">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <NeonBrandSpan size="sm" />
            <p className="font-mono text-xs text-[#526072]">
              © 2026 Naxo Resuelve — Pablo Valdés Sandoval. Soluciones de Software y TI.
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-[#526072]">
            <Link href="/que-hacemos" className="hover:text-[#1E2430] transition-colors">
              Qué Hacemos
            </Link>
            <Link href="/como-funciona" className="hover:text-[#1E2430] transition-colors">
              Cómo Funciona
            </Link>
            <Link href="/sobre-pablo" className="hover:text-[#1E2430] transition-colors">
              Sobre Pablo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
