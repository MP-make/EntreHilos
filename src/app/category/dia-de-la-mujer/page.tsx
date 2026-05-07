"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { MessageCircle } from "lucide-react";

// SKUs o nombres de los productos especiales del Día de la Mujer
const CAJITAS_8M = [
  'cajita snopy',
  'cajita snoopy',
  'margarita crochet',
  'cajita ramo individual',
  'cajita tulipan',
  'cajita tulipán',
];

export default function DiaDelaMujerPage() {
  const [ramos, setRamos] = useState<any[]>([]);
  const [cajitas, setCajitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const all = await getVentifyProducts();

      // Ramos con stock (SKU Ramos-)
      const ramosConStock = all
        .filter(p => p.sku.startsWith('Ramos-') && p.stock > 0)
        .sort((a, b) => b.stock - a.stock);

      // Cajitas especiales 8M (por nombre)
      const cajitasEspeciales = all.filter(p =>
        CAJITAS_8M.some(nombre => p.nombre.toLowerCase().includes(nombre))
      );

      setRamos(ramosConStock);
      setCajitas(cajitasEspeciales);
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
      alert('¡Agregado al carrito! 💜');
    };

    const stockLabel =
      producto.stock === 0
        ? isAmigurumiOrCaja ? 'A pedido' : 'Agotado'
        : producto.stock <= 5
        ? 'Últimas unidades'
        : `${producto.stock} disponibles`;

    const stockColor =
      producto.stock === 0
        ? isAmigurumiOrCaja ? 'text-[#9F86C0]' : 'text-red-600'
        : producto.stock <= 5
        ? 'text-orange-600'
        : 'text-gray-600';

    return (
      <div className="group">
        <Link href={`/product/${slugify(producto.nombre)}`} className="block">
          <div className="relative aspect-square bg-white mb-4 overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:border-[#9F86C0] transition-all duration-300">
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
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#9F86C0] text-white text-xs font-lato font-bold rounded">
                A pedido
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-playfair text-lg text-[#4A4A4A] mb-1 group-hover:text-[#5E548E] transition-colors line-clamp-2 min-h-[3.5rem]">
              {producto.nombre}
            </h3>
            <div className="mb-3">
              <span className="font-playfair text-2xl font-medium text-[#9F86C0]">
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
              : 'bg-[#9F86C0] text-white hover:bg-[#5E548E] shadow-sm hover:shadow-md'
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
        <p className="font-lato text-lg text-[#9F86C0]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      {/* HERO BANNER */}
      <section className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] overflow-hidden">
        <Image
          src="/Dia-de-la-mujer-8M.webp"
          alt="Día de la Mujer 8M"
          fill
          quality={100}
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B1F6A]/60 to-transparent flex flex-col items-center justify-end pb-8 px-4">
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-white text-center mb-3 drop-shadow-lg">
          </h1>
          <p className="font-lato text-sm md:text-base text-white/90 text-center mb-5">
          </p>
          <button
            onClick={() => window.open('https://wa.me/51902578295', '_blank')}
            className="font-lato px-6 py-2.5 bg-white text-[#5E548E] font-semibold text-sm rounded-full flex items-center gap-2 hover:bg-[#9F86C0] hover:text-white transition-all shadow-lg"
          >
            <MessageCircle size={16} />
            Pedir por WhatsApp
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* SECCIÓN: RAMOS CON STOCK */}
        {ramos.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <span className="inline-block bg-[#9F86C0]/10 text-[#5E548E] text-xs font-lato font-semibold px-4 py-1.5 rounded-full border border-[#9F86C0]/30 mb-3">
                🌸 Disponibles ahora
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#5E548E]">
                Ramos de Crochet
              </h2>
              <p className="font-lato text-base text-[#6B6B6B] font-light mt-2">
                Flores eternas hechas a mano · {ramos.length} disponibles
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
              {ramos.map(p => <ProductCard key={p.id} producto={p} />)}
            </div>
          </section>
        )}

        {/* SECCIÓN: CAJITAS ESPECIALES */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-[#f09bc0]/20 text-[#BE185D] text-xs font-lato font-semibold px-4 py-1.5 rounded-full border border-[#f09bc0]/40 mb-3">
              🎁 Especial 8M
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#5E548E]">
              Cajitas Regalo
            </h2>
            <p className="font-lato text-base text-[#6B6B6B] font-light mt-2">
              Detalles con crochet artesanal · Pedido con 1-2 semanas de anticipación
            </p>
          </div>

          {cajitas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {cajitas.map(p => <ProductCard key={p.id} producto={p} />)}
            </div>
          ) : (
            /* Si no existen aún en Ventify, mostrar tarjetas manuales */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { nombre: 'Cajita Snoopy Crochet / Margarita', emoji: '🌼', descripcion: 'Una cajita con Snoopy y margaritas tejidas a mano. Ideal para regalar.' },
                { nombre: 'Cajita Ramo Individual Crochet', emoji: '🌹', descripcion: 'Ramo individual en caja de regalo, tejido con hilo premium.' },
                { nombre: 'Cajita Tulipán Crochet', emoji: '🌷', descripcion: 'Tulipán crochet en cajita regalo. Un detalle eterno.' },
              ].map((item) => (
                <div key={item.nombre} className="bg-white rounded-2xl shadow-sm border border-[#9F86C0]/20 p-6 text-center hover:shadow-md hover:border-[#9F86C0] transition-all">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="font-playfair text-lg text-[#5E548E] font-semibold mb-2">{item.nombre}</h3>
                  <p className="font-lato text-sm text-[#6B6B6B] font-light mb-4">{item.descripcion}</p>
                  <button
                    onClick={() => window.open('https://wa.me/51902578295?text=' + encodeURIComponent(`Hola, me interesa el producto: ${item.nombre}`), '_blank')}
                    className="font-lato w-full py-2.5 bg-[#9F86C0] text-white text-sm font-medium rounded-lg hover:bg-[#5E548E] transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    Consultar por WhatsApp
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
