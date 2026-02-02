"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Heart, Truck, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import AddToCartBtn from "@/components/AddToCartBtn"; // Asegúrate de haber creado el paso 1

// 1. Definir params como Promesa (Regla de Next.js 15)
type Props = {
  params: Promise<{ slug: string }>;
};

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const p = await params;
      const slug = p.slug;
      const allProducts = await getVentifyProducts();
      const prod = allProducts.find((p) => slugify(p.nombre) === slug);
      setProduct(prod);
      setLoading(false);
    };
    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-[#9F86C0] text-lg">Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const hasStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-[#FDF4F7] pb-24 md:pb-8">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#5E548E] hover:text-[#9F86C0] transition-colors">
            <ArrowLeft size={20} />
            <span className="font-lato font-medium hidden sm:inline">Volver al catálogo</span>
          </Link>
          <button className="p-2 hover:bg-[#FDF4F7] rounded-full transition-colors text-[#9F86C0]">
            <Heart size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* COLUMNA IZQUIERDA: FOTO */}
          <div className="relative h-[400px] md:h-[600px] bg-[#FAF9F6]">
            <Image
              src={product.imagen}
              alt={product.nombre}
              fill
              className="object-cover"
              priority
            />
            {product.stock < 5 && hasStock && (
               <div className="absolute top-6 right-6 bg-[#9F86C0] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                 ¡Solo quedan {product.stock}!
               </div>
            )}
          </div>

          {/* COLUMNA DERECHA: INFO */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-[#FDF4F7] text-[#9F86C0] text-xs font-bold tracking-wider uppercase rounded-full w-fit mb-4">
              {product.categoria}
            </span>
            
            <h1 className="font-playfair text-3xl md:text-5xl text-[#5E548E] mb-2 leading-tight">
              {product.nombre}
            </h1>
            
            <div className="text-2xl text-[#9F86C0] font-light mb-6">
              S/ {product.precio.toFixed(2)}
            </div>

            <p className="font-lato text-gray-600 leading-relaxed mb-8">
              {product.descripcion === 'product image' 
                ? 'Pieza tejida a mano con hilo de algodón premium. Cada puntada está hecha con dedicación para crear un regalo único y especial.' 
                : product.descripcion}
            </p>

            {/* Componente Cliente para el Botón */}
            <div className="mb-8">
              <AddToCartBtn hasStock={hasStock} />
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Truck className="w-5 h-5 text-[#9F86C0]" />
                <span>Envíos a todo el Perú</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <ShieldCheck className="w-5 h-5 text-[#9F86C0]" />
                <span>100% Hecho a Mano</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}