'use client'

import type { CSSProperties, ReactNode } from 'react'
import { CategoryVector, VectorScene, type VectorKey } from './CategoryVector'

/**
 * "Many things in, one thing out": icons ride a slowly turning ring (each counter-rotates so it stays
 * upright), dashed lines stream from every icon into the centre piece, and a soft ring pulses around
 * the centre. Pure CSS motion (see "Orbit scene" in globals.css), paused off-screen.
 */
export default function OrbitScene({
  icons,
  center,
  className = '',
  dur = 46,
  tone = 'dark',
}: {
  icons: VectorKey[]
  center: ReactNode
  className?: string
  /** Seconds per full turn. */
  dur?: number
  tone?: 'dark' | 'light'
}) {
  const n = icons.length
  const R = 42 // ring radius, % of the box
  const line = tone === 'dark' ? 'rgb(255 255 255 / 0.35)' : 'rgb(40 58 125 / 0.3)'
  return (
    <div aria-hidden className={`relative aspect-square ${className}`} style={{ '--dur': `${dur}s` } as CSSProperties}>
      {/* Dotted rings */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r={R} fill="none" stroke={line} strokeWidth="0.3" strokeDasharray="0.6 2" strokeLinecap="round" />
        <circle cx="50" cy="50" r={R * 0.62} fill="none" stroke={line} strokeWidth="0.25" strokeDasharray="0.4 2.4" strokeLinecap="round" />
      </svg>

      {/* Turning layer: spokes + icons */}
      <div className="vx-orbit absolute inset-0">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          {icons.map((_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2
            return (
              <line
                key={i}
                className="orbit-flow"
                style={{ animationDelay: `${-i * 0.3}s` }}
                x1={50 + Math.cos(a) * (R - 6)}
                y1={50 + Math.sin(a) * (R - 6)}
                x2={50 + Math.cos(a) * 15}
                y2={50 + Math.sin(a) * 15}
                stroke="var(--color-leaf)"
                strokeWidth="0.7"
                strokeLinecap="round"
              />
            )
          })}
        </svg>
        {icons.map((key, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2
          return (
            <div
              key={key + i}
              className="absolute w-[19%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%` }}
            >
              <div className="orbit-upright">
                <div className="orbit-bob rounded-full bg-white p-1.5 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)]" style={{ animationDelay: `${-i * 0.7}s` }}>
                  <VectorScene drawn>
                    <CategoryVector name={key} className="w-full" />
                  </VectorScene>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Centre piece with a pulsing halo */}
      <div className="absolute left-1/2 top-1/2 w-[30%] -translate-x-1/2 -translate-y-1/2">
        <span className="orbit-pulse absolute inset-0 rounded-full bg-leaf/40" />
        <span className="orbit-pulse absolute inset-0 rounded-full bg-leaf/30" style={{ animationDelay: '-1.2s' }} />
        <div className="relative rounded-full bg-white p-2 shadow-[0_24px_60px_-18px_rgba(61,166,41,0.7)] ring-4 ring-leaf/40">{center}</div>
      </div>
    </div>
  )
}
