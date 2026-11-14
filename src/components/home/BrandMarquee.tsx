export default function BrandMarquee({ brands }: { brands: string[] }) {
  if (!brands.length) return null
  return (
    <div id="brands" aria-label="Brands we stock" className="theme-dark overflow-hidden border-y border-white/10 py-7">
      <p className="label mx-auto mb-4 max-w-[1260px] px-5 !text-leaf md:px-10">Brands on the shelf</p>
      <p className="sr-only">{brands.join(', ')}</p>
      <div className="marquee flex w-max" aria-hidden>
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="flex items-center gap-11 px-5 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-white/45">
            {b}
            <span className="font-bold text-leaf">+</span>
          </span>
        ))}
      </div>
    </div>
  )
}
