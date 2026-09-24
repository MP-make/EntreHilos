-- ============================================================
-- MIGRACIÓN 015: FECHAS Y BANNER HERO PARA EVENTOS
-- ============================================================

-- Agregar columnas de vigencia de fechas y banner móvil/hero a la tabla eventos
ALTER TABLE public.eventos
  ADD COLUMN IF NOT EXISTS fecha_inicio TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fecha_fin TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS imagen_url_mobile TEXT,
  ADD COLUMN IF NOT EXISTS mostrar_en_hero BOOLEAN DEFAULT TRUE;

COMMENT ON COLUMN public.eventos.fecha_inicio IS 'Fecha y hora en que inicia el evento y comienza a mostrarse';
COMMENT ON COLUMN public.eventos.fecha_fin IS 'Fecha y hora en que expira el evento y se oculta automáticamente del banner/hero y tienda';
COMMENT ON COLUMN public.eventos.imagen_url_mobile IS 'Imagen vertical/móvil para el banner principal (Hero)';
COMMENT ON COLUMN public.eventos.mostrar_en_hero IS 'Indica si este evento debe aparecer como slide en el Hero principal mientras esté vigente';

-- Actualizar política de lectura pública para considerar fechas activas
DROP POLICY IF EXISTS "Public read active eventos" ON public.eventos;
CREATE POLICY "Public read active eventos"
  ON public.eventos FOR SELECT
  USING (
    activo = true 
    AND (fecha_inicio IS NULL OR fecha_inicio <= NOW()) 
    AND (fecha_fin IS NULL OR fecha_fin >= NOW())
  );
