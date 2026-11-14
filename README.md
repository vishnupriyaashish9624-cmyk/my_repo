# Klen Plus website

Next.js 16 + Payload CMS 3 in one app. The homepage is a scroll-driven film site in the style of the Nuragro project: GSAP ScrollTrigger + Lenis for scroll, Motion for UI transitions, React Three Fiber for the hero bubbles, Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

1. Open `http://localhost:3000/admin` and create the first admin user.
2. Import the product sheet and starting copy:
   ```bash
   npm run seed
   ```
3. Open `http://localhost:3000`.

The local database is SQLite (`klen.db`, git-ignored). `.env` holds `DATABASE_URL` and `PAYLOAD_SECRET`; copy `.env.example` on a new machine and set a long random secret.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Site and admin with hot reload |
| `npm run build` / `npm start` | Production build and server |
| `npm run seed` | Imports `Products -Klen - 16-09-26.xlsx`. Safe to re-run: sheet products are replaced, admin edits to categories and pages are kept. Use `SEED_FILE=other.xlsx npm run seed` for a newer sheet |
| `npm run frames` | Converts Flow clips in `media-src/` into scroll-film frames (see below) |
| `npm run motion -- category-tissue:reverse category-aluminium` | Shows where the motion happens in each clip (0–1), to set chapter text timing |
| `SEED_RESET_CHAPTERS=1 npm run seed` | Rewrites homepage chapter copy, layout and timing from `src/scripts/seed-data.ts` (overwrites admin edits to chapters) |
| `npm run generate:types` | Regenerates `src/payload-types.ts` after changing collections |

## Content model (Payload admin)

- **Categories:** name, slug, subcategories and the **homepage chapter**: giant title, hook, specs, chips, button label, where the specs sit on the footage (`on` / `right` / `behind`) and the scroll timing of each text block.
- **Products:** one row per SKU from the sheet: category, subcategory, brand, size, colour, pack and active flag. Inactive products stay in the admin but are hidden on the site.
- **Brands:** `thirdParty` marks brands owned by other companies (Dettol, Clorox…), which must use supplier photos, never generated ones. `showInMarquee` puts a brand in the homepage strip.
- **Enquiries:** quote requests from the site form. Only signed-in staff can read them.
- **Home** and **Site settings** globals: homepage copy, hero overlays, industries, ordering steps, contact details.

Classification rules for the sheet (which row goes to which category and subcategory) live in `src/scripts/seed-data.ts`. Unclassified rows are listed at the end of the seed output.

## Media workflow

All prompts are in `docs/`:

- `docs/video-prompts.md`: the hero film, the 10 category chapter films, travelling product turntables, quote loop
- `docs/image-prompts.md`: homepage stills (category rail, industries, social image)
- `docs/category-media/<slug>.md`: per-category banners, product photos and checklists

### Scroll films
1. Save the clip as `media-src/category-tissue.mp4` (or `hero.mp4`, `category-<slug>-mobile.mp4` for 9:16).
2. Run `npm run frames -- category-tissue`. For clips generated in the closing direction (tissue crumpling, lid closing), add `--reverse`.
3. Frames and a `manifest.json` land in `public/media/films/<name>/`, and the chapter picks them up on refresh. Until then, a soft gradient and a yellow "Awaiting footage" note show in development.

**Current footage** (10 s clips, 240 frames each): these clips were generated in the closing direction and are converted with `--reverse`: `category-tissue`, `category-containers`, `category-cups`, `category-bags`, `category-foam`. All other films and every `item-*` turntable play as generated.

**Chapter layout:** each category's text timing, specs position and specs box (the product surface in the final frame) are measured from its clip and stored on the category in the admin (`FILM` in `seed-data.ts` holds the starting values). If you replace a clip, re-run `npm run motion` for it and adjust the timing in the admin.

**Loading:** films load when they come within 1.5 screens and release their frames once they're 4 screens away, so ten chapters don't sit in memory together. The frames total about 130 MB, so serve `public/media` from a CDN in production.

Other file names the script understands: `*-loop.mp4` (plain background video), `item-*.mp4` (magenta-screen turntable → transparent sprite), `*-burst.mp4` (magenta-screen overlay film), `name-1.mp4`, `name-2.mp4`… (joined with crossfades).

### Stills
Drop files into `public/media/<slot>.webp`, e.g. `public/media/categories/tissue.webp` or `public/media/industries/cafe.webp`. Empty slots show their slot name in development. Nothing to run.

Use WebP (the PNG originals from Flow are kept in `media-src/stills/`, which is git-ignored). The social share image is `public/media/social/og.jpg`, a JPEG because WhatsApp and LinkedIn previews don't reliably support WebP. `textures/tissue` is used as a faint grain on the intro sheet.

## Before going live

- **Database:** swap `@payloadcms/db-sqlite` for `@payloadcms/db-postgres` (Neon or Supabase) in `src/payload.config.ts`.
- **Media:** serve `public/media` films from a CDN, and add a Payload storage adapter (S3 or Cloudflare R2) for CMS uploads.
- **Email:** add an email adapter (e.g. Resend) so new enquiries notify the sales team.
- **Contact details:** fill in phone, WhatsApp, email and address under Site settings.
