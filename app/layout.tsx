import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vietnam Ultra Marathon Athletes - ITRA',
  description: 'a web application that displays information about trail running athletes, specifically those who are part of the International Trail Running Association (ITRA)',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
