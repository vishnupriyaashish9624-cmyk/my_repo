'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Bubble, CategoryVector, Spark, Steam, VectorSvg, type VectorKey } from './CategoryVector'
import { TissueVector, type TissueKey } from './TissueVectors'

/**
 * Line vectors for individual product types inside each category (foil roll, rippled cup, pedal
 * bin…). Same drawing language as CategoryVector: strokes trace in inside a VectorScene, then a
 * small ambient loop. `ItemVector` also accepts tissue keys and `cat:<category>` to reuse those sets.
 */

const KRAFT = '#e7c99b'
const KRAFT_DEEP = '#d4ac72'
const FOIL = '#dfe6ee'
const FOIL_LIGHT = '#eef2f7'
const SKY = '#d6e4f7'
const NITRILE = '#9cc1f0'
const SUN = '#f5d36b'
const PINK = '#f6d3dc'
const LAVENDER = '#d9cdf3'

const dl = (s: number) => ({ '--d': `${s}s` }) as CSSProperties

/** Serrated edge from x0 to x1 at y (cutter blades, torn paper). */
const zigPoints = (x0: number, x1: number, y: number, h: number, step = 4) => {
  const dir = x1 >= x0 ? 1 : -1
  let p = ''
  for (let i = 1, up = true; i * step <= Math.abs(x1 - x0); i++, up = !up) p += ` L${x0 + dir * i * step} ${up ? y - h : y}`
  return p
}
const zig = (x0: number, x1: number, y: number, h = 3) => `M${x0} ${y}${zigPoints(x0, x1, y, h)}`
/** Torn bottom edge continuing an open path (teeth point down). */
const zigTo = (x0: number, x1: number, y: number) => zigPoints(x0, x1, y, -3)

const HAND =
  'M40 96 V76 C34 70 30 64 32 60 C34 57 38 58 41 62 L44 66 V38 C44 33 51 33 51 38 V44 V32 C51 27 58 27 58 32 V44 V34 C58 29 65 29 65 34 V46 V40 C65 35 72 35 72 40 V74 C72 82 68 88 66 90 V96 Z'

const Glove = ({ fill, cuff = 'fill-leaf' }: { fill: string; cuff?: string }) => (
  <>
    <g className="vx-hand" transform="translate(6 0)">
      <path className="vx-line" fill={fill} d={HAND} />
      <rect className={`vx-line ${cuff}`} x="38" y="88" width="30" height="9" rx="2.5" />
    </g>
    <Spark x={96} y={38} s={0.8} delay={0.6} />
    <Spark x={24} y={50} s={0.6} delay={1.4} />
  </>
)

const ART = {
  /* ── Aluminium ── */
  'foil-roll': (
    <>
      <g className="vx-unroll">
        <path className="vx-line" fill={FOIL_LIGHT} d={`M40 60 h46 v30${zigTo(86, 40, 90)} Z`} />
        <path className="vx-shine text-white" d="M58 66 l-6 20" strokeWidth="4" />
      </g>
      <path className="vx-line" fill={FOIL} d="M34 36 h52 a8 13 0 0 1 0 26 h-52" />
      <ellipse className="vx-line" fill={FOIL} cx="34" cy="49" rx="8" ry="13" />
      <ellipse className="vx-line fill-mist" cx="34" cy="49" rx="3" ry="5" />
      <path className="vx-line text-leaf" d="M54 36 v26" strokeWidth="1.8" />
      <Spark x={98} y={34} s={0.9} delay={0.2} />
    </>
  ),
  platter: (
    <>
      <Steam x={60} y={50} />
      <ellipse className="vx-line" fill={FOIL} cx="60" cy="72" rx="42" ry="16" />
      <ellipse className="vx-line" fill={FOIL_LIGHT} cx="60" cy="72" rx="32" ry="10" />
      <g className="vx-float">
        <circle className="vx-line" fill={KRAFT} cx="48" cy="68" r="6" strokeWidth="1.8" />
        <circle className="vx-line fill-leaf" cx="62" cy="66" r="7" strokeWidth="1.8" />
        <circle className="vx-line" fill={KRAFT_DEEP} cx="74" cy="72" r="5" strokeWidth="1.8" />
      </g>
      <path className="vx-shine text-white" d="M30 72 l-4 8" strokeWidth="4" />
    </>
  ),
  'burger-wrap': (
    <>
      <path className="vx-line" fill={FOIL} d="M24 58 L60 40 L96 58 L86 94 L34 94 Z" />
      <g className="vx-float">
        <path className="vx-line" fill={KRAFT} d="M40 58 c0 -16 40 -16 40 0 Z" />
        <path className="vx-line text-leaf" d="M38 60 q5 -4 11 0 t11 0 t11 0 t11 0" strokeWidth="2.4" />
        <rect className="vx-line fill-navy" x="40" y="61" width="40" height="7" rx="3" />
      </g>
      <path className="vx-line" fill={FOIL_LIGHT} d="M28 68 L60 76 L92 68 L86 94 L34 94 Z" />
      <path className="vx-shine text-white" d="M44 76 l-4 14" strokeWidth="4" />
      <Spark x={100} y={40} s={0.8} delay={0.5} />
    </>
  ),

  /* ── Takeaway containers ── */
  'rect-box': (
    <>
      <g className="vx-hover">
        <path className="vx-line" fill={SKY} fillOpacity="0.7" d="M24 56 h72 l-5 -12 h-62 Z" />
        <path className="vx-line text-white" d="M36 48 h18" strokeWidth="2" />
      </g>
      <path className="vx-line" d="M20 64 h80" />
      <path className="vx-line fill-navy" d="M26 64 h68 l-6 28 h-56 Z" />
      <path className="vx-line" fill={KRAFT} d="M32 64 h24 l-1 8 h-22 Z" strokeWidth="1.6" />
      <path className="vx-line fill-leaf" d="M62 64 h26 l-1 8 h-24 Z" strokeWidth="1.6" />
      <Spark x={100} y={36} s={0.8} delay={0.4} />
    </>
  ),
  'round-tub': (
    <>
      <Steam x={60} y={40} />
      <g className="vx-hover" style={dl(0.3)}>
        <ellipse className="vx-line" fill={SKY} fillOpacity="0.7" cx="60" cy="50" rx="32" ry="8" />
        <ellipse className="vx-line" fill={SKY} fillOpacity="0.7" cx="60" cy="47" rx="22" ry="5" strokeWidth="1.8" />
      </g>
      <path className="vx-line fill-navy" d="M30 66 L35 90 A25 6 0 0 0 85 90 L90 66 Z" />
      <ellipse className="vx-line" fill={KRAFT} cx="60" cy="66" rx="30" ry="7" />
      <circle className="vx-line fill-leaf" cx="52" cy="66" r="2.6" strokeWidth="0" />
      <circle className="vx-line fill-leaf" cx="68" cy="65" r="2" strokeWidth="0" />
    </>
  ),
  'clear-bowl': (
    <>
      <path className="vx-line" fill={SKY} fillOpacity="0.55" d="M30 50 h60 l-6 40 a6 6 0 0 1 -6 5 h-36 a6 6 0 0 1 -6 -5 Z" />
      <path className="vx-line text-leaf" d="M36 70 q6 -4 12 0 t12 0 t12 0 t12 0" strokeWidth="2.2" />
      <path className="vx-line text-slate" d="M34 60 h6 M35 70 h5 M37 80 h5" strokeWidth="1.4" />
      <path className="vx-line" d="M26 50 h68" />
      <Bubble x={92} y={82} r={3.6} delay={0} />
      <Bubble x={98} y={70} r={2.4} delay={1.2} />
      <Spark x={26} y={36} s={0.8} delay={0.7} />
    </>
  ),
  stack: (
    <>
      <path className="vx-line fill-navy" d="M28 82 h56 l-4 12 h-48 Z" />
      <path className="vx-line fill-navy" d="M28 70 h56 l-4 12 h-48 Z" />
      <g className="vx-hover">
        <path className="vx-line fill-navy" d="M28 52 h56 l-4 12 h-48 Z" />
        <path className="vx-line" fill={SKY} d="M26 52 h60 l-3 -6 h-54 Z" />
      </g>
      <circle className="vx-line fill-leaf" cx="94" cy="38" r="12" />
      <text x="94" y="42" textAnchor="middle" className="fill-white font-mono" stroke="none" fontSize="10" fontWeight="700">
        ×50
      </text>
    </>
  ),

  /* ── Cups & lids ── */
  rippled: (
    <>
      <Steam x={60} y={28} />
      <path className="vx-line" fill={KRAFT} d="M38 40 h44 l-6 54 h-32 Z" />
      <path className="vx-line" d="M47 44 q2 6 0 12 t0 12 t0 12 t1 10 M60 44 q2 6 0 12 t0 12 t0 12 t0 10 M73 44 q2 6 0 12 t0 12 t0 12 t-1 10" strokeWidth="1.4" />
      <path className="vx-line fill-navy" d="M34 34 h52 v6 h-52 Z" />
      <Spark x={94} y={60} s={0.8} delay={0.8} />
    </>
  ),
  'pet-glass': (
    <>
      <path className="vx-line" fill={SKY} fillOpacity="0.45" d="M38 50 h44 l-5 44 h-34 Z" />
      <path className="vx-line fill-leaf" fillOpacity="0.55" d="M40 62 h40 l-3.6 32 h-32.8 Z" strokeWidth="1.4" />
      <g className="vx-hover">
        <path className="vx-line" fill={SKY} fillOpacity="0.6" d="M34 50 a26 18 0 0 1 52 0 Z" />
        <path className="vx-line text-leaf" d="M68 18 l-8 64" strokeWidth="3.4" />
      </g>
      <Bubble x={50} y={84} r={2.4} delay={0.2} />
      <Bubble x={56} y={76} r={1.8} delay={1.1} />
    </>
  ),
  'dome-lid': (
    <>
      <g className="vx-hover">
        <path className="vx-line" fill={SKY} fillOpacity="0.6" d="M34 52 a26 18 0 0 1 52 0 Z" />
        <path className="vx-line" d="M30 52 h60" />
        <circle className="vx-line fill-white" cx="60" cy="36" r="3" strokeWidth="1.6" />
      </g>
      <path className="vx-line fill-navy" d="M32 74 h56 v6 h-56 Z" />
      <path className="vx-line fill-navy" d="M37 74 l3 -5 h40 l3 5" />
      <path className="vx-line fill-white" d="M36 80 h48 l-3 14 h-42 Z" />
      <Spark x={98} y={40} s={0.8} delay={0.5} />
    </>
  ),
  straws: (
    <>
      <g className="vx-wave">
        <path className="vx-line text-leaf" d="M50 70 l-10 -46" strokeWidth="4" />
        <path className="vx-line text-navy" d="M60 70 v-50" strokeWidth="4" />
        <path className="vx-line" d="M70 70 l6 -40 l8 -6" strokeWidth="4" />
      </g>
      <path className="vx-line fill-white" d="M40 66 h40 l-4 28 h-32 Z" />
      <path className="vx-line text-leaf" d="M44 78 h32" strokeWidth="2" />
      <Spark x={96} y={50} s={0.8} delay={0.9} />
    </>
  ),
  icecream: (
    <>
      <g className="vx-float">
        <circle className="vx-line" fill={PINK} cx="60" cy="52" r="16" />
        <path className="vx-line" d="M60 36 c0 -4 2 -7 5 -9" strokeWidth="1.6" />
        <circle className="vx-line fill-leaf" cx="60" cy="36" r="4" strokeWidth="1.6" />
      </g>
      <path className="vx-line fill-white" d="M38 58 h44 l-6 36 h-32 Z" />
      <path className="vx-line text-leaf" d="M41 66 h38" strokeWidth="2" />
      <path className="vx-line" d="M84 38 l-12 24" strokeWidth="2.4" />
      <Spark x={28} y={42} s={0.8} delay={0.4} />
    </>
  ),

  /* ── Bags ── */
  'carry-bag': (
    <g className="vx-sway">
      <path className="vx-line fill-white" d="M34 46 V30 a6 6 0 0 1 12 0 v6 q14 8 28 0 v-6 a6 6 0 0 1 12 0 V46 l4 48 h-72 Z" />
      <path className="vx-line text-line" d="M40 32 v8 M80 32 v8 M44 60 q4 14 0 28 M78 58 q-4 14 0 30" strokeWidth="1.4" />
      <path className="vx-line fill-leaf" d="M60 80 c-1 -9 5 -14 13 -14 c0 9 -5 14 -13 14 Z" strokeWidth="1.6" />
    </g>
  ),
  'paper-bag': (
    <>
      <path className="vx-line" fill={KRAFT} d="M64 54 h30 l3 40 h-36 Z" />
      <path className="vx-line" d={zig(64, 94, 54)} strokeWidth="1.8" />
      <g className="vx-float">
        <path className="vx-line fill-white" d="M28 44 h44 l4 50 h-52 Z" />
        <path className="vx-line" d={zig(28, 72, 44)} />
        <path className="vx-line text-line" d="M36 44 l-2 50 M64 44 l2 50" strokeWidth="1.4" />
        <circle className="vx-line fill-leaf" cx="50" cy="70" r="6" />
      </g>
    </>
  ),
  garbage: (
    <>
      <g className="vx-wave">
        <path className="vx-line fill-navy" d="M60 44 c-20 4 -32 20 -30 36 c2 12 14 16 30 16 c16 0 28 -4 30 -16 c2 -16 -10 -32 -30 -36 Z" />
        <path className="vx-line" d="M60 44 l-8 -12 M60 44 l8 -12" strokeWidth="3" />
        <path className="vx-line text-leaf" d="M54 46 h12" strokeWidth="4" />
        <path className="vx-line text-white" d="M46 62 q4 6 2 14 M72 60 q-2 8 2 16" strokeWidth="1.6" />
      </g>
      <Spark x={96} y={44} s={0.8} delay={0.6} />
    </>
  ),
  'zip-pouch': (
    <>
      <g className="vx-float">
        <path className="vx-line fill-white" d="M34 36 h52 v56 a4 4 0 0 1 -4 4 h-44 a4 4 0 0 1 -4 -4 Z" />
        <path className="vx-line text-leaf" d="M34 46 h52" strokeWidth="3" />
        <rect className="vx-line" fill={SKY} fillOpacity="0.6" x="44" y="56" width="32" height="28" rx="4" />
        <circle className="vx-line" fill={KRAFT} cx="54" cy="72" r="5" strokeWidth="1.6" />
        <circle className="vx-line fill-leaf" cx="66" cy="70" r="6" strokeWidth="1.6" />
      </g>
      <Steam x={60} y={30} />
    </>
  ),

  /* ── Wraps & rolls ── */
  cling: (
    <>
      <g className="vx-wave">
        <path className="vx-line" fill={SKY} fillOpacity="0.65" d="M30 64 C32 50 40 40 50 32 L90 32 C82 42 84 54 90 64 Z" strokeWidth="1.6" />
        <path className="vx-shine text-white" d="M56 38 l-6 20" strokeWidth="4" />
      </g>
      <rect className="vx-line fill-white" x="20" y="64" width="80" height="24" rx="3" />
      <path className="vx-line" d={zig(20, 100, 64)} strokeWidth="1.8" />
      <path className="vx-line text-leaf" d="M28 78 h64" strokeWidth="3" />
    </>
  ),
  stretch: (
    <>
      <rect className="vx-line" fill={KRAFT} x="58" y="46" width="38" height="46" rx="2" />
      <path className="vx-line" d="M58 58 h38 M77 46 v46" strokeWidth="1.4" />
      <g className="vx-stretch">
        <path className="vx-line" fill={SKY} fillOpacity="0.6" d="M42 56 L96 60 L96 72 L42 72 Z" strokeWidth="1.4" />
      </g>
      <g className="vx-float">
        <rect className="vx-line fill-white" x="26" y="42" width="16" height="42" rx="4" />
        <path className="vx-line" d="M34 42 v-8 M34 84 v8" strokeWidth="3" />
        <path className="vx-line text-leaf" d="M26 52 h16" strokeWidth="2" />
      </g>
    </>
  ),
  sandwich: (
    <>
      <path className="vx-line fill-white" d="M20 60 L60 40 L100 60 L60 94 Z" />
      <g className="vx-float">
        <path className="vx-line" fill={KRAFT} d="M40 72 L60 44 L80 72 Z" />
        <path className="vx-line text-leaf" d="M44 66 q4 -3 8 0 t8 0 t8 0 t8 0" strokeWidth="2.4" />
      </g>
      <path className="vx-line text-line" d="M28 66 L60 78 L92 66" strokeWidth="1.6" />
      <Spark x={100} y={36} s={0.8} delay={0.3} />
    </>
  ),
  rotti: (
    <>
      <Steam x={60} y={42} />
      <ellipse className="vx-line fill-white" cx="60" cy="86" rx="36" ry="9" />
      <ellipse className="vx-line fill-white" cx="60" cy="79" rx="36" ry="9" />
      <ellipse className="vx-line fill-white" cx="60" cy="72" rx="36" ry="9" />
      <g className="vx-hover">
        <ellipse className="vx-line" fill={KRAFT} cx="60" cy="60" rx="26" ry="8" />
        <g fill={KRAFT_DEEP} stroke="none">
          <circle cx="50" cy="59" r="2" />
          <circle cx="62" cy="62" r="2.4" />
          <circle cx="70" cy="57" r="1.6" />
        </g>
      </g>
    </>
  ),
  sufra: (
    <>
      <g className="vx-unroll">
        <path className="vx-line fill-white" d="M30 70 h56 l12 24 h-80 Z" />
        <path className="vx-line text-leaf" d="M30 82 h62" strokeWidth="1.6" />
        <g className="fill-leaf" stroke="none">
          <circle cx="40" cy="88" r="1.8" />
          <circle cx="56" cy="88" r="1.8" />
          <circle cx="72" cy="88" r="1.8" />
          <circle cx="86" cy="88" r="1.8" />
        </g>
      </g>
      <path className="vx-line fill-white" d="M30 42 h56 a8 14 0 0 1 0 28 h-56" />
      <ellipse className="vx-line fill-white" cx="30" cy="56" rx="8" ry="14" />
      <ellipse className="vx-line fill-mist" cx="30" cy="56" rx="3" ry="5" />
      <Spark x={98} y={36} s={0.8} delay={0.6} />
    </>
  ),
  'bill-roll': (
    <>
      <g className="vx-unroll">
        <path className="vx-line fill-white" d={`M46 44 h28 v50${zigTo(74, 46, 94)} Z`} />
        <path className="vx-line text-line" d="M51 58 h18 M51 64 h12 M51 70 h18 M51 80 h8" strokeWidth="1.6" />
        <path className="vx-line text-leaf" d="M62 80 h7" strokeWidth="2.2" />
      </g>
      <circle className="vx-line fill-white" cx="60" cy="38" r="16" />
      <circle className="vx-line fill-mist" cx="60" cy="38" r="5" />
      <Spark x={92} y={50} s={0.8} delay={0.4} />
    </>
  ),

  /* ── Cleaning chemicals ── */
  dish: (
    <>
      <g className="vx-wave">
        <circle className="vx-line fill-white" cx="80" cy="66" r="18" />
        <circle className="vx-line text-line" cx="80" cy="66" r="11" strokeWidth="1.6" />
        <path className="vx-shine text-white" d="M74 56 l-6 14" strokeWidth="4" />
      </g>
      <path className="vx-line fill-leaf" d="M30 48 h22 v42 a4 4 0 0 1 -4 4 h-14 a4 4 0 0 1 -4 -4 Z" />
      <path className="vx-line fill-white" d="M36 38 h10 v10 h-10 Z" />
      <rect className="vx-line fill-navy" x="37" y="30" width="8" height="8" rx="2" />
      <rect className="vx-line fill-white" x="34" y="62" width="14" height="16" rx="2" />
      <Bubble x={62} y={48} r={3.4} delay={0} />
      <Bubble x={98} y={44} r={2.6} delay={1} />
      <Bubble x={64} y={86} r={2.2} delay={1.8} />
    </>
  ),
  'can-5l': (
    <>
      <rect className="vx-line fill-white" x="30" y="44" width="52" height="50" rx="6" />
      <path className="vx-line" d="M38 44 v-10 h18 v10" strokeWidth="3" />
      <rect className="vx-line fill-leaf" x="66" y="34" width="10" height="10" rx="2" />
      <rect className="vx-line fill-leaf" fillOpacity="0.35" x="38" y="58" width="36" height="26" rx="3" strokeWidth="1.6" />
      <text x="56" y="76" textAnchor="middle" className="fill-ink font-mono" stroke="none" fontSize="11" fontWeight="700">
        5L
      </text>
      <circle className="vx-bubble text-leaf-deep" fill="#bfe3b2" style={dl(0)} cx="94" cy="80" r="4" strokeWidth="1.4" />
      <circle className="vx-bubble text-slate" fill={LAVENDER} style={dl(0.8)} cx="98" cy="66" r="3.2" strokeWidth="1.4" />
      <circle className="vx-bubble text-slate" fill={PINK} style={dl(1.6)} cx="90" cy="56" r="3.6" strokeWidth="1.4" />
    </>
  ),
  disinfect: (
    <>
      <path className="vx-line fill-navy" d="M50 30 h20 v10 h-20 Z" />
      <rect className="vx-line fill-white" x="42" y="40" width="36" height="54" rx="8" />
      <path className="vx-line fill-leaf" d="M60 52 l12 4 v8 c0 8 -6 12 -12 14 c-6 -2 -12 -6 -12 -14 v-8 Z" />
      <path className="vx-line text-white" d="M60 58 v12 M54 64 h12" strokeWidth="2.4" />
      <g className="text-leaf-deep">
        {[0, 0.5, 1].map((delay, i) => (
          <circle key={i} className="vx-puff fill-leaf-soft" style={dl(delay)} cx={92 + i * 4} cy={44 + i * 8} r={3 + i} strokeWidth="1.4" />
        ))}
      </g>
    </>
  ),
  heavy: (
    <>
      <rect className="vx-line fill-navy" x="52" y="30" width="16" height="10" rx="2" />
      <path className="vx-line fill-white" d="M44 40 h32 v50 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 Z" />
      <path className="vx-line fill-leaf" d="M60 52 l13 13 l-13 13 l-13 -13 Z" />
      <path className="vx-line text-white" d="M60 58 v9 M60 72 v0.5" strokeWidth="2.8" />
      <g className="text-slate">
        {[0, 0.6, 1.2].map((delay, i) => (
          <circle key={i} className="vx-puff fill-mist" style={dl(delay)} cx={30 - i * 4} cy={56 + i * 8} r={3 + i} strokeWidth="1.4" />
        ))}
      </g>
      <Spark x={92} y={40} s={0.8} delay={0.5} />
    </>
  ),

  /* ── Cleaning tools ── */
  mop: (
    <>
      <g className="vx-sweep">
        <path className="vx-line" d="M60 16 V78" strokeWidth="3.2" />
        <rect className="vx-line fill-navy" x="34" y="76" width="52" height="6" rx="2" />
        <path className="vx-line fill-white" d="M30 82 h60 v8 h-60 Z" />
        <path className="vx-line text-slate" d="M34 90 v5 M42 90 v5 M50 90 v5 M58 90 v5 M66 90 v5 M74 90 v5 M82 90 v5" strokeWidth="1.4" />
      </g>
      <g className="text-slate">
        {[0, 0.5, 1].map((delay, i) => (
          <circle key={i} className="vx-dust fill-mist" style={dl(delay)} cx={92 + i * 5} cy={92 - i * 4} r={2.4 - i * 0.4} strokeWidth="1.2" />
        ))}
      </g>
    </>
  ),
  bucket: (
    <>
      <g className="vx-wave">
        <path className="vx-line" d="M48 62 l-10 -42" strokeWidth="3" />
      </g>
      <path className="vx-line" fill={SKY} d="M28 56 h64 l-6 34 h-52 Z" />
      <path className="vx-line text-white" d="M34 64 q6 -3 12 0 t12 0 t12 0 t12 0" strokeWidth="2" />
      <path className="vx-line fill-leaf" d="M64 44 h22 v14 h-22 Z" />
      <circle className="vx-line fill-navy" cx="38" cy="94" r="4" />
      <circle className="vx-line fill-navy" cx="82" cy="94" r="4" />
      <Bubble x={100} y={62} r={3} delay={0.3} />
      <Bubble x={20} y={60} r={2.4} delay={1.3} />
    </>
  ),
  sponge: (
    <>
      <g className="vx-press">
        <path className="vx-line" fill={SUN} d="M28 56 h64 v18 h-64 Z" />
        <path className="vx-line fill-leaf" d="M28 74 h64 v12 h-64 Z" />
        <g fill={KRAFT_DEEP} stroke="none">
          <circle cx="38" cy="64" r="1.8" />
          <circle cx="52" cy="62" r="1.4" />
          <circle cx="66" cy="66" r="1.8" />
          <circle cx="80" cy="62" r="1.4" />
        </g>
      </g>
      <Bubble x={34} y={46} r={3.6} delay={0} />
      <Bubble x={60} y={42} r={2.6} delay={0.9} />
      <Bubble x={86} y={46} r={3} delay={1.7} />
    </>
  ),
  'pedal-bin': (
    <>
      <g className="vx-clam">
        <path className="vx-line fill-navy" d="M34 52 h52 c0 -8 -4 -10 -26 -10 c-22 0 -26 2 -26 10 Z" />
      </g>
      <path className="vx-line fill-white" d="M36 52 h48 l-4 40 h-40 Z" />
      <path className="vx-line text-line" d="M48 60 v26 M60 60 v26 M72 60 v26" strokeWidth="1.4" />
      <path className="vx-line text-leaf" d="M50 94 h20" strokeWidth="4" />
      <Spark x={96} y={40} s={0.8} delay={0.7} />
    </>
  ),
  squeegee: (
    <>
      <rect className="vx-line" fill={SKY} fillOpacity="0.6" x="22" y="28" width="76" height="62" rx="4" />
      <path className="vx-line text-white" d="M30 40 l12 -6 M30 50 l20 -10" strokeWidth="2.4" />
      <g className="vx-wave">
        <path className="vx-line" d="M60 98 v-34" strokeWidth="3.4" />
        <rect className="vx-line fill-navy" x="38" y="58" width="44" height="7" rx="2" />
        <path className="vx-line text-leaf" d="M38 58 h44" strokeWidth="3" />
      </g>
      <Spark x={86} y={40} s={0.9} delay={0.3} />
    </>
  ),

  /* ── PPE & cutlery ── */
  'glove-vinyl': <Glove fill="var(--color-navy)" />,
  'glove-latex': <Glove fill="#fbf3e4" />,
  'glove-nitrile': <Glove fill={NITRILE} cuff="fill-navy" />,
  hairnet: (
    <>
      <g className="vx-float">
        <path className="vx-line fill-white" d="M30 56 c0 -24 60 -24 60 0 Z" />
        <path className="vx-line text-line" d="M40 46 l10 10 M50 40 l14 16 M62 38 l16 18 M40 54 l12 -14 M52 56 l16 -18 M66 56 l14 -14" strokeWidth="1.2" />
        <path className="vx-line text-leaf" d="M28 56 h64" strokeWidth="3" />
      </g>
      <path className="vx-line" d="M40 72 c-8 0 -8 10 0 10 M80 72 c8 0 8 10 0 10" strokeWidth="1.6" />
      <path className="vx-line" fill={SKY} d="M40 68 h40 v14 c0 6 -8 12 -20 12 c-12 0 -20 -6 -20 -12 Z" />
      <path className="vx-line text-white" d="M42 74 h36 M42 80 h36" strokeWidth="1.4" />
    </>
  ),
  cutlery: (
    <>
      <g className="vx-float">
        <g transform="rotate(-18 60 60)">
          <path className="vx-line" d="M50 20 v18 M46 20 v14 M54 20 v14 M46 34 c0 6 8 6 8 0 M50 38 v58" strokeWidth="2.6" />
        </g>
      </g>
      <g className="vx-float" style={dl(0.8)}>
        <g transform="rotate(18 60 60)">
          <ellipse className="vx-line fill-white" cx="70" cy="30" rx="7" ry="10" />
          <path className="vx-line" d="M70 40 v56" strokeWidth="2.6" />
        </g>
      </g>
      <path className="vx-line text-leaf" d="M28 96 l64 -4" strokeWidth="2" />
      <Spark x={96} y={36} s={0.8} delay={0.5} />
    </>
  ),

  /* ── Foam & plates ── */
  plate: (
    <>
      <ellipse className="vx-line fill-white" cx="60" cy="88" rx="38" ry="8" />
      <ellipse className="vx-line fill-white" cx="60" cy="81" rx="38" ry="8" />
      <g className="vx-hover">
        <ellipse className="vx-line fill-white" cx="60" cy="66" rx="38" ry="10" />
        <ellipse className="vx-line text-line" cx="60" cy="66" rx="24" ry="6" strokeWidth="1.6" />
        <path className="vx-line fill-leaf" d="M56 62 c0 -6 6 -8 10 -6 c0 6 -4 8 -10 6 Z" strokeWidth="1.4" />
      </g>
      <Spark x={98} y={44} s={0.8} delay={0.6} />
    </>
  ),
  tray: (
    <>
      <Steam x={40} y={42} />
      <rect className="vx-line fill-white" x="20" y="48" width="80" height="44" rx="6" />
      <path className="vx-line text-line" d="M58 52 v36 M62 70 h34 M80 52 v18" strokeWidth="1.8" />
      <circle className="vx-line" fill={KRAFT} cx="39" cy="70" r="11" strokeWidth="1.8" />
      <circle className="vx-line fill-leaf" cx="69" cy="61" r="5" strokeWidth="1.6" />
      <circle className="vx-line" fill={KRAFT_DEEP} cx="88" cy="61" r="4" strokeWidth="1.6" />
      <path className="vx-line text-leaf" d="M68 81 q6 -4 12 0 t12 0" strokeWidth="2" />
    </>
  ),
  'foam-bowl': (
    <>
      <Steam x={46} y={46} />
      <path className="vx-line fill-white" d="M22 62 h48 c0 16 -10 26 -24 26 c-14 0 -24 -10 -24 -26 Z" />
      <ellipse className="vx-line" fill={KRAFT} cx="46" cy="62" rx="24" ry="5" />
      <g className="vx-float" style={dl(0.6)}>
        <path className="vx-line fill-white" d="M76 54 h24 l-3 36 h-18 Z" />
        <path className="vx-line text-leaf" d="M77 62 h22" strokeWidth="2" />
      </g>
      <g className="fill-mist" stroke="none">
        <circle cx="36" cy="74" r="1.6" />
        <circle cx="46" cy="78" r="1.6" />
        <circle cx="56" cy="74" r="1.6" />
      </g>
    </>
  ),

  /* ── Ordering details ── */
  'product-box': (
    <>
      <g className="vx-hover">
        <path className="vx-line" fill={KRAFT_DEEP} d="M30 50 l30 -14 l30 14 l-30 14 Z" />
      </g>
      <path className="vx-line" fill={KRAFT} d="M30 50 v34 l30 12 v-32 Z" />
      <path className="vx-line" fill={KRAFT_DEEP} d="M90 50 v34 l-30 12 v-32 Z" />
      <path className="vx-line text-leaf" d="M45 43 l30 14 v10" strokeWidth="3" />
      <Spark x={100} y={34} s={0.8} delay={0.4} />
    </>
  ),
  bundle: (
    <>
      <rect className="vx-line fill-white" x="28" y="66" width="64" height="12" rx="3" />
      <rect className="vx-line fill-white" x="28" y="54" width="64" height="12" rx="3" />
      <g className="vx-hover">
        <rect className="vx-line fill-white" x="28" y="42" width="64" height="12" rx="3" />
      </g>
      <rect className="vx-line fill-white" x="28" y="78" width="64" height="12" rx="3" />
      <path className="vx-line text-leaf" d="M60 38 v56" strokeWidth="5" />
      <path className="vx-line fill-leaf" d="M60 38 c-8 -10 -16 -4 -10 2 Z M60 38 c8 -10 16 -4 10 2 Z" strokeWidth="1.6" />
      <Spark x={100} y={50} s={0.7} delay={0.6} />
    </>
  ),
  cartons: (
    <>
      <rect className="vx-line" fill={KRAFT} x="22" y="70" width="38" height="24" rx="2" />
      <rect className="vx-line" fill={KRAFT} x="60" y="70" width="38" height="24" rx="2" />
      <g className="vx-hover">
        <rect className="vx-line" fill={KRAFT_DEEP} x="41" y="46" width="38" height="24" rx="2" />
        <path className="vx-line text-leaf" d="M60 46 v8" strokeWidth="2.4" />
      </g>
      <path className="vx-line text-leaf" d="M41 70 v8 M79 70 v8" strokeWidth="2.4" />
      <circle className="vx-line fill-leaf" cx="96" cy="40" r="11" />
      <text x="96" y="44" textAnchor="middle" className="fill-white font-mono" stroke="none" fontSize="10" fontWeight="700">
        ×3
      </text>
    </>
  ),
  calendar: (
    <>
      <rect className="vx-line fill-white" x="26" y="36" width="68" height="58" rx="7" />
      <path className="vx-line fill-navy" d="M26 43 a7 7 0 0 1 7 -7 h54 a7 7 0 0 1 7 7 v9 h-68 Z" />
      <path className="vx-line" d="M42 30 v12 M78 30 v12" strokeWidth="3" />
      <g className="fill-mist" stroke="none">
        <circle cx="40" cy="64" r="3" />
        <circle cx="53" cy="64" r="3" />
        <circle cx="67" cy="64" r="3" />
        <circle cx="40" cy="80" r="3" />
        <circle cx="53" cy="80" r="3" />
        <circle cx="80" cy="64" r="3" />
      </g>
      <g className="vx-hover">
        <circle className="vx-line fill-leaf" cx="73" cy="80" r="8" strokeWidth="1.8" />
        <path className="vx-line text-white" d="M69 80 l3 3 l5 -6" strokeWidth="2" />
      </g>
    </>
  ),
  pin: (
    <>
      <ellipse className="vx-line fill-mist" cx="60" cy="94" rx="20" ry="5" strokeWidth="1.6" />
      <g className="vx-hover">
        <path className="vx-line fill-leaf" d="M60 92 C46 74 38 64 38 52 a22 22 0 0 1 44 0 C82 64 74 74 60 92 Z" />
        <circle className="vx-line fill-white" cx="60" cy="52" r="8" />
      </g>
      <Spark x={94} y={36} s={0.8} delay={0.5} />
    </>
  ),
  phone: (
    <>
      <g className="vx-hover">
        <rect className="vx-line fill-navy" x="40" y="28" width="40" height="68" rx="8" />
        <rect className="vx-line" fill={SKY} x="45" y="36" width="30" height="46" rx="3" strokeWidth="1.6" />
        <circle className="vx-line fill-leaf" cx="60" cy="89" r="3" strokeWidth="1.4" />
        <path className="vx-line text-leaf" d="M51 52 h18 M51 60 h12" strokeWidth="2.2" />
      </g>
      <path className="vx-line text-leaf" d="M88 42 a10 10 0 0 1 0 16 M94 36 a18 18 0 0 1 0 28" strokeWidth="2.2" />
      <Spark x={26} y={40} s={0.7} delay={0.7} />
    </>
  ),
} satisfies Record<string, ReactNode>

export type ArtKey = keyof typeof ART
export type ItemKey = ArtKey | TissueKey | `cat:${VectorKey}`

const TISSUE: TissueKey[] = ['maxi', 'interfold', 'toilet', 'napkin', 'facial']

export function ItemVector({ name, className = '', delay = 0 }: { name: ItemKey; className?: string; delay?: number }) {
  if (name.startsWith('cat:')) return <CategoryVector name={name.slice(4) as VectorKey} className={className} delay={delay} />
  if ((TISSUE as string[]).includes(name)) return <TissueVector name={name as TissueKey} className={className} delay={delay} />
  return (
    <VectorSvg className={className} delay={delay}>
      {ART[name as ArtKey]}
    </VectorSvg>
  )
}
