"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Verificamos si estamos en la página del carrito
  const isCartPage = pathname === "/cart";

  return (
    <>
      {/* Si NO estamos en el carrito (!isCartPage), mostramos el Navbar */}
      {!isCartPage && <Navbar />}
      
      {/* El contenido de la página (Catálogo, Carrito, etc.) */}
      {children}
      
      {/* Si NO estamos en el carrito, mostramos el Footer y el WhatsApp flotante */}
      {!isCartPage && <Footer />}
      {!isCartPage && <WhatsAppButton />}
    </>
  );
}