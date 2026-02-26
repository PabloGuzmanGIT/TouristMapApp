import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
// @ts-ignore — CSS side-effect import (no types)
import 'maplibre-gl/dist/maplibre-gl.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from 'sonner';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
