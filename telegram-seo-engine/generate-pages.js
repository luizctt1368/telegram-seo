const fs = require("fs");
const path = require("path");

const config = {
  groupLink: "https://t.me/garimpodeofertas2",
  siteUrl: "https://SEU-SITE.netlify.app",
  siteName: "Garimpo de Ofertas no Telegram",
  brandName: "Garimpo de Ofertas",
  maxRelatedLinks: 6
};

function readList(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function escapeHtml(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatKeywordLabel(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function createMetaDescription({ base, store, product, keyword }) {
  return `Entre no grupo de Telegram com ${base} de ${product} na ${store}. Receba alertas, cupons e ofertas atualizadas para quem busca ${keyword}.`;
}

function buildFaq({ base, store, product }) {
  return [
    {
      question: `Como encontrar ${base} de ${product} na ${store}?`,
      answer: `A forma mais rápida é entrar no grupo e acompanhar os alertas publicados com frequência. Assim, você vê promoções, cupons e oportunidades relacionadas a ${product} na ${store} sem precisar pesquisar manualmente toda hora.`
    },
    {
      question: `Vale a pena entrar em um grupo de Telegram para ${product}?`,
      answer: `Sim. Um grupo focado em ${product} ajuda a centralizar links, descontos e avisos rápidos, o que pode facilitar a busca por boas condições de compra.`
    },
    {
      question: `O grupo publica apenas ${store}?`,
      answer: `Não necessariamente. O foco principal desta página é ${store}, mas o canal pode reunir oportunidades de várias lojas, sempre com destaque para promoções relevantes.`
    }
  ];
}

function buildJsonLd({ title, description, canonicalUrl, faq }) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: title,
          description,
          url: canonicalUrl
        },
        {
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }
      ]
    },
    null,
    0
  );
}

function buildPageHtml({ title, description, canonicalUrl, keyword, base, store, product, relatedPages }) {
  const faq = buildFaq({ base, store, product });
  const faqHtml = faq
    .map(
      (item) => `
        <div class="faq-item">
          <h3>${escapeHtml(item.question)}</h3>
          <p>${escapeHtml(item.answer)}</p>
        </div>`
    )
    .join("\n");

  const relatedHtml = relatedPages.length
    ? `<ul class="related-links">${relatedPages
        .map(
          (item) => `<li><a href="/${escapeHtml(item.slug)}.html">${escapeHtml(item.label)}</a></li>`
        )
        .join("")}</ul>`
    : "<p>Mais páginas em breve.</p>";

  const jsonLd = buildJsonLd({ title, description, canonicalUrl, faq });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:site_name" content="${escapeHtml(config.siteName)}">
  <meta name="twitter:card" content="summary_large_image">
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; margin: 0; color: #111827; background: #f8fafc; line-height: 1.6; }
    .container { max-width: 920px; margin: 0 auto; padding: 24px; }
    .hero, .card { background: #ffffff; border-radius: 18px; padding: 28px; box-shadow: 0 10px 30px rgba(15,23,42,.07); margin-bottom: 20px; }
    h1, h2, h3 { line-height: 1.2; color: #0f172a; }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #dbeafe; color: #1d4ed8; font-size: 14px; margin-bottom: 10px; }
    .cta { display: inline-block; padding: 14px 22px; background: #16a34a; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; }
    .muted { color: #475569; }
    ul { padding-left: 20px; }
    .related-links li { margin-bottom: 8px; }
    footer { color: #64748b; font-size: 14px; padding: 6px 0 24px; }
    a { color: #0f766e; }
  </style>
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <main class="container">
    <section class="hero">
      <div class="badge">Página otimizada para buscas</div>
      <h1>${escapeHtml(title)}</h1>
      <p class="muted">${escapeHtml(description)}</p>
      <p>Se você procura <strong>${escapeHtml(keyword)}</strong>, esta página reúne uma forma prática de acompanhar ofertas e cupons em tempo real pelo Telegram. Em vez de pesquisar manualmente em vários sites, você pode acompanhar novidades, oportunidades e alertas em um único lugar.</p>
      <p><a class="cta" href="${escapeHtml(config.groupLink)}" rel="nofollow sponsored">Entrar no grupo do Telegram</a></p>
    </section>

    <section class="card">
      <h2>O que você encontra</h2>
      <ul>
        <li>Alertas de ${escapeHtml(base)} relacionados a ${escapeHtml(product)}.</li>
        <li>Links e oportunidades envolvendo ${escapeHtml(store)} e outras grandes lojas.</li>
        <li>Atualizações rápidas para quem quer economizar em compras online.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Por que acompanhar pelo Telegram</h2>
      <p>Quem busca ${escapeHtml(product)} costuma perder bons preços por falta de timing. Um grupo no Telegram ajuda a receber novidades com mais agilidade, o que é útil especialmente em campanhas relâmpago, cupons limitados e mudanças rápidas de preço.</p>
      <p>Além disso, páginas como esta ajudam a organizar temas de busca específicos, conectando usuários interessados em ${escapeHtml(base)} de ${escapeHtml(product)} na ${escapeHtml(store)}.</p>
    </section>

    <section class="card">
      <h2>Perguntas frequentes</h2>
      ${faqHtml}
    </section>

    <section class="card">
      <h2>Mais páginas relacionadas</h2>
      ${relatedHtml}
    </section>

    <footer>
      <p>${escapeHtml(config.brandName)} • Página gerada automaticamente com foco em estrutura, sitemap e organização de conteúdo.</p>
    </footer>
  </main>
</body>
</html>`;
}

const rootDir = __dirname;
const siteDir = path.join(rootDir, "site");
ensureDir(siteDir);

const keywordsPath = path.join(rootDir, "keywords.txt");
if (!fs.existsSync(keywordsPath)) {
  const generatorPath = path.join(rootDir, "generate-keywords.js");
  require(generatorPath);
}

const keywords = readList(keywordsPath);
const baseList = readList(path.join(rootDir, "data", "base.txt"));
const storeList = readList(path.join(rootDir, "data", "stores.txt"));
const productList = readList(path.join(rootDir, "data", "products.txt"));

const pageEntries = [];

for (const keyword of keywords) {
  const parts = keyword.replace(/^grupo telegram\s+/i, "").trim();
  const matchedBase = baseList.find((item) => parts.startsWith(item));
  if (!matchedBase) continue;

  const remainingAfterBase = parts.slice(matchedBase.length).trim();
  const matchedStore = [...storeList].sort((a, b) => b.length - a.length).find((item) => remainingAfterBase.endsWith(item));
  if (!matchedStore) continue;

  const matchedProduct = remainingAfterBase.slice(0, remainingAfterBase.length - matchedStore.length).trim();
  if (!productList.includes(matchedProduct)) continue;

  const label = formatKeywordLabel(keyword);
  const slug = slugify(keyword);
  pageEntries.push({
    keyword,
    label,
    slug,
    base: matchedBase,
    store: matchedStore,
    product: matchedProduct,
    fileName: `${slug}.html`,
    url: `${config.siteUrl.replace(/\/$/, "")}/${slug}.html`
  });
}

for (const page of pageEntries) {
  const relatedPages = pageEntries
    .filter((item) => item.slug !== page.slug && (item.product === page.product || item.store === page.store || item.base === page.base))
    .slice(0, config.maxRelatedLinks)
    .map((item) => ({ slug: item.slug, label: item.label }));

  const title = `${page.label} | ${config.brandName}`;
  const description = createMetaDescription(page);
  const html = buildPageHtml({
    title,
    description,
    canonicalUrl: page.url,
    keyword: page.keyword,
    base: page.base,
    store: page.store,
    product: page.product,
    relatedPages
  });

  fs.writeFileSync(path.join(siteDir, page.fileName), html, "utf8");
}

const homeCards = pageEntries
  .slice(0, 24)
  .map(
    (page) => `<li><a href="/${escapeHtml(page.fileName)}">${escapeHtml(page.label)}</a></li>`
  )
  .join("\n");

const homeHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(config.siteName)}</title>
  <meta name="description" content="Portal com páginas organizadas para promoções, cupons e ofertas, com acesso ao grupo do Telegram.">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${escapeHtml(config.siteUrl.replace(/\/$/, ""))}/">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #f8fafc; margin: 0; color: #111827; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .box { background: #fff; border-radius: 18px; padding: 28px; box-shadow: 0 10px 30px rgba(15,23,42,.07); margin: 18px 0; }
    .cta { display: inline-block; padding: 14px 22px; background: #16a34a; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <main class="container">
    <section class="box">
      <h1>${escapeHtml(config.siteName)}</h1>
      <p>Este site reúne páginas organizadas por tema para ajudar usuários a encontrar promoções, cupons e ofertas por categoria e loja.</p>
      <p><a class="cta" href="${escapeHtml(config.groupLink)}" rel="nofollow sponsored">Entrar no grupo do Telegram</a></p>
    </section>
    <section class="box">
      <h2>Páginas em destaque</h2>
      <ul>
        ${homeCards}
      </ul>
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(siteDir, "index.html"), homeHtml, "utf8");

const today = new Date().toISOString();
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.siteUrl.replace(/\/$/, "")}/</loc>
    <lastmod>${today}</lastmod>
  </url>
${pageEntries
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.join(siteDir, "sitemap.xml"), sitemapXml, "utf8");

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${config.siteUrl.replace(/\/$/, "")}/sitemap.xml
`;
fs.writeFileSync(path.join(siteDir, "robots.txt"), robotsTxt, "utf8");

console.log(`Páginas geradas: ${pageEntries.length}`);
console.log(`Arquivos salvos em: ${siteDir}`);
console.log("Lembre-se de editar config.siteUrl em generate-pages.js antes de publicar.");
