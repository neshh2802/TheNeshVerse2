# TheNeshVerse — Static HTML Revamp

This version keeps the current visual language and converts the site from a single-page/hash-router application into a real multi-page static website.

## Main pages

- `index.html` — Home
- `studio.html` — Studio
- `products.html` — Products
- `labs.html` — Labs
- `journal.html` — Journal
- `publishing.html` — Publishing
- `about.html` — About
- `contact.html` — Contact
- `now.html` — Now
- `future.html` — Future Watch

Detail pages are also separate HTML files for studio projects, products, labs, journal notes, and all four AI Mastery Journey volumes.

## Why this version is easier

Primary navigation and card navigation use normal HTML links. The site does not depend on a client-side router, hash routes, or Vite to move between pages.

`site.js` is progressive enhancement only: theme persistence, mobile navigation, search, the home project filter, reveal animations, and the local newsletter form interaction.

## Deploy

Upload the whole folder to a static host. `index.html` is the entry point.

The configured production domain is `https://theneshverse.com`. Point the domain's DNS records to your host and select it as the primary domain in the host dashboard. On Netlify, `_redirects` provides the extension-free URLs and custom 404 page. On Vercel, `vercel.json` enables clean URLs and `404.html` is served for missing pages. GitHub Pages and a basic web server need equivalent server-side rewrite rules for clean URLs.

## Edit

Page content is directly inside each `.html` file. Shared styles live in `styles.css` and the modular files in `css/`.
