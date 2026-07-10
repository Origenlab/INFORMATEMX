# CHANGELOG SEO — informate.mx — 2026-07-10

SOP Prompt Maestro SEO (alcance TÉCNICO) sobre INFORMATEMX (Astro 6, deploy.yml → Cloudflare Pages `informate-mx`). Sitio migrado de HTML legacy en Ola 1 de migraciones (2026-06-22); generado desde template EJEMPLOS.

## ⚠️ HALLAZGO CRÍTICO DE DEPLOY (requiere acción manual)

1. **El dominio `informate.mx` está CAÍDO: sirve un 404 de GitHub Pages** (`x-github-request-id` en headers), mientras el build real vive en `informate-mx.pages.dev` (200). El dominio NUNCA está adjunto al proyecto CF Pages → ningún deploy llega al dominio (patrón MEDEDUL, Lecciones Ola 1, agravado: aquí ni siquiera hay sitio congelado, hay 404).
2. **La GitHub Action NUNCA ha deployado**: el repo NO tiene el secret `CLOUDFLARE_API_TOKEN` (`gh secret list` vacío; los 2 runs históricos fallaron en el step de deploy). El contenido actual de pages.dev es un deploy manual de la migración (2026-06-23, stale). El token NO está en disco a propósito (decisión de seguridad de `setup-cf-secrets.sh`: prompt oculto) y el OAuth de wrangler en la Mac está vencido (400 al refrescar) → imposible automatizar hoy.

## Cambios aplicados (commit `e9ae9b1` + commit del 404/changelog)

| Área | Cambio |
|------|--------|
| OG default | Generado `public/images/og/default.png` REAL (1200×630, PIL): el head de las 12 páginas referenciaba un archivo inexistente (og:image 404 sitewide). Wordmark + tagline reales de site.ts, paleta índigo real del sitio (#5b3df5→#3f28c2). Arte definitivo pendiente. |
| Guardia og 404 | `lib/seo.ts ogImagePath()`: si la imagen og local no existe en `public/` en build → cae al default real. Aplica a `buildMeta` y al nodo `Article` (el artículo apuntaba a `/images/articulos/origins-private-security-seguridad-cdmx.avif`, inexistente y en formato no-OG). |
| og:image:type | `BaseLayout` emite `og:image:type` HONESTO derivado de la extensión real (antes ausente). |
| Logo schema | El ImageObject de Organization apuntaba a `/images/brand/logo.svg` que nunca existió → generado `logo.png` wordmark (800×208) + `site.ts` actualizado + width/height reales en el nodo (patrón EVENTECH). |
| JSON-LD | `contactPoint` ya no emite `telephone: ""` (vacío = ruido; un medio sin teléfono público no declara el campo — no se inventó NAP). |
| Sitemap lastmod | Antes se omitía por completo → resolver dinámico URL→archivo→`git log -1 --format=%cI` (patrón EVENTECH), fallback mtime, rutas dinámicas sin fuente se omiten (honesto). `deploy.yml` con `fetch-depth: 0` (sin historial completo, git log daría la fecha del HEAD a todo). Nota: hoy casi todas las fechas = 2026-06-22 por ser repo de 2 commits (fechas git REALES, caso benigno de Lecciones Ola 2). |
| 404 real | Nuevo `src/pages/404.astro` (noindex): SIN `dist/404.html`, Cloudflare Pages responde la HOME con HTTP 200 a CUALQUIER ruta inexistente (soft-404 masivo, verificado en pages.dev: hasta las "imágenes" 404 devolvían HTML 200). |
| Enlaces internos 404 | `blog/categoria/[...categoria].astro` ahora construye TAXONOMY ∪ categorías usadas: el Header/Home/Footer enlazan las 4 secciones pero solo `empresas` se construía → `/blog/categoria/{emprendimiento,tecnologia,economia}` daban 404 en todo el sitio. Las 3 nuevas muestran su estado vacío ("0 artículos"). |
| www | `public/_redirects` www→apex 301 (aplicará cuando el dominio esté adjunto al proyecto Pages). Hoy www ya responde 301 al apex a nivel zona CF. |

## Validación (dist post-fix; live NO verificable — ver crítico)

- `astro check`: 0 errores (37 hints preexistentes). Build verde: 16 páginas (12 → +3 categorías +404).
- Validador dist/: og:image único = `default.png` EXISTENTE; 0 og .avif/.webp; 0 og rotos; `og:image:type` 15/15 indexables; BreadcrumbList home=0 y resto=1; 0 Product sueltos; logo con width/height; sitemap 15 URLs con 8 lastmod reales (dinámicas omitidas).
- **Live**: pages.dev sirve el build STALE pre-fix (sitemap sin lastmod, soft-404). No hay forma de deployar sin el secret/token (ver pendientes). El dominio apex sigue 404 GH Pages.

## NO aplicado (con razón)

- **Imágenes de contenido visibles** (4 tarjetas de sección en home + hero del artículo, `.avif` inexistentes): son ARTE del sitio, no metadatos — generarlas sería inventar diseño/contenido (el repo las declara "fotos pendientes"). El og/schema ya no depende de ellas (guardia). `gen-placeholders.mjs` del repo NO aplica: su manifiesto es del sector contra-incendio.
- **Favicons del template** (icono "O" rojo de Ejemplos.mx, `aria-label="Ejemplos.mx"`): anotado, no rediseñar (Lecciones Ola 2-d).
- **Tag con espacio** `/blog/tag/seguridad%20privada`: cambiar el slug altera URLs publicadas — mejora futura (slugificar tags).
- **Título del artículo** cortado en stopword ("…privada en", cap 60 de formatTitle): cosmético, es copy — no tocar.
- `["Service","Product"]` híbridos: N/A (sitio editorial, no emite Service/Product).

## Pendientes manuales (dashboard / humano) — EN ORDEN

1. **Secret del CI**: correr `bash ORIGENLAB/_tools/setup-cf-secrets.sh` (INFORMATEMX ya está en su lista) o `gh secret set CLOUDFLARE_API_TOKEN --repo Frankoropeza/INFORMATEMX`; luego `gh run rerun --repo Frankoropeza/INFORMATEMX <último-run>` (o push vacío) y verificar verde.
2. **Adjuntar dominio al proyecto Pages** (Cloudflare dashboard → Workers & Pages → `informate-mx` → Custom domains): añadir `informate.mx` y `www.informate.mx` (CF ajusta el DNS de la zona; hoy el apex apunta al origen GH Pages muerto). Sin esto el dominio sigue en 404 aunque el CI quede verde.
3. **Redirect Rule** www→apex en el dashboard si www no se adjunta al proyecto (el `_redirects` solo aplica a hosts adjuntos).
4. Verificación post-cutover: `curl -sI https://informate.mx/` (200 CF Pages, sin `x-github-request-id`), og default 200 `image/png`, sitemap con lastmod, `/ruta-inexistente` → 404 real.
5. Arte real: og default y logo definitivos, heroImage del artículo, 4 imágenes de sección, favicons propios.

## Feedback al prompt maestro

- El SOP asume que la Action puede quedar verde con un repush: aquí el rojo es por **secret inexistente** (infra pre-existente), no por código — conviene chequear `gh secret list` + historial de runs en FASE 0 (drift de deploy) antes de prometer gate verde.
- Nuevo sub-caso de "dominio ≠ pages.dev" (Ola 1): apex sirviendo **404 crudo de GH Pages** (ni sitio congelado). Detectable en FASE 0 paso 4 con el apex, no solo www.
- Sub-caso nuevo de soft-404 (Ola 2): sitios EJEMPLOS **sin `404.astro`** → CF Pages en SPA-fallback responde 200-HTML a todo (incluidas imágenes). Chequeo propuesto para FASE 0: `curl -sI <pages.dev>/ruta-inexistente-xyz` esperando 404.
