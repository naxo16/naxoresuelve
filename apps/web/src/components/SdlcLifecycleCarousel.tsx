"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Database,
  Code2,
  FlaskConical,
  ShieldCheck,
  TrendingDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Award,
  ArrowRight,
  Cpu,
} from "lucide-react";

interface SdlcPhase {
  step: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  engineeringFocus: string;
  businessSolution: string;
  metrics: {
    label: string;
    value: string;
    highlight: string;
  }[];
  icon: typeof Database;
}

const SDLC_PHASES: SdlcPhase[] = [
  {
    step: "01",
    badge: "Fase 01 · Arquitectura & ADOO",
    badgeColor: "border-[#cba135] text-[#f2cf6b] bg-[#cba135]/15",
    title: "Modelado Relacional 3FN & Contratos Pydantic v2",
    subtitle: "Erradicación de redundancia y diseño relacional determinista en PostgreSQL",
    engineeringFocus:
      "Normalización 3FN con claves foráneas estrictas, índices B-Tree compuestos, hashing HMAC para datos personales (Ley 19.628 / 21.719) y contratos de validación estricta en la frontera.",
    businessSolution:
      "Elimina la ceguera de datos y registros huérfanos antes de programar una sola vista. Las reglas de integridad garantizan que la base de datos sea una fuente única de verdad inmutable.",
    metrics: [
      { label: "Integridad Relacional", value: "3FN Estricta", highlight: "Cero inconsistencias" },
      { label: "Validación de Contratos", value: "100% Pydantic v2", highlight: "Sanitización total" },
      { label: "Protección de Privacidad", value: "HMAC-SHA256", highlight: "Cumplimiento Chile" },
    ],
    icon: Database,
  },
  {
    step: "02",
    badge: "Fase 02 · Codificación Segura",
    badgeColor: "border-[#ff6b85] text-[#ff6b85] bg-[#721828]/30",
    title: "FastAPI Modular, asyncpg Puro & OWASP por Diseño",
    subtitle: "Desarrollo limpio, mantenible, asíncrono y blindado contra inyecciones",
    engineeringFocus:
      "Cero interpolación de strings en SQL (consultas 100% parametrizadas con asyncpg $1, $2 mitigando OWASP A03), hashing de claves con PBKDF2-HMAC-SHA256 (100k iteraciones) y arquitectura desacoplada por dominios.",
    businessSolution:
      "Un motor ultrarrápido capaz de procesar miles de transacciones concurrentes en milisegundos sin bloqueos de memoria ni colapsos del servidor ante picos de demanda.",
    metrics: [
      { label: "Mitigación Inyecciones", value: "0 Inyecciones", highlight: "OWASP Top 10 A03" },
      { label: "Velocidad de Respuesta", value: "<350 ms", highlight: "Rendimiento SQL puro" },
      { label: "Criptografía de Passwords", value: "PBKDF2 100k", highlight: "Salting aleatorio" },
    ],
    icon: Code2,
  },
  {
    step: "03",
    badge: "Fase 03 · QA & Testing Rudo",
    badgeColor: "border-emerald-500 text-emerald-400 bg-emerald-950/40",
    title: "Testing Rudo Automatizado con Pytest & Chaos Engineering",
    subtitle: "Fuzzing de cargas corruptas, ráfagas de estrés y degradación 503 controlada",
    engineeringFocus:
      "Batería automatizada de pruebas unitarias, de fuzzing (payloads mutados, caracteres nulos, inyecciones SQL) y resiliencia: la API responde HTTP 503 limpio y estructurado ante pérdida de BD sin colgar el proceso.",
    businessSolution:
      "El software se somete a condiciones extremas en laboratorio para que nunca falle frente a tus clientes en producción. Si un test falla, la entrega no se aprueba.",
    metrics: [
      { label: "Batería de Pruebas", value: "76/76 Aprobadas", highlight: "100% Verde en Pytest" },
      { label: "Fuzzing & Inyecciones", value: "422 Controlado", highlight: "Cero excepciones no capturadas" },
      { label: "Tolerancia a Caídas", value: "503 Estructurado", highlight: "Resiliencia de conexión" },
    ],
    icon: FlaskConical,
  },
  {
    step: "04",
    badge: "Fase 04 · DevSecOps & CI/CD",
    badgeColor: "border-sky-400 text-sky-300 bg-sky-950/40",
    title: "Compilación Limpia, Auditoría de CVEs & Docker Inmutable",
    subtitle: "Entrega continua automatizada, escaneo de dependencias y builds reproducibles",
    engineeringFocus:
      "Pipeline automatizado con auditoría de vulnerabilidades en dependencias (pip-audit / OSV-Scanner), escaneo estático de seguridad Bandit, exportación estática HTML/CSS/JS y versionado DDL estricto.",
    businessSolution:
      "Despliegues deterministas en segundos, cero sorpresas por librerías desactualizadas y compatibilidad nativa en infraestructuras on-premise, VPS o nube global.",
    metrics: [
      { label: "Vulnerabilidades CVE", value: "0 Críticas", highlight: "pip-audit verificado" },
      { label: "Tiempo de Compilación", value: "<5.5 Segundos", highlight: "Turbopack optimizado" },
      { label: "Despliegue Inmutable", value: "Docker / Export", highlight: "Portabilidad total" },
    ],
    icon: ShieldCheck,
  },
  {
    step: "05",
    badge: "Fase 05 · Resultados en Producción",
    badgeColor: "border-[#f2cf6b] text-[#f2cf6b] bg-[#721828]/50",
    title: "Reducción del 100% de Duplicados & Retorno de Inversión",
    subtitle: "Impacto económico y operativo medible en empresas y faenas reales",
    engineeringFocus:
      "Algoritmos de deduplicación difusa (fuzzy matching) en tiempo real, cruce automático de planillas multi-origen y tableros de telemetría operativa ejecutiva.",
    businessSolution:
      "Recuperación inmediata de dinero frenando pagos dobles, ahorro de 38 horas semanales en consolidación manual y tranquilidad operativa absoluta para la gerencia.",
    metrics: [
      { label: "Erradicación de Duplicados", value: "100% Reducción", highlight: "Cero pagos dobles" },
      { label: "Ahorro de Tiempo", value: "-38 hrs/Semana", highlight: "Fin a planillas manuales" },
      { label: "Retorno Trimestral", value: "$4.5M CLP", highlight: "Fuga de horas frenada" },
    ],
    icon: TrendingDown,
  },
];

export function SdlcLifecycleCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = SDLC_PHASES.length;
  const currentPhase = SDLC_PHASES[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSteps);
  }, [totalSteps]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
  }, [totalSteps]);

  // Rotación automática cada 6 segundos si no está en pausa
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const IconComponent = currentPhase.icon;

  return (
    <section
      aria-label="Ciclo de Vida del Software y Resultados"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-gradient-to-r from-[#2c2732] via-[#3a3640] to-[#2c2732] border-y-2 border-[#b82d46]/50 py-7 px-4 sm:px-6 relative overflow-hidden shadow-2xl transition-all"
    >
      {/* Glow ambiental de alta fidelidad */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-40 bg-[#721828]/25 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-40 bg-[#cba135]/15 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Barra Superior del Carrusel: Título General + Controles de Fase */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#6d6475]/50">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f2cf6b] shadow-[0_0_10px_#f2cf6b] animate-ping" />
            <h2 className="text-xs sm:text-sm font-cyber font-bold uppercase tracking-widest text-[#f2cf6b] flex items-center gap-2">
              <span>{"//"} CICLO DE VIDA DEL SOFTWARE COMPLETO &amp; RESULTADOS REALES</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#721828] text-white border border-[#cba135]/40">
                SDLC CERTIFICADO
              </span>
            </h2>
          </div>

          {/* Selector Interactivo de Fases (Navegación Rápida) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {SDLC_PHASES.map((p, idx) => (
              <button
                key={p.step}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir a ${p.badge}`}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "bg-[#721828] text-[#f2cf6b] border border-[#cba135] shadow-[0_0_12px_rgba(203,161,53,0.4)] scale-105"
                    : "bg-[#302c36] text-[#dcd0d5] hover:text-white border border-[#6d6475] hover:border-[#f2cf6b]/50"
                }`}
              >
                <span>Fase {p.step}</span>
              </button>
            ))}

            {/* Controles Prev / Next */}
            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Fase anterior"
                className="p-1 rounded-lg bg-[#302c36] hover:bg-[#721828] border border-[#6d6475] text-[#dcd0d5] hover:text-[#f2cf6b] transition cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Fase siguiente"
                className="p-1 rounded-lg bg-[#302c36] hover:bg-[#721828] border border-[#6d6475] text-[#dcd0d5] hover:text-[#f2cf6b] transition cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Contenido Activo de la Fase (Animada por Transición) */}
        <div className="grid lg:grid-cols-12 gap-5 items-center">
          {/* Bloque Izquierdo: Descripción Técnica & Solución (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentPhase.badgeColor}`}
              >
                {currentPhase.badge}
              </span>
              <span className="text-[11px] font-mono text-[#dcd0d5]">
                Paso {currentPhase.step} de {totalSteps}
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#721828] to-[#cba135] flex items-center justify-center text-white shrink-0 shadow-lg border border-[#f2cf6b]/40 mt-0.5">
                <IconComponent size={22} className="text-white" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-cyber font-bold text-white tracking-tight leading-snug">
                  {currentPhase.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#f2cf6b]">
                  {currentPhase.subtitle}
                </p>
              </div>
            </div>

            {/* Doble Perspectiva: Rigor Técnico vs Solución de Negocio */}
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#302c36]/90 border border-[#6d6475]/70 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff6b85] flex items-center gap-1">
                  <Cpu size={12} />
                  <span>Enfoque de Ingeniería Limpia</span>
                </span>
                <p className="text-xs text-[#dcd0d5] leading-relaxed">
                  {currentPhase.engineeringFocus}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#302c36]/90 border border-[#cba135]/40 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f2cf6b] flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Solución &amp; Impacto de Negocio</span>
                </span>
                <p className="text-xs text-white leading-relaxed">
                  {currentPhase.businessSolution}
                </p>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Métricas Reales & Resultados (5 cols) */}
          <div className="lg:col-span-5 bg-[#302c36]/95 border-2 border-[#cba135]/50 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#6d6475]">
              <span className="text-xs font-cyber font-bold uppercase tracking-wider text-[#f2cf6b] flex items-center gap-1.5">
                <Award size={14} className="text-[#f2cf6b]" />
                <span>Resultados Comprobables de la Fase</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                VERIFICADO
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {currentPhase.metrics.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="p-2.5 rounded-xl bg-[#3a3640] border border-[#6d6475]/60 flex flex-col justify-between"
                >
                  <span className="text-[10px] text-[#dcd0d5] font-medium line-clamp-1">
                    {m.label}
                  </span>
                  <div className="text-sm sm:text-base font-cyber font-black text-white my-1">
                    {m.value}
                  </div>
                  <span className="text-[9px] text-[#f2cf6b] font-mono leading-tight">
                    {m.highlight}
                  </span>
                </div>
              ))}
            </div>

            {/* Enlace a Detalle de Metodología */}
            <div className="pt-1 flex items-center justify-between text-xs font-mono">
              <a
                href="#filosofia-testing"
                className="text-[#f2cf6b] hover:text-white flex items-center gap-1 font-bold transition group"
              >
                <span>Inspeccionar batería de pruebas &amp; arquitectura</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-[10px] text-[#dcd0d5]">
                {isPaused ? "⏸ En pausa" : "▶ Autoplay 6s"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
