"use client";

import { useState, type FormEvent } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const SERVICES = [
  {
    icon: "🌐",
    title: "Desarrollo Web",
    desc: "Sitios y aplicaciones web modernas con las tecnologías más actuales. Desde landing pages hasta plataformas complejas.",
  },
  {
    icon: "⚙️",
    title: "Software a Medida",
    desc: "Sistemas personalizados que se adaptan a tu flujo de trabajo. Sin pagar licencias por funciones que no usas.",
  },
  {
    icon: "📊",
    title: "Análisis de Datos",
    desc: "Dashboards, reportes automatizados e inteligencia de negocio para tomar mejores decisiones.",
  },
  {
    icon: "🤖",
    title: "Automatización",
    desc: "Scripts, bots e integraciones que eliminan tareas repetitivas y reducen errores humanos.",
  },
  {
    icon: "🔗",
    title: "Integración de APIs",
    desc: "Conecto tus sistemas entre sí: ERP, CRM, pasarelas de pago, servicios externos y más.",
  },
  {
    icon: "🛠️",
    title: "Soporte & Mantenimiento",
    desc: "Mantenimiento continuo, corrección de bugs, actualizaciones de seguridad y mejoras incrementales.",
  },
];

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#como-trabajo", label: "Cómo trabajo" },
  { href: "#contacto", label: "Contacto" },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <HowIWork />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="text-xl font-bold text-primary">
          naxoresuelve
        </a>

        {/* Desktop */}
        <ul className="hidden gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-muted"
          aria-label="Menú"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="flex flex-col gap-2 border-t border-border px-4 pb-4 md:hidden">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-muted hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-24 text-white md:py-36">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5" />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Soluciones digitales
          <br />
          <span className="text-primary-light">a la medida de tu negocio</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
          Soy analista programador freelance. Desarrollo software, automatizo
          procesos y conecto sistemas para que tú te enfoques en lo que importa.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contacto"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-primary shadow-lg transition hover:bg-primary-light hover:shadow-xl"
          >
            Conversemos →
          </a>
          <a
            href="#servicios"
            className="rounded-lg border border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Ver servicios
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function Services() {
  return (
    <section id="servicios" className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Servicios
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
          Cada proyecto es distinto. Estos son los servicios que más solicitan
          mis clientes — y se pueden combinar.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
            >
              <span className="text-4xl">{s.icon}</span>
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How I Work                                                         */
/* ------------------------------------------------------------------ */

function HowIWork() {
  const steps = [
    {
      n: "01",
      title: "Conversación inicial",
      desc: "Entiendo tu problema, tu contexto y tus restricciones. Sin jerga técnica.",
    },
    {
      n: "02",
      title: "Propuesta clara",
      desc: "Recibes un alcance, plazo y presupuesto definidos. Sin sorpresas.",
    },
    {
      n: "03",
      title: "Desarrollo iterativo",
      desc: "Avanzamos en ciclos cortos. Ves progreso real cada semana y puedes dar feedback temprano.",
    },
    {
      n: "04",
      title: "Entrega y soporte",
      desc: "Te entrego código, documentación y accesos. Después, soporte continuo si lo necesitas.",
    },
  ];

  return (
    <section id="como-trabajo" className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Cómo trabajo
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Un proceso simple, transparente y sin letra chica.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact Form                                                       */
/* ------------------------------------------------------------------ */

type FormStatus = "idle" | "sending" | "success" | "error";

function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.detail?.[0]?.msg ?? body?.detail ?? `Error ${res.status}`
        );
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado");
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="bg-surface py-20">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Hablemos de tu proyecto
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Cuéntame qué necesitas. Respondo en menos de 24 horas.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
              placeholder="Describe brevemente tu proyecto o necesidad…"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow transition hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Enviando…" : "Enviar mensaje"}
          </button>

          {status === "success" && (
            <p className="rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
              ✓ Mensaje enviado. ¡Te respondo pronto!
            </p>
          )}

          {status === "error" && (
            <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-700">
              ✕ {errorMsg || "No se pudo enviar. Intenta de nuevo."}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  const year = 2026; // Updated at build time; or use useEffect for dynamic year

  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted">
      <div className="mx-auto max-w-6xl px-4">
        © {year} naxoresuelve — Todos los derechos reservados.
      </div>
    </footer>
  );
}
