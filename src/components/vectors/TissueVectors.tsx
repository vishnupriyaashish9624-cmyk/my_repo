'use client'

import { Bubble, CategoryVector, Spark, Steam, VectorSvg } from './CategoryVector'

/**
 * Line vectors for each tissue type and where it is used. Same drawing language as CategoryVector:
 * strokes trace in inside a VectorScene, then a small loop (sheet unrolls, napkins float, steam rises).
 */

export type TissueKey = 'maxi' | 'interfold' | 'toilet' | 'napkin' | 'facial'
export type UseKey = 'kitchen' | 'washroom' | 'table' | 'catering' | 'delivery' | 'counter' | 'storeroom' | 'floor' | 'cafe'

export const tissueKeyFor = (label: string): TissueKey => {
  const l = label.toLowerCase()
  if (l.includes('maxi')) return 'maxi'
  if (l.includes('interfold')) return 'interfold'
  if (l.includes('toilet')) return 'toilet'
  if (l.includes('napkin')) return 'napkin'
  return 'facial'
}

function TissueArt({ name }: { name: Exclude<TissueKey, 'facial'> }) {
  switch (name) {
    case 'maxi':
      return (
        <>
          {/* Centre-pull roll standing up, sheet feeding out the bottom */}
          <g className="vx-unroll">
            <path className="vx-line fill-white" d="M52 84 h16 v14 l-4 -2 -4 2 -4 -2 -4 2 Z" />
          </g>
          <path className="vx-line fill-white" d="M36 30 v52 a24 7 0 0 0 48 0 v-52" />
          <ellipse className="vx-line fill-white" cx="60" cy="30" rx="24" ry="7" />
          <ellipse className="vx-line fill-mist" cx="60" cy="30" rx="7" ry="2.4" />
          <path className="vx-line text-leaf" d="M36 50 a24 7 0 0 0 48 0" strokeWidth="2" />
          <path className="vx-line text-line" d="M36 62 a24 7 0 0 0 48 0" strokeWidth="1.4" />
          <Spark x={96} y={40} s={0.9} delay={0.3} />
        </>
      )
    case 'interfold':
      return (
        <>
          {/* Z-folded stack, the top sheet pops up for the next pull */}
          <g className="vx-wave">
            <path className="vx-line fill-white" d="M44 66 L49 40 L60 47 L71 38 L76 66 Z" />
            <path className="vx-line text-line" d="M60 47 V64" strokeWidth="1.4" />
          </g>
          <rect className="vx-line fill-white" x="26" y="64" width="68" height="30" rx="4" />
          <path className="vx-line text-line" d="M30 72 h60 M30 79 h60 M30 86 h60" strokeWidth="1.4" />
          <path className="vx-line text-leaf" d="M22 70 l4 -6 M22 70 l4 6 M22 82 l4 -6 M22 82 l4 6" strokeWidth="1.8" />
          <Spark x={92} y={44} s={0.8} delay={1.1} />
        </>
      )
    case 'toilet':
      return (
        <>
          {/* Roll on a holder arm, a perforated sheet swinging below */}
          <path className="vx-line" d="M40 50 h-14 v-18" strokeWidth="2.8" />
          <g className="vx-sway">
            <path className="vx-line fill-white" d="M56 62 h26 v34 l-4 -2 -5 2 -4 -2 -5 2 -4 -2 -4 2 Z" />
            <path className="text-slate" d="M58 74 h22 M58 86 h22" strokeDasharray="2 3" strokeWidth="1.4" />
          </g>
          <path className="vx-line fill-white" d="M40 36 h42 a8 14 0 0 1 0 28 h-42" />
          <ellipse className="vx-line fill-white" cx="40" cy="50" rx="8" ry="14" />
          <ellipse className="vx-line fill-mist" cx="40" cy="50" rx="3" ry="5" />
          <path className="vx-line text-leaf" d="M58 36 v28" strokeWidth="1.8" />
          <Spark x={98} y={40} s={0.7} delay={0.6} />
        </>
      )
    case 'napkin':
      return (
        <>
          {/* White and black napkins, folded, floating out of step */}
          <g className="vx-float" style={{ '--d': '0.7s' } as React.CSSProperties}>
            <path className="vx-line fill-navy" d="M52 40 L74 26 L96 40 L74 72 Z" />
            <path className="vx-line text-white" d="M56 42 L74 50 L92 42 M74 50 V68" strokeWidth="1.4" />
          </g>
          <g className="vx-float">
            <path className="vx-line fill-white" d="M24 56 L50 40 L76 56 L50 94 Z" />
            <path className="vx-line text-line" d="M24 56 L50 66 L76 56 M50 66 V94" strokeWidth="1.6" />
            <path className="vx-line fill-leaf" d="M50 40 L57 45 L50 50 L43 45 Z" strokeWidth="1.6" />
          </g>
        </>
      )
  }
}

export function TissueVector({ name, className = '', delay = 0 }: { name: TissueKey; className?: string; delay?: number }) {
  if (name === 'facial') return <CategoryVector name="tissue" className={className} delay={delay} />
  return (
    <VectorSvg className={className} delay={delay}>
      <TissueArt name={name} />
    </VectorSvg>
  )
}

export function UseVector({ name, className = '', delay = 0 }: { name: UseKey; className?: string; delay?: number }) {
  if (name === 'cafe') return <CategoryVector name="cups" className={className} delay={delay} />
  return (
    <VectorSvg className={className} delay={delay}>
      {name === 'kitchen' && (
        <>
          <Steam x={60} y={52} />
          <path className="vx-line fill-white" d="M34 62 h52 v20 a8 8 0 0 1 -8 8 h-36 a8 8 0 0 1 -8 -8 Z" />
          <path className="vx-line" d="M28 62 h64 M34 68 h-8 M86 68 h8" />
          <path className="vx-line text-leaf" d="M44 76 h32" strokeWidth="2" />
        </>
      )}
      {name === 'washroom' && (
        <>
          <rect className="vx-line fill-navy" x="26" y="34" width="12" height="16" rx="3" />
          <path className="vx-line" d="M38 42 h26 a8 8 0 0 1 8 8 v8" strokeWidth="3" />
          <path className="vx-drip fill-leaf" d="M72 64 c0 0 -4 5 -4 8 a4 4 0 0 0 8 0 c0 -3 -4 -8 -4 -8 Z" />
          <path className="vx-line fill-white" d="M40 84 h56 a6 6 0 0 1 -6 8 h-44 a6 6 0 0 1 -6 -8 Z" />
          <Bubble x={34} y={76} r={3} delay={0.4} />
          <Bubble x={28} y={66} r={2} delay={1.4} />
        </>
      )}
      {name === 'table' && (
        <>
          <g className="vx-float">
            <circle className="vx-line fill-white" cx="60" cy="64" r="24" />
            <circle className="vx-line text-line" cx="60" cy="64" r="15" strokeWidth="1.6" />
            <path className="vx-line fill-leaf" d="M54 58 L60 54 L66 58 L60 72 Z" strokeWidth="1.4" />
          </g>
          <path className="vx-line" d="M26 46 v12 M22 46 v8 M30 46 v8 M22 54 c0 5 8 5 8 0 M26 58 v28" strokeWidth="2.2" />
          <path className="vx-line" d="M94 46 c-6 6 -6 16 0 20 v20" strokeWidth="2.2" />
          <Spark x={88} y={34} s={0.7} delay={0.9} />
        </>
      )}
      {name === 'catering' && (
        <>
          <g className="vx-hover">
            <path className="vx-line" fill="#dfe6ee" d="M28 74 a32 30 0 0 1 64 0 Z" />
            <circle className="vx-line fill-navy" cx="60" cy="42" r="4" />
            <path className="vx-shine text-white" d="M44 56 l-4 12" strokeWidth="4" />
          </g>
          <path className="vx-line" d="M20 78 h80" strokeWidth="3" />
          <path className="vx-line text-leaf" d="M30 84 h60" strokeWidth="2" />
          <Spark x={98} y={40} s={0.8} delay={0.5} />
        </>
      )}
      {name === 'delivery' && (
        <>
          <g className="vx-stretch">
            <path className="vx-line text-slate" d="M20 54 h14 M16 66 h18 M22 78 h12" strokeWidth="2.4" />
          </g>
          <g className="vx-float">
            <rect className="vx-line" fill="#e7c99b" x="42" y="44" width="44" height="42" rx="4" />
            <path className="vx-line text-leaf" d="M42 58 h44" strokeWidth="3" />
            <path className="vx-line" d="M56 44 c0 -10 16 -10 16 0" strokeWidth="2.4" />
          </g>
        </>
      )}
      {name === 'counter' && (
        <>
          <g className="vx-unroll">
            <path className="vx-line fill-white" d="M48 58 V28 h24 v30" />
            <path className="vx-line text-line" d="M52 36 h16 M52 42 h10 M52 48 h16" strokeWidth="1.6" />
          </g>
          <rect className="vx-line fill-navy" x="32" y="56" width="56" height="36" rx="6" />
          <rect className="vx-line" fill="#d6e4f7" x="40" y="62" width="40" height="12" rx="2" />
          <path className="vx-line text-white" d="M42 82 h4 M52 82 h4 M62 82 h4 M72 82 h4" strokeWidth="2.4" />
        </>
      )}
      {name === 'storeroom' && (
        <>
          <rect className="vx-line" fill="#e7c99b" x="24" y="64" width="36" height="28" rx="2" />
          <rect className="vx-line" fill="#e7c99b" x="60" y="64" width="36" height="28" rx="2" />
          <path className="vx-line" d="M42 64 v10 M78 64 v10" strokeWidth="1.6" />
          <g className="vx-hover">
            <rect className="vx-line" fill="#d4ac72" x="42" y="36" width="36" height="28" rx="2" />
            <path className="vx-line text-leaf" d="M60 36 v12" strokeWidth="2.4" />
          </g>
        </>
      )}
      {name === 'floor' && (
        <>
          <g className="vx-wave">
            <path className="vx-line" fill="#f5d36b" d="M52 28 h16 l12 62 h-40 Z" />
            <path className="vx-line" d="M60 50 l8 14 h-16 Z" strokeWidth="2" />
            <path className="vx-line" d="M60 55 v4" strokeWidth="2" />
          </g>
          <path className="vx-line text-line" d="M18 94 h84" />
          <Spark x={28} y={80} s={0.8} delay={0.2} />
          <Spark x={94} y={70} s={0.7} delay={1.1} />
        </>
      )}
    </VectorSvg>
  )
}
