export interface SaasAppDemo {
  id: string;
  name: string;
  category: string;
  statusBadge: string;
  tagline: string;
  description: string;
  demoUrl: string; // Ruta interna (ej: '/demo?app=agrocontrol') o subdominio externo ('https://agro.naxoresuelve.cl')
  isExternal: boolean;
  targetSubdomain: string; // Subdominio reservado o sitio listo para vincular
  features: string[];
  tech: string[];
  pricingMonthly: string;
  metric: {
    label: string;
    value: string;
  };
  previewDetails: {
    screenType: "agricola" | "duplicidad" | "minierp" | "staging";
    statNumber: string;
    statLabel: string;
    badgeStatus: string;
    mockLines: string[];
  };
}

/**
 * Catálogo Maestro de Aplicaciones SaaS para Demostración Interactiva.
 * Estructurado de forma modular para que puedas integrar rápidamente
 * tus nuevos proyectos SaaS, subdominios de Cloudflare o enlaces externos.
 */
export const SAAS_DEMOS_DATA: SaasAppDemo[] = [
  {
    id: "agrocontrol",
    name: "AgroControl SaaS",
    category: "Gestión Agrícola & Cuadrillas",
    statusBadge: "Demo Interactiva en Vivo",
    tagline: "Control de faena, pesaje de cosecha y cálculo de jornales para contratistas agrícolas.",
    description:
      "Erradica las pérdidas por planillas Excel manuales en el predio. Registro de asistencia por cuadrilla, ingreso de kilos cosechados en terreno y exportación automática a nómina para liquidación semanal.",
    demoUrl: "/demo?app=agrocontrol",
    isExternal: false,
    targetSubdomain: "https://agro.naxoresuelve.cl",
    features: [
      "Operativo con o sin conexión en faena",
      "Cálculo de tratos por kilo y por día",
      "Reportes automáticos a WhatsApp del administrador",
      "Exportación directa a formato nómina / banco",
    ],
    tech: ["Next.js 16", "PostgreSQL", "PWA Offline", "FastAPI"],
    pricingMonthly: "Desde $45.000 CLP / mes",
    metric: {
      label: "Ahorro de tiempo en liquidación",
      value: "85%",
    },
    previewDetails: {
      screenType: "agricola",
      statNumber: "14 Cuadrillas",
      statLabel: "3,820 Kilos Cosechados Hoy",
      badgeStatus: "ONLINE • 6 Huertos Sincronizados",
      mockLines: [
        "Cuadrilla Los Espinos: 1,420 kg (Trato $85/kg)",
        "Cuadrilla El Boldo: 1,180 kg (Trato $85/kg)",
        "Cuadrilla La Higuera: 1,220 kg (Trato $85/kg)",
      ],
    },
  },
  {
    id: "facturasync",
    name: "FacturaSync & DataCleaner",
    category: "Arquitectura de Datos & DTEs",
    statusBadge: "Demo Interactiva en Vivo",
    tagline: "Motor de erradicación de duplicidad y normalización PostgreSQL en 3FN.",
    description:
      "Detecta y fusiona automáticamente registros duplicados de clientes, facturas y pagos históricos. Arquitectura resiliente con índices HMAC-SHA256, cero pérdida de información y tiempos de consulta en menos de 5 milisegundos.",
    demoUrl: "/demo?app=facturasync",
    isExternal: false,
    targetSubdomain: "https://data.naxoresuelve.cl",
    features: [
      "Normalización estricta en 3ra Forma Normal (3FN)",
      "Indexación criptográfica segura contra colisiones",
      "Consultas parametrizadas con asyncpg a máxima velocidad",
      "Auditoría transaccional de cambios (Audit Trail)",
    ],
    tech: ["PostgreSQL 16", "Python 3.12", "asyncpg", "FastAPI"],
    pricingMonthly: "Desde $65.000 CLP / mes",
    metric: {
      label: "Tasa de registros duplicados",
      value: "0.00%",
    },
    previewDetails: {
      screenType: "duplicidad",
      statNumber: "450,210 Reg.",
      statLabel: "Normalizados en 3FN sin colisiones",
      badgeStatus: "LATENCIA: 3.8 ms • 0 Errores",
      mockLines: [
        "Fusión DTE #4819: 3 copias duplicadas unificadas",
        "Validación RUT parametrizada con índice HMAC",
        "Respaldo automático WAL verificado en caliente",
      ],
    },
  },
  {
    id: "minierp",
    name: "MiniERP Punto de Venta Pyme",
    category: "Comercio & Retail Local",
    statusBadge: "Demo Interactiva en Vivo",
    tagline: "Control de arqueo de caja, stock crítico y emisión de boletas ultrarrápido.",
    description:
      "Diseñado para locales comerciales, minimarkets y distribuidoras. Permite cobrar en menos de 3 segundos por cliente, avisar quiebres de inventario antes de quedarse sin stock y cuadrar caja al final del turno sin diferencias de dinero.",
    demoUrl: "/demo",
    isExternal: false,
    targetSubdomain: "https://pos.naxoresuelve.cl",
    features: [
      "Arqueo de caja ciego y conciliación de turno",
      "Alertas visuales de stock mínimo y reposición",
      "Búsqueda por código de barras o texto rápido",
      "Copia de seguridad en la nube sin costo adicional",
    ],
    tech: ["Next.js 16", "TypeScript", "Tailwind CSS", "SQLite / Postgres"],
    pricingMonthly: "Desde $35.000 CLP / mes",
    metric: {
      label: "Velocidad de atención por cliente",
      value: "3 seg",
    },
    previewDetails: {
      screenType: "minierp",
      statNumber: "$1.482.500",
      statLabel: "Ventas Totales Turno Tarde",
      badgeStatus: "CAJA CUADRADA • Cero Descuadre",
      mockLines: [
        "Última venta: Boleta #1042 — $14.500 (Efectivo)",
        "Alerta: Harina 25kg (Quedan 3 sacos en bodega)",
        "Turno #2 abierto por Operador 1 a las 14:00",
      ],
    },
  },
  {
    id: "staging-portal",
    name: "Portal Staging & Entrega Express",
    category: "Infraestructura & Clientes",
    statusBadge: "Demo Interactiva en Vivo",
    tagline: "Entorno privado para pruebas de aceptación y checklist antes de salir a producción.",
    description:
      "Cada cliente de Naxo Resuelve dispone de su propio entorno privado en la nube para probar funcionalidades, validar cambios y aprobar entregables antes del pago final del 50%. Cero sorpresas de diseño o caídas en vivo.",
    demoUrl: "/demo?app=staging",
    isExternal: false,
    targetSubdomain: "https://staging.naxoresuelve.cl",
    features: [
      "Aislamiento total con HTTPS y certificados automáticos",
      "Checklist interactivo de aprobación de requerimientos",
      "Registro de versiones y despliegues instantáneos",
      "Garantía técnica de puesta en marcha supervisada",
    ],
    tech: ["Cloudflare Workers", "Next.js", "Docker", "Linux"],
    pricingMonthly: "Incluido en Proyectos Cerrados",
    metric: {
      label: "Conformidad en checklist de entrega",
      value: "100%",
    },
    previewDetails: {
      screenType: "staging",
      statNumber: "100% OK",
      statLabel: "16 Pruebas de Carga Superadas",
      badgeStatus: "STAGING ACTIVO • TLS 1.3 Seguro",
      mockLines: [
        "Despliegue #42: Build exitoso en 6.5s",
        "Validación OWASP: Cero vulnerabilidades críticas",
        "Tokens SHA-256 de 15 minutos auditados",
      ],
    },
  },
];
