# PPE & cutlery category page — media brief

Page: `/en/products/ppe` · 42 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

Glove boxes (Gesalife, Smart) are branded. Generate the gloves themselves, not the boxes.

---

## 0. Hero film (scroll-scrubbed)

Prompts and frame images are in [video-prompts.md §10](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-ppe.mp4` (optional `category-ppe-mobile.mp4`) |
| Then run | `npm run frames -- category-ppe` (no reverse needed) |
| How it's used | Starts on a flat black glove under the giant "Gloves." title. As you scroll it fills with air and stands up with fingers spread, while glove types and sizes (M · L · XL) appear on the right. Then the film shrinks into a framed panel. |

---

## 1. Burst (optional): cutlery and gloves scatter

| Save as | `media-src/category-ppe-burst.mp4` → `npm run frames -- category-ppe-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. Black and white disposable plastic spoons and forks, a few black and blue disposable gloves and wooden toothpicks burst outward from the centre of the frame toward the camera, spinning slowly across the whole frame. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus. No other objects, no text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright. Hands are fine here, but no faces.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/ppe-gloves.webp` | Vinyl, latex, nitrile and PE gloves in S–XL | Hands (no faces) in black nitrile gloves arranging fresh food on a stainless steel prep counter, open glove dispensers beside them, on the right side of the frame. |
| `public/media/subcategories/ppe-hygiene-wear.webp` | Hair nets, face masks, plastic aprons | A white disposable plastic apron, blue and white hair nets and black face masks laid out neatly on a bright kitchen changing-room bench, on the right side of the frame. |
| `public/media/subcategories/ppe-cutlery.webp` | Spoons, forks, tea spoons, cutlery sets, skewers, toothpicks | Black and white disposable spoons and forks fanned out beside wrapped cutlery sets, bamboo skewers and toothpicks on a bright counter, on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/ppe/vinyl-black.webp` | Vinyl gloves black M, L, XL | a pair of black vinyl disposable gloves, one lying flat, one slightly curled |
| `public/media/products/ppe/vinyl-clear.webp` | Vinyl gloves clear M, L | a pair of clear powder-free vinyl disposable gloves |
| `public/media/products/ppe/latex.webp` | Latex gloves S–XL | a pair of natural off-white latex disposable gloves |
| `public/media/products/ppe/nitrile-blue.webp` | Nitrile gloves blue L | a pair of blue nitrile disposable gloves |
| `public/media/products/ppe/pe-gloves.webp` | Plastic PE gloves | a small stack of loose clear polythene food-handling gloves |
| `public/media/products/ppe/hair-net.webp` | Hair nets black, blue, white | three round disposable hair nets in black, blue and white |
| `public/media/products/ppe/face-mask.webp` | Face mask black | two black 3-ply disposable face masks |
| `public/media/products/ppe/apron.webp` | Plastic aprons white, salon | a folded white disposable plastic apron with one fold opened |
| `public/media/products/ppe/spoon-fork.webp` | Plastic spoons & forks black, white, clear, HD | black heavy-duty plastic spoons and forks fanned out |
| `public/media/products/ppe/tea-spoon.webp` | Plastic tea spoon white | a small pile of white plastic tea spoons |
| `public/media/products/ppe/cutlery-set.webp` | Cutlery set black | a black plastic fork, knife and spoon set with a napkin in a clear wrapper |
| `public/media/products/ppe/skewers-toothpicks.webp` | Bamboo skewers 8", toothpicks | a bundle of bamboo skewers beside wooden toothpicks |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-ppe.mp4` |
|---|---|

```
Slow-motion close-up, single continuous take, static camera. A black nitrile glove slowly and gently inflates and deflates like breathing, standing on its cuff against a bright pale blue-white background, fingers softly spreading, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks, no hands.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "closed" + "open" (video-prompts.md §10)
- [ ] `category-ppe.mp4` + `npm run frames -- category-ppe`
- [ ] `category-ppe-mobile.mp4` (optional)
- [ ] `category-ppe-burst.mp4` (optional)
- [ ] `subcategories/ppe-gloves`
- [ ] `subcategories/ppe-hygiene-wear`
- [ ] `subcategories/ppe-cutlery`
- [ ] `products/ppe/vinyl-black`
- [ ] `products/ppe/vinyl-clear`
- [ ] `products/ppe/latex`
- [ ] `products/ppe/nitrile-blue`
- [ ] `products/ppe/pe-gloves`
- [ ] `products/ppe/hair-net`
- [ ] `products/ppe/face-mask`
- [ ] `products/ppe/apron`
- [ ] `products/ppe/spoon-fork`
- [ ] `products/ppe/tea-spoon`
- [ ] `products/ppe/cutlery-set`
- [ ] `products/ppe/skewers-toothpicks`
- [ ] `loops/quote-ppe.mp4` (optional)
