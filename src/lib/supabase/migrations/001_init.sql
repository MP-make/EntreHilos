-- ============================================================
-- MIGRACIÓN INICIAL — ENTRE HILOS
-- ============================================================

-- 1. PEDIDOS PERSONALIZADOS
-- Almacena solicitudes de pedidos personalizados con seguimiento de estado
CREATE TABLE IF NOT EXISTS pedidos_personalizados (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Datos del cliente
  nombre_cliente TEXT NOT NULL,
  telefono       TEXT NOT NULL,
  email          TEXT,

  -- Referencia al producto base (opcional)
  producto_id   TEXT,
  producto_nombre TEXT,
  producto_precio NUMERIC(10,2),

  -- Detalles del pedido
  detalles      TEXT NOT NULL,
  colores       TEXT,
  tamano        TEXT,
  extras        TEXT,
  fecha_entrega DATE NOT NULL,

  -- Estado del pedido
  estado        TEXT NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente','confirmado','en_produccion','listo','entregado','cancelado'))
);

-- Índice para filtrar por estado
CREATE INDEX idx_pedidos_estado ON pedidos_personalizados (estado);
-- Índice para búsqueda por teléfono
CREATE INDEX idx_pedidos_telefono ON pedidos_personalizados (telefono);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pedidos_updated_at
  BEFORE UPDATE ON pedidos_personalizados
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. LIBRO DE RECLAMACIONES
-- Registro obligatorio según Ley 29571 (Código de Protección al Consumidor)
CREATE TABLE IF NOT EXISTS libro_reclamaciones (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Tipo
  tipo            TEXT NOT NULL CHECK (tipo IN ('reclamo','queja')),

  -- Datos del consumidor
  nombre_completo  TEXT NOT NULL,
  tipo_documento   TEXT NOT NULL DEFAULT 'DNI'
                   CHECK (tipo_documento IN ('DNI','CE','Pasaporte')),
  numero_documento TEXT NOT NULL,
  telefono         TEXT NOT NULL,
  email            TEXT NOT NULL,
  direccion        TEXT NOT NULL,

  -- Detalle del reclamo/queja
  producto_servicio TEXT NOT NULL,
  monto            NUMERIC(10,2) NOT NULL,
  pedido_id        TEXT,
  detalle          TEXT NOT NULL
);

-- Índice para búsqueda por documento
CREATE INDEX idx_reclamaciones_documento ON libro_reclamaciones (numero_documento);
-- Índice por fecha
CREATE INDEX idx_reclamaciones_created_at ON libro_reclamaciones (created_at);

-- 3. SUSCRIPTORES NEWSLETTER
CREATE TABLE IF NOT EXISTS suscriptores (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email      TEXT NOT NULL UNIQUE,
  nombre     TEXT,
  activo     BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_suscriptores_email ON suscriptores (email);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Permitir inserts desde el cliente anónimo, solo lectura para admin
-- ============================================================

-- Pedidos personalizados: cualquiera puede insertar, solo autenticados pueden leer
ALTER TABLE pedidos_personalizados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar pedidos personalizados anónimo"
  ON pedidos_personalizados FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Leer pedidos personalizados solo autenticados"
  ON pedidos_personalizados FOR SELECT
  TO authenticated
  USING (true);

-- Libro de reclamaciones: cualquiera puede insertar, solo autenticados pueden leer
ALTER TABLE libro_reclamaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar reclamos anónimo"
  ON libro_reclamaciones FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Leer reclamos solo autenticados"
  ON libro_reclamaciones FOR SELECT
  TO authenticated
  USING (true);

-- Suscriptores: cualquiera puede insertar, solo autenticados pueden leer
ALTER TABLE suscriptores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar suscriptores anónimo"
  ON suscriptores FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Leer suscriptores solo autenticados"
  ON suscriptores FOR SELECT
  TO authenticated
  USING (true);
