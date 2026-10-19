"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  X,
  Globe2,
  Flame,
  Play,
  Cpu,
  FlaskConical,
  Tag,
  ShieldCheck,
  Lock,
  Download,
  Send,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Briefcase,
  Check,
} from "lucide-react";

export type Language = "es" | "ru" | "pt" | "it" | "en" | "de";

export interface NavTranslation {
  brandRole: string;
  menuTitle: string;
  langSelect: string;
  statusOnline: string;
  links: {
    home: string;
    fiscalis: string;
    videoDemo: string;
    solutions: string;
    caseStudies: string;
    promotions: string;
    methodology: string;
    portfolio: string;
    clientPortal: string;
    downloadCv: string;
    requestAudit: string;
    contact: string;
  };
  badges: {
    featured: string;
    liveVoice: string;
    hardware: string;
    robustQa: string;
    presale: string;
  };
  quickActions: string;
  footerRights: string;
  openAria: string;
  closeAria: string;
}

export const I18N_NAV: Record<Language, NavTranslation> = {
  es: {
    brandRole: "Analista Programador · Backend & Arquitectura",
    menuTitle: "Navegación del Sistema",
    langSelect: "Idioma / Язык / Language",
    statusOnline: "SISTEMA OPERATIVO · 100% ONLINE",
    links: {
      home: "Inicio",
      fiscalis: "Fiscalis: Digitalización Terreno",
      videoDemo: "Demostración Video & Voz IA",
      solutions: "Soluciones de Software & Hardware",
      caseStudies: "Casos de Estudio Reales",
      promotions: "Promociones & Tienda SaaS",
      methodology: "Metodología Testing Rudo",
      portfolio: "Portafolio de Proyectos",
      clientPortal: "Portal Clientes",
      downloadCv: "Descargar CV Oficial",
      requestAudit: "Solicitar Diagnóstico ($0 CLP)",
      contact: "Contacto Directo (+56957286145)",
    },
    badges: {
      featured: "Destacado",
      liveVoice: "Canvas + Voz IA",
      hardware: "$15k Diagnóstico",
      robustQa: "Testing Certificado",
      presale: "Preventa -30%",
    },
    quickActions: "Acciones Ejecutivas",
    footerRights: "Naxo Resuelve · naxoresuelve / renkaidev",
    openAria: "Abrir menú lateral de navegación",
    closeAria: "Cerrar menú lateral",
  },
  ru: {
    brandRole: "Инженер-программист · Backend и Архитектура",
    menuTitle: "Навигация по Системе",
    langSelect: "Выбор языка / Language",
    statusOnline: "СИСТЕМА РАБОТАЕТ · 100% ОНЛАЙН",
    links: {
      home: "Главная",
      fiscalis: "Fiscalis: Полевой Контроль",
      videoDemo: "Видео-демо и Голосовой ИИ",
      solutions: "ПО Решения и Оборудование",
      caseStudies: "Реальные Кейсы и Нагрузки",
      promotions: "Акции и Магазин SaaS",
      methodology: "Методология Тестирования",
      portfolio: "Портфолио Проектов",
      clientPortal: "Портал Клиентов",
      downloadCv: "Скачать Резюме (CV)",
      requestAudit: "Запросить Диагностику ($0 CLP)",
      contact: "Прямой Контакт (+56957286145)",
    },
    badges: {
      featured: "В фокусе",
      liveVoice: "Canvas + Голос ИИ",
      hardware: "$15k Диагностика",
      robustQa: "QA Сертификат",
      presale: "Предзаказ -30%",
    },
    quickActions: "Действия",
    footerRights: "Пабло Вальдес · naxoresuelve / renkaidev",
    openAria: "Открыть боковое меню навигации",
    closeAria: "Закрыть боковое меню",
  },
  pt: {
    brandRole: "Analista de Sistemas · Backend & Arquitetura",
    menuTitle: "Navegação do Sistema",
    langSelect: "Idioma / Language",
    statusOnline: "SISTEMA OPERACIONAL · 100% ONLINE",
    links: {
      home: "Início",
      fiscalis: "Fiscalis: Coleta em Campo",
      videoDemo: "Demonstração Vídeo & Voz IA",
      solutions: "Soluções de Software & Hardware",
      caseStudies: "Casos de Estudo Reais",
      promotions: "Promoções & Loja SaaS",
      methodology: "Metodologia de Teste Rigoroso",
      portfolio: "Portfólio de Projetos",
      clientPortal: "Portal do Cliente",
      downloadCv: "Baixar Currículo (CV)",
      requestAudit: "Solicitar Diagnóstico ($0 CLP)",
      contact: "Contato Direto (+56957286145)",
    },
    badges: {
      featured: "Destaque",
      liveVoice: "Canvas + Voz IA",
      hardware: "$15k Consulta",
      robustQa: "Teste Certificado",
      presale: "Pré-venda -30%",
    },
    quickActions: "Ações Rápidas",
    footerRights: "Naxo Resuelve · naxoresuelve / renkaidev",
    openAria: "Abrir menu lateral",
    closeAria: "Fechar menu lateral",
  },
  it: {
    brandRole: "Analista Programmatore · Backend & Architettura",
    menuTitle: "Navigazione di Sistema",
    langSelect: "Lingua / Language",
    statusOnline: "SISTEMA OPERATIVO · 100% ONLINE",
    links: {
      home: "Home",
      fiscalis: "Fiscalis: Rilevamento sul Campo",
      videoDemo: "Demo Video & Voce IA",
      solutions: "Soluzioni Software & Hardware",
      caseStudies: "Casi Studio Reali",
      promotions: "Promozioni & Negozio SaaS",
      methodology: "Metodologia di Test Rigoroso",
      portfolio: "Portfolio Progetti",
      clientPortal: "Portale Clienti",
      downloadCv: "Consulenza e Soluzioni",
      requestAudit: "Richiedi Diagnosi ($0 CLP)",
      contact: "Contatto Diretto (+56957286145)",
    },
    badges: {
      featured: "In Evidenza",
      liveVoice: "Canvas + Voce IA",
      hardware: "$15k Diagnosi",
      robustQa: "QA Certificato",
      presale: "Prevendita -30%",
    },
    quickActions: "Azioni Principali",
    footerRights: "Naxo Resuelve · naxoresuelve / renkaidev",
    openAria: "Apri menu laterale",
    closeAria: "Chiudi menu laterale",
  },
  en: {
    brandRole: "Software Engineer · Backend & System Architecture",
    menuTitle: "System Navigation",
    langSelect: "Language Selection",
    statusOnline: "SYSTEM OPERATIONAL · 100% ONLINE",
    links: {
      home: "Home",
      fiscalis: "Fiscalis: Field Digitalization",
      videoDemo: "Video Demo & AI Voice Guide",
      solutions: "Software & Hardware Solutions",
      caseStudies: "Stress-Tested Case Studies",
      promotions: "Promotions & Multi-SaaS Store",
      methodology: "Extreme Testing Methodology",
      portfolio: "Project Portfolio",
      clientPortal: "Client Portal",
      downloadCv: "Download Official CV",
      requestAudit: "Request Free Diagnosis ($0 CLP)",
      contact: "Direct Phone (+56957286145)",
    },
    badges: {
      featured: "Featured",
      liveVoice: "Canvas + AI Voice",
      hardware: "$15k Hardware Check",
      robustQa: "Certified QA",
      presale: "Presale 30% OFF",
    },
    quickActions: "Executive Actions",
    footerRights: "Naxo Resuelve · naxoresuelve / renkaidev",
    openAria: "Open sidebar navigation",
    closeAria: "Close sidebar navigation",
  },
  de: {
    brandRole: "Software-Entwickler · Backend & Systemarchitektur",
    menuTitle: "System-Navigation",
    langSelect: "Sprachauswahl",
    statusOnline: "SYSTEM BETRIEBSBEREIT · 100% ONLINE",
    links: {
      home: "Startseite",
      fiscalis: "Fiscalis: Vor-Ort-Datenerfassung",
      videoDemo: "Video-Demo & KI-Sprachführung",
      solutions: "Software & Hardware-Lösungen",
      caseStudies: "Echte Fallstudien & Belastungstests",
      promotions: "Aktionen & SaaS-Shop",
      methodology: "Harte Testmethodik",
      portfolio: "Projektportfolio",
      clientPortal: "Kundenportal",
      downloadCv: "Lebenslauf herunterladen",
      requestAudit: "Audit anfordern ($0 CLP)",
      contact: "Direktkontakt (+56957286145)",
    },
    badges: {
      featured: "Fokus",
      liveVoice: "Canvas + KI-Stimme",
      hardware: "$15k Diagnose",
      robustQa: "Zertifizierte QA",
      presale: "Vorverkauf -30%",
    },
    quickActions: "Aktionen",
    footerRights: "Naxo Resuelve · naxoresuelve / renkaidev",
    openAria: "Seitenleiste öffnen",
    closeAria: "Seitenleiste schließen",
  },
};

const LANG_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇨🇱 ES" },
  { code: "en", label: "English", flag: "🇬🇧 EN" },
  { code: "pt", label: "Português", flag: "🇧🇷 PT" },
  { code: "ru", label: "Русский", flag: "🇷🇺 RU" },
  { code: "it", label: "Italiano", flag: "🇮🇹 IT" },
  { code: "de", label: "Deutsch", flag: "🇩🇪 DE" },
];

interface CyberLateralSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAudit: () => void;
  cvUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
}

export function CyberLateralSidebar({
  isOpen: controlledIsOpen,
  onClose,
  onOpenAudit,
  cvUrl,
  portfolioUrl,
  linkedinUrl,
}: CyberLateralSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const [lang, setLang] = useState<Language>("es");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = I18N_NAV[lang];

  const closeSidebar = useCallback(() => {
    document.body.style.overflow = "";
    if (isControlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
    setShowLangMenu(false);
  }, [isControlled, onClose]);

  // Recuperar idioma guardado si existe
  useEffect(() => {
    try {
      const saved = localStorage.getItem("naxoresuelve_lang") as Language;
      if (saved && I18N_NAV[saved]) {
        queueMicrotask(() => {
          setLang(saved);
        });
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Sincronizar atributo lang en el documento
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    setShowLangMenu(false);
    try {
      localStorage.setItem("naxoresuelve_lang", newLang);
    } catch {
      // ignore
    }
  };

  // Manejo de teclado (Escape para cerrar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSidebar]);

  // Prevenir scroll en body cuando está abierto pero garantizar restauración inmediata
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Manejador infalible de navegación suave por anclajes
  const handleNavAnchor = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      // 1. Restaurar scroll de inmediato
      document.body.style.overflow = "";
      // 2. Cerrar menú lateral
      if (isControlled) {
        onClose?.();
      } else {
        setInternalIsOpen(false);
      }
      setShowLangMenu(false);

      if (!href || href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const targetId = href.replace(/^#/, "");
      // Pequeño retardo para permitir que el drawer inicie su salida y el DOM recalcule sin bloqueos
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          if (typeof window !== "undefined" && window.history?.pushState) {
            window.history.pushState(null, "", `#${targetId}`);
          }
        }
      }, 60);
    },
    [isControlled, onClose]
  );

  return (
    <>
      {/* ============================================================ */}
      {/* Botón Disparador Flotante Lateral (Sólo si no es controlado externamente) */}
      {/* ============================================================ */}
      {!isControlled && (
        <div
          className={`fixed top-3 left-3 sm:top-4 sm:left-4 z-40 flex items-center gap-2 transition-all duration-300 ${
            isOpen ? "opacity-0 pointer-events-none -translate-x-4" : "opacity-100 pointer-events-auto translate-x-0"
          }`}
        >
          <button
            type="button"
            onClick={() => setInternalIsOpen(true)}
            aria-expanded={isOpen}
            aria-label={t.openAria}
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#2a242c]/95 hover:bg-[#423943] text-white border border-[#cba135]/70 hover:border-[#f2cf6b] shadow-[0_10px_30px_rgba(0,0,0,0.85)] hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-xl cursor-pointer"
          >
          <div className="flex flex-col gap-1 w-5">
            <span className="w-5 h-0.5 bg-[#f2cf6b] rounded-full transition-all group-hover:w-6 shadow-[0_0_5px_#f2cf6b]" />
            <span className="w-3.5 h-0.5 bg-white rounded-full transition-all group-hover:w-5" />
            <span className="w-4 h-0.5 bg-[#ff6b85] rounded-full transition-all group-hover:w-6 shadow-[0_0_5px_#ff6b85]" />
          </div>

          <div className="flex items-center gap-1.5 font-round tracking-wider uppercase text-xs font-bold">
            <span className="text-white group-hover:text-[#f2cf6b] transition-colors">
              MENÚ
            </span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-[#721828]/90 text-[#f2cf6b] border border-[#cba135]/40 font-mono">
              [HUD]
            </span>
          </div>
        </button>

        {/* Indicador de Idioma Rápido Flotante */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-label={t.langSelect}
            className="px-2.5 py-2.5 rounded-2xl bg-[#2a242c]/95 hover:bg-[#423943] border border-[#615362] hover:border-[#cba135] text-xs font-mono font-bold text-[#f2cf6b] flex items-center gap-1.5 shadow-xl transition backdrop-blur-xl cursor-pointer"
          >
            <Globe2 size={15} className="text-[#cba135]" />
            <span className="uppercase">{lang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute top-full left-0 mt-2 w-44 rounded-2xl bg-[#2a242c]/98 border-2 border-[#cba135] shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#c29da5] uppercase border-b border-[#615362]">
                {t.langSelect}
              </div>
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelectLang(opt.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    lang === opt.code
                      ? "bg-[#721828] text-[#f2cf6b] font-bold border border-[#cba135]/50"
                      : "text-[#f5dade] hover:bg-[#423943] hover:text-[#f2cf6b]"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-mono">
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </span>
                  {lang === opt.code && <Check size={13} className="text-[#f2cf6b]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* ============================================================ */}
      {/* Backdrop Oscuro Semi-transparente para Cierre Táctil         */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 animate-in fade-in duration-200 cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* ============================================================ */}
      {/* Panel Lateral Desplegable (Lateral Cyber Navigation Drawer)  */}
      {/* ============================================================ */}
      <aside
        role="navigation"
        aria-label={t.menuTitle}
        className={`fixed top-0 left-0 bottom-0 z-50 w-full sm:w-[380px] md:w-[420px] max-w-[92vw] h-full h-[100dvh] max-h-screen bg-gradient-to-b from-[#302c36] via-[#3a3640] to-[#25222b] border-r-2 border-[#cba135] shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
        }`}
      >
        {/* Glow decorativo interior */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#721828]/25 blur-3xl pointer-events-none -z-10" />

        {/* Encabezado del Menú Lateral */}
        <div className="p-4 sm:p-5 border-b border-[#615362] flex items-center justify-between shrink-0 bg-[#2a242c]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#721828] to-[#cba135] flex items-center justify-center font-bold text-white shadow-lg border border-[#f2cf6b]/50 font-round text-base">
              NR
            </div>
            <div className="flex flex-col">
              <span className="font-round text-lg font-bold text-white flex items-center gap-1.5 leading-tight">
                Naxo Resuelve
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#721828] text-[#f2cf6b] border border-[#cba135]/50">
                  naxoresuelve
                </span>
              </span>
              <span className="text-[11px] text-[#c29da5] line-clamp-1">
                {t.brandRole}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label={t.closeAria}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#f2cf6b] bg-[#721828]/80 hover:bg-[#721828] border border-[#cba135]/60 hover:border-[#f2cf6b] shadow-md transition cursor-pointer"
          >
            <X size={16} />
            <span className="hidden sm:inline font-mono uppercase">Cerrar</span>
          </button>
        </div>

        {/* Estado Operativo & Selector de Idioma Integrado */}
        <div className="px-4 py-2.5 bg-[#25222b] border-b border-[#615362]/60 flex items-center justify-between text-[11px] font-mono shrink-0">
          <span className="flex items-center gap-2 text-[#f2cf6b] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>{t.statusOnline}</span>
          </span>

          <div className="flex items-center gap-1">
            {LANG_OPTIONS.slice(0, 3).map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelectLang(opt.code)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                  lang === opt.code
                    ? "bg-[#721828] text-[#f2cf6b] border border-[#cba135]/60"
                    : "text-[#c29da5] hover:text-white"
                }`}
              >
                {opt.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Navegación con Scroll Suave y sin bloqueo de overflow */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-3 space-y-1.5 scrollbar-thin">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#c29da5] px-3 pb-1">
            {"// "}{t.menuTitle}
          </div>

          {/* Enlace: Inicio */}
          <a
            href="#"
            onClick={(e) => handleNavAnchor(e, "#")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <Sparkles size={16} />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.home}</span>
            </span>
            <ChevronRight size={15} className="text-[#615362] group-hover:text-[#f2cf6b] transition-transform group-hover:translate-x-1" />
          </a>

          {/* Enlace: Fiscalis */}
          <a
            href="#fiscalis-spotlight"
            onClick={(e) => handleNavAnchor(e, "#fiscalis-spotlight")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#721828]/30 hover:bg-[#721828]/60 border border-[#cba135]/50 text-sm font-bold text-[#ff6b85] hover:text-[#f2cf6b] transition-all shadow-sm"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#721828] flex items-center justify-center text-[#f2cf6b] shadow-[0_0_10px_rgba(203,161,53,0.3)]">
                <Flame size={16} />
              </span>
              <span className="font-round font-bold">{t.links.fiscalis}</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#cba135]/20 text-[#f2cf6b] border border-[#cba135]/50 uppercase font-bold">
              {t.badges.featured}
            </span>
          </a>

          {/* Enlace: Video Demo Canvas & Voz IA */}
          <a
            href="#video-preview"
            onClick={(e) => handleNavAnchor(e, "#video-preview")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <Play size={15} className="fill-[#f2cf6b]" />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.videoDemo}</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#721828]/80 text-[#f2cf6b] border border-[#721828] uppercase font-bold">
              {t.badges.liveVoice}
            </span>
          </a>

          {/* Enlace: Soluciones & Hardware */}
          <a
            href="#soluciones"
            onClick={(e) => handleNavAnchor(e, "#soluciones")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <Cpu size={16} />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.solutions}</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#cba135]/20 text-[#f2cf6b] border border-[#cba135]/40 font-bold">
              {t.badges.hardware}
            </span>
          </a>

          {/* Enlace: Casos de Estudio */}
          <a
            href="#casos-de-estudio"
            onClick={(e) => handleNavAnchor(e, "#casos-de-estudio")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <FlaskConical size={16} />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.caseStudies}</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold">
              {t.badges.robustQa}
            </span>
          </a>

          {/* Enlace: Promociones & Tienda */}
          <a
            href="#promociones"
            onClick={(e) => handleNavAnchor(e, "#promociones")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <Tag size={16} />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.promotions}</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#721828] text-[#f2cf6b] border border-[#cba135]/40 font-bold">
              {t.badges.presale}
            </span>
          </a>

          {/* Enlace: Metodología Testing Rudo */}
          <a
            href="#filosofia-testing"
            onClick={(e) => handleNavAnchor(e, "#filosofia-testing")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <ShieldCheck size={16} />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.methodology}</span>
            </span>
            <ChevronRight size={15} className="text-[#615362] group-hover:text-[#f2cf6b] transition-transform group-hover:translate-x-1" />
          </a>

          {/* Enlace: Portafolio */}
          <a
            href="#portafolio"
            onClick={(e) => handleNavAnchor(e, "#portafolio")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <Briefcase size={16} />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.portfolio}</span>
            </span>
            <ChevronRight size={15} className="text-[#615362] group-hover:text-[#f2cf6b] transition-transform group-hover:translate-x-1" />
          </a>

          {/* Enlace: Contacto Directo */}
          <a
            href="#contacto"
            onClick={(e) => handleNavAnchor(e, "#contacto")}
            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-[#423943] border border-transparent hover:border-[#cba135]/50 text-sm font-normal text-[#f5dade] hover:text-[#f2cf6b] transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#423943] group-hover:bg-[#721828] flex items-center justify-center text-[#f2cf6b] transition">
                <PhoneCall size={16} />
              </span>
              <span className="font-round font-normal group-hover:font-bold transition-all">{t.links.contact}</span>
            </span>
            <ChevronRight size={15} className="text-[#615362] group-hover:text-[#f2cf6b] transition-transform group-hover:translate-x-1" />
          </a>

          {/* Divider */}
          <div className="pt-2 pb-1 border-t border-[#615362]/60">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c29da5] px-3">
              {"// "}{t.quickActions}
            </span>
          </div>

          {/* Portal Clientes */}
          <Link
            href="/portal"
            onClick={closeSidebar}
            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#423943] hover:bg-[#4c424e] border border-[#615362] text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] transition-all font-round"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2a242c] flex items-center justify-center text-[#f2cf6b]">
              <Lock size={14} />
            </span>
            <span>{t.links.clientPortal}</span>
          </Link>

          {/* Soluciones & Consultoría Directa */}
          <button
            type="button"
            onClick={() => {
              closeSidebar();
              onOpenAudit();
            }}
            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#423943] hover:bg-[#4c424e] border border-[#615362] text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] transition-all font-round w-full text-left cursor-pointer"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2a242c] flex items-center justify-center text-[#f2cf6b]">
              <Sparkles size={14} />
            </span>
            <span>{t.links.requestAudit}</span>
          </button>

          {/* Enlaces Externos: renkaidev & LinkedIn */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#2a242c] hover:bg-[#423943] border border-[#615362] text-[11px] font-mono text-[#f2cf6b] transition font-bold"
            >
              <span>renkaidev</span>
              <ExternalLink size={11} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#2a242c] hover:bg-[#423943] border border-[#615362] text-[11px] font-mono text-[#c29da5] hover:text-white transition font-bold"
            >
              <span>LinkedIn</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Pie del Menú Lateral: CTA Diagnóstico */}
        <div className="p-3 sm:p-4 bg-[#2a242c] border-t-2 border-[#cba135]/60 space-y-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              closeSidebar();
              onOpenAudit();
            }}
            className="w-full py-3 px-4 rounded-xl font-round text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:from-[#9e233b] hover:to-[#f2cf6b] hover:text-[#07080c] border border-[#f2cf6b]/50 shadow-[0_0_20px_rgba(184,45,70,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send size={15} />
            <span>{t.links.requestAudit}</span>
          </button>

          <div className="text-center text-[10px] text-[#c29da5] font-mono">
            {t.footerRights}
          </div>
        </div>
      </aside>
    </>
  );
}
