-- ============================================================
-- MIGRACIÓN 013: PRODUCTOS INACTIVOS (ocultar productos de Ventify)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.productos_inactivos (
  producto_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.productos_inactivos IS 'Productos de Ventify ocultos de la web';

ALTER TABLE public.productos_inactivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access productos_inactivos"
  ON public.productos_inactivos
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read productos_inactivos"
  ON public.productos_inactivos FOR SELECT
  USING (true);
