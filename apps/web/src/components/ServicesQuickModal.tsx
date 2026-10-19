"use client";

import { useEffect, useRef } from "react";
import {
  Sparkles,
  ArrowRight,
  X,
  FileSpreadsheet,
  UploadCloud,
  Database,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  Home,
  Video,
  Laptop,
  Tag,
} from "lucide-react";

interface ServicesQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAudit: (topic: string) => void;
}

export function ServicesQuickModal({
  isOpen,
  onClose,
  onOpenAudit,
}: ServicesQuickModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = () => {
    onClose();
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        if (modalRef.current) {
          const closeBtn = modalRef.current.querySelector<HTMLElement>('button[aria-label="Cerrar ventana de servicios"]');
          closeBtn?.focus();
        }
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
          return;
        }

        if (e.key === "Tab" && modalRef.current) {
          const focusables = Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const HIGHLIGHTED_SERVICES = [
    {
      icon: FileSpreadsheet,
      title: "Automatizaciones en Excel & Macros Python",
      result: "Cero error humano · Cruces masivos en segundos",
      desc: "Reemplazamos planillas descalzadas que se cuelgan por pipelines automatizados sin fórmulas rotas.",
      topic: "Automatización en Excel / Macros",
    },
    {
      icon: UploadCloud,
      title: "Carga Masiva de Archivos & Streaming",
      result: "Sin timeouts · Validación de 50.000+ filas",
      desc: "Motores asíncronos para procesar lotes pesados de datos sin congelar tus servidores.",
      topic: "Carga Masiva de Archivos",
    },
    {
      icon: Database,
      title: "Eliminación de Duplicados & Bases de Datos 3FN",
      result: "100% registros únicos · Consultas en <20ms",
      desc: "Normalización relacional PostgreSQL, índices B-Tree/GIN y algoritmos de deduplicación difusa.",
      topic: "Erradicación de Duplicidad de Datos",
    },
    {
      icon: BarChart3,
      title: "Dashboards Ejecutivos en Tiempo Real & BI",
      result: "Telemetría en vivo · Cero ceguera directiva",
      desc: "Paneles visuales conectados a tus operaciones para tomar decisiones con números reales, no supuestos.",
      topic: "Dashboards Personalizados & BI",
    },
    {
      icon: Layers,
      title: "Arrendamiento de Software SaaS Llave en Mano",
      result: "Sin costos millonarios iniciales de desarrollo",
      desc: "Tu propio software con servidores, soporte técnico, backups y mantenimiento mensual accesible.",
      topic: "Arrendamiento de Software SaaS",
    },
    {
      icon: Cpu,
      title: "Electrónica General, Arduino & Prototipado IoT",
      result: "Diagnóstico inicial $15.000 CLP · Prototipado ágil",
      desc: "Microcontroladores Arduino, ESP32, relevadores, sensores y automatización de procesos físicos o circuitos a medida.",
      topic: "Electrónica / Arduino / IoT",
    },
    {
      icon: Home,
      title: "Domótica & Espacios Inteligentes",
      result: "Control total desde tu smartphone · Cero cuotas",
      desc: "Automatización de luces, cerraduras digitales, enchufes y circuitos programables para casas y oficinas.",
      topic: "Domótica & Automatización de Espacios",
    },
    {
      icon: Video,
      title: "Instalación de Cámaras de Seguridad & CCTV",
      result: "Monitoreo 24/7 en tu celular · Visión nocturna",
      desc: "Sistemas cableados e IP Wi-Fi con detección de movimiento, alertas en tiempo real y almacenamiento seguro.",
      topic: "Cámaras de Seguridad & CCTV",
    },
    {
      icon: Laptop,
      title: "Reparación de Computadores, Notebooks & Celulares",
      result: "Diagnóstico $15.000 CLP abonable al arreglo",
      desc: "Mantenimiento preventivo, cambio de pasta térmica, pantallas, baterías, upgrades de SSD/RAM y rescate de placas.",
      topic: "Reparación de Computadores / Notebooks / Celulares",
    },
    {
      icon: Zap,
      title: "Fiscalis: Inspección & Actas en Terreno",
      result: "De 72 horas analógicas a <90s digitalizados",
      desc: "App móvil offline-first con GPS automático y sincronización atómica para seguridad y fiscalización.",
      topic: "Fiscalis / Inspección en Terreno",
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="services-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop con Blur Aterciopelado */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#1c181f]/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Ventana Modal Popup */}
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-br from-[#3d343e] via-[#362f37] to-[#2c262e] border-2 border-[#b82d46]/70 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-10 space-y-6 animate-in zoom-in-95 duration-200"
      >
        
        {/* Cabecera del Popup */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#615362]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721828]/60 text-[#f2cf6b] text-xs font-mono font-bold uppercase tracking-wider border border-[#cba135]/40">
              <Sparkles size={13} className="text-[#f2cf6b]" />
              <span>Catálogo de Soluciones de Motor Rápido</span>
            </div>
            <h3
              id="services-modal-title"
              className="text-2xl sm:text-3xl font-black text-[#ff6b85] tracking-tight"
            >
              Servicios &amp; Resultados con naxo resuelve
            </h3>
            <p className="text-xs sm:text-sm text-[#f5dade] leading-relaxed">
              Selecciona tu dolor operativo y recibe una solución de ingeniería probada en simples pasos:
            </p>
          </div>

          <button
            onClick={handleClose}
            aria-label="Cerrar ventana de servicios"
            className="p-2 rounded-xl bg-[#2a242c] hover:bg-[#721828] text-[#c29da5] hover:text-white border border-[#615362] transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Banner Especial: Consultoría y Diagnóstico Electrónica / Hardware por $15.000 CLP */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#721828]/70 via-[#423943] to-[#2a242c] border border-[#cba135]/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#721828] text-[#f2cf6b] border border-[#cba135]/40 shrink-0">
              <Cpu size={22} aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#f2cf6b] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Tag size={14} className="text-[#f2cf6b]" aria-hidden="true" />
                <span>Electrónica, Domótica & Soporte Técnico Hardware</span>
              </div>
              <p className="text-sm text-[#ffffff] leading-relaxed mt-0.5">
                Revisión de circuitos, Arduino, domótica, cámaras, notebooks y celulares. <strong className="text-[#f2cf6b]">Consultoría y diagnóstico inicial por solo $15.000 CLP</strong> (se descuenta del costo final si apruebas la reparación o instalación).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAudit("Consultoría Electrónica ($15.000 CLP)");
            }}
            aria-label="Agendar consultoría de electrónica y hardware por $15.000 CLP"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#cba135] hover:bg-[#dfb547] text-[#1c181f] text-sm font-bold whitespace-nowrap transition cursor-pointer shadow-md shrink-0 min-h-[44px] flex items-center justify-center"
          >
            Agendar por $15.000 CLP
          </button>
        </div>

        {/* Grid de Servicios destacados con fuentes grandes y legibles */}
        <div className="grid sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1" role="region" aria-label="Tarjetas de soluciones disponibles">
          {HIGHLIGHTED_SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            const headingId = `srv-modal-title-${idx}`;
            return (
              <article
                key={idx}
                aria-labelledby={headingId}
                className="p-5 rounded-2xl bg-[#423943] border border-[#615362] hover:border-[#b82d46] transition-all flex flex-col justify-between space-y-3.5 group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#2a242c] text-[#f2cf6b] border border-[#615362] group-hover:scale-105 transition-transform shrink-0">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#721828]/80 text-[#f2cf6b] border border-[#721828] text-right">
                      {srv.result}
                    </span>
                  </div>
                  <h4 id={headingId} className="text-base sm:text-lg font-bold text-[#ff859b] group-hover:text-[#f2cf6b] transition-colors leading-snug">
                    {srv.title}
                  </h4>
                  <p className="text-sm text-[#ffffff] leading-relaxed mt-2 font-normal">
                    {srv.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAudit(srv.topic);
                  }}
                  aria-label={`Diagnosticar mi caso de ${srv.title}`}
                  className="w-full pt-3 mt-1 border-t border-[#615362] flex items-center justify-between text-sm font-bold text-[#f2cf6b] hover:text-[#ff859b] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Diagnosticar mi caso</span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>

        {/* Footer del Popup con CTA directo */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#615362] text-xs">
          <div className="flex items-center gap-2 text-[#c29da5]">
            <ShieldCheck size={16} className="text-[#f2cf6b]" />
            <span>Validación garantizada con pruebas rudas de calidad antes de entrega.</span>
          </div>

          <a
            href="#soluciones"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] transition flex items-center gap-1.5 shadow-md border border-[#cba135]/40"
          >
            <span>Explorar Todas las Soluciones</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
