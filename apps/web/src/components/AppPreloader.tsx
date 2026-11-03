"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function AppPreloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);

  // Inicializar estrictamente en false para paridad 100% entre SSR y cliente
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, cerrar de inmediato tras la hidratación
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => {
        setIsDone(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("appPreloaderDone"));
        }
      });
      return;
    }

    const container = containerRef.current;
    const counter = counterRef.current;
    const lineProgress = lineProgressRef.current;
    const logoBox = logoBoxRef.current;

    if (!container || !counter || !lineProgress || !logoBox) return;

    const countObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("appPreloaderDone"));
        }
      },
    });

    // 1. Conteo rápido y barra de progreso (0% a 100% en 550ms)
    tl.to(countObj, {
      val: 100,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        if (counter) {
          counter.textContent = `${Math.floor(countObj.val)}%`;
        }
      },
    })
      .to(
        lineProgress,
        {
          width: "100%",
          duration: 0.55,
          ease: "power2.out",
        },
        "<"
      )
      // 2. Micro-pulso de logo
      .to(logoBox, {
        scale: 1.05,
        duration: 0.15,
        ease: "power1.out",
        yoyo: true,
        repeat: 1,
      })
      // 3. Salida cinemática: Cortina moderna que se eleva hacia arriba
      .to(container, {
        yPercent: -100,
        duration: 0.65,
        ease: "power4.inOut",
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (isDone) return null;

  return (
    <aside
      ref={containerRef}
      aria-label="Cargando entorno de Naxo Resuelve"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] text-[#111827] select-none"
    >
      <div className="relative flex flex-col items-center gap-6 px-6">
        {/* Monograma de Ingeniería con pulso de estado */}
        <div
          ref={logoBoxRef}
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[#526072]/20 bg-white shadow-xl"
        >
          {/* Anillo de carga perimetral en verde esmeralda */}
          <div className="absolute -inset-1 rounded-2xl border-2 border-[#25D366]/40 animate-pulse" />

          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xl font-black tracking-tight text-[#1E2430]">
              NR
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#25D366]">
              ENGINEERING
            </span>
          </div>
        </div>

        {/* Título de Marca y Estado */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-base font-black tracking-tight text-[#111827]">
            Naxo Resuelve
          </span>
          <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-[#526072]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-ping" />
            <span>Iniciando Entorno de Software</span>
          </div>
        </div>

        {/* Barra de Carga Ultra-Limpia */}
        <div className="w-56 space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#526072]/15">
            <div
              ref={lineProgressRef}
              className="h-full w-0 rounded-full bg-gradient-to-r from-[#1E2430] via-[#526072] to-[#25D366]"
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] text-[#526072]">
            <span>MODALIDAD 100% REMOTA</span>
            <span ref={counterRef} className="font-bold text-[#1E2430]">
              0%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
