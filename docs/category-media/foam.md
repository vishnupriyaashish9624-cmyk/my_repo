# Foam & plates category page — media brief

Page: `/en/products/foam` · 16 foam products (plus paper and plastic plates, dinner and snack boxes)

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

White foam on an off-white background can disappear. Ask for **a slightly deeper pale blue-grey background** in these prompts if the edges get lost.

---

## 0. Hero film (scroll-scrubbed)

Prompts and frame images are in [video-prompts.md §11](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-foam.mp4` (optional `category-foam-mobile.mp4`) |
| Then run | `ffmpeg -i category-foam-raw.mp4 -vf reverse -an media-src/category-foam.mp4` then `npm run frames -- category-foam` |
| How it's used | Starts on a closed foam hamburger box under the giant "Foam." title. As you scroll the lid swings open while the plate and tray sizes appear on the right. Then the film shrinks into a framed panel. |

---

## 1. Burst (optional): plates spin out

| Save as | `media-src/category-foam-burst.mp4` → `npm run frames -- category-foam-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. Round white foam plates, white paper plates and small white foam bowls burst outward from the centre of the frame toward the camera, spinning slowly like frisbees across the whole frame. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus, visible foam bead texture. No other objects, no text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/foam-plates-bowls.webp` | Foam plates 7–10", foam bowls 6 & 8 oz, foam cups, paper & plastic plates | Tall neat stacks of white foam plates, paper plates and small foam bowls at different heights on a pale blue-grey counter, on the right side of the frame. |
| `public/media/subcategories/foam-boxes-trays.webp` | Hamburger boxes, hot dog box, lunch boxes LB1/LB2, trays S1–JB2, 5-compartment tray | Open white foam hamburger boxes, lunch boxes and compartment trays arranged in a neat grid, top-down, on the right side of the frame. |
| `public/media/subcategories/foam-paper-boxes.webp` | Dinner box, snack box, paper and kraft burger boxes, meal boxes | Plain white paper dinner boxes, a small snack box and kraft burger boxes, some open, stacked on a bright counter on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded and unprinted, empty, centred on a seamless pale blue-grey background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/foam/foam-plate.webp` | Foam plates 7, 9, 10 inch, loose and packed | a short stack of round white foam plates |
| `public/media/products/foam/foam-bowl.webp` | Foam bowls 6 & 8 oz, foam cup 6 oz | two small white foam bowls and a foam cup |
| `public/media/products/foam/hamburger-box.webp` | Foam hamburger box HB2, small | an open white foam hamburger clamshell box |
| `public/media/products/foam/hot-dog-box.webp` | Foam hot dog box medium | an open long white foam hot dog clamshell |
| `public/media/products/foam/lunch-box.webp` | Foam lunch box LB1, LB2 large | an open large white foam hinged lunch box |
| `public/media/products/foam/foam-tray.webp` | Foam trays S1, S1/2, M2, M13, D18, JB2 | three shallow white foam meat trays in different sizes |
| `public/media/products/foam/compartment-tray.webp` | Foam tray 5 compartment | a white foam 5-compartment meal tray |
| `public/media/products/foam/paper-plate.webp` | Paper plates 7 & 9 inch, Supreme | a short stack of round white paper plates |
| `public/media/products/foam/plastic-plate.webp` | Plastic plates 7 & 9 inch, plastic bowl 12 oz | round white plastic plates and a white plastic bowl |
| `public/media/products/foam/dinner-box.webp` | Dinner box, meal box | a plain white paper meal box with the lid open |
| `public/media/products/foam/snack-box.webp` | Snack box | a small plain white paper snack box |
| `public/media/products/foam/paper-burger-box.webp` | Paper burger box, kraft burger box HB-2 | a white paper burger box beside a kraft burger box |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-foam.mp4` |
|---|---|

```
Slow top-down shot, single continuous take, static camera. White foam plates slide gently one onto another, building a neat stack in the centre of a pale blue-grey surface, then the stack glides softly out of frame as the next begins, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks, no hands.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "open" + "closed" (video-prompts.md §11)
- [ ] `category-foam.mp4` reversed + `npm run frames -- category-foam`
- [ ] `category-foam-mobile.mp4` (optional)
- [ ] `category-foam-burst.mp4` (optional)
- [ ] `subcategories/foam-plates-bowls`
- [ ] `subcategories/foam-boxes-trays`
- [ ] `subcategories/foam-paper-boxes`
- [ ] `products/foam/foam-plate`
- [ ] `products/foam/foam-bowl`
- [ ] `products/foam/hamburger-box`
- [ ] `products/foam/hot-dog-box`
- [ ] `products/foam/lunch-box`
- [ ] `products/foam/foam-tray`
- [ ] `products/foam/compartment-tray`
- [ ] `products/foam/paper-plate`
- [ ] `products/foam/plastic-plate`
- [ ] `products/foam/dinner-box`
- [ ] `products/foam/snack-box`
- [ ] `products/foam/paper-burger-box`
- [ ] `loops/quote-foam.mp4` (optional)
