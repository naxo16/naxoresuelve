"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface TickerItem {
  id: string;
  name: string;
  status: string;
  isLive?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    id: "item-1",
    name: "DEL VALLE CONSTRUCCIONES",
    status: "En producción",
    isLive: true,
  },
  {
    id: "item-2",
    name: "JPVS CONSULTORES",
    status: "En producción",
    isLive: true,
  },
  {
    id: "item-3",
    name: "AGRÍCOLA LOS BOLDOS",
    status: "En producción",
    isLive: true,
  },
  {
    id: "item-4",
    name: "TRANSPORTES CORDILLERA SUR",
    status: "En producción",
    isLive: true,
  },
  {
    id: "item-5",
    name: "COMERCIAL EL MAULE",
    status: "En producción",
    isLive: true,
  },
  {
    id: "item-6",
    name: "INMOBILIARIA DEL SUR",
    status: "En producción",
    isLive: true,
  },
  {
    id: "item-7",
    name: "SISTEMAS WEB A MEDIDA",
    status: "Entrega Garantizada",
    isLive: false,
  },
  {
    id: "item-8",
    name: "DEMOS INTERACTIVAS SAAS",
    status: "Sandbox en Vivo",
    isLive: true,
  },
  {
    id: "item-9",
    name: "PLATAFORMAS EN STAGING PRIVADO",
    status: "Entorno Privado",
    isLive: false,
  },
  {
    id: "item-10",
    name: "ATENCIÓN DIRECTA A TODO CHILE",
    status: "100% Remoto",
    isLive: false,
  },
];

export function ClientTickerCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Duplicar ítems para scroll continuo
  const carouselItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  // Auto-scroll continuo a 60 FPS
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animId: number;
    const speed = 0.85;

    const step = () => {
      if (!isPaused && !isDragging && container) {
        container.scrollLeft += speed;

        const singleSetWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSetWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isDragging]);

  const scrollManual = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const shift = 280;
    container.scrollBy({
      left: direction === "right" ? shift : -shift,
      behavior: "smooth",
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!scrollContainerRef.current) return;
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (!scrollContainerRef.current) return;
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleMouseUpOrLeave();
      }}
    >
      {/* Botón Flecha Izquierda */}
      <button
        type="button"
        onClick={() => scrollManual("left")}
        aria-label="Desplazar carrusel hacia la izquierda"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-800 shadow-md backdrop-blur-md transition-all hover:bg-[#1E2430] hover:text-white hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Degradado de Desvanecimiento Izquierdo */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#FAF8F5]/95 via-[#FAF8F5]/40 to-transparent sm:w-24" />

      {/* Riel Deslizable del Carrusel */}
      <div
        ref={scrollContainerRef}
        role="region"
        aria-label="Carrusel de proyectos y clientes"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollManual("left");
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollManual("right");
          }
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex items-center gap-4 overflow-x-auto py-2 px-12 scrollbar-none focus:outline-none focus:ring-1 focus:ring-[#1E2430]/30 rounded-xl ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {carouselItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="group shrink-0 flex items-center gap-2.5 rounded-full border border-slate-300/80 bg-white/95 px-4 py-2 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/50 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Punto de estado activo */}
            <span className="relative flex h-2 w-2 shrink-0">
              {item.isLive && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  item.isLive ? "bg-[#25D366]" : "bg-slate-500"
                }`}
              />
            </span>

            {/* Nombre del Cliente / Capacidad */}
            <span className="font-mono text-xs font-black tracking-tight text-slate-900 group-hover:text-[#1E2430] transition-colors whitespace-nowrap">
              {item.name}
            </span>

            {/* Etiqueta de Estado */}
            <span className="rounded-full bg-slate-100 border border-slate-300 px-2 py-0.5 font-mono text-xs font-bold text-slate-800 whitespace-nowrap">
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Degradado de Desvanecimiento Derecho */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#FAF8F5]/95 via-[#FAF8F5]/40 to-transparent sm:w-24" />

      {/* Botón Flecha Derecha */}
      <button
        type="button"
        onClick={() => scrollManual("right")}
        aria-label="Desplazar carrusel hacia la derecha"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-800 shadow-md backdrop-blur-md transition-all hover:bg-[#1E2430] hover:text-white hover:scale-105 active:scale-95"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Indicador de Pausa / Auto-scroll */}
      <div className="mt-1 flex items-center justify-center gap-1.5 font-mono text-xs text-slate-700">
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex items-center gap-1 hover:text-slate-950 transition-colors font-medium"
          title={isPaused ? "Reanudar desplazamiento" : "Pausar desplazamiento"}
        >
          {isPaused ? (
            <>
              <Play className="h-3 w-3 text-emerald-600" />
              <span>Pausado • Clic para reanudar</span>
            </>
          ) : (
            <>
              <Pause className="h-3 w-3" />
              <span>Arrastra o usa las flechas para navegar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
