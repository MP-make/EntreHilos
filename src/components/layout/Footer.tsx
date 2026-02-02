import Link from "next/link";
import Image from "next/image";
import { Instagram, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F9F9F9] border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Columna 1: Logo + Marca */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Image 
                src="/logo.jpg" 
                alt="Entre Hilos" 
                width={50} 
                height={50}
                className="object-contain rounded-full"
              />
              <h3 className="font-playfair text-xl text-[#5E548E] font-semibold">
                Entre Hilos
              </h3>
            </div>
            <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
              Crochet artesanal hecho en Perú
              <br />
              Calidad y dedicación en cada puntada
            </p>
          </div>

          {/* Columna 2: Atención al Cliente */}
          <div className="text-center">
            <h4 className="font-playfair text-base text-[#5E548E] font-semibold mb-4">
              Atención al Cliente
            </h4>
            <ul className="space-y-3 font-lato text-sm">
              <li>
                <a 
                  href="https://wa.me/51927005798" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[#6B6B6B] hover:text-[#25D366] transition-colors duration-200"
                >
                  <Phone size={16} />
                  <span>927 005 798</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/entrehiloscrochet.pe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[#6B6B6B] hover:text-[#E4405F] transition-colors duration-200"
                >
                  <Instagram size={16} />
                  <span>@entrehiloscrochet.pe</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Métodos de Pago */}
          <div className="text-center md:text-right">
            <h4 className="font-playfair text-base text-[#5E548E] font-semibold mb-4">
              Métodos de Pago
            </h4>
            <ul className="space-y-2 font-lato text-sm text-[#6B6B6B]">
              <li>Yape</li>
              <li>Plin</li>
              <li>Transferencia bancaria</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="font-lato text-xs text-[#6B6B6B] font-light">
            © {new Date().getFullYear()} Entre Hilos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
