"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";
import { TransferModal } from "@/components/TransferModal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <TransferModal />
        <AuthModal />
        <FloatingWhatsApp />
      </CartProvider>
    </AuthProvider>
  );
}
