import type { MediaAsset } from '@/lib/media'

type Props = {
  asset?: MediaAsset
  /** Slot name shown on the placeholder in development, e.g. "categories/tissue". */
  slot: string
  alt: string
  className?: string
  eager?: boolean
}

/** Renders a slot's loop video (preferred) or still, falling back to a quiet placeholder. */
export default function Media({ asset, slot, alt, className = '', eager }: Props) {
  if (asset?.video) {
    return (
      <video
        src={asset.video}
        poster={asset.image}
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        aria-label={alt}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  if (asset?.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset.image} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`h-full w-full object-cover ${className}`} />
  }
  return (
    <div role="img" aria-label={alt} className={`hatch relative h-full w-full bg-mist ${className}`}>
      {process.env.NODE_ENV === 'development' && (
        <span className="absolute left-3 top-3 rounded-md border border-dashed border-note-line bg-note px-2 py-1 font-mono text-[10.5px] text-note-ink">
          media/{slot}
        </span>
      )}
    </div>
  )
}
