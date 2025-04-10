import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IP Search - Géolocalisation par IP',
  description: 'Application de géolocalisation par adresse IP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
