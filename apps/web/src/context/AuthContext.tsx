"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  name: string;
  email: string;
  companyName?: string;
  provider?: "credentials" | "google" | "github";
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  activeTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  setActiveTab: (tab: "login" | "register") => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (companyName: string, email: string, password?: string) => Promise<boolean>;
  loginWithProvider: (provider: "google" | "github") => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "naxoresuelve_user_session_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Inicializar en null para asegurar paridad estricta entre SSR y Cliente
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const isInitialized = useRef(false);
  const router = useRouter();

  // Hidratar sesión de usuario desde localStorage sólo tras el montaje en cliente
  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => {
          setUser(parsed);
        });
      }
    } catch {
      // Ignorar errores de acceso
    } finally {
      isInitialized.current = true;
    }
  }, []);

  // Persistir cambios de sesión solo tras la inicialización
  useEffect(() => {
    if (!isInitialized.current) return;
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Ignorar
    }
  }, [user]);

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setActiveTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Simulación de delay de autenticación
    if (password) {
      // Validación local simulada
    }
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Extraer nombre de usuario amigable a partir del email
    const prefix = email.split("@")[0];
    const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);

    const newUser: AuthUser = {
      name: formattedName,
      email,
      provider: "credentials",
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const register = async (
    companyName: string,
    email: string,
    password?: string
  ): Promise<boolean> => {
    if (password) {
      // Validación local
    }
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser: AuthUser = {
      name: companyName,
      email,
      companyName,
      provider: "credentials",
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithProvider = async (provider: "google" | "github"): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockEmail =
      provider === "google" ? "gerencia@empresa-demo.cl" : "dev@empresa-demo.cl";
    const mockName = provider === "google" ? "Usuario Google Workspace" : "Desarrollador GitHub";

    const newUser: AuthUser = {
      name: mockName,
      email: mockEmail,
      provider,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        activeTab,
        openAuthModal,
        closeAuthModal,
        setActiveTab,
        login,
        register,
        loginWithProvider,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
