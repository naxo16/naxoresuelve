"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
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
  ShoppingBag,
  Tag,
  Percent,
  Zap,
  Lock,
  Gift,
  UserCheck,
  Play,
  Cpu,
  Home as HomeIcon,
  Video,
  Laptop,
  Wrench,
} from "lucide-react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CaseStudyModal, type CaseStudyData } from "@/components/CaseStudyModal";
import { AuditModal } from "@/components/AuditModal";
import { ThreeArchitectureNode } from "@/components/ThreeArchitectureNode";
import { FiscalisCarousel } from "@/components/FiscalisCarousel";
import { ModernCanvasVideoPlayer } from "@/components/ModernCanvasVideoPlayer";
import { ServicesQuickModal } from "@/components/ServicesQuickModal";
import { CyberLateralSidebar } from "@/components/CyberLateralSidebar";
import { SdlcLifecycleCarousel } from "@/components/SdlcLifecycleCarousel";

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
  {
    icon: Cpu,
    title: "Electrónica General & Arduino IoT",
    tag: "Automatización física y prototipado a medida",
    problem:
      "¿Necesitas automatizar un proceso físico en terreno, programar microcontroladores Arduino o ESP32 con sensores y relevadores y te falta el diseño electrónico?",
    solution:
      "Diseño de circuitos, ensamble, programación de firmware C++/Python, integración de sensores industriales y automatización física con pruebas de estrés en banco.",
    badge: "Consultoría $15.000 CLP",
  },
  {
    icon: HomeIcon,
    title: "Domótica & Espacios Inteligentes",
    tag: "Control total de luces, accesos y clima desde el celular",
    problem:
      "¿Consumo eléctrico disparado, cerraduras mecánicas vulnerables o deseos de modernizar tu hogar u oficina sin amarrarte a mensualidades abusivas?",
    solution:
      "Implementación de ecosistemas domóticos inteligentes (iluminación, enchufes de corte automático, cerraduras biométricas y sensores de movimiento) operados desde tu smartphone.",
    badge: "Hogar/Oficina Smart",
  },
  {
    icon: Video,
    title: "Instalación de Cámaras de Seguridad (CCTV / IP)",
    tag: "Monitoreo 24/7 en tu celular sin cuotas mensuales",
    problem:
      "¿Puntos ciegos de seguridad en tu empresa o propiedad, cámaras obsoletas o empresas de alarmas que cobran mensualidades eternas por ver tu propia grabación?",
    solution:
      "Instalación y configuración de cámaras cableadas e IP Wi-Fi de alta resolución con visión nocturna, detección inteligente y monitoreo directo en tu teléfono sin pagos mensuales.",
    badge: "CCTV Sin Cuotas",
  },
  {
    icon: Laptop,
    title: "Servicio Técnico: Computadores, Notebooks & Celulares",
    tag: "Mantenimiento, placas madre y cambio de componentes",
    problem:
      "¿Notebooks que hierven de temperatura, computadores lentos que no encienden, pantallas rotas de celulares o baterías degradadas que frenan tu productividad?",
    solution:
      "Diagnóstico inicial en taller por solo $15.000 CLP (abonable al total del arreglo). Cambio de pasta térmica, upgrades de SSD/RAM, reparación de placas y cambio de pantallas.",
    badge: "Diagnóstico $15.000 CLP",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<CaseStudyData | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [auditTopic, setAuditTopic] = useState("duplicidad");

  const openAudit = (topic = "duplicidad") => {
    setAuditTopic(topic);
    setAuditModalOpen(true);
  };

  return (
    <>
      {/* Background Decorativo con Objetos Flotantes Seguros (25% Luminosidad & Tinte Blanco) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#3a3640]">
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
        {/* Hero Section con Three.js 3D Interactivo y Popup de Servicios */}
        <HeroSection
          onOpenAudit={() => openAudit("general")}
          onOpenServices={() => setServicesModalOpen(true)}
        />

        {/* Banner de Filosofía de Testing Rudo */}
        <TestingRudoBanner />

        {/* SHOWCASE DESTACADO: Fiscalis con Carrusel de Hallazgos QA */}
        <FiscalisSpotlightSection onSelectFiscalis={() => setSelectedCase(CASE_STUDIES[0])} />

        {/* DEMOSTRACIÓN EN VIDEO CON CANVAS 2D & VOZ IA GUÍA */}
        <CanvasVideoDemonstrationSection onOpenAudit={openAudit} />

        {/* Sección de Casos de Estudio Reales & Telemetría */}
        <CaseStudiesSection onSelectCase={setSelectedCase} />

        {/* Servicios Orientados a Problemas Reales */}
        <ServicesSection onOpenAudit={openAudit} />

        {/* Promociones In-Web, Captura Email/WhatsApp Marketing & Preventa Tienda Multi-SaaS */}
        <PromotionsAndStoreSection onOpenAudit={openAudit} />

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

      <ServicesQuickModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        onOpenAudit={openAudit}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

function Navbar({ onOpenAudit }: { onOpenAudit: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Menú Lateral Desplegable Cyberpunk con soporte Multilingüe */}
      <CyberLateralSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAudit={onOpenAudit}
        cvUrl={CV_URL}
        portfolioUrl={PORTFOLIO_URL}
        linkedinUrl={LINKEDIN_URL}
      />

      {/* Barra de Estado Minimalista Superior */}
      <header className="sticky top-0 z-30 bg-[#2a242c]/95 backdrop-blur-xl border-b border-[#615362]/60 px-4 sm:px-6 py-2.5 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* Brand Logo, Trigger & Telemetría */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú lateral de navegación"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#721828]/85 hover:bg-[#721828] text-[#f2cf6b] border border-[#cba135]/60 hover:border-[#f2cf6b] shadow-md transition font-round text-xs font-bold cursor-pointer shrink-0"
            >
              <Menu size={18} />
              <span className="hidden sm:inline">MENÚ</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/40 border border-[#cba135]/40 font-mono">
                [HUD]
              </span>
            </button>

            <a href="#" className="flex items-center gap-2 group min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#721828] to-[#cba135] flex items-center justify-center font-bold text-white shadow-md border border-[#cba135]/40 font-round text-sm group-hover:scale-105 transition-transform shrink-0">
                PV
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-[#ff6b85] flex items-center gap-1.5 font-round truncate">
                  Pablo Valdés
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#721828]/80 text-[#f2cf6b] border border-[#cba135]/40 shrink-0">
                    naxoresuelve
                  </span>
                </span>
                <span className="hidden md:inline-block text-[10px] text-[#c29da5] truncate">
                  Arquitectura de Software · Testing Rudo & Hardware
                </span>
              </div>
            </a>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] bg-[#362f37] hover:bg-[#423943] border border-[#615362] transition font-round"
            >
              <Lock size={12} className="text-[#f2cf6b]" />
              <span>Portal</span>
            </Link>

            <button
              onClick={onOpenAudit}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:scale-105 active:scale-95 border border-[#cba135]/50 shadow-md transition-all cursor-pointer flex items-center gap-1.5 font-round tracking-wider"
            >
              <Send size={12} />
              <span>Diagnóstico $0</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section con Three.js 3D Interactivo                          */
/* ------------------------------------------------------------------ */

function HeroSection({
  onOpenAudit,
  onOpenServices,
}: {
  onOpenAudit: () => void;
  onOpenServices: () => void;
}) {
  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        {/* Columna Izquierda: Mensaje y CTA */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge Formal con micro-glitch */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#423943] border border-[#b82d46]/50 shadow-inner">
            <Terminal size={14} className="text-[#f2cf6b]" />
            <span className="text-xs font-mono font-medium text-[#f5dade]">
              Pablo Valdés · Sistemas con Código Limpio, Mantenible & Arquitectura Robusta
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Título Principal: Código Limpio, Mantenible, Robusto + Resultados */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#f5dade] leading-tight drop-shadow-sm">
            Sistemas con código limpio y mantenible:{" "}
            <span className="glitch-hover inline-block vino-gradient-text cursor-default font-black">
              Arquitectura robusta certificada con testing rudo para erradicar errores
            </span>
          </h1>

          {/* Subtítulo de propuesta de valor natural y directa solicitada */}
          <div className="p-4 rounded-2xl bg-[#423943]/95 border border-[#615362] backdrop-blur-md">
            <p className="text-sm sm:text-base text-[#f5dade] leading-relaxed font-normal">
              Reduce errores en tu negocio en simples pasos con soluciones de motor rápido, ahorra tiempo, perder dinero, y calentarte menos la cabeza con <strong className="text-[#ff6b85] font-black">naxo resuelve</strong>.{" "}
              <span className="text-[#f2cf6b] font-medium block mt-1.5">
                Automatizaciones en Python, bases de datos PostgreSQL optimizadas y aplicaciones en terreno (Fiscalis) para que tu empresa opere sin caídas ni descalces.
              </span>
            </p>
          </div>

          {/* Botones de Acción: Ver Servicios Pop-up + Diagnóstico + Fiscalis */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onOpenServices}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 border border-[#cba135]/50 shadow-[0_4px_25px_rgba(114,24,40,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={18} className="text-[#f2cf6b]" />
              <span>Ver Servicios & Soluciones (Pop-up)</span>
            </button>

            <button
              onClick={onOpenAudit}
              className="px-5 py-3.5 rounded-xl font-bold text-sm text-[#f5dade] hover:text-[#f2cf6b] bg-[#423943] hover:bg-[#4c424e] border border-[#615362] hover:border-[#b82d46]/70 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Zap size={16} className="text-[#f2cf6b]" />
              <span>Diagnóstico Rápido de tu Caso</span>
            </button>

            <a
              href="#fiscalis-spotlight"
              className="px-4 py-3.5 rounded-xl font-semibold text-xs text-[#c29da5] hover:text-[#f5dade] bg-[#2a242c] hover:bg-[#362f37] border border-[#615362] transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <Flame size={14} className="text-[#cba135]" />
              <span>Ver Fiscalis QA</span>
            </a>
          </div>

          {/* Métricas / Badges de Confiabilidad */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-[#423943] border border-[#615362] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-[#f2cf6b]">72h → &lt;90s</div>
              <div className="text-xs text-[#c29da5]">En terreno con Fiscalis</div>
            </div>
            <div className="bg-[#423943] border border-[#615362] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-[#ff6b85]">0%</div>
              <div className="text-xs text-[#c29da5]">Tolerancia a duplicidad</div>
            </div>
            <div className="bg-[#423943] border border-[#615362] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-[#f2cf6b]">3FN / GIN</div>
              <div className="text-xs text-[#c29da5]">PostgreSQL relacional</div>
            </div>
            <div className="bg-[#423943] border border-[#615362] rounded-xl p-3.5 shadow-md">
              <div className="text-xl font-mono font-bold text-emerald-400">100% Pass</div>
              <div className="text-xs text-[#c29da5]">Suite de pruebas rudas</div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Three.js 3D Interactive Canvas */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-full rounded-3xl bg-[#362f37] border-2 border-[#b82d46]/50 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* 3D Header Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#423943]/95 border border-[#cba135]/40 px-3 py-1 rounded-full text-[11px] font-mono text-[#f2cf6b] backdrop-blur">
              <Boxes size={13} className="text-[#f2cf6b]" />
              <span>Three.js 3D Architecture Node</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Canvas Three.js interactivo */}
            <ThreeArchitectureNode />

            {/* 3D Footer Descriptor */}
            <div className="mt-2 text-center text-xs font-mono text-[#c29da5] bg-[#423943] py-1.5 px-3 rounded-xl border border-[#615362]">
              <span>Malla geométrica interactiva · Pasa el cursor para rotar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Carrusel del Ciclo de Vida del Software (SDLC) & Resultados       */
/* ------------------------------------------------------------------ */

function TestingRudoBanner() {
  return <SdlcLifecycleCarousel />;
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
          <Flame size={14} className="text-[#f2cf6b]" />
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
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-[#f2cf6b] bg-[#423943] hover:bg-[#4c424e] border border-[#615362] hover:border-[#cba135]/60 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FileCheck2 size={14} className="text-[#f2cf6b]" />
          <span>Ver Expediente Técnico Modal</span>
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Demostración en Video con Renderizador Canvas 2D & Guía Voz IA    */
/* ------------------------------------------------------------------ */

function CanvasVideoDemonstrationSection({
  onOpenAudit,
}: {
  onOpenAudit: (topic: string) => void;
}) {
  return (
    <section id="video-preview" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
      {/* Glow ambiental cyberpunk multicapa */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#721828]/25 blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-[#cba135]/15 blur-[140px] pointer-events-none -z-10" />

      <div className="text-center max-w-5xl mx-auto mb-16 space-y-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#721828]/90 via-[#423943] to-[#721828]/90 border-2 border-[#cba135] text-xs sm:text-sm font-bold text-[#f2cf6b] uppercase tracking-widest shadow-[0_0_25px_rgba(203,161,53,0.35)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f2cf6b] shadow-[0_0_10px_#f2cf6b] animate-ping" />
          <Play size={15} className="text-[#f2cf6b] fill-[#f2cf6b]" />
          <span>[ LIVE DEMO // RENDER CANVAS 2D & GUÍA VOZ IA SINTETIZADA ]</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#ff6b85] to-[#f2cf6b] tracking-tight leading-[1.08] drop-shadow-[0_4px_30px_rgba(184,45,70,0.5)] font-cyber">
          Demostración en Vivo: Dashboard Agrícola & Automatización de Contratistas
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl text-[#f5dade] max-w-4xl mx-auto leading-relaxed font-medium">
          Examina cómo erradicamos el{" "}
          <strong className="text-[#f2cf6b] font-bold px-2 py-0.5 rounded bg-[#721828]/50 border border-[#cba135]/50 shadow-[0_0_12px_rgba(203,161,53,0.3)]">
            100% de errores de duplicidad
          </strong>{" "}
          y rescatamos más de{" "}
          <strong className="text-[#ff6b85] font-bold px-2 py-0.5 rounded bg-[#721828]/50 border border-[#b82d46]/50 shadow-[0_0_12px_rgba(184,45,70,0.3)]">
            38 horas semanales
          </strong>{" "}
          en faenas agrícolas. Haz clic en el botón superior del reproductor o en el teleprompter para escuchar la{" "}
          <strong className="text-[#f2cf6b] font-bold underline decoration-[#cba135] decoration-2 underline-offset-4">
            Voz IA guiando la solución
          </strong>{" "}
          en tiempo real con voz natural en español.
        </p>
      </div>

      {/* Modern Canvas Video Player with AI Voice Guide */}
      <ModernCanvasVideoPlayer />
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
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff6b85]">
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
            className="group relative bg-[#423943] hover:bg-[#362f37] border border-[#615362] hover:border-[#b82d46]/70 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-[0_10px_35px_rgba(114,24,40,0.4)] cursor-pointer flex flex-col justify-between"
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
              <div className="space-y-2 mb-4 bg-[#362f37] p-3 rounded-xl border border-[#615362]">
                <div className="text-[11px] font-bold text-[#ff6b85] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Prueba de Estrés Superada:
                </div>
                <div className="text-xs font-mono text-[#f2cf6b] truncate">
                  {c.rudaTest[0].metrics}
                </div>
              </div>
            </div>

            {/* Footer Card */}
            <div className="pt-3 border-t border-[#615362] flex items-center justify-between">
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
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff6b85]">
          No vendo líneas de código: resuelvo los cuellos de botella que frenan tu negocio
        </h2>
        <p className="text-sm sm:text-base text-[#c29da5]">
          Compara el dolor operativo habitual frente a la solución de ingeniería definitiva que implemento.
        </p>
      </div>

      {/* Banner Destacado: Electrónica, Arduino, Domótica & Reparación de Hardware */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#721828]/50 via-[#423943] to-[#362f37] border-2 border-[#cba135]/60 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#721828] to-[#cba135] text-white shadow-lg shrink-0">
            <Cpu size={28} />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#721828] text-[#f2cf6b] text-xs font-mono font-bold uppercase tracking-wider border border-[#cba135]/40">
              <Zap size={13} />
              <span>Nueva Especialidad en Hardware & Terreno</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#ff6b85]">
              Electrónica, Arduino, Domótica, Cámaras & Reparación de Dispositivos
            </h3>
            <p className="text-xs sm:text-sm text-[#f5dade] leading-relaxed max-w-3xl">
              Cubrimos todo tipo de electrónica: automatización con microcontroladores Arduino/ESP32, casas y oficinas inteligentes, cámaras de seguridad CCTV sin pagos mensuales, y arreglo integral de notebooks, computadores y celulares.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-mono text-[#f2cf6b]">
              <span className="bg-[#362f37] px-2.5 py-1 rounded-lg border border-[#615362]">
                🔧 Consultoría & Diagnóstico Inicial: <strong>$15.000 CLP</strong>
              </span>
              <span className="text-[#c29da5]">
                (El valor se descuenta del monto final al aprobar el arreglo o instalación)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenAudit("electronica_arduino")}
          className="w-full lg:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] transition shadow-lg border border-[#cba135]/50 shrink-0 text-center cursor-pointer"
        >
          Agendar Diagnóstico ($15.000 CLP)
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#423943] border border-[#615362] hover:border-[#b82d46]/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#721828] to-[#0e111a] text-[#f2cf6b] border border-[#cba135]/40">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#4c424e] text-[#f2cf6b] border border-[#615362]">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#ff6b85] mb-1">{s.title}</h3>
                <span className="text-xs text-[#f2cf6b] font-semibold block mb-4">
                  {s.tag}
                </span>

                {/* El Dolor (Pain Point) */}
                <div className="mb-3 p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-xs">
                  <span className="font-bold text-[#ff6b85] block mb-1">
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
              <div className="pt-4 mt-4 border-t border-[#615362] flex items-center justify-between">
                <button
                  onClick={() => onOpenAudit(s.title)}
                  className="text-xs font-bold text-[#f2cf6b] hover:text-[#ff6b85] flex items-center gap-1 transition-colors cursor-pointer"
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
/*  Promociones In-Web, Captura Email/WhatsApp & Tienda Multi-SaaS    */
/* ------------------------------------------------------------------ */

function PromotionsAndStoreSection({
  onOpenAudit,
}: {
  onOpenAudit: (topic: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+56 9 ");
  const [selectedPromo, setSelectedPromo] = useState("Diagnóstico Forense 100% Bonificado");
  const [subscribedMarketing, setSubscribedMarketing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const PROMO_OPTIONS = [
    {
      id: "diagnostico",
      title: "Diagnóstico Forense de Base de Datos & Procesos",
      value: "Diagnóstico Forense 100% Bonificado",
      badge: "100% Bonificado · Este Mes",
      valText: "Valor regular: $150.000 CLP",
      icon: FlaskConical,
      benefit:
        "Informe confidencial de 3 páginas en <24 horas identificando por qué colapsan tus consultas o dónde se duplican tus registros.",
      targetChannel: "Email + Sesión 20 min WhatsApp",
    },
    {
      id: "consultoria-hardware",
      title: "Diagnóstico Electrónica & Hardware por $15.000 CLP",
      value: "Diagnóstico Hardware & Electrónica por $15.000 CLP",
      badge: "Tarifa Fija Promocional",
      valText: "Valor: $15.000 CLP (Abonable a Reparación)",
      icon: Cpu,
      benefit:
        "Revisión técnica de circuitos Arduino, domótica, cámaras de seguridad, notebooks y celulares. Se abona al costo si se aprueba el trabajo.",
      targetChannel: "Email + Coordinación WhatsApp",
    },
    {
      id: "kit-python",
      title: "Kit Python Automatización Excel Anti-Duplicados",
      value: "Kit Python Automatización Excel Anti-Duplicados",
      badge: "Descarga Inmediata para Suscriptores",
      valText: "Valor regular: $60.000 CLP",
      icon: FileSpreadsheet,
      benefit:
        "Script productivo listo para ejecutar que limpia planillas masivas, valida RUTs y elimina registros clonados sin fórmulas rotas.",
      targetChannel: "Entrega Inmediata a tu Email Corporativo",
    },
    {
      id: "preventa-tienda",
      title: "Pase Fundador 30% OFF en la Próxima Tienda Digital",
      value: "Pase Fundador 30% OFF Próxima Tienda Multi-SaaS",
      badge: "Descuento Vitalicio",
      valText: "Válido para todo el catálogo multi-producto",
      icon: Percent,
      benefit:
        "Asegura un 30% de descuento vitalicio en paquetes de software en arriendo mensual, sincronizadores y módulos listos para desplegar.",
      targetChannel: "Aviso Prioritario por WhatsApp y Correo",
    },
  ];

  const UPCOMING_PRODUCTS = [
    {
      name: "Fiscalis Cloud Lite",
      category: "SaaS en Arriendo Mensual",
      badge: "Inspección & Seguridad",
      price: "$29.990 CLP / mes",
      discountPrice: "$20.990 CLP / mes (Preventa)",
      desc: "App móvil offline-first y panel web para digitalización de actas, fiscalización en terreno y trazabilidad sin papel.",
      features: ["Sincronización Offline", "Georreferenciación GPS", "MFA TOTP", "Reportes PDF"],
    },
    {
      name: "IoT Sentinel Hub & Domótica",
      category: "Hardware + Firmware IoT",
      badge: "Domótica & CCTV",
      price: "$49.990 CLP",
      discountPrice: "$34.990 CLP (Preventa)",
      desc: "Módulo ESP32/Arduino preconfigurado para control de reles, enlace con cámaras IP y alertas instantáneas a tu teléfono.",
      features: ["Firmware C++/Python", "Sin Mensualidades", "Alertas WhatsApp", "Corte Remoto"],
    },
    {
      name: "Deduplicator Pro Engine",
      category: "Microservicio Docker / Script",
      badge: "Base de Datos & Ingesta",
      price: "$49.990 CLP",
      discountPrice: "$34.990 CLP (Preventa)",
      desc: "Motor de carga masiva de archivos pesados con algoritmos de deduplicación difusa y consistencia transaccional PostgreSQL.",
      features: ["Pipeline Asíncrono", "Fuzzy Matching", "Validación RUT/PPU", "0 Memory Leaks"],
    },
    {
      name: "Executive BI Live Dashboard",
      category: "SaaS Analytics & Telemetría",
      badge: "Toma de Decisiones",
      price: "$39.990 CLP / mes",
      discountPrice: "$27.990 CLP / mes (Preventa)",
      desc: "Tablero de control ejecutivo en tiempo real conectado a bases de datos operativas y mapas de posicionamiento local.",
      features: ["KPIs en Tiempo Real", "Alertas por WhatsApp", "Google Maps Sync", "Exportación 1-clic"],
    },
    {
      name: "Multi-Store Digital Core",
      category: "Arquitectura E-Commerce",
      badge: "Tienda Virtual Multi-Producto",
      price: "$89.990 CLP",
      discountPrice: "$62.990 CLP (Preventa)",
      desc: "Arquitectura moderna y de máxima velocidad para tiendas online con pasarelas chilenas de pago, catálogo dinámico y panel admin.",
      features: ["Checkout Rápido", "Control de Stock", "Integración Webpay", "SEO Técnico 98+"],
    },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const marketingMessage = `[CAMPAÑA_IN_WEB: PROMOCIONES & PREVENTA TIENDA VIRTUAL]
Beneficio Solicitado: ${selectedPromo}
Nombre / Razón Social: ${name}
Email Corporativo: ${email}
WhatsApp Contacto: ${phone}
Suscripción Email Marketing & WhatsApp Marketing: ${subscribedMarketing ? "SÍ (Aceptada)" : "NO"}
Fecha Solicitud: 2026`;

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: marketingMessage,
        }),
      });

      if (!res.ok) {
        throw new Error(
          "No fue posible registrar tu promoción en la base de datos. Puedes escribirnos directo al WhatsApp."
        );
      }

      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error de red al procesar tu solicitud promocional.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  const whatsappPromoLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    `Hola Pablo, acabo de registrarme en la promoción de naxoresuelve para asegurar mi beneficio de "${selectedPromo}". Mi nombre es ${name || "Cliente"} y mi correo es ${email || "mi correo"}.`
  )}`;

  return (
    <section id="promociones" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
      {/* Glow ambiental vino y oro */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#721828]/20 blur-[160px] pointer-events-none -z-10" />

      {/* Header de la Sección */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#721828]/60 border border-[#cba135]/50 text-xs font-bold text-[#f2cf6b] uppercase tracking-wider shadow-lg">
          <Tag size={13} className="text-[#f2cf6b]" />
          <span>Promociones In-Web & Estrategia de Lanzamiento</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[#ff6b85] tracking-tight leading-tight">
          Acelera tu Empresa con Soluciones Reales y Asegura Tu Cupo en Nuestra Próxima Tienda Virtual
        </h2>
        <p className="text-sm sm:text-base text-[#f5dade] leading-relaxed">
          El costo de convivir con planillas rotas, sistemas caídos y registros duplicados supera con creces el valor de implementar ingeniería profesional. Suscríbete a nuestro canal de inteligencia técnica: te entregamos herramientas gratuitas hoy y te aseguramos descuentos de preventa en nuestra próxima tienda de soluciones de software.
        </p>
      </div>

      {/* Grid de 3 Lead Magnets Persuasivos */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {PROMO_OPTIONS.map((promo) => {
          const Icon = promo.icon;
          const isSelected = selectedPromo === promo.value;
          return (
            <div
              key={promo.id}
              onClick={() => setSelectedPromo(promo.value)}
              className={`rounded-2xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-b from-[#181c28] to-[#0e111a] border-[#cba135] shadow-[0_0_25px_rgba(203,161,53,0.25)] scale-[1.02]"
                  : "bg-[#423943] border-[#615362] hover:border-[#721828]/80 hover:bg-[#362f37]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#cba135] to-[#721828] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <CheckCircle2 size={11} />
                  <span>Seleccionado</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#721828] to-[#07080c] border border-[#cba135]/40 flex items-center justify-center text-[#f2cf6b]">
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#721828]/60 text-[#f2cf6b] border border-[#721828] font-bold">
                    {promo.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#ff6b85] mb-1.5 leading-snug">
                  {promo.title}
                </h3>
                <div className="text-xs text-[#f2cf6b] font-mono font-semibold mb-3">
                  {promo.valText}
                </div>
                <p className="text-xs text-[#f5dade] leading-relaxed mb-4">
                  {promo.benefit}
                </p>
              </div>

              <div className="pt-4 border-t border-[#615362] flex items-center justify-between text-xs">
                <span className="text-[#c29da5] text-[11px]">
                  Canal: <strong className="text-[#f5dade]">{promo.targetChannel}</strong>
                </span>
                <span className="text-[#f2cf6b] font-bold flex items-center gap-1">
                  <span>Reclamar</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contenedor Dual: Formulario de Captura Omnicanal & Preview de la Tienda Virtual */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Formulario de Captura Omnicanal (Email Marketing + WhatsApp Marketing) (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0e111a] via-[#141824] to-[#07080c] border border-[#b82d46]/60 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between">
          {success ? (
            <div className="my-auto py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#721828] to-[#cba135] border border-[#cba135] flex items-center justify-center mx-auto text-white shadow-xl animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721828]/80 text-[#f2cf6b] text-xs font-mono font-bold">
                <Sparkles size={13} />
                <span>BENEFICIO ACTIVADO EXITOSAMENTE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#ff6b85]">
                ¡Tu Solicitud Ha Sido Priorizada!
              </h3>
              <p className="text-sm text-[#f5dade] max-w-md mx-auto leading-relaxed">
                Excelente, <strong className="text-[#f2cf6b]">{name}</strong>. Hemos registrado tu interés por <strong className="text-[#ff6b85]">"{selectedPromo}"</strong>.
                Recibirás el material en tu correo y quedas inscrito en la lista VIP de lanzamiento de nuestra tienda virtual.
              </p>

              {/* Botón Inmediato a WhatsApp */}
              <div className="pt-4 space-y-3">
                <a
                  href={whatsappPromoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#721828] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(16,185,129,0.3)] border border-emerald-400/40"
                >
                  <Smartphone size={18} />
                  <span>Validar Beneficio Inmediato por WhatsApp (+56 9 5728 6145)</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setName("");
                    setEmail("");
                    setPhone("+56 9 ");
                  }}
                  className="text-xs text-[#c29da5] hover:text-[#f2cf6b] underline underline-offset-4"
                >
                  Registrar otro correo o solicitar otra promoción
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <span className="text-xs font-mono font-bold text-[#f2cf6b] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                  <Gift size={14} className="text-[#f2cf6b]" />
                  <span>Captura de Beneficio Directo</span>
                </span>
                <h3 className="text-2xl font-extrabold text-[#ff6b85]">
                  Asegura tus Datos para Activación Inmediata
                </h3>
                <p className="text-xs text-[#c29da5] mt-1 leading-relaxed">
                  Completa tus datos para enviarte los kits por correo y coordinar alertas de nuevos lanzamientos vía WhatsApp. Cero spam, 100% valor técnico aplicable.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Selector de Promoción */}
              <div>
                <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                  Promoción o Beneficio a Reclamar:
                </label>
                <select
                  value={selectedPromo}
                  onChange={(e) => setSelectedPromo(e.target.value)}
                  className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-3 text-[#f5dade] text-xs font-medium transition"
                >
                  {PROMO_OPTIONS.map((p) => (
                    <option key={p.id} value={p.value}>
                      {p.title} ({p.badge})
                    </option>
                  ))}
                  <option value="Acceso Total VIP (Diagnóstico + Kit + Pase Preventa)">
                    ⭐️ Acceso Total VIP (Diagnóstico + Kit Python + Pase Preventa Tienda)
                  </option>
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label htmlFor="promo-name" className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                  Nombre Completo o Empresa *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                    <UserCheck size={16} />
                  </div>
                  <input
                    id="promo-name"
                    required
                    type="text"
                    placeholder="Ej. Rodrigo San Martín / Transportes del Sur"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-2.5 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                  />
                </div>
              </div>

              {/* Email (Email Marketing) */}
              <div>
                <label htmlFor="promo-email" className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                  Correo Electrónico Corporativo * (Para entrega de informes y kits)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                    <Mail size={16} />
                  </div>
                  <input
                    id="promo-email"
                    required
                    type="email"
                    placeholder="contacto@tuempresa.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-2.5 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                  />
                </div>
              </div>

              {/* WhatsApp (WhatsApp Marketing) */}
              <div>
                <label htmlFor="promo-phone" className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                  WhatsApp Móvil * (Para alertas preventa y soporte técnico directo)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                    <Smartphone size={16} />
                  </div>
                  <input
                    id="promo-phone"
                    required
                    type="text"
                    placeholder="+56 9 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-2.5 text-[#f5dade] placeholder-[#9e8e97] text-sm font-mono transition"
                  />
                </div>
              </div>

              {/* Consentimiento de Marketing */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="promo-consent"
                  type="checkbox"
                  checked={subscribedMarketing}
                  onChange={(e) => setSubscribedMarketing(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#615362] bg-[#362f37] text-[#721828] focus:ring-[#b82d46] cursor-pointer"
                />
                <label htmlFor="promo-consent" className="text-[11px] text-[#c29da5] leading-snug cursor-pointer">
                  Acepto recibir el diagnóstico o material solicitado, análisis de casos de éxito y notificaciones preferenciales por Email y WhatsApp sobre el lanzamiento de la tienda virtual multi-producto.
                </label>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition shadow-[0_4px_25px_rgba(184,45,70,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Registrando tu beneficio en PostgreSQL...</span>
                ) : (
                  <>
                    <Zap size={16} className="text-[#f2cf6b]" />
                    <span>Activar Promoción & Reservar Cupo Preventa</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Anticipación / Preview de la Futura Tienda Virtual Multi-Productos (6 cols) */}
        <div className="lg:col-span-6 bg-[#423943] border border-[#615362] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#615362]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#f2cf6b]" />
                <span className="text-xs font-mono font-bold text-[#f2cf6b] uppercase">
                  Próximo Lanzamiento Oficial
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#721828]/60 text-[#f2cf6b] border border-[#721828] font-bold">
                Tienda Virtual Multi-SaaS
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#ff6b85] mb-2">
              Catálogo de Productos y Soluciones Listas para Conectar
            </h3>
            <p className="text-xs text-[#c29da5] leading-relaxed mb-6">
              Estamos consolidando nuestras herramientas más exitosas en paquetes modulares de software accesible para PYMEs chilenas. Al contratar servicios hoy o registrarte en la preventa, aseguras <strong>tarifas congeladas con hasta 30% OFF vitalicio</strong>.
            </p>

            {/* Listado de 4 Productos de la Tienda */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              {UPCOMING_PRODUCTS.map((prod, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3.5 rounded-xl bg-[#362f37] border border-[#615362] hover:border-[#b82d46]/50 transition flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#f2cf6b] mb-1">
                      <span>{prod.badge}</span>
                      <span className="text-emerald-400 font-bold">Preventa</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#f5dade]">{prod.name}</h4>
                    <p className="text-[11px] text-[#c29da5] line-clamp-2 mt-1 leading-snug">
                      {prod.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#615362]">
                    <div className="text-[10px] text-[#9e8e97] line-through font-mono">
                      {prod.price}
                    </div>
                    <div className="text-xs font-bold font-mono text-[#f2cf6b]">
                      {prod.discountPrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner de Visión y Reinversión */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#721828]/30 via-[#141824] to-[#07080c] border border-[#721828] text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#f2cf6b] font-bold font-mono text-[11px]">
              <Sparkles size={14} />
              <span>Modelo de Reinversión & Escalamiento</span>
            </div>
            <p className="text-[#f5dade] text-[11px] leading-relaxed">
              Cada consultoría, automatización y reserva de preventa financia directamente la infraestructura, pasarelas de pago y servidores de nuestra tienda virtual chilena, garantizando un ecosistema digital soberano y de máxima velocidad.
            </p>
          </div>
        </div>
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
    <section id="filosofia-testing" className="py-20 px-4 sm:px-6 bg-[#362f37] border-y border-[#615362]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721828]/50 border border-[#cba135]/40 text-xs font-bold text-[#f2cf6b] uppercase">
            <ShieldCheck size={14} />
            Metodología de Validación Extrema
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff6b85]">
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
              className="bg-[#423943] border border-[#615362] rounded-2xl p-6 relative overflow-hidden"
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
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-[#f2cf6b] bg-[#423943] hover:bg-[#4c424e] border border-[#615362] transition-colors flex items-center gap-2"
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
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-[#f2cf6b] bg-[#423943] border border-[#615362] transition-colors flex items-center gap-2"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub (naxo16)</span>
              </a>
            </div>
          </div>

          {/* Tarjeta de Resumen Técnico */}
          <div className="w-full lg:w-80 bg-[#362f37] border border-[#615362] rounded-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#615362]">
              <span className="text-[#c29da5]">Estado Profesional:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                Disponible
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#615362]">
              <span className="text-[#c29da5]">Core Stack:</span>
              <span className="text-[#f2cf6b]">FastAPI · Python · PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#615362]">
              <span className="text-[#c29da5]">Teléfono Directo:</span>
              <a href={`tel:+${PHONE_NUMBER}`} className="text-[#ff6b85] hover:text-[#f2cf6b] font-bold">
                +{PHONE_NUMBER}
              </a>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#615362]">
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#ff6b85]">
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
              className="text-xs font-bold uppercase tracking-wider text-[#f2cf6b] hover:text-[#ff6b85] underline underline-offset-4 cursor-pointer text-left"
            >
              ¿Prefieres el asistente de diagnóstico rápido? Haz clic aquí.
            </button>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="bg-[#423943] border border-[#615362] rounded-2xl p-6 sm:p-8 shadow-xl">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#f2cf6b] mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-[#ff6b85]">¡Mensaje Recibido!</h3>
              <p className="text-sm text-[#f5dade] max-w-sm mx-auto">
                Tu requerimiento fue ingresado exitosamente en nuestra base de datos. Pablo Valdés lo revisará a la brevedad.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] bg-[#362f37] border border-[#615362]"
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
                  className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
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
                  className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
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
                  className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#f5dade] text-sm transition"
                >
                  <option value="Fiscalis / Terreno">Fiscalis (Inspección y Seguridad en Terreno)</option>
                  <option value="Automatizaciones / Excel">Automatización en Excel / Macros</option>
                  <option value="Electronica / Arduino">Electrónica General & Arduino IoT (Consultoría $15.000 CLP)</option>
                  <option value="Domotica / Camaras">Domótica & Cámaras de Seguridad CCTV/IP</option>
                  <option value="Reparacion Hardware">Reparación Computadores, Notebooks & Celulares ($15.000 CLP)</option>
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
                  className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2 text-[#f5dade] placeholder-[#9e8e97] text-sm transition resize-none"
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
    <footer className="border-t border-[#615362] bg-[#362f37] py-10 px-4 sm:px-6 text-[#c29da5] text-xs">
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
            className="hover:text-[#ff6b85] transition flex items-center gap-1"
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
            className="hover:text-[#ff6b85] transition flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ExternalLink size={11} />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff6b85] transition flex items-center gap-1"
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
