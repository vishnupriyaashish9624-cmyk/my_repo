# Bags category page — media brief

Page: `/en/products/bags` · 63 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

The "Welcome" printed carry bags and printed paper bags need supplier photos. Generate plain bags only.

---

## 0. Hero film (scroll-scrubbed)

Prompts and frame images are in [video-prompts.md §6](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-bags.mp4` (optional `category-bags-mobile.mp4`) |
| Then run | `ffmpeg -i category-bags-raw.mp4 -vf reverse -an media-src/category-bags.mp4` then `npm run frames -- category-bags` |
| How it's used | Starts on a flat folded kraft bag under the giant "Bags." title. As you scroll the bag pops open and stands up while the bag types appear on the right, then the film shrinks into a framed panel. |

---

## 1. Burst (optional): bags float out

| Save as | `media-src/category-bags-burst.mp4` → `npm run frames -- category-bags-burst` |
|---|---|

```
Slow-motion shot, single continuous take, static camera. Several empty white plastic carry bags puffed up with air and a few small brown paper bags drift outward from the centre of the frame toward the camera, turning gently as if in a soft breeze. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus. No other objects, no text, no print, no logos, no watermarks.
```
16:9, 8 s, 1080p. White bags on magenta key cleanly; avoid clear bags here, because they turn magenta-tinted.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/bags-carry.webp` | Carry bags white, clear, reusable, recycled colours | White and softly coloured blue, green, red and yellow plastic carry bags hanging in a neat row from a steel rail on the right side of the frame. |
| `public/media/subcategories/bags-paper-kraft.webp` | Kraft bags, twist-handle bags, paper bags No.0–5, fries and burger pouches | Plain brown kraft carry bags with twisted handles and flat white and brown paper bags in graded sizes standing on a light wooden counter on the right side of the frame. |
| `public/media/subcategories/bags-garbage.webp` | Garbage bags 50×60 to 110×130, HD bags | Rolls and neatly folded black and white garbage bags beside a grey pedal bin with a fresh liner fitted, on the right side of the frame. |
| `public/media/subcategories/bags-food-grade.webp` | Smoky bags clear & milky, clear TP bags | Small clear and milky food bags, a few filled with bread rolls and sliced vegetables, laid out on a white counter on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded and unprinted, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/bags/carry-white.webp` | Carry bag white mini small – large, STP, reusable | a plain white plastic T-shirt carry bag slightly puffed open |
| `public/media/products/bags/carry-clear.webp` | Carry bag clear small – large | a clear plastic T-shirt carry bag slightly puffed open |
| `public/media/products/bags/carry-recycled.webp` | Recycled blue, green, red, yellow | four plastic carry bags in soft blue, green, red and yellow, overlapping |
| `public/media/products/bags/kraft-flat.webp` | Kraft bag brown small, medium, large, jumbo | a plain brown kraft paper carry bag with flat handles |
| `public/media/products/bags/kraft-twist.webp` | Kraft bags with twist handle | a plain brown kraft paper carry bag with twisted paper handles |
| `public/media/products/bags/paper-bag.webp` | Paper bags No.0–No.5, plain white and brown | three flat-bottom paper bags in white and brown, small to large |
| `public/media/products/bags/garbage-black.webp` | Garbage bags 65×95 – 110×130 | a roll of black garbage bags with one bag partly pulled off |
| `public/media/products/bags/garbage-white.webp` | Garbage bag white 50×60 | a roll of white garbage bags |
| `public/media/products/bags/smoky-bag.webp` | Smoky bags clear & milky 6×9, 8×12 | small clear and milky flat food bags fanned out |
| `public/media/products/bags/tp-bag.webp` | Clear plain TP bags 4×5 – 10×14 | a stack of clear flat plastic bags in graded sizes |
| `public/media/products/bags/food-pouch.webp` | French fries pouch, paper burger pouch | a plain white paper fries pouch and a paper burger pouch |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-bags.mp4` |
|---|---|

```
Slow-motion shot, single continuous take, static camera. A single empty white plastic carry bag floats and turns slowly in a soft breeze against a bright pale blue-white background, staying near the centre of the frame, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no print, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "open" + "closed" (video-prompts.md §6)
- [ ] `category-bags.mp4` reversed + `npm run frames -- category-bags`
- [ ] `category-bags-mobile.mp4` (optional)
- [ ] `category-bags-burst.mp4` (optional)
- [ ] `subcategories/bags-carry`
- [ ] `subcategories/bags-paper-kraft`
- [ ] `subcategories/bags-garbage`
- [ ] `subcategories/bags-food-grade`
- [ ] `products/bags/carry-white`
- [ ] `products/bags/carry-clear`
- [ ] `products/bags/carry-recycled`
- [ ] `products/bags/kraft-flat`
- [ ] `products/bags/kraft-twist`
- [ ] `products/bags/paper-bag`
- [ ] `products/bags/garbage-black`
- [ ] `products/bags/garbage-white`
- [ ] `products/bags/smoky-bag`
- [ ] `products/bags/tp-bag`
- [ ] `products/bags/food-pouch`
- [ ] `loops/quote-bags.mp4` (optional)
