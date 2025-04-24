import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { NotificationProvider } from './context/NotificationContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Backchannel',
  description: 'A platform for founders to anonymously rate and review VCs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className="h-full">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
          <Header />
          <main className="flex-1 w-full bg-gray-50 dark:bg-gray-950">
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}