# Aluminium category page — media brief

Page: `/en/products/aluminium` · 31 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

**Brands:** the list includes Ducon, Evopack, Prestige, IP, Falcon, Safco, Supreme and Wrapall packs. Generate **unbranded** foil and containers only. Use supplier packshots if a branded box must be shown.

---

## 0. Hero film (scroll-scrubbed)

The same clip as the homepage chapter. Prompts and frame images are in [video-prompts.md §3](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-aluminium.mp4` (optional `category-aluminium-mobile.mp4`) |
| Then run | `npm run frames -- category-aluminium` (no reverse needed) |
| How it's used | Starts on the full foil roll under the giant "Foil." title. As you scroll the sheet unrolls and the specs appear on the foil as it passes, then the film shrinks into a framed panel. |

---

## 1. Burst (optional): foil containers tumble out

| Save as | `media-src/category-aluminium-burst.mp4` → `npm run frames -- category-aluminium-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. Small and medium empty rectangular aluminium takeaway containers and their cardboard lids burst outward from the centre of the frame toward the camera, tumbling slowly and catching bright silver highlights. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus, realistic metal texture. No other objects, no text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/aluminium-foil-rolls.webp` | Foil rolls 30 & 45 cm, burger foil, golden foil | Three silver aluminium foil rolls of different widths lying side by side on a light grey stone counter on the right side of the frame, one with a shiny sheet pulled out toward the camera. |
| `public/media/subcategories/aluminium-containers.webp` | Containers 8342, 8368, 8389, 83120, 83185, 73365 | A neat ascending row of empty rectangular aluminium takeaway containers from small to large with their cardboard lids leaning beside them, on the right side of the frame. |
| `public/media/subcategories/aluminium-platters.webp` | Platters 6550, 6586, 65180 | Three oval aluminium catering platters of increasing size fanned out on a bright buffet counter on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/aluminium/foil-30cm.webp` | Foil 30 cm, 1 kg and 1.5 kg (all brands) | a 30 cm aluminium foil roll with cardboard core and a short sheet pulled out |
| `public/media/products/aluminium/foil-45cm.webp` | Foil 45 cm, 1.5 kg and 2 kg | a wide 45 cm aluminium foil roll with a longer sheet pulled out |
| `public/media/products/aluminium/container-8342.webp` | Container 8342 | a small shallow rectangular aluminium container with a white cardboard lid beside it |
| `public/media/products/aluminium/container-8368.webp` | Container 8368 | a medium shallow rectangular aluminium container with its cardboard lid half on |
| `public/media/products/aluminium/container-8389.webp` | Container 8389 (grey and blue lid versions) | a deep rectangular aluminium container with a plain cardboard lid resting beside it |
| `public/media/products/aluminium/container-83120.webp` | Container 83120 (grey and blue lid versions) | a large deep rectangular aluminium container |
| `public/media/products/aluminium/container-83185.webp` | Container 83185 | an extra-large deep rectangular aluminium container |
| `public/media/products/aluminium/container-73365.webp` | Container 73365 | a round aluminium container with a lid |
| `public/media/products/aluminium/platter.webp` | Platters 6550, 6586, 65180 | three nested oval aluminium platters of different sizes |
| `public/media/products/aluminium/burger-foil.webp` | Burger foil wrap 25×35 cm | a neat stack of pre-cut foil-laminated burger wrap sheets with one folded around nothing, showing its shape |
| `public/media/products/aluminium/golden-foil.webp` | Golden foil | a roll of gold-coloured food foil with a sheet pulled out |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-aluminium.mp4` |
|---|---|

```
Slow-motion close-up, single continuous take, static camera. A soft band of bright light glides slowly back and forth across gently crinkled aluminium foil filling the frame, silver highlights shimmering, pale cool tones, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "closed" + "open" (video-prompts.md §3)
- [ ] `category-aluminium.mp4` + `npm run frames -- category-aluminium`
- [ ] `category-aluminium-mobile.mp4` (optional)
- [ ] `category-aluminium-burst.mp4` (optional)
- [ ] `subcategories/aluminium-foil-rolls`
- [ ] `subcategories/aluminium-containers`
- [ ] `subcategories/aluminium-platters`
- [ ] `products/aluminium/foil-30cm`
- [ ] `products/aluminium/foil-45cm`
- [ ] `products/aluminium/container-8342`
- [ ] `products/aluminium/container-8368`
- [ ] `products/aluminium/container-8389`
- [ ] `products/aluminium/container-83120`
- [ ] `products/aluminium/container-83185`
- [ ] `products/aluminium/container-73365`
- [ ] `products/aluminium/platter`
- [ ] `products/aluminium/burger-foil`
- [ ] `products/aluminium/golden-foil`
- [ ] `loops/quote-aluminium.mp4` (optional)
