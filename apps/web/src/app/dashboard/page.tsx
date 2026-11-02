"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { KanbanBoard } from "@/components/KanbanBoard";
import {
  Server,
  FileText,
  ExternalLink,
  ShieldCheck,
  Download,
  Key,
  LogOut,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const clientName = user?.name || "Cliente Corporativo";
  const clientEmail = user?.email || "contacto@cliente.cl";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111827] font-sans pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#526072]/15 bg-white px-5 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xs font-bold text-[#526072] hover:text-[#1E2430] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a la Web</span>
            </Link>
            <span className="text-[#526072]/30">|</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2430]">
              [ Panel de Control Privado ]
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#111827]">{clientName}</span>
              <span className="font-mono text-[10px] text-[#526072]">{clientEmail}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#526072]/20 bg-[#FAF8F5] px-3 py-1.5 font-mono text-xs font-bold text-[#526072] hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-8 lg:px-10 space-y-10">
        {/* Banner de Bienvenida y Estado General */}
        <div className="rounded-3xl border border-[#526072]/20 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#526072]/10 px-3 py-0.5 font-mono text-xs font-bold text-[#1E2430] mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#25D366]" />
              <span>Entorno Seguro • SLA Activo</span>
            </div>
            <h1 className="text-2xl font-black text-[#111827] sm:text-3xl">
              Bienvenido a tu Espacio de Trabajo, {clientName}
            </h1>
            <p className="mt-1 text-sm text-[#526072]">
              Revisa el estado de tus sistemas arrendados, documentos contractuales y avance de ingeniería en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/56957286145?text=Hola%20Pablo,%20tengo%20una%20consulta%20técnica%20sobre%20mi%20panel%20privado."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[#1E2430] bg-[#1E2430] px-4 py-2.5 font-mono text-xs font-bold text-white shadow-sm transition-all hover:bg-[#111827]"
            >
              Soporte Técnico Directo
            </a>
          </div>
        </div>

        {/* 1. MÓDULO: Mis SaaS Arrendados */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-[#1E2430]" />
              <h2 className="text-lg font-black text-[#111827]">
                Mis Sistemas SaaS Arrendados
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-[#526072]">
              1 plataforma activa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#526072]/20 bg-white p-6 shadow-sm space-y-5 hover:border-[#1E2430]/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      🟢 Activo (Online)
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#111827]">
                    Mini ERP & Control de Caja Local
                  </h3>
                  <p className="text-xs text-[#526072]">
                    Instancia cloud privada con base de datos PostgreSQL aislada y respaldos automáticos a las 02:00 AM.
                  </p>
                </div>
                <span className="rounded-lg bg-[#526072]/15 px-2.5 py-1 font-mono text-xs font-bold text-[#1E2430]">
                  SaaS V1.4
                </span>
              </div>

              {/* Credenciales de Acceso */}
              <div className="rounded-xl border border-[#526072]/20 bg-[#FAF8F5] p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#111827]">
                  <Key className="h-3.5 w-3.5 text-[#526072]" />
                  <span>Credenciales Maestras del Servidor:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-[#526072]">
                  <div>
                    <span className="text-[10px] uppercase text-[#526072]/70 block">Host Seguro</span>
                    <span className="font-semibold text-[#111827]">app.naxoresuelve.cl/demo</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#526072]/70 block">Rol Autorizado</span>
                    <span className="font-semibold text-[#1E2430]">Super Admin (Root)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#526072]/15 pt-3">
                <span className="font-mono text-xs text-[#526072]">
                  Renovación: Mensual
                </span>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#1E2430] hover:underline"
                >
                  <span>Abrir mi sistema privado</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MÓDULO: Historial de Cotizaciones & Propuestas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#1E2430]" />
              <h2 className="text-lg font-black text-[#111827]">
                Historial de Cotizaciones & Propuestas Formales
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-[#526072]">
              Sujeto a alcance cerrado
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#526072]/20 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#526072]/15 bg-[#FAF8F5] font-mono text-[#526072]">
                  <tr>
                    <th className="py-3.5 px-4">Fecha</th>
                    <th className="py-3.5 px-4">Servicio Solicitado</th>
                    <th className="py-3.5 px-4">Monto Pactado</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#526072]/10">
                  <tr>
                    <td className="py-4 px-4 font-mono">15/10/2026</td>
                    <td className="py-4 px-4 font-bold text-[#111827]">
                      Despliegue Mini ERP & Migración de Planillas
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">$150.000 CLP</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Finalizado
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href="/images/naxoresuelve.jpg"
                        download="Propuesta_Formal_NaxoResuelve.jpg"
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#1E2430] hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Propuesta 1 Página</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-mono">28/10/2026</td>
                    <td className="py-4 px-4 font-bold text-[#111827]">
                      Bot de WhatsApp & Optimización Google Maps
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">$110.000 CLP</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-700">
                        En Staging Privado
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href="/images/naxoresuelve.jpg"
                        download="Propuesta_Formal_NaxoResuelve.jpg"
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#1E2430] hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Propuesta 1 Página</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. MÓDULO: Espacio de Trabajo / Tablero Kanban */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#111827]">
                Espacio de Trabajo / Tablero Kanban
              </h2>
              <p className="text-xs text-[#526072]">
                Visualiza el avance por etapas y colabora con hasta 5 integrantes de tu negocio.
              </p>
            </div>
          </div>

          <KanbanBoard />
        </section>
      </main>
    </div>
  );
}
