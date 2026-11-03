"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  const phone = "56957286145";
  const message = encodeURIComponent(
    "Hola Pablo, estuve revisando la plataforma naxoresuelve y me gustaría cotizar una solución de software / automatización para mi negocio."
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <aside
      aria-label="Contacto directo por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 select-none"
    >
      {/* Tooltip flotante de alto contraste */}
      {showTooltip && (
        <div className="relative flex items-center gap-2.5 rounded-2xl border border-slate-700 bg-[#1E2430] text-white px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md max-w-xs transition-all animate-fade-in">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
          </span>

          <div className="flex flex-col text-left">
            <span className="font-mono text-[10px] font-bold text-[#25D366] uppercase tracking-wider">
              Respuesta en &lt; 15 min
            </span>
            <span className="text-xs font-bold text-slate-100">
              ¿Requieres resolver una urgencia o automatización? Escríbeme directo.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            aria-label="Cerrar aviso de WhatsApp"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-1"
          >
            <X size={14} />
          </button>

          {/* Flecha indicadora */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#1E2430] border-b border-r border-slate-700 rotate-45" />
        </div>
      )}

      {/* Botón Flotante Permanente */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar a Pablo por WhatsApp: Respuesta en menos de 15 minutos"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1E2430] text-[#25D366] border-2 border-white/20 shadow-[0_8px_30px_rgba(30,36,48,0.4)] transition-all duration-300 hover:scale-110 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] hover:shadow-[0_12px_35px_rgba(37,211,102,0.5)] focus:ring-4 focus:ring-[#25D366]/40 focus:outline-none active:scale-95"
      >
        <MessageCircle
          className="h-7 w-7 transition-colors duration-300 group-hover:text-[#111827]"
          aria-hidden="true"
        />
        <span className="sr-only">Contactar por WhatsApp (se abre en una nueva pestaña)</span>
      </a>
    </aside>
  );
}
