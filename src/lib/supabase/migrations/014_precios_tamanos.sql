-- ============================================================
-- MIGRACIÓN 014: PRECIOS POR TAMAÑO (personalizados / Amigu-)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.precios_tamanos (
  sku TEXT PRIMARY KEY,
  precio_pequeno NUMERIC(10,2),
  precio_mediano NUMERIC(10,2),
  precio_grande NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.precios_tamanos IS 'Precios de productos personalizados según tamaño (Pequeño=Costo, Mediano=Sugerido, Grande=Mínimo)';

ALTER TABLE public.precios_tamanos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access precios_tamanos"
  ON public.precios_tamanos
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read precios_tamanos"
  ON public.precios_tamanos FOR SELECT
  USING (true);
