import './globals.css'
import { Inter } from 'next/font/google'
import { TopNav } from '@/components/TopNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bhasha Bandhu',
  description: 'Create and manage multilingual blog posts with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-100 text-gray-900 antialiased">
        <TopNav />
        <div className="min-h-screen pt-16">
          {children}
        </div>
      </body>
    </html>
  )
}

