-- =====================================================
-- MIGRACIÓN COMPLETA: Tablas para Entre Hilos
-- =====================================================

-- 1. SUSCRIPTORES (Newsletter)
CREATE TABLE suscriptores (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  activo BOOLEAN DEFAULT true,
  fuente TEXT DEFAULT 'newsletter'
);

-- 2. WISHLIST (Favoritos)
CREATE TABLE wishlist (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  usuario_id TEXT NOT NULL,
  producto_id TEXT NOT NULL,
  producto_nombre TEXT NOT NULL,
  producto_precio DECIMAL(10,2) NOT NULL,
  producto_imagen TEXT,
  UNIQUE(usuario_id, producto_id)
);

-- 3. PEDIDOS (Historial de pedidos realizados)
CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  usuario_id TEXT,
  cliente_nombre TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_email TEXT,
  direccion_envio TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  metodo_pago TEXT,
  notas TEXT
);

-- 4. MENSAJES CONTACTO
CREATE TABLE mensajes_contacto (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  asunto TEXT,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false
);

-- 5. DIRECCIONES ENVÍO
CREATE TABLE direcciones_envio (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  usuario_id TEXT,
  nombre_completo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  distrito TEXT,
  referencia TEXT,
  es_principal BOOLEAN DEFAULT false
);

-- 6. CARRITOS ABANDONADOS
CREATE TABLE carritos_abandonados (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  usuario_id TEXT,
  email TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  recuperado BOOLEAN DEFAULT false
);