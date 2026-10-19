"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  // Mensaje preconfigurado profesional para WhatsApp
  const phone = "56957286145";
  const message = encodeURIComponent(
    "Hola Naxo Resuelve, estuve revisando la plataforma naxoresuelve y me gustaría cotizar una solución de software / automatización para mi negocio."
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Tooltip flotante formal */}
      {showTooltip && (
        <div className="relative flex items-center gap-2 bg-[#161a22] text-xs text-white px-3.5 py-2 rounded-xl shadow-2xl border border-[#cba135]/40 backdrop-blur-md animate-fade-in max-w-xs transition-all">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="font-medium text-slate-200">
            ¿Requieres resolver una urgencia o automatización? Escríbeme directo.
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Cerrar notificación flotante"
            className="text-slate-400 hover:text-white p-0.5 rounded transition"
          >
            <X size={13} />
          </button>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#161a22] border-b border-r border-[#cba135]/40 rotate-45" />
        </div>
      )}

      {/* Botón Flotante */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar a Naxo Resuelve por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_30px_rgba(203,161,53,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 whatsapp-pulse border-2 border-[#f2cf6b]/50"
      >
        <MessageSquare className="w-7 h-7 fill-white stroke-none" aria-hidden="true" />
        <span className="sr-only">Contactar por WhatsApp (se abre en una nueva pestaña)</span>
      </a>
    </aside>
  );
}
