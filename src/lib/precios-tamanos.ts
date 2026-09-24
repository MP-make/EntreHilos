// Precios por tamaño para productos personalizados (Amigu-)
// Pequeño = Precio Costo · Mediano = Precio Sugerido · Grande = Precio Mínimo Venta

import { createClient } from '@supabase/supabase-js';

export interface PrecioTamanos {
  sku: string;
  precio_pequeno: number | null;
  precio_mediano: number | null;
  precio_grande: number | null;
}

let preciosCache: PrecioTamanos[] | null = null;
let preciosFetchedAt = 0;
const PRECIOS_CACHE_TTL = 60_000;

/**
 * Obtiene los precios por tamaño configurados desde el panel admin.
 * Usa la key anónima (tabla con lectura pública), funciona en cliente y servidor.
 */
export async function getPreciosTamanos(): Promise<PrecioTamanos[]> {
  const now = Date.now();
  if (preciosCache && now - preciosFetchedAt < PRECIOS_CACHE_TTL) {
    return preciosCache;
  }
  try {
    if (typeof window !== 'undefined') {
      const { getSupabaseBrowserClient } = await import('@/lib/supabase/client');
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.from('precios_tamanos').select('*');
      preciosCache = (data || []) as PrecioTamanos[];
      preciosFetchedAt = Date.now();
      return preciosCache;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!url || !anon) return [];
    const supabase = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data } = await supabase.from('precios_tamanos').select('*');
    preciosCache = (data || []) as PrecioTamanos[];
    preciosFetchedAt = Date.now();
    return preciosCache;
  } catch (e) {
    console.error('Error cargando precios por tamaño:', e);
    return [];
  }
}
