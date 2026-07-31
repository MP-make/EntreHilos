-- ============================================================
-- MIGRACIÓN 011: Copiar imágenes de hero_config a eventos
-- ============================================================

UPDATE public.eventos e
SET imagen_url = h.imagen_url
FROM public.hero_config h
WHERE h.clave = 'evento_' || replace(e.slug, '-', '_')
  AND h.imagen_url IS NOT NULL AND h.imagen_url != '';
