"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";
import { TransferModal } from "@/components/TransferModal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <TransferModal />
        <AuthModal />
      </CartProvider>
    </AuthProvider>
  );
}
