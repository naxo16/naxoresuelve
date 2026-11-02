"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function DemoPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"caja" | "stock" | "jornales">("caja");

  const businessName = user?.name || "Minimarket y Local Comercial Demo";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111827] font-sans pb-16">
      {/* Top Banner de Sandbox */}
      <div className="sticky top-0 z-30 border-b border-[#526072]/20 bg-[#1E2430] px-5 py-3 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#25D366]">[ENTORNO SANDBOX DEMO]</span>
              <span className="hidden sm:inline text-white/80">
                • {businessName}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-white/90 hover:text-[#25D366] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver a la Landing</span>
            </Link>
            <a
              href="https://wa.me/56957286145?text=Hola%20Pablo,%20probé%20la%20demo%20interactiva%20y%20quiero%20cotizar%20la%20versión%20privada%20para%20mi%20negocio."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#25D366] px-3 py-1 font-mono text-xs font-bold text-[#111827] hover:bg-white transition-colors"
            >
              Arrendar este Sistema
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-10 space-y-8">
        {/* Cabecera del Demo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-[#526072]/20 bg-white p-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#526072]/10 px-3 py-0.5 font-mono text-xs font-bold text-[#1E2430] mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#25D366]" />
              <span>Mini ERP Productizado — Naxo Resuelve</span>
            </div>
            <h1 className="text-2xl font-black text-[#111827] sm:text-3xl">
              Panel Operativo de Prueba en Vivo
            </h1>
            <p className="mt-1 text-sm text-[#526072]">
              Simulación funcional en tiempo real para control de caja, inventario crítico y cálculo de jornales.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[#526072]/20 bg-[#FAF8F5] p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("caja")}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === "caja"
                  ? "bg-[#1E2430] text-white shadow-sm"
                  : "text-[#526072] hover:text-[#111827]"
              }`}
            >
              Control de Caja
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("stock")}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === "stock"
                  ? "bg-[#1E2430] text-white shadow-sm"
                  : "text-[#526072] hover:text-[#111827]"
              }`}
            >
              Stock Crítico
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("jornales")}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                activeTab === "jornales"
                  ? "bg-[#1E2430] text-white shadow-sm"
                  : "text-[#526072] hover:text-[#111827]"
              }`}
            >
              Jornales & Turnos
            </button>
          </div>
        </div>

        {/* Tab 1: Control de Caja */}
        {activeTab === "caja" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#526072]/20 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-[#526072]">
                  Ventas del Día (Hoy)
                </span>
                <div className="mt-2 text-2xl font-black text-[#111827]">
                  $482.500 CLP
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-bold">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+18% vs sábado pasado</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#526072]/20 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-[#526072]">
                  Cobros Pendientes
                </span>
                <div className="mt-2 text-2xl font-black text-[#1E2430]">
                  $125.000 CLP
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-[#526072]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>3 clientes por regularizar</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#526072]/20 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-[#526072]">
                  Cierre de Caja Estimado
                </span>
                <div className="mt-2 text-2xl font-black text-[#111827]">
                  $607.500 CLP
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                  <CheckCircle className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>Descuadre: $0 CLP</span>
                </div>
              </div>
            </div>

            {/* Tabla de Movimientos */}
            <div className="rounded-2xl border border-[#526072]/20 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                Últimos Movimientos de Caja Registradora
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#526072]/15 font-mono text-[#526072]">
                    <tr>
                      <th className="pb-3">Hora</th>
                      <th className="pb-3">Concepto</th>
                      <th className="pb-3">Método</th>
                      <th className="pb-3 text-right">Monto</th>
                      <th className="pb-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#526072]/10">
                    <tr>
                      <td className="py-3 font-mono">18:42</td>
                      <td className="py-3 font-semibold">Venta Mostrador #1042</td>
                      <td className="py-3">Transbank Débito</td>
                      <td className="py-3 font-mono font-bold text-right text-emerald-600">
                        +$34.900 CLP
                      </td>
                      <td className="py-3 text-center">
                        <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          Cobrado
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono">17:15</td>
                      <td className="py-3 font-semibold">Pedido Telefónico #1041</td>
                      <td className="py-3">Transferencia</td>
                      <td className="py-3 font-mono font-bold text-right text-emerald-600">
                        +$58.000 CLP
                      </td>
                      <td className="py-3 text-center">
                        <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          Cobrado
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono">16:30</td>
                      <td className="py-3 font-semibold">Despacho Restaurant Don Pepe</td>
                      <td className="py-3">Crédito 15 días</td>
                      <td className="py-3 font-mono font-bold text-right text-[#1E2430]">
                        $85.000 CLP
                      </td>
                      <td className="py-3 text-center">
                        <span className="rounded bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-700">
                          Pendiente
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Stock Crítico */}
        {activeTab === "stock" && (
          <div className="rounded-2xl border border-[#526072]/20 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Alertas Automáticas de Reposición (Stock Crítico)
                </h3>
                <p className="text-xs text-[#526072]">
                  El sistema envía un aviso por correo o WhatsApp cuando el stock baja del umbral mínimo.
                </p>
              </div>
              <span className="rounded-full bg-red-100 px-3 py-1 font-mono text-xs font-bold text-red-700">
                2 productos por agotar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                <span className="font-mono text-[10px] font-bold uppercase text-red-700">
                  ¡Alerta Urgente!
                </span>
                <h4 className="font-bold text-sm text-[#111827] mt-1">Bebida Coca-Cola 1.5L</h4>
                <div className="mt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#526072]">Stock Actual: 4 un.</span>
                  <span className="font-bold text-red-600">Mínimo: 24 un.</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <span className="font-mono text-[10px] font-bold uppercase text-amber-700">
                  Aviso Preventivo
                </span>
                <h4 className="font-bold text-sm text-[#111827] mt-1">Bolsas Biodegradables Medianas</h4>
                <div className="mt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#526072]">Stock Actual: 15 un.</span>
                  <span className="font-bold text-amber-700">Mínimo: 50 un.</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#526072]/20 bg-[#FAF8F5] p-4">
                <span className="font-mono text-[10px] font-bold uppercase text-emerald-700">
                  Stock Saludable
                </span>
                <h4 className="font-bold text-sm text-[#111827] mt-1">Harina Especial 25kg</h4>
                <div className="mt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#526072]">Stock Actual: 40 sacos</span>
                  <span className="font-bold text-emerald-600">OK</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Jornales y Turnos */}
        {activeTab === "jornales" && (
          <div className="rounded-2xl border border-[#526072]/20 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
              Cálculo Automático de Jornales Semanales
            </h3>
            <p className="text-xs text-[#526072]">
              Sin fórmulas en Excel que se desconfiguren. Ingresas los turnos y la liquidación sale en 1 segundo.
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#526072]/15 font-mono text-[#526072]">
                  <tr>
                    <th className="pb-3">Colaborador</th>
                    <th className="pb-3">Días Trabajados</th>
                    <th className="pb-3">Valor Jornal</th>
                    <th className="pb-3">Bono / Kilos</th>
                    <th className="pb-3 text-right">Total a Pagar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#526072]/10">
                  <tr>
                    <td className="py-3 font-bold">Manuel González</td>
                    <td className="py-3 font-mono">6 días</td>
                    <td className="py-3 font-mono">$30.000 CLP</td>
                    <td className="py-3 font-mono">+$25.000 CLP</td>
                    <td className="py-3 font-mono font-bold text-right text-[#111827]">
                      $205.000 CLP
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold">Camila Soto</td>
                    <td className="py-3 font-mono">5 días</td>
                    <td className="py-3 font-mono">$32.000 CLP</td>
                    <td className="py-3 font-mono">—</td>
                    <td className="py-3 font-mono font-bold text-right text-[#111827]">
                      $160.000 CLP
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Banner de Garantía y Arriendo */}
        <div className="rounded-3xl border border-[#526072]/20 bg-[#1E2430] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#25D366]">
              ¿Te sirve este software para tu local o negocio?
            </span>
            <h3 className="text-2xl font-black text-white">
              Arrienda tu versión privada desde $100.000 CLP / mes
            </h3>
            <p className="text-xs text-white/80 max-w-xl">
              Incluye despliegue en servidor seguro, copias de respaldo diarias, ajustes de catálogo según tu negocio y soporte técnico continuo directo con Pablo Valdés Sandoval.
            </p>
          </div>

          <a
            href="https://wa.me/56957286145?text=Hola%20Pablo,%20revisé%20el%20sandbox%20de%20la%20demo%20y%20quiero%20arrendar%20el%20Mini%20ERP%20para%20mi%20negocio."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-[#25D366] px-6 py-3.5 font-mono text-xs font-bold text-[#111827] shadow-lg transition-all hover:bg-white"
          >
            Coordinar Arriendo por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
