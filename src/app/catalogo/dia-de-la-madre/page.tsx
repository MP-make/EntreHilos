"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { MessageCircle } from "lucide-react";
import { loadExtras } from "@/lib/extras-cache";
import ProductCard from "@/components/ProductCard";
import QuickViewDrawer from "@/components/QuickViewDrawer";

export default function DiaDeLaMadrePage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    loadExtras(() => {});
  }, []);

  const handleQuickView = (producto: any) => {
    setSelectedProduct(producto);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getVentifyProducts();

      // Productos de Día de la Madre: filtrar por categoría "Día de la Madre" o SKU Madre-/Ramos-
      const productosMadre = all
        .filter(p => 
          p.categoriaOriginal?.toLowerCase().includes('día de la madre') ||
          p.sku.startsWith('Madre-') || 
          p.sku.startsWith('Ramos-')
        )
        .sort((a, b) => {
          if (a.stock > 0 && b.stock === 0) return -1;
          if (a.stock === 0 && b.stock > 0) return 1;
          return 0;
        });

      setProductos(productosMadre);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <p className="font-lato text-lg text-[#EE6B8D]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      {/* HERO BANNER */}
      <section className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] overflow-hidden">
        {/*  Imagen DESKTOP: hidden en móvil, block en lg+ */}
        <Image
          src="/dia de las madres tarjeta.png"
          alt="Día de la Madre - Entre Hilos"
          fill
          quality={100}
          className="object-cover object-center hidden lg:block"
          priority
        />
        {/*  Imagen MOBILE: block por defecto, hidden en lg+ */}
        <Image
          src="/dia de las madres tarjeta.png"
          alt="Día de la Madre - Entre Hilos Móvil"
          fill
          quality={100}
          className="object-cover object-center block lg:hidden"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#C04267]/60 to-transparent flex flex-col items-center justify-end pb-8 px-4">
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white text-center mb-3 drop-shadow-lg">
          </h1>
          <p className="font-lato text-sm md:text-base text-white/90 text-center mb-5">
           
          </p>
          <button
            onClick={() => window.open('https://wa.me/51902578295', '_blank')}
            className="font-lato px-6 py-2.5 bg-white text-[#C04267] font-semibold text-sm rounded-full flex items-center gap-2 hover:bg-[#EE6B8D] hover:text-white transition-all shadow-lg"
          >
            <MessageCircle size={16} />
            Pedir por WhatsApp
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* SECCIÓN: PRODUCTOS */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-[#EE6B8D]/10 text-[#C04267] text-xs font-lato font-semibold px-4 py-1.5 rounded-full border border-[#EE6B8D]/30 mb-3">
               Colección Especial
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#C04267]">
              Detalles para Mamá
            </h2>
            <p className="font-lato text-base text-[#6B6B6B] font-light mt-2">
              Flores eternas y regalos tejidos a mano · {productos.length} productos disponibles
            </p>
          </div>

          {productos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10 lg:gap-y-14">
              {productos.map(p => <ProductCard key={p.id} producto={p} onQuickView={handleQuickView} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#FDE8EF] max-w-2xl mx-auto">
              <span className="text-6xl block mb-4"></span>
              <p className="font-playfair text-3xl text-[#C04267] mb-3 font-semibold">
                ¡Estamos preparando sorpresas!
              </p>
              <p className="font-lato text-base text-[#6B6B6B] font-light mb-8 px-4">
                Pronto tendremos hermosos detalles para el Día de la Madre.
              </p>
              <Link
                href="/"
                className="inline-block font-lato px-8 py-3.5 bg-[#EE6B8D] hover:bg-[#C04267] text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Explorar otras colecciones
              </Link>
            </div>
          )}
        </section>
      </div>

      {selectedProduct && (
        <QuickViewDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}