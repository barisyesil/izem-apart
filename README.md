# İzem Bayan Apart — Website

A premium, editorial redesign of the website for **İzem Bayan Apart**, a female student residence (kız öğrenci apartı) in Tepebaşı, Eskişehir. Built as a fast, mobile-first, single-page site.

> **Scope:** This is a **frontend-only** project (a design pilot). It has the same features as the original site — no pricing engine, no online booking, no backend. The contact form opens WhatsApp or the user's e-mail app directly, client-side.

> 🇹🇷 **New to coding?** Read the step-by-step Turkish guide: [`docs/REHBER.md`](docs/REHBER.md).

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (design tokens in `app/globals.css`) |
| Animation | [Framer Motion](https://www.framer.com/motion/) (subtle scroll reveals) |
| Icons | [Lucide](https://lucide.dev) + custom brand SVGs (Instagram/Facebook/WhatsApp) |
| Fonts | Cormorant Garamond (headings) + Inter (body), self-hosted via `next/font` |

## Highlights

- **Mobile-first** and fully responsive (375 → 1440 px), with a slide-in mobile menu.
- **Warm-neutral** design system (cream, sand, charcoal + sage & terracotta accents).
- Cinematic hero, editorial sections, gallery with an accessible lightbox.
- All copy & data centralized in **one file** (`lib/content.ts`) for easy editing.
- Accessible: keyboard focus styles, alt text, `aria-label`s, and `prefers-reduced-motion` support.
- 100% static output — fast and host-anywhere.

## Project structure

```
izem-apart/
├─ app/
│  ├─ layout.tsx        # Root layout: fonts, SEO metadata, Header + Footer
│  ├─ page.tsx          # Home page: assembles every section in order
│  ├─ globals.css       # Tailwind import + design tokens (colors, fonts)
│  └─ icon.svg          # Favicon (İzem monogram)
├─ components/
│  ├─ layout/           # Header (with mobile drawer) and Footer
│  ├─ sections/         # One file per page section (Hero, About, Rooms, …)
│  └─ ui/               # Reusable bits (Container, Section, ButtonLink, Reveal, Figure, brand-icons)
├─ lib/
│  ├─ content.ts        # ⭐ ALL site text & data — edit here
│  └─ types.ts          # TypeScript types for the content
├─ public/              # Images live here (add room photos)
└─ docs/REHBER.md       # Beginner's guide (Turkish)
```

## Getting started

Requires [Node.js](https://nodejs.org) 18.18+ (Node 20+ recommended).

```bash
npm install      # install dependencies
npm run dev      # start the dev server → http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # run ESLint
```

## Editing content

- **Text, phone, address, rooms, amenities, social links** → edit [`lib/content.ts`](lib/content.ts). You don't need to touch the components.
- **Photos** → drop image files into `public/` (e.g. `public/images/oda-tek.jpg`) and set the matching `image` / `src` field in `lib/content.ts`. Empty fields show an elegant placeholder.
- **Colors & fonts** → `app/globals.css` (the `@theme` block).

## Notes

- **Hosting** is intentionally undecided — the app is host-agnostic (standard Next.js, static export-friendly).
- The map uses Google Maps' keyless embed (`output=embed`), so no API key is needed.
- Code comments are written in **Turkish** to help the next intern learn the codebase.
