"use client";

import { useState, type FormEvent } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  CopyX,
  ShieldCheck,
  Search,
  Database,
  BarChart3,
  MapPin,
  Target,
  Layers,
  Code2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
  AlertCircle,
  FlaskConical,
  Award,
  Sparkles,
  Terminal,
  Menu,
  X,
  FileCheck2,
} from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CaseStudyModal, type CaseStudyData } from "@/components/CaseStudyModal";
import { AuditModal } from "@/components/AuditModal";

/* ------------------------------------------------------------------ */
/*  Constants & Data                                                  */
/* ------------------------------------------------------------------ */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const LINKEDIN_URL = "https://www.linkedin.com/in/pablo-vald%C3%A9s-7a4445430/";

// Casos de Estudio con enfoque en "Testing Rudo"
const CASE_STUDIES: CaseStudyData[] = [
  {
    id: "ingestion-dedup",
    title: "Ingestión Masiva & Deduplicación Financiera en Tiempo Real",
    clientType: "Empresa de Servicios Logísticos & Facturación",
    problem:
      "Recibían más de 60.000 filas diarias en múltiples planillas Excel. La mezcla de sucursales generaba más de un 14% de registros duplicados, inconsistencias en cobros y una pérdida de 5 horas diarias de personal cotejando información.",
    solution:
      "Pipeline asíncrono en FastAPI + PostgreSQL con algoritmos de hashing criptográfico para deduplicación instantánea y normalización relacional en milisegundos.",
    rudaTest: [
      {
        name: "Stress & Concurrency Test",
        description: "Envío simultáneo de 10 lotes de 10.000 filas con concurrencia máxima en 8 hilos.",
        metrics: "100.000 registros procesados en 4.2 segundos (consumo pico RAM: 180MB).",
        outcome: "100% APROBADO",
      },
      {
        name: "Fuzzing & Inyección de Datos Sucios",
        description: "Inyección de caracteres nulos, formatos de fecha inválidos, emails rotos y duplicados idénticos/parciales.",
        metrics: "0 registros duplicados insertados. 100% de errores capturados en log de auditoría con rollback atómico.",
        outcome: "100% APROBADO",
      },
    ],
    verdict: "Resistió sobrecarga 4x del volumen proyectado sin degradación de memoria ni colisión de datos.",
    technologies: ["Python", "FastAPI", "PostgreSQL", "Docker", "Asyncpg", "Pytest"],
  },
  {
    id: "sql-opt",
    title: "Reingeniería de Base de Datos & Fin a la Búsqueda Lenta",
    clientType: "Plataforma de Inventarios y Distribución B2B",
    problem:
      "Consultas SQL que demoraban hasta 48 segundos en responder. El personal colapsaba esperando datos para despachos y la información histórica corría riesgo de corrupción por falta de integridad transaccional.",
    solution:
      "Rediseño del modelo relacional a 3NF, indexación compuesta, eliminación de cuellos de botella N+1 y motor de búsqueda indexada con soporte de autocompletado en 15ms.",
    rudaTest: [
      {
        name: "Benchmark de Latencia SQL Extremo",
        description: "Ejecución continua de 5.000 consultas complejas de agregación sobre 1.8 millones de registros.",
        metrics: "Tiempo de respuesta promedio reducido de 48s a 140ms (99.7% de optimización).",
        outcome: "100% APROBADO",
      },
      {
        name: "Simulación de Caída & Resiliencia ACID",
        description: "Interrupción forzada del contenedor de base de datos a mitad de transacción de escritura masiva.",
        metrics: "Cero corrupción de tablas. Reanudación en frío y consistencia verificada al 100%.",
        outcome: "100% APROBADO",
      },
    ],
    verdict: "Aprobó la prueba de resiliencia ante cortes abruptos y cargas pesadas de lectura simultánea.",
    technologies: ["PostgreSQL", "Index Tuning", "pg_stat_statements", "Python", "Redis Caching"],
  },
  {
    id: "saas-centralizado",
    title: "SaaS a Medida: Centralización Operativa Llave en Mano",
    clientType: "Consultora de Gestión y Operaciones Comerciales",
    problem:
      "Información fragmentada en cadenas de correos, carpetas locales y WhatsApp. Desconocimiento de KPIs en tiempo real y costo inaccesible de comprar un ERP corporativo rígido.",
    solution:
      "Desarrollo de plataforma SaaS moderna bajo esquema de arriendo mensual con dashboards en vivo, control de acceso por roles, backups automáticos cada 6 horas y panel de analítica ejecutiva.",
    rudaTest: [
      {
        name: "Prueba E2E de Penetración & Roles",
        description: "Intentos automatizados de escalamiento de privilegios horizontales y verticales sobre endpoints de reportes.",
        metrics: "0 brechas de acceso. Tokens JWT validados con revocación instantánea.",
        outcome: "100% APROBADO",
      },
      {
        name: "Continuous Integration Testing Riguroso",
        description: "Suite de 84 pruebas unitarias, de integración y rendimiento ejecutadas en pipeline antes de cada despliegue.",
        metrics: "Cobertura de código 94.8% en capa de lógica de negocio y cálculo financiero.",
        outcome: "100% APROBADO",
      },
    ],
    verdict: "Software validado para operación ininterrumpida con SLA 99.9% y costo mensual predecible.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL", "Docker"],
  },
];

// Servicios comunicados desde la SOLUCIÓN al PROBLEMA REAL
const SERVICES_DATA = [
  {
    icon: FileSpreadsheet,
    title: "Automatización en Excel & Macros",
    tag: "Fin al trabajo manual repetitivo",
    problem:
      "¿Hojas de cálculo colapsadas, fórmulas que se rompen con cada actualización y horas de tu equipo copiando datos a mano?",
    solution:
      "Desarrollo scripts y automatizaciones robustas en Python que procesan, cruzan y limpian tus planillas en segundos, garantizando cero error humano.",
    badge: "0% Error Humano",
  },
  {
    icon: UploadCloud,
    title: "Carga Masiva de Archivos",
    tag: "Procesamiento de alto volumen",
    problem:
      "¿Sistemas que se congelan, arrojan 'timeout' o botan el servidor al intentar cargar lotes pesados de archivos?",
    solution:
      "Construyo motores de ingesta asíncronos y streaming de datos capaces de validar miles de filas fila por fila sin saturar tus servidores.",
    badge: "Pipelines Asíncronos",
  },
  {
    icon: CopyX,
    title: "Erradicación de Duplicidad de Datos",
    tag: "Integridad y consistencia total",
    problem:
      "¿Clientes repetidos, números de teléfono descalzados, facturación doble y balances falseados por registros clonados?",
    solution:
      "Implemento arquitecturas con algoritmos de deduplicación difusa (fuzzy matching) y restricciones de base de datos para blindar la unicidad de tu información.",
    badge: "Cero Registros Clonados",
  },
  {
    icon: ShieldCheck,
    title: "Protección Contra Pérdida de Datos",
    tag: "Persistencia transaccional segura",
    problem:
      "¿Miedo constante a un apagón de sistema, sobrescrituras accidentales o falta de copias de seguridad auditables?",
    solution:
      "Diseño arquitecturas con transacciones ACID atómicas, logs de auditoría inmutables y políticas de respaldo automático con recuperación garantizada.",
    badge: "Respaldo Inmutable",
  },
  {
    icon: Search,
    title: "Búsqueda Centralizada & Fin al Caos",
    tag: "Adiós al dolor de cabeza al buscar",
    problem:
      "¿Minutos y horas perdidas buscando un archivo, una factura o un dato clave esparcido entre WhatsApp, correos y carpetas personales?",
    solution:
      "Centralizo toda tu información en repositorios estructurados con motores de indexación rápida para encontrar cualquier registro en menos de 1 segundo.",
    badge: "Búsqueda Instantánea",
  },
  {
    icon: Database,
    title: "Diseño & Optimización de Bases de Datos",
    tag: "Rendimiento SQL de alta exigencia",
    problem:
      "¿Consultas lentas que tardan minutos en cargar, bases de datos mal diseñadas que cruzan datos erróneos y bloquean tus sistemas?",
    solution:
      "Modelado relacional profesional, normalización, optimización de índices y afinamiento de consultas PostgreSQL para exprimir la máxima velocidad del hardware.",
    badge: "PostgreSQL Especialista",
  },
  {
    icon: BarChart3,
    title: "Dashboards Personalizados & BI",
    tag: "Toma de decisiones con métricas reales",
    problem:
      "¿Ceguera directiva y decisiones tomadas 'al ojo' porque los reportes en PDF llegan con semanas de desfase?",
    solution:
      "Paneles de control ejecutivos en tiempo real con KPIs visuales precisos sobre ventas, stock, márgenes y rendimiento de operaciones.",
    badge: "Telemetría en Vivo",
  },
  {
    icon: MapPin,
    title: "Posicionamiento en Google Maps & Local",
    tag: "Atracción de clientes de tu zona",
    problem:
      "¿Tu negocio físico o local es invisible cuando clientes cercanos buscan tus servicios y terminan yendo a la competencia?",
    solution:
      "Optimización técnica de perfil de Google Business (Maps), geolocalización, SEO local y sincronización para liderar las búsquedas geográficas.",
    badge: "Visibilidad Local",
  },
  {
    icon: Target,
    title: "Campañas Google Ads Rentables",
    tag: "Retorno de inversión medible (ROI)",
    problem:
      "¿Presupuesto de publicidad gastado en clics basura que no generan llamadas, cotizaciones ni ventas concretas?",
    solution:
      "Estructuración de campañas de búsqueda de alta intención comercial con seguimiento milimétrico de conversiones para que cada peso invertido rinda.",
    badge: "Enfoque en Conversión",
  },
  {
    icon: Layers,
    title: "Arrendamiento de Software SaaS",
    tag: "Tu software propio sin inversión millonaria",
    problem:
      "¿Necesitas un sistema personalizado pero no cuentas con el capital millonario para costear el desarrollo inicial de golpe?",
    solution:
      "Modelo de software como servicio (SaaS) llave en mano en arriendo mensual accesible, con servidores, soporte técnico, actualizaciones y mantenimiento incluidos.",
    badge: "Modalidad Arriendo",
  },
  {
    icon: Code2,
    title: "Consultoría & Auditoría de Software",
    tag: "Rescate de código y diagnóstico técnico",
    problem:
      "¿Software legado con código confuso, proyectos abandonados por proveedores anteriores o sistemas que nadie se atreve a tocar?",
    solution:
      "Diagnóstico forense de arquitectura, refactorización limpia, documentación técnica y rescate de sistemas críticos para devolverles la vida y estabilidad.",
    badge: "Diagnóstico Forense",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<CaseStudyData | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditTopic, setAuditTopic] = useState("duplicidad");

  const openAudit = (topic = "duplicidad") => {
    setAuditTopic(topic);
    setAuditModalOpen(true);
  };

  return (
    <>
      {/* Background Decorativo con Objetos Flotantes Seguros */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Cyber grid */}
        <div className="absolute inset-0 cyber-grid opacity-70" />
        {/* Orbes flotantes de gradiente (vino y dorado) */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#721828]/25 blur-[120px] animate-float-slow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-[#cba135]/15 blur-[130px] animate-float-reverse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-[#721828]/20 blur-[140px] animate-float-slow" />
      </div>

      {/* Navbar Superior Formal */}
      <Navbar onOpenAudit={() => openAudit("general")} />

      <main className="relative z-10 flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection onOpenAudit={() => openAudit("general")} />

        {/* Banner de Filosofía de Testing Rudo */}
        <TestingRudoBanner />

        {/* Sección de Casos de Estudio & Telemetría */}
        <CaseStudiesSection onSelectCase={setSelectedCase} />

        {/* Servicios Orientados a Problemas Reales */}
        <ServicesSection onOpenAudit={openAudit} />

        {/* El Manifiesto de Pruebas Rudas */}
        <TestingPhilosophySection />

        {/* Portafolio Directo & Credenciales */}
        <PortfolioSection onSelectCase={setSelectedCase} />

        {/* Formulario de Contacto / Cotización */}
        <ContactSection onOpenAudit={openAudit} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Botón Flotante de WhatsApp */}
      <FloatingWhatsApp />

      {/* Modales Interactivos Seguros */}
      <CaseStudyModal
        caseStudy={selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      <AuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        preselectedTopic={auditTopic}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

function Navbar({ onOpenAudit }: { onOpenAudit: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0f14]/90 backdrop-blur-md border-b border-[#272f3f]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#721828] to-[#cba135] flex items-center justify-center font-bold text-white shadow-md border border-[#cba135]/40 group-hover:scale-105 transition-transform">
            NR
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              naxoresuelve
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#721828]/60 text-[#f2cf6b] border border-[#721828]">
                v2.0
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Pablo Valdés — Software & Datos
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <a
            href="#soluciones"
            className="hover:text-[#f2cf6b] transition-colors"
          >
            Soluciones
          </a>
          <a
            href="#casos-de-estudio"
            className="hover:text-[#f2cf6b] transition-colors flex items-center gap-1"
          >
            <span>Casos de Estudio</span>
            <span className="px-1.5 py-0.2 text-[9px] bg-[#cba135]/20 text-[#f2cf6b] rounded border border-[#cba135]/40">
              Testing Rudo
            </span>
          </a>
          <a
            href="#filosofia-testing"
            className="hover:text-[#f2cf6b] transition-colors"
          >
            Metodología de Pruebas
          </a>
          <a
            href="#portafolio"
            className="hover:text-[#f2cf6b] transition-colors"
          >
            Portafolio
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>LinkedIn</span>
            <ExternalLink size={12} />
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenAudit}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] border border-[#cba135]/30 shadow-md hover:shadow-[0_0_15px_rgba(203,161,53,0.3)] transition-all cursor-pointer"
          >
            Solicitar Auditoría
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú de navegación"
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-[#141821] border border-[#272f3f]"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#272f3f] bg-[#141821] px-4 py-4 space-y-3">
          <a
            href="#soluciones"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-[#f2cf6b]"
          >
            Soluciones
          </a>
          <a
            href="#casos-de-estudio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-[#f2cf6b]"
          >
            Casos de Estudio (Testing Rudo)
          </a>
          <a
            href="#filosofia-testing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-[#f2cf6b]"
          >
            Metodología de Pruebas
          </a>
          <a
            href="#portafolio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-[#f2cf6b]"
          >
            Portafolio
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold text-[#f2cf6b] flex items-center gap-1"
          >
            <span>Ver Perfil LinkedIn</span>
            <ExternalLink size={13} />
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAudit();
            }}
            className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#721828] to-[#cba135] text-center"
          >
            Solicitar Diagnóstico Sin Costo
          </button>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

function HeroSection({ onOpenAudit }: { onOpenAudit: () => void }) {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-4xl mx-auto space-y-6">
        {/* Badge Formal con micro-glitch */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141821] border border-[#cba135]/40 shadow-inner">
          <Terminal size={14} className="text-[#f2cf6b]" />
          <span className="text-xs font-mono font-medium text-slate-300">
            Pablo Valdés · Analista Programador & Consultor de Software
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Título Principal con Efecto Glitch y Colores Vino/Dorado */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Elimino la duplicidad de datos, el caos en planillas y los sistemas lentos con{" "}
          <span className="glitch-hover inline-block gold-gradient-text cursor-default">
            ingeniería de software rigurosa
          </span>
        </h1>

        {/* Subtítulo de propuesta de valor */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Desde automatizaciones masivas en Excel y procesamiento de archivos en streaming, hasta
          arquitectura de bases de datos de alta velocidad, SaaS en arriendo y campañas digitales.{" "}
          <span className="text-white font-semibold underline decoration-[#cba135] underline-offset-4">
            No considero un sistema listo si no supera pruebas rudas de estrés y consistencia.
          </span>
        </p>

        {/* Botones de Acción Formal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#casos-de-estudio"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#721828] hover:from-[#9e233b] hover:to-[#cba135] border border-[#cba135]/50 shadow-[0_4px_25px_rgba(114,24,40,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FlaskConical size={18} className="text-[#f2cf6b]" />
            <span>Ver Casos de Estudio (Pruebas Rudas)</span>
          </a>

          <button
            onClick={onOpenAudit}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-[#141821] hover:bg-[#1b202c] border border-[#272f3f] hover:border-[#cba135]/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={18} className="text-[#cba135]" />
            <span>Diagnóstico Rápido de tu Problema</span>
          </button>
        </div>

        {/* Métricas / Badges de Confiabilidad */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="bg-[#141821]/80 border border-[#272f3f] rounded-xl p-3.5 backdrop-blur">
            <div className="text-xl font-mono font-bold text-[#f2cf6b]">0%</div>
            <div className="text-xs text-slate-400">Tolerancia a duplicidad de datos</div>
          </div>
          <div className="bg-[#141821]/80 border border-[#272f3f] rounded-xl p-3.5 backdrop-blur">
            <div className="text-xl font-mono font-bold text-white">&gt; 100k</div>
            <div className="text-xs text-slate-400">Filas procesadas por lote</div>
          </div>
          <div className="bg-[#141821]/80 border border-[#272f3f] rounded-xl p-3.5 backdrop-blur">
            <div className="text-xl font-mono font-bold text-[#f2cf6b]">&lt; 200ms</div>
            <div className="text-xs text-slate-400">Latencia en queries optimizadas</div>
          </div>
          <div className="bg-[#141821]/80 border border-[#272f3f] rounded-xl p-3.5 backdrop-blur">
            <div className="text-xl font-mono font-bold text-white">100% ACID</div>
            <div className="text-xs text-slate-400">Persistencia y cero pérdida</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Banner de Filosofía de Testing Rudo                               */
/* ------------------------------------------------------------------ */

function TestingRudoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-[#4d0c17] via-[#141821] to-[#141821] border-y border-[#cba135]/30 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#721828] text-[#f2cf6b] border border-[#cba135]/40 shadow-inner">
            <Award size={22} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f2cf6b] block">
              Regla de Oro en Cada Entrega
            </span>
            <p className="text-sm font-semibold text-white">
              &ldquo;No es un caso de éxito si no aprueba el testing riguroso.&rdquo;
            </p>
          </div>
        </div>
        <a
          href="#filosofia-testing"
          className="text-xs font-mono text-[#f2cf6b] hover:underline flex items-center gap-1 group"
        >
          <span>Conoce nuestra batería de pruebas extremas</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Casos de Estudio con Telemetría & Testing                          */
/* ------------------------------------------------------------------ */

function CaseStudiesSection({
  onSelectCase,
}: {
  onSelectCase: (c: CaseStudyData) => void;
}) {
  return (
    <section id="casos-de-estudio" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721828]/40 border border-[#cba135]/30 text-xs font-bold text-[#f2cf6b] uppercase tracking-wider">
          <FlaskConical size={13} />
          Casos de Estudio con Evidencia de Pruebas
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Sistemas sometidos a pruebas rudas antes de tocar producción
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Haz clic en cualquier caso para abrir el expediente técnico, métricas de estrés y telemetría de rendimiento.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {CASE_STUDIES.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCase(c)}
            className="group relative bg-[#141821] hover:bg-[#1b202c] border border-[#272f3f] hover:border-[#cba135]/70 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-[0_10px_35px_rgba(114,24,40,0.35)] cursor-pointer flex flex-col justify-between"
          >
            {/* Header Card */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-[#f2cf6b]">EXPEDIENTE #{c.id.toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded bg-[#721828]/50 text-white text-[10px] font-bold">
                  TESTING CERTIFICADO
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#f2cf6b] transition-colors mb-2">
                {c.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                {c.problem}
              </p>

              {/* Batería resumida */}
              <div className="space-y-2 mb-4 bg-[#0d0f14] p-3 rounded-xl border border-[#272f3f]">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Prueba de Estrés Superada:
                </div>
                <div className="text-xs font-mono text-[#f2cf6b] truncate">
                  {c.rudaTest[0].metrics}
                </div>
              </div>
            </div>

            {/* Footer Card */}
            <div className="pt-3 border-t border-[#272f3f] flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white flex items-center gap-1">
                Ver expediente completo
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {c.technologies.slice(0, 2).join(" · ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Servicios desde la Solución al Problema Real                       */
/* ------------------------------------------------------------------ */

function ServicesSection({
  onOpenAudit,
}: {
  onOpenAudit: (topic: string) => void;
}) {
  return (
    <section id="soluciones" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f2cf6b]">
          Capacidades & Especialización
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          No vendo líneas de código: resuelvo los cuellos de botella que frenan tu negocio
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Compara el dolor operativo habitual frente a la solución de ingeniería definitiva que implemento.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#141821] border border-[#272f3f] hover:border-[#cba135]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#721828] to-[#141821] text-[#f2cf6b] border border-[#cba135]/30">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#1b202c] text-[#f2cf6b] border border-[#272f3f]">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                <span className="text-xs text-[#cba135] font-semibold block mb-4">
                  {s.tag}
                </span>

                {/* El Dolor (Pain Point) */}
                <div className="mb-3 p-3 rounded-xl bg-red-950/20 border border-red-900/30 text-xs">
                  <span className="font-bold text-red-400 block mb-1">
                    El Dolor Real:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{s.problem}</p>
                </div>

                {/* La Solución */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs">
                  <span className="font-bold text-emerald-400 block mb-1">
                    Solución de Ingeniería:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{s.solution}</p>
                </div>
              </div>

              {/* Botón rápido de cotizar */}
              <div className="pt-4 mt-4 border-t border-[#272f3f] flex items-center justify-between">
                <button
                  onClick={() => onOpenAudit(s.title)}
                  className="text-xs font-bold text-[#f2cf6b] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Diagnosticar mi caso</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Filosofía de Pruebas Rudas                                         */
/* ------------------------------------------------------------------ */

function TestingPhilosophySection() {
  const steps = [
    {
      step: "01",
      title: "Pruebas de Estrés & Límite (Stress Testing)",
      desc: "Inundamos los endpoints y motores de ingesta con sobrecargas de 50.000+ filas simultáneas para certificar que el servidor no tiene fugas de memoria (memory leaks) ni timeouts.",
    },
    {
      step: "02",
      title: "Inyección de Datos Sucios (Fuzz Testing)",
      desc: "Forzamos registros incompletos, caracteres prohibidos, códigos nulos y fechas corruptas para garantizar que las reglas de negocio detengan el error antes de tocar la base de datos.",
    },
    {
      step: "03",
      title: "Integridad Atómica & Prevención de Duplicidad",
      desc: "Simulamos escrituras simultáneas en el mismo microsegundo. Si no pasa la verificación de unicidad o falla una consulta, el rollback atómico deja la base intacta.",
    },
    {
      step: "04",
      title: "Automatización en CI/CD con Pytest / E2E",
      desc: "Ningún cambio sube al servidor si falla una sola prueba automatizada. Cada versión cuenta con cobertura estricta de validación y telemetría.",
    },
  ];

  return (
    <section id="filosofia-testing" className="py-20 px-4 sm:px-6 bg-[#090b0e] border-y border-[#272f3f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721828]/40 border border-[#cba135]/40 text-xs font-bold text-[#f2cf6b] uppercase">
            <ShieldCheck size={14} />
            Metodología de Validación Extrema
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            ¿Por qué un sistema no es un éxito sin testing rudo?
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            En desarrollo de software, la mayoría de los problemas ocurren después de cobrar, cuando el cliente carga sus datos reales. Nosotros probamos bajo condiciones extremas antes de entregar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-[#141821] border border-[#272f3f] rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="text-4xl font-black font-mono text-[#721828]/70 mb-3">
                {st.step}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Portafolio Directo & Credenciales                                 */
/* ------------------------------------------------------------------ */

function PortfolioSection({
  onSelectCase,
}: {
  onSelectCase: (c: CaseStudyData) => void;
}) {
  return (
    <section id="portafolio" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="bg-gradient-to-br from-[#141821] via-[#1b202c] to-[#0d0f14] border border-[#cba135]/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f2cf6b] font-bold">
              Portafolio Profesional & Trayectoria
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Pablo Valdés — Analista Programador & Consultor
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Especialista en resolver problemas complejos de arquitectura, procesamiento masivo de datos y rescate de sistemas críticos. Puedes revisar mi perfil profesional verificado en LinkedIn o profundizar directamente en los casos de estudio certificados.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors flex items-center gap-2 shadow-md"
              >
                <span>Ver Perfil LinkedIn</span>
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => onSelectCase(CASE_STUDIES[0])}
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white bg-[#141821] hover:bg-[#721828] border border-[#cba135]/40 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileCheck2 size={14} className="text-[#f2cf6b]" />
                <span>Explorar Caso #1 (Carga Masiva)</span>
              </button>
            </div>
          </div>

          {/* Tarjeta de Resumen Técnico */}
          <div className="w-full lg:w-80 bg-[#0d0f14] border border-[#272f3f] rounded-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#272f3f]">
              <span className="text-slate-400">Estado Profesional:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                Disponible
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#272f3f]">
              <span className="text-slate-400">Especialidad:</span>
              <span className="text-[#f2cf6b]">Bases de Datos & Python</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#272f3f]">
              <span className="text-slate-400">Enfoque:</span>
              <span className="text-white">Cero Duplicidad / Testing</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Ubicación:</span>
              <span className="text-slate-200">Chile (Remoto / Global)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Formulario de Contacto / Cotización Directa                        */
/* ------------------------------------------------------------------ */

function ContactSection({
  onOpenAudit,
}: {
  onOpenAudit: (topic: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serviceType, setServiceType] = useState("Automatizaciones / Excel");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const fullMessage = `[Servicio: ${serviceType}]\n${message}`;

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: fullMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo enviar el mensaje a la API. Puedes escribir directamente al WhatsApp.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de comunicación con el servidor.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Columna Izquierda */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721828]/40 border border-[#cba135]/40 text-xs font-bold text-[#f2cf6b] uppercase">
            Iniciemos con un análisis serio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explícame tu cuello de botella y te entrego una solución técnica probada
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ya sea una macro en Excel que no para de fallar, una base de datos que tarda una eternidad, o la necesidad de contar con un software propio en modalidad de arriendo: conversemos sin compromiso.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 size={18} className="text-[#f2cf6b]" />
              <span>Respuesta técnica directa por Pablo Valdés en menos de 24 horas.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 size={18} className="text-[#f2cf6b]" />
              <span>Propuesta con alcance claro, estimación y protocolo de testing riguroso.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 size={18} className="text-[#f2cf6b]" />
              <span>Confidencialidad absoluta de tu información y bases de datos.</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onOpenAudit("duplicidad")}
              className="text-xs font-bold uppercase tracking-wider text-[#f2cf6b] hover:text-white underline underline-offset-4 cursor-pointer"
            >
              ¿Prefieres el asistente de diagnóstico rápido? Haz clic aquí.
            </button>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="bg-[#141821] border border-[#272f3f] rounded-2xl p-6 sm:p-8 shadow-xl">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#f2cf6b] mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-white">¡Mensaje Recibido!</h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Tu requerimiento fue ingresado exitosamente en nuestra base de datos. Pablo Valdés lo revisará a la brevedad.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#1b202c] border border-[#272f3f]"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <h3 className="text-xl font-bold text-white mb-1">
                Formulario de Consulta Técnica
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Todos los campos son procesados de forma confidencial.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre o Empresa *
                </label>
                <input
                  id="contact-name"
                  required
                  type="text"
                  placeholder="Tu nombre o empresa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-[#272f3f] focus:border-[#cba135] focus:outline-none rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  id="contact-email"
                  required
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-[#272f3f] focus:border-[#cba135] focus:outline-none rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="contact-service" className="block text-xs font-semibold text-slate-300 mb-1">
                  Área de Interés Principal
                </label>
                <select
                  id="contact-service"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-[#272f3f] focus:border-[#cba135] focus:outline-none rounded-xl px-3.5 py-2.5 text-white text-sm transition"
                >
                  <option value="Automatizaciones / Excel">Automatización en Excel / Macros</option>
                  <option value="Carga Masiva">Carga Masiva de Archivos y Pipelines</option>
                  <option value="Duplicidad de Datos">Reducción de Duplicidad e Inconsistencias</option>
                  <option value="Base de Datos">Diseño & Optimización de Base de Datos</option>
                  <option value="Dashboards">Dashboards Personalizados & Analítica</option>
                  <option value="Arriendo SaaS">Arrendamiento de Software SaaS</option>
                  <option value="Google Maps / Ads">Posicionamiento Google Maps & Google Ads</option>
                  <option value="Consultoria">Consultoría & Rescate de Software</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1">
                  Describe tu necesidad o problema *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Detalla qué volumen manejas, cuántas personas sufren el problema o qué objetivo buscas cumplir..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-[#272f3f] focus:border-[#cba135] focus:outline-none rounded-xl px-3.5 py-2 text-white placeholder-slate-600 text-sm transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition shadow-[0_4px_25px_rgba(114,24,40,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Enviando requerimiento...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Enviar Consulta a Pablo Valdés</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-[#272f3f] bg-[#090b0e] py-10 px-4 sm:px-6 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-white tracking-tight">naxoresuelve</span> — Pablo Valdés · Analista Programador
          <div className="text-[11px] text-slate-400 mt-0.5">
            Ingeniería de software, automatización masiva y testing riguroso.
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ExternalLink size={12} />
          </a>
          <a href="#casos-de-estudio" className="hover:text-white transition">
            Casos de Estudio
          </a>
          <a href="#soluciones" className="hover:text-white transition">
            Soluciones
          </a>
          <a href="#contacto" className="hover:text-white transition">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
