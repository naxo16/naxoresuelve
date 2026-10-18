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
  Download,
  Mail,
  Smartphone,
  CalendarCheck,
  Flame,
  ShieldAlert,
  Boxes,
} from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CaseStudyModal, type CaseStudyData } from "@/components/CaseStudyModal";
import { AuditModal } from "@/components/AuditModal";
import { ThreeArchitectureNode } from "@/components/ThreeArchitectureNode";
import { FiscalisCarousel } from "@/components/FiscalisCarousel";

/* ------------------------------------------------------------------ */
/*  Constants & Data                                                  */
/* ------------------------------------------------------------------ */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const PHONE_NUMBER = "56957286145";
const LINKEDIN_URL = "https://www.linkedin.com/in/pablo-vald%C3%A9s-7a4445430/";
const PORTFOLIO_URL = "https://renkaidev-web.renkaidev.workers.dev/";
const CV_URL = "https://renkaidev-web.renkaidev.workers.dev/cv-pablo-valdes.pdf";
const GITHUB_URL = "https://github.com/naxo16";
const EMAIL_DIRECT = "pablovaldescontacto@gmail.com";

// Casos de Estudio Reales de Pablo Valdés con enfoque en "Testing Rudo"
const CASE_STUDIES: CaseStudyData[] = [
  {
    id: "fiscalis",
    title: "Fiscalis: Digitalización Municipal & Recolección en Terreno",
    clientType: "Sector Público / Inspección & Seguridad Municipal",
    problem:
      "La operativa municipal en terreno sufría de grave redundancia operativa y desincronización de datos. Los inspectores anotaban la misma infracción en formularios de papel, WhatsApp y bitácoras físicas, demorando hasta 72 horas en consolidar las actas en el juzgado, con caligrafía ilegible y actas duplicadas.",
    solution:
      "Arquitectura offline-first integral con API asíncrona en FastAPI + PostgreSQL en Tercera Forma Normal (3FN), validación estricta en frontera con Pydantic v2, autenticación RFC 6238 MFA TOTP y cliente móvil Flutter con georreferenciación GPS automática, captura de fotos y cola de sincronización local.",
    rudaTest: [
      {
        name: "Stress & Resiliencia Offline-to-Online",
        description: "Simulación de ráfaga de 5.000 actas sincronizadas simultáneamente desde terreno tras reconexión a red celular.",
        metrics: "Tiempo de captura reducido de ~12 min a <90 segundos. 0 actas perdidas o duplicadas en la cola local.",
        outcome: "100% APROBADO",
      },
      {
        name: "Integridad Relacional 3FN & Inyección Fuzzing",
        description: "Inyección de coordenadas GPS nulas, patentes PPU malformadas y payloads corruptos en frontera.",
        metrics: "Cero corrupción de tablas relacionales. Rollback atómico verificado y validación estricta Pydantic.",
        outcome: "100% APROBADO",
      },
    ],
    verdict: "Transformó un flujo analógico lento de 72 horas en un procedimiento digital instantáneo con trazabilidad legal inmutable.",
    technologies: ["FastAPI", "PostgreSQL (3FN)", "Python", "Flutter", "Docker", "MFA TOTP", "GitHub Actions"],
    liveUrl: "https://renkaidev-web.renkaidev.workers.dev/casos/fiscalis",
  },
  {
    id: "del-valle",
    title: "Del Valle Construcciones: Plataforma Comercial & Captación",
    clientType: "Industria de la Construcción e Inmobiliaria",
    problem:
      "Falta de presencia digital estructurada, cotizaciones perdidas en cadenas de correos y chats informales sin seguimiento comercial y nula trazabilidad del retorno sobre la inversión en publicidad.",
    solution:
      "Desarrollo de plataforma web corporativa y landing de alta conversión con motor de captura de leads integrado a base de datos relacional y alertas comerciales instantáneas.",
    rudaTest: [
      {
        name: "Core Web Vitals & Carga Concurrente",
        description: "Simulación de tráfico publicitario concurrente y análisis de tiempo de respuesta del servidor.",
        metrics: "Puntuación de rendimiento 98/100, tiempo de carga inicial <1.2s y 100% de persistencia en captación.",
        outcome: "100% APROBADO",
      },
      {
        name: "Validación Anti-Spam & Sanitización",
        description: "Pruebas de inyección de bots y formularios automatizados con datos basura.",
        metrics: "0 falsos positivos, captura limpia de datos corporativos y 100% de leads genuinos ingresados.",
        outcome: "100% APROBADO",
      },
    ],
    verdict: "Habilitó la captación digital comercial inmediata estructurando el embudo de ventas de la empresa.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Tailwind CSS", "Docker"],
    liveUrl: "https://renkaidev-web.renkaidev.workers.dev/casos/del-valle-construcciones",
  },
  {
    id: "agenda-automation",
    title: "Intelligent Agenda Automation: Sincronización Directiva",
    clientType: "Gestión Corporativa & Coordinación Directiva",
    problem:
      "Conflictos constantes de horarios entre múltiples ejecutivos, reuniones agendadas dos veces en el mismo bloque y horas de personal directivo perdidas coordinando disponibilidad manualmente.",
    solution:
      "Automatización de flujos de trabajo inteligentes para sincronización bidireccional de agendas con detección de colisiones, recordatorios automáticos y trazabilidad de asistencia.",
    rudaTest: [
      {
        name: "Concurrencia & Detección de Colisiones",
        description: "Intentos simultáneos de agendamiento en el mismo intervalo de microsegundo por múltiples usuarios.",
        metrics: "Cero solapamiento de reuniones. Algoritmo de locking transaccional que resolvió colisiones en <50ms.",
        outcome: "100% APROBADO",
      },
      {
        name: "Resiliencia ante Cortes de Webhook",
        description: "Simulación de fallas de conexión con APIs de calendario externas.",
        metrics: "Cola de reintentos con retroceso exponencial. Cero eventos perdidos y sincronización exacta al reconectar.",
        outcome: "100% APROBADO",
      },
    ],
    verdict: "Eliminó por completo la fricción de coordinación y la duplicidad en agendas de alta dirección.",
    technologies: ["Python", "FastAPI", "Webhooks", "PostgreSQL", "Worker Queues", "Pytest"],
    liveUrl: "https://renkaidev-web.renkaidev.workers.dev/casos/intelligent-agenda-automation",
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
      "Modelado relacional profesional, normalización (3FN), optimización de índices y afinamiento de consultas PostgreSQL para exprimir la máxima velocidad del hardware.",
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
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07080c]">
        {/* Cyber grid matizada en vino tenue */}
        <div className="absolute inset-0 cyber-grid opacity-60" />
        {/* Orbes flotantes de gradiente (vino profundo y dorado) */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#721828]/30 blur-[130px] animate-float-slow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-[#cba135]/15 blur-[130px] animate-float-reverse" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-[#721828]/25 blur-[140px] animate-float-slow" />
      </div>

      {/* Navbar Superior Formal */}
      <Navbar onOpenAudit={() => openAudit("general")} />

      <main className="relative z-10 flex-1 flex flex-col text-[#f5dade]">
        {/* Hero Section con Three.js 3D Interactivo */}
        <HeroSection onOpenAudit={() => openAudit("general")} />

        {/* Banner de Filosofía de Testing Rudo */}
        <TestingRudoBanner />

        {/* SHOWCASE DESTACADO: Fiscalis con Carrusel de Hallazgos QA */}
        <FiscalisSpotlightSection onSelectFiscalis={() => setSelectedCase(CASE_STUDIES[0])} />

        {/* Sección de Casos de Estudio Reales & Telemetría */}
        <CaseStudiesSection onSelectCase={setSelectedCase} />

        {/* Servicios Orientados a Problemas Reales */}
        <ServicesSection onOpenAudit={openAudit} />

        {/* El Manifiesto de Pruebas Rudas */}
        <TestingPhilosophySection />

        {/* Portafolio Directo & Credenciales de Pablo Valdés */}
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
    <header className="sticky top-0 z-40 bg-[#07080c]/95 backdrop-blur-md border-b border-[#281a24]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#721828] to-[#cba135] flex items-center justify-center font-bold text-white shadow-md border border-[#cba135]/40 group-hover:scale-105 transition-transform">
            PV
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#ff758f] flex items-center gap-1.5">
              Pablo Valdés
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#721828]/70 text-[#f2cf6b] border border-[#721828]">
                naxoresuelve
              </span>
            </span>
            <span className="text-[11px] text-[#c29da5] font-medium">
              Analista Programador · Backend & Arquitectura
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#f5dade]">
          <a
            href="#fiscalis-spotlight"
            className="hover:text-[#f2cf6b] transition-colors flex items-center gap-1 text-[#ff6b85]"
          >
            <Flame size={13} className="text-[#cba135]" />
            <span>Fiscalis</span>
          </a>
          <a
            href="#soluciones"
            className="hover:text-[#ff758f] transition-colors"
          >
            Soluciones
          </a>
          <a
            href="#casos-de-estudio"
            className="hover:text-[#ff758f] transition-colors flex items-center gap-1"
          >
            <span>Casos de Estudio</span>
            <span className="px-1.5 py-0.2 text-[9px] bg-[#cba135]/20 text-[#f2cf6b] rounded border border-[#cba135]/40">
              Testing Rudo
            </span>
          </a>
          <a
            href="#filosofia-testing"
            className="hover:text-[#ff758f] transition-colors"
          >
            Metodología
          </a>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f2cf6b] transition-colors flex items-center gap-1 text-[#f2cf6b]"
          >
            <span>renkaidev</span>
            <ExternalLink size={12} />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c29da5] hover:text-[#ff758f] flex items-center gap-1 transition-colors"
          >
            <span>LinkedIn</span>
            <ExternalLink size={12} />
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#f5dade] hover:text-white bg-[#0e111a] hover:bg-[#181c28] border border-[#281a24] flex items-center gap-1.5 transition"
          >
            <Download size={13} className="text-[#f2cf6b]" />
            <span>Descargar CV</span>
          </a>
          <button
            onClick={onOpenAudit}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] border border-[#cba135]/40 shadow-md hover:shadow-[0_0_15px_rgba(184,45,70,0.4)] transition-all cursor-pointer"
          >
            Solicitar Auditoría
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú de navegación"
          className="lg:hidden p-2 text-[#c29da5] hover:text-[#f2cf6b] rounded-lg bg-[#0e111a] border border-[#281a24]"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#281a24] bg-[#07080c] px-4 py-4 space-y-3">
          <a
            href="#fiscalis-spotlight"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#ff6b85] flex items-center gap-1"
          >
            <Flame size={14} className="text-[#cba135]" />
            <span>Fiscalis (Demo & QA)</span>
          </a>
          <a
            href="#soluciones"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#f5dade] hover:text-[#ff758f]"
          >
            Soluciones
          </a>
          <a
            href="#casos-de-estudio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#f5dade] hover:text-[#ff758f]"
          >
            Casos de Estudio (Testing Rudo)
          </a>
          <a
            href="#filosofia-testing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#f5dade] hover:text-[#ff758f]"
          >
            Metodología de Pruebas
          </a>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold text-[#f2cf6b] flex items-center gap-1"
          >
            <span>Ver Portafolio renkaidev</span>
            <ExternalLink size={13} />
          </a>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold text-[#f5dade] flex items-center gap-1"
          >
            <span>Descargar CV Oficial</span>
            <Download size={13} />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold text-[#c29da5] flex items-center gap-1"
          >
            <span>Perfil LinkedIn</span>
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
/*  Hero Section con Three.js 3D Interactivo                          */
/* ------------------------------------------------------------------ */

function HeroSection({ onOpenAudit }: { onOpenAudit: () => void }) {
  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        {/* Columna Izquierda: Mensaje y CTA */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge Formal con micro-glitch */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e111a] border border-[#b82d46]/50 shadow-inner">
            <Terminal size={14} className="text-[#f2cf6b]" />
            <span className="text-xs font-mono font-medium text-[#f5dade]">
              Pablo Valdés · Analista Programador & Backend Engineer
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Título Principal con Tipografía Rojo Vino y Efecto Glitch */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#f5dade] leading-tight drop-shadow-sm">
            Cero papel. Cero duplicidad. Resuelvo problemas críticos con{" "}
            <span className="glitch-hover inline-block vino-gradient-text cursor-default font-black">
              arquitectura de software rigurosa
            </span>
          </h1>

          {/* Subtítulo de propuesta de valor con fondo de contraste */}
          <div className="p-4 rounded-2xl bg-[#0e111a]/95 border border-[#281a24] backdrop-blur-md">
            <p className="text-sm sm:text-base text-[#f5dade] leading-relaxed font-normal">
              Especializado en <strong className="text-[#ff6b85]">Python, FastAPI y PostgreSQL</strong>. Creador de{" "}
              <strong className="text-[#f2cf6b]">Fiscalis</strong> (digitalización municipal con
              georreferenciación GPS y resiliencia offline-first). Resuelvo cuellos de botella en
              planillas Excel colapsadas, bases de datos lentas y software SaaS en arriendo.{" "}
              <span className="text-[#ff758f] font-bold underline decoration-[#cba135] underline-offset-4">
                No es un caso de éxito si no aprueba el testing riguroso.
              </span>
            </p>
          </div>

          {/* Botones de Acción Formal */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <a
              href="#fiscalis-spotlight"
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#721828] hover:from-[#9e233b] hover:to-[#cba135] border border-[#cba135]/50 shadow-[0_4px_25px_rgba(114,24,40,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame size={18} className="text-[#f2cf6b]" />
              <span>Conoce Fiscalis (Módulos & QA)</span>
            </a>

            <button
              onClick={onOpenAudit}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-[#f5dade] hover:text-[#f2cf6b] bg-[#0e111a] hover:bg-[#181c28] border border-[#281a24] hover:border-[#b82d46]/70 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles size={18} className="text-[#cba135]" />
              <span>Diagnóstico Rápido de tu Caso</span>
            </button>
          </div>

          {/* Métricas / Badges de Confiabilidad */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-[#0e111a] border border-[#281a24] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-[#f2cf6b]">72h → &lt;90s</div>
              <div className="text-xs text-[#c29da5]">En terreno con Fiscalis</div>
            </div>
            <div className="bg-[#0e111a] border border-[#281a24] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-[#ff6b85]">0%</div>
              <div className="text-xs text-[#c29da5]">Tolerancia a duplicidad</div>
            </div>
            <div className="bg-[#0e111a] border border-[#281a24] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-[#f2cf6b]">3FN / GIN</div>
              <div className="text-xs text-[#c29da5]">PostgreSQL relacional</div>
            </div>
            <div className="bg-[#0e111a] border border-[#281a24] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-emerald-400">100% Pass</div>
              <div className="text-xs text-[#c29da5]">Suite de pruebas rudas</div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Three.js 3D Interactive Canvas */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-full rounded-3xl bg-[#07080c] border-2 border-[#b82d46]/50 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* 3D Header Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0e111a]/95 border border-[#cba135]/40 px-3 py-1 rounded-full text-[11px] font-mono text-[#f2cf6b] backdrop-blur">
              <Boxes size={13} className="text-[#cba135]" />
              <span>Three.js 3D Architecture Node</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Canvas Three.js interactivo */}
            <ThreeArchitectureNode />

            {/* 3D Footer Descriptor */}
            <div className="mt-2 text-center text-xs font-mono text-[#c29da5] bg-[#0e111a] py-1.5 px-3 rounded-xl border border-[#281a24]">
              <span>Malla geométrica interactiva · Pasa el cursor para rotar</span>
            </div>
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
    <div className="w-full bg-gradient-to-r from-[#4d0c17] via-[#0e111a] to-[#0e111a] border-y border-[#b82d46]/40 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#721828] text-[#f2cf6b] border border-[#cba135]/40 shadow-inner">
            <Award size={22} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f2cf6b] block">
              Regla de Oro en Cada Entrega
            </span>
            <p className="text-sm font-semibold text-[#f5dade]">
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
/*  SHOWCASE EXCLUSIVO: Fiscalis con Carrusel de Hallazgos QA          */
/* ------------------------------------------------------------------ */

function FiscalisSpotlightSection({
  onSelectFiscalis,
}: {
  onSelectFiscalis: () => void;
}) {
  return (
    <section id="fiscalis-spotlight" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#721828]/60 border border-[#cba135]/50 text-xs font-bold text-[#f2cf6b] uppercase tracking-wider">
          <Flame size={14} className="text-[#cba135]" />
          Proyecto Insignia de Ingeniería & Terreno
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#ff6b85] tracking-tight">
          Fiscalis: El Sistema de Gestión Operativa que Erradicó el Papel
        </h2>
        <p className="text-sm sm:text-base text-[#f5dade] max-w-2xl mx-auto leading-relaxed">
          Diseñado, probado y documentado para fiscalización municipal y seguridad pública. De 72
          horas analógicas a menos de 90 segundos digitalizados con georreferenciación GPS y
          persistencia asíncrona.
        </p>
      </div>

      {/* Carrusel Interactivo de Módulos & Documentación QA */}
      <FiscalisCarousel />

      {/* Botones de acción directa de Fiscalis */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://renkaidev-web.renkaidev.workers.dev/casos/fiscalis"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] transition-all flex items-center gap-2 border border-[#cba135]/40 shadow-lg"
        >
          <span>Explorar Showcase Interactivo en Canvas & Video</span>
          <ExternalLink size={14} />
        </a>
        <button
          onClick={onSelectFiscalis}
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-[#f2cf6b] bg-[#0e111a] hover:bg-[#181c28] border border-[#281a24] hover:border-[#cba135]/60 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileCheck2 size={14} className="text-[#f2cf6b]" />
          <span>Ver Expediente Técnico Modal</span>
        </button>
      </div>
    </section>
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721828]/50 border border-[#cba135]/40 text-xs font-bold text-[#f2cf6b] uppercase tracking-wider">
          <FlaskConical size={13} />
          Casos de Estudio Reales de Pablo Valdés
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff758f]">
          Sistemas sometidos a pruebas rudas antes de tocar producción
        </h2>
        <p className="text-sm sm:text-base text-[#c29da5]">
          Haz clic en cualquier caso para abrir el expediente técnico, métricas de estrés y enlace directo a la documentación en vivo.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {CASE_STUDIES.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCase(c)}
            className="group relative bg-[#0e111a] hover:bg-[#141824] border border-[#281a24] hover:border-[#b82d46]/70 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-[0_10px_35px_rgba(114,24,40,0.4)] cursor-pointer flex flex-col justify-between"
          >
            {/* Header Card */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#c29da5] mb-3">
                <span className="font-mono text-[#f2cf6b]">PROYECTO #{c.id.toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded bg-[#721828]/70 text-[#f2cf6b] text-[10px] font-bold">
                  TESTING CERTIFICADO
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#ff6b85] group-hover:text-[#f2cf6b] transition-colors mb-2">
                {c.title}
              </h3>
              <p className="text-xs text-[#f5dade] mb-4 line-clamp-3 leading-relaxed">
                {c.problem}
              </p>

              {/* Batería resumida */}
              <div className="space-y-2 mb-4 bg-[#07080c] p-3 rounded-xl border border-[#281a24]">
                <div className="text-[11px] font-bold text-[#ff758f] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Prueba de Estrés Superada:
                </div>
                <div className="text-xs font-mono text-[#f2cf6b] truncate">
                  {c.rudaTest[0].metrics}
                </div>
              </div>
            </div>

            {/* Footer Card */}
            <div className="pt-3 border-t border-[#281a24] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f5dade] group-hover:text-[#f2cf6b] flex items-center gap-1">
                Ver expediente y demo
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xs text-[#c29da5] font-mono">
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
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff758f]">
          No vendo líneas de código: resuelvo los cuellos de botella que frenan tu negocio
        </h2>
        <p className="text-sm sm:text-base text-[#c29da5]">
          Compara el dolor operativo habitual frente a la solución de ingeniería definitiva que implemento.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#0e111a] border border-[#281a24] hover:border-[#b82d46]/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#721828] to-[#0e111a] text-[#f2cf6b] border border-[#cba135]/40">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#181c28] text-[#f2cf6b] border border-[#281a24]">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#ff6b85] mb-1">{s.title}</h3>
                <span className="text-xs text-[#f2cf6b] font-semibold block mb-4">
                  {s.tag}
                </span>

                {/* El Dolor (Pain Point) */}
                <div className="mb-3 p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-xs">
                  <span className="font-bold text-[#ff758f] block mb-1">
                    El Dolor Real:
                  </span>
                  <p className="text-[#f5dade] leading-relaxed">{s.problem}</p>
                </div>

                {/* La Solución */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs">
                  <span className="font-bold text-emerald-300 block mb-1">
                    Solución de Ingeniería:
                  </span>
                  <p className="text-[#f5dade] leading-relaxed">{s.solution}</p>
                </div>
              </div>

              {/* Botón rápido de cotizar */}
              <div className="pt-4 mt-4 border-t border-[#281a24] flex items-center justify-between">
                <button
                  onClick={() => onOpenAudit(s.title)}
                  className="text-xs font-bold text-[#f2cf6b] hover:text-[#ff758f] flex items-center gap-1 transition-colors cursor-pointer"
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
    <section id="filosofia-testing" className="py-20 px-4 sm:px-6 bg-[#07080c] border-y border-[#281a24]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721828]/50 border border-[#cba135]/40 text-xs font-bold text-[#f2cf6b] uppercase">
            <ShieldCheck size={14} />
            Metodología de Validación Extrema
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff758f]">
            ¿Por qué un sistema no es un éxito sin testing rudo?
          </h2>
          <p className="text-sm sm:text-base text-[#c29da5]">
            En desarrollo de software, la mayoría de los problemas ocurren después de cobrar, cuando el cliente carga sus datos reales. Nosotros probamos bajo condiciones extremas antes de entregar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-[#0e111a] border border-[#281a24] rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="text-4xl font-black font-mono text-[#80182a]/70 mb-3">
                {st.step}
              </div>
              <h3 className="text-base font-bold text-[#ff6b85] mb-2">{st.title}</h3>
              <p className="text-xs text-[#f5dade] leading-relaxed">{st.desc}</p>
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
      <div className="bg-gradient-to-br from-[#0e111a] via-[#141824] to-[#07080c] border border-[#b82d46]/50 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f2cf6b] font-bold">
              Portafolio Oficial & Trayectoria
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff6b85]">
              Pablo Valdés — Desarrollador Backend & Analista Programador
            </h2>
            <p className="text-sm sm:text-base text-[#f5dade] leading-relaxed">
              Especializado en Python, FastAPI y PostgreSQL. Resuelvo problemas de lógica, persistencia y arquitectura limpia con un enfoque analítico riguroso. Puedes explorar mi portafolio completo en renkaidev, revisar el código en GitHub o descargar mi CV oficial.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] transition-all flex items-center gap-2 shadow-md border border-[#cba135]/40"
              >
                <span>Explorar renkaidev.workers.dev</span>
                <ExternalLink size={14} />
              </a>
              <a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-[#f2cf6b] bg-[#0e111a] hover:bg-[#181c28] border border-[#281a24] transition-colors flex items-center gap-2"
              >
                <Download size={14} className="text-[#f2cf6b]" />
                <span>Descargar CV</span>
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0A66C2] hover:bg-[#004182] transition-colors flex items-center gap-2 shadow-md"
              >
                <span>LinkedIn</span>
                <ExternalLink size={14} />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-[#f2cf6b] bg-[#0e111a] border border-[#281a24] transition-colors flex items-center gap-2"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub (naxo16)</span>
              </a>
            </div>
          </div>

          {/* Tarjeta de Resumen Técnico */}
          <div className="w-full lg:w-80 bg-[#07080c] border border-[#281a24] rounded-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#281a24]">
              <span className="text-[#c29da5]">Estado Profesional:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                Disponible
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#281a24]">
              <span className="text-[#c29da5]">Core Stack:</span>
              <span className="text-[#f2cf6b]">FastAPI · Python · PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#281a24]">
              <span className="text-[#c29da5]">Teléfono Directo:</span>
              <a href={`tel:+${PHONE_NUMBER}`} className="text-[#ff6b85] hover:text-[#f2cf6b] font-bold">
                +{PHONE_NUMBER}
              </a>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#281a24]">
              <span className="text-[#c29da5]">Contacto Directo:</span>
              <a href={`mailto:${EMAIL_DIRECT}`} className="text-[#f5dade] hover:text-[#f2cf6b]">
                {EMAIL_DIRECT}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#c29da5]">Ubicación:</span>
              <span className="text-[#f5dade]">Chile (Remoto / Presencial)</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721828]/50 border border-[#cba135]/40 text-xs font-bold text-[#f2cf6b] uppercase">
            Iniciemos con un análisis serio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff758f]">
            Explícame tu cuello de botella y te entrego una solución técnica probada
          </h2>
          <p className="text-[#f5dade] text-sm sm:text-base leading-relaxed">
            Ya sea una macro en Excel que no para de fallar, una base de datos que tarda una eternidad, o la necesidad de contar con un software propio en modalidad de arriendo: conversemos sin compromiso.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-[#f5dade]">
              <CheckCircle2 size={18} className="text-[#f2cf6b]" />
              <span>Respuesta técnica directa por Pablo Valdés en menos de 24 horas.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#f5dade]">
              <CheckCircle2 size={18} className="text-[#f2cf6b]" />
              <span>Propuesta con alcance claro, estimación y protocolo de testing riguroso.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#f5dade]">
              <CheckCircle2 size={18} className="text-[#f2cf6b]" />
              <span>Atención telefónica directa al: <strong className="text-[#ff6b85]">+{PHONE_NUMBER}</strong></span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onOpenAudit("duplicidad")}
              className="text-xs font-bold uppercase tracking-wider text-[#f2cf6b] hover:text-[#ff758f] underline underline-offset-4 cursor-pointer text-left"
            >
              ¿Prefieres el asistente de diagnóstico rápido? Haz clic aquí.
            </button>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="bg-[#0e111a] border border-[#281a24] rounded-2xl p-6 sm:p-8 shadow-xl">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#f2cf6b] mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-[#ff6b85]">¡Mensaje Recibido!</h3>
              <p className="text-sm text-[#f5dade] max-w-sm mx-auto">
                Tu requerimiento fue ingresado exitosamente en nuestra base de datos. Pablo Valdés lo revisará a la brevedad.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] bg-[#141824] border border-[#281a24]"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <h3 className="text-xl font-bold text-[#ff6b85] mb-1">
                Formulario de Consulta Técnica
              </h3>
              <p className="text-xs text-[#c29da5] mb-4">
                Todos los campos son procesados de forma confidencial.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-[#f5dade] mb-1">
                  Nombre o Empresa *
                </label>
                <input
                  id="contact-name"
                  required
                  type="text"
                  placeholder="Tu nombre o empresa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#07080c] border border-[#281a24] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#f5dade] placeholder-[#7d5e65] text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-[#f5dade] mb-1">
                  Correo Electrónico *
                </label>
                <input
                  id="contact-email"
                  required
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#07080c] border border-[#281a24] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#f5dade] placeholder-[#7d5e65] text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="contact-service" className="block text-xs font-semibold text-[#f5dade] mb-1">
                  Área de Interés Principal
                </label>
                <select
                  id="contact-service"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-[#07080c] border border-[#281a24] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#f5dade] text-sm transition"
                >
                  <option value="Fiscalis / Terreno">Fiscalis (Inspección y Seguridad en Terreno)</option>
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
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#f5dade] mb-1">
                  Describe tu necesidad o problema *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Detalla qué volumen manejas, cuántas personas sufren el problema o qué objetivo buscas cumplir..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#07080c] border border-[#281a24] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2 text-[#f5dade] placeholder-[#7d5e65] text-sm transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition shadow-[0_4px_25px_rgba(184,45,70,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
    <footer className="border-t border-[#281a24] bg-[#07080c] py-10 px-4 sm:px-6 text-[#c29da5] text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-[#ff6b85] tracking-tight">Pablo Valdés</span> · naxoresuelve / renkaidev
          <div className="text-[11px] text-[#c29da5] mt-0.5">
            Ingeniería de software, persistencia en PostgreSQL, FastAPI y testing riguroso.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1 text-[#f2cf6b]"
          >
            <span>renkaidev.workers.dev</span>
            <ExternalLink size={11} />
          </a>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff758f] transition flex items-center gap-1"
          >
            <span>CV</span>
            <Download size={11} />
          </a>
          <a
            href={`tel:+${PHONE_NUMBER}`}
            className="hover:text-[#f2cf6b] transition flex items-center gap-1 text-[#f5dade]"
          >
            <span>+{PHONE_NUMBER}</span>
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff758f] transition flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ExternalLink size={11} />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff758f] transition flex items-center gap-1"
          >
            <span>GitHub</span>
            <GithubIcon className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}
