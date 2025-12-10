import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
// @ts-ignore — CSS side-effect import (no types)
import 'maplibre-gl/dist/maplibre-gl.css';
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Explora Perú - Descubre los mejores lugares del Perú",
  description: "Plataforma de turismo para descubrir lugares turísticos, gastronómicos, históricos y naturales en los 24 departamentos del Perú.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
