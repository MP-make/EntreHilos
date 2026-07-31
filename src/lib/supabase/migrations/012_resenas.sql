-- ============================================================
-- MIGRACIÓN 012: RESEÑAS / CALIFICACIONES DE PRODUCTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resenas (
  id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  producto_id TEXT NOT NULL,
  producto_sku TEXT,
  producto_nombre TEXT,
  nombre_cliente TEXT NOT NULL,
  calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  aprobado BOOLEAN DEFAULT FALSE,
  es_manual BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT resenas_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE public.resenas IS 'Calificaciones y reseñas de productos';

CREATE INDEX IF NOT EXISTS idx_resenas_producto ON public.resenas (producto_id);
CREATE INDEX IF NOT EXISTS idx_resenas_aprobado ON public.resenas (aprobado);

ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access resenas"
  ON public.resenas
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read approved resenas"
  ON public.resenas FOR SELECT
  USING (aprobado = true);

CREATE POLICY "Public insert resenas"
  ON public.resenas FOR INSERT
  WITH CHECK (true);
