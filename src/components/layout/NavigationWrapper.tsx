"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const hideNav = pathname === "/checkout" || pathname === "/perfil" || pathname === "/admin";

  return (
    <>
      {!hideNav && <Navbar />}
      {children}
      {!hideNav && <Footer />}
      {!hideNav && <WhatsAppButton />}
    </>
  );
}