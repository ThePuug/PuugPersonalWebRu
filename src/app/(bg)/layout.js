import Shell, { sharedMetadata, sharedViewport } from '@/components/shell'
export const metadata = sharedMetadata
export const viewport = sharedViewport
export default function RootLayout({ children }) {
  return <Shell locale="bg">{children}</Shell>
}
