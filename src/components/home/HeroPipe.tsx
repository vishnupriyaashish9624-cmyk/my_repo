/**
 * Glass pipe running down the hero's left gutter (traced from the marked curve). It draws itself in
 * on load, bubbles of soapy water stream down inside it, and drips fall from the nozzle at the end.
 * Lives in the gutter beside the content column so it never crosses the headline; wide screens only.
 * Strokes don't scale, so the pipe keeps its thickness however tall the hero is.
 */
const PIPE =
  'M-20 40 C30 34 80 30 105 50 C135 75 138 130 125 180 C112 230 100 270 115 320 C130 370 145 400 140 460 C135 520 115 580 108 650 C102 720 104 790 108 860'

const line = { fill: 'none', vectorEffect: 'non-scaling-stroke', strokeLinecap: 'round', pathLength: 100 } as const

export default function HeroPipe() {
  return (
    <div
      aria-hidden
      className="hero-pipe pointer-events-none absolute inset-y-0 start-0 hidden w-[calc((100vw-1260px)/2+20px)] max-w-[200px] min-[1360px]:block"
    >
      <svg viewBox="0 0 200 1000" preserveAspectRatio="none" className="pipe-draw h-full w-full overflow-visible">
        <g>
          {/* Soft shadow, then the glass tube: outline, tinted glass, water core, highlight */}
          <path d={PIPE} {...line} stroke="var(--color-navy)" strokeOpacity="0.12" strokeWidth="40" className="blur-[6px]" />
          <path d={PIPE} {...line} stroke="var(--color-navy)" strokeWidth="26" />
          <path d={PIPE} {...line} stroke="#d6e4f7" strokeWidth="21" />
          <path d={PIPE} {...line} stroke="#b9d0f0" strokeWidth="11" />
          {/* Bubbles streaming down the pipe at two speeds */}
          <path d={PIPE} {...line} className="pipe-flow" stroke="var(--color-navy)" strokeOpacity="0.35" strokeWidth="9" strokeDasharray="0.01 6" />
          <path d={PIPE} {...line} className="pipe-flow" stroke="white" strokeWidth="6.5" strokeDasharray="0.01 6" />
          <path d={PIPE} {...line} className="pipe-flow-slow" stroke="white" strokeOpacity="0.85" strokeWidth="4" strokeDasharray="0.01 4.3" />
          <path d={PIPE} {...line} stroke="white" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="0 2 30 4" />
          {/* Couplings: navy collars with a thin leaf ring */}
          <path d={PIPE} {...line} strokeLinecap="butt" stroke="var(--color-navy)" strokeWidth="34" strokeDasharray="1.4 23.6" strokeDashoffset="-12" />
          <path d={PIPE} {...line} strokeLinecap="butt" stroke="var(--color-leaf)" strokeWidth="35" strokeDasharray="0.35 24.65" strokeDashoffset="-12.5" />
        </g>
      </svg>

      {/* Nozzle at the end of the pipe, with drips */}
      <div className="hero-pipe-nozzle absolute start-[54%] top-[86%] w-12">
        <svg viewBox="0 0 48 90" className="w-full overflow-visible">
          <rect x="11" y="0" width="26" height="12" rx="3" fill="var(--color-navy)" />
          <rect x="10" y="10" width="28" height="4" rx="2" fill="var(--color-leaf)" />
          <path d="M15 14 h18 l-3 12 h-12 Z" fill="var(--color-navy)" />
          {[0, 0.6, 1.2].map((d) => (
            <path
              key={d}
              className="pipe-drip"
              style={{ animationDelay: `${2.4 + d}s` }}
              d="M24 30 c0 0 -5 6 -5 9.5 a5 5 0 0 0 10 0 c0 -3.5 -5 -9.5 -5 -9.5 Z"
              fill="#b9d0f0"
              stroke="var(--color-navy)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
