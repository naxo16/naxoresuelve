"use client";

import { useCart, CartItem } from "@/context/CartContext";
import { MessageCircle, Plus, Check, Server, Sparkles } from "lucide-react";

export interface SolutionCardProps {
  id: string;
  number: string;
  title: string;
  description: string;
  price: number;
  priceLabel: string;
  type: "saas_rental" | "one_off_project";
  category: string;
}

const WHATSAPP_URL = "https://wa.me/56957286145";

export function SolutionCard({
  id,
  number,
  title,
  description,
  price,
  priceLabel,
  type,
  category,
}: SolutionCardProps) {
  const { addItem, items } = useCart();

  const isAdded = items.some((item) => item.id === id);

  const handleAddToCart = () => {
    const item: CartItem = {
      id,
      number,
      title,
      description,
      price,
      type,
      category,
    };
    addItem(item);
  };

  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    `Hola Pablo, tengo una consulta sobre la solución [${number}] ${title} (${priceLabel}).`
  )}`;

  return (
    <div className="solution-card-anim group relative flex flex-col justify-between rounded-2xl border border-[#526072]/20 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/40 hover:-translate-y-1 hover:shadow-xl hover:bg-white">
      <div className="flex flex-col gap-3">
        {/* Top Badges: Eyebrow + Type + Category */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-black tracking-wider text-[#1E2430]">
            {number}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-[#FAF8F5] border border-[#526072]/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#526072]">
              {category}
            </span>
            {type === "saas_rental" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#1E2430]/20 bg-[#1E2430]/5 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1E2430]">
                <Server className="h-3 w-3 text-[#526072]" />
                <span>Arriendo SaaS</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-900">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>Pago Único</span>
              </span>
            )}
          </div>
        </div>

        {/* Título y descripción */}
        <h3 className="text-base font-extrabold text-[#111827] group-hover:text-[#1E2430] transition-colors leading-snug">
          {title}
        </h3>

        <p className="text-xs leading-relaxed text-[#526072]">
          {description}
        </p>
      </div>

      {/* Precio y Doble CTA */}
      <div className="mt-5 border-t border-[#526072]/15 pt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#526072]">
            Inversión:
          </span>
          <span className="font-mono text-xs font-black text-[#111827]">
            {priceLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Botón Secundario: Cotizar vía WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#526072]/25 bg-[#FAF8F5] px-3 py-2.5 font-mono text-xs font-bold text-[#111827] shadow-xs transition-all hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] active:scale-95"
            aria-label={`Cotizar ${title} por WhatsApp`}
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#526072]" />
            <span>Cotizar</span>
          </a>

          {/* Botón Primario: + Agregar al Carrito */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 font-mono text-xs font-bold transition-all active:scale-95 ${
              isAdded
                ? "border-[#25D366] bg-[#25D366]/20 text-emerald-950 font-black"
                : "border-[#1E2430] bg-[#1E2430] text-white hover:bg-[#111827] hover:shadow-md"
            }`}
            aria-label={`Agregar ${title} al carrito`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>+ Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
