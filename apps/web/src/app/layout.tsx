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
  title: "naxoresuelve | Pablo Valdés — Arquitectura de Software & Automatización",
  description:
    "Soluciones de ingeniería de software de alto impacto por Pablo Valdés. Automatización de procesos masivos, bases de datos optimizadas, erradicación de errores por duplicidad, SaaS y consultoría con rigor de testing extremo.",
  keywords: [
    "Pablo Valdés",
    "naxoresuelve",
    "analista programador",
    "ingeniería de software",
    "automatización excel",
    "carga masiva de archivos",
    "optimización postgresql",
    "duplicidad de datos",
    "desarrollo saas",
    "testing riguroso",
    "google ads roi",
    "posicionamiento google maps",
    "Chile",
  ],
  authors: [{ name: "Pablo Valdés", url: "https://www.linkedin.com/in/pablo-vald%C3%A9s-7a4445430/" }],
  openGraph: {
    title: "naxoresuelve | Pablo Valdés — Software & Automatización de Alto Impacto",
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
        {children}
      </body>
    </html>
  );
}
