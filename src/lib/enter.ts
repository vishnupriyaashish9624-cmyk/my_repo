import { gsap } from 'gsap'

const NEUTRAL: gsap.TweenVars = {
  x: 0,
  y: 0,
  xPercent: 0,
  yPercent: 0,
  opacity: 1,
  scale: 1,
  rotate: 0,
}

/**
 * Staggered entrance inside a timeline that starts from `from` on every target.
 *
 * A staggered `from`/`fromTo` only applies its starting values to the first target until the stagger
 * reaches the others, so scroll-driven sections showed most of their content before it "entered".
 * Setting the start state explicitly, then tweening back to neutral, avoids that.
 */
export function enter(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  from: gsap.TweenVars,
  to: gsap.TweenVars = {},
  position?: gsap.Position,
) {
  gsap.set(targets, from)
  const end: gsap.TweenVars = {}
  for (const key of Object.keys(from)) if (key in NEUTRAL) end[key] = NEUTRAL[key]
  return tl.to(targets, { ...end, ...to }, position)
}
