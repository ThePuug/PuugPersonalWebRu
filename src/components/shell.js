import Providers from '@/components/providers'

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
    <html lang={locale}>
      <body>
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet" />
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  )
}
