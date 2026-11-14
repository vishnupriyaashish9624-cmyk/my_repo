# Section image and loop prompts (Google Flow)

Every image on the homepage outside the scroll films comes from a **media slot**: a file at a fixed path in `public/media/`. Drop a file in and the site picks it up on refresh. There's nothing to run.

- **Still:** `public/media/<slot>.webp` (or `.jpg` / `.png`)
- **Animated loop:** `public/media/<slot>.mp4`. If both exist, the loop plays and the still is used as its poster.

Slots without a file show a placeholder in development, labelled with the slot name.

The **start and end frame images for the scroll films** are in [video-prompts.md](video-prompts.md), next to each film. Category page images (subcategory banners, product stills) are in [category-media/](category-media/).

---

## House style (append to every prompt)

Everything should look like one commissioned shoot, not a stock collection:

```
Bright, high-key commercial product photography for a food-service packaging and hygiene supplier. Soft diffused daylight from the top left, seamless off-white background with a faint cool blue tint, gentle soft shadows, crisp focus, true-to-life colours, clean and hygienic mood, shot on medium format, 50mm lens. Clean, uncluttered composition with generous negative space. No text, no logos, no brand names, no labels, no watermarks, no people's faces.
```

**For animated loops** (Flow video, 8 s), add:

```
Very slow, subtle motion only (gentle camera push-in, drifting soap bubbles or a slow light sweep), static composition, perfectly seamless loop.
```

**Never generate branded products.** Some of the products are other companies' brands (Dettol, Clorox, Harpic, Purell, Lux, JIF, and packaging from Ducon, Evopack, Prestige, Hotpack). Use the supplier's own packshots for those, or show an unbranded equivalent.

---

## 1. Category rail — `public/media/categories/<slug>`

The sideways-scrolling rail of all 10 categories. **Aspect:** 4:5 portrait. The category name and count sit **below** the image, but keep the **top 20% plain** for the slot badge.

| Slot | Prompt subject (+ house style) |
|---|---|
| `categories/containers` | A neat hero group of unbranded black rectangular and round microwave takeaway containers with clear lids, two clear PP bowls and a small black 3-compartment box, on a pale blue-grey seamless background, three-quarter view from above. |
| `categories/bags` | White plastic carry bags, brown kraft paper bags with twisted handles and a roll of black garbage bags, arranged as a small upright group on a soft mint seamless background. |
| `categories/cups` | A grouping of plain white paper cups in three sizes, a rippled black paper cup, a clear PET cold cup with a dome lid and a few paper-wrapped straws, on a cool white seamless background. |
| `categories/ppe` | Black and clear disposable gloves, a blue hair net, a folded white plastic apron and a fan of black plastic spoons and forks, neatly arranged flat lay on a pale grey-blue background. |
| `categories/chemicals` | Plain white 5 L jerry cans and 500 ml pump bottles with navy and green caps, no labels, grouped on a pale sky-blue seamless background. |
| `categories/wraps` | A cling film roll, a stack of white greaseproof sandwich paper sheets, a stretch film roll and a few thermal bill rolls, on a warm light stone surface. |
| `categories/aluminium` | A silver aluminium foil roll, aluminium takeaway containers with cardboard lids stacked, and a large aluminium platter, on a cool light grey seamless background. |
| `categories/tissue` | A white maxi roll, a stack of interfold paper towels, two toilet rolls and folded white and black napkins, on a white seamless background. |
| `categories/tools` | A white flat microfiber mop, a soft broom, a window squeegee, yellow-and-green sponges and a grey pedal bin, arranged as a tidy group on a soft mint background. |
| `categories/foam` | White foam plates in a short stack, an open white foam hamburger box and white foam food trays, on a cool white seamless background. |

---

## 2. Who orders from us — `public/media/industries/<slug>`

Cards in a 3-column grid. **Aspect:** 16:10. The title sits below the image, so the whole image can be used. Loops work well here.

These show people's hands but **no faces in focus**:

| Slot | Prompt subject |
|---|---|
| `industries/restaurant` | A bright cloud kitchen pass: hands (no faces) pressing clear lids onto black takeaway containers and packing them into white carry bags, stainless steel counter, soft daylight. |
| `industries/cafe` | A bright café counter with a row of white paper cups, clear iced drinks in PET cups with dome lids and paper-wrapped straws, a blurred barista in the background. |
| `industries/bakery` | Hands (no faces) wrapping fresh croissants in greaseproof sandwich paper next to brown kraft bags on a light wooden counter, morning light. |
| `industries/hotel` | A bright hotel breakfast buffet with aluminium platters, folded white napkins and a pump hand-wash bottle without a label, softly out of focus in the background. |
| `industries/facility` | A tidy cleaning trolley in a bright modern office corridor with a mop bucket, black garbage bags, maxi rolls and plain white 5 L cleaner cans. |
| `industries/salon` | A clean salon station with black nitrile gloves, a disposable white plastic apron, a pack of wet wipes and a hair net laid out neatly, soft daylight. |

**For loops** (optional), add: `Very slow, subtle motion only, static composition, perfectly seamless loop.`

---

## 3. Social share image — `public/media/social/og`

Used when the site is shared on WhatsApp, LinkedIn and so on. **Aspect:** 1200×630 (1.91:1). The Klen Plus logo is added on top in code, so **keep the left 45% plain**.

```
A neat flat lay on the right half of a pale blue-white surface: an aluminium foil roll, a black takeaway container with a clear lid, white paper cups, folded white napkins, a black nitrile glove and a white spray bottle without a label, a few iridescent soap bubbles. The left 45% of the frame is completely plain. + house style
```

---

## 4. Brand texture tiles (optional) — `public/media/textures/<slug>`

Subtle backgrounds for section panels and loading states. **Aspect:** 1:1, 2048 px, tileable.

| Slot | Prompt |
|---|---|
| `textures/tissue` | Macro texture of white embossed quilted tissue paper, even soft lighting, seamless tileable pattern, no shadows. |
| `textures/foil` | Macro texture of lightly crinkled aluminium foil, soft cool reflections, seamless tileable pattern. |
| `textures/glass` | A clean glass surface with a scatter of small water droplets, bright white background, seamless tileable pattern. |

---

## Tips for Flow

- **Consistent look:** generate one image you like, then use it as a **style reference** for the rest.
- **Film frames:** generate the "closed" and "open" frames from the same seed or reference image, so the surface, lighting and position match exactly.
- **Export:** download at the highest resolution available. A still roughly 2000 px on its long side is plenty.
- **File names must match the slot exactly**, e.g. `tissue.webp`. Watch for Windows adding a double extension like `tissue.webp.png`.
- **Size:** JPG and PNG work, but WebP is much smaller.
