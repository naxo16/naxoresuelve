import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NeonBrandSpan } from "@/components/NeonBrandSpan";
import { OrganicBackground } from "@/components/OrganicBackground";
import {
  ArrowLeft,
  MessageCircle,
  GraduationCap,
  Terminal,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Pablo Valdés Sandoval — Analista Programador | Naxo Resuelve",
  description:
    "Perfil profesional de Pablo Valdés Sandoval, Analista Programador. Desarrollo de software, arquitectura de datos y soluciones TI para pymes en Chile.",
  keywords: [
    "Pablo Valdés Sandoval",
    "Analista Programador",
    "desarrollador chile",
    "Naxo Resuelve",
  ],
};

const PROFILE_IMAGE = "/images/naxoresuelve.webp";
const WHATSAPP_URL = "https://wa.me/56957286145";

export default function SobrePabloPage() {
  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Hola Pablo, estuve leyendo tu perfil en naxoresuelve.cl y me gustaría conversar sobre un proyecto."
  )}`;

  const stack = [
    { cat: "Frontend", items: ["Next.js 16", "React 19", "TypeScript 5", "Tailwind CSS", "GSAP"] },
    { cat: "Backend & APIs", items: ["Python 3.12+", "FastAPI", "Pydantic v2", "Node.js", "REST / JSON-RPC"] },
    { cat: "Bases de Datos", items: ["PostgreSQL 16", "asyncpg", "Redis", "SQLite"] },
    { cat: "Infraestructura & DevOps", items: ["Cloudflare Workers", "Docker", "Linux Ubuntu Server", "CI/CD"] },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] font-sans text-[#111827] selection:bg-[#1E2430] selection:text-white">
      <Header />

      <main id="main-content" tabIndex={-1} className="relative z-10 w-full pt-20 outline-none pb-24 overflow-hidden min-h-screen">
        {/* Fondo Orgánico WebGL al 35% dentro de <main> */}
        <OrganicBackground
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none opacity-35"
          opacity={0.35}
        />

        {/* Anclajes de compatibilidad */}
        <div id="autor" className="sr-only" aria-hidden="true" />
        <div id="sobre-pablo" className="sr-only" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 lg:px-10 pt-6">
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
              <span className="font-mono text-xs font-bold text-[#1E2430]">Sobre Pablo</span>
            </div>
          </div>

          {/* Tarjeta de Perfil Principal con backdrop blur */}
          <div className="rounded-3xl border border-slate-300/80 bg-white/85 p-8 sm:p-12 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
              {/* Foto de Perfil */}
              <div className="relative h-48 w-48 sm:h-56 sm:w-56 shrink-0 overflow-hidden rounded-3xl border-2 border-slate-300 shadow-xl bg-slate-50">
                <Image
                  src={PROFILE_IMAGE}
                  alt="Pablo Valdés Sandoval — Analista Programador"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Datos y Trayectoria */}
              <div className="space-y-4 text-center lg:text-left flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3.5 py-1 text-xs font-bold text-[#1E2430]">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    Analista Programador — CFT San Agustín
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
                  Pablo Valdés Sandoval
                </h1>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 font-mono text-xs text-slate-700 font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    Región del Maule / Atención a Todo Chile
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-[#1E2430]" />
                    Modalidad 100% Remota
                  </span>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-slate-800 max-w-2xl pt-2">
                  Soy el creador de <strong className="text-slate-950">Naxo Resuelve</strong>. Mi enfoque combina rigor de ingeniería de software con pragmatismo de negocio: desarrollo soluciones que eliminan trabajo manual en hojas de cálculo desordenadas, automatizan cotizaciones y permiten a dueños de empresas tener visibilidad y control sobre sus operaciones.
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-slate-800 max-w-2xl">
                  A diferencia de una agencia que subcontrata a juniors o interpone ejecutivos de cuentas, cuando trabajas conmigo tienes contacto directo por WhatsApp con el desarrollador que programa y mantiene tu código.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-6 py-3 font-mono text-xs font-bold text-white shadow-md transition-all hover:bg-[#25D366] hover:text-slate-950 active:scale-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contactar Directamente por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stack Tecnológico Canónico */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-950">
              Stack Técnico Verificado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stack.map((group) => (
                <div
                  key={group.cat}
                  className="rounded-2xl border border-slate-300/80 bg-white/95 backdrop-blur-md p-6 shadow-sm"
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2430] block mb-3">
                    {group.cat}
                  </span>
                  <ul className="space-y-2">
                    {group.items.map((it) => (
                      <li key={it} className="flex items-center gap-2 text-xs text-slate-800 font-mono font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
            <Link href="/clientes" className="hover:text-[#1E2430] font-bold transition-colors">
              Clientes
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
