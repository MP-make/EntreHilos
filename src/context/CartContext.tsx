"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/ventify';

// 1. Nueva Interfaz para los Extras (CORREGIDA PARA ACEPTAR NULL)
export interface CartExtra {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number;
  categoriaOriginal?: string | null; // <--- AQUÍ ESTÁ LA SOLUCIÓN
}

export interface CartItem extends Product {
  quantity: number;
  extras: CartExtra[]; 
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addExtraToItem: (productId: string, extraProduct: Product) => void;
  removeExtraFromItem: (productId: string, extraId: string) => void;
  updateExtraQuantity: (productId: string, extraId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getWhatsAppMessage: () => string; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('entrehilos-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const safeCart = parsedCart.map((item: any) => ({
          ...item,
          extras: item.extras || []
        }));
        setItems(safeCart);
      } catch (error) {
        console.error('Error al cargar carrito:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('entrehilos-cart', JSON.stringify(items));
    }
  }, [items, isClient]);

  const addToCart = (product: Product) => {
    const isAmigurumiOrCaja = product.sku.startsWith('Amigu-') || product.sku.startsWith('Caja-');
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        if (!isAmigurumiOrCaja && existingItem.quantity >= product.stock) {
          alert(`Solo hay ${product.stock} unidades disponibles de ${product.nombre}`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        if (product.stock === 0 && !isAmigurumiOrCaja) {
          alert('Producto sin stock');
          return prevItems;
        }
        return [...prevItems, { ...product, quantity: 1, extras: [] }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const isAmigurumiOrCaja = item.sku.startsWith('Amigu-') || item.sku.startsWith('Caja-');
          const newQuantity = isAmigurumiOrCaja ? quantity : Math.min(quantity, item.stock);
          
          if (!isAmigurumiOrCaja && newQuantity < quantity) {
            alert(`Solo hay ${item.stock} unidades disponibles de ${item.nombre}`);
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const addExtraToItem = (productId: string, extraProduct: Product) => {
    setItems((prevItems) => prevItems.map(item => {
      if (item.id === productId) {
        const existingExtra = item.extras.find(e => e.id === extraProduct.id);
        
        if (existingExtra) {
          if (existingExtra.cantidad >= extraProduct.stock) {
            alert(`Stock límite alcanzado: Solo nos quedan ${extraProduct.stock} de ${extraProduct.nombre}`);
            return item;
          }
          return {
            ...item,
            extras: item.extras.map(e => e.id === extraProduct.id ? { ...e, cantidad: e.cantidad + 1 } : e)
          };
        } else {
          if (extraProduct.stock === 0) {
            alert(`¡Lo sentimos! ${extraProduct.nombre} está agotado por el momento.`);
            return item;
          }
          return {
            ...item,
            extras: [...item.extras, {
              id: extraProduct.id,
              nombre: extraProduct.nombre,
              precio: extraProduct.precio,
              cantidad: 1,
              stock: extraProduct.stock,
              categoriaOriginal: extraProduct.categoriaOriginal // Ya no lanzará error
            }]
          };
        }
      }
      return item;
    }));
  };

  const removeExtraFromItem = (productId: string, extraId: string) => {
    setItems((prevItems) => prevItems.map(item => {
      if (item.id === productId) {
        return { ...item, extras: item.extras.filter(e => e.id !== extraId) };
      }
      return item;
    }));
  };

  const updateExtraQuantity = (productId: string, extraId: string, quantity: number) => {
    if (quantity < 1) {
      removeExtraFromItem(productId, extraId);
      return;
    }
    setItems((prevItems) => prevItems.map(item => {
      if (item.id === productId) {
        return {
          ...item,
          extras: item.extras.map(e => {
            if (e.id === extraId) {
              const newQuantity = Math.min(quantity, e.stock);
              if (newQuantity < quantity) {
                alert(`Solo nos quedan ${e.stock} de ${e.nombre}`);
              }
              return { ...e, cantidad: newQuantity };
            }
            return e;
          })
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => {
    const extrasCount = item.extras.reduce((eSum, extra) => eSum + extra.cantidad, 0);
    return sum + item.quantity + extrasCount;
  }, 0);

  const totalPrice = items.reduce((sum, item) => {
    const itemTotal = item.precio * item.quantity;
    const extrasTotal = item.extras.reduce((eSum, extra) => eSum + (extra.precio * extra.cantidad), 0);
    return sum + itemTotal + extrasTotal;
  }, 0);

  const getWhatsAppMessage = () => {
    let message = "🛍️ *NUEVO PEDIDO - ENTRE HILOS* 🛍️\n\n";
    
    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.nombre}*\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio: S/ ${(item.precio * item.quantity).toFixed(2)}\n`;
      
      if (item.extras && item.extras.length > 0) {
        message += `   ✨ *Extras agregados a este producto:*\n`;
        item.extras.forEach(extra => {
          message += `      + ${extra.cantidad}x ${extra.nombre} (S/ ${(extra.precio * extra.cantidad).toFixed(2)})\n`;
        });
      }
      message += `\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL A PAGAR: S/ ${totalPrice.toFixed(2)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `¡Hola! Me gustaría confirmar este pedido por favor. 💖`;
    
    return encodeURIComponent(message);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        addExtraToItem,
        removeExtraFromItem,
        updateExtraQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}