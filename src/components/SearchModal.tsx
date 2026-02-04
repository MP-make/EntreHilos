"use client";
import { useState, useEffect } from "react";
import { X, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/ventify";
import { slugify } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export default function SearchModal({ isOpen, onClose, products }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  // Lógica de búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  }, [searchTerm, products]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4 transition-all"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header del Buscador */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="text-[#5E548E] w-6 h-6" />
          <input
            type="text"
            placeholder="¿Qué estás buscando? (Ej: Goku, Ramo, Tulipanes...)"
            className="flex-1 text-lg outline-none text-gray-700 placeholder:text-gray-400 font-lato"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="text-gray-500 w-5 h-5" />
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {searchTerm && results.length === 0 && (
            <div className="p-8 text-center text-gray-400 font-lato">
              No encontramos productos que coincidan con "{searchTerm}" 🧶
            </div>
          )}

          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${slugify(product.nombre)}`}
              onClick={onClose}
              className="flex items-center gap-4 p-3 hover:bg-[#FDF4F7] rounded-xl transition-colors group"
            >
              <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                <Image src={product.imagen} alt={product.nombre} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-lato font-bold text-[#5E548E] group-hover:text-[#9F86C0] transition-colors">
                  {product.nombre}
                </h4>
                <p className="text-sm text-gray-500 font-lato">{product.categoria}</p>
              </div>
              <div className="text-right">
                <span className="block font-playfair font-bold text-[#9F86C0]">S/ {product.precio.toFixed(2)}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </div>
            </Link>
          ))}
          
          {!searchTerm && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-sm text-gray-400 font-lato">
                Escribe el nombre de tu personaje favorito o regalo...
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-[#FDF4F7] text-[#5E548E] text-xs rounded-full font-lato">Goku</span>
                <span className="px-3 py-1 bg-[#FDF4F7] text-[#5E548E] text-xs rounded-full font-lato">Ramo</span>
                <span className="px-3 py-1 bg-[#FDF4F7] text-[#5E548E] text-xs rounded-full font-lato">Amigurumi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}