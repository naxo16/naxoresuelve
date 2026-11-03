"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Server,
  FileText,
  ExternalLink,
  ShieldCheck,
  Download,
  LogOut,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  HelpCircle,
  Send,
  Plus,
  Lock,
  Smartphone,
  Laptop,
  Check,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  QrCode,
  ShieldAlert,
} from "lucide-react";

type DashboardTab = "saas" | "projects" | "tickets" | "security";

interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  status: "En Proceso" | "Resuelto";
  createdAt: string;
  userMessage: string;
  adminResponse?: string;
  responseDate?: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("saas");

  // Estados de Tickets de Soporte
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TCK-1045",
      title: "Ajuste de permisos de usuario para cajero de turno",
      category: "Mini ERP de Caja",
      priority: "Alta",
      status: "En Proceso",
      createdAt: "02 Nov 2026, 10:30",
      userMessage:
        "Necesitamos restringir que el nuevo cajero de turno no pueda visualizar el saldo acumulado de los meses anteriores en el reporte.",
      adminResponse:
        "Recibido estimado. Estoy aplicando la regla RBAC en la tabla de usuarios en el servidor Staging privado para ocultar la vista histórica del perfil cajero. Te avisaré por WhatsApp apenas esté desplegado para que lo apruebes.",
      responseDate: "02 Nov 2026, 11:15",
    },
    {
      id: "TCK-1042",
      title: "Duda con exportación de reporte mensual de caja",
      category: "Mini ERP de Caja",
      priority: "Media",
      status: "Resuelto",
      createdAt: "28 Oct 2026, 15:20",
      userMessage:
        "¿Cómo puedo descargar el resumen mensual consolidado para el contador sin tener que abrir planilla por planilla?",
      adminResponse:
        "Hola, para exportar el consolidado mensual con un solo clic, ve a tu consola privada y pulsa 'Exportar Balance 3FN'. Se descargará un archivo CSV limpio y un PDF con el arqueo cerrado y sin datos duplicados.",
      responseDate: "28 Oct 2026, 15:45",
    },
    {
      id: "TCK-1038",
      title: "Configuración de notificaciones en WhatsApp para alertas de stock",
      category: "Control de Stock",
      priority: "Media",
      status: "Resuelto",
      createdAt: "22 Oct 2026, 09:10",
      userMessage:
        "¿Es posible agregar un segundo número de teléfono para que le lleguen las alertas de quiebre de stock al encargado de bodega?",
      adminResponse:
        "Listo. Añadimos el número del encargado de bodega en las variables de entorno de la instancia cloud. Se realizaron pruebas de disparo y las alertas llegaron de forma inmediata.",
      responseDate: "22 Oct 2026, 09:40",
    },
  ]);

  const [ticketFilter, setTicketFilter] = useState<"Todos" | "En Proceso" | "Resuelto">("Todos");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState("Mini ERP de Caja");
  const [newTicketPriority, setNewTicketPriority] = useState<"Baja" | "Media" | "Alta" | "Urgente">("Media");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState<string | null>(null);

  // Estados de Configuración y Seguridad
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  // Estados de 2FA / MFA
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorFeedback, setTwoFactorFeedback] = useState<string | null>(null);
  const [isEnrolling2FA, setIsEnrolling2FA] = useState(false);

  // Estados de Sesiones
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "Windows 11 • Chrome 130",
      location: "Santiago, Chile",
      ip: "190.160.24.112",
      current: true,
      lastActive: "Activa ahora",
      icon: Laptop,
    },
    {
      id: "sess-2",
      device: "iPhone 15 • Safari 18",
      location: "Valparaíso, Chile",
      ip: "186.105.88.45",
      current: false,
      lastActive: "Hace 2 horas",
      icon: Smartphone,
    },
  ]);

  const clientName = user?.name || "Cliente Corporativo";
  const clientEmail = user?.email || "usuario@naxoresuelve.cl";

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketMessage.trim()) return;

    const newTicket: Ticket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicketTitle,
      category: newTicketCategory,
      priority: newTicketPriority,
      status: "En Proceso",
      createdAt: "Hoy, " + new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      userMessage: newTicketMessage,
      adminResponse: "Ticket recepcionado. Pablo revisará tu caso en breve según el SLA comprometido.",
      responseDate: "En asignación",
    };

    setTickets((prev) => [newTicket, ...prev]);
    setNewTicketTitle("");
    setNewTicketMessage("");
    setIsCreatingTicket(false);
    setSelectedTicket(newTicket);
    setTicketSuccessMsg(`¡Ticket #${newTicket.id} creado con éxito!`);
    setTimeout(() => setTicketSuccessMsg(null), 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordFeedback("Ingresa tu contraseña actual.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordFeedback("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback("Las contraseñas no coinciden.");
      return;
    }

    setPasswordFeedback("¡Contraseña actualizada con éxito bajo estándares PBKDF2!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  const handle2FAVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.trim().length !== 6) {
      setTwoFactorFeedback("Ingresa el código numérico de 6 dígitos.");
      return;
    }

    setIs2FAEnabled(true);
    setIsEnrolling2FA(false);
    setTwoFactorCode("");
    setTwoFactorFeedback("¡Autenticación de Dos Factores (2FA) activada con éxito!");
    setTimeout(() => setTwoFactorFeedback(null), 4000);
  };

  const handleTerminateSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === "Todos") return true;
    return t.status === ticketFilter;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#080f1a] font-sans pb-24">
      {/* 1. Barra Superior con Identidad y Logout */}
      <header className="sticky top-0 z-30 border-b border-[#efeeeb] bg-[#ffffff]/90 backdrop-blur-md px-5 py-3.5 shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xs font-bold text-[#526071] hover:text-[#080f1a] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a la Web</span>
            </Link>
            <span className="text-[#efeeeb]">|</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#080f1a]">
              [ Consola de Gestión de Cliente ]
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#080f1a]">{clientName}</span>
              <span className="font-mono text-[10px] text-[#526071]">{clientEmail}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3.5 py-1.5 font-mono text-xs font-bold text-[#526071] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-8 lg:px-10 space-y-8">
        {/* Banner de Bienvenida y Telemetría */}
        <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#3de273]/15 border border-[#3de273]/30 px-3 py-0.5 font-mono text-xs font-bold text-[#080f1a]">
              <span className="h-2 w-2 rounded-full bg-[#3de273] animate-pulse" />
              <span>SLA Operativo Activo • Infraestructura Monitoreada</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#080f1a] tracking-tight">
              Portal de Operaciones: {clientName}
            </h1>
            <p className="text-sm text-[#526071] max-w-2xl leading-relaxed">
              Monitorea el estado operativo de tus aplicaciones SaaS arrendadas, revisa los avances en Staging bajo la metodología de 4 pasos y gestiona tickets de soporte directo con Pablo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://wa.me/56957286145?text=Hola%20Pablo,%20tengo%20una%20consulta%20técnica%20sobre%20mi%20panel%20de%20cliente."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#080f1a] bg-[#080f1a] px-4 py-2.5 font-mono text-xs font-bold text-white shadow-xs hover:border-[#3de273] hover:bg-[#3de273] hover:text-[#080f1a] transition active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-[#3de273]" />
              <span>WhatsApp Directo con Pablo</span>
            </a>
          </div>
        </div>

        {/* Barra de 4 Pestañas Canónicas (Japanese Minimalism) */}
        <div className="flex overflow-x-auto rounded-2xl border border-[#efeeeb] bg-[#ffffff] p-1.5 shadow-2xs scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("saas")}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-mono text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "saas"
                ? "bg-[#080f1a] text-white shadow-xs"
                : "text-[#526071] hover:text-[#080f1a] hover:bg-[#fbf9f6]"
            }`}
          >
            <Server className="h-4 w-4" />
            <span>Mis SaaS & Arriendos</span>
            <span className={`rounded-full px-2 py-0.2 text-[10px] ${activeTab === "saas" ? "bg-white/20 text-white" : "bg-[#efeeeb] text-[#526071]"}`}>
              3
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-mono text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "projects"
                ? "bg-[#080f1a] text-white shadow-xs"
                : "text-[#526071] hover:text-[#080f1a] hover:bg-[#fbf9f6]"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Proyectos & Cotizaciones</span>
            <span className={`rounded-full px-2 py-0.2 text-[10px] ${activeTab === "projects" ? "bg-white/20 text-white" : "bg-[#efeeeb] text-[#526071]"}`}>
              2
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-mono text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "tickets"
                ? "bg-[#080f1a] text-white shadow-xs"
                : "text-[#526071] hover:text-[#080f1a] hover:bg-[#fbf9f6]"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Soporte Técnico</span>
            <span className={`rounded-full px-2 py-0.2 text-[10px] ${activeTab === "tickets" ? "bg-white/20 text-white" : "bg-[#efeeeb] text-[#526071]"}`}>
              {tickets.filter((t) => t.status === "En Proceso").length} en curso
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-mono text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "security"
                ? "bg-[#080f1a] text-white shadow-xs"
                : "text-[#526071] hover:text-[#080f1a] hover:bg-[#fbf9f6]"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Configuración & Seguridad</span>
          </button>
        </div>

        {/* ========================================================
            PESTAÑA 1: MIS SAAS & ARRIENDOS
            ======================================================== */}
        {activeTab === "saas" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#080f1a]">
                  Sistemas SaaS Arrendados en Producción
                </h2>
                <p className="text-xs text-[#526071]">
                  Instancias cloud dedicadas con base de datos PostgreSQL aislada y respaldos automáticos diarios.
                </p>
              </div>
              <Link
                href="/que-hacemos"
                className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#080f1a] hover:underline"
              >
                <span>+ Arrendar otra solución</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjeta 1: Mini ERP de Caja */}
              <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 shadow-xs flex flex-col justify-between gap-5 hover:border-[#080f1a]/30 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 bg-[#3de273]/15 border border-[#3de273]/30 px-2.5 py-0.5 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-[#3de273] animate-pulse" />
                      🟢 Online (Activo)
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#526071]">
                      SaaS V1.4
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#080f1a]">
                    Mini ERP & Control de Caja del Día
                  </h3>

                  <p className="text-xs text-[#526071] leading-relaxed">
                    Arqueo de caja rápido, registro de compras y ventas sin planillas rotas ni lentitud de computadores.
                  </p>

                  <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-3.5 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Próxima Renovación:</span>
                      <span className="font-bold text-[#080f1a]">01 Dic 2026</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Base de Datos:</span>
                      <span className="font-bold text-[#080f1a]">PostgreSQL 16 (3FN)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Respaldos Automáticos:</span>
                      <span className="text-[#3de273] font-bold">Diarios (02:00 AM)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#efeeeb] pt-4 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-[#080f1a]">
                    $150.000 CLP / mes
                  </span>

                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#080f1a] bg-[#080f1a] px-3.5 py-2 font-mono text-xs font-bold text-white hover:bg-[#3de273] hover:text-[#080f1a] hover:border-[#3de273] transition active:scale-95 shadow-2xs"
                  >
                    <span>Abrir Consola Privada</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Tarjeta 2: Control de Stock */}
              <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 shadow-xs flex flex-col justify-between gap-5 hover:border-[#080f1a]/30 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 bg-[#3de273]/15 border border-[#3de273]/30 px-2.5 py-0.5 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-[#3de273] animate-pulse" />
                      🟢 Online (Activo)
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#526071]">
                      SaaS V1.2
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#080f1a]">
                    Control de Stock & Alertas de Inventario
                  </h3>

                  <p className="text-xs text-[#526071] leading-relaxed">
                    Monitoreo automático de quiebres de mercadería con avisos preventivos a WhatsApp antes de que falte stock.
                  </p>

                  <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-3.5 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Próxima Renovación:</span>
                      <span className="font-bold text-[#080f1a]">15 Dic 2026</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Productos Indexados:</span>
                      <span className="font-bold text-[#080f1a]">1.420 SKUs activos</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Disponibilidad (Uptime):</span>
                      <span className="text-[#3de273] font-bold">99.98%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#efeeeb] pt-4 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-[#080f1a]">
                    $150.000 CLP / mes
                  </span>

                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#080f1a] bg-[#080f1a] px-3.5 py-2 font-mono text-xs font-bold text-white hover:bg-[#3de273] hover:text-[#080f1a] hover:border-[#3de273] transition active:scale-95 shadow-2xs"
                  >
                    <span>Abrir Consola Privada</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Tarjeta 3: Bot de WhatsApp 24/7 */}
              <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 shadow-xs flex flex-col justify-between gap-5 hover:border-[#080f1a]/30 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 bg-[#3de273]/15 border border-[#3de273]/30 px-2.5 py-0.5 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-[#3de273] animate-pulse" />
                      🟢 Online (Activo)
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#526071]">
                      Bot V2.1
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#080f1a]">
                    Respuestas Automáticas & Bot WhatsApp
                  </h3>

                  <p className="text-xs text-[#526071] leading-relaxed">
                    Canalización de precios, ubicación y catálogo de productos 24/7 sin perder ventas fuera de horario.
                  </p>

                  <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-3.5 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Próxima Renovación:</span>
                      <span className="font-bold text-[#080f1a]">20 Dic 2026</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Mensajes Atendidos:</span>
                      <span className="font-bold text-[#080f1a]">482 esta semana</span>
                    </div>
                    <div className="flex items-center justify-between text-[#526071]">
                      <span>Webhook Meta API:</span>
                      <span className="text-[#3de273] font-bold">Conectado</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#efeeeb] pt-4 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-[#080f1a]">
                    $60.000 CLP / mes
                  </span>

                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#080f1a] bg-[#080f1a] px-3.5 py-2 font-mono text-xs font-bold text-white hover:bg-[#3de273] hover:text-[#080f1a] hover:border-[#3de273] transition active:scale-95 shadow-2xs"
                  >
                    <span>Abrir Consola Privada</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 2: PROYECTOS & COTIZACIONES (METODOLOGÍA 4 PASOS)
            ======================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#080f1a]">
                Seguimiento de Servicios a Medida & Propuestas
              </h2>
              <p className="text-xs text-[#526071]">
                Desarrollo bajo la metodología canónica de 4 pasos con presupuesto garantizado y cero cobros sorpresa.
              </p>
            </div>

            {/* Explicador Visual de la Metodología de 4 Pasos */}
            <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 shadow-xs space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#526071]">
                Metodología Operativa de 4 Pasos
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 space-y-1">
                  <div className="font-mono text-xs font-bold text-[#080f1a]">01. Diagnóstico</div>
                  <div className="text-xs text-[#526071]">15 min de análisis directo para evaluar viabilidad real.</div>
                </div>
                <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 space-y-1">
                  <div className="font-mono text-xs font-bold text-[#080f1a]">02. Alcance Cerrado</div>
                  <div className="text-xs text-[#526071]">Propuesta formal de 1 pág con checklist estricto de entregables.</div>
                </div>
                <div className="rounded-2xl border border-[#3de273]/40 bg-[#3de273]/10 p-4 space-y-1">
                  <div className="font-mono text-xs font-bold text-[#080f1a] flex items-center justify-between">
                    <span>03. Staging Privado</span>
                    <span className="text-[10px] bg-[#3de273] text-[#080f1a] px-1.5 py-0.2 rounded font-black">Activo</span>
                  </div>
                  <div className="text-xs text-[#526071]">Pruebas funcionales en servidor privado antes de lanzar.</div>
                </div>
                <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 space-y-1">
                  <div className="font-mono text-xs font-bold text-[#080f1a]">04. Producción</div>
                  <div className="text-xs text-[#526071]">Entrega definitiva, transferencia 100% y garantía estipulada.</div>
                </div>
              </div>
            </div>

            {/* Proyecto 1: En Staging Privado */}
            <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 font-mono text-xs font-bold text-blue-800">
                      <Clock className="h-3 w-3" />
                      <span>Fase 3: Pruebas en Servidor Staging (75% completado)</span>
                    </span>
                    <span className="font-mono text-xs text-[#526071]">
                      Iniciado: 24 Oct 2026
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#080f1a] mt-2">
                    Migración de Planillas de Excel Desordenadas a Base Web
                  </h3>
                  <p className="text-xs text-[#526071] mt-1">
                    Traspaso de planillas críticas de cobranza y stock a sistema web con respaldo automático y validación contra errores humanos.
                  </p>
                </div>

                <div className="flex flex-col text-right font-mono">
                  <span className="text-xs text-[#526071]">Inversión Total Cerrada:</span>
                  <span className="text-lg font-black text-[#080f1a]">$120.000 CLP</span>
                  <span className="text-[10px] text-emerald-700 font-bold">50% Anticipo Transferido ($60.000)</span>
                </div>
              </div>

              {/* Stepper Gráfico del Proyecto */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#080f1a]">Avance de Entregables:</span>
                  <span className="text-[#526071]">Paso 3 de 4</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-2 rounded-full bg-[#3de273]" title="Diagnóstico: Completado" />
                  <div className="h-2 rounded-full bg-[#3de273]" title="Alcance: Aprobado" />
                  <div className="h-2 rounded-full bg-[#3de273] animate-pulse" title="Staging: En Pruebas" />
                  <div className="h-2 rounded-full bg-[#efeeeb]" title="Producción: Pendiente de Aprobación" />
                </div>
              </div>

              {/* Checklist de Entregables */}
              <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-5 space-y-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#080f1a]">
                  Checklist de Entregables (Sujeto a Propuesta Formal de 1 Página):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3de273] shrink-0" />
                    <span className="text-[#080f1a]">Diseño de modelo relacional PostgreSQL sin datos duplicados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3de273] shrink-0" />
                    <span className="text-[#080f1a]">Script de limpieza para 4.200 filas de Excel corruptas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3de273] shrink-0" />
                    <span className="text-[#080f1a]">Despliegue en servidor privado de Staging (staging.naxoresuelve.cl)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#526071]">
                    <div className="h-4 w-4 rounded-full border border-[#526071]/40 shrink-0" />
                    <span>Aprobación de checklist por el cliente y transferencia final de accesos</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <a
                    href="/images/naxoresuelve.jpg"
                    download="Propuesta_Formal_Migracion_Excel.jpg"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#efeeeb] bg-white px-4 py-2 font-mono text-xs font-bold text-[#080f1a] hover:bg-[#fbf9f6] transition shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5 text-[#526071]" />
                    <span>Descargar Propuesta Formal (1 Pág)</span>
                  </a>

                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#efeeeb] bg-white px-4 py-2 font-mono text-xs font-bold text-[#080f1a] hover:bg-[#fbf9f6] transition shadow-2xs"
                  >
                    <span>Entorno de Pruebas Staging</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#526071]" />
                  </Link>
                </div>

                <a
                  href="https://wa.me/56957286145?text=Hola%20Pablo,%20estoy%20revisando%20el%20servidor%20Staging%20de%20la%20migración%20de%20Excel."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-bold text-[#080f1a] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#3de273]" />
                  <span>Coordinar Aprobación de Staging</span>
                </a>
              </div>
            </div>

            {/* Proyecto 2: Finalizado */}
            <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 font-mono text-xs font-bold text-emerald-800">
                      <Check className="h-3 w-3 text-[#3de273]" />
                      <span>Fase 4: Producción & Transferencia Total (100% Finalizado)</span>
                    </span>
                    <span className="font-mono text-xs text-[#526071]">
                      Entregado: 18 Oct 2026
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#080f1a] mt-2">
                    Aparecer en el Mapa de Google & Optimización de Ficha Local
                  </h3>
                </div>

                <span className="font-mono text-xs font-bold text-[#080f1a]">
                  $50.000 CLP (Pagado 100%)
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#efeeeb] pt-3 text-xs">
                <span className="font-mono text-[#526071]">
                  Garantía post-entrega estipulada: <strong className="text-[#080f1a]">Vigente hasta Dic 2026</strong>
                </span>
                <a
                  href="/images/naxoresuelve.jpg"
                  download="Acta_Entrega_Google_Maps.jpg"
                  className="font-mono text-xs font-bold text-[#080f1a] hover:underline flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar Documento de Entrega</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 3: SOPORTE TÉCNICO (BANDEJA DE TICKETS)
            ======================================================== */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#080f1a]">
                  Bandeja de Tickets de Soporte Técnico
                </h2>
                <p className="text-xs text-[#526071]">
                  Envía solicitudes de ayuda, reporta dudas operativas y revisa las respuestas directas de ingeniería.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingTicket((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#080f1a] bg-[#080f1a] px-4 py-2.5 font-mono text-xs font-bold text-white shadow-xs hover:border-[#3de273] hover:bg-[#3de273] hover:text-[#080f1a] transition active:scale-95 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>{isCreatingTicket ? "Cerrar Formulario" : "Nuevo Ticket de Soporte"}</span>
              </button>
            </div>

            {/* Mensaje de confirmación de ticket */}
            {ticketSuccessMsg && (
              <div className="rounded-2xl border border-[#3de273]/40 bg-[#3de273]/15 p-4 flex items-center gap-3 text-xs font-bold text-[#080f1a]">
                <CheckCircle2 className="h-5 w-5 text-[#3de273]" />
                <span>{ticketSuccessMsg}</span>
              </div>
            )}

            {/* Formulario de Creación de Ticket */}
            {isCreatingTicket && (
              <form onSubmit={handleCreateTicketSubmit} className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#080f1a]">
                    Nueva Solicitud de Ayuda
                  </span>
                  <span className="font-mono text-[11px] text-[#526071]">
                    Tiempo de respuesta: &lt; 4 horas hábiles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ticket-title" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a] mb-1.5">
                      Asunto de la Solicitud
                    </label>
                    <input
                      id="ticket-title"
                      type="text"
                      required
                      value={newTicketTitle}
                      onChange={(e) => setNewTicketTitle(e.target.value)}
                      placeholder="Ej: Error al emitir arqueo de caja del viernes"
                      className="w-full rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3.5 py-2.5 text-xs text-[#080f1a] placeholder:text-[#526071]/60 focus:bg-white focus:border-[#080f1a] focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="ticket-category" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a] mb-1.5">
                        Categoría
                      </label>
                      <select
                        id="ticket-category"
                        value={newTicketCategory}
                        onChange={(e) => setNewTicketCategory(e.target.value)}
                        className="w-full rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3 py-2.5 text-xs text-[#080f1a] focus:bg-white focus:border-[#080f1a] focus:outline-none transition"
                      >
                        <option value="Mini ERP de Caja">Mini ERP de Caja</option>
                        <option value="Control de Stock">Control de Stock</option>
                        <option value="Bot de WhatsApp">Bot de WhatsApp</option>
                        <option value="Migración Excel">Migración Excel</option>
                        <option value="Soporte General">Soporte General</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ticket-priority" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a] mb-1.5">
                        Prioridad
                      </label>
                      <select
                        id="ticket-priority"
                        value={newTicketPriority}
                        onChange={(e) => setNewTicketPriority(e.target.value as "Baja" | "Media" | "Alta" | "Urgente")}
                        className="w-full rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3 py-2.5 text-xs text-[#080f1a] focus:bg-white focus:border-[#080f1a] focus:outline-none transition"
                      >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Urgente">Urgente Operativa</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="ticket-msg" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a] mb-1.5">
                    Descripción Detallada del Requerimiento
                  </label>
                  <textarea
                    id="ticket-msg"
                    rows={4}
                    required
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    placeholder="Explica qué ocurrió, qué esperabas ver o qué ajuste necesitas en tu sistema..."
                    className="w-full rounded-xl border border-[#efeeeb] bg-[#fbf9f6] p-3.5 text-xs text-[#080f1a] placeholder:text-[#526071]/60 focus:bg-white focus:border-[#080f1a] focus:outline-none transition resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTicket(false)}
                    className="rounded-xl border border-[#efeeeb] bg-white px-4 py-2.5 font-mono text-xs font-bold text-[#526071] hover:text-[#080f1a] transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#080f1a] bg-[#080f1a] px-5 py-2.5 font-mono text-xs font-bold text-white shadow-xs hover:bg-[#3de273] hover:text-[#080f1a] hover:border-[#3de273] transition active:scale-95"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Enviar Ticket a Ingeniería</span>
                  </button>
                </div>
              </form>
            )}

            {/* Filtros de la Bandeja */}
            <div className="flex items-center gap-2">
              {(["Todos", "En Proceso", "Resuelto"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTicketFilter(filter)}
                  className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition-all ${
                    ticketFilter === filter
                      ? "bg-[#080f1a] text-white shadow-2xs"
                      : "bg-[#ffffff] text-[#526071] border border-[#efeeeb] hover:text-[#080f1a]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Listado de Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Columna Izquierda: Lista de Tickets */}
              <div className="lg:col-span-6 space-y-3">
                {filteredTickets.map((ticket) => {
                  const isSelected = selectedTicket?.id === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                        isSelected
                          ? "border-[#080f1a] bg-[#ffffff] shadow-md ring-1 ring-[#080f1a]"
                          : "border-[#efeeeb] bg-[#ffffff] hover:border-[#080f1a]/30 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#080f1a]">
                            #{ticket.id}
                          </span>
                          <span className="rounded-full bg-[#fbf9f6] border border-[#efeeeb] px-2 py-0.5 font-mono text-[10px] text-[#526071]">
                            {ticket.category}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                            ticket.status === "Resuelto"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {ticket.status === "Resuelto" ? "🟢 Resuelto" : "🟡 En Proceso"}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#080f1a] mt-2 leading-snug">
                        {ticket.title}
                      </h4>

                      <div className="mt-3 flex items-center justify-between border-t border-[#efeeeb] pt-2 text-[11px] font-mono text-[#526071]">
                        <span>Prioridad: {ticket.priority}</span>
                        <span>{ticket.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Columna Derecha: Lectura de Respuestas del Ticket */}
              <div className="lg:col-span-6">
                {selectedTicket ? (
                  <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 shadow-xs space-y-5">
                    <div className="border-b border-[#efeeeb] pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#080f1a]">
                          Detalle del Ticket #{selectedTicket.id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                            selectedTicket.status === "Resuelto"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {selectedTicket.status}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#080f1a] mt-2">
                        {selectedTicket.title}
                      </h3>
                      <div className="font-mono text-[11px] text-[#526071] mt-1">
                        Categoría: {selectedTicket.category} • Creado el {selectedTicket.createdAt}
                      </div>
                    </div>

                    {/* Mensaje del Cliente */}
                    <div className="space-y-1.5">
                      <span className="font-mono text-[11px] font-bold uppercase text-[#526071]">
                        Consulta Enviada:
                      </span>
                      <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 text-xs text-[#080f1a] leading-relaxed">
                        {selectedTicket.userMessage}
                      </div>
                    </div>

                    {/* Respuesta de Ingeniería */}
                    {selectedTicket.adminResponse ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold uppercase text-[#080f1a] flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#3de273]" />
                            <span>Respuesta Técnica (Pablo Valdés):</span>
                          </span>
                          {selectedTicket.responseDate && (
                            <span className="font-mono text-[10px] text-[#526071]">
                              {selectedTicket.responseDate}
                            </span>
                          )}
                        </div>
                        <div className="rounded-2xl border border-[#3de273]/30 bg-[#3de273]/10 p-4 text-xs text-[#080f1a] leading-relaxed">
                          {selectedTicket.adminResponse}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#efeeeb] p-4 text-center text-xs font-mono text-[#526071]">
                        Ticket en cola de revisión técnica.
                      </div>
                    )}

                    <div className="border-t border-[#efeeeb] pt-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#526071]">
                        ¿Caso urgente?
                      </span>
                      <a
                        href={`https://wa.me/56957286145?text=${encodeURIComponent(
                          `Hola Pablo, sobre el ticket #${selectedTicket.id} (${selectedTicket.title}), ¿podemos revisarlo por WhatsApp?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#080f1a] hover:underline"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-[#3de273]" />
                        <span>Escalar por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-[#efeeeb] bg-[#ffffff] p-12 text-center text-xs font-mono text-[#526071]">
                    Selecciona un ticket de la lista para ver el hilo de respuestas.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PESTAÑA 4: CONFIGURACIÓN & SEGURIDAD (MFA / 2FA / PASSWORD)
            ======================================================== */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#080f1a]">
                Configuración de Seguridad & Control de Sesiones
              </h2>
              <p className="text-xs text-[#526071]">
                Administra tus credenciales, revisa los dispositivos con acceso autorizado y protege tu cuenta con MFA.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Columna Izquierda: Cambio de Contraseña */}
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-[#efeeeb] pb-3">
                    <Lock className="h-4 w-4 text-[#080f1a]" />
                    <h3 className="font-black text-base text-[#080f1a]">
                      Cambio de Contraseña
                    </h3>
                  </div>

                  {passwordFeedback && (
                    <div
                      className={`rounded-2xl p-3 text-xs font-bold ${
                        passwordFeedback.includes("éxito")
                          ? "bg-[#3de273]/15 text-[#080f1a] border border-[#3de273]/40"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {passwordFeedback}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="current-pwd" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a] mb-1">
                        Contraseña Actual
                      </label>
                      <input
                        id="current-pwd"
                        type={showPassword ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3.5 py-2.5 text-xs text-[#080f1a] focus:bg-white focus:border-[#080f1a] focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="new-pwd" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a] mb-1">
                        Nueva Contraseña (Mínimo 8 caracteres)
                      </label>
                      <input
                        id="new-pwd"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3.5 py-2.5 text-xs text-[#080f1a] focus:bg-white focus:border-[#080f1a] focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-pwd" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a] mb-1">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        id="confirm-pwd"
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-[#efeeeb] bg-[#fbf9f6] px-3.5 py-2.5 text-xs text-[#080f1a] focus:bg-white focus:border-[#080f1a] focus:outline-none transition"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#526071] hover:text-[#080f1a]"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>{showPassword ? "Ocultar" : "Mostrar"} caracteres</span>
                      </button>

                      <button
                        type="submit"
                        className="rounded-xl border border-[#080f1a] bg-[#080f1a] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-[#3de273] hover:text-[#080f1a] hover:border-[#3de273] transition active:scale-95 shadow-2xs"
                      >
                        Actualizar Contraseña
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sesiones Activas */}
                <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#080f1a]">
                      Sesiones Activas & Dispositivos
                    </span>
                    <span className="font-mono text-[11px] text-[#526071]">
                      {sessions.length} activas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sessions.map((sess) => {
                      const Icon = sess.icon;
                      return (
                        <div
                          key={sess.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#efeeeb] text-[#080f1a] shadow-2xs">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#080f1a]">
                                  {sess.device}
                                </span>
                                {sess.current && (
                                  <span className="rounded bg-[#3de273]/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#080f1a]">
                                    Esta Sesión
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[10px] text-[#526071] block">
                                {sess.location} • {sess.ip} • {sess.lastActive}
                              </span>
                            </div>
                          </div>

                          {!sess.current && (
                            <button
                              type="button"
                              onClick={() => handleTerminateSession(sess.id)}
                              className="font-mono text-xs text-red-600 hover:underline"
                            >
                              Cerrar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Autenticación de Dos Factores (MFA / 2FA) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-3xl border border-[#efeeeb] bg-[#ffffff] p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#3de273]" />
                      <h3 className="font-black text-base text-[#080f1a]">
                        Autenticación de Dos Factores (2FA / MFA)
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        is2FAEnabled
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {is2FAEnabled ? "🟢 Activado" : "⚪ Desactivado"}
                    </span>
                  </div>

                  <p className="text-xs text-[#526071] leading-relaxed">
                    Añade una capa de ciberseguridad industrial a tu cuenta corporativa. Requiere un código temporal generado en tu aplicación móvil (Google Authenticator, Microsoft Authenticator o Authy).
                  </p>

                  {twoFactorFeedback && (
                    <div className="rounded-2xl border border-[#3de273]/40 bg-[#3de273]/15 p-3 text-xs font-bold text-[#080f1a]">
                      {twoFactorFeedback}
                    </div>
                  )}

                  {!is2FAEnabled ? (
                    <div className="space-y-4">
                      {!isEnrolling2FA ? (
                        <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-xs text-[#080f1a]">Protección Recomendada</div>
                            <div className="text-[11px] text-[#526071] mt-0.5">
                              Evita accesos no autorizados a tus sistemas arrendados y bases de datos.
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEnrolling2FA(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#080f1a] bg-[#080f1a] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-[#3de273] hover:text-[#080f1a] hover:border-[#3de273] transition active:scale-95 shrink-0 shadow-2xs"
                          >
                            <span>Configurar 2FA</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-5 space-y-4 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#080f1a]">
                              Paso 1: Escanear Código QR
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEnrolling2FA(false)}
                              className="font-mono text-[11px] text-[#526071] hover:underline"
                            >
                              Cancelar
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-[#efeeeb]">
                            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[#fbf9f6] border border-[#efeeeb] text-[#080f1a] shrink-0">
                              <QrCode className="h-16 w-16 text-[#080f1a]" />
                            </div>
                            <div className="space-y-1 text-center sm:text-left">
                              <span className="font-bold text-xs text-[#080f1a]">Clave Secreta Manual:</span>
                              <div className="font-mono text-xs font-black text-[#080f1a] bg-[#fbf9f6] px-2.5 py-1 rounded border border-[#efeeeb]">
                                NAXO-SEC-2026-X94B-AUTH
                              </div>
                              <span className="text-[10px] text-[#526071] block">
                                Ingresa esta clave en tu app autenticadora si no puedes escanear.
                              </span>
                            </div>
                          </div>

                          <form onSubmit={handle2FAVerify} className="space-y-3">
                            <label htmlFor="two-factor-code" className="block font-mono text-[11px] font-bold uppercase text-[#080f1a]">
                              Paso 2: Ingresar Código de 6 Dígitos
                            </label>
                            <div className="flex gap-2">
                              <input
                                id="two-factor-code"
                                type="text"
                                maxLength={6}
                                required
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="123456"
                                className="flex-1 rounded-xl border border-[#efeeeb] bg-white px-3.5 py-2.5 font-mono text-center text-sm tracking-widest font-bold text-[#080f1a] focus:border-[#080f1a] focus:outline-none"
                              />
                              <button
                                type="submit"
                                className="rounded-xl border border-[#080f1a] bg-[#080f1a] px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-[#3de273] hover:text-[#080f1a] hover:border-[#3de273] transition active:scale-95"
                              >
                                Verificar y Activar
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[#3de273]/40 bg-[#3de273]/10 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-[#3de273]" />
                          <span className="font-bold text-xs text-[#080f1a]">
                            Tu cuenta se encuentra blindada con MFA
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIs2FAEnabled(false)}
                          className="font-mono text-[11px] text-red-600 hover:underline"
                        >
                          Desactivar
                        </button>
                      </div>
                      <p className="text-[11px] text-[#526071] leading-relaxed">
                        Cada inicio de sesión desde un nuevo navegador exigirá el token rotativo de tu app de seguridad.
                      </p>
                    </div>
                  )}

                  {/* Marco Legal Chileno */}
                  <div className="rounded-2xl border border-[#efeeeb] bg-[#fbf9f6] p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-mono font-bold text-[11px] text-[#080f1a]">
                      <ShieldAlert className="h-4 w-4 text-[#3de273]" />
                      <span>Cumplimiento Normativo Chileno</span>
                    </div>
                    <p className="text-[11px] text-[#526071] leading-relaxed">
                      Este portal adhiere a la Ley 19.628 de Protección de Datos Personales, Ley 21.719 y los principios de ciberseguridad de la Ley 21.663. Tus datos nunca son compartidos con terceros comerciales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}