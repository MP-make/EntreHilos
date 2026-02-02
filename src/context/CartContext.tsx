"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/ventify';

// Interfaz extendida para items del carrito
export interface CartItem extends Product {
  quantity: number;
}

// Interfaz del contexto
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider del carrito
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('entrehilos-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('entrehilos-cart', JSON.stringify(items));
    }
  }, [items, isClient]);

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Si ya existe, incrementar cantidad (validando stock)
        if (existingItem.quantity >= product.stock) {
          alert(`Solo hay ${product.stock} unidades disponibles de ${product.nombre}`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        if (product.stock === 0) {
          alert('Producto sin stock');
          return prevItems;
        }
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // Validar que no exceda el stock
          const newQuantity = Math.min(quantity, item.stock);
          if (newQuantity < quantity) {
            alert(`Solo hay ${item.stock} unidades disponibles de ${item.nombre}`);
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Limpiar todo el carrito
  const clearCart = () => {
    setItems([]);
  };

  // Calcular total de items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calcular precio total
  const totalPrice = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el carrito
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
