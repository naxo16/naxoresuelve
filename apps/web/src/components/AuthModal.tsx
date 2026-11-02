"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthUI } from "@/components/AuthUI";
import { X, Sparkles } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, activeTab } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con desenfoque suave */}
      <div
        className="fixed inset-0 bg-[#1E2430]/60 backdrop-blur-md transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#526072]/20 bg-white shadow-2xl z-10 p-6 sm:p-8">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#526072]/15 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1E2430] text-[#25D366]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2430]">
              Portal Clientes & Acceso a Sistemas
            </span>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="rounded-lg p-1.5 text-[#526072] hover:bg-black/5 hover:text-[#111827] transition-colors"
            aria-label="Cerrar modal de autenticación"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Componente Modular de Autenticación */}
        <AuthUI initialTab={activeTab} onSuccess={closeAuthModal} />
      </div>
    </div>
  );
}
