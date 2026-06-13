import { Playfair_Display, Lora } from 'next/font/google'
import Providers from '@/components/providers'

// Self-hosted at build time with the Cyrillic subset so Bulgarian renders without
// a runtime request or FOUC. Exposed as CSS variables consumed by theme.js.
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-playfair' })
const lora = Lora({ subsets: ['latin', 'cyrillic'], style: ['normal', 'italic'], display: 'swap', variable: '--font-lora' })

export const sharedMetadata = {
  title: 'Regain Us',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon-32x32.png', type: 'image/png' }],
    apple: [48, 72, 96, 144, 192, 256, 384, 512].map(s => ({ url: `/icons/icon-${s}x${s}.png`, sizes: `${s}x${s}` })),
  },
}
export const sharedViewport = { width: 'device-width', initialScale: 1, minimumScale: 1 }

export default function Shell({ locale, children }) {
  return (
    <html lang={locale} className={`${playfair.variable} ${lora.variable}`}>
      <body>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  )
}
