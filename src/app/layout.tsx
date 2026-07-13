import type { Metadata } from "next";
import { Fredoka, Quicksand, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import NavigationWrapper from "@/components/layout/NavigationWrapper";
import { ToastProvider } from "@/components/Toast";

// Tipografía para títulos (redondeada, amigable, kawaii pero profesional)
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Tipografía para cuerpo de texto (limpia, moderna, suave y muy legible)
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Acento manuscrito — SOLO para detalles puntuales (ver .tag-manuscrita en globals.css)
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Entre Hilos - Crochet hecho con amor",
  description: "Creaciones únicas de crochet. Ramos, amigurumis y diseños personalizados tejidos a mano.",
  icons: {
    icon: '/Favicon-EHC.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fredoka.variable} ${quicksand.variable} ${caveat.variable} antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            <NavigationWrapper>
              {children}
            </NavigationWrapper>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}