"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollAnimations() {
  useEffect(() => {
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

      // 2. Animación de Entrada Escalonada del Hero (Dispara al elevarse la cortina o timeout de 600ms)
      const playHeroAnimation = () => {
        const heroTl = gsap.timeline();
        heroTl
          .fromTo(
            "#hero-eyebrow",
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" }
          )
          .fromTo(
            "#hero-title > *",
            { y: 40, scale: 0.96, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
            "-=0.3"
          )
          .fromTo(
            "#hero-cta > *",
            { y: 25, scale: 0.88, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.65, stagger: 0.12, ease: "back.out(1.8)" },
            "-=0.4"
          )
          .fromTo(
            "#hero-guarantees > *",
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
            "-=0.3"
          );
      };

      let heroStarted = false;
      const onPreloaderDone = () => {
        if (!heroStarted) {
          heroStarted = true;
          playHeroAnimation();
          ScrollTrigger.refresh();
        }
      };

      window.addEventListener("appPreloaderDone", onPreloaderDone);
      const heroFallbackTimer = setTimeout(onPreloaderDone, 650);

      // 3. Ticker Section: Expansión horizontal y desvanecimiento
      const tickerSection = document.getElementById("ticker-section");
      if (tickerSection) {
        gsap.fromTo(
          tickerSection,
          { opacity: 0, y: 35, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tickerSection,
              start: "top 90%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 4. Sección #ventajas: Inclinación Isométrica 3D y Elevación
      const ventajasEl = document.getElementById("ventajas");
      if (ventajasEl) {
        gsap.fromTo(
          "#ventajas-heading",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#ventajas",
              start: "top 82%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        const perkCards = document.querySelectorAll(".perk-card");
        if (perkCards.length > 0) {
          gsap.fromTo(
            perkCards,
            {
              opacity: 0,
              y: 50,
              scale: 0.88,
              rotateY: -12,
              transformPerspective: 800,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateY: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: "#ventajas",
                start: "top 78%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      }

      // 5. Sección #catalogo (Qué Hacemos): Desplazamiento Diagonal y Revelado Escalonado
      const catalogoEl = document.getElementById("catalogo");
      if (catalogoEl) {
        gsap.fromTo(
          "#catalogo-heading",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#catalogo",
              start: "top 82%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        // Animación individualizada para las 3 tarjetas de soluciones
        const solCards = document.querySelectorAll(".solution-card-anim");
        if (solCards.length >= 3) {
          // Tarjeta 1 (Izquierda): Desliza desde la izquierda
          gsap.fromTo(
            solCards[0],
            { opacity: 0, x: -50, y: 30 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#catalogo",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );

          // Tarjeta 2 (Centro): Emerge desde abajo con escala
          gsap.fromTo(
            solCards[1],
            { opacity: 0, y: 55, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: "#catalogo",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );

          // Tarjeta 3 (Derecha): Desliza desde la derecha
          gsap.fromTo(
            solCards[2],
            { opacity: 0, x: 50, y: 30 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#catalogo",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        } else if (solCards.length > 0) {
          gsap.fromTo(
            solCards,
            { opacity: 0, y: 40, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#catalogo",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        // Botón "Ir a Productos"
        const catalogoCta = document.querySelector(".catalogo-cta-box");
        if (catalogoCta) {
          gsap.fromTo(
            catalogoCta,
            { opacity: 0, y: 35, scale: 0.88 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "back.out(1.8)",
              scrollTrigger: {
                trigger: "#catalogo",
                start: "top 68%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      }

      // 6. Sección #metodologia: Giro y Zoom en 4 Pasos
      const metodologiaEl = document.getElementById("metodologia");
      if (metodologiaEl) {
        gsap.fromTo(
          "#metodologia-heading",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#metodologia",
              start: "top 82%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        const methodCards = document.querySelectorAll(".method-step-card");
        if (methodCards.length > 0) {
          gsap.fromTo(
            methodCards,
            {
              opacity: 0,
              scale: 0.76,
              rotate: -5,
              y: 45,
            },
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              y: 0,
              duration: 0.65,
              stagger: 0.15,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: "#metodologia",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        const disclaimer = document.getElementById("metodologia-disclaimer");
        if (disclaimer) {
          gsap.fromTo(
            disclaimer,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#metodologia",
                start: "top 68%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      }

      // 7. Sección #proyectos (Clientes): Deslizamiento Dividido Alternado (Izquierda / Derecha)
      const proyectosEl = document.getElementById("proyectos");
      if (proyectosEl) {
        gsap.fromTo(
          "#proyectos-heading",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#proyectos",
              start: "top 82%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        const clientCards = document.querySelectorAll(".client-project-card");
        if (clientCards.length >= 2) {
          // Cliente 1 (Del Valle): Desliza desde la izquierda
          gsap.fromTo(
            clientCards[0],
            { opacity: 0, x: -70, scale: 0.94 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#proyectos",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );

          // Cliente 2 (JPVS): Desliza desde la derecha
          gsap.fromTo(
            clientCards[1],
            { opacity: 0, x: 70, scale: 0.94 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#proyectos",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        } else if (clientCards.length > 0) {
          gsap.fromTo(
            clientCards,
            { opacity: 0, y: 45, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              stagger: 0.18,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#proyectos",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      }

      // 8. Sección #autor: Perspectiva 3D y Zoom de Fotografía
      const autorEl = document.getElementById("autor");
      if (autorEl) {
        gsap.fromTo(
          "#autor-heading",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#autor",
              start: "top 82%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        const autorCard = document.getElementById("autor-card");
        if (autorCard) {
          gsap.fromTo(
            autorCard,
            {
              opacity: 0,
              y: 55,
              scale: 0.93,
              rotateX: 12,
              transformPerspective: 900,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#autor",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }

        const autorPhoto = document.getElementById("autor-photo");
        if (autorPhoto) {
          gsap.fromTo(
            autorPhoto,
            { opacity: 0, scale: 0.82, rotate: -4 },
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.85,
              delay: 0.1,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: "#autor",
                start: "top 75%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      }

      // 9. Sección #faq: Cascada de Acordeones
      const faqEl = document.getElementById("faq");
      if (faqEl) {
        gsap.fromTo(
          "#faq-heading",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#faq",
              start: "top 82%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        const faqItems = document.querySelectorAll(".faq-item");
        if (faqItems.length > 0) {
          gsap.fromTo(
            faqItems,
            { opacity: 0, y: 35, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.09,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#faq",
                start: "top 78%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      }

      // 10. Sección Final CTA: Zoom de Pulso Cinemático
      const finalCta = document.getElementById("final-cta-section");
      if (finalCta) {
        gsap.fromTo(
          finalCta,
          { opacity: 0, scale: 0.91, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "back.out(1.3)",
            scrollTrigger: {
              trigger: finalCta,
              start: "top 85%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 11. Dinámica de velocidad al scrollear (Inercia y compresión elástica)
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const normSkew = Math.max(Math.min(velocity / 700, 1.8), -1.8);

          gsap.to(".gsap-reveal", {
            skewY: normSkew * 0.35,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
            onComplete: () => {
              gsap.to(".gsap-reveal", {
                skewY: 0,
                duration: 0.45,
                ease: "power2.out",
              });
            },
          });
        },
      });

      // Refresco de sincronización de alturas
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 700);

      return () => {
        clearTimeout(heroFallbackTimer);
        clearTimeout(refreshTimer);
        window.removeEventListener("appPreloaderDone", onPreloaderDone);
      };
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
