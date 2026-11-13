# Codex Bruxellensis — Markdown-editie

Een lichte, doorzoekbare Markdown-versie van de **Codex Studiosorum Bruxellensis**, het liederenboek van de Brusselse Studentenkring.

[![Astro](https://img.shields.io/badge/Astro-7-ff5d01?logo=astro&logoColor=white)](https://astro.build/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-2ea44f?logo=github&logoColor=white)](https://lucasmiserez.github.io/codex_bruxellensis_markdown/)

**Lees de Markdown-editie:** [lucasmiserez.github.io/codex_bruxellensis_markdown](https://lucasmiserez.github.io/codex_bruxellensis_markdown/)

> **Liever de volledige versie?**
> Ga naar [codex.bsk.brussels](https://codex.bsk.brussels/). Daar staat de hoofdwebsite van de Codex met alle functionaliteit.
>
> Deze GitHub Pages-versie is bedoeld als snelle, eenvoudige naslagversie om te lezen, te zoeken en links te kopiëren.

## Over de Codex

De Codex Studiosorum Bruxellensis is de traditionele liederenbundel van de Brusselse Studentenkring. De bundel bevat kringliederen, officiële liederen en liederen in het Nederlands, Frans, Duits, Engels en andere talen.

Deze repository bevat een statische Markdown-weergave van de volledige bundel: 366 liederen, ingedeeld per categorie, met vermelding van de melodie en het paginanummer.

## Kenmerken

- Alle 366 liederen op één pagina.
- Zeven categorieën met snelle navigatie.
- Zoeken op liedtitel of categorie, inclusief zoeken zonder accenten.
- Sneltoets `/` om direct in het zoekveld te springen.
- Copy-link-knop per lied.
- Lichte en donkere modus, met automatische systeemvoorkeur.
- Printvriendelijke opmaak.
- Geen externe zoekdienst of database: alles werkt statisch op GitHub Pages.

## Lokaal draaien

Vereisten: Node.js 22.23.4 of nieuwer en pnpm 12.

```sh
pnpm install
pnpm dev
```

De lokale ontwikkelserver draait standaard op [localhost:4321/codex_bruxellensis_markdown](http://localhost:4321/codex_bruxellensis_markdown/). Astro toont de exacte URL in de terminal.

Productiebuild maken en lokaal testen:

```sh
pnpm build
pnpm preview
```

## Projectstructuur

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.md
│   ├── scripts/
│   │   └── site.js
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── pnpm-workspace.yaml
```

- `src/pages/index.md` bevat de liedjesteksten en categorieën.
- `src/layouts/Layout.astro` bevat de header, navigatie, zoekinterface, footer en metadata.
- `src/scripts/site.js` regelt zoeken, dark mode, copy-links en de terug-naar-boven-knop.
- `src/styles/global.css` bevat de volledige opmaak, thema's en printfstijlen.

## Deployment

De site wordt automatisch gebouwd en gepubliceerd via GitHub Actions naar GitHub Pages. Een push naar `main` start de workflow in `.github/workflows/deploy.yml`. De workflow gebruikt Node.js 24 en pnpm 12.

`pnpm-workspace.yaml` staat de buildscripts van `esbuild` en `sharp` toe. Zonder die allowlist stopt pnpm 11 en nieuwer met `ERR_PNPM_IGNORED_BUILDS`.

De productie-URL is:

```text
https://lucasmiserez.github.io/codex_bruxellensis_markdown/
```

De configuratie in `astro.config.mjs` gebruikt daarom:

```js
site: "https://lucasmiserez.github.io",
base: "/codex_bruxellensis_markdown/",
```

Als de site ooit op een eigen domein wordt geplaatst, moeten `site` en `base` daarop worden aangepast.

## Inhoud aanpassen

De inhoud van deze editie is afgestemd op de hoofdwebsite van de Codex. Inhoudelijke correcties aan de liedjesteksten horen in de eerste plaats bij de bron van de hoofdsite.

Voor technische verbeteringen aan deze Markdown-weergave kan je een issue openen of een pull request indienen. Houd daarbij rekening met de bestaande opmaak:

- Behoud de categorieën en de volgorde van de liederen.
- Behoud de vermeldingen van melodie en paginanummer.
- Behoud de bestaande regelafbrekingen in de liedjesteksten.
