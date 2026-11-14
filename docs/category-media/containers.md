# Takeaway containers category page — media brief

Page: `/en/products/containers` · 106 active products (the largest category)

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

Show containers **empty**. Food makes the range look like a restaurant menu, and AI food often looks wrong up close.

---

## 0. Hero film (scroll-scrubbed)

The same clip as the homepage chapter. Prompts and frame images are in [video-prompts.md §4](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-containers.mp4` (optional `category-containers-mobile.mp4`) |
| Then run | `ffmpeg -i category-containers-raw.mp4 -vf reverse -an media-src/category-containers.mp4` then `npm run frames -- category-containers` |
| How it's used | Starts on the closed container under the giant "Containers." title. As you scroll the lid lifts off and the size range (RE12 → RE58) appears on the right, then the film shrinks into a framed panel. |

---

## 1. Burst (optional): lids and bowls pop out

| Save as | `media-src/category-containers-burst.mp4` → `npm run frames -- category-containers-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. Empty clear round plastic bowls, small portion cups, clear snap-on lids and black rectangular container bases burst outward from the centre of the frame toward the camera, tumbling slowly. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus, realistic glossy plastic. No other objects, no text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/containers-microwave.webp` | MW black RE12–RE58, RO16–RO48, MW clear 500–2000 ml | Rows of empty black rectangular and round microwave containers with clear lids, stacked in neat towers of increasing height on the right side of the frame. |
| `public/media/subcategories/containers-bowls-cups.webp` | PP bowls 200–500 cc, PP portion cups 1 oz–100 cc | Clear and white round plastic bowls and tiny portion cups with lids arranged in a size gradient on the right side of the frame. |
| `public/media/subcategories/containers-meal-boxes.webp` | 2, 3, 5, 6 compartment boxes, plastic trays V1–V7 | Empty black compartment meal boxes with clear lids and white plastic serving trays laid out in a tidy grid on the right side, top-down angle. |
| `public/media/subcategories/containers-tubs-bottles.webp` | Round tubs 1–10 kg, chicken buckets, juice bottles, coconut containers | White round tubs with handles, a chicken bucket and clear square juice bottles standing in a row on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded, empty, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/containers/mw-black-rectangular.webp` | MW Black RE12–RE58 (all brands) | a black rectangular microwave container with its clear lid half open |
| `public/media/products/containers/mw-black-round.webp` | MW Black RO16–RO48 | a black round microwave container with a clear lid half open |
| `public/media/products/containers/mw-clear.webp` | MW Clear 500, 650, 750, 1000, 2000 ml | a clear rectangular microwave container with a clear lid |
| `public/media/products/containers/pp-bowl-clear.webp` | PP bowls clear 200–500 cc | a clear round plastic bowl with a clear lid |
| `public/media/products/containers/pp-bowl-white.webp` | PP bowls white 200–500 cc | a white round plastic bowl with a clear lid |
| `public/media/products/containers/portion-cup.webp` | PP cups 1 oz, 2 oz, 3.25 oz, 75 cc, 100 cc | three tiny clear and white sauce portion cups with lids |
| `public/media/products/containers/compartment-box.webp` | 2, 3, 5, 6 compartment containers, Cupco 3 section | a black 3-compartment meal box with a clear lid beside it |
| `public/media/products/containers/plastic-tray.webp` | Plastic trays IP and Jabiri V1–V7 | a white rectangular plastic serving tray |
| `public/media/products/containers/round-tub.webp` | Round tubs 1, 2, 10 kg with lid & handle | a white round plastic tub with a lid and metal handle |
| `public/media/products/containers/chicken-bucket.webp` | Chicken buckets 130 & 170 oz, chicken container small | a plain white paper chicken bucket with a lid |
| `public/media/products/containers/juice-bottle.webp` | Juice bottles square 200–1000 ml | clear square plastic juice bottles with white caps in three sizes |
| `public/media/products/containers/coconut-container.webp` | Coconut containers 8 & 12 oz | a clear round plastic dessert container with a domed lid |
| `public/media/products/containers/kraft-salad-bowl.webp` | Kraft salad bowl 500 ml | a brown kraft paper salad bowl with a clear lid |
| `public/media/products/containers/club-sandwich.webp` | Club box KT120, sandwich wedge | a clear hinged sandwich wedge box and a clear club sandwich box |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-containers.mp4` |
|---|---|

```
Slow top-down shot, single continuous take, static camera. Empty black takeaway containers with clear lids slide slowly and continuously across a bright pale mint surface like a gentle conveyor, evenly spaced, the centre of the frame always occupied, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "open" + "closed" (video-prompts.md §4)
- [ ] `category-containers.mp4` reversed + `npm run frames -- category-containers`
- [ ] `category-containers-mobile.mp4` (optional)
- [ ] `category-containers-burst.mp4` (optional)
- [ ] `subcategories/containers-microwave`
- [ ] `subcategories/containers-bowls-cups`
- [ ] `subcategories/containers-meal-boxes`
- [ ] `subcategories/containers-tubs-bottles`
- [ ] `products/containers/mw-black-rectangular`
- [ ] `products/containers/mw-black-round`
- [ ] `products/containers/mw-clear`
- [ ] `products/containers/pp-bowl-clear`
- [ ] `products/containers/pp-bowl-white`
- [ ] `products/containers/portion-cup`
- [ ] `products/containers/compartment-box`
- [ ] `products/containers/plastic-tray`
- [ ] `products/containers/round-tub`
- [ ] `products/containers/chicken-bucket`
- [ ] `products/containers/juice-bottle`
- [ ] `products/containers/coconut-container`
- [ ] `products/containers/kraft-salad-bowl`
- [ ] `products/containers/club-sandwich`
- [ ] `loops/quote-containers.mp4` (optional)
