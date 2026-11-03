"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface CartItem {
  id: string;
  title: string;
  type: "saas_rental" | "one_off_project"; // Arriendo mensual vs Pago único
  price: number;
  category: string;
  number?: string;
  description?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isTransferModalOpen: boolean;
  setIsTransferModalOpen: (open: boolean) => void;
  openTransferModal: () => void;
  closeTransferModal: () => void;
  totalCount: number;
  subtotal: number;
  discount: number;
  totalFinal: number;
  coupon: string | null;
  couponDiscountPercent: number;
  isApplyingCoupon: boolean;
  couponError: string | null;
  couponSuccess: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  formatCLP: (amount: number) => string;
  getWhatsAppMessage: () => string;
  getTransferWhatsAppMessage: (uploadedFileName?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "naxoresuelve_cart_v2";
const COUPON_STORAGE_KEY = "naxoresuelve_coupon_v2";

export function formatCLP(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-CL")} CLP`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicialización limpia para evitar diferencias de hidratación SSR / Cliente
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const isInitialized = useRef(false);

  // Hidratar desde localStorage sólo en el cliente tras el montaje (Post-Hydration)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      queueMicrotask(() => {
        if (saved) {
          try {
            setItems(JSON.parse(saved));
          } catch {
            // Ignorar JSON inválido
          }
        }
        if (savedCoupon) {
          setCoupon(savedCoupon);
          if (savedCoupon.toUpperCase() === "NAXO2026") {
            setCouponDiscountPercent(0.15);
            setCouponSuccess("Cupón NAXO2026 aplicado (-15%)");
          }
        }
      });
    } catch {
      // Ignorar errores de acceso
    } finally {
      isInitialized.current = true;
    }
  }, []);

  // Persistir ítems en localStorage solo después de la inicialización
  useEffect(() => {
    if (!isInitialized.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar
    }
  }, [items]);

  // Persistir cupón en localStorage
  useEffect(() => {
    if (!isInitialized.current) return;
    try {
      if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, coupon);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Ignorar
    }
  }, [coupon]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Motor de cupones asíncrono preparado para API
  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    setIsApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);

    // Simulación de llamada a endpoint /api/v1/coupons/validate (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (cleanCode === "NAXO2026") {
      setCoupon(cleanCode);
      setCouponDiscountPercent(0.15);
      const msg = "Cupón NAXO2026 aplicado (-15%)";
      setCouponSuccess(msg);
      setIsApplyingCoupon(false);
      return { success: true, message: msg };
    } else {
      const errorMsg = "Código de descuento inválido o expirado.";
      setCouponError(errorMsg);
      setIsApplyingCoupon(false);
      return { success: false, message: errorMsg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponDiscountPercent(0);
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Cálculos reactivos de totales
  const totalCount = items.length;
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const discount = Math.round(subtotal * couponDiscountPercent);
  const totalFinal = Math.max(0, subtotal - discount);

  // Generador dinámico de URL y mensaje para WhatsApp
  const getWhatsAppMessage = (): string => {
    if (items.length === 0) {
      return "Hola Pablo, vengo de naxoresuelve.cl y quiero hacer una consulta técnica.";
    }

    let msg = `Hola Pablo, quiero coordinar la contratación de las siguientes soluciones en naxoresuelve.cl:\n\n`;
    items.forEach((item, index) => {
      const typeLabel = item.type === "saas_rental" ? "[Arriendo SaaS]" : "[Pago Único]";
      msg += `${index + 1}. ${item.title} ${typeLabel} — ${formatCLP(item.price)}\n`;
    });

    msg += `\nSubtotal: ${formatCLP(subtotal)}`;
    if (coupon && discount > 0) {
      msg += `\nCupón Aplicado (${coupon}): -${formatCLP(discount)} (15% OFF)`;
    }
    msg += `\nTotal Final: ${formatCLP(totalFinal)}`;
    msg += `\n\n¿Podemos revisar la propuesta formal de 1 página para coordinar el inicio?`;

    return msg;
  };

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  // Generador dinámico de URL y mensaje para transferencia bancaria manual
  const getTransferWhatsAppMessage = (uploadedFileName?: string): string => {
    if (items.length === 0) {
      return "Hola Pablo, acabo de realizar una transferencia bancaria y quiero coordinar la activación.";
    }

    let msg = `Hola Pablo, acabo de realizar la transferencia bancaria para activar las siguientes soluciones en naxoresuelve.cl:\n\n`;
    msg += `📋 Resumen del Pedido:\n`;
    items.forEach((item, index) => {
      const typeLabel = item.type === "saas_rental" ? "[Arriendo SaaS]" : "[Pago Único]";
      msg += `${index + 1}. ${item.title} ${typeLabel} — ${formatCLP(item.price)}\n`;
    });

    msg += `\nSubtotal: ${formatCLP(subtotal)}`;
    if (coupon && discount > 0) {
      msg += `\nCupón Aplicado (${coupon}): -${formatCLP(discount)} (15% OFF)`;
    }
    msg += `\n💰 Total Transferido: ${formatCLP(totalFinal)}`;
    if (uploadedFileName) {
      msg += `\n📎 Comprobante Adjunto: ${uploadedFileName} (listo para envío)`;
    } else {
      msg += `\n📎 Comprobante: Te adjunto la captura de la transferencia bancaria a continuación.`;
    }
    msg += `\n\n¿Podemos coordinar la validación y emisión de la propuesta formal de 1 página?`;

    return msg;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isOpen,
        setIsOpen,
        isTransferModalOpen,
        setIsTransferModalOpen,
        openTransferModal,
        closeTransferModal,
        totalCount,
        subtotal,
        discount,
        totalFinal,
        coupon,
        couponDiscountPercent,
        isApplyingCoupon,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        formatCLP,
        getWhatsAppMessage,
        getTransferWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
}
