import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { fontHeading, fontMono, fontSans } from '@/lib/fonts'
import { ThemeProvider } from '@/components/layouts/providers'
import { Toaster } from '@/components/ui/toaster'

import '@/styles/globals.css'
import { env } from '@/env'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: 'Budget Tracker',
  description: 'CodeWithKliton',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <ClerkProvider>
        <html lang='en' suppressHydrationWarning>
          <head />
          <body
            className={cn(
              'min-h-screen bg-background font-sans antialiased',
              fontSans.variable,
              fontMono.variable,
              fontHeading.variable
            )}
          >
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              {/* <TailwindIndicator />
              <Analytics /> */}
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  )
}
