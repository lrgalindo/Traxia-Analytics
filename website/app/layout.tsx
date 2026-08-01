import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s | Traxia Analytics',
    default: 'Traxia Analytics — AI-Native Spatial Intelligence',
  },
  description: 'Traxia Analytics transforma cámaras CCTV existentes en inteligencia operacional en tiempo real. Analítica espacial B2B para retail, logística, banca, manufactura, hospitales y concesionarias.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md text-body-md bg-background text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
