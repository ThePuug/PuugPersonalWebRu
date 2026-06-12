import Shell, { sharedMetadata, sharedViewport } from '@/components/shell'
export const metadata = sharedMetadata
export const viewport = sharedViewport
export const dynamicParams = false
export function generateStaticParams() { return [{ locale: 'bg' }, { locale: 'en' }] }
export default async function RootLayout({ children, params }) {
  const { locale } = await params
  return <Shell locale={locale}>{children}</Shell>
}
