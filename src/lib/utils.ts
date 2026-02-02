/**
 * Convierte un texto en un slug amigable para URLs
 * Ejemplo: "Ramo de Flores Rojas" -> "ramo-de-flores-rojas"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-'); // Reemplazar múltiples guiones por uno solo
}

/**
 * Convierte un slug de vuelta a texto legible (aproximado)
 * Ejemplo: "ramo-de-flores-rojas" -> "Ramo De Flores Rojas"
 */
export function unslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
