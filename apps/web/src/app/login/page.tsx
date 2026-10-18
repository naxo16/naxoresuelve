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
  ExternalLink,
  HelpCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const PHONE_NUMBER = "56957286145";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "admin">("client");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState<{
    token: string;
    user: { id: number; email: string; full_name: string; role: string };
  } | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error en las credenciales de acceso.");
      }

      // Almacenar token en localStorage para persistencia de sesión
      if (typeof window !== "undefined") {
        localStorage.setItem("naxo_token", data.access_token);
        localStorage.setItem("naxo_user", JSON.stringify(data.user));
      }

      setAuthSuccess({
        token: data.access_token,
        user: data.user,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Fallo de conexión con el backend de autenticación.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials(demoRole: "client" | "admin") {
    setRole(demoRole);
    if (demoRole === "admin") {
      setEmail("pablovaldescontacto@gmail.com");
      setPassword("PabloAdminSecure2026!");
    } else {
      setEmail("cliente.corporativo@empresa.cl");
      setPassword("ClienteClaveSegura2026#");
    }
    setErrorMessage("");
  }

  return (
    <div className="min-h-screen bg-[#d6d0d5] text-[#181a22] flex flex-col relative overflow-hidden font-sans">
      {/* Background Decorativo Obsidian & Vino */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#d6d0d5]">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#721828]/25 blur-[150px] animate-float-slow" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#cba135]/15 blur-[160px] animate-float-reverse" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-[#b8acb5] bg-[#d6d0d5]/90 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#423e47] hover:text-[#7a580e] transition-colors group"
          >
            <ArrowLeft
              size={15}
              className="text-[#7a580e] group-hover:-translate-x-1 transition-transform"
            />
            <span>Volver a la Portada</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#660f1d] hidden sm:inline">
              Pablo Valdés · naxoresuelve
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#721828]/60 text-[#7a580e] border border-[#721828]">
              Portal Seguro SSL
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Columna Izquierda: Información Persuasiva y Beneficios del Portal (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721828]/50 border border-[#cba135]/40 text-xs font-bold text-[#7a580e] uppercase">
              <ShieldCheck size={14} className="text-[#7a580e]" />
              <span>Entorno Autenticado PBKDF2 + JWT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#660f1d] tracking-tight leading-tight">
              Control Centralizado de tus Servicios y Automatizaciones
            </h1>

            <p className="text-sm text-[#181a22] leading-relaxed">
              Ingresa al portal exclusivo para clientes y empresas contratantes.
              Monitorea en tiempo real tus pipelines de datos, estado de sincronización y métricas operativas.
            </p>

            {/* Tarjetas de Beneficios */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#ece6eb] border border-[#b8acb5] flex items-start gap-3">
                <BarChart3 size={18} className="text-[#7a580e] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#660f1d]">
                    Telemetría y Dashboards en Vivo
                  </h4>
                  <p className="text-[11px] text-[#423e47] mt-0.5">
                    Visualiza registros procesados, alertas tempranas y métricas de rendimiento SQL.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#ece6eb] border border-[#b8acb5] flex items-start gap-3">
                <Layers size={18} className="text-[#7a580e] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#660f1d]">
                    Gestión de SaaS y Licencias Activas
                  </h4>
                  <p className="text-[11px] text-[#423e47] mt-0.5">
                    Acceso a descargas, credenciales de API, tokens de integración y backups inmutables.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#ece6eb] border border-[#b8acb5] flex items-start gap-3">
                <Sparkles size={18} className="text-[#7a580e] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#660f1d]">
                    Preventa Prioritaria de Nuevas Soluciones
                  </h4>
                  <p className="text-[11px] text-[#423e47] mt-0.5">
                    Descuento exclusivo en los próximos paquetes y módulos de la tienda virtual multi-producto.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#423e47] pt-2">
              ¿No tienes tus credenciales corporativas aún?{" "}
              <a
                href={`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
                  "Hola Pablo, necesito solicitar las credenciales de acceso para mi empresa en el portal de naxoresuelve."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7a580e] hover:text-[#660f1d] font-semibold underline underline-offset-2"
              >
                Solicítalas por WhatsApp directo
              </a>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Login (7 cols) */}
          <div className="lg:col-span-7 bg-[#ece6eb] border border-[#b8acb5] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Acabado decorativo superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#721828] via-[#b82d46] to-[#cba135]" />

            {authSuccess ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#721828]/40 border border-[#cba135]/50 flex items-center justify-center mx-auto text-[#7a580e]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-[#660f1d]">
                  ¡Sesión Iniciada con Éxito!
                </h3>
                <p className="text-sm text-[#181a22] max-w-md mx-auto">
                  Bienvenido, <strong className="text-[#7a580e]">{authSuccess.user.full_name}</strong>.
                  Has ingresado con el rol de{" "}
                  <span className="font-mono px-2 py-0.5 rounded bg-[#721828] text-white text-xs">
                    {authSuccess.user.role.toUpperCase()}
                  </span>.
                </p>

                <div className="bg-[#d6d0d5] border border-[#b8acb5] rounded-xl p-4 text-left font-mono text-xs text-[#423e47] space-y-1 overflow-x-auto">
                  <div className="text-[#7a580e] font-bold">Estado de Autenticación:</div>
                  <div>ID Usuario: #{authSuccess.user.id}</div>
                  <div>Email: {authSuccess.user.email}</div>
                  <div className="truncate">Token JWT: {authSuccess.token.slice(0, 24)}...</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#721828] to-[#9e233b] hover:from-[#9e233b] hover:to-[#cba135] transition shadow-md"
                  >
                    Ir al Panel de Servicios
                  </Link>
                  <button
                    onClick={() => setAuthSuccess(null)}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#181a22] hover:text-[#7a580e] bg-[#e2dce1] border border-[#b8acb5] transition"
                  >
                    Cerrar Sesión / Probar Otra Cuenta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#b8acb5]">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#660f1d]">
                      Iniciar Sesión
                    </h2>
                    <p className="text-xs text-[#423e47] mt-0.5">
                      Ingresa tu correo y contraseña asignada
                    </p>
                  </div>

                  {/* Selector rápido de rol visual */}
                  <div className="flex items-center gap-1 bg-[#d6d0d5] p-1 rounded-xl border border-[#b8acb5]">
                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                        role === "client"
                          ? "bg-[#721828] text-white shadow-sm"
                          : "text-[#423e47] hover:text-[#181a22]"
                      }`}
                    >
                      Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                        role === "admin"
                          ? "bg-[#721828] text-white shadow-sm"
                          : "text-[#423e47] hover:text-[#181a22]"
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
                    <AlertCircle size={16} className="shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-[#181a22] mb-1.5"
                  >
                    Correo Electrónico Corporativo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e6875]">
                      <Mail size={16} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="tu-correo@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#d6d0d5] border border-[#b8acb5] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#181a22] placeholder-[#78727e] text-sm transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-[#181a22]"
                    >
                      Contraseña Cifrada
                    </label>
                    <a
                      href={`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
                        "Hola Pablo, olvidé mi contraseña del portal de clientes."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#7a580e] hover:text-[#660f1d] transition"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e6875]">
                      <Lock size={16} />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#d6d0d5] border border-[#b8acb5] focus:border-[#b82d46] focus:outline-none rounded-xl pl-10 pr-3.5 py-3 text-[#181a22] placeholder-[#78727e] text-sm transition"
                    />
                  </div>
                </div>

                {/* Botón de Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#721828] via-[#9e233b] to-[#cba135] hover:opacity-95 active:scale-[0.99] transition shadow-[0_4px_25px_rgba(184,45,70,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Validando credenciales criptográficas...</span>
                  ) : (
                    <>
                      <KeyRound size={16} />
                      <span>Ingresar al Portal {role === "admin" ? "Admin" : "Corporativo"}</span>
                    </>
                  )}
                </button>

                {/* Helper de Pruebas Rudas & Demo */}
                <div className="mt-6 pt-4 border-t border-[#b8acb5] bg-[#d6d0d5]/60 rounded-xl p-3.5 border border-dashed">
                  <div className="flex items-center justify-between text-xs font-mono text-[#7a580e] mb-2 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Terminal size={13} />
                      <span>Atajo de Auditoría y Testing Rudo</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#721828]/50 text-white rounded">
                      Demo Rápido
                    </span>
                  </div>
                  <p className="text-[11px] text-[#423e47] leading-relaxed mb-3">
                    Para propósitos de revisión y testing del endpoint FastAPI (`/auth/login`), puedes precargar credenciales de prueba con un clic:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("client")}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#e2dce1] hover:bg-[#d5ced5] text-[#181a22] border border-[#b8acb5] transition cursor-pointer"
                    >
                      Autocompletar Cliente Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("admin")}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#721828]/40 hover:bg-[#721828]/70 text-[#7a580e] border border-[#721828] transition cursor-pointer"
                    >
                      Autocompletar Admin (Pablo Valdés)
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer Mínimo */}
      <footer className="relative z-10 border-t border-[#b8acb5] bg-[#d6d0d5] py-6 px-4 text-center text-xs text-[#423e47]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Pablo Valdés · <strong className="text-[#660f1d]">naxoresuelve</strong> &copy; 2026
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
