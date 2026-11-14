#!/usr/bin/env node
/**
 * Prepares Flow clips for the site (adapted from the Nuragro project).
 *
 *   media-src/hero.mp4                    -> public/media/films/hero/                 scroll film frames (16:9)
 *   media-src/category-tissue.mp4         -> public/media/films/category-tissue/      category chapter film
 *   media-src/category-tissue-mobile.mp4  -> public/media/films/category-tissue-mobile/ (9:16, optional)
 *   media-src/quote-loop.mp4              -> public/media/loops/quote-loop.mp4        ambient loop (names ending -loop)
 *   media-src/item-paper-cup.mp4          -> public/media/sprites/item-paper-cup/     chroma-key turntable → transparent frames (names starting item-)
 *   media-src/category-tissue-burst.mp4   -> public/media/films/category-tissue-burst/ chroma-key film → transparent frames (names ending -burst)
 *
 * Multi-part: media-src/hero-1.mp4, hero-2.mp4 … are joined with crossfades into one "hero" film.
 *
 * Usage: npm run frames                                   (everything in media-src/)
 *        npm run frames -- category-tissue                (one clip)
 *        npm run frames -- category-tissue --reverse      (play the clip backwards: generate "crumpling", get "unfolding")
 *        npm run frames -- category-tissue --quality 95   (WebP quality 0–100, default 90)
 *        npm run frames -- hero --width 2560              (upscale frames for large/retina screens)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const SRC = "media-src";
const FILMS = "public/media/films";
const LOOPS = "public/media/loops";
const SPRITES = "public/media/sprites";

const isSprite = (name) => name.startsWith("item-");
const isKeyedFilm = (name) => name.endsWith("-burst");

/**
 * Chroma key for AI screen clips. Klen uses a magenta screen (green products would be keyed out),
 * but green screens still work. AI screens are rarely a pure colour, so the key colour is sampled
 * from each clip's top and bottom edges. Override the tolerance with --similarity 0.1
 */
function sampleKeyColour(file) {
  const rows = [];
  for (const y of ["0", "ih*0.95"]) {
    const res = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-i", file, "-vf", `fps=1,crop=iw:ih*0.05:0:${y},scale=1:1,format=rgb24`, "-f", "rawvideo", "-"], { maxBuffer: 1 << 20 });
    for (let i = 0; i + 2 < res.stdout.length; i += 3) rows.push([res.stdout[i], res.stdout[i + 1], res.stdout[i + 2]]);
  }
  const median = (k) => rows.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(rows.length / 2)] ?? 0;
  return [median(0), median(1), median(2)];
}
const hexOf = (rgb) => rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
// ffmpeg's despill only knows green and blue spill. For magenta, pull red and blue down to green wherever both
// exceed it: clear plastic and white edges lose their pink cast, while yellow, green and neutral colours are untouched.
const magentaDespill =
  "format=gbrap,geq=r='r(X,Y)-max(0,min(r(X,Y),b(X,Y))-g(X,Y))':g='g(X,Y)':b='b(X,Y)-max(0,min(r(X,Y),b(X,Y))-g(X,Y))':a='alpha(X,Y)'";
const keyFilter = (rgb, similarity) => {
  const [r, g, b] = rgb;
  const greenScreen = g > r && g > b;
  const despill = greenScreen ? "despill=type=green:mix=0.8:expand=0.2" : magentaDespill;
  return `chromakey=0x${hexOf(rgb)}:${similarity}:${greenScreen ? 0.04 : 0.08},${despill},format=yuva420p`;
};

/** Union bounding box of the keyed subject across all frames (from low-res alpha masks). */
function subjectBox(file, key, fps) {
  const W = 240;
  const H = 135;
  const res = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-i", file, "-vf", `fps=${fps},${key},alphaextract,scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 1 << 28 });
  const px = res.stdout;
  const frames = Math.floor(px.length / (W * H));
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let f = 0; f < frames; f++) {
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = f * W * H + y * W + x;
        // Require solid neighbours so stray noise pixels don't inflate the box.
        if (px[i] > 160 && px[i - 1] > 160 && px[i + 1] > 160 && px[i - W] > 160 && px[i + W] > 160) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
  }
  if (x1 <= x0) return null;
  return { x0: x0 / W, y0: y0 / H, x1: (x1 + 1) / W, y1: (y1 + 1) / H };
}
const FPS = 24;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? Number(args.splice(i, 2)[1]) : fallback;
};
const bool = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return false;
  args.splice(i, 1);
  return true;
};
const quality = flag("--quality", 90);
const width = flag("--width", 0);
const similarity = flag("--similarity", 0.08);
const reverse = bool("--reverse");
const only = args[0];

// AI video exports are heavily compressed: remove block artifacts, then restore edge contrast.
const clean = "deblock=filter=weak:block=4,hqdn3d=1.2:1.2:0:0";
const sharpen = "cas=0.5";
const scaleTo = (w) => (w ? `scale=${w}:-2:flags=lanczos,` : "");
const rev = reverse ? "reverse," : "";

if (!existsSync(SRC)) {
  console.error(`No ${SRC}/ folder. Put your Flow clips there, e.g. ${SRC}/category-tissue.mp4`);
  process.exit(1);
}

const run = (argv) => {
  const res = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...argv], { stdio: "inherit" });
  if (res.status !== 0) process.exit(res.status ?? 1);
};
const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;
const duration = (file) => {
  const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const [, h, m, s] = probe.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/) ?? [];
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
};

// Strip every video extension so "hero.mp4.mp4" (Windows hidden extensions) still maps to "hero".
const baseName = (f) => f.replace(/(\.(mp4|mov|webm))+$/i, "");
const files = readdirSync(SRC).filter((f) => /\.(mp4|mov|webm)$/i.test(f));

const XFADE = 0.6;
const groups = new Map();
for (const f of files) {
  const m = baseName(f).match(/^(.+)-(\d+)$/);
  if (m) groups.set(m[1], [...(groups.get(m[1]) ?? []), { part: Number(m[2]), file: path.join(SRC, f) }]);
}
const jobs = [];
for (const [name, parts] of groups) {
  if (parts.length < 2) continue;
  jobs.push({ name, parts: parts.sort((a, b) => a.part - b.part).map((p) => p.file) });
}
for (const f of files) {
  const name = baseName(f);
  const m = name.match(/^(.+)-(\d+)$/);
  if (m && jobs.some((j) => j.name === m[1])) continue;
  if (jobs.some((j) => j.name === name)) {
    console.log(`• ${f} ignored: multi-part clips for "${name}" take precedence`);
    continue;
  }
  jobs.push({ name, parts: [path.join(SRC, f)] });
}

const selected = jobs.filter((j) => !only || j.name === only);
if (!selected.length) {
  console.error("No matching clips found.");
  process.exit(1);
}

const TMP = path.join(SRC, ".tmp");

for (const { name, parts } of selected) {
  let input = parts[0];
  if (parts.length > 1) {
    mkdirSync(TMP, { recursive: true });
    input = path.join(TMP, `${name}.mp4`);
    const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", parts[0]], { encoding: "utf8" });
    const [, w, h] = probe.stderr.match(/Video:.*?(\d{3,5})x(\d{3,5})/) ?? [, 1920, 1080];
    const norm = parts.map((_, i) => `[${i}:v]fps=${FPS},scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},setsar=1,format=yuv420p[v${i}]`);
    const chain = [];
    let offset = 0;
    let last = "v0";
    for (let i = 1; i < parts.length; i++) {
      offset += duration(parts[i - 1]) - XFADE;
      const out = i === parts.length - 1 ? "out" : `x${i}`;
      chain.push(`[${last}][v${i}]xfade=transition=fade:duration=${XFADE}:offset=${offset.toFixed(3)}[${out}]`);
      last = out;
    }
    run([...parts.flatMap((p) => ["-i", p]), "-filter_complex", [...norm, ...chain].join(";"), "-map", "[out]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast", input]);
    console.log(`• ${name}: joined ${parts.length} parts with ${XFADE}s crossfades`);
  }

  if (name.endsWith("-loop")) {
    mkdirSync(LOOPS, { recursive: true });
    rmSync(path.join(FILMS, name), { recursive: true, force: true });
    const out = path.join(LOOPS, `${name}.mp4`);
    run(["-i", input, "-an", "-vf", `${clean},${scaleTo(width)}${sharpen}`, "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]);
    console.log(`✓ ${name}: loop video → ${out} (${mb(statSync(out).size)})`);
    continue;
  }

  const sprite = isSprite(name);
  const keyed = sprite || isKeyedFilm(name);
  const dir = path.join(sprite ? SPRITES : FILMS, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  let vf = `${rev}fps=${FPS},${clean},${scaleTo(width)}${sharpen}`;
  if (keyed) {
    const rgb = sampleKeyColour(input);
    const key = keyFilter(rgb, similarity);
    if (sprite) {
      const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", input], { encoding: "utf8" });
      const [, iw, ih] = (probe.stderr.match(/Video:.*?(\d{3,5})x(\d{3,5})/) ?? [, 1920, 1080]).map(Number);
      const box = subjectBox(input, key, 4) ?? { x0: 0.25, y0: 0, x1: 0.75, y1: 1 };
      const cx = ((box.x0 + box.x1) / 2) * iw;
      const cy = ((box.y0 + box.y1) / 2) * ih;
      const side = Math.min(iw, ih, Math.round(Math.max((box.x1 - box.x0) * iw, (box.y1 - box.y0) * ih) * 1.3));
      const x = Math.round(Math.min(Math.max(cx - side / 2, 0), iw - side));
      const y = Math.round(Math.min(Math.max(cy - side / 2, 0), ih - side));
      vf = `${rev}fps=12,${key},crop=${side}:${side}:${x}:${y},scale=512:512:flags=lanczos`;
      console.log(`• ${name}: key #${hexOf(rgb)}, subject crop ${side}px at ${x},${y}`);
    } else {
      vf = `${rev}fps=12,${key},${scaleTo(width || 1280)}format=yuva420p`;
      console.log(`• ${name}: key #${hexOf(rgb)}`);
    }
  }
  run(["-i", input, "-vf", vf, "-c:v", "libwebp", "-preset", "photo", "-quality", String(quality), "-compression_level", "6", ...(keyed ? ["-pix_fmt", "yuva420p"] : []), path.join(dir, "%04d.webp")]);

  const out = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  const bytes = out.reduce((sum, f) => sum + statSync(path.join(dir, f)).size, 0);
  const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", path.join(dir, "0001.webp")], { encoding: "utf8" });
  const [, w, h] = probe.stderr.match(/(\d{3,5})x(\d{3,5})/) ?? [];
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify({ count: out.length, fps: keyed ? 12 : FPS, width: Number(w), height: Number(h), alpha: keyed }, null, 2));
  console.log(`✓ ${name}: ${out.length} ${keyed ? "transparent " : ""}frames${reverse ? " (reversed)" : ""} (${w}×${h}, quality ${quality}, ${mb(bytes)}) → ${dir}`);
}

rmSync(TMP, { recursive: true, force: true });
