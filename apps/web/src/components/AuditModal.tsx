"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Send, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTopic?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function AuditModal({ isOpen, onClose, preselectedTopic }: AuditModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(preselectedTopic || "duplicidad");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (preselectedTopic) {
      setTopic(preselectedTopic);
    }
  }, [preselectedTopic]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
        className="relative w-full max-w-lg bg-[#d6d0d5] border border-[#b82d46]/60 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-[#181a22]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#b8acb5] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#f2cf6b] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#7a580e]">
                Auditoría & Diagnóstico Sin Costo
              </span>
            </div>
            <h3 id="audit-modal-title" className="text-xl font-bold text-[#660f1d]">
              Cuéntame tu cuello de botella
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-[#423e47] hover:text-[#7a580e] bg-[#ece6eb] hover:bg-[#721828] rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-[#7a580e] mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-[#660f1d]">¡Solicitud recibida exitosamente!</h4>
            <p className="text-xs text-[#181a22] max-w-xs mx-auto">
              Pablo Valdés revisará la estructura de tu caso y te responderá en breve con un análisis técnico inicial.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label htmlFor="audit-name" className="block text-xs font-semibold text-[#181a22] mb-1">
                Tu Nombre o Empresa *
              </label>
              <input
                id="audit-name"
                required
                type="text"
                placeholder="Ej. Carlos Mendoza / Distribuidora Norte"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#ece6eb] border border-[#b8acb5] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#181a22] placeholder-[#78727e] text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="audit-email" className="block text-xs font-semibold text-[#181a22] mb-1">
                Correo Electrónico de Contacto *
              </label>
              <input
                id="audit-email"
                required
                type="email"
                placeholder="carlos@empresa.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#ece6eb] border border-[#b8acb5] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#181a22] placeholder-[#78727e] text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="audit-topic" className="block text-xs font-semibold text-[#181a22] mb-1">
                ¿Cuál es tu principal dolor actual?
              </label>
              <select
                id="audit-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#ece6eb] border border-[#b8acb5] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2.5 text-[#181a22] text-sm transition"
              >
                <option value="duplicidad">Duplicidad de datos y clientes repetidos</option>
                <option value="excel">Excel colapsado / pérdida de horas manuales</option>
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
              <label htmlFor="audit-desc" className="block text-xs font-semibold text-[#181a22] mb-1">
                Detalles breves del problema *
              </label>
              <textarea
                id="audit-desc"
                required
                rows={3}
                placeholder="Ej. Manejamos 15 sucursales con Excels de 40.000 filas y se nos duplican los clientes al facturar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#ece6eb] border border-[#b8acb5] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-2 text-[#181a22] placeholder-[#78727e] text-sm transition resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#423e47]">
              <ShieldCheck size={14} className="text-[#7a580e]" />
              <span>Diagnóstico técnico directo por Pablo Valdés. Confidencialidad garantizada.</span>
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
