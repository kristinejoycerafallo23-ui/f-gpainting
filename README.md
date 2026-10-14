# F&G Decorating Ltd — Website

Static site for F&G Decorating Ltd (painting, decorating & handyman services, London).
No build step, no framework — plain HTML/CSS/JS. Two ways to use it:

- **Multi-page site** (this folder): `index.html`, `about.html`, `services.html`,
  `handyman.html`, `gallery.html`, `reviews.html`, `quote.html`, `contact.html`,
  `privacy.html`, `terms.html`, `cookies.html`, sharing `styles.css` and `script.js`.
- **Single-file version**: `fg-decorating-website.html` (everything inlined —
  useful for quickly previewing or emailing to someone, not meant for hosting).

## Before you go live

**1. Wire up the popup/quote form to actually send email.**
This is a static site with no server, so form submissions need a third-party
handler. The popup form is already wired to [Formspree](https://formspree.io)
(free tier) — you just need to:
1. Create a free Formspree account and verify `fgdecoratingltd@gmail.com`.
2. Create a form, copy the endpoint (`https://formspree.io/f/xxxxxxxx`).
3. In every HTML file, find `https://formspree.io/f/YOUR_FORM_ID` and replace
   it with your real endpoint (it only appears once per file, in the popup form).
4. Do the same for the main quote form on `quote.html` if you want that one to
   send real emails too — right now it only shows a fake on-page confirmation.

**2. Swap in real content.**
- Replace the "Genuine project photo goes here" placeholder panels with actual
  project photos (hero section, gallery tiles).
- Replace the gallery, TikTok, and Google Reviews placeholder tiles with real
  content once you have it embedded.
- Add real Facebook/Instagram URLs — the header icons currently point to `#`.

**3. Legal pages.**
`privacy.html`, `terms.html`, and `cookies.html` are structural placeholders,
not real legal text. Have a solicitor or compliance advisor review and finalize
the actual wording before launch (UK GDPR applies — you're collecting names,
contact details, and property photos).

## Hosting on GitHub Pages

1. Push this folder to a new GitHub repo.
2. In the repo settings, go to **Pages** → set source to the `main` branch,
   root folder.
3. GitHub will give you a URL like `https://yourusername.github.io/repo-name/`.
4. To use your own domain (e.g. `fgdecoratingltd.co.uk`), add a `CNAME` file
   with your domain name, and point your domain's DNS at GitHub Pages per
   [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

Note: GitHub Pages only serves static files — it can't run a backend, which is
exactly why the Formspree step above matters for the forms to actually work.

## File structure

```
index.html          Home
about.html           About Us
services.html        Our Services
handyman.html        Free Handyman Service (dedicated page)
gallery.html         Before & after gallery
reviews.html         Reviews
quote.html           Get a Free Quote (full form)
contact.html         Contact + FAQ
privacy.html         Privacy Policy (placeholder)
terms.html           Terms & Conditions (placeholder)
cookies.html         Cookie Policy (placeholder)
styles.css           Shared styles
script.js            Shared behaviour (nav, forms, popup, gallery filter, FAQ)
assets/
  fg-logo.png         Full logo (roof + wordmark + banner)
  fg-logo-icon.png    Cropped icon mark (header/footer use)
```
