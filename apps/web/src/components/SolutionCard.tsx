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
    <div className="solution-card-anim group relative flex flex-col justify-between rounded-2xl border border-slate-300/80 bg-white/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#1E2430]/60 hover:-translate-y-1.5 hover:shadow-xl hover:bg-white">
      <div className="flex flex-col gap-3.5">
        {/* Top Badges: Eyebrow + Type + Category */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-black tracking-wider text-[#1E2430]">
            {number}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-800">
              {category}
            </span>
            {type === "saas_rental" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#1E2430]/30 bg-[#1E2430]/5 px-2.5 py-0.5 font-mono text-xs font-bold text-[#1E2430]">
                <Server className="h-3 w-3 text-slate-700" />
                <span>Arriendo SaaS</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400 bg-emerald-50 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-950">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>Pago Único</span>
              </span>
            )}
          </div>
        </div>

        {/* Título y descripción con alto contraste */}
        <h3 className="text-base sm:text-lg font-black text-slate-950 group-hover:text-[#1E2430] transition-colors leading-snug">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-slate-800">
          {description}
        </p>
      </div>

      {/* Precio y Doble CTA */}
      <div className="mt-5 border-t border-slate-200 pt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
            Inversión:
          </span>
          <span className="font-mono text-sm font-black text-slate-950">
            {priceLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Botón Secundario: Cotizar vía WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-xs font-bold text-slate-900 shadow-xs transition hover:border-[#25D366] hover:bg-emerald-50 hover:text-emerald-950"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Consultar</span>
          </a>

          {/* Botón Primario: Agregar al Carrito */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 font-mono text-xs font-bold transition-all shadow-xs ${
              isAdded
                ? "border border-emerald-500 bg-emerald-500 text-slate-950 shadow-sm"
                : "border border-[#1E2430] bg-[#1E2430] text-white hover:border-[#25D366] hover:bg-[#25D366] hover:text-slate-950 hover:scale-102 active:scale-98"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>En Carrito</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Cotizar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
