const fs = require("fs");
const path = require("path");

const config = {
  groupLink: "https://t.me/garimpodeofertas2",
  siteUrl: "https://super-mochi-88e4dd.netlify.app",
  siteName: "Garimpo de Ofertas no Telegram",
  brandName: "Garimpo de Ofertas",
  maxRelatedLinks: 8
};

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readKeywords() {
  const filePath = path.join(__dirname, "keywords.txt");
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickRelatedPages(allPages, currentPage, max = 8) {
  const currentWords = new Set(currentPage.keyword.split(" "));
  const scored = allPages
    .filter((page) => page.slug !== currentPage.slug)
    .map((page) => {
      const words = page.keyword.split(" ");
      let score = 0;
      for (const w of words) {
        if (currentWords.has(w)) score += 1;
      }
      return { ...page, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, max);

  return scored;
}

function renderPage(page, relatedPages) {
  const title = `${page.keyword} | ${config.brandName}`;
  const description = `Entre no melhor ${page.keyword}. Receba promoções, cupons e descontos todos os dias no Telegram.`;
  const canonical = `${config.siteUrl}/${page.slug}.html`;

  const relatedLinks = relatedPages
    .map(
      (p) =>
        `<li><a href="/${p.slug}.html">${escapeHtml(
          p.keyword.charAt(0).toUpperCase() + p.keyword.slice(1)
        )}</a></li>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="robots" content="index,follow" />

  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:type" content="website" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": ${JSON.stringify(title)},
    "url": ${JSON.stringify(canonical)},
    "description": ${JSON.stringify(description)}
  }
  </script>

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 960px;
      margin: 0 auto;
      padding: 24px;
      line-height: 1.6;
      color: #222;
    }
    h1, h2, h3 {
      color: #111;
    }
    .cta {
      display: inline-block;
      padding: 14px 20px;
      background: #0088cc;
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 16px 0;
    }
    .box {
      background: #f5f7fb;
      padding: 16px;
      border-radius: 10px;
      margin: 20px 0;
    }
    ul {
      padding-left: 20px;
    }
    .grid-links li {
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(page.keyword.charAt(0).toUpperCase() + page.keyword.slice(1))}</h1>
    <p>Receba promoções, cupons e descontos atualizados no Telegram.</p>
    <a class="cta" href="${config.groupLink}" target="_blank" rel="noopener noreferrer">Entrar no grupo do Telegram</a>
  </header>

  <main>
    <section>
      <h2>Como funciona</h2>
      <p>
        O ${escapeHtml(config.siteName)} reúne oportunidades de compra, promoções diárias,
        descontos sazonais e ofertas relâmpago. Se você procura por <strong>${escapeHtml(
          page.keyword
        )}</strong>, este grupo foi feito para encontrar links úteis com rapidez.
      </p>
    </section>

    <section>
      <h2>O que você encontra</h2>
      <div class="box">
        <ul>
          <li>Promoções atualizadas ao longo do dia</li>
          <li>Cupons e descontos quando disponíveis</li>
          <li>Ofertas de lojas populares no Brasil</li>
          <li>Links rápidos para acompanhar as oportunidades</li>
        </ul>
      </div>
    </section>

    <section>
      <h2>Vale a pena entrar?</h2>
      <p>
        Sim, principalmente se você acompanha preços com frequência e quer receber
        novidades de forma simples. O grupo ajuda quem busca <strong>${escapeHtml(
          page.keyword
        )}</strong> com mais praticidade.
      </p>
    </section>

    <section>
      <h2>Páginas relacionadas</h2>
      <ul class="grid-links">
        ${relatedLinks}
      </ul>
    </section>

    <section>
      <h2>Perguntas frequentes</h2>
      <h3>O grupo é gratuito?</h3>
      <p>Sim, basta entrar pelo link do Telegram.</p>

      <h3>As ofertas são atualizadas com frequência?</h3>
      <p>Sim, a ideia do grupo é concentrar novidades e oportunidades ao longo do tempo.</p>

      <h3>Posso acompanhar promoções de diferentes lojas?</h3>
      <p>Sim, o grupo pode reunir promoções de várias categorias e lojas populares.</p>
    </section>

    <section>
      <a class="cta" href="${config.groupLink}" target="_blank" rel="noopener noreferrer">Quero entrar no grupo</a>
    </section>
  </main>
</body>
</html>`;
}

function renderHome(allPages) {
  const featured = allPages.slice(0, 30)
    .map((page) => `<li><a href="/${page.slug}.html">${escapeHtml(page.keyword)}</a></li>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.siteName}</title>
  <meta name="description" content="Grupo de promoções no Telegram com ofertas, cupons e descontos de várias lojas e categorias." />
  <link rel="canonical" href="${config.siteUrl}/" />
  <meta name="robots" content="index,follow" />
</head>
<body style="font-family: Arial, sans-serif; max-width: 960px; margin: 0 auto; padding: 24px; line-height: 1.6;">
  <h1>${config.siteName}</h1>
  <p>Receba ofertas, promoções e descontos no Telegram.</p>
  <p><a href="${config.groupLink}" target="_blank" rel="noopener noreferrer">Entrar no grupo</a></p>

  <h2>Páginas em destaque</h2>
  <ul>
    ${featured}
  </ul>
</body>
</html>`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${config.siteUrl}/sitemap.xml
`;
}

function renderSitemap(allPages) {
  const now = new Date().toISOString();
  const urls = [
    `<url><loc>${config.siteUrl}/</loc><lastmod>${now}</lastmod></url>`,
    ...allPages.map(
      (page) =>
        `<url><loc>${config.siteUrl}/${page.slug}.html</loc><lastmod>${now}</lastmod></url>`
    )
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

function main() {
  const siteDir = path.join(__dirname, "site");
  ensureDir(siteDir);

  const keywords = readKeywords();
  const allPages = keywords.map((keyword) => ({
    keyword,
    slug: slugify(keyword)
  }));

  for (const page of allPages) {
    const related = pickRelatedPages(allPages, page, config.maxRelatedLinks);
    const html = renderPage(page, related);
    fs.writeFileSync(path.join(siteDir, `${page.slug}.html`), html, "utf8");
  }

  fs.writeFileSync(path.join(siteDir, "index.html"), renderHome(allPages), "utf8");
  fs.writeFileSync(path.join(siteDir, "robots.txt"), renderRobots(), "utf8");
  fs.writeFileSync(path.join(siteDir, "sitemap.xml"), renderSitemap(allPages), "utf8");

  console.log(`Páginas geradas: ${allPages.length}`);
  console.log(`Arquivos salvos em: ${siteDir}`);
}

main();