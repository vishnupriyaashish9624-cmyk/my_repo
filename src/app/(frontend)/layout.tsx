import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Figtree, IBM_Plex_Mono } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import './globals.css'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' })

const title = 'Klen Plus · Food packaging, tissue & cleaning supplies'
const description =
  'Klen Plus supplies foil and takeaway containers, cups, bags, tissue, cleaning chemicals and gloves by the carton for restaurants, cafés, hotels and facility teams.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title,
  description,
  openGraph: {
    type: 'website',
    siteName: 'Klen Plus',
    title,
    description,
    images: [{ url: '/media/social/og.jpg', width: 1200, height: 630, alt: 'Klen Plus packaging and hygiene supplies' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/media/social/og.jpg'] },
}

export const viewport: Viewport = { themeColor: '#f5f7fa', width: 'device-width', initialScale: 1 }

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable} ${plexMono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
