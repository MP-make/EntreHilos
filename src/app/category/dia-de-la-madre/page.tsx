"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { MessageCircle } from "lucide-react";

export default function DiaDeLaMadrePage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getVentifyProducts();

      // Productos de Día de la Madre: SKU Madre- y Ramos-, ordenados por stock disponible primero
      const productosMadre = all
        .filter(p => p.sku.startsWith('Madre-') || p.sku.startsWith('Ramos-'))
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

  const { addToCart } = useCart();

  const ProductCard = ({ producto }: { producto: any }) => {
    const isAmigurumiOrCaja = producto.sku.startsWith('Amigu-') || producto.sku.startsWith('Caja-');

    const handleAddToCart = () => {
      if (producto.stock === 0 && isAmigurumiOrCaja) {
        const productoData = encodeURIComponent(JSON.stringify({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          sku: producto.sku,
        }));
        window.location.href = `/pedido-personalizado?producto=${productoData}`;
        return;
      }
      if (producto.stock === 0) return;
      addToCart(producto);
      alert('¡Agregado al carrito! 🌸');
    };

    const stockLabel =
      producto.stock === 0
        ? isAmigurumiOrCaja ? 'A pedido' : 'Agotado'
        : producto.stock <= 5
        ? 'Últimas unidades'
        : `${producto.stock} disponibles`;

    const stockColor =
      producto.stock === 0
        ? isAmigurumiOrCaja ? 'text-[#EE6B8D]' : 'text-red-600'
        : producto.stock <= 5
        ? 'text-orange-600'
        : 'text-gray-600';

    return (
      <div className="group">
        <Link href={`/product/${slugify(producto.nombre)}`} className="block">
          <div className="relative aspect-square bg-white mb-4 overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:border-[#EE6B8D] transition-all duration-300">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              unoptimized
            />
            {producto.stock <= 5 && producto.stock > 0 && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs font-lato font-bold rounded">
                Últimas unidades
              </div>
            )}
            {producto.stock === 0 && isAmigurumiOrCaja && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#EE6B8D] text-white text-xs font-lato font-bold rounded">
                A pedido
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-playfair text-lg text-[#4A4A4A] mb-1 group-hover:text-[#C04267] transition-colors line-clamp-2 min-h-[3.5rem]">
              {producto.nombre}
            </h3>
            <div className="mb-3">
              <span className="font-playfair text-2xl font-medium text-[#EE6B8D]">
                S/ {producto.precio.toFixed(2)}
              </span>
              <p className={`font-lato text-xs mt-1 font-light ${stockColor}`}>
                {stockLabel}
              </p>
            </div>
          </div>
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={producto.stock === 0 && !isAmigurumiOrCaja}
          className={`font-lato w-full py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
            producto.stock === 0 && !isAmigurumiOrCaja
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#EE6B8D] text-white hover:bg-[#C04267] shadow-sm hover:shadow-md'
          }`}
        >
          {producto.stock === 0 && !isAmigurumiOrCaja
            ? 'AGOTADO'
            : producto.stock === 0 && isAmigurumiOrCaja
            ? 'A PEDIDO (1-2 semanas)'
            : 'Agregar al carrito'}
        </button>
      </div>
    );
  };

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
        {/* 🖥️ Imagen DESKTOP: hidden en móvil, block en lg+ */}
        <Image
          src="/dia-de-la-madre-horizontal.png"
          alt="Día de la Madre - Entre Hilos"
          fill
          quality={100}
          className="object-cover object-center hidden lg:block"
          priority
        />
        {/* 📱 Imagen MOBILE: block por defecto, hidden en lg+ */}
        <Image
          src="/dia-de-la-madre-vertical.png"
          alt="Día de la Madre - Entre Hilos Móvil"
          fill
          quality={100}
          className="object-cover object-center block lg:hidden"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#C04267]/60 to-transparent flex flex-col items-center justify-end pb-8 px-4">
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white text-center mb-3 drop-shadow-lg">
            Día de la Madre 🌸
          </h1>
          <p className="font-lato text-sm md:text-base text-white/90 text-center mb-5">
            Detalles eternos tejidos con amor para mamá
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

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* SECCIÓN: PRODUCTOS */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-[#EE6B8D]/10 text-[#C04267] text-xs font-lato font-semibold px-4 py-1.5 rounded-full border border-[#EE6B8D]/30 mb-3">
              🌸 Colección Especial
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#C04267]">
              Detalles para Mamá
            </h2>
            <p className="font-lato text-base text-[#6B6B6B] font-light mt-2">
              Flores eternas y regalos tejidos a mano · {productos.length} productos disponibles
            </p>
          </div>

          {productos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
              {productos.map(p => <ProductCard key={p.id} producto={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#FDE8EF] max-w-2xl mx-auto">
              <span className="text-6xl block mb-4">🌸</span>
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
    </div>
  );
}