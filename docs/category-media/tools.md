# Cleaning tools category page — media brief

Page: `/en/products/tools` · 26 active products

Every slot below shows a labelled placeholder on the dev server. Drop the file in with the exact name and refresh, and it appears (for videos, run the command shown).

## House style (append to every still prompt)

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood. Clean composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no faces.
```

---

## 0. Hero film (scroll-scrubbed)

Prompts and frame images are in [video-prompts.md §9](../video-prompts.md).

| | |
|---|---|
| Save as | `media-src/category-tools.mp4` (optional `category-tools-mobile.mp4`) |
| Then run | `npm run frames -- category-tools` (no reverse needed) |
| How it's used | Starts on a dusty floor under the giant "Tools." title. A flat mop sweeps across, and the tool list appears on the clean glossy floor. Then the film shrinks into a framed panel. |

---

## 1. Burst (optional): sponges and cloths tumble out

| Save as | `media-src/category-tools-burst.mp4` → `npm run frames -- category-tools-burst` |
|---|---|

```
Slow-motion high-speed shot, single continuous take, static camera. Yellow-and-green scrub sponges, folded red and blue microfiber cloths and steel scourers burst outward from the centre of the frame toward the camera, tumbling softly across the whole frame. Solid flat pure magenta chroma-key background (#FF00FF), even lighting, no shadows on the background. Bright soft key light, sharp focus, realistic textures. No other objects, no text, no logos, no watermarks.
```
16:9, 8 s, 1080p. This is why the key is magenta: green sponges would vanish on a green screen.

---

## 2. Subcategory banners (stills or 8 s loops)

**Aspect:** 21:9 wide. Keep the **lower-left third** plain and bright.

| Slot file | Covers | Prompt subject |
|---|---|---|
| `public/media/subcategories/tools-floor.webp` | Dust mop, clip mops, Kentucky mop head, mop bucket, floor wipers, floor machine pad | A single mop bucket with a wringer, a flat dust mop and a floor squeegee standing on a gleaming wet floor in a bright empty lobby, on the right side of the frame. |
| `public/media/subcategories/tools-brooms.webp` | Soft brooms, coco broom, dustpan sets | A soft broom, a flat coco broom and a dustpan set with a rubber edge leaning neatly against a bright white wall, on the right side of the frame. |
| `public/media/subcategories/tools-scrubbing.webp` | Sponges, scourers, steel wool, microfiber cloths, table wiper | Sponges, steel wool pads and folded microfiber cloths arranged by a stainless steel sink, water droplets, on the right side of the frame. |
| `public/media/subcategories/tools-bins-washroom.webp` | Pedal bins 30–120 L, toilet brush, window squeegee & washer, insect trap | Grey pedal bins of three sizes lined up in a bright back-of-house corridor beside a window squeegee on a hook, on the right side of the frame. |

---

## 3. Catalogue hover previews (product stills, 4:3)

**Template** (+ house style):
```
Studio packshot of [SUBJECT], unbranded, centred on a seamless off-white background, three-quarter view from slightly above, soft shadow, filling about 70% of the frame.
```

| Slot file | Products it covers | [SUBJECT] |
|---|---|---|
| `public/media/products/tools/dust-mop.webp` | Dust mop 60 cm | a flat 60 cm dust mop with a long handle, lying diagonally |
| `public/media/products/tools/clip-mop.webp` | Plastic clip mops 260 & 350 g, Kentucky mop head, plastic clip | a white cotton string mop head clipped to a green plastic mop holder |
| `public/media/products/tools/mop-bucket.webp` | Single mop bucket Delux 32 L | a yellow single mop bucket with a wringer |
| `public/media/products/tools/floor-wiper.webp` | Floor wipers 43–45 cm with stick | a rubber floor squeegee wiper on a wooden handle |
| `public/media/products/tools/broom.webp` | Soft brooms, coco broom 18" flat | a soft bristle broom and a flat coconut-fibre broom |
| `public/media/products/tools/dustpan.webp` | Dustpan set with TPR edge | an upright dustpan and brush set |
| `public/media/products/tools/sponge.webp` | Sponges, wave sponge | three yellow-and-green scrub sponges stacked |
| `public/media/products/tools/steel-wool.webp` | Steel scourer, steel wool GM45, paper card | stainless steel scourer balls and steel wool pads |
| `public/media/products/tools/microfiber.webp` | Microfiber cloths, red 40×40 cm | folded microfiber cloths in red, blue and yellow |
| `public/media/products/tools/pedal-bin.webp` | Garbage bins with pedal 30, 45, 68 L | a grey plastic pedal bin with the lid slightly open |
| `public/media/products/tools/wheelie-bin.webp` | Garbage bin with pedal & trolley 120 L | a large grey 120 L wheeled pedal bin |
| `public/media/products/tools/window-squeegee.webp` | Window squeegee & washer 35 cm | a 35 cm window squeegee beside a window washer sleeve |
| `public/media/products/tools/toilet-brush.webp` | Toilet brush with holder | a white toilet brush in its holder |
| `public/media/products/tools/insect-trap.webp` | Flying insect trap | a slim wall-mounted flying insect light trap |

---

## 4. Enquiry section loop (optional)

| Save as | `public/media/loops/quote-tools.mp4` |
|---|---|

```
Slow overhead shot, single continuous take, static camera. A white microfiber flat mop glides back and forth in slow, calm figure-eight strokes across a glossy light grey floor, leaving a soft fading sheen, the centre of the frame always occupied, perfectly seamless loop, no person visible. Bright high-key commercial look, crisp focus. No text, no logos, no watermarks.
```
16:9, 8 s, 1080p.

---

## Checklist

- [ ] Frame images "closed" + "open" (video-prompts.md §9)
- [ ] `category-tools.mp4` + `npm run frames -- category-tools`
- [ ] `category-tools-mobile.mp4` (optional)
- [ ] `category-tools-burst.mp4` (optional)
- [ ] `subcategories/tools-floor`
- [ ] `subcategories/tools-brooms`
- [ ] `subcategories/tools-scrubbing`
- [ ] `subcategories/tools-bins-washroom`
- [ ] `products/tools/dust-mop`
- [ ] `products/tools/clip-mop`
- [ ] `products/tools/mop-bucket`
- [ ] `products/tools/floor-wiper`
- [ ] `products/tools/broom`
- [ ] `products/tools/dustpan`
- [ ] `products/tools/sponge`
- [ ] `products/tools/steel-wool`
- [ ] `products/tools/microfiber`
- [ ] `products/tools/pedal-bin`
- [ ] `products/tools/wheelie-bin`
- [ ] `products/tools/window-squeegee`
- [ ] `products/tools/toilet-brush`
- [ ] `products/tools/insect-trap`
- [ ] `loops/quote-tools.mp4` (optional)
