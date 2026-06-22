// content.config.ts — Content Collections (Zod .strict()).
// ============================================================================
// SITIO EDITORIAL (Infórmate.mx — portal de noticias, empresas y emprendimiento).
// A diferencia del template de negocio local, este sitio NO vende productos ni
// servicios ni atiende zonas: PUBLICA artículos. Por eso la ÚNICA colección viva
// es `articulos`. Se retiraron del export `productos`, `servicios`, `zonas` y
// `casos` (no aplican a un medio editorial); el motor del template las maneja
// vacías sin romper (getCollection → []), pero el contenido del sitio es el blog.
//
// REGLA DURA: CERO contenido fabricado (sin reseñas/estrellas/stats inventados).
// Si es editorial, NO se inventan artículos: se portan los reales del legacy.
// ============================================================================

import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Helpers reutilizables ────────────────────────────────────────────────────

// imagePath — imagen como ruta absoluta bajo /images/. No exige archivo en build.
const imagePath = z.string().regex(/^\/images\//, {
  message: 'La imagen debe ser una ruta absoluta bajo /images/ (ej. /images/articulos/foo.avif)',
});

// faqSchema — bloque FAQ reutilizable (FAQPage JSON-LD).
const faqSchema = z
  .array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  )
  .optional();

// seoSchema — campos SEO comunes. max(60)/max(160) por convención de títulos/meta.
const seoFields = {
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).max(15).optional(),
  noindex: z.boolean().default(false),
};

// ── Enums de taxonomía (CERRADOS) — secciones EDITORIALES reales del portal ───
// Sincronizados con TAXONOMY.categories de src/config/site.ts y con los slugs de
// /blog/categoria/<slug>. Son las secciones declaradas por el sitio legacy:
// Empresas · Emprendimiento · Tecnología · Economía (+ general como respaldo).
export const ARTICLE_CATEGORIES = [
  'empresas',
  'emprendimiento',
  'tecnologia',
  'economia',
  'general',
] as const;

// ── Colección: articulos (editorial) — SIEMPRE .mdx ──────────────────────────
// El corazón del sitio. Schema Article aguas abajo. REQUIERE @astrojs/mdx.
const articulos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articulos' }),
  schema: z
    .object({
      title: z.string().min(10).max(70), // ≤70 para SEO.
      description: z.string().min(70).max(160),
      category: z.enum(ARTICLE_CATEGORIES).default('general'), // enum cerrado.
      heroImage: imagePath, // imagen obligatoria (string; no exige archivo).
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Redacción Infórmate'),
      tags: z.array(z.string()).max(10).optional(),
      relatedPosts: z.array(reference('articulos')).optional(),
      faqs: faqSchema,
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...seoFields,
    })
    .strict(),
});

// ── Export ────────────────────────────────────────────────────────────────────
// Solo `articulos`: este es un sitio editorial. Las colecciones de negocio
// (productos/servicios/zonas/casos) se retiraron porque no aplican a un medio.
export const collections = {
  articulos,
};
