import type { Metadata, Viewport } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" })
const notoMono = Noto_Sans_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: 'Ayesha Siddiqa (R.A) Girls Madrasah & Educational Welfare Trust',
  description: 'School Management System - Student, Teacher, Financial & Administrative Management',
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoMono.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
