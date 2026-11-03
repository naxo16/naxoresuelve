import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NeonBrandSpan } from "@/components/NeonBrandSpan";
import { OrganicBackground } from "@/components/OrganicBackground";
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo Funciona | Metodología Ágil y Garantías — Naxo Resuelve",
  description:
    "Metodología de desarrollo de software en 4 fases sin burocracia: Diagnóstico rápido, alcance cerrado, staging privado y traspaso a producción garantizado.",
  keywords: [
    "metodología desarrollo software",
    "desarrollo web chile",
    "software a medida pymes",
    "staging privado",
    "garantía software",
    "Naxo Resuelve",
  ],
};

const WHATSAPP_URL = "https://wa.me/56957286145";

export default function ComoFuncionaPage() {
  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Hola Pablo, leí la metodología de trabajo en naxoresuelve.cl y quiero agendar el diagnóstico de 15 minutos."
  )}`;

  const steps = [
    {
      num: "01",
      title: "Diagnóstico Rápido (15 min)",
      desc: "Conversamos por videollamada o WhatsApp directo. Sin presentaciones ejecutivas vacías: me cuentas el problema operativo que te frena y definimos el objetivo técnico puntual.",
      badge: "Sin Costo",
      deliverable: "Checklist de requerimientos y viabilidad",
    },
    {
      num: "02",
      title: "Propuesta de Alcance Cerrado",
      desc: "Recibes una propuesta formal de 1 página con precio fijo, plazo de entrega garantizado y entregables exactos. Cero cobros sorpresivos ni tarifas por hora infladas.",
      badge: "Presupuesto Fijo",
      deliverable: "Contrato de servicio y cronograma de hitos",
    },
    {
      num: "03",
      title: "Despliegue en Staging Privado",
      desc: "Construyo tu solución y te habilito un servidor de pruebas aislado (staging.tudominio.cl) con credenciales exclusivas. Pruebas el sistema con datos reales antes de lanzarlo.",
      badge: "Entorno Seguro",
      deliverable: "Acceso interactivo previo a producción",
    },
    {
      num: "04",
      title: "Paso a Producción y Garantía",
      desc: "Migración limpia a tu dominio definitivo con SSL, respaldos automatizados, capacitación en video de 5 minutos y garantía de soporte técnico directo por 30 a 90 días.",
      badge: "100% Operativo",
      deliverable: "Código fuente, documentación y soporte",
    },
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
        <div id="metodologia" className="sr-only" aria-hidden="true" />
        <div id="filosofia-testing" className="sr-only" aria-hidden="true" />

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
              <span className="font-mono text-xs font-bold text-[#1E2430]">Cómo Funciona</span>
            </div>
          </div>

          {/* Encabezado Principal con backdrop blur */}
          <div className="flex flex-col gap-4 text-center sm:text-left max-w-3xl rounded-3xl border border-slate-300/80 bg-white/85 p-6 sm:p-8 shadow-sm backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-slate-300 bg-white/95 px-3.5 py-1 text-xs font-bold text-[#1E2430] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#25D366]" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Metodología Predictible y Sin Fricción
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Cómo Trabajamos: De la Idea al Despliegue en 4 Fases
            </h1>
            <p className="text-base text-slate-800 sm:text-lg leading-relaxed">
              Elimino la burocracia de las agencias tradicionales. Tratas directamente con el ingeniero que diseña, programa y despliega tu software.
            </p>
          </div>

          {/* Tarjetas de Fases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-300/80 bg-white/95 backdrop-blur-md p-8 shadow-sm transition-all duration-300 hover:border-[#1E2430]/60 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-[#1E2430]/60 group-hover:text-[#1E2430] transition-colors">
                    {step.num}
                  </span>
                  <span className="rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 font-mono text-xs font-bold text-emerald-950">
                    {step.badge}
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="text-xl font-black text-slate-950">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-800">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4 flex items-center gap-2 font-mono text-xs text-[#1E2430]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Entregable: {step.deliverable}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bloque de Garantías y Testing */}
          <div className="rounded-3xl border border-slate-800 bg-[#1E2430] text-white p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Garantía Blindada
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Cero Riesgo para tu Empresa
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Si el software desplegado en Staging no cumple las especificaciones acordadas en la propuesta de alcance cerrado, se corrigen sin ningún costo adicional.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <Server className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Infraestructura Aislada
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Staging Real Antes de Lanzar
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Nunca tocamos tu operación en vivo sin validar. Toda solución corre en un clúster de prueba seguro donde realizas pruebas piloto con tu equipo.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <Lock className="h-5 w-5" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Privacidad y Ley 19.628 / 21.719
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Criptografía y Datos Seguros
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Contratos con cláusula de confidencialidad estricta (NDA), contraseñas con PBKDF2 y bases de datos con cifrado en reposo.
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#25D366]" />
                <span className="font-mono text-xs text-slate-200 font-semibold">
                  Respuesta a consultas en menos de 15 minutos en días hábiles.
                </span>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#25D366] bg-[#25D366] px-6 py-3 font-mono text-xs font-bold text-[#111827] shadow-lg transition-all hover:bg-white active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Agendar Diagnóstico 15 min</span>
              </a>
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
            <Link href="/clientes" className="hover:text-[#1E2430] font-bold transition-colors">
              Clientes
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
