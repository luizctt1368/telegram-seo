# Telegram SEO Engine

Projeto em Node.js para gerar páginas estáticas com sitemap, robots.txt, index e estrutura pronta para publicar no Netlify.

## 1. Instalação

```bash
npm install
```

## 2. Gerar keywords

```bash
npm run keywords
```

## 3. Gerar o site

```bash
npm run build
```

Os arquivos finais serão gerados na pasta `site/`.

## 4. Antes de publicar

Abra `generate-pages.js` e troque:

```js
siteUrl: "https://SEU-SITE.netlify.app"
```

pelo domínio real do seu site no Netlify.

## 5. Publicação no Netlify

Esse projeto já inclui `netlify.toml` com:

- comando de build: `npm run build`
- pasta publicada: `site`

## 6. Fluxo com GitHub

```bash
git init
git add .
git commit -m "Projeto inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/telegram-seo-engine.git
git push -u origin main
```

Depois conecte o repositório no Netlify.
