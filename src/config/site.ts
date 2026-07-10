// site.ts — SSoT (Single Source of Truth) del sitio editorial Infórmate.mx.
// ============================================================================
// SITIO EDITORIAL: portal de noticias, empresas y emprendimiento en México.
// NO es un negocio local: no vende productos/servicios ni atiende zonas, por eso
// SITE.business queda `undefined` (no se emite LocalBusiness) y TAXONOMY.services
// / .coverageStates / .sectors quedan vacíos. La navegación y las secciones son
// EDITORIALES (Empresas · Emprendimiento · Tecnología · Economía) y apuntan al
// blog (/blog y /blog/categoria/<slug>), que es el corazón del sitio.
//
// Datos de contacto REALES portados del legacy: correo + X (@informate_mx). NO
// hay teléfono ni domicilio reales (un medio digital sin sede pública) → se dejan
// vacíos a propósito; NUNCA se inventan (NAP PENDIENTE hasta tener datos reales).
// ============================================================================

// ── SITE — identidad de marca + SEO + organización ───────────────────────────
export const SITE = {
  name: 'Infórmate.mx', // Nombre comercial corto.
  brand: 'Infórmate', // Marca para títulos/footer/logo.
  tagline: 'Noticias, empresas y emprendimiento en México', // Frase corta (TopBar/Footer).
  domain: 'informate.mx', // Dominio sin protocolo.
  url: 'https://informate.mx', // URL canónica con protocolo, SIN slash final.
  lang: 'es-MX',
  locale: 'es-MX',
  description:
    'Portal de noticias de México: cubrimos actualidad económica, empresas y emprendimiento con información clara y verificable para mantenerte al día del país.', // 140–160 chars.
  defaultImage: '/images/og/default.png', // OG default 1200×630 (pendiente de arte real).

  trailingSlash: 'never' as 'never' | 'always',
  searchUrl: undefined as string | undefined,
  allowSelfReviews: false,

  seo: {
    title: 'Noticias México | empresas | emprendimiento', // ≤60 chars.
    description:
      'Noticias de México sobre actualidad económica, empresas y emprendimiento. Información clara y verificable para entender lo que pasa en el país.',
    image: '/images/og/default.png',
    titleMaxLength: 60,
    descriptionMaxLength: 160,
    appendBrand: false,
  },

  // social: redes para JSON-LD sameAs + twitter:site. Vacío = se omite.
  // Real del legacy: X/Twitter @informate_mx. Resto sin perfil verificable → undefined.
  social: {
    twitter: '@informate_mx',
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
    linkedin: undefined as string | undefined,
    youtube: undefined as string | undefined,
  },

  // organization: entidad publisher (JSON-LD Organization). Es la entidad raíz por @id.
  organization: {
    name: 'Infórmate.mx',
    legalName: 'Infórmate.mx',
    // Wordmark PNG real generado 2026-07-10 (el logo.svg referenciado nunca
    // existió como archivo → el ImageObject del schema daba 404). Placeholder
    // técnico honesto: wordmark en paleta del sitio; sustituir por arte final.
    logo: '/images/brand/logo.png',
    logoWidth: 800, // px reales del PNG (los consume el ImageObject del schema).
    logoHeight: 208,
    foundingDate: '2025', // Año declarado por el sitio (© 2025 en el legacy).
    sameAs: ['https://x.com/informate_mx'] as string[], // perfil real del legacy.
  },

  // business: UNDEFINED a propósito → un medio editorial no es LocalBusiness.
  // buildSchema() omite el nodo LocalBusiness cuando esto es undefined (lib/seo.ts).
  business: undefined as undefined,
} as const;

// ── KEYWORDS — las 3 palabras clave del sitio (keyword-first) ─────────────────
//   kw1 = PRINCIPAL · kw2 = SECUNDARIA · kw3 = VARIANTE/long-tail.
export const KEYWORDS = [
  'noticias méxico',   // kw1 · principal
  'empresas méxico',   // kw2 · secundaria
  'emprendimiento',    // kw3 · variante / long-tail
] as const;

// ── CONTACT — canales reales del medio (sin NAP físico) ──────────────────────
// PENDIENTE: no hay teléfono ni domicilio reales de un medio digital → se dejan
// vacíos (no se inventan). Si en el futuro hay datos verificables, llénalos aquí.
export const CONTACT = {
  phone: '', // sin teléfono público (PENDIENTE).
  phoneE164: '', // sin teléfono (PENDIENTE).
  phoneRaw: '', // lo consumen componentes/JSON-LD; vacío → no se publica número.
  whatsapp: '', // sin WhatsApp (medio editorial).
  email: 'contacto@informate.mx', // correo de contacto editorial.
  street: '', // sin domicilio público (PENDIENTE).
  city: 'Ciudad de México',
  state: 'CDMX',
  postalCode: '',
  country: 'MX',
  geo: {
    lat: 19.4326,
    lng: -99.1332,
  },
  hours: {
    weekdays: 'Redacción activa de lunes a viernes',
    saturday: '',
    sunday: '',
    display: 'Actualidad de México, todos los días',
  },
  schedule: {
    display: 'Actualidad de México, todos los días',
    weekdays: '',
    saturday: '',
    sunday: '',
  },
} as const;

// ── TAXONOMY — SECCIONES EDITORIALES (no catálogo) ───────────────────────────
// `categories` son las SECCIONES del medio; su `slug` coincide con el enum
// ARTICLE_CATEGORIES de src/content.config.ts y el `href` apunta al archivo de
// sección del blog (/blog/categoria/<slug>). services/sectors/coverageStates van
// VACÍOS: un medio editorial no tiene servicios, sectores comerciales ni zonas.
export const TAXONOMY = {
  categories: [
    { slug: 'empresas', label: 'Empresas', badge: undefined, href: '/blog/categoria/empresas' },
    { slug: 'emprendimiento', label: 'Emprendimiento', badge: undefined, href: '/blog/categoria/emprendimiento' },
    { slug: 'tecnologia', label: 'Tecnología', badge: undefined, href: '/blog/categoria/tecnologia' },
    { slug: 'economia', label: 'Economía', badge: undefined, href: '/blog/categoria/economia' },
  ],
  services: [] as readonly { id: string; label: string; desc: string }[],
  sectors: [] as readonly { slug: string; label: string }[],
  coverageStates: [] as readonly { slug: string; label: string; type: 'operativo' | 'comercial' }[],
} as const;

// ── Alias planos de TAXONOMY — contrato de componentes (Header/Footer) ───────
export const PRODUCT_CATEGORIES = TAXONOMY.categories;
export const SERVICES = TAXONOMY.services;
export const SECTORS = TAXONOMY.sectors;
export const COVERAGE_STATES = TAXONOMY.coverageStates;

export type ProductCategory = (typeof TAXONOMY.categories)[number];
export type Service = (typeof TAXONOMY.services)[number];
export type Sector = (typeof TAXONOMY.sectors)[number];
export type CoverageState = (typeof TAXONOMY.coverageStates)[number];

// ── NAV — menú principal del Header (FUENTE ÚNICA: escritorio + móvil) ────────
// Secciones EDITORIALES. El dropdown «Secciones» lista las categorías reales
// (archivos de sección del blog). Blog = listado completo; Nosotros y Contacto
// son enlaces directos.
export type NavLink = { label: string; href: string; desc?: string };
export type NavItem = {
  label: string;
  href: string;
  panel?: 'mega' | 'dropdown';
  allLabel?: string;
  items?: readonly NavLink[];
};
export const NAV: readonly NavItem[] = [
  {
    label: 'Secciones',
    href: '/blog',
    panel: 'dropdown',
    allLabel: 'Ver todas las secciones',
    items: PRODUCT_CATEGORIES.map((c) => ({ label: c.label, href: c.href, desc: `Notas de ${c.label.toLowerCase()}` })),
  },
  { label: 'Empresas', href: '/blog/categoria/empresas' },
  { label: 'Emprendimiento', href: '/blog/categoria/emprendimiento' },
  { label: 'Tecnología', href: '/blog/categoria/tecnologia' },
  { label: 'Economía', href: '/blog/categoria/economia' },
  { label: 'Artículos', href: '/blog' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

// ── SHOWCASE — vitrina de SECCIONES de la home (cards) ───────────────────────
// En un medio editorial, la vitrina presenta las SECCIONES del portal (no
// productos). Cada tarjeta lleva al archivo de sección del blog. Sin cifras ni
// afirmaciones fabricadas: copy honesto que describe de qué trata cada sección.
export type ShowcaseSub = { label: string; href: string };
export type ShowcaseCategory = {
  slug: string;
  label: string;
  href: string;
  image: string;
  imageAlt: string;
  badge?: string;
  blurb: string;
  subcategories: readonly ShowcaseSub[];
  ctaLabel?: string;
};
export const SHOWCASE: readonly ShowcaseCategory[] = [
  {
    slug: 'empresas',
    label: 'Empresas',
    href: '/blog/categoria/empresas',
    image: '/images/articulos/seccion-empresas-mexico.avif',
    imageAlt: 'Sección de empresas de Infórmate.mx',
    badge: 'Negocios',
    blurb:
      'Perfiles y análisis de las empresas que mueven la economía de México: qué hacen, cómo crecen y qué retos enfrentan.',
    subcategories: [
      { label: 'Perfiles de empresa', href: '/blog/categoria/empresas' },
      { label: 'Análisis de mercado', href: '/blog/categoria/empresas' },
    ],
    ctaLabel: 'Ver sección',
  },
  {
    slug: 'emprendimiento',
    label: 'Emprendimiento',
    href: '/blog/categoria/emprendimiento',
    image: '/images/articulos/seccion-emprendimiento-mexico.avif',
    imageAlt: 'Sección de emprendimiento de Infórmate.mx',
    badge: 'Startups',
    blurb:
      'Historias, guías y recursos para quienes construyen un negocio en México: financiamiento, innovación y casos reales del ecosistema.',
    subcategories: [
      { label: 'Financiamiento', href: '/blog/categoria/emprendimiento' },
      { label: 'Ecosistema startup', href: '/blog/categoria/emprendimiento' },
    ],
    ctaLabel: 'Ver sección',
  },
  {
    slug: 'tecnologia',
    label: 'Tecnología',
    href: '/blog/categoria/tecnologia',
    image: '/images/articulos/seccion-tecnologia-mexico.avif',
    imageAlt: 'Sección de tecnología de Infórmate.mx',
    badge: 'Innovación',
    blurb:
      'Cómo la tecnología transforma a las empresas e industrias del país: innovación, digitalización y su impacto en el día a día.',
    subcategories: [
      { label: 'Transformación digital', href: '/blog/categoria/tecnologia' },
      { label: 'Innovación', href: '/blog/categoria/tecnologia' },
    ],
    ctaLabel: 'Ver sección',
  },
  {
    slug: 'economia',
    label: 'Economía',
    href: '/blog/categoria/economia',
    image: '/images/articulos/seccion-economia-mexico.avif',
    imageAlt: 'Sección de economía de Infórmate.mx',
    badge: 'Actualidad',
    blurb:
      'La coyuntura económica de México explicada con claridad: indicadores, inversión y los temas que afectan a empresas y personas.',
    subcategories: [
      { label: 'Indicadores', href: '/blog/categoria/economia' },
      { label: 'Inversión', href: '/blog/categoria/economia' },
    ],
    ctaLabel: 'Ver sección',
  },
];

// ── BRANCHES — sucursales (no aplica a un medio) ─────────────────────────────
export const BRANCHES: { label: string; address: string; mapsUrl?: string }[] = [];

// ── SOCIAL — perfiles en redes (fila de iconos del Footer) ───────────────────
// Solo perfiles REALES verificables. El legacy declara X/Twitter @informate_mx.
export type SocialNetwork = 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'x' | 'tiktok';
export const SOCIAL: { network: SocialNetwork; label: string; url: string }[] = [
  { network: 'x', label: 'X (Twitter)', url: 'https://x.com/informate_mx' },
];

// ── LEGAL — enlaces legales de la barra inferior del Footer ──────────────────
export const LEGAL: { label: string; href: string }[] = [
  { label: 'Aviso de privacidad', href: '/privacidad' },
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Política de cookies', href: '/cookies' },
  { label: 'Mapa del sitio', href: '/sitemap-index.xml' },
];

// ── WA_MESSAGES — mensajes pre-armados (conservados por compatibilidad) ───────
// Un medio editorial no usa WhatsApp comercial, pero varios componentes del
// motor importan WA_MESSAGES/waUrl(). Se mantienen definidos; los CTA de
// conversión del chrome se reorientaron a /contacto (ver Header/Footer/TopBar).
export const WA_MESSAGES = {
  default: 'Hola, tengo una consulta sobre Infórmate.mx.',
  cotizar: 'Hola, tengo una consulta sobre Infórmate.mx.',
  cotizacion: 'Hola, tengo una consulta sobre Infórmate.mx.',
  productos: 'Hola, tengo una consulta sobre una sección de Infórmate.mx.',
  servicios: 'Hola, tengo una consulta sobre Infórmate.mx.',
  blog: 'Hola, leí un artículo en Infórmate.mx y tengo una pregunta.',
  contacto: 'Hola, quiero ponerme en contacto con Infórmate.mx.',
  urgente: 'Hola, tengo una consulta urgente sobre Infórmate.mx.',
} as const;

// ── waUrl() — constructor de enlaces de WhatsApp (sin número → cae a /contacto) ─
// Si no hay número de WhatsApp (medio editorial), waUrl() devuelve '/contacto'
// en vez de un wa.me roto. Mantiene la firma para no tocar los componentes.
export function waUrl(_message: string = WA_MESSAGES.default): string {
  if (!CONTACT.whatsapp) return '/contacto';
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(_message)}`;
}

// ── telUrl() — constructor del enlace de llamada (sin teléfono → /contacto) ───
export function telUrl(): string {
  if (!CONTACT.phoneE164) return '/contacto';
  return `tel:${CONTACT.phoneE164}`;
}
