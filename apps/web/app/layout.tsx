import 'tailwind-config/load.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KideAppBot',
  description: 'Ticket bot for Kide.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`h-full ${inter.className}`}>{children}</body>
    </html>
  )
}
