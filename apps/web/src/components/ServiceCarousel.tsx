"use client";

import { useRef } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Plus,
  Server,
  Sparkles,
} from "lucide-react";

interface CatalogSolution {
  id: string;
  number: string;
  title: string;
  practicalSolution: string;
  priceLabel: string;
  priceNum: number;
  isSaaS: boolean;
  canAddToCart: boolean;
  isEvaluationOnly?: boolean;
}

const CATALOG_SOLUTIONS: CatalogSolution[] = [
  {
    id: "sol-01",
    number: "01",
    title: "Control de Caja y Ventas del Día",
    practicalSolution:
      "Saber con un clic cuánto dinero entró, cuánto salió y qué falta por cobrar sin usar cuadernos ni depender de nadie.",
    priceLabel: "Desde $150.000 CLP / Arriendo SaaS",
    priceNum: 150000,
    isSaaS: true,
    canAddToCart: true,
  },
  {
    id: "sol-02",
    number: "02",
    title: "Arreglar Planillas de Excel Desordenadas",
    practicalSolution:
      "Pasar tus planillas que se pegan, tienen fórmulas rotas o se borran a un sistema web seguro con copias automáticas.",
    priceLabel: "Desde $120.000 CLP",
    priceNum: 120000,
    isSaaS: false,
    canAddToCart: true,
  },
  {
    id: "sol-03",
    number: "03",
    title: "Saber qué Mercadería Queda (Stock)",
    practicalSolution:
      "Alertas automáticas para saber qué productos se están agotando antes de que te quedes sin stock en bodega o local.",
    priceLabel: "Desde $150.000 CLP / Arriendo SaaS",
    priceNum: 150000,
    isSaaS: true,
    canAddToCart: true,
  },
  {
    id: "sol-04",
    number: "04",
    title: "Calcular Jornales y Sueldos Rápido",
    practicalSolution:
      "Ingresar los turnos, kilos cosechados o días trabajados del personal y obtener los pagos exactos al instante.",
    priceLabel: "Desde $100.000 CLP / Arriendo SaaS",
    priceNum: 100000,
    isSaaS: true,
    canAddToCart: true,
  },
  {
    id: "sol-05",
    number: "05",
    title: "Página Web para que me Hablen al WhatsApp",
    practicalSolution:
      "Una vitrina rápida en internet para que quien te busque en Google desde su celular te escriba directo a cotizar.",
    priceLabel: "Desde $80.000 CLP",
    priceNum: 80000,
    isSaaS: false,
    canAddToCart: true,
  },
  {
    id: "sol-06",
    number: "06",
    title: "Aparecer en el Mapa de Google",
    practicalSolution:
      "Configuración y verificación técnica de tu Perfil de Empresa en Google Maps para salir primero en tu comuna.",
    priceLabel: "Desde $50.000 CLP",
    priceNum: 50000,
    isSaaS: false,
    canAddToCart: true,
  },
  {
    id: "sol-07",
    number: "07",
    title: "Respuestas Automáticas para WhatsApp",
    practicalSolution:
      "Menú interactivo que responde precios, catálogo y ubicación 24/7 mientras tú atiendes a los clientes en el mesón.",
    priceLabel: "Desde $60.000 CLP",
    priceNum: 60000,
    isSaaS: false,
    canAddToCart: true,
  },
  {
    id: "sol-08",
    number: "08",
    title: "Acelerar Computadores Lentos de Caja",
    practicalSolution:
      "Instalación de disco SSD rápido y más memoria RAM para que el computador prenda en segundos y no se pegue cobrando.",
    priceLabel: "Desde $50.000 CLP",
    priceNum: 50000,
    isSaaS: false,
    canAddToCart: true,
  },
  {
    id: "sol-09",
    number: "09",
    title: "Limpieza Profunda de Notebooks y PCs",
    practicalSolution:
      "Desarme, retiro de polvo y cambio de pasta térmica para que los equipos no suenen como turbina ni se apaguen solos.",
    priceLabel: "Desde $35.000 CLP",
    priceNum: 35000,
    isSaaS: false,
    canAddToCart: true,
  },
  {
    id: "sol-10",
    number: "10",
    title: "Arreglar Caídas de Internet e Impresoras",
    practicalSolution:
      "Configurar la red del local y los equipos para que Transbank no se caiga y las impresoras de boleta no fallen jamás.",
    priceLabel: "Desde $50.000 CLP",
    priceNum: 50000,
    isSaaS: false,
    canAddToCart: true,
  },
  {
    id: "sol-11",
    number: "11",
    title: "Ver en Gráficos Simples Dónde se Va la Plata",
    practicalSolution:
      "Un panel visual que te muestra en colores si tu negocio este mes está ganando o perdiendo margen operativo.",
    priceLabel: "Desde $140.000 CLP / Arriendo SaaS",
    priceNum: 140000,
    isSaaS: true,
    canAddToCart: true,
  },
  {
    id: "sol-12",
    number: "12",
    title: "Conectar Programas que no se Hablan",
    practicalSolution:
      "Evitar tener que pasar datos a mano entre dos programas distintos haciendo que se sincronicen de forma automática.",
    priceLabel: "Según evaluación",
    priceNum: 0,
    isSaaS: false,
    canAddToCart: false,
    isEvaluationOnly: true,
  },
];

const WHATSAPP_URL = "https://wa.me/56957286145";

export function ServiceCarousel() {
  const { addItem, items } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = 360;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const isItemInCart = (id: string) => items.some((i) => i.id === id);

  const handleAdd = (sol: CatalogSolution) => {
    const cartItem: CartItem = {
      id: sol.id,
      number: sol.number,
      title: sol.title,
      description: sol.practicalSolution,
      price: sol.priceNum,
      type: sol.isSaaS ? "saas_rental" : "one_off_project",
      category: "Software & TI",
    };
    addItem(cartItem);
  };

  return (
    <div className="relative w-full">
      {/* Controles de navegación de carrusel */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#6E7179]">
            Desliza para explorar las 12 soluciones →
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E0D8] bg-white text-[#15171C] shadow-sm transition-all hover:border-[#5E0B15] hover:bg-[#F7F4F0] active:scale-95"
            aria-label="Desplazar hacia la izquierda"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E0D8] bg-white text-[#15171C] shadow-sm transition-all hover:border-[#5E0B15] hover:bg-[#F7F4F0] active:scale-95"
            aria-label="Desplazar hacia la derecha"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenedor Carrusel Horizontal */}
      <div
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory py-4 scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CATALOG_SOLUTIONS.map((sol) => {
          const added = isItemInCart(sol.id);
          const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
            `Hola Pablo, me interesa cotizar la solución [${sol.number}] ${sol.title} para mi negocio.`
          )}`;

          return (
            <div
              key={sol.id}
              className="group relative flex w-[310px] sm:w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-[#E5E0D8] bg-white/90 p-6 shadow-[0_4px_20px_rgba(21,23,28,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#5E0B15]/40 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black tracking-wider text-[#CBA135]">
                    [#{sol.number}]
                  </span>
                  {sol.isSaaS && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#5E0B15]/20 bg-[#5E0B15]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#5E0B15]">
                      <Server className="h-3 w-3" />
                      Arriendo SaaS
                    </span>
                  )}
                  {sol.isEvaluationOnly && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#CBA135]/40 bg-[#CBA135]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#5E0B15]">
                      <Sparkles className="h-3 w-3 text-[#CBA135]" />
                      A Medida
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold leading-snug text-[#15171C]">
                  {sol.title}
                </h3>

                <p className="text-xs leading-relaxed text-[#6E7179]">
                  {sol.practicalSolution}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-[#E5E0D8] pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#6E7179]">
                    Inversión estimada:
                  </span>
                  <span className="font-mono text-xs font-black text-[#5E0B15]">
                    {sol.priceLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#15171C]/15 bg-white py-2 px-2.5 font-mono text-xs font-bold text-[#15171C] transition-all hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#0a0c10]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#CBA135]" />
                    <span>Cotizar</span>
                  </a>

                  {sol.canAddToCart ? (
                    <button
                      type="button"
                      onClick={() => handleAdd(sol)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2.5 font-mono text-xs font-bold transition-all ${
                        added
                          ? "border-[#25D366] bg-[#25D366]/20 text-[#15171C]"
                          : "border-[#5E0B15] bg-[#5E0B15] text-white hover:bg-[#460810]"
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{sol.isSaaS ? "Arrendar" : "Agregar"}</span>
                    </button>
                  ) : (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#5E0B15] bg-[#5E0B15] py-2 px-2 font-mono text-xs font-bold text-white hover:bg-[#460810]"
                    >
                      <span>Evaluar</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
