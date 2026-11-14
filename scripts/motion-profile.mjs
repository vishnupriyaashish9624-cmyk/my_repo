#!/usr/bin/env node
/**
 * Prints where the motion happens in each film, as fractions of the clip (0–1), so chapter text
 * timing can match the footage. Reversed clips are measured reversed.
 *
 *   node scripts/motion-profile.mjs category-tissue:reverse category-aluminium hero
 */
import { spawnSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";

const W = 64;
const H = 36;
const FPS = 12;

for (const arg of process.argv.slice(2)) {
  const [name, flag] = arg.split(":");
  const vf = `${flag === "reverse" ? "reverse," : ""}fps=${FPS},scale=${W}:${H},format=gray`;
  const res = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-i", `media-src/${name}.mp4`, "-vf", vf, "-f", "rawvideo", "-"], { maxBuffer: 1 << 26 });
  const px = res.stdout;
  const n = Math.floor(px.length / (W * H));
  const diffs = [];
  for (let f = 1; f < n; f++) {
    let sum = 0;
    for (let i = 0; i < W * H; i++) sum += Math.abs(px[f * W * H + i] - px[(f - 1) * W * H + i]);
    diffs.push(sum / (W * H));
  }
  const max = Math.max(...diffs);
  const moving = diffs.map((d) => d > max * 0.2);
  const start = moving.indexOf(true);
  const end = moving.lastIndexOf(true);
  const bars = diffs.map((d) => " ▁▂▃▄▅▆▇█"[Math.min(8, Math.round((d / max) * 8))]).join("");
  console.log(`${arg.padEnd(28)} motion ${(start / n).toFixed(2)} → ${((end + 1) / n).toFixed(2)}  ${bars}`);
}
