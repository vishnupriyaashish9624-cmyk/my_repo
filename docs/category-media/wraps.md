# Wraps & rolls category page — media brief

Page: `/en/products/wraps` · 35 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

Printed sandwich paper (Haya, Star, Century) needs supplier photos. Generate plain paper only.

---

## 0. Hero film (scroll-scrubbed)

Prompts and frame images are in [video-prompts.md §7](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-wraps.mp4` (optional `category-wraps-mobile.mp4`) |
| Then run | `npm run frames -- category-wraps` (no reverse needed) |
| How it's used | Starts on a salad bowl and a cling film roll under the giant "Wraps." title. As you scroll the film stretches over the bowl while the roll sizes appear on the right, then the film shrinks into a framed panel. |

---

## 1. Burst (optional): sheets of paper fly out

| Save as | `media-src/category-wraps-burst.mp4` → `npm run frames -- category-wraps-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. Square sheets of white greaseproof sandwich paper and thin round rotti papers burst outward from the centre of the frame toward the camera, floating and turning softly across the whole frame. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus, realistic translucent paper texture. No other objects, no text, no print, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/wraps-film.webp` | Cling film 30 & 45 cm, jumbo rolls, stretch film | Large clear cling film rolls and a stretch film roll on a stainless steel prep counter, one roll with a taut sheet over a tray of cut vegetables, on the right side of the frame. |
| `public/media/subcategories/wraps-food-paper.webp` | Sandwich paper, rotti paper, baking paper, sufra, vegetable roll | Stacks of plain white greaseproof sandwich paper, round rotti papers and a roll of baking paper on a light wooden bakery counter on the right side of the frame. |
| `public/media/subcategories/wraps-counter-supplies.webp` | Bill rolls, tape, rubber bands, cartons | Thermal bill rolls beside a till, clear packing tape rolls, a pile of rubber bands and a flat-packed brown carton on a bright counter on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded and unprinted, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/wraps/cling-film.webp` | Cling film 30 & 45 cm, 1–1.5 kg | a roll of clear cling film on a cardboard core with a short sheet pulled out |
| `public/media/products/wraps/cling-film-jumbo.webp` | Cling film jumbo 4, 5, 5.5 kg | a very large, heavy roll of clear catering cling film |
| `public/media/products/wraps/stretch-film.webp` | Stretch film 800 g, 1.8 kg | a roll of clear pallet stretch wrap film |
| `public/media/products/wraps/sandwich-paper.webp` | Sandwich paper plain 6–9 kg | a thick stack of plain white greaseproof sandwich paper squares |
| `public/media/products/wraps/rotti-paper.webp` | Rotti paper small, medium, large, 5 kg | a stack of thin round white food papers |
| `public/media/products/wraps/baking-paper.webp` | Baking paper sheet | a sheet of silicone baking paper on a steel baking tray |
| `public/media/products/wraps/sufra.webp` | Sufra roll 2, 3, 6 kg | a large roll of thin white plastic table-cover film |
| `public/media/products/wraps/vegetable-roll.webp` | Vegetable roll clear & milky 5–6 kg | a roll of perforated clear produce bags |
| `public/media/products/wraps/bill-roll.webp` | Bill roll 80×80 mm, 48 & 65 gsm | three white thermal till paper rolls |
| `public/media/products/wraps/tape.webp` | Clear tape 50 & 100 yard | two rolls of clear packing tape |
| `public/media/products/wraps/rubber-band.webp` | Rubber band 500 g | a loose pile of natural rubber bands |
| `public/media/products/wraps/carton.webp` | Empty carton 5-ply 45×45×45, 45×45×70 | a plain brown 5-ply corrugated carton, one open |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-wraps.mp4` |
|---|---|

```
Slow close-up, single continuous take, static camera. A sheet of clear cling film gently ripples and catches soft rainbow reflections as bright light moves slowly across it, pale blue-white background, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "closed" + "open" (video-prompts.md §7)
- [ ] `category-wraps.mp4` + `npm run frames -- category-wraps`
- [ ] `category-wraps-mobile.mp4` (optional)
- [ ] `category-wraps-burst.mp4` (optional)
- [ ] `subcategories/wraps-film`
- [ ] `subcategories/wraps-food-paper`
- [ ] `subcategories/wraps-counter-supplies`
- [ ] `products/wraps/cling-film`
- [ ] `products/wraps/cling-film-jumbo`
- [ ] `products/wraps/stretch-film`
- [ ] `products/wraps/sandwich-paper`
- [ ] `products/wraps/rotti-paper`
- [ ] `products/wraps/baking-paper`
- [ ] `products/wraps/sufra`
- [ ] `products/wraps/vegetable-roll`
- [ ] `products/wraps/bill-roll`
- [ ] `products/wraps/tape`
- [ ] `products/wraps/rubber-band`
- [ ] `products/wraps/carton`
- [ ] `loops/quote-wraps.mp4` (optional)
