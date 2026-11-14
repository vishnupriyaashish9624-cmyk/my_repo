# Cleaning chemicals category page — media brief

Page: `/en/products/chemicals` · 38 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

**Brands matter most here.** Dettol, Clorox, Harpic, Purell, Lux, JIF and PIF PAF are other companies' products. **Don't generate them.** Use the brand owner's or supplier's packshots. The prompts below cover the unbranded bulk chemicals (5 L cans, 500 ml bottles) and the mood images.

---

## 0. Hero film (scroll-scrubbed)

Prompts and frame images are in [video-prompts.md §8](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-chemicals.mp4` (optional `category-chemicals-mobile.mp4`) |
| Then run | `npm run frames -- category-chemicals` (no reverse needed) |
| How it's used | Starts on grimy glass under the giant "Chemicals." title. A squeegee sweeps across, and the product list is revealed behind the clean glass. Then the film shrinks into a framed panel. |

---

## 1. Burst (optional): foam and bubbles

A magenta key can't cut out transparent soap bubbles cleanly, so **skip the burst film for this category**. The site's code-drawn bubble layer does this job instead (it's the same layer as the homepage hero).

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/chemicals-kitchen.webp` | Dish wash 500 ml–5 L, oven cleaner, drain opener, detergent powder | A gleaming stainless steel commercial kitchen sink with a plain white 5 L can and a pump bottle without labels beside it, soap foam on a sponge, on the right side of the frame. |
| `public/media/subcategories/chemicals-floor-surface.webp` | Floor cleaners, floor stripper, disinfectant, bleach, all-purpose cleaner | A freshly mopped glossy floor in a bright corridor with plain white 5 L cans lined up against the wall on the right side of the frame. |
| `public/media/subcategories/chemicals-hands-glass.webp` | Hand wash 500 ml & 5 L, sanitizer, glass cleaner | A bright washroom counter with plain white pump bottles and a trigger spray bottle without labels, a spotless mirror behind, on the right side of the frame. |
| `public/media/subcategories/chemicals-air.webp` | Air fresheners (bakhoor, lavender, rose) | Soft fresh lavender and rose petals drifting in bright daylight beside a plain white aerosol can without labels, on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Unbranded products only.** For the brands listed above, use supplier photos.

**Template** (+ house style):
```
Studio packshot of [SUBJECT], plain with no label and no printing, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/chemicals/dish-wash-5l.webp` | Dish wash 5 L (Realox, Asil, Neo, Real) | a white 5 L jerry can with a yellow cap and a pale yellow liquid visible through a small window |
| `public/media/products/chemicals/dish-wash-bottle.webp` | Dish wash 500 ml and 1 L lemon | a clear bottle of pale yellow dish liquid with a white flip cap |
| `public/media/products/chemicals/floor-cleaner.webp` | Floor cleaner 5 L fresh green, lavender, pink | three white 5 L jerry cans with green, lavender and pink caps |
| `public/media/products/chemicals/glass-cleaner.webp` | Glass cleaner 700 ml, 750 ml, 5 L | a clear trigger spray bottle of pale blue liquid |
| `public/media/products/chemicals/disinfectant.webp` | Disinfectant 5 L, Eurowash lavender | a white 5 L jerry can with a navy cap |
| `public/media/products/chemicals/hand-wash.webp` | Hand wash 500 ml lavender, rose; 5 L antibacterial, rose, white | a clear pump bottle of soft pink hand wash beside a white 5 L refill can |
| `public/media/products/chemicals/heavy-duty.webp` | Oven cleaner, floor stripper, drain opener, all-purpose cleaner | two white 5 L jerry cans with red caps |
| `public/media/products/chemicals/detergent-powder.webp` | Detergent powder 15 kg | a large plain white sack of detergent powder with a scoop of powder beside it |
| `public/media/products/chemicals/air-freshener.webp` | Air freshener manual 300 ml | a plain white aerosol can with a lavender sprig beside it |
| `public/media/products/chemicals/table-sanitizer.webp` | Table top sanitizer 1 L | a clear trigger spray bottle of clear liquid beside a folded microfiber cloth |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-chemicals.mp4` |
|---|---|

```
Slow-motion macro, single continuous take, static camera. Soft white soap foam slowly expands and glistens with tiny iridescent bubbles against a bright pale blue-white background, the centre of the frame always full, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "closed" + "open" (video-prompts.md §8)
- [ ] `category-chemicals.mp4` + `npm run frames -- category-chemicals`
- [ ] `category-chemicals-mobile.mp4` (optional)
- [ ] `subcategories/chemicals-kitchen`
- [ ] `subcategories/chemicals-floor-surface`
- [ ] `subcategories/chemicals-hands-glass`
- [ ] `subcategories/chemicals-air`
- [ ] `products/chemicals/dish-wash-5l`
- [ ] `products/chemicals/dish-wash-bottle`
- [ ] `products/chemicals/floor-cleaner`
- [ ] `products/chemicals/glass-cleaner`
- [ ] `products/chemicals/disinfectant`
- [ ] `products/chemicals/hand-wash`
- [ ] `products/chemicals/heavy-duty`
- [ ] `products/chemicals/detergent-powder`
- [ ] `products/chemicals/air-freshener`
- [ ] `products/chemicals/table-sanitizer`
- [ ] Supplier packshots: Dettol, Clorox bleach, Clorex, Harpic, Purell, LUX, JIF, PIF PAF
- [ ] `loops/quote-chemicals.mp4` (optional)
