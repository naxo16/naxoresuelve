"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Type,
  Eye,
  X,
  Settings,
  Sparkles,
  RotateCcw,
  Info,
} from "lucide-react";

type TextScale = "normal" | "large" | "xlarge";

interface ReadingItem {
  id: string;
  label: string;
  selector: string;
  customText?: string;
}

const READING_SEQUENCE: ReadingItem[] = [
  {
    id: "hero-title",
    label: "Titular Principal",
    selector: "h1",
  },
  {
    id: "hero-desc",
    label: "Propuesta de Valor",
    selector: "main section p",
  },
  {
    id: "fiscalis-spotlight",
    label: "Fiscalis: Aplicación en Terreno",
    selector: "#fiscalis-spotlight",
  },
  {
    id: "soluciones",
    label: "Catálogo de Soluciones",
    selector: "#soluciones h2, #soluciones p",
  },
  {
    id: "casos",
    label: "Casos de Estudio & Pruebas Rudas",
    selector: "#casos h2",
  },
  {
    id: "filosofia-testing",
    label: "Manifiesto de Testing Rudo",
    selector: "#filosofia-testing h2, #filosofia-testing p",
  },
  {
    id: "contacto",
    label: "Contacto & Diagnóstico",
    selector: "#contacto h2, #contacto p",
  },
];

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [textScale, setTextScale] = useState<TextScale>("normal");
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Estados de lectura en voz alta
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeHighlightedElement = useRef<HTMLElement | null>(null);

  // Cargar preferencias guardadas
  useEffect(() => {
    try {
      const savedScale = localStorage.getItem("naxoresuelve_text_scale") as TextScale;
      if (savedScale && ["normal", "large", "xlarge"].includes(savedScale)) {
        setTextScale(savedScale);
        applyTextScale(savedScale);
      }

      const savedContrast = localStorage.getItem("naxoresuelve_high_contrast") === "true";
      if (savedContrast) {
        setIsHighContrast(true);
        document.documentElement.classList.add("high-contrast");
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const applyTextScale = (scale: TextScale) => {
    document.documentElement.classList.remove("text-scale-large", "text-scale-xlarge");
    if (scale === "large") {
      document.documentElement.classList.add("text-scale-large");
    } else if (scale === "xlarge") {
      document.documentElement.classList.add("text-scale-xlarge");
    }
  };

  const handleScaleChange = (scale: TextScale) => {
    setTextScale(scale);
    applyTextScale(scale);
    try {
      localStorage.setItem("naxoresuelve_text_scale", scale);
    } catch {
      // ignore
    }
    announceStatus(`Tamaño de texto ajustado a: ${scale === "normal" ? "Normal" : scale === "large" ? "Grande (+125%)" : "Extra Grande (+150%)"}`);
  };

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (next) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    try {
      localStorage.setItem("naxoresuelve_high_contrast", String(next));
    } catch {
      // ignore
    }
    announceStatus(next ? "Modo alto contraste forzado activado." : "Modo alto contraste desactivado.");
  };

  const announceStatus = (msg: string) => {
    setStatusMessage(msg);
  };

  // Limpiar resaltado visual
  const clearHighlight = () => {
    if (activeHighlightedElement.current) {
      activeHighlightedElement.current.classList.remove("reading-highlight");
      activeHighlightedElement.current = null;
    }
  };

  // Detener completamente la lectura
  const stopReading = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    clearHighlight();
    setIsReading(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    announceStatus("Lectura en voz alta detenida.");
  }, []);

  // Leer un elemento específico por índice
  const readStep = useCallback(
    (index: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        announceStatus("Tu navegador no soporta la síntesis de voz nativa.");
        return;
      }

      window.speechSynthesis.cancel();
      clearHighlight();

      if (index >= READING_SEQUENCE.length) {
        stopReading();
        announceStatus("Lectura completa de la página finalizada.");
        return;
      }

      const item = READING_SEQUENCE[index];
      const el = document.querySelector<HTMLElement>(item.selector);

      let textToRead = "";
      if (item.customText) {
        textToRead = item.customText;
      } else if (el) {
        textToRead = el.innerText || el.textContent || "";
      }

      if (!textToRead.trim()) {
        // Saltar al siguiente si está vacío
        readStep(index + 1);
        return;
      }

      // Resaltar visualmente el elemento
      if (el) {
        el.classList.add("reading-highlight");
        activeHighlightedElement.current = el;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setCurrentStepIndex(index);
      setIsReading(true);
      setIsPaused(false);
      announceStatus(`Leyendo: ${item.label}`);

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "es-CL";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Buscar voz en español disponible
      const voices = window.speechSynthesis.getVoices();
      const esVoice = voices.find((v) => v.lang.startsWith("es"));
      if (esVoice) utterance.voice = esVoice;

      utterance.onend = () => {
        clearHighlight();
        // Avanzar automáticamente al siguiente bloque
        readStep(index + 1);
      };

      utterance.onerror = (e) => {
        // Ignorar interrupciones intencionales
        if (e.error !== "interrupted" && e.error !== "canceled") {
          clearHighlight();
          setIsReading(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [stopReading]
  );

  const startReading = () => {
    announceStatus("Iniciando lectura en voz alta del contenido principal...");
    readStep(0);
  };

  const togglePause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      announceStatus("Lectura reanudada.");
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
      announceStatus("Lectura pausada.");
    }
  };

  // Atajos de teclado accesibles: Alt + A (Abrir panel), Alt + R (Leer), Alt + P (Pausar/Reanudar)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Alt + A: Abrir/Cerrar panel de accesibilidad
      if (e.altKey && (e.key === "a" || e.key === "A" || e.code === "KeyA")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Alt + R: Iniciar o detener lectura
      if (e.altKey && (e.key === "r" || e.key === "R" || e.code === "KeyR")) {
        e.preventDefault();
        if (isReading) {
          stopReading();
        } else {
          startReading();
        }
        return;
      }

      // Alt + P: Pausar / Reanudar lectura
      if (e.altKey && (e.key === "p" || e.key === "P" || e.code === "KeyP")) {
        e.preventDefault();
        if (isReading) {
          togglePause();
        }
        return;
      }

      // Escape: Cerrar panel o detener lectura si está leyendo
      if (e.key === "Escape") {
        if (isReading) {
          stopReading();
        }
        if (isOpen) {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [isOpen, isReading, isPaused, stopReading]);

  // Manejo de foco al abrir panel
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (panelRef.current) {
          const firstFocusable = panelRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {/* Región de anuncio para lectores de pantalla */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      {/* Botón Disparador en la Cabecera (Descubrible inmediatamente con Tab o Alt+A) */}
      <div className="relative inline-block z-40">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="accessibility-panel"
          aria-label="Herramientas de accesibilidad, lectura en voz alta y contraste (Atajo: Alt + A)"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2a242c]/95 hover:bg-[#423943] text-[#f2cf6b] hover:text-white border border-[#cba135]/60 hover:border-[#f2cf6b] shadow-md transition font-round text-xs font-bold cursor-pointer shrink-0"
        >
          <Settings size={15} aria-hidden="true" />
          <span className="hidden sm:inline font-mono uppercase">Accesibilidad</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 border border-[#cba135]/40 font-mono text-[#f2cf6b]">
            [Alt+A]
          </span>
        </button>

        {/* Panel Desplegable de Accesibilidad */}
        {isOpen && (
          <div
            id="accessibility-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Panel de Herramientas de Accesibilidad Universal"
            className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#2a242c]/98 border-2 border-[#cba135] shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl p-5 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-[#ffffff]"
          >
            {/* Cabecera del Panel */}
            <div className="flex items-center justify-between pb-3 border-b border-[#615362]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#f2cf6b]" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#ff859b] font-round">
                  Centro de Accesibilidad Universal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Cerrar panel de accesibilidad"
                className="p-1.5 rounded-lg bg-[#362f37] hover:bg-[#721828] text-[#c29da5] hover:text-white border border-[#615362] transition cursor-pointer"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Aviso para Usuarios de Lectores de Pantalla Nativos */}
            <div className="p-3 rounded-xl bg-[#362f37] border border-[#615362] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#f2cf6b]">
                <Info size={14} aria-hidden="true" />
                <span>Compatibilidad Screen Readers</span>
              </div>
              <p className="text-[11px] text-[#dcd0d5] leading-relaxed">
                Si ya usas NVDA, VoiceOver o TalkBack, tu lector navegará la web de forma nativa. La lectura en voz alta es opcional para descanso visual o dislexia.
              </p>
            </div>

            {/* Módulo 1: Lectura en Voz Alta bajo Demanda */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f2cf6b] block">
                1. Lectura en Voz Alta del Contenido
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {!isReading ? (
                  <button
                    type="button"
                    onClick={startReading}
                    aria-label="Iniciar lectura del contenido principal en voz alta (Atajo: Alt + R)"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md border border-[#cba135]/40 cursor-pointer min-h-[44px]"
                  >
                    <Volume2 size={16} aria-hidden="true" />
                    <span>Escuchar Página [Alt+R]</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={togglePause}
                      aria-label={isPaused ? "Reanudar lectura en voz alta" : "Pausar lectura en voz alta"}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#cba135] hover:bg-[#dfb547] text-[#1c181f] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer min-h-[44px]"
                    >
                      {isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                      <span>{isPaused ? "Reanudar" : "Pausar [Alt+P]"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopReading}
                      aria-label="Detener lectura en voz alta"
                      className="py-2 px-3 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                    >
                      <VolumeX size={15} aria-hidden="true" />
                      <span>Detener [Esc]</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Módulo 2: Tamaño de Tipografía */}
            <div className="space-y-2 pt-2 border-t border-[#615362]/60">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f2cf6b] block">
                2. Tamaño de Letra
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleScaleChange("normal")}
                  aria-pressed={textScale === "normal"}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer min-h-[40px] flex items-center justify-center gap-1 ${
                    textScale === "normal"
                      ? "bg-[#721828] text-[#f2cf6b] border-[#cba135]"
                      : "bg-[#362f37] text-[#ffffff] border-[#615362] hover:bg-[#423943]"
                  }`}
                >
                  <Type size={13} aria-hidden="true" />
                  <span>100%</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleScaleChange("large")}
                  aria-pressed={textScale === "large"}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer min-h-[40px] flex items-center justify-center gap-1 ${
                    textScale === "large"
                      ? "bg-[#721828] text-[#f2cf6b] border-[#cba135]"
                      : "bg-[#362f37] text-[#ffffff] border-[#615362] hover:bg-[#423943]"
                  }`}
                >
                  <Type size={15} aria-hidden="true" />
                  <span>125%</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleScaleChange("xlarge")}
                  aria-pressed={textScale === "xlarge"}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer min-h-[40px] flex items-center justify-center gap-1 ${
                    textScale === "xlarge"
                      ? "bg-[#721828] text-[#f2cf6b] border-[#cba135]"
                      : "bg-[#362f37] text-[#ffffff] border-[#615362] hover:bg-[#423943]"
                  }`}
                >
                  <Type size={17} aria-hidden="true" />
                  <span>150%</span>
                </button>
              </div>
            </div>

            {/* Módulo 3: Alto Contraste Forzado */}
            <div className="space-y-2 pt-2 border-t border-[#615362]/60">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f2cf6b] block">
                3. Contraste Visual
              </span>
              <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={isHighContrast}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-between cursor-pointer min-h-[44px] ${
                  isHighContrast
                    ? "bg-[#ffff00] text-[#000000] border-[#ffff00] font-black"
                    : "bg-[#362f37] text-[#ffffff] border-[#615362] hover:bg-[#423943]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye size={16} aria-hidden="true" />
                  <span>Modo Alto Contraste Forzado</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#ffffff]">
                  {isHighContrast ? "ACTIVADO" : "DESACTIVADO"}
                </span>
              </button>
            </div>

            {/* Pie de Panel con Atajos Rápidos */}
            <div className="pt-2 border-t border-[#615362]/60 text-[10px] font-mono text-[#dcd0d5] flex items-center justify-between">
              <span>Atajos: Alt+A (Panel) · Alt+R (Voz)</span>
              <span>Esc (Cerrar)</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
