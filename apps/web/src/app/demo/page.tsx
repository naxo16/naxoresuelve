"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkles,
  Server,
  Database,
  ShieldCheck,
  Wheat,
} from "lucide-react";

type AppType = "minierp" | "agrocontrol" | "facturasync" | "staging";

function DemoContent() {
  const searchParams = useSearchParams();
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  const queryApp = searchParams.get("app") as AppType;
  const activeApp: AppType =
    selectedApp ||
    (["minierp", "agrocontrol", "facturasync", "staging"].includes(queryApp)
      ? queryApp
      : "minierp");

  const [activeTab, setActiveTab] = useState<"caja" | "stock" | "jornales">("caja");
  const { user } = useAuth();

  const businessName = user?.name || "Empresa Demo en Staging";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111827] font-sans pb-16">
      {/* Top Banner de Sandbox */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-[#1E2430] px-5 py-3 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#25D366]">[ENTORNO SANDBOX DEMO SAAS]</span>
              <span className="hidden sm:inline text-slate-300">
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
              <span>Volver a Inicio</span>
            </Link>
            <a
              href={`https://wa.me/56957286145?text=${encodeURIComponent(
                `Hola Pablo, probé la demo de [${activeApp}] en el sandbox y me gustaría arrendar una instancia privada para mi negocio.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#25D366] px-3.5 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-white transition-colors shadow-sm"
            >
              Arrendar este Sistema
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-10 space-y-8">
        {/* Selector de Aplicaciones SaaS para Probar */}
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-300 px-3 py-1 font-mono text-xs font-bold text-[#1E2430] mb-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Demos de Software Productizado — Naxo Resuelve</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              Panel Operativo de Prueba en Vivo
            </h1>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              Selecciona una de las 4 aplicaciones SaaS para explorar sus flujos, métricas y automatizaciones reales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-300 bg-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => setSelectedApp("agrocontrol")}
              className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeApp === "agrocontrol"
                  ? "bg-[#1E2430] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950"
              }`}
            >
              AgroControl SaaS
            </button>
            <button
              type="button"
              onClick={() => setSelectedApp("facturasync")}
              className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeApp === "facturasync"
                  ? "bg-[#1E2430] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950"
              }`}
            >
              FacturaSync & 3FN
            </button>
            <button
              type="button"
              onClick={() => setSelectedApp("minierp")}
              className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeApp === "minierp"
                  ? "bg-[#1E2430] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950"
              }`}
            >
              MiniERP Pyme
            </button>
            <button
              type="button"
              onClick={() => setSelectedApp("staging")}
              className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all ${
                activeApp === "staging"
                  ? "bg-[#1E2430] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950"
              }`}
            >
              Portal Staging
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VISTA 1: AGROCONTROL SAAS (CUADRILLAS & COSECHA) */}
        {/* ======================================================== */}
        {activeApp === "agrocontrol" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Cuadrillas Activas en Terreno
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
                  14 Cuadrillas (182 Operarios)
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                  <Wheat className="h-3.5 w-3.5 text-emerald-600" />
                  <span>6 Huertos sincronizados hoy</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Kilos Cosechados (Jornada Hoy)
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-[#1E2430]">
                  3.820 Kg
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-700">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Rendimiento promedio: 21 kg/hora</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Liquidación Estimada Semanal
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
                  $3.247.000 CLP
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Planillas cuadradas al 100%</span>
                </div>
              </div>
            </div>

            {/* Tabla de Cuadrillas */}
            <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950">
                  Registro de Faena por Cuadrilla — Cosecha Cerezas / Arándanos
                </h3>
                <span className="rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 font-mono text-xs font-bold text-emerald-900 w-fit">
                  ✓ Modo Fuera de Línea Activado (PWA)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 font-mono text-slate-700">
                    <tr>
                      <th className="pb-3">Cuadrilla / Jefe</th>
                      <th className="pb-3">Huerto / Cuartel</th>
                      <th className="pb-3">Operarios</th>
                      <th className="pb-3">Kilos Pesados</th>
                      <th className="pb-3">Trato por Kilo</th>
                      <th className="pb-3 text-right">Subtotal Día</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-3 font-bold text-slate-900">Cuadrilla Los Espinos (Mario V.)</td>
                      <td className="py-3 text-slate-700">Cuartel 4B (Lapins)</td>
                      <td className="py-3 font-mono text-slate-800">18 pers.</td>
                      <td className="py-3 font-mono font-bold text-slate-900">1.420 kg</td>
                      <td className="py-3 font-mono text-slate-700">$85 / kg</td>
                      <td className="py-3 font-mono font-bold text-right text-slate-900">$120.700 CLP</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900">Cuadrilla El Boldo (Esteban R.)</td>
                      <td className="py-3 text-slate-700">Cuartel 2A (Santina)</td>
                      <td className="py-3 font-mono text-slate-800">15 pers.</td>
                      <td className="py-3 font-mono font-bold text-slate-900">1.180 kg</td>
                      <td className="py-3 font-mono text-slate-700">$85 / kg</td>
                      <td className="py-3 font-mono font-bold text-right text-slate-900">$100.300 CLP</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-slate-900">Cuadrilla La Higuera (Carlos S.)</td>
                      <td className="py-3 text-slate-700">Cuartel 1C (Sweet Heart)</td>
                      <td className="py-3 font-mono text-slate-800">16 pers.</td>
                      <td className="py-3 font-mono font-bold text-slate-900">1.220 kg</td>
                      <td className="py-3 font-mono text-slate-700">$85 / kg</td>
                      <td className="py-3 font-mono font-bold text-right text-slate-900">$103.700 CLP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 2: FACTURASYNC (POSTGRESQL 3FN & DEDUPLICACIÓN) */}
        {/* ======================================================== */}
        {activeApp === "facturasync" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Registros Auditados en Base
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
                  450.210 Reg.
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                  <Database className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Normalización 3FN completa</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Duplicidad Residual
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  0.00% (Cero)
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-700">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>1.480 colisiones resueltas</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Velocidad de Búsqueda
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                  3.8 ms
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                  <span>Índice HMAC-SHA256 indexado</span>
                </div>
              </div>
            </div>

            {/* Consola de Deduplicación y Normalización */}
            <div className="rounded-2xl border border-slate-800 bg-[#141822] text-white p-6 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MOTOR FACTURASYNC — PIPELINE ASYNC EN TIEMPO REAL</span>
                </div>
                <span className="text-slate-400 text-xs">PostgreSQL 16 · Python 3.12</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <p className="text-emerald-400">› Invocando escaneo de unicidad sobre tabla `facturas_emitidas`...</p>
                <p>› Verificación DTE Folio #4819: Detectadas 3 repeticiones con fechas 14/10/2024. Fusionando en ID canónico #4819-A.</p>
                <p>› RUT Empresa 76.819.xxx-x indexado bajo HMAC-SHA256 para estricto cumplimiento Ley 19.628 / 21.719.</p>
                <p className="text-emerald-400">› [SUCCESS] Respaldo WAL verificado. Integridad referencial 100% garantizada.</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 3: MINIERP PUNTO DE VENTA (POR DEFECTO) */}
        {/* ======================================================== */}
        {activeApp === "minierp" && (
          <div className="space-y-6">
            {/* Sub-Tabs de MiniERP */}
            <div className="flex items-center gap-2 border-b border-slate-300 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("caja")}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                  activeTab === "caja"
                    ? "bg-[#1E2430] text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-950"
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
                    : "text-slate-700 hover:text-slate-950"
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
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                Jornales & Turnos
              </button>
            </div>

            {/* Tab Caja */}
            {activeTab === "caja" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                    <span className="font-mono text-xs font-bold uppercase text-slate-700">
                      Ventas del Día (Hoy)
                    </span>
                    <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
                      $482.500 CLP
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>+18% vs sábado anterior</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                    <span className="font-mono text-xs font-bold uppercase text-slate-700">
                      Cobros Pendientes
                    </span>
                    <div className="mt-2 text-2xl sm:text-3xl font-black text-[#1E2430]">
                      $125.000 CLP
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-700">
                      <Clock className="h-3.5 w-3.5" />
                      <span>3 clientes por regularizar</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                    <span className="font-mono text-xs font-bold uppercase text-slate-700">
                      Cierre de Caja Estimado
                    </span>
                    <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950">
                      $607.500 CLP
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Descuadre: $0 CLP</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950">
                    Últimos Movimientos de Caja Registradora
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="border-b border-slate-200 font-mono text-slate-700">
                        <tr>
                          <th className="pb-3">Hora</th>
                          <th className="pb-3">Descripción</th>
                          <th className="pb-3">Medio de Pago</th>
                          <th className="pb-3 text-right">Monto</th>
                          <th className="pb-3 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="py-3 font-mono text-slate-700">14:28</td>
                          <td className="py-3 font-bold text-slate-900">Venta Mostrador #1042</td>
                          <td className="py-3 font-mono text-slate-700">Efectivo</td>
                          <td className="py-3 font-mono font-bold text-right text-slate-950">$14.500 CLP</td>
                          <td className="py-3 text-center">
                            <span className="rounded bg-emerald-100 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-900">
                              Completado
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 font-mono text-slate-700">14:15</td>
                          <td className="py-3 font-bold text-slate-900">Venta Boleta #1041</td>
                          <td className="py-3 font-mono text-slate-700">Débito Transbank</td>
                          <td className="py-3 font-mono font-bold text-right text-slate-950">$32.900 CLP</td>
                          <td className="py-3 text-center">
                            <span className="rounded bg-emerald-100 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-900">
                              Completado
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Stock */}
            {activeTab === "stock" && (
              <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950">
                      Alertas Automáticas de Reposición (Stock Crítico)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700">
                      El sistema notifica al administrador por WhatsApp antes de un quiebre de stock.
                    </p>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 font-mono text-xs font-bold text-red-800">
                    2 productos en umbral mínimo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-xl border border-red-300 bg-red-50/70 p-4">
                    <span className="font-mono text-xs font-bold uppercase text-red-800">
                      ¡Alerta de Reposición!
                    </span>
                    <h4 className="font-bold text-base text-slate-950 mt-1">Bebida Coca-Cola 1.5L</h4>
                    <div className="mt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-700">Stock Actual: 4 un.</span>
                      <span className="font-bold text-red-700">Mínimo: 24 un.</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4">
                    <span className="font-mono text-xs font-bold uppercase text-amber-800">
                      Aviso Preventivo
                    </span>
                    <h4 className="font-bold text-base text-slate-950 mt-1">Bolsas Biodegradables Medianas</h4>
                    <div className="mt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-700">Stock Actual: 15 un.</span>
                      <span className="font-bold text-amber-800">Mínimo: 50 un.</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                    <span className="font-mono text-xs font-bold uppercase text-emerald-800">
                      Stock Saludable
                    </span>
                    <h4 className="font-bold text-base text-slate-950 mt-1">Harina Especial 25kg</h4>
                    <div className="mt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-700">Stock Actual: 40 sacos</span>
                      <span className="font-bold text-emerald-700">OK</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Jornales */}
            {activeTab === "jornales" && (
              <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950">
                  Cálculo Automático de Jornales Semanales
                </h3>
                <p className="text-xs sm:text-sm text-slate-700">
                  Sin fórmulas en Excel que se desconfiguren. Ingresas los turnos y la liquidación sale en 1 segundo.
                </p>
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-slate-200 font-mono text-slate-700">
                      <tr>
                        <th className="pb-3">Colaborador</th>
                        <th className="pb-3">Días Trabajados</th>
                        <th className="pb-3">Valor Jornal</th>
                        <th className="pb-3">Bono / Kilos</th>
                        <th className="pb-3 text-right">Total a Pagar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-3 font-bold text-slate-900">Manuel González</td>
                        <td className="py-3 font-mono text-slate-800">6 días</td>
                        <td className="py-3 font-mono text-slate-800">$30.000 CLP</td>
                        <td className="py-3 font-mono text-slate-800">+$25.000 CLP</td>
                        <td className="py-3 font-mono font-bold text-right text-slate-950">
                          $205.000 CLP
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-900">Camila Soto</td>
                        <td className="py-3 font-mono text-slate-800">5 días</td>
                        <td className="py-3 font-mono text-slate-800">$32.000 CLP</td>
                        <td className="py-3 font-mono text-slate-800">—</td>
                        <td className="py-3 font-mono font-bold text-right text-slate-950">
                          $160.000 CLP
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 4: PORTAL STAGING & ENTREGA EXPRESS */}
        {/* ======================================================== */}
        {activeApp === "staging" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Estado del Servidor Staging
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  ONLINE 100%
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-700">
                  <Server className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Aislamiento por contenedor Docker</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Checklist de Entregables
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                  8 / 8 Verificados
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Listo para migración definitiva</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase text-slate-700">
                  Garantía de Alcance Cerrado
                </span>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                  $0 Sorpresas
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Pago del 50% solo contra aprobación</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950">
                Checklist Interactivo de Aprobación de Proyecto Staging
              </h3>
              <div className="space-y-3 font-medium text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-900 font-bold">Certificado TLS 1.3 y DNS Cloudflare activo</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-900 font-bold">Base de datos PostgreSQL con respaldo diario automatizado</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-900 font-bold">Pruebas de estrés y tiempos de carga inferiores a 800ms</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-900 font-bold">Transferencia de credenciales de superadministrador al cliente</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner de Garantía y Arriendo */}
        <div className="rounded-3xl border border-slate-800 bg-[#1E2430] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#25D366]">
              ¿Te sirve este software para tu negocio?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Arrienda tu versión privada lista para operar
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Incluye despliegue en servidor seguro, copias de respaldo automáticas, ajustes específicos según tu rubro y soporte técnico continuo directo con Pablo Valdés Sandoval.
            </p>
          </div>

          <a
            href={`https://wa.me/56957286145?text=${encodeURIComponent(
              `Hola Pablo, revisé el sandbox de la demo [${activeApp}] y quiero coordinar el arriendo para mi negocio.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-[#25D366] px-6 py-3.5 font-mono text-xs font-bold text-slate-950 shadow-lg transition-all hover:bg-white active:scale-95"
          >
            Coordinar Arriendo por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-mono text-xs text-slate-700">
          Cargando entorno Sandbox Demo...
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
