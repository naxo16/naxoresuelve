"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, MessageCircle } from "lucide-react";
import { gsap } from "gsap";

const BRAND_IMAGE = "/images/naxoresuelve.jpg";
const WHATSAPP_URL = "https://wa.me/56957286145";

const NAV_LINKS = [
  { href: "#catalogo", label: "Qué Hacemos", id: "catalogo" },
  { href: "#metodologia", label: "Cómo Funciona", id: "metodologia" },
  { href: "#clientes", label: "Clientes", id: "clientes" },
  { href: "#autor", label: "Sobre Pablo", id: "autor" },
];

export function Header() {
  const { totalCount, setIsOpen: setCartOpen } = useCart();
  const { openAuthModal, user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("catalogo");

  // Rastrear sección activa durante el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const link of NAV_LINKS) {
        const el = document.querySelector(link.href);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.clientHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desplazamiento cinemático suave con realce de atención GSAP
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        setActiveSection(id);
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({
          top,
          behavior: "smooth",
        });

        // Realce de atención: micro-animación en la sección de destino
        gsap.fromTo(
          target,
          { y: 15, opacity: 0.85 },
          { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" }
        );
      }
    }
  };

  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Hola Pablo, vengo de naxoresuelve.cl y quiero agendar un diagnóstico de 15 minutos sin costo."
  )}`;

  return (
    <header className="fixed top-0 z-40 w-full border-b border-[#526072]/15 bg-[#FAF8F5]/85 shadow-[0_2px_15px_rgba(30,36,48,0.03)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        {/* Identidad de Marca */}
        <div className="flex items-center gap-3">
          <a
            href="#main-content"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-102"
          >
            <Image
              src={BRAND_IMAGE}
              alt="Logo Naxo Resuelve"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-[#1E2430]/15 transition-transform group-hover:scale-105"
              priority
            />
            <span className="text-lg font-black tracking-tight text-[#111827]">
              Naxo Resuelve
            </span>
          </a>
          <span className="hidden items-center gap-1.5 rounded-full border border-[#526072]/30 bg-[#526072]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#526072] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
            Cupos Disponibles
          </span>
        </div>

        {/* Navegación Desktop con Transición Suave y Detección de Sección Activa */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className={`group relative flex items-center gap-1.5 py-1 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "text-[#1E2430]"
                    : "text-[#526072] hover:text-[#1E2430]"
                }`}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                )}
                <span>{link.label}</span>
                {/* Línea inferior indicadora al hover */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[#1E2430] transition-transform duration-200 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Acciones del Lado Derecho */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Disparador de Carrito */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 items-center gap-1.5 rounded-xl border border-[#526072]/20 bg-white/90 px-3 text-[#111827] shadow-sm transition-all duration-200 hover:border-[#1E2430]/40 hover:bg-[#FAF8F5] hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            aria-label={`Ver carrito con ${totalCount} soluciones`}
          >
            <ShoppingCart className="h-4 w-4 text-[#1E2430]" />
            <span className="font-mono text-xs font-black text-[#111827]">
              {totalCount}
            </span>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E2430] font-mono text-[9px] font-bold text-white shadow animate-bounce">
                {totalCount}
              </span>
            )}
          </button>

          {/* Botón Acceso / Demos */}
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#526072]/25 bg-white/90 px-3.5 py-2 font-mono text-xs font-bold text-[#111827] shadow-sm transition-all duration-200 hover:border-[#1E2430] hover:bg-[#FAF8F5] hover:-translate-y-0.5 active:scale-95"
          >
            <User className="h-3.5 w-3.5 text-[#526072]" />
            <span>{user ? user.name : "Acceso Clientes / Demos"}</span>
          </button>

          {/* CTA WhatsApp Sólido Carbón Pizarra (#1E2430 -> #25D366 con efecto Shine) */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-4 py-2 font-mono text-xs font-bold text-[#FAF8F5] shadow-sm transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-[#25D366]/40 focus:outline-none active:scale-[0.99]"
          >
            {/* Destello sutil al hover */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            <MessageCircle
              className="h-4 w-4 text-[#25D366] transition-colors group-hover:text-[#111827]"
              aria-hidden="true"
            />
            <span className="hidden xs:inline">Agendar 15 min</span>
            <span className="xs:hidden">Agendar</span>
          </a>
        </div>
      </div>
    </header>
  );
}
