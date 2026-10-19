import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "naxoresuelve | Naxo Resuelve — Arquitectura de Software, Automatización & Testing Rudo",
  description:
    "Soluciones de ingeniería de software y automatización por Naxo Resuelve. Procesamiento masivo de datos, bases de datos PostgreSQL optimizadas (3FN), erradicación de duplicidad, SaaS y consultoría con rigor de testing extremo.",
  keywords: [
    "naxoresuelve",
    "Naxo Resuelve",
    "arquitectura de software",
    "automatización excel",
    "scripts python",
    "carga masiva de archivos",
    "optimización postgresql",
    "erradicación duplicidad de datos",
    "desarrollo saas",
    "testing rudo",
    "testing riguroso",
    "google ads roi",
    "posicionamiento google maps",
    "Chile",
  ],
  authors: [{ name: "Naxo Resuelve", url: "https://renkaidev-web.renkaidev.workers.dev/" }],
  openGraph: {
    title: "naxoresuelve | Naxo Resuelve — Software & Automatización de Alto Impacto",
    description:
      "Ingeniería de software con pruebas de estrés reales. Cero pérdida de información, cero duplicidad.",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#3a3640] text-[#ffffff] font-round selection:bg-[#80182a] selection:text-[#f2cf6b]">
        {/* Enlace accesible para lectores de pantalla y navegación por teclado (WCAG 2.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-3 focus:bg-[#f2cf6b] focus:text-[#1c181f] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#ff6b85]"
        >
          Saltar directamente al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
