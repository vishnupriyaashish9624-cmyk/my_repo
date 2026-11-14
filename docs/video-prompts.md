# Scroll-film video prompts (Google Flow / Veo)

The homepage is built around **scroll films**. Scrolling plays each clip frame by frame, and the text is real HTML placed on top at set points. There is one hero film, and each category gets its own **chapter film** in which the product "opens" (the tissue uncrumples, the foil unrolls, the lid lifts…) while its details appear.

| Clip file (put in `media-src/`) | Where it plays | Aspect |
|---|---|---|
| `hero.mp4` / `hero-mobile.mp4` | Hero (opening film) | 16:9 / 9:16 |
| `category-<slug>.mp4` / `category-<slug>-mobile.mp4` | Category chapter on the homepage **and** the hero of that category's page | 16:9 / 9:16 |
| `item-<name>.mp4` | Travelling products (magenta-screen turntables, cut out automatically) | 1:1 or 16:9 |
| `public/media/loops/quote-loop.mp4` | Ambient loop behind the quote form (plays normally) | 16:9 |

Category slugs: `tissue`, `aluminium`, `containers`, `cups`, `bags`, `wraps`, `chemicals`, `tools`, `ppe`, `foam`.

After adding clips to `media-src/`, run:

```bash
npm run frames
```

This converts each clip into WebP frames in `public/media/films/<name>/`, and the site picks them up automatically. Mobile versions are optional; without them, phones use the desktop frames cropped to fit.

---

## Rules that make a clip scrub well

Scroll-scrubbing plays the video **forwards and backwards** at the visitor's pace, so:

1. **One continuous shot, no cuts.** A cut becomes a jarring jump when scrolling.
2. **Locked-off camera** for chapter films (the text has to land on the product). The hero may use a slow, steady dolly.
3. **Lighting must not change.** Brightness flicker is very visible on a light site.
4. **No text, logos or brand labels.** All copy is HTML on top. Flow garbles lettering, and you can't show other companies' brands (Dettol, Ducon…) as your own.
5. **Keep the text zones plain and bright.** Each chapter lists where its text sits.
6. **Same look across all clips.** Use the style line below in every prompt (it's already included in the prompts in this file).
7. Generate at **1080p, 8 seconds**. Always use **Frames to Video** with the two frame images given, so the product ends exactly where the text expects it.

**Shared style line:**

> Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.

---

## How every category chapter plays

Each chapter is **4 screens of scroll** mapped to **192 frames** (8 s × 24 fps). The footage has to follow this rhythm:

| Scroll | Clip time | Footage | Text on screen |
|---|---|---|---|
| 0–10% | 0–1 s | **Closed / crumpled / dirty**, completely still | Giant category title, bottom left |
| 10–60% | 1–5 s | **The opening motion** | One-line hook on the right (24–52%) |
| 60–100% | 5–8 s | **Open / flat / clean**, completely still (a slow 6% push-in is added in code) | Specs appear on or beside the product (58%+), then the chips and button (76%+) |

The **bottom 25% of the frame** must stay plain surface in every chapter; the button row and progress rail sit there.

### The reverse trick
Opening motions (paper uncrumpling, a bag popping open, a lid lifting) look fake when generated directly. Closing motions look natural. So for chapters marked **Reverse: yes**, generate the *closing* motion with this timing instead:

> still for 3 s → motion for 4 s → still for 1 s

then flip it before running the frames script:

```bash
ffmpeg -i category-tissue-raw.mp4 -vf reverse -an media-src/category-tissue.mp4
```

After reversing, it follows the 1 s / 4 s / 3 s rhythm above.

**Frame naming in this file:** *Frame "open"* is how the chapter **ends** on the site and *Frame "closed"* is how it **starts**. Generate both as images first (the image prompts are included in each chapter below).

---

## 1. `hero` — Opening film

Overlay timing: headline (0–28%) → "443 products, one supplier" (34–62%, right) → "Priced by the carton" with the quote button (68–100%, left).

The headline sits in the **lower-left third**. Keep that area plain bright counter and wall.

**Frame "start" image:**
```
Wide shot of an empty pristine white quartz kitchen counter against a seamless pale blue-white wall, a few translucent iridescent soap bubbles floating in the air, the lower-left third of the frame plain and uncluttered, soft morning daylight. Bright high-key commercial product photography, clean and hygienic mood, gentle soft shadows, crisp focus, 50mm lens. No text, no logos, no labels, no watermarks, no people.
```

**Frame "end" image:**
```
Same camera angle and counter. The right two-thirds of the counter is now neatly styled with unbranded commercial food-service supplies: a silver aluminium foil roll, a black rectangular takeaway container with a clear lid, a stack of plain white paper cups, folded white napkins, a clear PET cup with a dome lid and a plain white spray bottle. A few iridescent soap bubbles float around them. The lower-left third of the frame stays plain and uncluttered. Bright high-key commercial product photography, gentle soft shadows, crisp focus, 50mm lens. No text, no logos, no labels, no watermarks, no people.
```

**Video prompt (Frames to Video, start → end, 16:9):**
```
Single continuous take, no cuts. Very slow, perfectly steady dolly-in toward a white kitchen counter. One after another, unbranded food-service products settle gently onto the right side of the counter as if placed by an invisible hand: the foil roll first, then the black takeaway container, the paper cups, the folded napkins, the clear dome-lid cup and the spray bottle. Soap bubbles drift slowly upward throughout. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Constant slow camera speed, no flicker. The final second is completely still. No hands, no people, no text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** same prompts with `Vertical 9:16 framing, products grouped in the upper half, lower third plain.` added at the end.

---

## 2. `category-tissue` — Crumpled tissue opens into a flat sheet

| | |
|---|---|
| Save as | `media-src/category-tissue.mp4` (+ `category-tissue-mobile.mp4`) |
| Reverse | **Yes**: generate flat → crumpled |
| Text lands | Specs are printed **on the flat sheet**. The sheet must be landscape, centred, with its centre 44% from the top and a height of about 60% of the frame. |

**Frame "open" (flat sheet, how it ends):**
```
Perfectly overhead top-down view of a single sheet of soft white 2-ply tissue paper lying flat on a smooth pale blue-grey matte surface. The sheet is landscape, about 60% of the frame height, centred horizontally with its centre slightly above the middle of the frame. Faint quilted emboss texture, two very soft fold creases, gentle even shadow at its edges, plenty of empty surface around it, especially along the bottom. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Frame "closed" (crumpled ball, how it starts):**
```
The same perfectly overhead view and the same pale blue-grey matte surface. The same white tissue sheet is now crumpled into a loose, soft, airy ball about the size of a fist, sitting at the same centre point slightly above the middle of the frame, soft folds catching the light, gentle shadow underneath, plenty of empty surface around it. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Video prompt (Frames to Video: open → closed, then reverse):**
```
Completely static overhead camera, single continuous shot. For the first 3 seconds the flat white tissue sheet lies perfectly still. Then, with no hands and nothing visible touching it, the sheet slowly gathers in on itself from all four edges toward its centre, folding and creasing softly with realistic delicate paper physics, until it is a loose soft ball in the same spot. The last second is completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** add `Vertical 9:16 frame; the flat sheet is portrait, about 70% of the frame width, centred 42% from the top.`

---

## 3. `category-aluminium` — Foil roll unrolls across the counter

| | |
|---|---|
| Save as | `media-src/category-aluminium.mp4` |
| Reverse | No |
| Text lands | Specs appear **on the foil sheet**, uncovered as it rolls out. The roll sits at the left edge; the sheet runs to about 95% of the frame width as a horizontal band centred 44% from the top and about 46% of the frame height. |

**Frame "closed" (full roll, how it starts):**
```
Perfectly overhead top-down view of a light grey stone kitchen counter. A full roll of silver aluminium foil with a brown cardboard core lies at the far left edge of the frame, its length running from top to bottom, taking up about 46% of the frame height, centred slightly above the middle. The rest of the counter to the right is empty. Bright high-key commercial product photography, soft even daylight, gentle soft shadows, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Frame "open" (sheet unrolled, how it ends):**
```
The same overhead view and counter. The foil roll, slightly thinner, is still at the far left edge, and a long smooth sheet of shiny aluminium foil is unrolled flat across the counter to about 95% of the frame width, forming a horizontal band about 46% of the frame height, centred slightly above the middle. Soft gentle crinkles catch soft highlights, clean torn edge on the right. Plain counter above and below the sheet. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Video prompt (Frames to Video: closed → open):**
```
Completely static overhead camera, single continuous shot. For the first second the foil roll lies still at the left edge. Then, with no hands, the roll turns in place and a shiny aluminium foil sheet unrolls smoothly across the counter from left to right at a steady speed over about 4 seconds, soft highlights gliding across the metal and realistic gentle crinkles forming. The last 3 seconds are completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** add `Vertical 9:16 frame; the roll lies across the top edge and the foil unrolls downward to about 75% of the frame height.` (On mobile the specs sit on the lower part of the sheet.)

---

## 4. `category-containers` — The lid lifts off a black takeaway container

| | |
|---|---|
| Save as | `media-src/category-containers.mp4` |
| Reverse | **Yes**: generate the lid pressing down and clicking shut |
| Text lands | The container sits **left of centre** (centre about 36% from the left, 48% from the top). Specs appear in the **right 40%**, so keep it plain background. |

**Frame "open" (lid floating above, how it ends):**
```
Three-quarter front view at eye level, slightly from above, of an empty black rectangular microwave-safe plastic takeaway container, centred at about 36% from the left of the frame. Its clear transparent snap-on lid floats about a hand's height above it, tilted slightly. Soft mint-white seamless background, the right 40% of the frame completely empty, gentle soft shadow under the container. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands, no food.
```

**Frame "closed" (lid on, how it starts):**
```
The same camera angle, background and position. The same black rectangular takeaway container now has its clear lid snapped firmly shut on top. The right 40% of the frame is completely empty. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands, no food.
```

**Video prompt (Frames to Video: open → closed, then reverse):**
```
Completely static camera, single continuous shot. For the first 3 seconds the clear lid floats perfectly still above the empty black takeaway container. Then, with no hands, the lid slowly levels out, lowers straight down and presses gently onto the container, snapping shut with a tiny settle, over about 4 seconds. The last second is completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale mint tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No food, no text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** add `Vertical 9:16 frame; the container is centred horizontally in the upper half, the lower half plain.`

---

## 5. `category-cups` — A stack of cups fans out into a row of sizes

| | |
|---|---|
| Save as | `media-src/category-cups.mp4` |
| Reverse | **Yes**: generate a row of cups gliding together into one nested stack |
| Text lands | The row of 5 cups sits across the middle, with the cup bases on a line 55% from the top. **Size labels** appear under each cup, so keep the band between 58% and 70% plain. |

**Frame "open" (row of sizes, how it ends):**
```
Straight-on side view at table height. Five unbranded cups stand in an evenly spaced horizontal row across the middle of the frame, ordered from smallest to largest left to right: a tiny 4 oz white paper cup, a 6 oz white paper cup, an 8 oz rippled black paper cup, a 12 oz white paper cup, and a tall clear PET cold cup with a dome lid. All their bases sit on the same line slightly below the middle of the frame. Seamless cool white background and surface, plain empty band directly under the cups, soft reflections. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Frame "closed" (single stack, how it starts):**
```
The same straight-on side view, background and surface. The same five cups are now nested and stacked into one neat tower in the centre of the frame, largest clear PET cup outermost with its dome lid on top, bases on the same line slightly below the middle. Plain empty space on both sides. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Video prompt (Frames to Video: open → closed, then reverse):**
```
Completely static camera, single continuous shot. For the first 3 seconds the five cups stand still in a row. Then, with no hands, the cups glide smoothly toward the centre one after another and nest neatly inside each other into a single tower, as if weightless, over about 4 seconds, the dome lid settling on top last. The last second is completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** row layouts don't fit vertically. Use `Vertical 9:16 frame; the cups end in two rows (three on top, two below) in the upper 65% of the frame.`

---

## 6. `category-bags` — A flat kraft bag pops open

| | |
|---|---|
| Save as | `media-src/category-bags.mp4` |
| Reverse | **Yes**: generate the open bag folding down flat |
| Text lands | The bag stands **left of centre** (centre about 36% from the left). Specs appear in the **right 40%**. |

**Frame "open" (standing bag, how it ends):**
```
Straight-on front view at table height. A plain brown kraft paper carry bag with twisted paper handles stands fully open and upright on a seamless soft mint background, centred at about 36% from the left of the frame, gusset expanded, handles upright, realistic paper texture and fibres. The right 40% of the frame is completely empty. Gentle soft shadow. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no print, no labels, no watermarks, no hands.
```

**Frame "closed" (flat bag, how it starts):**
```
The same camera angle, background and position. The same brown kraft paper bag now lies folded completely flat against the surface, its gusset tucked in and handles folded down, as it comes from the pack. The right 40% of the frame is completely empty. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no print, no labels, no watermarks, no hands.
```

**Video prompt (Frames to Video: open → closed, then reverse):**
```
Completely static camera, single continuous shot. For the first 3 seconds the open kraft paper bag stands perfectly still. Then, with no hands, the bag slowly collapses: its sides fold inward along the gusset creases, the bottom folds up and the handles fold down, until it lies flat, over about 4 seconds, with realistic crisp paper physics. The last second is completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale mint tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no print, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** add `Vertical 9:16 frame; the bag is centred horizontally in the upper half, the lower half plain.`

---

## 7. `category-wraps` — Cling film stretches over a bowl

| | |
|---|---|
| Save as | `media-src/category-wraps.mp4` |
| Reverse | No |
| Text lands | The bowl and roll sit **left of centre**. Specs appear in the **right 40%**. |

**Frame "closed" (no film, how it starts):**
```
Three-quarter view from slightly above of a white kitchen counter. On the left side of the frame, a large roll of clear cling film lies beside a plain white ceramic bowl filled with fresh green salad, the bowl centred at about 36% from the left. The right 40% of the frame is plain empty counter and pale blue-white wall. Bright high-key commercial product photography, soft even daylight, gentle soft shadows, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Frame "open" (bowl sealed, how it ends):**
```
The same view, counter and positions. A sheet of clear cling film is now stretched perfectly taut over the top of the white salad bowl, trailing back to the roll, catching soft rainbow sheen and a clean highlight. The right 40% of the frame stays plain and empty. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Video prompt (Frames to Video: closed → open):**
```
Completely static camera, single continuous shot. For the first second everything is still. Then, with no hands, a sheet of clear cling film peels off the roll, floats across and settles over the white salad bowl, wrinkles smoothing out as it pulls perfectly taut, over about 4 seconds, soft rainbow sheen gliding across the film. The last 3 seconds are completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** add `Vertical 9:16 frame; bowl and roll in the upper half, lower half plain counter.`

---

## 8. `category-chemicals` — A squeegee clears misted glass

| | |
|---|---|
| Save as | `media-src/category-chemicals.mp4` |
| Reverse | No |
| Text lands | Behind the glass, **centred**, uncovered by the blade. The glass fills the whole frame, so the background behind it must be plain, bright and slightly out of focus. |

**Frame "closed" (dirty glass, how it starts):**
```
Straight-on front view of a large clear glass panel that fills the entire frame, covered evenly with soap film, water spots, smears and a hazy grey-beige grime. Behind the glass is a plain, bright, very softly out-of-focus pale blue-white background with nothing recognisable. Bright high-key commercial product photography, soft even daylight, crisp focus on the glass surface. No text, no logos, no labels, no watermarks, no hands, no tools.
```

**Frame "open" (clean glass, how it ends):**
```
The same straight-on view. The glass panel is now perfectly clean and fully transparent, with only a thin line of tiny water droplets along the far right edge. The plain, bright, softly out-of-focus pale blue-white background shows clearly through it. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands, no tools.
```

**Video prompt (Frames to Video: closed → open):**
```
Completely static camera, single continuous shot. For the first second the grimy glass is still. Then a navy blue squeegee with a green rubber blade, held from off-frame with no hands visible, enters from the left edge and sweeps across the whole glass in one smooth, steady horizontal pass over about 4 seconds, leaving it crystal clear behind the blade, tiny droplets beading along the blade edge and a fine mist in the air. The blade exits the right edge and the last 3 seconds are completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** same prompts with `Vertical 9:16 frame.` The blade still sweeps left to right.

---

## 9. `category-tools` — A mop leaves a clean, glossy path

| | |
|---|---|
| Save as | `media-src/category-tools.mp4` |
| Reverse | No |
| Text lands | On the clean floor, **centred**. The mop sweeps the full width, just like the squeegee. |

**Frame "closed" (dusty floor, how it starts):**
```
Perfectly overhead top-down view of large light grey glossy floor tiles filling the entire frame, evenly covered with a thin layer of dust, a few dusty shoe prints and faint dull smears. Bright high-key commercial photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no people, no tools.
```

**Frame "open" (clean floor, how it ends):**
```
The same overhead view of the same light grey tiles, now spotless and glossy, softly reflecting the daylight, with a faint fresh damp sheen along the right edge. Bright high-key commercial photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no people, no tools.
```

**Video prompt (Frames to Video: closed → open):**
```
Completely static overhead camera, single continuous shot. For the first second the dusty floor is still. Then a white rectangular microfiber flat mop head on a navy handle, with no person visible, enters from the left edge and glides across the whole floor in one smooth, steady pass to the right over about 4 seconds, leaving the tiles spotless and glossy behind it with a faint damp sheen that dries. The mop exits the right edge and the last 3 seconds are completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean light grey and pale blue tones, soft even daylight that never changes, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** same prompts with `Vertical 9:16 frame.`

---

## 10. `category-ppe` — A glove fills with air and stands up

| | |
|---|---|
| Save as | `media-src/category-ppe.mp4` |
| Reverse | No |
| Text lands | The glove is **left of centre**. Specs appear in the **right 40%**. |

**Frame "closed" (flat glove, how it starts):**
```
Three-quarter view from slightly above of a single black nitrile disposable glove lying completely flat on a seamless cool white surface, centred at about 36% from the left of the frame, fingers together. The right 40% of the frame is completely empty. Bright high-key commercial product photography, soft even daylight, gentle soft shadows, crisp focus on the textured fingertips. No text, no logos, no labels, no watermarks, no hands.
```

**Frame "open" (inflated glove, how it ends):**
```
The same view, surface and position. The same black nitrile glove is now gently inflated with air like a soft balloon, standing upright on its cuff with its fingers spread open like a wave, textured fingertips catching the light. The right 40% of the frame stays completely empty. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands.
```

**Video prompt (Frames to Video: closed → open):**
```
Completely static camera, single continuous shot. For the first second the flat black nitrile glove lies still. Then, with no hands, it slowly fills with air from the cuff, the palm and each finger puffing up one after another, and it rises gently upright onto its cuff with fingers spread, over about 4 seconds, with a soft final settle. The last 3 seconds are completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** add `Vertical 9:16 frame; the glove is centred horizontally in the upper half.`

---

## 11. `category-foam` — A foam clamshell box opens

| | |
|---|---|
| Save as | `media-src/category-foam.mp4` |
| Reverse | **Yes**: generate the open box closing shut |
| Text lands | The box sits **left of centre**. Specs appear in the **right 40%**. |

**Frame "open" (lid open, how it ends):**
```
Three-quarter view from slightly above of an empty white foam hamburger clamshell box with its lid hinged fully open, centred at about 36% from the left of the frame, on a seamless cool white surface with a faint blue tint. Fine foam bead texture visible. The right 40% of the frame is completely empty. Gentle soft shadow. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands, no food.
```

**Frame "closed" (lid shut, how it starts):**
```
The same view, surface and position. The same white foam hamburger box is now closed, its lid clicked shut. The right 40% of the frame is completely empty. Bright high-key commercial product photography, soft even daylight, crisp focus. No text, no logos, no labels, no watermarks, no hands, no food.
```

**Video prompt (Frames to Video: open → closed, then reverse):**
```
Completely static camera, single continuous shot. For the first 3 seconds the open foam clamshell box is still. Then, with no hands, the lid swings slowly closed on its hinge and clicks shut with a tiny settle, over about 4 seconds. The last second is completely still. Bright high-key commercial product film for a food-service packaging and hygiene supplier: clean off-white and pale blue tones, soft even daylight from the top left that never changes, gentle soft shadows, crisp focus, true-to-life colours, 50mm lens. Completely static locked-off camera, perfectly smooth, no flicker. No food, no text, no logos, no brand names, no labels, no watermarks.
```

**Mobile (9:16):** add `Vertical 9:16 frame; the box is centred horizontally in the upper half.`

---

## 12. Travelling products — magenta-screen turntables

These are Klen's version of Nuragro's travelling nuts: single products that spin as you scroll and travel between sections (out of the hero, onto the category rail, into the quote window).

**Use magenta, not green.** Klen products include green items (floor cleaner, sponges, the squeegee blade) that a green screen would cut out. The frames script needs two small changes from the Nuragro version: treat names starting with `item-` as sprites, and use `despill=type=blue` with a magenta key.

| Save as | Product |
|---|---|
| `media-src/item-paper-cup.mp4` | Plain white 8 oz paper cup: **generate this first as the test** |
| `media-src/item-foil-roll.mp4` | Aluminium foil roll with cardboard core |
| `media-src/item-maxi-roll.mp4` | White maxi roll |
| `media-src/item-container.mp4` | Black rectangular takeaway container with clear lid |
| `media-src/item-glove.mp4` | Black nitrile glove, slightly inflated |
| `media-src/item-sponge.mp4` | Yellow and green scrub sponge |
| `media-src/item-spray-bottle.mp4` | Plain white trigger spray bottle, no label |

Then run `npm run frames -- item-paper-cup` (one per product).

**Prompt** (swap the product):
```
Studio product shot, single continuous take, locked-off static camera. A single [plain white 8 oz paper cup] floats in the centre of the frame and rotates slowly and smoothly through one full 360 degrees on its vertical axis. Solid flat pure magenta chroma-key background (#FF00FF), evenly lit, no gradient, no shadows, no reflections on the background. Soft bright key light from the top left, subtle white rim light. Sharp focus on the whole product, realistic material texture. The product stays the same size and position for the whole clip and fills about 60% of the frame height. No other objects, no text, no logos, no labels, no watermarks.
```
- 1:1 (or 16:9; the script crops the centre square), 8 s, 1080p.
- Best results: generate a still of the product on magenta first, then use **image to video** in Flow.

---

## 13. `quote-loop` — Ambient background (optional)

Plays as a normal muted loop behind the quote form, seen first through a small circle that opens to full screen. Save as `public/media/loops/quote-loop.mp4`; it doesn't need frame conversion.

```
Slow-motion close-up of translucent iridescent soap bubbles drifting gently upward through soft daylight against a bright, clean pale blue-white background, a few tiny foam droplets catching the light, the centre of the frame always interesting, static camera, perfectly seamless loop. Bright high-key commercial look, true-to-life colours, crisp focus. No text, no logos, no watermarks.
```

---

## File size note

Each 8 s clip becomes about 192 frames, roughly 15–25 MB per chapter at the default quality. Ten chapters is a lot, so frames load progressively (a coarse pass first) and only when a chapter approaches the viewport. For production, serve `/media` from a CDN (Cloudflare R2 or S3). Payload stores the chapter copy and timing, not the frames.
