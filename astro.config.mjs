// astro.config.mjs — config Astro 6 SSG. Canónico: PROYECTORED/astro.config.mjs + MESECI (trailingSlash:'never')
// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// ─── Sitemap lastmod dinámico (patrón EVENTECH · SEO Maestro 2026-07-10) ────
// Resuelve URL → archivo fuente → fecha REAL (git log → mtime → omitir).
// Mejor omitir lastmod que mentir con new Date() del build (Google descarta la
// señal si todas las fechas cambian en cada deploy). Requiere fetch-depth: 0 en
// el checkout del workflow: sin historial completo, git log devuelve la fecha
// del HEAD para todo (verificado en piloto EVENTECH).
const ROOT = dirname(fileURLToPath(import.meta.url));
const _dateCache = new Map();

/** @param {string} relPath */
function sourceDate(relPath) {
  if (_dateCache.has(relPath)) return _dateCache.get(relPath);
  let date = null;
  const abs = join(ROOT, relPath);
  if (existsSync(abs)) {
    try {
      const out = execSync(`git log -1 --format=%cI -- "${relPath}"`, {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (out) date = new Date(out);
    } catch {}
    if (!date) {
      try {
        date = statSync(abs).mtime;
      } catch {}
    }
  }
  _dateCache.set(relPath, date);
  return date;
}

/** @param {string} url */
function lastmodForUrl(url) {
  const path = new URL(url).pathname.replace(/\/+$/, '');
  const rel = path === '' ? 'index' : path.replace(/^\//, '');
  const last = rel.split('/').pop();
  const candidates = [
    `src/pages/${rel}/index.astro`,
    `src/pages/${rel}.astro`,
    `src/pages/${rel}/index.md`,
  ];
  // Colección `articulos` (blog editorial): /blog/<id> → src/content/articulos/<id>.mdx
  if (rel.startsWith('blog/')) {
    const sub = rel.slice('blog/'.length);
    for (const ext of ['mdx', 'md']) {
      candidates.push(`src/content/articulos/${sub}.${ext}`);
      candidates.push(`src/content/articulos/${sub}/index.${ext}`);
      candidates.push(`src/content/articulos/${last}.${ext}`);
    }
  }
  for (const c of candidates) {
    const d = sourceDate(c);
    if (d) return d;
  }
  return null; // rutas dinámicas (categoría/tag/paginación) → sin lastmod (honesto)
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH ALIASES (resolve.alias) — DEBEN coincidir con compilerOptions.paths de
// tsconfig.json. tsconfig resuelve los tipos; Vite/Rollup resuelve el bundle en
// build. Sin esto, los layouts/páginas que importan "@components/*" compilan en
// el editor pero REVIENTAN en `astro build` (Could not resolve). Los alias hacen
// que los imports funcionen a cualquier profundidad de ruta (no más ../../).
// ─────────────────────────────────────────────────────────────────────────────
/** @param {string} p */
const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// ─────────────────────────────────────────────────────────────────────────────
// Opciones de sitemap. Origen del patrón: PROYECTORED (filter + serialize con
// prioridades por sección). Política canónica B5: trailingSlash 'never' + site
// correcto → canonical normalizado. Ajusta el regex de categorías a los slugs
// reales del cliente (deben coincidir con TAXONOMY en src/config/site.ts).
// ─────────────────────────────────────────────────────────────────────────────
/** @type {import('@astrojs/sitemap').SitemapOptions} */
const sitemapOptions = {
  // Excluye rutas internas, drafts y páginas que no deben indexarse.
  filter: (page) =>
    !page.includes('/404') &&
    !page.includes('/_') &&
    !page.includes('/admin') &&
    // Andamiaje de la plantilla-guía: NO debe entrar al sitemap de un sitio
    // cliente (diluye autoridad temática y desperdicia crawl budget). new-site.mjs
    // además borra estos árboles al generar un cliente. Ver docs/AUDITORIA-INTEGRAL.
    !page.includes('/modulos') &&
    !page.includes('/niveles') &&
    !page.includes('/blog/anatomia') &&
    !page.includes('/productos/guia'),

  // Prioridades por tipo de página: home y categorías empujan más que fichas.
  serialize(item) {
    const url = item.url;

    // Home
    if (url === 'https://informate.mx/') {
      item.priority = 1.0;
      item.changefreq = /** @type {any} */ ('weekly');
    }
    // Landing de categoría (L2) — reemplaza con los slugs reales del cliente.
    else if (/\/(productos|servicios|blog|zonas)\/?$/.test(url)) {
      item.priority = 0.9;
      item.changefreq = /** @type {any} */ ('monthly');
    }
    // Fichas internas (L3/L4): producto/servicio/zona individual.
    else if (/\/(productos|servicios|blog|zonas)\/[^/]+\/?$/.test(url)) {
      item.priority = 0.8;
      item.changefreq = /** @type {any} */ ('monthly');
    }
    // Blog
    else if (url.includes('/blog/')) {
      item.priority = 0.6;
      item.changefreq = /** @type {any} */ ('monthly');
    }
    // Resto (contacto, nosotros, etc.)
    else {
      item.priority = 0.7;
      item.changefreq = /** @type {any} */ ('monthly');
    }

    // lastmod REAL por archivo fuente (git log -1). Antes se omitía a propósito
    // (new Date() en cada build = señal no confiable — PROYECTORED); el resolver
    // da la fecha real del último commit que tocó la página, y si la URL no se
    // resuelve a un archivo (categoría/tag dinámicos) se sigue omitiendo.
    const lm = lastmodForUrl(url);
    if (lm) {
      item.lastmod = lm.toISOString();
    } else {
      delete item.lastmod;
    }
    return item;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Config canónica del Master System: Astro 6 SSG, salida estática, sitemap +
// mdx como integraciones base (A3). mdx es OBLIGATORIO porque el blog vive en
// colección .mdx (content.config.ts → `articulos`). Usa @astrojs/mdx@^6 (peer
// astro@^6.4); @astrojs/mdx@^4 ROMPE con astro@^6. NO agregar adapter: SSG (A1).
// Si el proyecto NO tiene blog .mdx, puedes quitar mdx() y la dep del package.json.
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  site: 'https://informate.mx', // URL canónica con protocolo, sin slash final.
  output: 'static',
  trailingSlash: 'never', // Canónico B5. Canonical normalizado sin slash final.

  integrations: [sitemap(sitemapOptions), mdx()],

  vite: {
    // cacheDir local: evita colisiones de permisos entre sesiones/worktrees.
    cacheDir: 'node_modules/.vite',
    resolve: {
      // Espejo EXACTO de tsconfig.json compilerOptions.paths (sin el /*).
      alias: {
        '@config': r('./src/config'),
        '@lib': r('./src/lib'),
        '@layouts': r('./src/layouts'),
        '@components': r('./src/components'),
        '@content': r('./src/content'),
      },
    },
  },
});
