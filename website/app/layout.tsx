import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s | Traxia Analytics',
    default: 'Traxia Analytics — AI Espacial para Operaciones B2B',
  },
  description: 'Traxia convierte tu infraestructura CCTV existente en inteligencia operacional en tiempo real. Sin hardware nuevo. Sin biometría. Edge AI para retail, logística, banca, manufactura, hospitales y concesionarias.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Nav />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
