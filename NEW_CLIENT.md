# New Client Setup Checklist

## 1) Clone & install
- [ ] Clone template repo
- [ ] Rename repo / project
- [ ] `npm install`
- [ ] `npm run dev` (verify site loads)

## 2) Update site.json
Edit `src/content/site.json`:

### Core info
- [ ] businessName
- [ ] tagline
- [ ] phone
- [ ] email (public contact email)
- [ ] city
- [ ] serviceAreas
- [ ] services
- [ ] reviews
- [ ] about

### SEO
- [ ] seo.siteUrl (final domain)
- [ ] seo.defaultTitle
- [ ] seo.defaultDescription

### Theme / layout
- [ ] theme.brand.primary
- [ ] theme.brand.secondary
- [ ] theme.radius
- [ ] Choose layout variant: site.layout = "A" | "B" | "C"
- [ ] layout (A | B | C)

### Assets
- [ ] assets.heroImage
- [ ] assets.logoText (if used)

## 3) Replace images
In `/public`:
- [ ] hero.jpg (1200px+ wide, real photo)
- [ ] og.jpg (1200×630)
- [ ] favicon.ico

## 4) Configure email (Resend)
Vercel → Project Settings → Environment Variables:
- [ ] RESEND_API_KEY
- [ ] LEAD_TO_EMAIL (client inbox)
- [ ] LEAD_FROM_EMAIL (verified sender)

⚠️ Do NOT put recipient emails in `site.json`

## 5) Deploy + domain
- [ ] Deploy on Vercel
- [ ] Connect client domain
- [ ] Verify HTTPS / SSL

## 6) SEO launch
- [ ] Create / verify Google Search Console
- [ ] Submit sitemap: https://domain.com/sitemap.xml
- [ ] Verify robots.txt loads
- [ ] Run Lighthouse (SEO + Performance)

## 7) Smoke tests
- [ ] Submit test lead
- [ ] Confirm email delivery
- [ ] Confirm /thanks page
- [ ] Check mobile layout

## 8) Finalize
- [ ] Client approval
- [ ] Repo tagged or archived
- [ ] Billing started
