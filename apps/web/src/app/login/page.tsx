"use client";

import Link from "next/link";
import { AuthUI } from "@/components/AuthUI";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111827] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-[#526072]/15 bg-white/80 backdrop-blur-md px-5 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs font-bold text-[#526072] hover:text-[#1E2430] transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver a Naxo Resuelve</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#1E2430]">
              Portal Clientes & SaaS
            </span>
            <span className="hidden sm:inline-block rounded-full bg-[#25D366]/20 border border-[#25D366]/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-900">
              Ley 19.628 / 21.719
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Copy de Valor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2430]/5 border border-[#1E2430]/15 text-xs font-bold text-[#1E2430] uppercase font-mono">
              <ShieldCheck className="h-4 w-4 text-[#25D366]" />
              <span>Acceso Seguro a Sistemas</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight leading-tight">
              Ingresa a tu entorno de software y telemetría
            </h1>

            <p className="text-sm text-[#526072] leading-relaxed">
              Monitorea tus SaaS arrendados, avances de entregables en servidores staging privados y tareas del tablero operativo.
            </p>

            <div className="space-y-3 pt-2">
              <div className="rounded-2xl border border-[#526072]/20 bg-white p-4 flex items-start gap-3 shadow-xs">
                <Sparkles className="h-5 w-5 text-[#25D366] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">
                    Sin Cláusulas Ocultas
                  </h4>
                  <p className="text-[11px] text-[#526072] mt-0.5">
                    Toda la información y entregables permanecen bajo tu estricto control legal y técnico.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta con AuthUI */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#526072]/20 bg-white p-6 sm:p-8 shadow-xl">
              <AuthUI />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
