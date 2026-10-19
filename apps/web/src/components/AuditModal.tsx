"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { X, Send, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTopic?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function normalizeAuditTopic(rawTopic?: string): string {
  if (!rawTopic) return "duplicidad";
  const s = rawTopic.toLowerCase().trim();

  if (s.includes("carga") || s.includes("masiva") || s.includes("streaming") || s.includes("lotes")) {
    return "carga_masiva";
  }
  if (s.includes("excel") || s.includes("macro") || s.includes("planilla")) {
    return "excel";
  }
  if (s.includes("arduino") || s.includes("iot") || s.includes("electrónica") || s.includes("electronica") || s.includes("circuito")) {
    return "electronica_arduino";
  }
  if (s.includes("cámara") || s.includes("camara") || s.includes("cctv") || s.includes("domótica") || s.includes("domotica") || s.includes("seguridad")) {
    return s.includes("cámara") || s.includes("camara") || s.includes("cctv") ? "domotica_camaras" : "domotica_camaras";
  }
  if (s.includes("reparaci") || s.includes("notebook") || s.includes("computador") || s.includes("hardware") || s.includes("celular")) {
    return "reparacion_hardware";
  }
  if (s.includes("fiscalis") || s.includes("terreno") || s.includes("inspecci") || s.includes("acta")) {
    return "fiscalis";
  }
  if (s.includes("pérdida") || s.includes("perdida") || s.includes("respaldo") || s.includes("inmutable")) {
    return "perdida_info";
  }
  if (s.includes("búsqueda") || s.includes("busqueda") || s.includes("caos") || s.includes("disperso")) {
    return "busqueda_lenta";
  }
  if (s.includes("base de datos") || s.includes("postgresql") || s.includes("sql") || s.includes("3fn")) {
    return "base_datos";
  }
  if (s.includes("dashboard") || s.includes("bi") || s.includes("telemetr") || s.includes("métrica") || s.includes("metrica")) {
    return "dashboards";
  }
  if (s.includes("arriendo") || s.includes("arrendamiento") || s.includes("saas")) {
    return "saas_arriendo";
  }
  if (s.includes("maps") || s.includes("ads") || s.includes("google") || s.includes("posicionamiento")) {
    return "google_maps_ads";
  }
  if (s.includes("duplic") || s.includes("clonad") || s.includes("repetid")) {
    return "duplicidad";
  }

  return "duplicidad";
}

export function AuditModal({ isOpen, onClose, preselectedTopic }: AuditModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(() => normalizeAuditTopic(preselectedTopic));
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = () => {
    onClose();
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  useEffect(() => {
    if (preselectedTopic) {
      const normalized = normalizeAuditTopic(preselectedTopic);
      setTopic(normalized);
    }
  }, [preselectedTopic, isOpen]);

  // Manejo de foco al abrir/cerrar y trampa de foco (Focus Trap WCAG 2.1)
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        if (modalRef.current) {
          const firstInput = modalRef.current.querySelector<HTMLElement>(
            'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          firstInput?.focus();
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const fullMessage = `[Diagnóstico Rápido: ${topic}]\n${description}`;

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
        throw new Error("No se pudo registrar la solicitud. Intenta por WhatsApp directo.");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName("");
        setEmail("");
        setDescription("");
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado de comunicación.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#362f37] border border-[#b82d46]/60 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-[#f5dade]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#615362] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#f2cf6b] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#f2cf6b]">
                Auditoría &amp; Diagnóstico Sin Costo
              </span>
            </div>
            <h3 id="audit-modal-title" className="text-xl font-bold text-[#ff6b85]">
              Cuéntame tu cuello de botella
            </h3>
          </div>
          <button
            onClick={handleClose}
            aria-label="Cerrar modal de auditoría"
            className="p-2 text-[#c29da5] hover:text-[#f2cf6b] bg-[#423943] hover:bg-[#721828] rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div role="status" aria-live="polite" className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-[#f2cf6b] mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-[#ff6b85]">¡Solicitud recibida exitosamente!</h4>
            <p className="text-xs sm:text-sm text-[#ffffff] max-w-xs mx-auto">
              Naxo Resuelve revisará la estructura de tu caso y te responderá en breve con un análisis técnico inicial.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {errorMsg && (
              <div role="alert" aria-live="assertive" className="p-3.5 rounded-xl bg-red-950/90 border border-red-800 text-red-100 text-xs sm:text-sm font-medium flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0 text-red-300" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="audit-name" className="block text-xs font-semibold text-[#f5dade] mb-1">
                Tu Nombre o Empresa *
              </label>
              <input
                id="audit-name"
                required
                type="text"
                placeholder="Ej. Carlos Mendoza / Distribuidora Norte"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#423943] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#ffffff] placeholder-[#dcd0d5] text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="audit-email" className="block text-xs font-semibold text-[#f5dade] mb-1">
                Correo Electrónico de Contacto *
              </label>
              <input
                id="audit-email"
                required
                type="email"
                placeholder="carlos@empresa.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#423943] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#ffffff] placeholder-[#dcd0d5] text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="audit-topic" className="block text-xs font-semibold text-[#f5dade] mb-1">
                ¿Cuál es tu principal dolor actual?
              </label>
              <select
                id="audit-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#423943] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#f5dade] text-sm transition"
              >
                <option value="duplicidad">Duplicidad de datos y clientes repetidos</option>
                <option value="excel">Excel colapsado / pérdida de horas manuales</option>
                <option value="electronica_arduino">Electrónica, Arduino & Prototipado IoT (Consultoría $15.000 CLP)</option>
                <option value="domotica_camaras">Domótica & Cámaras de Seguridad CCTV/IP</option>
                <option value="reparacion_hardware">Reparación Computadores, Notebooks & Celulares ($15.000 CLP)</option>
                <option value="fiscalis">Fiscalis / Digitalización en terreno</option>
                <option value="carga_masiva">Carga masiva de archivos que se cae o tarda horas</option>
                <option value="perdida_info">Pérdida o desorden de información crítica</option>
                <option value="busqueda_lenta">Dolor de cabeza buscando archivos y datos dispersos</option>
                <option value="base_datos">Base de datos lenta o mal estructurada</option>
                <option value="dashboards">Falta de dashboards y ceguera en la toma de decisiones</option>
                <option value="saas_arriendo">Necesito un software propio pero prefiero arrendarlo (SaaS)</option>
                <option value="google_maps_ads">Visibilidad en Google Maps & Campañas Google Ads</option>
              </select>
            </div>

            <div>
              <label htmlFor="audit-desc" className="block text-xs font-semibold text-[#f5dade] mb-1">
                Detalles breves del problema *
              </label>
              <textarea
                id="audit-desc"
                required
                rows={3}
                placeholder="Ej. Manejamos 15 sucursales con Excels de 40.000 filas y se nos duplican los clientes al facturar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#423943] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2 text-[#ffffff] placeholder-[#dcd0d5] text-sm transition resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#c29da5]">
              <ShieldCheck size={14} className="text-[#f2cf6b]" />
              <span>Diagnóstico técnico directo por Naxo Resuelve. Confidencialidad garantizada.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition shadow-[0_4px_20px_rgba(184,45,70,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Procesando solicitud...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Enviar Diagnóstico Gratuito</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
