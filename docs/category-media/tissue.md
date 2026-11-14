# Tissue & paper category page — media brief

Page: `/en/products/tissue` · 26 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

---

## 0. Hero film (scroll-scrubbed)

The same clip as the homepage chapter, so there's no extra work. Prompts, frame images and the reverse step are in [video-prompts.md §2](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-tissue.mp4` (optional `category-tissue-mobile.mp4`) |
| Then run | `ffmpeg -i category-tissue-raw.mp4 -vf reverse -an media-src/category-tissue.mp4` then `npm run frames -- category-tissue` |
| How it's used | Starts full screen with the crumpled tissue under the giant "Tissue." title. As you scroll it opens flat, the specs print onto the sheet, then the film shrinks into a framed panel beside the subcategory links. |

---

## 1. Burst (optional): tissue sheets flutter out of the film

| Save as | `media-src/category-tissue-burst.mp4` → `npm run frames -- category-tissue-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. A dozen single white tissue sheets and folded white napkins burst outward from the centre of the frame toward the camera and flutter gently across the whole frame, turning softly in the air like feathers. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus, realistic soft paper texture. No other objects, no text, no logos, no watermarks.
```
16:9, 8 s, 1080p. Plays over the first part of the hero scroll.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. The title and description sit in the **lower-left third**, so keep it plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/tissue-kitchen-rolls.webp` | Maxi rolls, auto-cut rolls, kitchen towel | A row of large white maxi rolls and kitchen towel rolls standing on a bright stainless steel kitchen shelf, one roll with a sheet pulled out and hanging, products on the right half of the frame. |
| `public/media/subcategories/tissue-washroom.webp` | Interfold, toilet rolls, maxi roll dispenser | A bright, modern white washroom counter with a stack of interfold paper towels and neatly stacked toilet rolls on the right side, soft daylight, plain white wall on the left. |
| `public/media/subcategories/tissue-table.webp` | Napkins, facial tissue, wet wipes | A restaurant table setting on the right side of the frame with folded white and black napkins, a facial tissue box without branding and a pack of wet wipes, bright daylight, plain pale background on the left. |

For loops, add: `Very slow, subtle motion only, static composition, perfectly seamless loop.`

---

## 3. Catalogue hover previews (product stills, 4:3)

Shown when hovering a product row. **Template** (swap the subject, + house style):
```
Studio packshot of [SUBJECT], unbranded, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/tissue/maxi-roll.webp` | Maxi Roll M05, M06, DM, stickered, glue-laminated MG05 | a large white embossed maxi roll standing upright with a hollow core |
| `public/media/products/tissue/autocut-roll.webp` | Autocut AC07, AC08, Maxi Roll Auto Cut | a white auto-cut hand towel roll with a smooth cut edge |
| `public/media/products/tissue/interfold.webp` | Interfold 1 ply, 2 ply, 150 sheets, side covered | a neat stack of white interfold paper hand towels with the top sheet slightly lifted |
| `public/media/products/tissue/toilet-roll.webp` | Toilet roll 100 and 300 sheets | a pyramid of six white toilet rolls |
| `public/media/products/tissue/napkin-white.webp` | Napkin white 30, 33, 40 cm | a fanned stack of folded white paper napkins |
| `public/media/products/tissue/napkin-black.webp` | Napkin black 40 cm | a fanned stack of folded black paper napkins |
| `public/media/products/tissue/facial-tissue.webp` | Facial tissue 200×2 ply, 500, 600 sheets | a plain white facial tissue box with one tissue popping up |
| `public/media/products/tissue/kitchen-towel.webp` | Kitchen towel | two white kitchen towel rolls, one partly unrolled |
| `public/media/products/tissue/wet-wipes.webp` | Wet wipes plain white | a small stack of individually wrapped plain white wet wipe sachets |
| `public/media/products/tissue/maxi-roll-dispenser.webp` | Dispenser maxi roll | a plain white wall-mounted centre-pull maxi roll dispenser |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-tissue.mp4` (no frames command; it plays as a video) |
|---|---|

```
Slow-motion close-up, single continuous take, static camera. Soft white tissue sheets float and turn gently downward through bright soft daylight against a clean pale blue-white background, the centre of the frame always interesting, perfectly seamless loop. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks.
```
16:9, 8 s, 1080p. Until this exists, the page uses the homepage `quote-loop`.

---

## Checklist

- [ ] Frame images "open" + "closed" (video-prompts.md §2)
- [ ] `category-tissue.mp4` reversed + `npm run frames -- category-tissue`
- [ ] `category-tissue-mobile.mp4` (optional)
- [ ] `category-tissue-burst.mp4` (optional)
- [ ] `subcategories/tissue-kitchen-rolls`
- [ ] `subcategories/tissue-washroom`
- [ ] `subcategories/tissue-table`
- [ ] `products/tissue/maxi-roll`
- [ ] `products/tissue/autocut-roll`
- [ ] `products/tissue/interfold`
- [ ] `products/tissue/toilet-roll`
- [ ] `products/tissue/napkin-white`
- [ ] `products/tissue/napkin-black`
- [ ] `products/tissue/facial-tissue`
- [ ] `products/tissue/kitchen-towel`
- [ ] `products/tissue/wet-wipes`
- [ ] `products/tissue/maxi-roll-dispenser`
- [ ] `loops/quote-tissue.mp4` (optional)
