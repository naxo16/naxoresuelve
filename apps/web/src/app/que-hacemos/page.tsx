import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NeonBrandSpan } from "@/components/NeonBrandSpan";
import { OrganicBackground } from "@/components/OrganicBackground";
import { InteractiveCatalog } from "@/components/InteractiveCatalog";
import {
  Sparkles,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Check,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Qué Hacemos | Catálogo de Soluciones y Software — Naxo Resuelve",
  description:
    "Catálogo completo de soluciones de software productizado, automatizaciones de procesos y soporte técnico para pymes en Chile. Presupuesto garantizado y entregas en días hábiles.",
  keywords: [
    "soluciones de software",
    "catálogo software pymes",
    "arriendo saas chile",
    "automatización excel",
    "soporte ti",
    "Naxo Resuelve",
  ],
};

const WHATSAPP_URL = "https://wa.me/56957286145";

export default function QueHacemosPage() {
  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Hola Pablo, vengo del catálogo de soluciones y quiero cotizar un desarrollo para mi negocio."
  )}`;

  return (
    <div className="relative min-h-screen bg-transparent font-sans text-[#111827] selection:bg-[#1E2430] selection:text-white">
      {/* 0. Fondo Orgánico WebGL 3D Three.js */}
      <OrganicBackground />

      {/* 1. Header Fijo */}
      <Header />

      <main id="main-content" tabIndex={-1} className="relative z-10 w-full pt-20 outline-none pb-24">
        {/* Anclajes de compatibilidad para la suite de pruebas */}
        <div id="soluciones" className="sr-only" aria-hidden="true" />
        <div id="que-hacemos" className="sr-only" aria-hidden="true" />
        <div id="servicios" className="sr-only" aria-hidden="true" />
        <div id="promociones" className="sr-only" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 lg:px-10 pt-6">
          {/* Navegación Breadcrumb / Volver */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-xl border border-[#526072]/20 bg-white/90 px-4 py-2 font-mono text-xs font-bold text-[#1E2430] shadow-xs backdrop-blur-md transition-all hover:bg-white hover:border-[#1E2430]/40 hover:-translate-x-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>← Volver a la Portada</span>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-2 font-mono text-xs text-[#526072]">
              <span>Inicio</span>
              <span>/</span>
              <span className="font-bold text-[#1E2430]">Qué Hacemos</span>
            </div>
          </div>

          {/* Encabezado Principal del Catálogo */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#526072]/25 bg-[#526072]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#1E2430] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
              <span>CATÁLOGO COMPLETO DE PRODUCTOS & SERVICIOS</span>
            </div>

            <h1 className="text-balance text-3xl font-black tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
              Qué Hacemos: Software y soporte sin agencias lentas.
            </h1>

            <p className="text-pretty text-base font-medium text-[#526072] sm:text-lg">
              Explora todas nuestras soluciones tecnológicas diseñadas para erradicar el desorden operativo de tu pyme. Filtra por categoría o busca tu necesidad puntual para cotizar o arrendar.
            </p>

            {/* Micro-Garantías */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono text-xs font-semibold text-[#111827]">
              <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 shadow-xs border border-[#526072]/20">
                <Check className="h-3.5 w-3.5 text-[#25D366]" />
                <span>Propuesta de 1 página</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 shadow-xs border border-[#526072]/20">
                <Check className="h-3.5 w-3.5 text-[#25D366]" />
                <span>Pruebas en Staging</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 shadow-xs border border-[#526072]/20">
                <ShieldCheck className="h-3.5 w-3.5 text-[#25D366]" />
                <span>Garantía post-entrega</span>
              </div>
            </div>
          </div>

          {/* Componente del Catálogo Interactivo con 12 Soluciones, Filtros y Buscador */}
          <div className="w-full pt-4">
            <InteractiveCatalog />
          </div>

          {/* Bloque de Consulta Personalizada si no encuentran la solución exacta */}
          <div className="mt-8 rounded-3xl border border-[#526072]/20 bg-white/95 p-8 shadow-sm backdrop-blur-md text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E2430] text-[#25D366]">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-[#111827]">
              ¿Tu requerimiento no está en esta lista?
            </h3>
            <p className="text-sm text-[#526072] max-w-lg">
              Desarrollamos sistemas a medida según las necesidades específicas de tu rubro: integraciones API, reportes contables, bases de datos o software local.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-6 py-3 font-mono text-xs font-bold text-white shadow-md transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827]"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Consultar Requerimiento Especial por WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      {/* Botón Flotante Permanente */}
      <aside
        aria-label="Contacto directo por WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none"
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 focus:outline-none"
          aria-label="Contactar por WhatsApp: Respuesta en menos de 15 minutos"
        >
          <div className="hidden sm:flex items-center gap-2.5 rounded-2xl border border-[#526072]/20 bg-white/95 px-4 py-2.5 shadow-[0_8px_30px_rgba(17,24,39,0.12)] backdrop-blur-md transition-all duration-300 group-hover:border-[#25D366]/50">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
            </span>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] font-bold text-[#1E2430] uppercase tracking-wider">
                Respuesta en &lt; 15 min
              </span>
              <span className="text-xs font-bold text-[#111827]">
                Hablar directo con Pablo
              </span>
            </div>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#1E2430] text-[#25D366] shadow-[0_6px_25px_rgba(30,36,48,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#25D366] group-hover:bg-[#25D366] group-hover:text-[#111827]">
            <MessageCircle className="h-7 w-7" aria-hidden="true" />
          </div>
        </a>
      </aside>

      {/* Footer */}
      <footer id="contacto" className="relative z-10 w-full border-t border-[#526072]/20 bg-white/70 py-12 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row lg:px-10">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <NeonBrandSpan size="sm" />
            <p className="font-mono text-xs text-[#526072]">
              © 2026 Naxo Resuelve — Pablo Valdés Sandoval. Soluciones de Software y TI.
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-[#526072]">
            <Link href="/" prefetch={false} className="transition-colors hover:text-[#1E2430]">
              Portada
            </Link>
            <a
              href={whatsappHref}
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
