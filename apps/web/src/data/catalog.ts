import { SolutionCardProps } from "@/components/SolutionCard";

export const CATALOG_DATA: SolutionCardProps[] = [
  {
    id: "sol-01",
    number: "SOL-01",
    title: "Control de Caja y Ventas del Día",
    description:
      "Saber con un clic cuánto dinero entró, cuánto salió y qué falta por cobrar sin usar cuadernos ni depender de nadie.",
    price: 150000,
    priceLabel: "Desde $150.000 CLP / mes",
    type: "saas_rental",
    category: "Software & SaaS",
  },
  {
    id: "sol-02",
    number: "SOL-02",
    title: "Arreglar Planillas de Excel Desordenadas",
    description:
      "Pasar tus planillas que se pegan, tienen fórmulas rotas o se borran a un sistema web seguro con copias automáticas.",
    price: 120000,
    priceLabel: "Desde $120.000 CLP",
    type: "one_off_project",
    category: "Automatización",
  },
  {
    id: "sol-03",
    number: "SOL-03",
    title: "Saber qué Mercadería Queda (Stock)",
    description:
      "Alertas automáticas para saber qué productos se están agotando antes de que te quedes sin stock en bodega o local.",
    price: 150000,
    priceLabel: "Desde $150.000 CLP / mes",
    type: "saas_rental",
    category: "Software & SaaS",
  },
  {
    id: "sol-04",
    number: "SOL-04",
    title: "Calcular Jornales y Sueldos Rápido",
    description:
      "Ingresar los turnos, kilos cosechados o días trabajados del personal y obtener los pagos exactos al instante.",
    price: 100000,
    priceLabel: "Desde $100.000 CLP / mes",
    type: "saas_rental",
    category: "Software & SaaS",
  },
  {
    id: "sol-05",
    number: "SOL-05",
    title: "Página Web para que me Hablen al WhatsApp",
    description:
      "Una vitrina rápida en internet para que quien te busque en Google desde su celular te escriba directo a cotizar.",
    price: 80000,
    priceLabel: "Desde $80.000 CLP",
    type: "one_off_project",
    category: "Presencia Web",
  },
  {
    id: "sol-06",
    number: "SOL-06",
    title: "Aparecer en el Mapa de Google",
    description:
      "Configuración y verificación técnica de tu Perfil de Empresa en Google Maps para salir primero en tu comuna.",
    price: 50000,
    priceLabel: "Desde $50.000 CLP",
    type: "one_off_project",
    category: "Presencia Web",
  },
  {
    id: "sol-07",
    number: "SOL-07",
    title: "Respuestas Automáticas para WhatsApp",
    description:
      "Menú interactivo que responde precios, catálogo y ubicación 24/7 mientras tú atiendes a los clientes en el mesón.",
    price: 60000,
    priceLabel: "Desde $60.000 CLP",
    type: "one_off_project",
    category: "Automatización",
  },
  {
    id: "sol-08",
    number: "SOL-08",
    title: "Acelerar Computadores Lentos de Caja",
    description:
      "Instalación de disco SSD rápido y más memoria RAM para que el computador prenda en segundos y no se pegue cobrando.",
    price: 50000,
    priceLabel: "Desde $50.000 CLP",
    type: "one_off_project",
    category: "Soporte TI",
  },
  {
    id: "sol-09",
    number: "SOL-09",
    title: "Limpieza Profunda de Notebooks y PCs",
    description:
      "Mantención física de ventiladores, cambio de pasta térmica y limpieza interior para evitar que se apaguen por calor.",
    price: 35000,
    priceLabel: "Desde $35.000 CLP",
    type: "one_off_project",
    category: "Soporte TI",
  },
  {
    id: "sol-10",
    number: "SOL-10",
    title: "Instalar Programas y Dejar el PC Listo",
    description:
      "Windows original, Office activado, antivirus y programas de trabajo configurados desde cero sin virus ni lentitud.",
    price: 30000,
    priceLabel: "Desde $30.000 CLP",
    type: "one_off_project",
    category: "Soporte TI",
  },
  {
    id: "sol-11",
    number: "SOL-11",
    title: "Red y WiFi Rápido para Locales y Bodegas",
    description:
      "Configurar cables de red, repetidores y antenas para que la boleta electrónica y el Transbank nunca se queden sin señal.",
    price: 70000,
    priceLabel: "Desde $70.000 CLP",
    type: "one_off_project",
    category: "Soporte TI",
  },
  {
    id: "sol-12",
    number: "SOL-12",
    title: "Armar Computadores para Trabajo Pesado",
    description:
      "Elegir las piezas exactas y armar el computador ideal para diseño, planos, edición de video o trabajo intensivo.",
    price: 60000,
    priceLabel: "Desde $60.000 CLP",
    type: "one_off_project",
    category: "Soporte TI",
  },
];

export const CATEGORIES = [
  "Todos",
  "Software & SaaS",
  "Automatización",
  "Presencia Web",
  "Soporte TI",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];
