"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollAnimations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Barra de progreso de lectura ultra-fina en el tope
      const progressBar = document.getElementById("scroll-progress-bar");
      if (progressBar) {
        gsap.to(progressBar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.15,
          },
        });
      }

      // 2. Animación de Entrada Escalonada del Hero (Stagger Reveal)
      const heroTl = gsap.timeline({ delay: 0.25 });
      heroTl
        .from("#hero-eyebrow", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          "#hero-title > *",
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          "#hero-cta > *",
          {
            y: 20,
            scale: 0.95,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.4"
        )
        .from(
          "#hero-guarantees > *",
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // 3. Ticker Carousel Section Entrance
      const tickerSection = document.getElementById("ticker-section");
      if (tickerSection) {
        gsap.from(tickerSection, {
          scrollTrigger: {
            trigger: tickerSection,
            start: "top 92%",
          },
          opacity: 0,
          y: 25,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      // 4. Sección #ventajas (Por Qué Elegir Este Modelo)
      const ventajasEl = document.getElementById("ventajas");
      if (ventajasEl) {
        gsap.from("#ventajas-heading", {
          scrollTrigger: {
            trigger: "#ventajas",
            start: "top 82%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(".perk-card", {
          scrollTrigger: {
            trigger: "#ventajas",
            start: "top 75%",
          },
          y: 40,
          scale: 0.9,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1.4)",
        });
      }

      // 5. Sección #catalogo (Qué Hacemos)
      const catalogoEl = document.getElementById("catalogo");
      if (catalogoEl) {
        gsap.from("#catalogo-heading", {
          scrollTrigger: {
            trigger: "#catalogo",
            start: "top 82%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from("#catalogo-controls", {
          scrollTrigger: {
            trigger: "#catalogo",
            start: "top 78%",
          },
          y: 25,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });

        gsap.from(".solution-card-anim", {
          scrollTrigger: {
            trigger: "#catalogo",
            start: "top 72%",
          },
          y: 35,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        });
      }

      // 6. Sección #metodologia (Cómo Funciona en 4 Pasos)
      const metodologiaEl = document.getElementById("metodologia");
      if (metodologiaEl) {
        gsap.from("#metodologia-heading", {
          scrollTrigger: {
            trigger: "#metodologia",
            start: "top 82%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(".method-step-card", {
          scrollTrigger: {
            trigger: "#metodologia",
            start: "top 75%",
          },
          scale: 0.85,
          y: 35,
          opacity: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: "back.out(1.5)",
        });

        gsap.from("#metodologia-disclaimer", {
          scrollTrigger: {
            trigger: "#metodologia",
            start: "top 68%",
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // 7. Sección #proyectos (Clientes en Producción)
      const proyectosEl = document.getElementById("proyectos");
      if (proyectosEl) {
        gsap.from("#proyectos-heading", {
          scrollTrigger: {
            trigger: "#proyectos",
            start: "top 82%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(".client-project-card", {
          scrollTrigger: {
            trigger: "#proyectos",
            start: "top 75%",
          },
          y: 45,
          scale: 0.95,
          opacity: 0,
          duration: 0.75,
          stagger: 0.18,
          ease: "power3.out",
        });
      }

      // 8. Sección #autor (Sobre Pablo)
      const autorEl = document.getElementById("autor");
      if (autorEl) {
        gsap.from("#autor-heading", {
          scrollTrigger: {
            trigger: "#autor",
            start: "top 82%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from("#autor-card", {
          scrollTrigger: {
            trigger: "#autor",
            start: "top 75%",
          },
          y: 45,
          scale: 0.95,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
        });

        gsap.from("#autor-photo", {
          scrollTrigger: {
            trigger: "#autor",
            start: "top 75%",
          },
          scale: 0.88,
          opacity: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "back.out(1.3)",
        });
      }

      // 9. Sección #faq (Preguntas Frecuentes)
      const faqEl = document.getElementById("faq");
      if (faqEl) {
        gsap.from("#faq-heading", {
          scrollTrigger: {
            trigger: "#faq",
            start: "top 82%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(".faq-item", {
          scrollTrigger: {
            trigger: "#faq",
            start: "top 78%",
          },
          y: 25,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        });
      }

      // 10. Sección Final CTA
      const finalCta = document.getElementById("final-cta-section");
      if (finalCta) {
        gsap.from(finalCta, {
          scrollTrigger: {
            trigger: finalCta,
            start: "top 85%",
          },
          y: 35,
          scale: 0.98,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // 11. Dinámica de velocidad al scrollear (Inercia y compresión suave)
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const normSkew = Math.max(Math.min(velocity / 800, 1.5), -1.5);

          gsap.to(".gsap-reveal", {
            skewY: normSkew * 0.3,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
            onComplete: () => {
              gsap.to(".gsap-reveal", {
                skewY: 0,
                duration: 0.5,
                ease: "power2.out",
              });
            },
          });
        },
      });

      // Recalibración diferida de ScrollTrigger tras carga completa
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => clearTimeout(timer);
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="scroll-progress-bar"
      aria-hidden="true"
      className="fixed top-16 left-0 right-0 h-[2.5px] z-40 bg-gradient-to-r from-[#1E2430] via-[#526072] to-[#25D366] origin-left scale-x-0 pointer-events-none shadow-[0_1px_8px_rgba(37,211,102,0.35)]"
    />
  );
}
