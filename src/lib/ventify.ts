// Servicio de integración con Ventify API - Documentación Oficial

// ==================== INTERFACES ====================

/**
 * Respuesta de la API de Ventify para productos
 */
interface VentifyProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  reservedStock: number;
  category: string | null;
  description: string | null;
}

/**
 * Interfaz del producto para el frontend
 */
export interface Product {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: 'Ramos' | 'Amigurumis' | 'Personalizado' | 'General';
  categoriaOriginal?: string | null; // Categoría original de Ventify
  stock: number;
  descripcion?: string;
}

interface VentifyConfig {
  apiUrl: string;
  accountId: string;
  apiKey: string;
}

// ==================== CONFIGURACIÓN ====================

const config: VentifyConfig = {
  apiUrl: process.env.NEXT_PUBLIC_VENTIFY_API_URL || '',
  accountId: process.env.NEXT_PUBLIC_VENTIFY_ACCOUNT_ID || '',
  apiKey: process.env.NEXT_PUBLIC_VENTIFY_API_KEY || '',
};

/**
 * Headers según documentación oficial de Ventify
 * IMPORTANTE: Usa 'X-API-Key' (no 'api-key')
 */
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'X-API-Key': config.apiKey,
});

// ==================== ADAPTADORES ====================

/**
 * Mapea categoría de Ventify a las categorías del frontend
 */
function mapCategory(category: string | null): 'Ramos' | 'Amigurumis' | 'Personalizado' | 'General' {
  if (!category) return 'General';
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('ramo') || categoryLower.includes('flores')) {
    return 'Ramos';
  }
  if (categoryLower.includes('amigurumi') || categoryLower.includes('muñeco')) {
    return 'Amigurumis';
  }
  if (categoryLower.includes('personalizado') || categoryLower.includes('custom')) {
    return 'Personalizado';
  }
  
  return 'General';
}

/**
 * Adapta un producto de Ventify al formato del frontend
 */
function adaptVentifyProduct(ventifyProduct: VentifyProduct): Product {
  // FIX: Asegurar que stock y reservedStock sean números válidos
  const totalStock = Number(ventifyProduct.stock) || 0;
  const reserved = Number(ventifyProduct.reservedStock) || 0;
  const available = Math.max(0, totalStock - reserved);
  
  return {
    id: ventifyProduct.id,
    sku: ventifyProduct.sku,
    nombre: ventifyProduct.name,
    precio: ventifyProduct.price,
    imagen: ventifyProduct.imageUrl || 'https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Sin+Imagen',
    categoria: mapCategory(ventifyProduct.category),
    categoriaOriginal: ventifyProduct.category, // Preservar la categoría original
    stock: available,
    descripcion: ventifyProduct.description || 'Producto artesanal tejido a mano con amor 💝',
  };
}

// ==================== FUNCIONES PRINCIPALES ====================

/**
 * Obtiene la lista de productos activos desde Ventify
 * Endpoint oficial: GET /api/public/stores/{accountId}/products?active=true
 */
export async function getVentifyProducts(): Promise<Product[]> {
  try {
    // Validar variables de entorno
    if (!config.apiUrl || !config.accountId || !config.apiKey) {
      console.error('❌ Variables de entorno faltantes');
      return [];
    }

    // Construir URL según documentación oficial
    const url = `${config.apiUrl}/api/public/stores/${config.accountId}/products?active=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('❌ Error HTTP:', response.status);
      return [];
    }

    // Obtener la respuesta completa
    const data = await response.json();

    // Validar que la respuesta sea un array o extraer el array correcto
    let ventifyProducts: VentifyProduct[] = [];

    if (Array.isArray(data)) {
      ventifyProducts = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      ventifyProducts = data.data;
    } else if (data && typeof data === 'object' && Array.isArray(data.products)) {
      ventifyProducts = data.products;
    } else {
      console.error('❌ Estructura de respuesta no reconocida');
      return [];
    }

    // Validar que tengamos un array válido antes de mapear
    if (!Array.isArray(ventifyProducts) || ventifyProducts.length === 0) {
      console.warn('⚠️ No se encontraron productos');
      return [];
    }

    // Adaptar todos los productos al formato del frontend
    const products = ventifyProducts.map(adaptVentifyProduct);
    
    console.log('✅ Productos cargados:', products.length);
    
    return products;
    
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    return [];
  }
}

/**
 * Obtiene un producto específico por ID
 */
export async function getVentifyProductById(productId: string): Promise<Product | null> {
  try {
    const allProducts = await getVentifyProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
      console.warn('⚠️ Producto no encontrado:', productId);
      return null;
    }
    
    console.log('✅ Producto encontrado:', product.nombre);
    return product;
    
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    return null;
  }
}

/**
 * Crea una orden en Ventify (preparado para futuro)
 */
export async function createVentifyOrder(orderData: any) {
  try {
    if (!config.apiUrl || !config.accountId || !config.apiKey) {
      throw new Error('Faltan variables de entorno de Ventify');
    }

    const url = `${config.apiUrl}/api/public/stores/${config.accountId}/orders`;
    
    console.log('🔄 Creando orden en Ventify:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error ${response.status}: ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    
    console.log('✅ Orden creada en Ventify');

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error al crear orden en Ventify:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
    };
  }
}

// Exportar la configuración
export { config as ventifyConfig };
