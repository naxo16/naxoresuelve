"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, MessageCircle } from "lucide-react";
import { gsap } from "gsap";
import { NeonBrandSpan } from "@/components/NeonBrandSpan";

const BRAND_IMAGE = "/images/naxoresuelve.webp";
const WHATSAPP_URL = "https://wa.me/56957286145";

const HOME_SECTION_MAP = [
  { id: "inicio", elementId: "hero-title" },
  { id: "como-funciona", elementId: "metodologia" },
  { id: "clientes", elementId: "clientes" },
  { id: "sobre-pablo", elementId: "autor" },
];

export function Header() {
  const { totalCount, setIsOpen: setCartOpen } = useCart();
  const { openAuthModal, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isQueHacemos = pathname === "/que-hacemos" || pathname === "/productos" || pathname === "/soluciones";
  const isComoFunciona = pathname === "/como-funciona" || pathname === "/metodologia";
  const isClientes = pathname === "/clientes";
  const isSobrePablo = pathname === "/sobre-pablo" || pathname === "/autor";

  const [scrollSection, setScrollSection] = useState<string>("inicio");

  let activeSection = scrollSection;
  if (isQueHacemos) activeSection = "que-hacemos";
  else if (isComoFunciona) activeSection = "como-funciona";
  else if (isClientes) activeSection = "clientes";
  else if (isSobrePablo) activeSection = "sobre-pablo";
  else if (isHome && scrollSection === "inicio") activeSection = "inicio";

  const navLinks = [
    {
      href: "/",
      label: "Inicio",
      id: "inicio",
    },
    {
      href: "/que-hacemos",
      label: "Qué Hacemos",
      id: "que-hacemos",
    },
    {
      href: "/como-funciona",
      label: "Cómo Funciona",
      id: "como-funciona",
    },
    {
      href: "/clientes",
      label: "Clientes",
      id: "clientes",
    },
    {
      href: "/sobre-pablo",
      label: "Sobre Pablo",
      id: "sobre-pablo",
    },
  ];

  // Rastrear sección activa durante el scroll sólo en la portada
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;

      if (scrollPos < 280) {
        setScrollSection("inicio");
        return;
      }

      for (const section of HOME_SECTION_MAP.slice(1)) {
        const el = document.getElementById(section.elementId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 120;
          const height = el.clientHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setScrollSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Desplazamiento cinemático suave con realce de atención GSAP en portada sin exponer '#'
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (isHome) {
      if (id === "inicio") {
        e.preventDefault();
        setScrollSection("inicio");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      if (id !== "que-hacemos") {
        const section = HOME_SECTION_MAP.find((s) => s.id === id);
        if (section) {
          const target = document.getElementById(section.elementId);
          if (target) {
            e.preventDefault();
            setScrollSection(id);
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
      }
    }
  };

  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
    "Hola Pablo, vengo de naxoresuelve.cl y quiero agendar un diagnóstico de 15 minutos sin costo."
  )}`;

  return (
    <header className="fixed top-0 z-40 w-full border-b border-slate-300/60 bg-[#FAF8F5]/90 shadow-[0_2px_15px_rgba(30,36,48,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        {/* Identidad de Marca */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            prefetch={false}
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
            <NeonBrandSpan size="md" />
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-slate-300 bg-white/95 px-3 py-1 font-mono text-xs font-bold text-slate-800 sm:inline-flex shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
            Cupos Disponibles
          </span>
        </div>

        {/* Navegación Desktop con Transición Suave y Detección de Sección Activa */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 lg:flex"
        >
          {navLinks.map((link) => {
            const isActive = isQueHacemos
              ? link.id === "que-hacemos"
              : activeSection === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                prefetch={false}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className={`group relative flex items-center gap-1.5 py-1 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "text-[#1E2430]"
                    : "text-slate-700 hover:text-[#1E2430]"
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
              </Link>
            );
          })}
        </nav>

        {/* Acciones del Lado Derecho */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Disparador de Carrito */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 items-center gap-1.5 rounded-xl border border-slate-300 bg-white/95 px-3 text-[#111827] shadow-xs transition-all duration-200 hover:border-[#1E2430]/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            aria-label={`Ver carrito con ${totalCount} soluciones`}
          >
            <ShoppingCart className="h-4 w-4 text-[#1E2430]" />
            <span className="font-mono text-xs font-black text-[#111827]">
              {totalCount}
            </span>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#25D366] font-mono text-[9px] font-black text-[#111827]">
                {totalCount}
              </span>
            )}
          </button>

          {/* Botón de Acceso Clientes / Portal */}
          <button
            type="button"
            onClick={() => {
              if (user) {
                router.push("/dashboard");
              } else {
                openAuthModal("login");
              }
            }}
            aria-label={user ? `Portal de cliente: ${user.name}` : "Acceso al portal de clientes"}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300 bg-white/95 px-3.5 font-mono text-xs font-bold text-[#111827] shadow-xs transition-all duration-200 hover:border-[#1E2430]/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            <User className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
            <span className="hidden sm:inline font-bold">
              {user ? user.name : "Portal Clientes"}
            </span>
          </button>

          {/* Botón CTA Rápido WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl border border-[#1E2430] bg-[#1E2430] px-4 font-mono text-xs font-bold text-white shadow-[0_2px_10px_rgba(30,36,48,0.2)] transition-all duration-200 hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#111827] hover:shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#25D366] transition-colors" />
            <span>Diagnóstico 15 min</span>
          </a>
        </div>
      </div>
    </header>
  );
}
