"use client";

import { useState, useMemo } from "react";
import { SolutionCard } from "@/components/SolutionCard";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

import { CATALOG_DATA, CATEGORIES, type CategoryFilter } from "@/data/catalog";
export { CATALOG_DATA, CATEGORIES, type CategoryFilter };

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
