"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Server,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { SAAS_DEMOS_DATA, SaasAppDemo } from "@/data/saasDemos";

const WHATSAPP_URL = "https://wa.me/56957286145";

export function SaasDemosCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = SAAS_DEMOS_DATA.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const current: SaasAppDemo = SAAS_DEMOS_DATA[currentIndex];

  const whatsappInquiryUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(
    `Hola Pablo, estuve viendo la demo de [${current.name}] en naxoresuelve y me gustaría cotizar su arriendo/implementación para mi negocio.`
  )}`;

  return (
    <div
      className="relative w-full max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Selector Superior de Apps (Mini Tabs Interactivas con backdrop blur) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SAAS_DEMOS_DATA.map((app, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`shrink-0 flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all backdrop-blur-md ${
                  isSelected
                    ? "bg-[#1E2430] text-white shadow-md scale-102"
                    : "bg-white/90 text-slate-700 border border-slate-300/80 hover:border-[#1E2430]/60 hover:bg-white"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? "bg-[#25D366] animate-pulse" : "bg-slate-400"
                  }`}
                />
                <span>{app.name}</span>
              </button>
            );
          })}
        </div>

        {/* Control Auto-play con backdrop blur */}
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300/80 bg-white/90 backdrop-blur-md px-3 py-1.5 font-mono text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
          title={isPaused ? "Reanudar auto-avance" : "Pausar auto-avance"}
        >
          {isPaused ? (
            <>
              <Play className="h-3 w-3 text-emerald-600" />
              <span>Pausado</span>
            </>
          ) : (
            <>
              <Pause className="h-3 w-3 text-slate-600" />
              <span>Auto ({currentIndex + 1}/{total})</span>
            </>
          )}
        </button>
      </div>

      {/* Tarjeta Principal del SaaS Demo con backdrop blur */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-300/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(30,36,48,0.1)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Columna Izquierda: Información, Beneficios y CTAs (7 cols) */}
          <div className="p-7 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              {/* Badges y Categoría */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-slate-100 border border-slate-300 px-3 py-1 font-mono text-xs font-bold text-slate-800">
                  {current.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 font-mono text-xs font-bold text-emerald-900">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>{current.statusBadge}</span>
                </span>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                  {current.pricingMonthly}
                </span>
              </div>

              {/* Titular del SaaS */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
                  {current.name}
                </h3>
                <p className="font-mono text-xs sm:text-sm font-bold text-emerald-800">
                  {current.tagline}
                </p>
              </div>

              {/* Descripción clara y legible */}
              <p className="text-sm sm:text-base leading-relaxed text-slate-800">
                {current.description}
              </p>

              {/* Puntos Clave de la Solución */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {current.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Stack Tecnológico */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600">
                  Stack:
                </span>
                {current.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Fila de Acciones: Demo Directa + Arriendo WhatsApp */}
            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {current.isExternal ? (
                <a
                  href={current.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-6 py-3 font-mono text-xs font-bold text-white shadow-md transition-all hover:bg-[#25D366] hover:border-[#25D366] hover:text-slate-950 hover:scale-102 active:scale-98"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Ver Demo en Vivo (Subdominio)</span>
                </a>
              ) : (
                <Link
                  href={current.demoUrl}
                  prefetch={false}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-6 py-3 font-mono text-xs font-bold text-white shadow-md transition-all hover:bg-[#25D366] hover:border-[#25D366] hover:text-slate-950 hover:scale-102 active:scale-98"
                >
                  <Sparkles className="h-4 w-4 text-[#25D366] group-hover:text-slate-950" />
                  <span>Probar Demo Interactiva</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-mono text-xs font-bold text-slate-900 shadow-xs transition-all hover:border-[#25D366] hover:bg-emerald-50 hover:text-emerald-950"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Arrendar / Consultar</span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Vista Previa Simulada de la Aplicación (5 cols) */}
          <div className="bg-[#141822] p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 text-white">
            {/* Cabecera del Navegador Simulado */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-xs text-slate-400 truncate max-w-[200px]">
                  {current.targetSubdomain.replace("https://", "")}
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Métricas en Pantalla de la Demo */}
              <div className="rounded-2xl border border-slate-800 bg-[#1c2230] p-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    {current.metric.label}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">
                    {current.metric.value}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500/60" />
              </div>

              {/* Simulación de Líneas de Operación en Tiempo Real */}
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-[#0f131a] p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] text-slate-400 font-bold uppercase">
                  <span>{current.previewDetails.badgeStatus}</span>
                  <Server className="h-3.5 w-3.5 text-slate-500" />
                </div>

                <div className="pt-1 flex flex-col gap-1.5">
                  <div className="text-emerald-400 font-bold text-sm">
                    {current.previewDetails.statNumber}
                  </div>
                  <div className="text-slate-300 text-xs">
                    {current.previewDetails.statLabel}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-1 border-t border-slate-800/60">
                  {current.previewDetails.mockLines.map((line, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-emerald-500 font-bold">›</span>
                      <span className="truncate">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pie de la maqueta con indicación de subdominio listo */}
            <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Instancia Aislada Staging</span>
              </span>
              <span className="text-emerald-400 font-bold">PostgreSQL 3FN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles Inferiores (Flechas y Dots) */}
      <div className="mt-6 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Ver aplicación SaaS anterior"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300/80 bg-white/90 backdrop-blur-md text-slate-800 shadow-sm transition-all hover:bg-[#1E2430] hover:text-white hover:border-[#1E2430] hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {SAAS_DEMOS_DATA.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Ir a demo de ${item.name} (${idx + 1} de ${total})`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-[#1E2430]"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Ver siguiente aplicación SaaS"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300/80 bg-white/90 backdrop-blur-md text-slate-800 shadow-sm transition-all hover:bg-[#1E2430] hover:text-white hover:border-[#1E2430] hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
