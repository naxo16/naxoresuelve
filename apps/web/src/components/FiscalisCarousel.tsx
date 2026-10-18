"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Database,
  Camera,
  KeyRound,
  MapPin,
  ExternalLink,
  Flame,
} from "lucide-react";

interface FiscalisSlide {
  id: string;
  badge: string;
  title: string;
  qaSeverity: "CRÍTICO" | "ALTO" | "RESUELTO" | "ARQUITECTURA";
  problem: string;
  solution: string;
  metrics: string;
  icon: typeof ShieldCheck;
  highlight: string;
}

const FISCALIS_SLIDES: FiscalisSlide[] = [
  {
    id: "draft-inmortal",
    badge: "QA Testing: Continuidad Operativa",
    title: "Mecanismo 'Draft Inmortal' & Resurrección ante Camera Crash",
    qaSeverity: "ALTO",
    problem:
      "Al abrir la cámara nativa en celulares con gestión agresiva de memoria (ej. Vivo, Xiaomi con Funtouch OS), el sistema operativo cerraba el proceso (Activity Death), reiniciando la app y perdiendo todo el acta de infracción redactada.",
    solution:
      "Se implementó persistencia en tiempo real atada a listeners en controladores de texto con SharedPreferences + recuperación de fotos huérfanas mediante 'retrieveLostData' y memoria 'largeHeap'. Al reabrir, el formulario se repuebla al 100% en menos de 1 segundo.",
    metrics: "0% pérdida de datos ante reinicio forzado por RAM. Recuperación instantánea.",
    icon: Camera,
    highlight: "SharedPreferences Real-Time + largeHeap + retrieveLostData",
  },
  {
    id: "soft-lock",
    badge: "Criptografía & Resiliencia RF-017",
    title: "Soft Lock Criptográfico & Refinamiento del Kill Switch",
    qaSeverity: "ALTO",
    problem:
      "El diseño inicial ejecutaba un borrado duro de la base de datos SQLCipher tras 5 fallos de PIN sin conexión, representando un riesgo fatal de destruir actas rurales legítimas aún no sincronizadas.",
    solution:
      "Se rediseñó a un 'Soft Lock': ante 5 fallos la base de datos se congela criptográficamente en RAM sin destruir registros, exigiendo reconexión o PIN de supervisor con hash SHA-256. El borrado destructivo solo se ejecuta por orden explícita del backend con HTTP 403 Forbidden.",
    metrics: "Protección total de actas desconectadas. Cero pérdida accidental.",
    icon: KeyRound,
    highlight: "SQLCipher + Freeze Criptográfico en RAM + Hash SHA-256 Supervisor",
  },
  {
    id: "lifecycle-mfa",
    badge: "Seguridad de Acceso RFC 6238",
    title: "Blindaje contra Lifecycle Bypass en Authy / TOTP MFA",
    qaSeverity: "CRÍTICO",
    problem:
      "Minimizando repetidamente la aplicación y restaurándola en menos de 60 segundos, un atacante podía burlar la pantalla de bloqueo de sesión aprovechando una sobreescritura de timestamps en memoria.",
    solution:
      "Se condicionó el inicio del temporizador a la bandera estricta '!_isLocked', con limpieza forzada del controlador de texto del código TOTP y destrucción de variables temporales al registrar desbloqueo legítimo.",
    metrics: "100% de intentos de bypass bloqueados. Sesión protegida bajo estándar RFC 6238.",
    icon: ShieldCheck,
    highlight: "Condicional !_isLocked + Destrucción de memoria temporal",
  },
  {
    id: "postgres-gin",
    badge: "Backend & Base de Datos",
    title: "Auditoría JSONB Instantánea con Índice GIN en PostgreSQL",
    qaSeverity: "ARQUITECTURA",
    problem:
      "La verificación histórica de actas y trazabilidad de funcionarios revocados sobrecargaba las consultas en juzgados de policía local al auditar metadatos no relacionales.",
    solution:
      "Diseño normalizado en 3FN en PostgreSQL con indexación GIN especializada sobre el campo 'auditoria_jsonb' ('CREATE INDEX idx_registros_base_auditoria ON registros_base USING gin (auditoria_jsonb);') + FastAPI asíncrono.",
    metrics: "Consultas de auditoría legal resueltas en <15ms con carga pesada.",
    icon: Database,
    highlight: "PostgreSQL 3FN + GIN Indexing en JSONB + FastAPI asyncpg",
  },
  {
    id: "gps-ppu",
    badge: "Operativa en Vía Pública",
    title: "Georreferenciación Satelital Automática & Búsqueda PPU",
    qaSeverity: "RESUELTO",
    problem:
      "Disputas legales por coordenadas imprecisas en citaciones y hasta 72 horas de demora analógica trasladando actas en papel entre la calle, la comisaría y el juzgado.",
    solution:
      "Captura de coordenadas satelitales en 1 toque con estampado de metadatos inmutables en fotografías tomadas en terreno y validación de patente vehicular instantánea.",
    metrics: "Reducción del tiempo de procedimiento de ~12 minutos a <90 segundos.",
    icon: MapPin,
    highlight: "Georreferenciación GPS + Hashing de evidencia + Trazabilidad en terreno",
  },
];

export function FiscalisCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const total = FISCALIS_SLIDES.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const slide = FISCALIS_SLIDES[currentIndex];
  const Icon = slide.icon;

  const severityColors = {
    CRÍTICO: "bg-red-950/80 text-red-300 border-red-700/60",
    ALTO: "bg-amber-950/80 text-amber-300 border-amber-700/60",
    ARQUITECTURA: "bg-emerald-950/80 text-emerald-300 border-emerald-700/60",
    RESUELTO: "bg-[#721828]/60 text-[#f2cf6b] border-[#cba135]/40",
  };

  return (
    <div
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      className="relative w-full max-w-5xl mx-auto bg-[#0a0c10] border-2 border-[#cba135]/50 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden text-white"
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#721828]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cba135]/15 blur-[100px] pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#232a3b] mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#721828] to-[#9e233b] text-[#f2cf6b] border border-[#cba135]/40 shadow-inner">
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#f2cf6b] uppercase">
                Fiscalis SGF · Módulos & Hallazgos QA
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${severityColors[slide.qaSeverity]}`}
              >
                {slide.qaSeverity}
              </span>
            </div>
            <span className="text-xs text-slate-300 font-medium">
              Aseguramiento de Calidad y Pruebas Extremas en Terreno
            </span>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#f2cf6b] font-bold text-sm">
            0{currentIndex + 1}
          </span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">0{total}</span>
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 space-y-6 min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#cba135] font-semibold mb-2">
            <Icon size={16} />
            <span>{slide.badge}</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-sm">
            {slide.title}
          </h3>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#141822] border border-red-900/40">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
              Fallo de Sistema Detectado en QA:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {slide.problem}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#141822] border border-[#cba135]/40">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f2cf6b] block mb-1">
              Ingeniería Aplicada (Pablo Valdés):
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {slide.solution}
            </p>
          </div>
        </div>

        {/* Metrics & Highlight Footer of Slide */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#721828]/40 via-[#141822] to-[#0a0c10] border border-[#232a3b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Métrica de Validación:
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              ✓ {slide.metrics}
            </span>
          </div>
          <div className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#0a0c10] text-[#f2cf6b] border border-[#cba135]/30">
            {slide.highlight}
          </div>
        </div>
      </div>

      {/* Controls & Dots */}
      <div className="mt-8 pt-4 border-t border-[#232a3b] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {FISCALIS_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir al módulo ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-[#cba135]"
                  : "w-2 bg-[#232a3b] hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Anterior hallazgo"
            className="p-2.5 rounded-xl bg-[#141822] hover:bg-[#721828] text-white border border-[#232a3b] hover:border-[#cba135]/50 transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Siguiente hallazgo"
            className="p-2.5 rounded-xl bg-[#141822] hover:bg-[#721828] text-white border border-[#232a3b] hover:border-[#cba135]/50 transition-all cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
