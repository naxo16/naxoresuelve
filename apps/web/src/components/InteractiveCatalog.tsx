"use client";

import { useState, useMemo } from "react";
import { SolutionCard, SolutionCardProps } from "@/components/SolutionCard";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

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

const CATEGORIES = [
  "Todos",
  "Software & SaaS",
  "Automatización",
  "Presencia Web",
  "Soporte TI",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export function InteractiveCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSolutions = useMemo(() => {
    return CATALOG_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "Todos" || item.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.number.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory("Todos");
    setSearchQuery("");
  };

  return (
    <div className="w-full space-y-8">
      {/* Barra de Controles (Top Bar): Filtros por Categoría + Buscador Rápido */}
      <div id="catalogo-controls" className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#526072]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md">
        {/* Filtros por Categoría (Chips) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <SlidersHorizontal className="h-4 w-4 text-[#526072] shrink-0 hidden sm:inline" />
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition-all active:scale-95 ${
                  isSelected
                    ? "bg-[#1E2430] text-white shadow-xs"
                    : "bg-[#FAF8F5] text-[#526072] border border-[#526072]/20 hover:text-[#111827] hover:border-[#1E2430]/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Buscador Rápido */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#526072]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar solución (ej. Excel, Caja)..."
            className="w-full rounded-xl border border-[#526072]/20 bg-[#FAF8F5] pl-9 pr-3.5 py-2 text-xs font-sans text-[#111827] placeholder:text-[#526072]/60 focus:border-[#1E2430] focus:bg-white focus:outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center font-mono text-[10px] text-[#526072] hover:text-[#111827]"
            >
              Borrar
            </button>
          )}
        </div>
      </div>

      {/* Indicador de Conteo */}
      <div className="flex items-center justify-between text-xs font-mono text-[#526072] px-1">
        <span>
          Mostrando <strong>{filteredSolutions.length}</strong> de{" "}
          <strong>{CATALOG_DATA.length}</strong> soluciones disponibles
        </span>
        {(selectedCategory !== "Todos" || searchQuery) && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 font-bold text-[#1E2430] hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Grilla Reactiva de Solution Cards */}
      {filteredSolutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-3 rounded-2xl border border-dashed border-[#526072]/30 bg-white/70 py-16 px-4 backdrop-blur-md">
          <Search className="h-8 w-8 text-[#526072]/60" />
          <h4 className="text-base font-bold text-[#111827]">
            No encontramos soluciones con ese término
          </h4>
          <p className="max-w-md text-xs text-[#526072]">
            Intenta con otra palabra clave como &ldquo;Caja&rdquo;, &ldquo;Excel&rdquo; o &ldquo;WiFi&rdquo;, o explora por categoría general.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 rounded-xl bg-[#1E2430] px-4 py-2 font-mono text-xs font-bold text-white transition hover:bg-[#111827]"
          >
            Ver todas las soluciones
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSolutions.map((sol) => (
            <SolutionCard
              key={sol.id}
              id={sol.id}
              number={sol.number}
              title={sol.title}
              description={sol.description}
              price={sol.price}
              priceLabel={sol.priceLabel}
              type={sol.type}
              category={sol.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
