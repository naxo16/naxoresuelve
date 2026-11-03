"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface AuthUIProps {
  initialTab?: "login" | "register";
  onSuccess?: () => void;
  className?: string;
}

export function AuthUI({ initialTab = "login", onSuccess, className = "" }: AuthUIProps) {
  const { login, register, loginWithProvider } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Estados de Registro
  const [companyName, setCompanyName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Estados de Carga y Feedback
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<"google" | "github" | null>(null);

  // Medidor de Seguridad de Contraseña (0 - 4 segmentos)
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Sin ingresar", color: "bg-gray-200" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: "Muy Débil", color: "bg-red-500" };
      case 2:
        return { score: 2, label: "Regular", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Buena", color: "bg-yellow-500" };
      case 4:
        return { score: 4, label: "Segura y Robusta", color: "bg-[#25D366]" };
      default:
        return { score: 0, label: "Muy Débil", color: "bg-red-500" };
    }
  };

  const strength = calculatePasswordStrength(registerPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    await login(loginEmail, loginPassword);
    setLoading(false);
    onSuccess?.();
    router.push("/dashboard");
  };

  const handleQuickDemoLogin = async () => {
    setLoginEmail("usuario@naxoresuelve.cl");
    setLoginPassword("usuario123");
    setLoading(true);
    await login("usuario@naxoresuelve.cl", "usuario123");
    setLoading(false);
    onSuccess?.();
    router.push("/dashboard");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !registerEmail || !registerPassword) return;
    setLoading(true);
    await register(companyName, registerEmail, registerPassword);
    setLoading(false);
    onSuccess?.();
    router.push("/dashboard");
  };

  const handleSSO = async (provider: "google" | "github") => {
    setProviderLoading(provider);
    await loginWithProvider(provider);
    setProviderLoading(null);
    onSuccess?.();
    router.push("/dashboard");
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tabs Superiores: Login vs Registro */}
      <div className="flex rounded-2xl border border-[#526072]/20 bg-[#FAF8F5] p-1.5 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={`flex-1 rounded-xl py-2.5 font-mono text-xs font-bold transition-all duration-200 ${
            activeTab === "login"
              ? "bg-[#1E2430] text-white shadow-sm"
              : "text-[#526072] hover:text-[#111827]"
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={`flex-1 rounded-xl py-2.5 font-mono text-xs font-bold transition-all duration-200 ${
            activeTab === "register"
              ? "bg-[#1E2430] text-white shadow-sm"
              : "text-[#526072] hover:text-[#111827]"
          }`}
        >
          Crear Cuenta
        </button>
      </div>

      {/* Formulario 1: Iniciar Sesión (Login) */}
      {activeTab === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Botón y Callout de Acceso Rápido Demo */}
          <div className="rounded-2xl border border-[#3de273]/40 bg-[#3de273]/10 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#080f1a] text-[#3de273]">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#080f1a]">¿Evaluar el panel sin fricción?</div>
                <div className="font-mono text-[11px] text-[#526071]">usuario@naxoresuelve.cl • usuario123</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#080f1a] bg-[#080f1a] px-3.5 py-2 font-mono text-xs font-bold text-white shadow-xs hover:bg-[#1E2430] active:scale-95 transition"
            >
              <span>⚡ Acceso Rápido Demo</span>
            </button>
          </div>

          <div>
            <label htmlFor="login-email-input" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827] mb-1.5">
              Correo Corporativo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#526072]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="login-email-input"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="contacto@tuempresa.cl"
                className="w-full rounded-xl border border-[#526072]/20 bg-[#FAF8F5] pl-10 pr-4 py-3 text-sm text-[#111827] placeholder:text-[#526072]/60 focus:border-[#1E2430] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2430]/10 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password-input" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827]">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() =>
                  alert("Para recuperar tu contraseña, solicita asistencia directa vía WhatsApp con Pablo.")
                }
                className="font-mono text-[11px] text-[#526072] hover:text-[#1E2430] hover:underline"
              >
                ¿Olvidaste tu clave?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#526072]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="login-password-input"
                type={showLoginPassword ? "text" : "password"}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#526072]/20 bg-[#FAF8F5] pl-10 pr-11 py-3 text-sm text-[#111827] placeholder:text-[#526072]/60 focus:border-[#1E2430] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2430]/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#526072] hover:text-[#111827]"
                aria-label={showLoginPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-[#1E2430] bg-[#1E2430] py-3.5 font-mono text-xs font-bold text-white shadow-sm transition-all hover:bg-[#111827] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Ingresar a mi Panel</span>
            )}
          </button>

          {/* Separador SSO */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#526072]/15" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-mono text-[10px] text-[#526072]">
                O continúa con Identidad Federada
              </span>
            </div>
          </div>

          {/* Botones de Federación SSO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={!!providerLoading}
              onClick={() => handleSSO("google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#526072]/20 bg-[#FAF8F5] px-4 py-2.5 font-mono text-xs font-bold text-[#111827] hover:bg-white hover:border-[#1E2430]/40 transition active:scale-95 disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{providerLoading === "google" ? "Conectando..." : "Google Workspace"}</span>
            </button>

            <button
              type="button"
              disabled={!!providerLoading}
              onClick={() => handleSSO("github")}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#526072]/20 bg-[#FAF8F5] px-4 py-2.5 font-mono text-xs font-bold text-[#111827] hover:bg-white hover:border-[#1E2430]/40 transition active:scale-95 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>{providerLoading === "github" ? "Conectando..." : "GitHub"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Formulario 2: Crear Cuenta (Sign Up) */}
      {activeTab === "register" && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-company-input" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827] mb-1.5">
              Nombre de la Empresa o Proyecto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#526072]">
                <Building className="h-4 w-4" />
              </div>
              <input
                id="register-company-input"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ej: Distribuidora del Maule SpA"
                className="w-full rounded-xl border border-[#526072]/20 bg-[#FAF8F5] pl-10 pr-4 py-3 text-sm text-[#111827] placeholder:text-[#526072]/60 focus:border-[#1E2430] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2430]/10 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-email-input" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827] mb-1.5">
              Correo Corporativo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#526072]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="register-email-input"
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="gerencia@tuempresa.cl"
                className="w-full rounded-xl border border-[#526072]/20 bg-[#FAF8F5] pl-10 pr-4 py-3 text-sm text-[#111827] placeholder:text-[#526072]/60 focus:border-[#1E2430] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2430]/10 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-password-input" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111827] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#526072]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="register-password-input"
                type={showRegisterPassword ? "text" : "password"}
                required
                minLength={8}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-xl border border-[#526072]/20 bg-[#FAF8F5] pl-10 pr-11 py-3 text-sm text-[#111827] placeholder:text-[#526072]/60 focus:border-[#1E2430] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2430]/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#526072] hover:text-[#111827]"
                aria-label={showRegisterPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Medidor de Seguridad de Contraseña */}
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#526072]">Seguridad de Clave:</span>
                <span className="font-bold text-[#111827]">{strength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`rounded-full transition-all duration-300 ${
                      step <= strength.score ? strength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#526072]/20 bg-[#FAF8F5] p-3 flex items-start gap-2 text-[11px] text-[#526072]">
            <ShieldCheck className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
            <span>Datos corporativos resguardados bajo la Ley 19.628 de Chile. Cero spam o venta de datos.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-[#1E2430] bg-[#1E2430] py-3.5 font-mono text-xs font-bold text-white shadow-sm transition-all hover:bg-[#111827] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creando cuenta de empresa...</span>
              </>
            ) : (
              <span>Crear Cuenta de Empresa</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
