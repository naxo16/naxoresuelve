"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  X,
  Trash2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Server,
  Sparkles,
  Building2,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/56957286145";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    clearCart,
    subtotal,
    discount,
    totalFinal,
    coupon,
    isApplyingCoupon,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon,
    formatCLP,
    getWhatsAppMessage,
    openTransferModal,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Prevenir scroll en body cuando está abierto
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

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    if (res.success) {
      setCouponInput("");
    }
  };

  const handleAnimatedRemove = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      removeItem(id);
      setDeletingId(null);
    }, 250);
  };

  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop con desenfoque suave */}
      <div
        className="fixed inset-0 bg-[#1E2430]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out border-l border-[#526072]/20 bg-white shadow-2xl flex flex-col">
          {/* Header del Drawer */}
          <div className="flex items-center justify-between border-b border-[#526072]/15 bg-[#FAF8F5] p-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-[#1E2430]">
                [ Carrito de Soluciones ]
              </span>
              <span className="rounded-full bg-[#1E2430]/10 px-2.5 py-0.5 font-mono text-xs font-bold text-[#1E2430]">
                {items.length} {items.length === 1 ? "servicio" : "servicios"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-[#526072] transition-colors hover:bg-black/5 hover:text-[#111827]"
              aria-label="Cerrar panel de carrito"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lista de Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center gap-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#526072] border border-[#526072]/20">
                  <Tag className="h-8 w-8 text-[#526072]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#111827]">
                    Tu carrito está vacío
                  </h4>
                  <p className="mt-1 text-xs text-[#526072] max-w-[270px]">
                    Explora el catálogo y añade soluciones de desarrollo, automatización o arriendos mensuales de SaaS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#1E2430] hover:underline"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`relative flex flex-col justify-between rounded-2xl border border-[#526072]/20 bg-[#FAF8F5] p-4 transition-all duration-300 ${
                      deletingId === item.id
                        ? "opacity-0 scale-95 -translate-x-3 pointer-events-none"
                        : "opacity-100 scale-100 hover:border-[#1E2430]/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {item.number && (
                            <span className="font-mono text-[10px] font-black text-[#1E2430]">
                              {item.number}
                            </span>
                          )}
                          {item.type === "saas_rental" ? (
                            <span className="inline-flex items-center gap-1 rounded bg-[#1E2430] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                              <Server className="h-2.5 w-2.5" />
                              Arriendo SaaS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-[#25D366]/20 border border-[#25D366]/40 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-900">
                              <Sparkles className="h-2.5 w-2.5 text-emerald-700" />
                              Pago Único
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1.5 text-sm font-bold text-[#111827]">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-[#526072] line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAnimatedRemove(item.id)}
                        className="rounded p-1 text-[#526072] transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Eliminar del carrito"
                        aria-label={`Eliminar ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#526072]/15 pt-2.5">
                      <span className="font-mono text-[11px] font-semibold text-[#526072]">
                        {item.type === "saas_rental" ? "Mensualidad:" : "Inversión:"}
                      </span>
                      <span className="font-mono text-xs font-black text-[#111827]">
                        {formatCLP(item.price)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex justify-between items-center">
                  <span className="font-mono text-[11px] text-[#526072]">
                    {items.length} {items.length === 1 ? "ítem añadido" : "ítems añadidos"}
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="font-mono text-[11px] text-[#526072] hover:text-red-600 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Motor de Cupones + Desglose de Totales y Checkout */}
          {items.length > 0 && (
            <div className="border-t border-[#526072]/15 bg-[#FAF8F5] p-5 space-y-4">
              {/* Sistema de Cupones */}
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Ingresar código de descuento"
                      className="w-full rounded-xl border border-[#526072]/20 bg-white px-3.5 py-2 text-xs font-mono text-[#111827] placeholder:text-[#526072]/60 focus:border-[#1E2430] focus:outline-none uppercase"
                      disabled={isApplyingCoupon || !!coupon}
                    />
                  </div>
                  {coupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 font-mono text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Quitar
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#1E2430] bg-[#1E2430] px-4 py-2 font-mono text-xs font-bold text-white shadow-xs transition-all hover:bg-[#111827] disabled:opacity-50"
                    >
                      {isApplyingCoupon ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Validando...</span>
                        </>
                      ) : (
                        <span>Aplicar</span>
                      )}
                    </button>
                  )}
                </form>

                {/* Feedback del cupón */}
                {couponSuccess && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-[#25D366]/20 border border-[#25D366]/40 rounded-lg p-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{couponSuccess}</span>
                  </div>
                )}
                {couponError && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}
                {!coupon && !couponSuccess && (
                  <p className="font-mono text-[10px] text-[#526072]">
                    Prueba el código: <strong className="text-[#1E2430]">NAXO2026</strong> (15% OFF)
                  </p>
                )}
              </div>

              {/* Desglose de Totales */}
              <div className="rounded-xl border border-[#526072]/20 bg-white p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[#526072]">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#111827]">{formatCLP(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between font-mono font-bold text-[#25D366]">
                    <span className="text-emerald-700">Descuento ({coupon}):</span>
                    <span className="text-emerald-700">-{formatCLP(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-[#526072]/15 pt-2 font-mono">
                  <span className="font-bold uppercase tracking-wider text-[#111827]">
                    Total Final:
                  </span>
                  <span className="text-lg font-black text-[#1E2430]">
                    {formatCLP(totalFinal)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#526072] pt-1 border-t border-[#526072]/10">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                  <span>Sujeto a propuesta formal de 1 página • Garantía estipulada</span>
                </div>
              </div>

              {/* Checkout CTAs: Transferencia Bancaria Manual + WhatsApp Directo */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openTransferModal();
                  }}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#080f1a] bg-[#080f1a] px-5 py-3.5 font-mono text-xs font-bold text-white shadow-md transition-all duration-300 hover:border-[#3de273] hover:bg-[#3de273] hover:text-[#080f1a] active:scale-[0.99]"
                >
                  <Building2 className="h-4 w-4 text-[#3de273] transition-colors group-hover:text-[#080f1a]" />
                  <span>Pagar con Transferencia Bancaria</span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#efeeeb] bg-white px-5 py-2.5 font-mono text-xs font-bold text-[#526071] transition-all hover:bg-[#fbf9f6] hover:text-[#080f1a] hover:border-[#080f1a]/30 active:scale-[0.99]"
                >
                  <MessageCircle className="h-4 w-4 text-[#526071] transition-colors group-hover:text-[#080f1a]" />
                  <span>Coordinar Pedido por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
