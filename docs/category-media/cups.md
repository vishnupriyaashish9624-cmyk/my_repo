# Cups & lids category page — media brief

Page: `/en/products/cups` · 60 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

Some cups in the list are printed. Generate **plain** cups; printed designs belong on supplier photos.

---

## 0. Hero film (scroll-scrubbed)

Prompts and frame images are in [video-prompts.md §5](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-cups.mp4` (optional `category-cups-mobile.mp4`) |
| Then run | `ffmpeg -i category-cups-raw.mp4 -vf reverse -an media-src/category-cups.mp4` then `npm run frames -- category-cups` |
| How it's used | Starts on a single nested stack under the giant "Cups." title. As you scroll the stack fans out into a row of sizes, a size label (4 oz · 6 oz · 8 oz · 12 oz · PET) appears under each cup, then the film shrinks into a framed panel. |

---

## 1. Burst (optional): straws and lids scatter

| Save as | `media-src/category-cups-burst.mp4` → `npm run frames -- category-cups-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. Paper-wrapped straws, white and black paper cup lids and clear dome lids burst outward from the centre of the frame toward the camera, spinning slowly across the whole frame. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus. No other objects, no text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/cups-hot.webp` | Paper cups 2.5–12 oz, rippled cups, paper cup lids | A bright café counter with plain white and black rippled paper cups of different sizes with lids, gentle steam rising from one, on the right side of the frame. |
| `public/media/subcategories/cups-cold.webp` | PET glasses 84 & 92 mm, juice cups, dome lids, juice paper cups | Clear PET cold cups with dome lids filled with iced orange and green juices, condensation droplets, on the right side of the frame. |
| `public/media/subcategories/cups-straws-small.webp` | Straws 6, 8, 12 mm, plastic cups 5–6 oz, ice cream cups, juice covers | Paper-wrapped straws fanned out beside small white plastic cups and small ice cream cups, top-down, on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded and unprinted, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/cups/paper-cup-small.webp` | Paper cups 2.5 oz, 4 oz | two small plain white paper espresso cups |
| `public/media/products/cups/paper-cup-6oz.webp` | Paper cups 6 oz and 6.5 oz, all gsm | a plain white 6 oz paper cup |
| `public/media/products/cups/paper-cup-8-12oz.webp` | Paper cups 8 oz, 12 oz | plain white 8 oz and 12 oz paper cups side by side |
| `public/media/products/cups/rippled-cup.webp` | Rippled 8 oz black, brown, check | a black rippled double-wall paper cup with a black lid |
| `public/media/products/cups/paper-cup-lid.webp` | Lids for paper cups 6–12 oz, white and black | white and black plastic sip lids for paper cups, stacked |
| `public/media/products/cups/pet-glass.webp` | PET glasses 84 mm 10–16 oz, 92 mm 14 oz, hotpack | a clear PET cold cup |
| `public/media/products/cups/dome-lid.webp` | Dome lids 84 & 92 mm | a clear dome lid with a straw hole |
| `public/media/products/cups/juice-cup.webp` | Juice cups ISAP 400 & 500 ml | a tall clear juice cup |
| `public/media/products/cups/plastic-cup.webp` | Plastic cups 5 & 6 oz, clear and white | a short stack of small white plastic cups and one clear cup |
| `public/media/products/cups/ice-cream-cup.webp` | Ice cream cups 4 oz with and without lid | a small plain white paper ice cream cup with a flat lid beside it |
| `public/media/products/cups/straws.webp` | Straws 6, 8, 12 mm, paper- and plastic-wrapped | a bundle of individually paper-wrapped white straws and a few mixed-colour 12 mm straws |
| `public/media/products/cups/juice-cover.webp` | Juice cover 2 section | a two-cup kraft cup carrier |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-cups.mp4` |
|---|---|

```
Slow-motion close-up, single continuous take, static camera. Ice cubes drop gently into a clear PET cup of pale juice against a bright pale blue-white background, bubbles rising, condensation on the cup, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "open" + "closed" (video-prompts.md §5)
- [ ] `category-cups.mp4` reversed + `npm run frames -- category-cups`
- [ ] `category-cups-mobile.mp4` (optional, two-row layout)
- [ ] `category-cups-burst.mp4` (optional)
- [ ] `subcategories/cups-hot`
- [ ] `subcategories/cups-cold`
- [ ] `subcategories/cups-straws-small`
- [ ] `products/cups/paper-cup-small`
- [ ] `products/cups/paper-cup-6oz`
- [ ] `products/cups/paper-cup-8-12oz`
- [ ] `products/cups/rippled-cup`
- [ ] `products/cups/paper-cup-lid`
- [ ] `products/cups/pet-glass`
- [ ] `products/cups/dome-lid`
- [ ] `products/cups/juice-cup`
- [ ] `products/cups/plastic-cup`
- [ ] `products/cups/ice-cream-cup`
- [ ] `products/cups/straws`
- [ ] `products/cups/juice-cover`
- [ ] `loops/quote-cups.mp4` (optional)
