// ============================================================================
// src/lib/blog.ts — Helpers del LISTADO del blog (paginación + sidebar).
// ----------------------------------------------------------------------------
// SITIO EDITORIAL (Infórmate.mx). Centraliza lo que comparten /blog (página 1) y
// /blog/pagina/<n> (resto): tamaño de página, etiquetas de sección y los datos
// del sidebar (secciones y temas con conteo, recientes, accesos al sitio).
// Todo se deriva de los artículos publicados (cero listas a mano).
// ============================================================================
import type { CollectionEntry } from 'astro:content'

/** Artículos por página del listado. */
export const PAGE_SIZE = 9

/** Slug de sección editorial (enum cerrado) → etiqueta legible. */
export const CAT_LABEL: Record<string, string> = {
  empresas: 'Empresas',
  emprendimiento: 'Emprendimiento',
  tecnologia: 'Tecnología',
  economia: 'Economía',
  general: 'General',
}

export type LinkCount = { label: string; href: string; count: number }
export type LinkDesc = { label: string; href: string; desc?: string }
export type SidebarData = {
  categorias: LinkCount[]
  temas: LinkCount[]
  posts: LinkDesc[]
  enlaces: LinkDesc[]
  cta: { label: string; href: string }
}

/**
 * Calcula los datos del sidebar a partir de TODOS los artículos (no de la página
 * actual): secciones y temas con conteo, 5 lecturas recientes, accesos fijos al
 * sitio y el CTA. Devuelve objetos planos (serializables por props).
 */
export function blogSidebarData(articulos: CollectionEntry<'articulos'>[]): SidebarData {
  // Secciones con conteo → /blog/categoria/<slug>
  const catCount = new Map<string, number>()
  for (const a of articulos) catCount.set(a.data.category, (catCount.get(a.data.category) ?? 0) + 1)
  const categorias = [...catCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug, count]) => ({ label: CAT_LABEL[slug] ?? slug, href: `/blog/categoria/${slug}`, count }))

  // Temas (tags) más usados → /blog/tag/<tag>
  const tagCount = new Map<string, number>()
  for (const a of articulos) for (const t of a.data.tags ?? []) tagCount.set(t, (tagCount.get(t) ?? 0) + 1)
  const temas = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([label, count]) => ({ label, href: `/blog/tag/${label}`, count }))

  // Lecturas recientes → 5 más recientes (asume articulos ordenado por fecha desc).
  const posts = articulos.slice(0, 5).map((a) => ({
    label: a.data.title,
    href: `/blog/${a.id}`,
    desc: CAT_LABEL[a.data.category] ?? a.data.category,
  }))

  // Accesos fijos al resto del sitio (editorial).
  const enlaces: LinkDesc[] = [
    { label: 'Inicio', href: '/', desc: 'Portada del portal' },
    { label: 'Nosotros', href: '/nosotros', desc: 'Qué es Infórmate' },
    { label: 'Contacto', href: '/contacto', desc: 'Escríbenos' },
  ]

  const cta = { label: 'Contáctanos', href: '/contacto' }

  return { categorias, temas, posts, enlaces, cta }
}
