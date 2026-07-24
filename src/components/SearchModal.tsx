"use client";
import { useState, useEffect } from "react";
import { X, Search, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/ventify";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, products, onProductClick }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);

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

  const handleProductClick = (product: Product) => {
    onProductClick(product);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#FDE8EF] flex items-center gap-3">
          <Search className="text-[#C04267] w-6 h-6" />
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

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {searchTerm && results.length === 0 && (
            <div className="p-8 text-center text-gray-400 font-lato">
              No encontramos productos que coincidan con &quot;{searchTerm}&quot;
            </div>
          )}

          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="w-full flex items-center gap-4 p-3 hover:bg-[#FDF4F7] rounded-xl transition-colors group text-left"
            >
              <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                <Image src={product.imagen} alt={product.nombre} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-lato font-bold text-[#C04267] truncate">
                  {product.nombre}
                </h4>
                <p className="text-sm text-gray-500 font-lato">{product.categoria}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="block font-playfair font-bold text-[#EE6B8D]">S/ {product.precio.toFixed(2)}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </div>
            </button>
          ))}

          {!searchTerm && (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-400 font-lato">
                Escribe el nombre de tu personaje favorito o regalo...
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-[#FDE8EF] text-[#C04267] text-xs rounded-full font-lato">Goku</span>
                <span className="px-3 py-1 bg-[#FDE8EF] text-[#C04267] text-xs rounded-full font-lato">Ramo</span>
                <span className="px-3 py-1 bg-[#FDE8EF] text-[#C04267] text-xs rounded-full font-lato">Amigurumi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
