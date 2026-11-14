import 'server-only'
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

export type MediaAsset = { image?: string; video?: string }
/** Keyed by slot, e.g. "categories/tissue" -> { image: "/media/categories/tissue.webp" } */
export type MediaIndex = Record<string, MediaAsset>

const ROOT = path.join(process.cwd(), 'public', 'media')
const IMAGE = /\.(webp|avif|jpe?g|png)$/i
const VIDEO = /\.(mp4|webm)$/i

/**
 * Scans public/media so dropping a file into a slot folder is enough — no config.
 * Scroll-film frame folders (media/films, media/sprites) are skipped; they have their own manifests.
 */
export function getMediaIndex(): MediaIndex {
  const index: MediaIndex = {}
  const walk = (dir: string) => {
    let entries: string[] = []
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }
    for (const entry of entries) {
      const full = path.join(dir, entry)
      const rel = path.relative(ROOT, full).split(path.sep).join('/')
      if (rel === 'films' || rel === 'sprites') continue
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      const kind = IMAGE.test(entry) ? 'image' : VIDEO.test(entry) ? 'video' : null
      if (!kind) continue
      const slot = rel.replace(/\.[^.]+$/, '')
      ;(index[slot] ??= {})[kind] = `/media/${rel}`
    }
  }
  walk(ROOT)
  return index
}
