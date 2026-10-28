# TheNeshVerse Static Revamp — Engineering Report

Audit date: 2026-10-29

## Executive summary

The supplied project is a multi-page static HTML/CSS/JavaScript site with 30 HTML pages, a shared `site.js`, modular CSS, a Vercel configuration, a Netlify-style `_redirects` file, and a Vercel serverless contact endpoint. The visual design and existing page copy were retained. Targeted changes address route handling on Vercel, honest newsletter behavior, missing publishing share metadata, and repeatable static integrity checks.

## Changes made

- `vercel.json`: added explicit Vercel rewrites for the extension-free and nested routes represented in `_redirects`, permanent redirects from legacy hyphenated detail-page filenames to their canonical nested paths, and baseline security response headers (`X-Content-Type-Options`, `Referrer-Policy`, and a restrictive `Permissions-Policy`).
- `site.js`: removed the newsletter's simulated “you’re on the list” success state. Until a real provider is configured, a valid submission now explains that no subscription was created and retains the entered email.
- `publishing.html`: added Open Graph and Twitter sharing metadata based on existing page content and the existing Volume I image.
- `tests/site_integrity.py`: added a standard-library-only integrity checker for page titles, one-H1 structure, local assets/links, and JSON-LD syntax.
- `OVERHAUL_REPORT.md`: this report.

No visible page copy, page sections, image assets, or brand styling were intentionally rewritten. The existing contact endpoint and contact form integration were left in place.

## Audit findings and risk notes

- The project contains 30 HTML pages. Source checks found unique document titles and exactly one H1 per page.
- The local link scan initially identified four volume-page links to `/publishing/ai-mastery-journey`; this route is defined in the existing `_redirects` file and is now represented in Vercel's explicit rewrite configuration.
- The newsletter previously showed a success message without sending data to a subscription provider. This was corrected to avoid misleading visitors.
- Contact delivery depends on `RESEND_API_KEY` and optionally `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` in the deployment environment. The endpoint reports a configuration error when the Resend key is missing; successful delivery was not tested here.
- The repository includes browser-work artifacts under `.work/` and `.manus/`. These are not site runtime assets and have been excluded from the delivery archive to avoid shipping browser profiles, caches, and temporary test outputs.

## Verification

### PASS — tested and verified locally
- 30 HTML pages discovered.
- 30 unique page titles.
- Exactly one H1 per HTML page.
- Local static asset references resolved.
- Internal local links resolved against the page files and configured Vercel rewrites.
- JSON-LD blocks parse as JSON.
- `site.js` passes `node --check`.
- Inline JavaScript blocks in HTML pages pass `node --check`.
- Python integrity checker passes: `python -S tests/site_integrity.py`.

### NEEDS CONFIGURATION
- Newsletter subscriptions: no subscription provider/endpoint exists in the supplied project. No fake success is displayed.
- Contact delivery: configure and verify the Resend environment variables on Vercel.

### NOT VERIFIED
- Real browser navigation and keyboard interaction across all viewport sizes.
- Visual screenshot comparison against the live production website.
- Live external links and deployed route responses.
- Actual email delivery from the deployed API.
- Lighthouse/Core Web Vitals, WCAG automated scans, and production security headers after deployment.
- Vercel deployment/build result and live 404 behavior.

## Deployment instructions

1. Review the changed files and keep a backup/version-control checkpoint.
2. Configure `RESEND_API_KEY` in the Vercel project environment. Set `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` as appropriate for the verified sender/domain configuration.
3. Deploy the folder as the existing static site to Vercel. `vercel.json` contains route rewrites and headers; do not rely on `_redirects` alone on Vercel.
4. After deployment, test the home page, each primary route, nested studio/product/lab/journal/publishing routes, and a deliberately invalid URL.
5. Submit the contact form with valid and invalid data, then verify actual receipt in the destination inbox.
6. Confirm the newsletter message does not claim subscription success until a real provider is integrated.
7. Run `python -S tests/site_integrity.py` and `node --check site.js` before future releases.

## Launch readiness

**Assessment: improved source-level readiness, but not production-verified.** The static integrity checks pass and the most obvious false newsletter-success behavior is fixed. Do not consider the overhaul fully launch-ready until Vercel route behavior, contact delivery, responsive/keyboard behavior, visual regression, and live performance/accessibility checks have been verified in a deployed browser.
