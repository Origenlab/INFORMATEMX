// ============================================================================
// blogImages.ts — Imágenes ILUSTRATIVAS del blog (pendientes de arte real).
// ----------------------------------------------------------------------------
// Los artículos referencian un heroImage bajo /images/articulos/ que aún no
// existe como archivo (fotos pendientes — no bloquea el build, son strings).
// `blogImage(id, heroImage)` devuelve SIEMPRE el heroImage del frontmatter: cada
// artículo declara su propia ruta. El helper se mantiene por compatibilidad con
// las páginas del blog que lo importan; cuando llegue el arte real, basta con
// colocar el archivo en la ruta del frontmatter.
// ============================================================================

/** Devuelve el heroImage declarado por el artículo (ruta bajo /images/articulos/). */
export function blogImage(_id: string, heroImage?: string): string {
  return heroImage ?? '/images/articulos/portada-informate-mx.avif'
}
