-- ============================================================
-- MIGRACIÓN 017: FOTOS DE CAMPAÑA PARA EVENTOS
-- ============================================================

ALTER TABLE public.eventos
  ADD COLUMN IF NOT EXISTS fotos_campana JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.eventos.fotos_campana IS 'Fotos reales de clientes y entregas para el carrusel rotonda en la portada';
