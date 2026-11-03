"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  CheckCircle2,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import { TESTIMONIALS_DATA } from "@/data/testimonials";

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = TESTIMONIALS_DATA.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Rotación automática cada 6.5 segundos si no está pausado
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <div
      className="relative w-full max-w-5xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner de Verificación de Encuesta */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50/90 px-4 py-1.5 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-mono text-xs font-bold text-emerald-950">
            Encuesta de Satisfacción Post-Entrega • 100% Clientes Satisfechos
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-800">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/90 px-2.5 py-1 text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
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
      </div>

      {/* Tarjeta Principal de Testimonio */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-300/80 bg-white p-7 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(30,36,48,0.06)] transition-all duration-300">
        {/* Fondo decorativo con comilla translúcida */}
        <Quote className="pointer-events-none absolute right-6 top-6 h-28 w-28 text-slate-100 sm:h-36 sm:w-36 -z-0" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Fila Superior: Estrellas + Tag + Score */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-amber-400 text-amber-500 drop-shadow-xs"
                  aria-hidden="true"
                />
              ))}
              <span className="ml-2 font-mono text-xs font-black text-slate-900">
                5.0 / 5.0
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 border border-slate-300 px-3 py-1 font-mono text-xs font-bold text-slate-800">
                {current.tag}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 font-mono text-xs font-bold text-emerald-900">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                <span>{current.satisfactionScore}</span>
              </span>
            </div>
          </div>

          {/* Cita Textual Chilena */}
          <blockquote className="text-pretty text-lg font-medium leading-relaxed text-slate-900 sm:text-xl md:text-2xl">
            “{current.quote}”
          </blockquote>

          {/* Separador de alto contraste */}
          <div className="h-px w-full bg-slate-200" />

          {/* Información del Cliente & Proyecto */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar con Iniciales */}
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#1E2430] text-white font-mono text-base font-bold shadow-md">
                {current.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-black text-slate-950">
                    {current.name}
                  </h4>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                    title="Identidad y entrega auditada"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Verificado</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {current.role} • <strong className="text-slate-900">{current.company}</strong>
                </p>
                <div className="flex items-center gap-3 pt-0.5 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    <span>{current.city}</span>
                  </span>
                  <span>•</span>
                  <span>{current.date}</span>
                </div>
              </div>
            </div>

            {/* Solución Entregada */}
            <div className="sm:text-right flex flex-col sm:items-end">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Solución Desarrollada:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1E2430] bg-slate-100 px-3 py-1 rounded-lg border border-slate-300 mt-1 inline-block">
                {current.project}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Navegación del Carrusel */}
      <div className="mt-6 flex items-center justify-between px-2">
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Ver testimonio anterior"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-800 shadow-sm transition-all hover:bg-[#1E2430] hover:text-white hover:border-[#1E2430] hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Indicadores de Punto (Dots) */}
        <div className="flex items-center gap-2">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Ir al testimonio de ${item.name} (${idx + 1} de ${total})`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-[#1E2430]"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Ver siguiente testimonio"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-800 shadow-sm transition-all hover:bg-[#1E2430] hover:text-white hover:border-[#1E2430] hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
