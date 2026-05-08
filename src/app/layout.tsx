import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import NavigationWrapper from "@/components/layout/NavigationWrapper"; // Importamos nuestro nuevo controlador

// Tipografía para títulos (Redondeada, amigable, kawaii pero profesional)
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Tipografía para cuerpo de texto (Limpia, moderna, suave y súper legible)
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${fredoka.variable} ${quicksand.variable} antialiased`}
      >
        <CartProvider>
          {/* Este NavigationWrapper decidirá inteligentemente cuándo mostrar el Header y Footer */}
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </CartProvider>
      </body>
    </html>
  );
}