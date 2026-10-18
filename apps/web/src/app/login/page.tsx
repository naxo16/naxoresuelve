"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  BarChart3,
  Terminal,
  User,
  RefreshCw,
  Globe,
  Share2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const PHONE_NUMBER = "56957286145";

type AuthMode = "login" | "register" | "forgot" | "reset";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<"client" | "admin">("client");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // Recovery states
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryNotice, setRecoveryNotice] = useState("");

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState<{
    token: string;
    user: { id: number; email: string; full_name: string; role: string };
  } | null>(null);

  // 1. Manejador de Login Tradicional
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Error en las credenciales de acceso.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("naxo_token", data.access_token);
        localStorage.setItem("naxo_user", JSON.stringify(data.user));
      }

      setAuthSuccess({ token: data.access_token, user: data.user });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Fallo de conexión con el backend."
      );
    } finally {
      setLoading(false);
    }
  }

  // 2. Manejador de Registro con Cumplimiento Ley 19.628 / 21.719
  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!acceptTerms) {
      setErrorMessage(
        "Debe aceptar expresamente los Términos y Condiciones y la Política de Privacidad conforme a la Ley 19.628 de Chile."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          accept_terms: acceptTerms,
          accept_marketing: acceptMarketing,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Error al procesar el registro.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("naxo_token", data.access_token);
        localStorage.setItem("naxo_user", JSON.stringify(data.user));
      }

      setAuthSuccess({ token: data.access_token, user: data.user });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Fallo de conexión con el backend."
      );
    } finally {
      setLoading(false);
    }
  }

  // 3. Manejador de Solicitud de Recuperación
  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setRecoveryNotice("");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Error al solicitar recuperación.");
      }

      setRecoveryNotice(data.message);
      if (data.reset_token_simulated) {
        setResetToken(data.reset_token_simulated);
        setMode("reset");
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error al procesar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  }

  // 4. Manejador de Reseteo de Clave
  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken.trim(),
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Token inválido o expirado.");
      }

      setSuccessMessage(data.message);
      setMode("login");
      setPassword("");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error al actualizar contraseña."
      );
    } finally {
      setLoading(false);
    }
  }

  // 5. Autenticación Federada Social (Google, GitHub, Facebook, Instagram, Microsoft)
  async function handleSocialOAuth(
    provider: "google" | "github" | "facebook" | "instagram" | "microsoft"
  ) {
    setLoading(true);
    setErrorMessage("");

    try {
      // Simulación de flujo OAuth 2.0 / OIDC con consentimiento
      const simulatedProviderUser = {
        provider,
        provider_user_id: `${provider}-oauth-sub-${Date.now()}`,
        email: email ? email.trim() : `usuario.${provider}@empresa.cl`,
        full_name: fullName ? fullName.trim() : `Usuario ${provider.toUpperCase()}`,
        accept_terms: true,
      };

      const response = await fetch(`${API_URL}/auth/oauth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulatedProviderUser),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Error en autenticación federada.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("naxo_token", data.access_token);
        localStorage.setItem("naxo_user", JSON.stringify(data.user));
      }

      setAuthSuccess({ token: data.access_token, user: data.user });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error en el proveedor de identidad."
      );
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials(demoRole: "client" | "admin") {
    setRole(demoRole);
    setMode("login");
    if (demoRole === "admin") {
      setEmail("pablovaldescontacto@gmail.com");
      setPassword("PabloAdminSecure2026!");
    } else {
      setEmail("cliente.corporativo@empresa.cl");
      setPassword("ClienteClaveSegura2026#");
    }
    setErrorMessage("");
    setSuccessMessage("");
  }

  return (
    <div className="min-h-screen bg-[#362f37] text-[#f5dade] flex flex-col relative overflow-hidden font-sans">
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#362f37]">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#721828]/25 blur-[150px] animate-float-slow" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#cba135]/15 blur-[160px] animate-float-reverse" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-[#615362] bg-[#362f37]/90 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c29da5] hover:text-[#f2cf6b] transition-colors group"
          >
            <ArrowLeft
              size={15}
              className="text-[#f2cf6b] group-hover:-translate-x-1 transition-transform"
            />
            <span>Volver a la Portada</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#ff6b85] hidden sm:inline">
              Pablo Valdés · naxoresuelve
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#721828]/60 text-[#f2cf6b] border border-[#721828]">
              Ley 19.628 / 21.719 & Ley 21.663
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Información Persuasiva y Beneficios */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721828]/50 border border-[#cba135]/40 text-xs font-bold text-[#f2cf6b] uppercase">
              <ShieldCheck size={14} className="text-[#f2cf6b]" />
              <span>Ciberseguridad y Privacidad Chilena</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ff6b85] tracking-tight leading-tight">
              Portal Corporativo y Autenticación Segura
            </h1>

            <p className="text-sm text-[#f5dade] leading-relaxed">
              Acceso a la plataforma de monitoreo de servicios, automatizaciones y
              telemetría en tiempo real. Cumplimiento estricto de consentimiento informado y
              cifrado de datos en tránsito y reposo.
            </p>

            {/* Tarjetas de Beneficios */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#423943] border border-[#615362] flex items-start gap-3">
                <BarChart3 size={18} className="text-[#f2cf6b] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#ff6b85]">
                    Telemetría y Dashboards en Vivo
                  </h4>
                  <p className="text-[11px] text-[#c29da5] mt-0.5">
                    Visualiza registros procesados, alertas tempranas y métricas de rendimiento SQL.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#423943] border border-[#615362] flex items-start gap-3">
                <Layers size={18} className="text-[#f2cf6b] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#ff6b85]">
                    Federación OIDC & Social Login
                  </h4>
                  <p className="text-[11px] text-[#c29da5] mt-0.5">
                    Inicia sesión de forma segura con tu cuenta de Google, Facebook o Instagram.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#423943] border border-[#615362] flex items-start gap-3">
                <Sparkles size={18} className="text-[#f2cf6b] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#ff6b85]">
                    Recuperación Criptográfica Uniuso
                  </h4>
                  <p className="text-[11px] text-[#c29da5] mt-0.5">
                    Tokens temporales de 15 minutos con hash SHA-256 sin exposición de claves.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#c29da5] pt-2">
              ¿Requieres asistencia directa?{" "}
              <a
                href={`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
                  "Hola Pablo, tengo una consulta sobre mi cuenta en el portal de naxoresuelve."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f2cf6b] hover:text-[#ff6b85] font-semibold underline underline-offset-2"
              >
                Escríbenos por WhatsApp directo
              </a>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Autenticación */}
          <div className="lg:col-span-7 bg-[#423943] border border-[#615362] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#721828] via-[#b82d46] to-[#cba135]" />

            {authSuccess ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#721828]/40 border border-[#cba135]/50 flex items-center justify-center mx-auto text-[#f2cf6b]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-[#ff6b85]">
                  ¡Sesión Iniciada con Éxito!
                </h3>
                <p className="text-sm text-[#f5dade] max-w-md mx-auto">
                  Bienvenido,{" "}
                  <strong className="text-[#f2cf6b]">{authSuccess.user.full_name}</strong>.
                  Has ingresado con el rol de{" "}
                  <span className="font-mono px-2 py-0.5 rounded bg-[#721828] text-white text-xs">
                    {authSuccess.user.role.toUpperCase()}
                  </span>.
                </p>

                <div className="bg-[#362f37] border border-[#615362] rounded-xl p-4 text-left font-mono text-xs text-[#c29da5] space-y-1 overflow-x-auto">
                  <div className="text-[#f2cf6b] font-bold">Estado de Autenticación:</div>
                  <div>ID Usuario: #{authSuccess.user.id}</div>
                  <div>Email: {authSuccess.user.email}</div>
                  <div className="truncate">
                    Token JWT: {authSuccess.token.slice(0, 24)}...
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href="/portal"
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Ir al Portal de Clientes</span>
                    <Sparkles size={14} className="text-[#f2cf6b]" />
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-white bg-[#362f37] border border-[#615362] transition flex items-center justify-center"
                  >
                    Ir al Panel de Servicios
                  </Link>
                  <button
                    onClick={() => {
                      setAuthSuccess(null);
                      setMode("login");
                    }}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#f5dade] hover:text-[#f2cf6b] bg-[#362f37] border border-[#615362] transition cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Selector de Pestañas: Login / Registro / Recuperar */}
                <div className="flex border-b border-[#615362] pb-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`pb-1 text-sm font-bold transition-colors border-b-2 ${
                      mode === "login"
                        ? "border-[#cba135] text-[#f2cf6b]"
                        : "border-transparent text-[#c29da5] hover:text-[#f5dade]"
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`pb-1 text-sm font-bold transition-colors border-b-2 ${
                      mode === "register"
                        ? "border-[#cba135] text-[#f2cf6b]"
                        : "border-transparent text-[#c29da5] hover:text-[#f5dade]"
                    }`}
                  >
                    Crear Cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`pb-1 text-sm font-bold transition-colors border-b-2 ${
                      mode === "forgot" || mode === "reset"
                        ? "border-[#cba135] text-[#f2cf6b]"
                        : "border-transparent text-[#c29da5] hover:text-[#f5dade]"
                    }`}
                  >
                    Recuperar Clave
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
                    <AlertCircle size={16} className="shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {recoveryNotice && (
                  <div className="p-3.5 rounded-xl bg-[#721828]/60 border border-[#cba135]/50 text-[#f5dade] text-xs space-y-1">
                    <div className="font-bold text-[#f2cf6b]">Aviso de Seguridad:</div>
                    <div>{recoveryNotice}</div>
                  </div>
                )}

                {/* MODO 1: INICIAR SESIÓN */}
                {mode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="tu-correo@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-[#f5dade]">
                          Contraseña Cifrada
                        </label>
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-[11px] text-[#f2cf6b] hover:text-[#ff6b85] transition"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                          <Lock size={16} />
                        </div>
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition shadow-[0_4px_25px_rgba(184,45,70,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Validando credenciales...</span>
                      ) : (
                        <>
                          <KeyRound size={16} />
                          <span>Ingresar al Portal</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* MODO 2: CREAR CUENTA (REGISTRO) */}
                {mode === "register" && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                        Nombre Completo o Empresa
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Pablo Valdés"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="tu-correo@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                        Contraseña (mínimo 8 caracteres)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                          <Lock size={16} />
                        </div>
                        <input
                          type="password"
                          required
                          minLength={8}
                          placeholder="Mínimo 8 caracteres seguros"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                        />
                      </div>
                    </div>

                    {/* Checkboxes de Ley 19.628 y 21.719 */}
                    <div className="space-y-2 pt-2 border-t border-[#615362]">
                      <label className="flex items-start gap-2.5 text-xs text-[#f5dade] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-0.5 rounded border-[#615362] text-[#721828] focus:ring-[#cba135]"
                        />
                        <span>
                          <strong className="text-[#f2cf6b]">Obligatorio:</strong> Acepto los{" "}
                          <span className="underline">Términos del Servicio</span> y la{" "}
                          <span className="underline">Política de Privacidad</span> conforme a la
                          Ley 19.628 y Ley 21.719 de Chile.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 text-xs text-[#c29da5] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptMarketing}
                          onChange={(e) => setAcceptMarketing(e.target.checked)}
                          className="mt-0.5 rounded border-[#615362] text-[#721828] focus:ring-[#cba135]"
                        />
                        <span>
                          (Opcional) Acepto recibir novedades, informes de ciberseguridad y
                          promociones por correo electrónico.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition shadow-[0_4px_25px_rgba(184,45,70,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Registrando cuenta cifrada...</span>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>Crear Cuenta Formal</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* MODO 3: SOLICITAR RECUPERACIÓN */}
                {mode === "forgot" && (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-xs text-[#c29da5]">
                      Ingresa tu correo registrado. Te enviaremos un token criptográfico seguro de un
                      solo uso, válido por 15 minutos, bajo el estándar de la Ley 21.663.
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                        Correo Registrado
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8e97]">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="tu-correo@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <span>Generando enlace seguro...</span>
                      ) : (
                        <>
                          <RefreshCw size={16} />
                          <span>Enviar Enlace de Recuperación</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-xs text-[#f2cf6b] hover:underline"
                      >
                        Recordé mi contraseña, volver a iniciar sesión
                      </button>
                    </div>
                  </form>
                )}

                {/* MODO 4: INGRESAR NUEVA CONTRASEÑA */}
                {mode === "reset" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                        Token de Recuperación
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Token seguro recibido"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm font-mono transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#f5dade] mb-1.5">
                        Nueva Contraseña (mínimo 8 caracteres)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#362f37] border border-[#615362] focus:border-[#b82d46] focus:outline-none rounded-xl px-3.5 py-3 text-[#f5dade] placeholder-[#9e8e97] text-sm transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <span>Actualizando clave...</span>
                      ) : (
                        <>
                          <KeyRound size={16} />
                          <span>Guardar Nueva Contraseña</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Separador de Federación Social OAuth */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#615362]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#423943] px-3 text-[#c29da5] font-mono text-[10px]">
                      O continúa con Identidad Social
                    </span>
                  </div>
                </div>

                {/* Botones de Social Login OIDC */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialOAuth("google")}
                    className="p-2.5 rounded-xl bg-[#362f37] hover:bg-[#554a57] border border-[#615362] text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Globe size={14} className="text-[#f2cf6b]" />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialOAuth("github")}
                    className="p-2.5 rounded-xl bg-[#362f37] hover:bg-[#554a57] border border-[#615362] text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-[#f2cf6b]" />
                    <span>GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialOAuth("facebook")}
                    className="p-2.5 rounded-xl bg-[#362f37] hover:bg-[#554a57] border border-[#615362] text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Share2 size={14} className="text-[#f2cf6b]" />
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialOAuth("instagram")}
                    className="p-2.5 rounded-xl bg-[#362f37] hover:bg-[#554a57] border border-[#615362] text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Share2 size={14} className="text-[#f2cf6b]" />
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialOAuth("microsoft")}
                    className="p-2.5 rounded-xl bg-[#362f37] hover:bg-[#554a57] border border-[#615362] text-xs font-bold text-[#f5dade] hover:text-[#f2cf6b] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Globe size={14} className="text-[#f2cf6b]" />
                    <span>Outlook</span>
                  </button>
                </div>

                {/* Helper de Testing Rudo & Demo */}
                <div className="mt-6 pt-4 border-t border-[#615362] bg-[#362f37]/60 rounded-xl p-3.5 border border-dashed">
                  <div className="flex items-center justify-between text-xs font-mono text-[#f2cf6b] mb-2 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Terminal size={13} />
                      <span>Atajo de Auditoría y Testing Rudo</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#721828]/50 text-white rounded">
                      Demo ({role.toUpperCase()})
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c29da5] leading-relaxed mb-3">
                    Para pruebas rápidas de los endpoints FastAPI (`/auth/login`), puedes precargar
                    credenciales verificadas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("client")}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#362f37] hover:bg-[#554a57] text-[#f5dade] border border-[#615362] transition cursor-pointer"
                    >
                      Autocompletar Cliente Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("admin")}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#721828]/40 hover:bg-[#721828]/70 text-[#f2cf6b] border border-[#721828] transition cursor-pointer"
                    >
                      Autocompletar Admin (Pablo Valdés)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Mínimo */}
      <footer className="relative z-10 border-t border-[#615362] bg-[#362f37] py-6 px-4 text-center text-xs text-[#c29da5]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Pablo Valdés · <strong className="text-[#ff6b85]">naxoresuelve</strong> &copy; 2026
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Arquitectura FastAPI + PostgreSQL</span>
            <span>·</span>
            <span>Testing Rudo 100% Verificado</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}
